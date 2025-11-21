import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

function createProxyConfig(apiTarget: string, cameraTarget: string) {
  const sanitizedApiTarget = apiTarget.replace(/\/$/, '')
  const sanitizedCameraTarget = cameraTarget.replace(/\/$/, '')

  return {
    '/api': {
      target: sanitizedApiTarget,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ''),
    },
    '/camera': {
      target: sanitizedCameraTarget,
      changeOrigin: true,
      secure: false,
      rewrite: (path: string) => path.replace(/^\/camera/, ''),
      configure: (proxy) => {
        proxy.on('proxyRes', (proxyRes) => {
          delete proxyRes.headers['x-frame-options']
          delete proxyRes.headers['frame-options']
        })
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_PROXY_TARGET || env.VITE_API_BASE_URL || 'http://10.41.40.130:1234'
  const cameraTarget = env.VITE_CAMERA_TARGET || 'http://10.41.39.153'

  return {
    plugins: [vue()],
    server: {
      proxy: createProxyConfig(apiTarget, cameraTarget),
    },
    preview: {
      proxy: createProxyConfig(apiTarget, cameraTarget),
    },
  }
})
