import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // ✅ Updated to new IP
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/auth': {
        target: 'http://localhost:5000/api',  // ✅ Updated to new IP
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
})
