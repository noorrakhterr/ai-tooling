import { useMemo, useState } from 'react'
import { ALL_PHASES, BONUS_PHASES, CORE_PHASES } from '../data/phases'
import { usePassportStore } from '../state/usePassportStore'
import { PassportPhaseStrip } from './PassportPhaseStrip'
import { BonusStampRow } from './BonusStampRow'
import { PhasePanel } from './PhasePanel'

interface PassportFullProps {
  /** When false, suppresses the per-phase tool detail panel below the hero (used on Home). */
  showPhaseDetail?: boolean
}

export function PassportFull({ showPhaseDetail = true }: PassportFullProps) {
  const stampedPhaseIds = usePassportStore((state) => state.stampedPhaseIds)
  const dismissPassport = usePassportStore((state) => state.dismissPassport)

  const coreStampedCount = CORE_PHASES.filter((phase) => stampedPhaseIds.includes(phase.id)).length
  const isComplete = coreStampedCount === CORE_PHASES.length

  const nextPhase = useMemo(
    () => CORE_PHASES.find((phase) => !stampedPhaseIds.includes(phase.id)) ?? null,
    [stampedPhaseIds],
  )

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(nextPhase?.id ?? CORE_PHASES[0].id)
  const selectedPhase = ALL_PHASES.find((phase) => phase.id === selectedPhaseId) ?? null

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-accent-700 p-6 text-white shadow-lg">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-100">AI Enablement Passport</p>
            <h1 className="font-heading mt-1 text-2xl font-semibold">
              {coreStampedCount} of {CORE_PHASES.length} phases stamped
            </h1>
          </div>
          {isComplete ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-400/90 px-4 py-2 text-right text-emerald-950">
              <p className="text-xs font-semibold">Passport complete</p>
              <button
                type="button"
                onClick={dismissPassport}
                className="rounded-md px-2 py-1 text-xs font-semibold text-emerald-950 transition-colors hover:bg-emerald-950/10"
              >
                Dismiss
              </button>
            </div>
          ) : (
            nextPhase && (
              <div className="rounded-xl bg-white/15 px-4 py-2 text-right">
                <p className="text-xs text-brand-100">Next up</p>
                <p className="text-sm font-semibold">{nextPhase.title}</p>
              </div>
            )
          )}
        </div>
        <PassportPhaseStrip
          phases={CORE_PHASES}
          selectedPhaseId={selectedPhaseId}
          onSelectPhase={setSelectedPhaseId}
          interactive={showPhaseDetail}
        />
        <div className="mt-5">
          <BonusStampRow
            phases={BONUS_PHASES}
            selectedPhaseId={selectedPhaseId}
            onSelectPhase={setSelectedPhaseId}
            interactive={showPhaseDetail}
          />
        </div>
      </section>

      {showPhaseDetail && selectedPhase && <PhasePanel phase={selectedPhase} />}
    </div>
  )
}
