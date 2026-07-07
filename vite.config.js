import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the built site works both at the domain root and under
  // a subpath like https://<user>.github.io/irp-ai/
  base: "./",
})
