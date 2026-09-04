import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['.loca.lt'],
    proxy: {
      '/api/fast2sms': {
        target: 'https://www.fast2sms.com/dev/bulkV2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fast2sms/, '')
      }
    }
  }
})

