import { useState } from 'react'
import { PassportFull } from '../components/PassportFull'
import { PassportIntroModal } from '../components/PassportIntroModal'
import { usePassportStore } from '../state/usePassportStore'

export function PassportPage() {
  const markPassportIntroSeen = usePassportStore((state) => state.markPassportIntroSeen)
  const [introOpen, setIntroOpen] = useState(false)

  const closeIntro = () => {
    setIntroOpen(false)
    markPassportIntroSeen()
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIntroOpen(true)}
        aria-label="What's the passport?"
        title="What's the passport?"
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center self-end rounded-full bg-slate-100 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
      >
        ?
      </button>
      <PassportFull />
      {introOpen && <PassportIntroModal onClose={closeIntro} />}
    </div>
  )
}
