import type { ReferenceResourceLink } from '../types'

interface ResourceLinksModalProps {
  title: string
  links: ReferenceResourceLink[]
  onClose: () => void
}

export function ResourceLinksModal({ title, links, onClose }: ResourceLinksModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div
        className="max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Close
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
