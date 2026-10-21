import type { Phase } from '../types'
import { usePassportStore } from '../state/usePassportStore'

interface PassportPhaseStripProps {
  phases: Phase[]
  selectedPhaseId: string | null
  onSelectPhase: (phaseId: string) => void
}

export function PassportPhaseStrip({ phases, selectedPhaseId, onSelectPhase }: PassportPhaseStripProps) {
  const isPhaseStamped = usePassportStore((state) => state.isPhaseStamped)

  return (
    <div className="flex flex-wrap gap-2">
      {phases.map((phase, index) => {
        const stamped = isPhaseStamped(phase.id)
        const isSelected = selectedPhaseId === phase.id
        return (
          <button
            key={phase.id}
            type="button"
            onClick={() => onSelectPhase(phase.id)}
            className={[
              'flex min-w-[132px] flex-1 flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-all',
              isSelected
                ? 'border-white bg-white/20 shadow-lg'
                : 'border-white/30 bg-white/10 hover:bg-white/15',
            ].join(' ')}
          >
            <span
              className={[
                'flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold',
                stamped ? 'bg-emerald-400 text-emerald-950' : 'bg-white/20 text-white',
              ].join(' ')}
              aria-hidden="true"
            >
              {stamped ? '✓' : index + 1}
            </span>
            <span className="text-xs font-medium leading-tight text-white">{phase.title}</span>
          </button>
        )
      })}
    </div>
  )
}
