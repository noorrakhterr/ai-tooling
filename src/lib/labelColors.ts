/**
 * Deterministic color for a Gong call label, so the same label always gets
 * the same color without needing a maintained label->color mapping.
 */
const PALETTE = [
  'bg-amber-100 text-amber-800',
  'bg-emerald-100 text-emerald-800',
  'bg-sky-100 text-sky-800',
  'bg-fuchsia-100 text-fuchsia-800',
  'bg-rose-100 text-rose-800',
  'bg-lime-100 text-lime-800',
  'bg-cyan-100 text-cyan-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
  'bg-purple-100 text-purple-800',
]

export function labelColor(label: string): string {
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0
  }
  return PALETTE[hash % PALETTE.length]
}
