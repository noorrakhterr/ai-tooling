import { useCallback, useEffect, useState } from 'react'
import { iddb } from '../lib/iddb'
import { TOOLS as SEED_TOOLS } from '../data/tools'
import type { Tool } from '../types'

/**
 * Tools shared across the whole team, backed by the `ai_tools` table.
 * Falls back to the seeded TOOLS array if the fetch fails (e.g. local dev
 * without @iddb/client installed, or the table not existing yet).
 */
export function useTools() {
  const [tools, setTools] = useState<Tool[]>(SEED_TOOLS)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data, error } = await iddb.from<Tool>('ai_tools').select('*')
    setTools(error || !data ? SEED_TOOLS : data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addTool = useCallback((tool: Tool) => {
    setTools((current) => [tool, ...current])
  }, [])

  return { tools, loading, addTool, refresh }
}
