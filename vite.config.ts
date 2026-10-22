import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Okta App Platform serves this app under a sub-path and injects
// VITE_BASE_URL at build time (see its generated Dockerfile). Setting
// `base` here ourselves means OAP's own vite.config.ts auto-patcher has
// nothing left to inject — that patcher renames this file to
// vite.config.original.ts and re-imports it, but the renamed file isn't
// present when the Docker COPY step runs, which breaks the build.
//
// @iddb/client lives on OAP's private npm registry and isn't installed in
// local dev until the tenant's registry credentials are configured (see
// README). When it's missing, alias it to a local stub so `npm run dev`/
// `npm run build` still work; once the real package is installed (locally
// or in OAP's own build), this alias is a no-op.
const hasRealIddbClient = existsSync(
  fileURLToPath(new URL('./node_modules/@iddb/client', import.meta.url)),
)

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: hasRealIddbClient
      ? {}
      : {
          '@iddb/client': fileURLToPath(new URL('./src/lib/iddb-client-stub.ts', import.meta.url)),
        },
  },
})
