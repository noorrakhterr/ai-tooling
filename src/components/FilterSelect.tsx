import type { ReactNode } from 'react'

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  children: ReactNode
}

/**
 * A `<select>` styled to match the rest of the app's compact filter controls.
 * Native selects add a lot of built-in padding before their default arrow —
 * `appearance-none` plus a small custom chevron keeps the box tight instead
 * of stretching wide with a big gap before the arrow.
 */
export function FilterSelect({ value, onChange, children }: FilterSelectProps) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
        ▼
      </span>
    </div>
  )
}
