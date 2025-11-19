import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

function createProxyConfig(target: string) {
  const sanitizedTarget = target.replace(/\/$/, '')
  return {
    '/api': {
      target: sanitizedTarget,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ''),
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || env.VITE_API_BASE_URL || 'http://10.41.40.130:1234'

  return {
    plugins: [vue()],
    server: {
      proxy: createProxyConfig(proxyTarget),
    },
    preview: {
      proxy: createProxyConfig(proxyTarget),
    },
  }
})
