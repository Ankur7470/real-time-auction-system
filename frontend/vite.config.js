import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      global: 'globalThis',
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
        '/ws-auction': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      }
    }
  }
})
