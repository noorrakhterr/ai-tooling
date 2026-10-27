import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ToolComment } from '../types'
import { displayName } from '../lib/displayName'

interface ToolCommentsProps {
  /** Already filtered to this tool by the caller. */
  comments: ToolComment[]
  currentUserEmail: string | null
  onAdd: (body: string) => Promise<{ error: { message: string } | null }>
  onDelete: (commentId: string) => Promise<{ error: { message: string } | null }>
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function ToolComments({ comments, currentUserEmail, onAdd, onDelete }: ToolCommentsProps) {
  const [open, setOpen] = useState(false)
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!body.trim()) return
    setError(null)
    setSubmitting(true)
    const { error: addError } = await onAdd(body.trim())
    setSubmitting(false)
    if (addError) {
      setError(addError.message)
      return
    }
    setBody('')
  }

  return (
    <div className="border-t border-slate-100 pt-2">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        {comments.length > 0 ? `💬 ${comments.length} note${comments.length === 1 ? '' : 's'}` : 'Leave a note'}
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {sortedComments.length === 0 ? (
            <p className="text-xs text-slate-400">No notes yet — be the first to share one.</p>
          ) : (
            sortedComments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-slate-50 p-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">
                    {displayName(comment.userEmail)}
                    <span className="ml-1.5 font-normal text-slate-400">{formatDate(comment.createdAt)}</span>
                  </p>
                  {comment.userEmail === currentUserEmail && (
                    <button
                      type="button"
                      onClick={() => onDelete(comment.id)}
                      className="text-xs font-medium text-rose-500 hover:text-rose-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{comment.body}</p>
              </div>
            ))
          )}

          <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-2">
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Share a note or what you liked about this tool…"
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              className="self-start rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
