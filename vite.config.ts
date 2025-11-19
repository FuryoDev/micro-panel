import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// IMPORTANT : Ceci permet de bypass CORS en dev.
export default defineConfig({
  plugins: [vue()],
})
