import { useCallback, useEffect, useState } from 'react'
import { iddb } from '../lib/iddb'
import { RECORDINGS as SEED_RECORDINGS } from '../data/recordings'
import type { Recording } from '../types'

/**
 * Gong recordings shared across the whole team, backed by the
 * `gong_recordings` table. Falls back to the seeded RECORDINGS array if
 * the fetch fails.
 */
export function useRecordings() {
  const [recordings, setRecordings] = useState<Recording[]>(SEED_RECORDINGS)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data, error } = await iddb.table<Recording>('gong_recordings').selectAll()
    setRecordings(error || !data ? SEED_RECORDINGS : data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addRecording = useCallback((recording: Recording) => {
    setRecordings((current) => [recording, ...current])
  }, [])

  return { recordings, loading, addRecording, refresh }
}
