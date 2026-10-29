import { useCallback, useEffect, useState } from 'react'
import { iddb } from '../lib/iddb'
import { TOOLS as SEED_TOOLS } from '../data/tools'
import type { Tool } from '../types'

/**
 * Tools shared across the whole team, backed by the `ai_tools` table.
 * Falls back to the seeded TOOLS array if the fetch fails.
 */
export function useTools() {
  const [tools, setTools] = useState<Tool[]>(SEED_TOOLS)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data, error } = await iddb.table<Tool>('ai_tools').selectAll()
    // TEMPORARY DIAGNOSTIC — chasing My Tools falling back to seed data
    // while Catalog gets real data. Remove once answered.
    if (error) {
      console.log('[useTools-debug] selectAll error:', error)
    } else {
      console.log('[useTools-debug] selectAll ok, row count:', data?.length)
    }
    setTools(error || !data ? SEED_TOOLS : data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addTool = useCallback((tool: Tool) => {
    setTools((current) => [tool, ...current])
  }, [])

  const updateTool = useCallback((tool: Tool) => {
    setTools((current) => current.map((existing) => (existing.id === tool.id ? tool : existing)))
  }, [])

  const removeTool = useCallback((id: string) => {
    setTools((current) => current.filter((tool) => tool.id !== id))
  }, [])

  return { tools, loading, addTool, updateTool, removeTool, refresh }
}
