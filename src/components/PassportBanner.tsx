import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CORE_PHASES } from '../data/phases'
import { usePassportStore } from '../state/usePassportStore'

export function PassportBanner() {
  const stampedPhaseIds = usePassportStore((state) => state.stampedPhaseIds)
  const passportDismissed = usePassportStore((state) => state.passportDismissed)

  const coreStampedCount = CORE_PHASES.filter((phase) => stampedPhaseIds.includes(phase.id)).length
  const isComplete = coreStampedCount === CORE_PHASES.length

  const nextPhase = useMemo(
    () => CORE_PHASES.find((phase) => !stampedPhaseIds.includes(phase.id)) ?? null,
    [stampedPhaseIds],
  )

  if (passportDismissed) return null

  return (
    <Link
      to="/passport"
      className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-4 py-3 text-white shadow-sm transition-opacity hover:opacity-90"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">
          {coreStampedCount} of {CORE_PHASES.length} stamped
        </span>
        {!isComplete && nextPhase && (
          <span className="text-xs text-indigo-100">Next up: {nextPhase.title}</span>
        )}
        {isComplete && <span className="text-xs text-indigo-100">Passport complete</span>}
      </div>
      <span className="text-xs font-medium text-indigo-100">View passport →</span>
    </Link>
  )
}
