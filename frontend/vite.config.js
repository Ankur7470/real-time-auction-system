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

/* eslint-env node */

// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig(({ mode }) => {
//   // eslint-disable-next-line no-undef
//   const env = loadEnv(mode, process.cwd(), '')

//   return {
//     plugins: [react()],
//     define: {
//       global: 'globalThis',
//     },
//     server: {
//       proxy: {
//         '/api': {
//           target: env.VITE_API_BASE_URL, 
//           changeOrigin: true,
//         },
//         '/ws-auction': {
//           target: env.VITE_API_BASE_URL,
//           ws: true,
//           changeOrigin: true,
//           secure: false,
//         },
//       },
//     },
//   }
// })




