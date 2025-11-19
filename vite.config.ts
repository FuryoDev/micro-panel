import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// IMPORTANT : Ceci permet de bypass CORS en dev.
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/scenes': {
        target: 'http://10.41.40.130:1234',
        changeOrigin: true,
        // /api/scenes → /scenes sur la machine Pixotope
        rewrite: (path) => path.replace(/^\/api\/scenes/, '/scenes'),
      },
    },
  },
})
