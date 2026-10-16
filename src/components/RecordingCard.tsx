import type { Recording } from '../types'
import { getPhaseById } from '../data/phases'

interface RecordingCardProps {
  recording: Recording
}

export function RecordingCard({ recording }: RecordingCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{recording.title}</h3>
      <p className="text-sm text-slate-600">{recording.customer}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>{recording.callDate}</span>
        {recording.phaseIds.map((phaseId) => {
          const phase = getPhaseById(phaseId)
          if (!phase) return null
          return (
            <span key={phaseId} className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
              {phase.title}
            </span>
          )
        })}
      </div>
      <a
        href={recording.link}
        target="_blank"
        rel="noreferrer"
        className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        Open recording →
      </a>
    </div>
  )
}
