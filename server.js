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
 *
 * Also confirmed via a real deployed request: OAP's edge gate forwards
 * the authenticated user's email as the x-iddb-user-email header on every
 * request that reaches this server (nobody gets here without passing
 * that gate first — a direct unauthenticated request gets a 403 before
 * ever reaching this app). That's the trusted identity source for the
 * engagement features below.
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
  const startedAt = Date.now()
  const response = await fetch(`${REST_BASE}${path}`, {
    ...init,
    headers: {
      apikey: RESOURCE_KEY,
      Authorization: `Bearer ${RESOURCE_KEY}`,
      // Only set Content-Type when there's actually a body — the internal
      // gateway is Fastify-based and rejects application/json with an
      // empty body (FST_ERR_CTP_EMPTY_JSON_BODY), which DELETE always has.
      // Confirmed via a real deployed request, not assumption.
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      Prefer: 'return=representation',
      ...init.headers,
    },
  })
  const text = await response.text()
  const json = text ? JSON.parse(text) : null
  const elapsedMs = Date.now() - startedAt
  // TEMPORARY DIAGNOSTIC — chasing a reported ~20s load time on
  // gong_recordings/ai_tools GETs. Remove once answered.
  console.log(`restRequest ${init.method || 'GET'} ${REST_BASE}${path} -> ${response.status} in ${elapsedMs}ms`)
  if (!response.ok) {
    console.log(`restRequest ${REST_BASE}${path} -> ${response.status}: ${text}`)
  }
  return { ok: response.ok, status: response.status, json }
}

/**
 * @param {string} tableName
 * @param {{ stampUserEmailField?: string, ownerEmailField?: string }} [options]
 *   stampUserEmailField: on POST, overwrite this field in the body with the
 *   trusted x-iddb-user-email header value — the browser can send anything
 *   and it's ignored, so nobody can post "as" someone else.
 *   ownerEmailField: on DELETE, only succeeds if the row's value for this
 *   field matches the requester's email — a mismatch just deletes 0 rows
 *   (plain 204), not an error that would leak whether the row exists.
 */
function tableRoutes(tableName, options = {}) {
  const { stampUserEmailField, ownerEmailField } = options
  const router = express.Router()

  router.get('/', async (_req, res) => {
    const result = await restRequest(`/${tableName}?select=*`)
    if (!result.ok) return res.status(result.status).json({ error: result.json })
    res.json(result.json)
  })

  router.post('/', async (req, res) => {
    const body = stampUserEmailField
      ? { ...req.body, [stampUserEmailField]: req.headers['x-iddb-user-email'] || null }
      : req.body
    const result = await restRequest(`/${tableName}`, {
      method: 'POST',
      body: JSON.stringify(body),
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
    let filterPath = `/${tableName}?id=eq.${req.params.id}`
    if (ownerEmailField) {
      const userEmail = req.headers['x-iddb-user-email'] || ''
      filterPath += `&${ownerEmailField}=eq.${encodeURIComponent(userEmail)}`
    }
    const result = await restRequest(filterPath, { method: 'DELETE' })
    if (!result.ok) return res.status(result.status).json({ error: result.json })
    res.status(204).end()
  })

  return router
}

app.use('/api/ai_tools', tableRoutes('ai_tools'))
app.use('/api/gong_recordings', tableRoutes('gong_recordings'))
app.use(
  '/api/tool_usage',
  tableRoutes('tool_usage', { stampUserEmailField: 'userEmail', ownerEmailField: 'userEmail' }),
)
app.use(
  '/api/tool_comments',
  tableRoutes('tool_comments', { stampUserEmailField: 'userEmail', ownerEmailField: 'userEmail' }),
)

app.get('/api/me', (req, res) => {
  res.json({ email: req.headers['x-iddb-user-email'] || null })
})

const distDir = path.join(__dirname, 'dist')
app.use(express.static(distDir))
app.get('/*splat', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`server listening on :${PORT}, resource key present: ${Boolean(RESOURCE_KEY)}`)
})
