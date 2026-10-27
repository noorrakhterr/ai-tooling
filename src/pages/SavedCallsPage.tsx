import { useMemo, useState } from 'react'
import { useRecordings } from '../hooks/useRecordings'
import { RecordingCard } from '../components/RecordingCard'
import { EmptyState } from '../components/EmptyState'
import { FilterSelect } from '../components/FilterSelect'
import { usePassportStore } from '../state/usePassportStore'

const ALL_CALLS = 'all'
const NO_LABEL = '__no_label__'

export function SavedCallsPage() {
  const { recordings } = useRecordings()
  const savedRecordingIds = usePassportStore((state) => state.savedRecordingIds)
  const savedRecordings = recordings.filter((recording) => savedRecordingIds.includes(recording.id))

  const [query, setQuery] = useState('')
  const [labelFilter, setLabelFilter] = useState(ALL_CALLS)
  const [csmFilter, setCsmFilter] = useState(ALL_CALLS)

  const allLabels = useMemo(() => {
    const labels = new Set<string>()
    savedRecordings.forEach((recording) => recording.labels.forEach((label) => labels.add(label)))
    return [...labels].sort()
  }, [savedRecordings])

  const allCsms = useMemo(() => {
    const owners = new Set<string>()
    savedRecordings.forEach((recording) => {
      if (recording.owner) owners.add(recording.owner)
    })
    return [...owners].sort()
  }, [savedRecordings])

  const filteredRecordings = useMemo(() => {
    return savedRecordings.filter((recording) => {
      const matchesQuery =
        query.trim() === '' ||
        recording.title.toLowerCase().includes(query.toLowerCase()) ||
        (recording.customer?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (recording.owner?.toLowerCase().includes(query.toLowerCase()) ?? false)
      const matchesLabel =
        labelFilter === ALL_CALLS ||
        (labelFilter === NO_LABEL ? recording.labels.length === 0 : recording.labels.includes(labelFilter))
      const matchesCsm = csmFilter === ALL_CALLS || recording.owner === csmFilter
      return matchesQuery && matchesLabel && matchesCsm
    })
  }, [savedRecordings, query, labelFilter, csmFilter])

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-slate-900">Saved Calls</h1>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search saved calls…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none sm:max-w-xs"
        />
        <FilterSelect value={labelFilter} onChange={setLabelFilter}>
          <option value={ALL_CALLS}>All calls</option>
          <option value={NO_LABEL}>No label</option>
          {allLabels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={csmFilter} onChange={setCsmFilter}>
          <option value={ALL_CALLS}>All CSMs</option>
          {allCsms.map((csm) => (
            <option key={csm} value={csm}>
              {csm}
            </option>
          ))}
        </FilterSelect>
      </div>

      {filteredRecordings.length === 0 ? (
        <EmptyState
          title="No saved calls"
          message="Star a call in the Gong Library to save it here for later."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecordings.map((recording) => (
            <RecordingCard key={recording.id} recording={recording} showSaveForLater />
          ))}
        </div>
      )}
    </div>
  )
}
