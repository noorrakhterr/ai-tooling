import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { ALL_PHASES } from '../data/phases'
import type { CustomTool } from '../types'
import { usePassportStore } from '../state/usePassportStore'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function CustomToolUploadForm() {
  const addCustomTool = usePassportStore((state) => state.addCustomTool)

  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [selectedPhaseIds, setSelectedPhaseIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const togglePhase = (phaseId: string) => {
    setSelectedPhaseIds((current) =>
      current.includes(phaseId) ? current.filter((id) => id !== phaseId) : [...current, phaseId],
    )
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null
    setFile(selected)
    if (selected && !name) {
      setName(selected.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Give your tool a name.')
      return
    }
    if (!file) {
      setError('Choose a file to upload.')
      return
    }

    const fileDataUrl = await fileToDataUrl(file)
    const tool: CustomTool = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      phaseIds: selectedPhaseIds,
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      fileSize: file.size,
      fileDataUrl,
      addedAt: new Date().toISOString(),
    }
    addCustomTool(tool)

    setName('')
    setFile(null)
    setSelectedPhaseIds([])
    const fileInput = document.getElementById('custom-tool-file') as HTMLInputElement | null
    if (fileInput) fileInput.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <label htmlFor="custom-tool-name" className="text-xs font-semibold text-slate-700">
          Tool name
        </label>
        <input
          id="custom-tool-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. My discovery call checklist"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="custom-tool-file" className="text-xs font-semibold text-slate-700">
          File
        </label>
        <input
          id="custom-tool-file"
          type="file"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-slate-600"
        />
        <p className="mt-1 text-xs text-slate-400">
          Stored only in this browser — never uploaded anywhere.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-700">Assign to phases (optional)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ALL_PHASES.map((phase) => {
            const isSelected = selectedPhaseIds.includes(phase.id)
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => togglePhase(phase.id)}
                className={[
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                ].join(' ')}
              >
                {phase.title}
              </button>
            )
          })}
        </div>
      </div>

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

      <button
        type="submit"
        className="self-start rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Add to My Tools
      </button>
    </form>
  )
}
