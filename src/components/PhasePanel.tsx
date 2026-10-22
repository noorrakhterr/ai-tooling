import type { Phase } from '../types'
import { usePassportStore } from '../state/usePassportStore'
import { useTools } from '../hooks/useTools'
import { ToolCard } from './ToolCard'

interface PhasePanelProps {
  phase: Phase
  /** When true, renders without the outer card chrome (for nesting inside another card). */
  embedded?: boolean
}

export function PhasePanel({ phase, embedded = false }: PhasePanelProps) {
  const isPhaseStamped = usePassportStore((state) => state.isPhaseStamped)
  const { tools } = useTools()
  const suggestedTools = tools.filter((tool) => tool.phaseIds.includes(phase.id))
  const stamped = isPhaseStamped(phase.id)

  return (
    <div className={embedded ? '' : 'rounded-2xl border border-slate-200 bg-white p-5'}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{phase.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{phase.description}</p>
        </div>
        {stamped && (
          <span className="flex-shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Stamped ✓
          </span>
        )}
      </div>
      {suggestedTools.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          No suggested tools yet for this phase.
        </p>
      ) : (
        <div className={embedded ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 gap-3 sm:grid-cols-2'}>
          {suggestedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} phaseIdToStamp={phase.id} />
          ))}
        </div>
      )}
    </div>
  )
}
