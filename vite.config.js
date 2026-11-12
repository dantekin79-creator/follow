import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served as a GitHub Pages project site at /follow/, so production assets
// need that base. Dev server keeps the root base.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/follow/' : '/',
  plugins: [react()],
  server: {
    host: true,
  },
}))
