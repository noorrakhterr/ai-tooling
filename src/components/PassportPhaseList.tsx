import type { Phase } from '../types'
import { usePassportStore } from '../state/usePassportStore'

interface PassportPhaseListProps {
  phases: Phase[]
  selectedPhaseId: string | null
  onSelectPhase: (phaseId: string) => void
}

export function PassportPhaseList({ phases, selectedPhaseId, onSelectPhase }: PassportPhaseListProps) {
  const isPhaseStamped = usePassportStore((state) => state.isPhaseStamped)

  return (
    <div className="flex flex-col gap-1.5">
      {phases.map((phase, index) => {
        const stamped = isPhaseStamped(phase.id)
        const isSelected = selectedPhaseId === phase.id
        return (
          <button
            key={phase.id}
            type="button"
            onClick={() => onSelectPhase(phase.id)}
            className={[
              'flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors',
              isSelected ? 'border-white bg-white/20' : 'border-white/20 bg-white/5 hover:bg-white/10',
            ].join(' ')}
          >
            <span
              className={[
                'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                stamped ? 'bg-emerald-400 text-emerald-950' : 'bg-white/20 text-white',
              ].join(' ')}
              aria-hidden="true"
            >
              {stamped ? '✓' : phase.group === 'bonus' ? '★' : index + 1}
            </span>
            <span className="text-xs font-medium leading-tight text-white">{phase.title}</span>
          </button>
        )
      })}
    </div>
  )
}
