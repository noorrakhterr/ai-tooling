import { useMemo, useState } from 'react'
import { ALL_PHASES } from '../data/phases'
import { RECORDINGS } from '../data/recordings'
import { RecordingCard } from '../components/RecordingCard'
import { EmptyState } from '../components/EmptyState'

export function GongLibraryPage() {
  const [query, setQuery] = useState('')
  const [phaseFilter, setPhaseFilter] = useState<string | 'all'>('all')

  const filteredRecordings = useMemo(() => {
    return RECORDINGS.filter((recording) => {
      const matchesQuery =
        query.trim() === '' ||
        recording.title.toLowerCase().includes(query.toLowerCase()) ||
        recording.customer.toLowerCase().includes(query.toLowerCase())
      const matchesPhase = phaseFilter === 'all' || recording.phaseIds.includes(phaseFilter)
      return matchesQuery && matchesPhase
    })
  }, [query, phaseFilter])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Gong Library</h1>
        <p className="mt-1 text-sm text-slate-500">
          Searchable call recording library. No recordings published yet — check back once the Gong
          inventory is complete.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search recordings by title or customer…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPhaseFilter('all')}
            className={[
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              phaseFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            ].join(' ')}
          >
            All phases
          </button>
          {ALL_PHASES.map((phase) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => setPhaseFilter(phase.id)}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                phaseFilter === phase.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              ].join(' ')}
            >
              {phase.title}
            </button>
          ))}
        </div>
      </div>

      {filteredRecordings.length === 0 ? (
        <EmptyState
          title="No recordings yet"
          message="Check back once the Gong inventory is published. This library is fully wired for search and phase filtering — it just needs data."
        />
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
