import { useCallback, useEffect, useMemo, useState } from 'react'
import { iddb, getMe } from '../lib/iddb'
import type { ToolUsage, ToolComment } from '../types'

/**
 * Catalog-wide engagement data ("I use this" toggles + comments) for AI
 * tools. Loaded once here (not per-card) to avoid N network calls — one
 * fetch each of all usage rows and all comment rows, sliced per-tool in
 * memory by the consuming page.
 */
export function useEngagement() {
  const [usage, setUsage] = useState<ToolUsage[]>([])
  const [comments, setComments] = useState<ToolComment[]>([])
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [usageResult, commentsResult, me] = await Promise.all([
      iddb.table<ToolUsage>('tool_usage').selectAll(),
      iddb.table<ToolComment>('tool_comments').selectAll(),
      getMe(),
    ])
    setUsage(usageResult.data ?? [])
    setComments(commentsResult.data ?? [])
    setCurrentUserEmail(me.email)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const usageByToolId = useMemo(() => {
    const map = new Map<string, ToolUsage[]>()
    for (const row of usage) {
      map.set(row.toolId, [...(map.get(row.toolId) ?? []), row])
    }
    return map
  }, [usage])

  const commentsByToolId = useMemo(() => {
    const map = new Map<string, ToolComment[]>()
    for (const row of comments) {
      map.set(row.toolId, [...(map.get(row.toolId) ?? []), row])
    }
    return map
  }, [comments])

  const usageCountForTool = useCallback(
    (toolId: string) => usageByToolId.get(toolId)?.length ?? 0,
    [usageByToolId],
  )

  const myUsageForTool = useCallback(
    (toolId: string) =>
      usageByToolId
        .get(toolId)
        ?.find((row) => row.userEmail === currentUserEmail || row.id.startsWith('pending-')),
    [usageByToolId, currentUserEmail],
  )

  /**
   * Flips the star/usage state immediately in local state (optimistic — the
   * star fills/empties without waiting on the network round-trip), then
   * reconciles with the server in the background. Safe to call repeatedly
   * in quick succession (e.g. toggle, then "Undo") — each call just flips
   * whatever the current local state is.
   */
  const toggleUsage = useCallback(
    (toolId: string) => {
      const existing = myUsageForTool(toolId)

      if (existing) {
        setUsage((current) => current.filter((row) => row.id !== existing.id))
        iddb
          .table<ToolUsage>('tool_usage')
          .deleteOne(existing.id)
          .then(({ error }) => {
            if (error) setUsage((current) => [...current, existing])
          })
        return
      }

      const placeholderId = `pending-${toolId}-${Date.now()}`
      setUsage((current) => [...current, { id: placeholderId, toolId, userEmail: currentUserEmail ?? '' }])
      iddb
        .table<ToolUsage>('tool_usage')
        .insertOne({ toolId })
        .then(({ data, error }) => {
          setUsage((current) => {
            const withoutPlaceholder = current.filter((row) => row.id !== placeholderId)
            return error || !data ? withoutPlaceholder : [...withoutPlaceholder, data]
          })
        })
    },
    [myUsageForTool, currentUserEmail],
  )

  const addComment = useCallback(async (toolId: string, body: string) => {
    const { data, error } = await iddb.table<ToolComment>('tool_comments').insertOne({ toolId, body })
    if (!error && data) setComments((current) => [...current, data])
    return { error }
  }, [])

  const deleteComment = useCallback(
    async (commentId: string) => {
      setComments((current) => current.filter((comment) => comment.id !== commentId))
      const { error } = await iddb.table<ToolComment>('tool_comments').deleteOne(commentId)
      if (error) await refresh()
      return { error }
    },
    [refresh],
  )

  return {
    loading,
    currentUserEmail,
    usageCountForTool,
    myUsageForTool,
    commentsByToolId,
    toggleUsage,
    addComment,
    deleteComment,
    refresh,
  }
}
