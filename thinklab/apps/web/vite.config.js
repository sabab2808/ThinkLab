import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    // The word-search dictionary (~190k words) is intentionally its own
    // large, lazy-loaded chunk — see App.jsx's React.lazy() for that
    // route. This just quiets the default warning for that expected case.
    chunkSizeWarningLimit: 2200,
  },
})
