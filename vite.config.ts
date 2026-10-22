import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Okta App Platform serves this app under a sub-path and injects
// VITE_BASE_URL at build time (see its generated Dockerfile). Setting
// `base` here ourselves means OAP's own vite.config.ts auto-patcher has
// nothing left to inject — that patcher renames this file to
// vite.config.original.ts and re-imports it, but the renamed file isn't
// present when the Docker COPY step runs, which breaks the build.
export default defineConfig({
  // Force absolute paths regardless of what OAP injects for VITE_BASE_URL —
  // confirmed it's set to an empty string on deploy, not unset, so `|| '/'`
  // never kicks in and Vite defaults to relative paths. Relative asset URLs
  // break on any deep client-side route (e.g. /auth/callback), since the
  // browser resolves them against the current path, not the site root.
  base: '/',
  plugins: [react(), tailwindcss()],
})
