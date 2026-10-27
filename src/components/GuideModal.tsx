import type { ReactNode } from 'react'

interface GuideModalProps {
  title: string
  children: ReactNode
  onClose: () => void
}

/** Generic version of PassportIntroModal's shell, for per-page "how to use this page" guides. */
export function GuideModal({ title, children, onClose }: GuideModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-heading text-xl font-semibold text-slate-900">{title}</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">{children}</div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
