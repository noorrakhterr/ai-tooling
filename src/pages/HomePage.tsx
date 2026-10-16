import { useMemo, useState } from 'react'
import { BONUS_PHASES, CORE_PHASES } from '../data/phases'
import { usePassportStore } from '../state/usePassportStore'
import { PassportStrip } from '../components/PassportStrip'
import { BonusStampsRow } from '../components/BonusStampsRow'
import { PhasePanel } from '../components/PhasePanel'

export function HomePage() {
  const stampedPhaseIds = usePassportStore((state) => state.stampedPhaseIds)
  const coreStampedCount = CORE_PHASES.filter((phase) => stampedPhaseIds.includes(phase.id)).length

  const nextPhase = useMemo(
    () => CORE_PHASES.find((phase) => !stampedPhaseIds.includes(phase.id)) ?? null,
    [stampedPhaseIds],
  )

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(nextPhase?.id ?? CORE_PHASES[0].id)
  const allPhases = [...CORE_PHASES, ...BONUS_PHASES]
  const selectedPhase = allPhases.find((phase) => phase.id === selectedPhaseId) ?? null

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-lg">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Your AI enablement passport</p>
            <h1 className="mt-1 text-2xl font-semibold">
              {coreStampedCount} of {CORE_PHASES.length} phases stamped
            </h1>
          </div>
          {nextPhase ? (
            <div className="rounded-xl bg-white/15 px-4 py-2 text-right">
              <p className="text-xs text-indigo-100">Next up</p>
              <p className="text-sm font-semibold">{nextPhase.title}</p>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-400/90 px-4 py-2 text-right text-emerald-950">
              <p className="text-xs font-semibold">Passport complete 🎉</p>
            </div>
          )}
        </div>
        <PassportStrip
          phases={CORE_PHASES}
          selectedPhaseId={selectedPhaseId}
          onSelectPhase={setSelectedPhaseId}
        />
        <div className="mt-5">
          <BonusStampsRow
            phases={BONUS_PHASES}
            selectedPhaseId={selectedPhaseId}
            onSelectPhase={setSelectedPhaseId}
          />
        </div>
      </section>

      {selectedPhase && <PhasePanel phase={selectedPhase} />}
    </div>
  )
}
