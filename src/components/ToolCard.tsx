import { useState } from 'react'
import type { Tool, ToolComment } from '../types'
import { usePassportStore } from '../state/usePassportStore'
import { iddb } from '../lib/iddb'
import { ToolComments } from './ToolComments'
import { getPhaseById } from '../data/phases'

interface ToolCardEngagement {
  usageCount: number
  isUsingIt: boolean
  onToggleUsage: () => void
  comments: ToolComment[]
  currentUserEmail: string | null
  onAddComment: (body: string) => Promise<{ error: { message: string } | null }>
  onDeleteComment: (commentId: string) => Promise<{ error: { message: string } | null }>
}

interface ToolCardProps {
  tool: Tool
  /** When set, shows a "Mark used" button that stamps this phase. */
  phaseIdToStamp?: string
  /** When set, shows Edit/Delete controls for this tool (the shared catalog, not local-only entries). */
  onEdit?: (tool: Tool) => void
  onDeleted?: (id: string) => void
  /** When set, shows the team "I use this" toggle + comments section. Only CatalogPage passes this. */
  engagement?: ToolCardEngagement
}

const TYPE_STYLES: Record<Tool['type'], string> = {
  'Gong resource': 'bg-amber-50 text-amber-700',
  Gem: 'bg-brand-50 text-brand-700',
  Agent: 'bg-fuchsia-50 text-fuchsia-700',
  Skill: 'bg-emerald-50 text-emerald-700',
  Prompt: 'bg-sky-50 text-sky-700',
  Notebook: 'bg-accent-50 text-accent-700',
  Other: 'bg-slate-100 text-slate-700',
}

export function ToolCard({ tool, phaseIdToStamp, onEdit, onDeleted, engagement }: ToolCardProps) {
  const isToolFavorited = usePassportStore((state) => state.isToolFavorited)
  const toggleFavorite = usePassportStore((state) => state.toggleFavorite)
  const stampPhase = usePassportStore((state) => state.stampPhase)
  const isPhaseStamped = usePassportStore((state) => state.isPhaseStamped)
  const [deleting, setDeleting] = useState(false)
  const [showUndoStar, setShowUndoStar] = useState(false)

  const favorited = engagement ? engagement.isUsingIt : isToolFavorited(tool.id)
  const phaseStamped = phaseIdToStamp ? isPhaseStamped(phaseIdToStamp) : false

  const handleToggleStar = () => {
    const turningOn = !favorited
    toggleFavorite(tool.id)
    engagement?.onToggleUsage()
    setShowUndoStar(turningOn)
    if (turningOn) {
      setTimeout(() => setShowUndoStar(false), 5000)
    }
  }

  const handleUndoStar = () => {
    toggleFavorite(tool.id)
    engagement?.onToggleUsage()
    setShowUndoStar(false)
  }

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
          {tool.phaseIds.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tool.phaseIds.map((phaseId) => {
                const phase = getPhaseById(phaseId)
                if (!phase) return null
                return (
                  <span
                    key={phaseId}
                    className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                  >
                    {phase.title}
                  </span>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleToggleStar}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={favorited}
            className={[
              'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg transition-colors',
              favorited ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:text-amber-500',
            ].join(' ')}
          >
            {favorited ? '★' : '☆'}
          </button>
          {showUndoStar && (
            <button
              type="button"
              onClick={handleUndoStar}
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Undo
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-600">{tool.description}</p>
      {engagement && !tool.comingSoon && (
        <p className="text-xs text-slate-500">
          {engagement.usageCount === 0
            ? 'No teammates using this yet'
            : `${engagement.usageCount} teammate${engagement.usageCount === 1 ? '' : 's'} using this`}
        </p>
      )}
      {engagement && (
        <ToolComments
          comments={engagement.comments}
          currentUserEmail={engagement.currentUserEmail}
          onAdd={engagement.onAddComment}
          onDelete={engagement.onDeleteComment}
        />
      )}
      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        {tool.comingSoon ? (
          <span className="text-sm font-medium text-slate-400">Not yet available</span>
        ) : tool.link ? (
          <a
            href={tool.link}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
            target="_blank"
            rel="noreferrer"
          >
            Open tool →
          </a>
        ) : (
          <span className="text-sm font-medium text-slate-400">No link provided</span>
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
                : 'bg-brand-600 text-white hover:bg-brand-700',
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
