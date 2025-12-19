import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // This ensures assets load from mine.westartup.io/
  plugins: [react()],
})
