import { useMemo, useState } from 'react'
import { useRecordings } from '../hooks/useRecordings'
import { RecordingCard } from '../components/RecordingCard'
import { AddGongCallForm } from '../components/AddGongCallForm'
import { EmptyState } from '../components/EmptyState'

export function GongLibraryPage() {
  const { recordings, addRecording } = useRecordings()
  const [query, setQuery] = useState('')
  const [labelFilter, setLabelFilter] = useState<string | 'all'>('all')

  const allLabels = useMemo(() => {
    const labels = new Set<string>()
    recordings.forEach((recording) => recording.labels.forEach((label) => labels.add(label)))
    return [...labels].sort()
  }, [recordings])

  const filteredRecordings = useMemo(() => {
    return recordings.filter((recording) => {
      const matchesQuery =
        query.trim() === '' ||
        recording.title.toLowerCase().includes(query.toLowerCase()) ||
        (recording.customer?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (recording.owner?.toLowerCase().includes(query.toLowerCase()) ?? false)
      const matchesLabel = labelFilter === 'all' || recording.labels.includes(labelFilter)
      return matchesQuery && matchesLabel
    })
  }, [recordings, query, labelFilter])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Gong Library</h1>
          <p className="mt-1 text-sm text-slate-500">
            Searchable call recording library, filterable by label.
          </p>
        </div>
        <AddGongCallForm onAdded={addRecording} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search recordings by title, customer, or owner…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLabelFilter('all')}
            className={[
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              labelFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            ].join(' ')}
          >
            All labels
          </button>
          {allLabels.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setLabelFilter(label)}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                labelFilter === label
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredRecordings.length === 0 ? (
        <EmptyState title="No recordings match" message="Try a different search term or label filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecordings.map((recording) => (
            <RecordingCard key={recording.id} recording={recording} />
          ))}
        </div>
      )}
    </div>
  )
}
