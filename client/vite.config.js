import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { // API proxy to avoid CORS issues
      '/api': 'http://localhost:3000', 
    },
  }
})
