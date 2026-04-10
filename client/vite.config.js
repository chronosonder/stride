import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow access on local network
    watch: {
      usePolling: true, // docker polling for file changes
    },
  }
})
