import type { CustomTool } from '../types'
import { usePassportStore } from '../state/usePassportStore'

interface CustomToolCardProps {
  tool: CustomTool
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function CustomToolCard({ tool }: CustomToolCardProps) {
  const removeCustomTool = usePassportStore((state) => state.removeCustomTool)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            My upload
          </span>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">{tool.name}</h3>
        </div>
        <button
          type="button"
          onClick={() => removeCustomTool(tool.id)}
          aria-label="Remove uploaded tool"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:text-rose-500"
        >
          ×
        </button>
      </div>
      <p className="text-sm text-slate-600">
        {tool.fileName} · {formatFileSize(tool.fileSize)}
      </p>
      <a
        href={tool.fileDataUrl}
        download={tool.fileName}
        className="mt-auto text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        Download →
      </a>
    </div>
  )
}
