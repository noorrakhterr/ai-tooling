import type { Phase } from '../types'
import { usePassportStore } from '../state/usePassportStore'

interface BonusStampRowProps {
  phases: Phase[]
  selectedPhaseId: string | null
  onSelectPhase: (phaseId: string) => void
  /** When false, renders as static display only (used on Home, where selection has no visible effect). */
  interactive?: boolean
}

export function BonusStampRow({ phases, selectedPhaseId, onSelectPhase, interactive = true }: BonusStampRowProps) {
  // Select the array, not isPhaseStamped — selecting a stable function
  // reference never re-renders this component when stampedPhaseIds updates.
  const stampedPhaseIds = usePassportStore((state) => state.stampedPhaseIds)

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-100/80">
        Bonus stamps
      </p>
      <div className="flex flex-wrap gap-2">
        {phases.map((phase) => {
          const stamped = stampedPhaseIds.includes(phase.id)
          const isSelected = selectedPhaseId === phase.id
          const className = [
            'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium',
            interactive ? 'transition-colors' : '',
            isSelected ? 'border-white bg-white/20 text-white' : 'border-white/30 bg-white/10 text-brand-50',
            interactive && !isSelected ? 'hover:bg-white/15' : '',
          ]
            .filter(Boolean)
            .join(' ')
          const content = (
            <>
              <span
                className={[
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold',
                  stamped ? 'bg-emerald-400 text-emerald-950' : 'bg-white/20 text-white',
                ].join(' ')}
                aria-hidden="true"
              >
                {stamped ? '✓' : '★'}
              </span>
              {phase.title}
            </>
          )

          if (!interactive) {
            return (
              <div key={phase.id} className={className}>
                {content}
              </div>
            )
          }

          return (
            <button key={phase.id} type="button" onClick={() => onSelectPhase(phase.id)} className={className}>
              {content}
            </button>
          )
        })}
      </div>
    </div>
  )
}
