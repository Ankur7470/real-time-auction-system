import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8000',  
  //       changeOrigin: true,
  //     },

  //     '/ws-auction': {
  //       target: 'http://localhost:8000',  
  //       ws: true,  
  //       changeOrigin: true,
  //       secure: false,  
  //     },
  //   }
  // }
})






