import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Recording } from '../types'
import { iddb } from '../lib/iddb'

interface AddGongCallFormProps {
  onAdded: (recording: Recording) => void
  /** When set, the form opens pre-filled and submits as an update instead of an insert. */
  editingRecording?: Recording
  onUpdated?: (recording: Recording) => void
  /** Called when an edit is cancelled, so the parent can close the edit view. */
  onCancelEdit?: () => void
}

export function AddGongCallForm({ onAdded, editingRecording, onUpdated, onCancelEdit }: AddGongCallFormProps) {
  const isEditing = Boolean(editingRecording)
  const [open, setOpen] = useState(isEditing)
  const [title, setTitle] = useState(editingRecording?.title ?? '')
  const [link, setLink] = useState(editingRecording?.link ?? '')
  const [customer, setCustomer] = useState(editingRecording?.customer ?? '')
  const [owner, setOwner] = useState(editingRecording?.owner ?? '')
  const [labelsInput, setLabelsInput] = useState(editingRecording?.labels.join(', ') ?? '')
  const [transcript, setTranscript] = useState(editingRecording?.transcript ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setTitle('')
    setLink('')
    setCustomer('')
    setOwner('')
    setLabelsInput('')
    setTranscript('')
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

    if (!title.trim()) {
      setError('Give the call a title.')
      return
    }
    if (!link.trim()) {
      setError('Add the Gong link.')
      return
    }
    if (!transcript.trim()) {
      setError('Add the call transcript.')
      return
    }

    const labels = labelsInput
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean)

    const values = {
      title: title.trim(),
      link: link.trim(),
      customer: customer.trim() || undefined,
      owner: owner.trim() || undefined,
      labels,
      transcript: transcript.trim(),
    }

    setSubmitting(true)
    if (isEditing && editingRecording) {
      const { data, error: updateError } = await iddb
        .table<Recording>('gong_recordings')
        .updateOne(editingRecording.id, values)
      setSubmitting(false)
      if (updateError || !data) {
        setError(updateError?.message ?? 'Something went wrong updating the call.')
        return
      }
      onUpdated?.(data)
      return
    }

    const { data, error: insertError } = await iddb.table<Recording>('gong_recordings').insertOne({
      ...values,
      callDate: editingRecording?.callDate ?? new Date().toISOString().slice(0, 10),
    })
    setSubmitting(false)

    if (insertError || !data) {
      setError(insertError?.message ?? 'Something went wrong adding the call.')
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
        className="self-start rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Add Gong Call
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={handleCancel}>
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{isEditing ? 'Edit Gong Call' : 'Add Gong Call'}</h3>
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
          <label htmlFor="add-call-title" className="text-xs font-semibold text-slate-700">
            Title
          </label>
          <input
            id="add-call-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Device Assurance Policy walkthrough"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="add-call-link" className="text-xs font-semibold text-slate-700">
            Gong link
          </label>
          <input
            id="add-call-link"
            type="text"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://…app.gong.io/call?id=…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="add-call-customer" className="text-xs font-semibold text-slate-700">
              Customer (optional)
            </label>
            <input
              id="add-call-customer"
              type="text"
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="add-call-owner" className="text-xs font-semibold text-slate-700">
              Owner (optional)
            </label>
            <input
              id="add-call-owner"
              type="text"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="add-call-labels" className="text-xs font-semibold text-slate-700">
            Labels (comma-separated)
          </label>
          <input
            id="add-call-labels"
            type="text"
            value={labelsInput}
            onChange={(event) => setLabelsInput(event.target.value)}
            placeholder="e.g. FastPass, Device Assurance"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="add-call-transcript" className="text-xs font-semibold text-slate-700">
            Transcript
          </label>
          <textarea
            id="add-call-transcript"
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Paste the call transcript."
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-400">
            Not used for search yet — saved for a possible future "find me an example call" feature.
          </p>
        </div>

        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="self-start rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add call for everyone'}
        </button>
      </form>
    </div>
  )
}
