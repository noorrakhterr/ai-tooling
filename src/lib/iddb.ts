/**
 * Client for this app's own same-origin /api/* routes (see server.js), not
 * OAP's REST API directly. The browser never holds a database credential —
 * the Node server does that server-side, where IDDB_RESOURCE_KEY is
 * actually available (it's a runtime secret, injected into the container
 * process, never into the client-side build). See git history around Oct
 * 2026 for why a static-SPA build couldn't do this.
 */

export interface IddbResult<T> {
  data: T | null
  error: { message: string } | null
}

async function request<T>(path: string, init: RequestInit = {}): Promise<IddbResult<T>> {
  try {
    const response = await fetch(`/api${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    })

    const text = await response.text()
    const json = text ? JSON.parse(text) : null

    if (!response.ok) {
      return { data: null, error: { message: json?.error?.message ?? `Request failed (${response.status})` } }
    }

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
        return request<Row[]>(`/${name}`)
      },
      /** Insert one row, returning the inserted row. */
      async insertOne(values: Partial<Row>): Promise<IddbResult<Row>> {
        return request<Row>(`/${name}`, {
          method: 'POST',
          body: JSON.stringify(values),
        })
      },
      /** Update one row by id, returning the updated row. */
      async updateOne(id: string, values: Partial<Row>): Promise<IddbResult<Row>> {
        return request<Row>(`/${name}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(values),
        })
      },
      /** Delete one row by id. */
      async deleteOne(id: string): Promise<IddbResult<null>> {
        return request<null>(`/${name}/${id}`, {
          method: 'DELETE',
        })
      },
    }
  },
}
