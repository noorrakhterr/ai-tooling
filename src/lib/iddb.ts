import { createIddbClient } from '@iddb/client'

/**
 * Shared Okta App Platform database client. Reads/writes to `ai_tools` and
 * `gong_recordings` go through this — see README for the required
 * VITE_IDDB_ANON_KEY env var and local dev setup (falls back to a stub,
 * src/lib/iddb-client-stub.ts, when @iddb/client isn't installed).
 */
export const iddb = createIddbClient({
  tenant: 'ai-tools',
  key: import.meta.env.VITE_IDDB_ANON_KEY ?? '',
})
