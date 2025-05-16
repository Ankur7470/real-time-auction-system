import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Proxy API requests
        changeOrigin: true,
      },

      // Proxy WebSocket connections with SockJS support
      '/ws-auction': {
        target: 'http://localhost:8000',  
        ws: true,  
        changeOrigin: true,
        secure: false,  
      },
    }
  }
})


