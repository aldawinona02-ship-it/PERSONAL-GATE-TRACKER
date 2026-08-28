import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/PERSONAL-GATE-TRACKER/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
