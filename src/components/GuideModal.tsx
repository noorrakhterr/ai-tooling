import type { ReactNode } from 'react'

interface GuideModalProps {
  title: string
  children: ReactNode
  onClose: () => void
}

/** A "how to use this page" panel, pinned at the top of the page content (not an overlay). */
export function GuideModal({ title, children, onClose }: GuideModalProps) {
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-heading text-base font-semibold text-slate-900">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Close
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-2 text-sm text-slate-700">{children}</div>
    </div>
  )
}
