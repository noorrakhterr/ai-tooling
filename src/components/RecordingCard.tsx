import { useState } from 'react'
import type { Recording } from '../types'
import { iddb } from '../lib/iddb'
import { usePassportStore } from '../state/usePassportStore'
import { labelColor } from '../lib/labelColors'

interface RecordingCardProps {
  recording: Recording
  onEdit?: (recording: Recording) => void
  onDeleted?: (id: string) => void
  /** When true, shows the "Save for later" bookmark button. */
  showSaveForLater?: boolean
}

export function RecordingCard({ recording, onEdit, onDeleted, showSaveForLater }: RecordingCardProps) {
  const [deleting, setDeleting] = useState(false)
  // Select the actual data, not an accessor function — selecting a stable
  // function reference (e.g. state.isRecordingSaved) never changes across
  // renders, so Zustand never re-renders this component when
  // savedRecordingIds updates. The click handler worked fine either way
  // (the store genuinely updated), but the star's fill never visually
  // reflected it until some unrelated re-render happened to occur.
  const savedRecordingIds = usePassportStore((state) => state.savedRecordingIds)
  const toggleSavedRecording = usePassportStore((state) => state.toggleSavedRecording)
  const saved = savedRecordingIds.includes(recording.id)

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${recording.title}" for everyone? This can't be undone.`)) return
    setDeleting(true)
    const { error } = await iddb.table<Recording>('gong_recordings').deleteOne(recording.id)
    setDeleting(false)
    if (error) {
      window.alert(error.message)
      return
    }
    onDeleted?.(recording.id)
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{recording.title}</h3>
        {showSaveForLater && (
          <button
            type="button"
            onClick={() => toggleSavedRecording(recording.id)}
            aria-label={saved ? 'Remove from saved calls' : 'Save for later'}
            aria-pressed={saved}
            className={[
              'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-base transition-colors',
              saved ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:text-amber-500',
            ].join(' ')}
          >
            {saved ? '★' : '☆'}
          </button>
        )}
      </div>
      {(recording.customer || recording.owner) && (
        <p className="text-sm text-slate-600">
          {recording.customer && <span>{recording.customer}</span>}
          {recording.customer && recording.owner && <span> · </span>}
          {recording.owner && <span>{recording.owner}</span>}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>{recording.callDate}</span>
        {recording.labels.map((label) => (
          <span key={label} className={`rounded-full px-2 py-0.5 font-medium ${labelColor(label)}`}>
            {label}
          </span>
        ))}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <a
          href={recording.link}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Open recording →
        </a>
        {(onEdit || onDeleted) && (
          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(recording)}
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
