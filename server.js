/**
 * Node server for OAP — replaces the static-SPA runtime.
 *
 * Why this exists: the browser can never hold a database credential — OAP
 * only injects secrets into a running container's process.env at runtime,
 * never into the Vite build (confirmed empirically — see git history
 * around Oct 2026 for the full saga). A real server process genuinely has
 * these env vars available when it handles a request, so this server
 * holds the credential and does the REST calls itself; the browser calls
 * these same-origin routes with no credential of any kind.
 *
 * Two things confirmed only by deploying and checking real runtime logs,
 * not assumption:
 * - The public api.platform.atko.ai host isn't reachable from inside this
 *   container (ConnectTimeoutError on every call) — use IDDB_API_URL, the
 *   cluster-internal gateway, instead.
 * - That internal gateway rejects IDDB_ANON_KEY ("invalid API key for
 *   this tenant") — it wants IDDB_RESOURCE_KEY, the credential meant for
 *   pod-to-pod calls, not the public-facing anon key.
 */
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 8080
const RESOURCE_KEY = process.env.IDDB_RESOURCE_KEY
const REST_BASE = `${process.env.IDDB_API_URL}/rest/v1`

const app = express()
app.use(express.json())

async function restRequest(path, init = {}) {
  const response = await fetch(`${REST_BASE}${path}`, {
    ...init,
    headers: {
      apikey: RESOURCE_KEY,
      Authorization: `Bearer ${RESOURCE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...init.headers,
    },
  })
  const text = await response.text()
  const json = text ? JSON.parse(text) : null
  if (!response.ok) {
    console.log(`restRequest ${REST_BASE}${path} -> ${response.status}: ${text}`)
  }
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

  router.patch('/:id', async (req, res) => {
    const result = await restRequest(`/${tableName}?id=eq.${req.params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(req.body),
    })
    if (!result.ok) return res.status(result.status).json({ error: result.json })
    res.json(Array.isArray(result.json) ? result.json[0] : result.json)
  })

  router.delete('/:id', async (req, res) => {
    const result = await restRequest(`/${tableName}?id=eq.${req.params.id}`, {
      method: 'DELETE',
    })
    if (!result.ok) return res.status(result.status).json({ error: result.json })
    res.status(204).end()
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
  console.log(`server listening on :${PORT}, resource key present: ${Boolean(RESOURCE_KEY)}`)
})
