// vite.config.js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Automatically imports Vuetify components
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'Api': path.resolve(__dirname, 'src/api'),
      'Plugins': path.resolve(__dirname, 'src/plugins'),
      'Views': path.resolve(__dirname, 'src/views'),
      'JS': path.resolve(__dirname, 'src/js'),
    }
  }
})
