import { useState } from 'react'
import { PassportFull } from '../components/PassportFull'
import { GuideModal } from '../components/GuideModal'
import { usePassportStore } from '../state/usePassportStore'

export function PassportPage() {
  const hasSeenPassportGuide = usePassportStore((state) => state.hasSeenPassportGuide)
  const markPassportGuideSeen = usePassportStore((state) => state.markPassportGuideSeen)
  const [guideOpen, setGuideOpen] = useState(!hasSeenPassportGuide)

  const closeGuide = () => {
    setGuideOpen(false)
    markPassportGuideSeen()
  }

  return (
    <div className="flex flex-col gap-3">
      {guideOpen && (
        <GuideModal title="How to use this" onClose={closeGuide}>
          <p>
            Each phase below has suggested AI tools. Use one, then click <strong>"I used this"</strong>{' '}
            to stamp the phase — or add your own tool from a phase and it'll stamp automatically.
          </p>
          <p>
            Core phases track your progress through the customer lifecycle; the bonus phases (SBR,
            Customer organization, Resource gathering) are optional. Stamp all seven core phases to
            complete your passport.
          </p>
          <p>Stamped a phase by accident? Click "Stamped ✓ · Undo" on that phase to remove it.</p>
        </GuideModal>
      )}
      <button
        type="button"
        onClick={() => setGuideOpen(true)}
        aria-label="How to use the Passport"
        title="How to use the Passport"
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center self-end rounded-full bg-slate-100 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
      >
        ?
      </button>
      <PassportFull />
    </div>
  )
}
