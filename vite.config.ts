import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// OAP build cache bust — force a fresh copy of this file into the builder.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
