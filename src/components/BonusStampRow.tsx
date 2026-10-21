import type { Phase } from '../types'
import { usePassportStore } from '../state/usePassportStore'

interface BonusStampRowProps {
  phases: Phase[]
  selectedPhaseId: string | null
  onSelectPhase: (phaseId: string) => void
}

export function BonusStampRow({ phases, selectedPhaseId, onSelectPhase }: BonusStampRowProps) {
  const isPhaseStamped = usePassportStore((state) => state.isPhaseStamped)

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-100/80">
        Bonus stamps
      </p>
      <div className="flex flex-wrap gap-2">
        {phases.map((phase) => {
          const stamped = isPhaseStamped(phase.id)
          const isSelected = selectedPhaseId === phase.id
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelectPhase(phase.id)}
              className={[
                'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isSelected
                  ? 'border-white bg-white/20 text-white'
                  : 'border-white/30 bg-white/10 text-indigo-50 hover:bg-white/15',
              ].join(' ')}
            >
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
            </button>
          )
        })}
      </div>
    </div>
  )
}
