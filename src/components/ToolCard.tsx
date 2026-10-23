import { useState } from 'react'
import type { Tool } from '../types'
import { usePassportStore } from '../state/usePassportStore'
import { iddb } from '../lib/iddb'

interface ToolCardProps {
  tool: Tool
  /** When set, shows a "Mark used" button that stamps this phase. */
  phaseIdToStamp?: string
  /** When set, shows Edit/Delete controls for this tool (the shared catalog, not local-only entries). */
  onEdit?: (tool: Tool) => void
  onDeleted?: (id: string) => void
}

const TYPE_STYLES: Record<Tool['type'], string> = {
  'Gong resource': 'bg-amber-50 text-amber-700',
  Gem: 'bg-indigo-50 text-indigo-700',
  Agent: 'bg-fuchsia-50 text-fuchsia-700',
  Skill: 'bg-emerald-50 text-emerald-700',
  Prompt: 'bg-sky-50 text-sky-700',
  Notebook: 'bg-violet-50 text-violet-700',
  Other: 'bg-slate-100 text-slate-700',
}

export function ToolCard({ tool, phaseIdToStamp, onEdit, onDeleted }: ToolCardProps) {
  const isToolFavorited = usePassportStore((state) => state.isToolFavorited)
  const toggleFavorite = usePassportStore((state) => state.toggleFavorite)
  const stampPhase = usePassportStore((state) => state.stampPhase)
  const isPhaseStamped = usePassportStore((state) => state.isPhaseStamped)
  const [deleting, setDeleting] = useState(false)

  const favorited = isToolFavorited(tool.id)
  const phaseStamped = phaseIdToStamp ? isPhaseStamped(phaseIdToStamp) : false

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${tool.name}" for everyone? This can't be undone.`)) return
    setDeleting(true)
    const { error } = await iddb.table<Tool>('ai_tools').deleteOne(tool.id)
    setDeleting(false)
    if (error) {
      window.alert(error.message)
      return
    }
    onDeleted?.(tool.id)
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_STYLES[tool.type]}`}>
              {tool.type}
            </span>
            {tool.comingSoon && (
              <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                Coming soon
              </span>
            )}
          </div>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">{tool.name}</h3>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(tool.id)}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={favorited}
          className={[
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg transition-colors',
            favorited ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:text-amber-500',
          ].join(' ')}
        >
          {favorited ? '★' : '☆'}
        </button>
      </div>
      <p className="text-sm text-slate-600">{tool.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        {tool.comingSoon ? (
          <span className="text-sm font-medium text-slate-400">Not yet available</span>
        ) : (
          <a
            href={tool.link}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            target="_blank"
            rel="noreferrer"
          >
            Open tool →
          </a>
        )}
        {phaseIdToStamp && !tool.comingSoon && (
          <button
            type="button"
            onClick={() => stampPhase(phaseIdToStamp)}
            disabled={phaseStamped}
            className={[
              'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              phaseStamped
                ? 'cursor-default bg-emerald-100 text-emerald-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700',
            ].join(' ')}
          >
            {phaseStamped ? 'Stamped ✓' : "I used this"}
          </button>
        )}
        {(onEdit || onDeleted) && (
          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(tool)}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Edit
              </button>
            )}
            {onDeleted && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs font-medium text-rose-500 hover:text-rose-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
