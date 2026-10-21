import { useMemo, useState } from 'react'
import { BONUS_PHASES, CORE_PHASES, ALL_PHASES } from '../data/phases'
import { usePassportStore } from '../state/usePassportStore'
import { PassportPhaseList } from './PassportPhaseList'
import { PhasePanel } from './PhasePanel'

export function PassportPanel() {
  const stampedPhaseIds = usePassportStore((state) => state.stampedPhaseIds)
  const passportMinimized = usePassportStore((state) => state.passportMinimized)
  const passportDismissed = usePassportStore((state) => state.passportDismissed)
  const setPassportMinimized = usePassportStore((state) => state.setPassportMinimized)
  const dismissPassport = usePassportStore((state) => state.dismissPassport)

  const coreStampedCount = CORE_PHASES.filter((phase) => stampedPhaseIds.includes(phase.id)).length
  const isComplete = coreStampedCount === CORE_PHASES.length

  const nextPhase = useMemo(
    () => CORE_PHASES.find((phase) => !stampedPhaseIds.includes(phase.id)) ?? null,
    [stampedPhaseIds],
  )

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(nextPhase?.id ?? CORE_PHASES[0].id)
  const selectedPhase = ALL_PHASES.find((phase) => phase.id === selectedPhaseId) ?? null

  if (passportDismissed) return null

  if (passportMinimized) {
    return (
      <button
        type="button"
        onClick={() => setPassportMinimized(false)}
        className="fixed right-0 top-24 z-20 flex items-center gap-2 rounded-l-xl bg-gradient-to-br from-indigo-600 to-violet-700 px-3 py-3 text-white shadow-lg transition-opacity hover:opacity-90"
        aria-label="Expand passport"
      >
        <span className="text-xs font-semibold" style={{ writingMode: 'vertical-rl' }}>
          Passport {coreStampedCount}/{CORE_PHASES.length}
        </span>
      </button>
    )
  }

  return (
    <aside className="flex h-screen w-80 flex-shrink-0 flex-col overflow-y-auto bg-gradient-to-b from-indigo-600 via-indigo-600 to-violet-700 p-5 text-white">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-indigo-100">AI enablement passport</p>
          <h2 className="font-heading mt-0.5 text-lg font-semibold">
            {coreStampedCount} of {CORE_PHASES.length} stamped
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPassportMinimized(true)}
            className="rounded-md p-1.5 text-indigo-100 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Minimize passport"
            title="Minimize"
          >
            −
          </button>
          {isComplete && (
            <button
              type="button"
              onClick={dismissPassport}
              className="rounded-md p-1.5 text-indigo-100 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss passport"
              title="Dismiss"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {isComplete && (
        <div className="mb-4 rounded-lg bg-emerald-400/90 px-3 py-2 text-xs font-semibold text-emerald-950">
          Passport complete — you can dismiss this panel.
        </div>
      )}

      {!isComplete && nextPhase && (
        <div className="mb-4 rounded-lg bg-white/15 px-3 py-2">
          <p className="text-xs text-indigo-100">Next up</p>
          <p className="text-sm font-semibold">{nextPhase.title}</p>
        </div>
      )}

      <PassportPhaseList
        phases={CORE_PHASES}
        selectedPhaseId={selectedPhaseId}
        onSelectPhase={setSelectedPhaseId}
      />

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-indigo-100/80">
        Bonus
      </p>
      <PassportPhaseList
        phases={BONUS_PHASES}
        selectedPhaseId={selectedPhaseId}
        onSelectPhase={setSelectedPhaseId}
      />

      {selectedPhase && (
        <div className="mt-5 rounded-xl bg-white p-4 text-slate-900">
          <PhasePanel phase={selectedPhase} embedded />
        </div>
      )}
    </aside>
  )
}
