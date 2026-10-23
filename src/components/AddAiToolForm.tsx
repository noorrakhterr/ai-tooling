import { useState } from 'react'
import type { FormEvent } from 'react'
import { ALL_PHASES } from '../data/phases'
import type { Tool, ToolType } from '../types'
import { iddb } from '../lib/iddb'

const TOOL_TYPES: ToolType[] = ['Gem', 'Agent', 'Skill', 'Prompt', 'Notebook', 'Gong resource', 'Other']

interface AddAiToolFormProps {
  onAdded: (tool: Tool) => void
  /** When set, the form opens pre-filled and submits as an update instead of an insert. */
  editingTool?: Tool
  onUpdated?: (tool: Tool) => void
  /** Called when an edit is cancelled, so the parent can close the edit view. */
  onCancelEdit?: () => void
}

export function AddAiToolForm({ onAdded, editingTool, onUpdated, onCancelEdit }: AddAiToolFormProps) {
  const isEditing = Boolean(editingTool)
  const [open, setOpen] = useState(isEditing)
  const [name, setName] = useState(editingTool?.name ?? '')
  const [type, setType] = useState<ToolType>(editingTool?.type ?? 'Gem')
  const [description, setDescription] = useState(editingTool?.description ?? '')
  const [link, setLink] = useState(editingTool?.link ?? '')
  const [selectedPhaseIds, setSelectedPhaseIds] = useState<string[]>(editingTool?.phaseIds ?? [])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const togglePhase = (phaseId: string) => {
    setSelectedPhaseIds((current) =>
      current.includes(phaseId) ? current.filter((id) => id !== phaseId) : [...current, phaseId],
    )
  }

  const resetForm = () => {
    setName('')
    setType('Gem')
    setDescription('')
    setLink('')
    setSelectedPhaseIds([])
    setError(null)
  }

  const handleCancel = () => {
    if (isEditing) {
      onCancelEdit?.()
      return
    }
    resetForm()
    setOpen(false)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Give the tool a name.')
      return
    }
    if (!description.trim()) {
      setError('Add a short description.')
      return
    }
    if (!link.trim()) {
      setError('Add a link.')
      return
    }

    const values = {
      name: name.trim(),
      type,
      description: description.trim(),
      link: link.trim(),
      phaseIds: selectedPhaseIds,
    }

    setSubmitting(true)
    if (isEditing && editingTool) {
      const { data, error: updateError } = await iddb.table<Tool>('ai_tools').updateOne(editingTool.id, values)
      setSubmitting(false)
      if (updateError || !data) {
        setError(updateError?.message ?? 'Something went wrong updating the tool.')
        return
      }
      onUpdated?.(data)
      return
    }

    const { data, error: insertError } = await iddb.table<Tool>('ai_tools').insertOne(values)
    setSubmitting(false)

    if (insertError || !data) {
      setError(insertError?.message ?? 'Something went wrong adding the tool.')
      return
    }

    onAdded(data)
    resetForm()
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Add AI Tool
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{isEditing ? 'Edit AI Tool' : 'Add AI Tool'}</h3>
        <button
          type="button"
          onClick={handleCancel}
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
      <p className="text-xs text-slate-400">Visible to everyone on the team once {isEditing ? 'saved' : 'added'}.</p>

      <div>
        <label htmlFor="add-tool-name" className="text-xs font-semibold text-slate-700">
          Name
        </label>
        <input
          id="add-tool-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Transcript to Followup Email Gem"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="add-tool-type" className="text-xs font-semibold text-slate-700">
          Type
        </label>
        <select
          id="add-tool-type"
          value={type}
          onChange={(event) => setType(event.target.value as ToolType)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          {TOOL_TYPES.map((toolType) => (
            <option key={toolType} value={toolType}>
              {toolType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="add-tool-description" className="text-xs font-semibold text-slate-700">
          Description
        </label>
        <textarea
          id="add-tool-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What does this tool do, and when should a CSM use it?"
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="add-tool-link" className="text-xs font-semibold text-slate-700">
          Link
        </label>
        <input
          id="add-tool-link"
          type="text"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://…"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
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
        disabled={submitting}
        className="self-start rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add tool for everyone'}
      </button>
    </form>
  )
}
