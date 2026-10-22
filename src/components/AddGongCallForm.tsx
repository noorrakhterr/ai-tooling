import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Recording } from '../types'
import { iddb } from '../lib/iddb'

interface AddGongCallFormProps {
  onAdded: (recording: Recording) => void
}

export function AddGongCallForm({ onAdded }: AddGongCallFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [customer, setCustomer] = useState('')
  const [owner, setOwner] = useState('')
  const [labelsInput, setLabelsInput] = useState('')
  const [transcript, setTranscript] = useState('')
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

    const labels = labelsInput
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean)

    setSubmitting(true)
    const { data, error: insertError } = await iddb.table<Recording>('gong_recordings').insertOne({
      title: title.trim(),
      link: link.trim(),
      customer: customer.trim() || undefined,
      owner: owner.trim() || undefined,
      callDate: new Date().toISOString().slice(0, 10),
      labels,
      transcript: transcript.trim() || undefined,
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
        className="self-start rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Add Gong Call
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Add Gong Call</h3>
        <button
          type="button"
          onClick={() => {
            resetForm()
            setOpen(false)
          }}
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
      <p className="text-xs text-slate-400">Visible to everyone on the team once added.</p>

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
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
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
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
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
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="add-call-transcript" className="text-xs font-semibold text-slate-700">
          Transcript (optional)
        </label>
        <textarea
          id="add-call-transcript"
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="Paste the call transcript, if you have it."
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-400">
          Not used anywhere yet — saved for a possible future "find me an example call" search feature.
        </p>
      </div>

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? 'Adding…' : 'Add call for everyone'}
      </button>
    </form>
  )
}
