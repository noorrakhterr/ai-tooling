/**
 * Minimal REST client for Okta App Platform's auto-generated PostgREST API,
 * used instead of the `@iddb/client` SDK package. That package lives on a
 * private npm registry this tenant doesn't have configured (confirmed via
 * direct testing — see db/ and README for the history), so this talks to
 * the same underlying REST API directly with fetch(), using only the
 * browser-safe anon key. No extra npm dependency needed.
 *
 * Reads/writes to `ai_tools` and `gong_recordings` go through this.
 */

const TENANT = 'ai-tools'
const API_BASE = `https://api.platform.atko.ai/${TENANT}/rest/v1`
const ANON_KEY = import.meta.env.VITE_IDDB_ANON_KEY ?? ''

export interface IddbResult<T> {
  data: T | null
  error: { message: string } | null
}

async function request<T>(
  path: string,
  init: RequestInit & { expectSingle?: boolean } = {},
): Promise<IddbResult<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: init.expectSingle ? 'return=representation' : 'return=representation',
        ...init.headers,
      },
    })

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      return { data: null, error: { message: body?.message ?? `Request failed (${response.status})` } }
    }

    const text = await response.text()
    if (!text) return { data: null, error: null }

    const json = JSON.parse(text)
    return { data: json, error: null }
  } catch (err) {
    return { data: null, error: { message: err instanceof Error ? err.message : 'Network error' } }
  }
}

export const iddb = {
  table<Row>(name: string) {
    return {
      /** Fetch all rows. */
      async selectAll(): Promise<IddbResult<Row[]>> {
        return request<Row[]>(`/${name}?select=*`)
      },
      /** Insert one row, returning the inserted row. */
      async insertOne(values: Partial<Row>): Promise<IddbResult<Row>> {
        const result = await request<Row[]>(`/${name}`, {
          method: 'POST',
          body: JSON.stringify(values),
          expectSingle: true,
        })
        if (result.error) return { data: null, error: result.error }
        return { data: result.data?.[0] ?? null, error: null }
      },
    }
  },
}
