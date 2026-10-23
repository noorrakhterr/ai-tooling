import { useState } from 'react'
import type { Recording } from '../types'
import { iddb } from '../lib/iddb'

interface RecordingCardProps {
  recording: Recording
  onEdit?: (recording: Recording) => void
  onDeleted?: (id: string) => void
}

export function RecordingCard({ recording, onEdit, onDeleted }: RecordingCardProps) {
  const [deleting, setDeleting] = useState(false)

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
      <h3 className="text-sm font-semibold text-slate-900">{recording.title}</h3>
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
          <span key={label} className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
            {label}
          </span>
        ))}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <a
          href={recording.link}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
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
