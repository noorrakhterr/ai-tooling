/**
 * Node server for OAP — replaces the static-SPA runtime.
 *
 * Why this exists: the browser can never hold IDDB_ANON_KEY, because OAP
 * only injects it into a running container's process.env at runtime, not
 * into the Vite build (confirmed empirically — see git history around Oct
 * 2026). A real server process, unlike a static build, genuinely has that
 * env var available when it handles a request. So this server holds the
 * key and does the REST calls itself; the browser calls these same-origin
 * routes with no credential at all.
 */
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 8080
const ANON_KEY = process.env.IDDB_ANON_KEY

// The public api.platform.atko.ai host (used by the old browser-side client)
// isn't reachable from inside this container — confirmed via runtime logs
// (ConnectTimeoutError on every outbound call). IDDB_API_URL is the
// cluster-internal gateway this app's own pod is meant to call instead; it
// already has the tenant baked into its path (".../ai-tools"), so this just
// appends the same /rest/v1/<table> shape the public PostgREST endpoint uses.
const INTERNAL_API_BASE = process.env.IDDB_API_URL
const REST_BASE = INTERNAL_API_BASE
  ? `${INTERNAL_API_BASE}/rest/v1`
  : 'https://api.platform.atko.ai/ai-tools/rest/v1'

const app = express()
app.use(express.json())

async function restRequest(path, init = {}) {
  const response = await fetch(`${REST_BASE}${path}`, {
    ...init,
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...init.headers,
    },
  })
  const text = await response.text()
  const json = text ? JSON.parse(text) : null
  return { ok: response.ok, status: response.status, json }
}

function tableRoutes(tableName) {
  const router = express.Router()

  router.get('/', async (_req, res) => {
    const result = await restRequest(`/${tableName}?select=*`)
    if (!result.ok) return res.status(result.status).json({ error: result.json })
    res.json(result.json)
  })

  router.post('/', async (req, res) => {
    const result = await restRequest(`/${tableName}`, {
      method: 'POST',
      body: JSON.stringify(req.body),
    })
    if (!result.ok) return res.status(result.status).json({ error: result.json })
    res.status(201).json(Array.isArray(result.json) ? result.json[0] : result.json)
  })

  return router
}

app.use('/api/ai_tools', tableRoutes('ai_tools'))
app.use('/api/gong_recordings', tableRoutes('gong_recordings'))

const distDir = path.join(__dirname, 'dist')
app.use(express.static(distDir))
app.get('/*splat', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`server listening on :${PORT}, anon key present: ${Boolean(ANON_KEY)}`)
})
