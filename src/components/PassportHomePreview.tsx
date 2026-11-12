import { Link } from 'react-router-dom'
import { CORE_PHASES } from '../data/phases'
import { usePassportStore } from '../state/usePassportStore'

/**
 * Condensed passport progress card for Home — deliberately not the same
 * gradient hero as the full /passport page, and not as bare as the
 * phase-name chips shown on My Tools: a slim segmented progress bar plus
 * the stamped count, linking out to the full passport for detail.
 */
export function PassportHomePreview() {
  const stampedPhaseIds = usePassportStore((state) => state.stampedPhaseIds)
  const dismissPassport = usePassportStore((state) => state.dismissPassport)
  const coreStampedCount = CORE_PHASES.filter((phase) => stampedPhaseIds.includes(phase.id)).length
  const isComplete = coreStampedCount === CORE_PHASES.length

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">AI Enablement Passport</p>
          <p className="font-heading text-base font-semibold text-slate-900">
            {coreStampedCount} of {CORE_PHASES.length} phases stamped
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          {isComplete && (
            <button
              type="button"
              onClick={dismissPassport}
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Dismiss
            </button>
          )}
          <Link to="/passport" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View passport →
          </Link>
        </div>
      </div>
      <div className="flex gap-1.5">
        {CORE_PHASES.map((phase) => {
          const stamped = stampedPhaseIds.includes(phase.id)
          return (
            <span
              key={phase.id}
              title={phase.title}
              className={['h-2 flex-1 rounded-full', stamped ? 'bg-emerald-500' : 'bg-slate-200'].join(' ')}
            />
          )
        })}
      </div>
    </div>
  )
}
