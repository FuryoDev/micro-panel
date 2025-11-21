import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/scenes': {
        target: 'http://10.41.40.130:1234',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scenes/, '/scenes'),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*'
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PATCH,PUT,DELETE,OPTIONS'
          })
        },
      },
    },
  },
})
