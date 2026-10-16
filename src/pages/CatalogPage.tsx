import { useMemo, useState } from 'react'
import { ALL_PHASES } from '../data/phases'
import { SAMPLE_TOOLS } from '../data/tools'
import { ToolCard } from '../components/ToolCard'
import { EmptyState } from '../components/EmptyState'

export function CatalogPage() {
  const [query, setQuery] = useState('')
  const [phaseFilter, setPhaseFilter] = useState<string | 'all'>('all')

  const filteredTools = useMemo(() => {
    return SAMPLE_TOOLS.filter((tool) => {
      const matchesQuery =
        query.trim() === '' ||
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
      const matchesPhase = phaseFilter === 'all' || tool.phaseIds.includes(phaseFilter)
      return matchesQuery && matchesPhase
    })
  }, [query, phaseFilter])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Tool Catalog</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sample catalog — placeholder data pending the validated AI &amp; Gong resource inventory.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools…"
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

      {filteredTools.length === 0 ? (
        <EmptyState title="No tools match" message="Try a different search term or phase filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}
