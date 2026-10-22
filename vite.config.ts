import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Okta App Platform serves this app under a sub-path and injects
// VITE_BASE_URL at build time (see its generated Dockerfile). Setting
// `base` here ourselves means OAP's own vite.config.ts auto-patcher has
// nothing left to inject — that patcher renames this file to
// vite.config.original.ts and re-imports it, but the renamed file isn't
// present when the Docker COPY step runs, which breaks the build.
// TEMPORARY diagnostic: confirm which env vars are actually visible to the
// Vite config / build process, to settle whether IDDB_ANON_KEY (a
// platform-managed secret) reaches this stage at all, vs. only the
// documented build-env allowlist.
console.log('[env-probe] IDDB_ANON_KEY present:', typeof process.env.IDDB_ANON_KEY !== 'undefined')
console.log('[env-probe] all env keys:', Object.keys(process.env).sort().join(','))

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [react(), tailwindcss()],
})
