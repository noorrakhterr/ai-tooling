import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { Recording } from '../types'
import { iddb } from '../lib/iddb'
import { parseCsvRecords } from '../lib/csv'

interface BulkImportGongCallsProps {
  existingRecordings: Recording[]
  onImported: (recordings: Recording[]) => void
}

const SAMPLE_CSV = `title,link,customer,owner,callDate,labels,transcript
Device Assurance Policy walkthrough,https://us-5814.app.gong.io/call?id=111,Acme Corp,Noor Akhter,2026-10-01,"FastPass, Device Assurance",
FastPass rollout check-in,https://us-5814.app.gong.io/call?id=222,Globex,Iyana Johnson,2026-10-05,FastPass,
`

function downloadSampleCsv() {
  const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'gong-calls-sample.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function BulkImportGongCalls({ existingRecordings, onImported }: BulkImportGongCallsProps) {
  const [open, setOpen] = useState(false)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ added: number; skipped: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError(null)
    setResult(null)
    setImporting(true)

    try {
      const text = await file.text()
      const rows = parseCsvRecords(text)

      const existingLinks = new Set(existingRecordings.map((recording) => recording.link.trim()))
      const seenInFile = new Set<string>()
      const added: Recording[] = []
      let skipped = 0

      for (const row of rows) {
        const link = (row.link ?? '').trim()
        const title = (row.title ?? '').trim()
        if (!link || !title) {
          skipped++
          continue
        }
        if (existingLinks.has(link) || seenInFile.has(link)) {
          skipped++
          continue
        }
        seenInFile.add(link)

        const labels = (row.labels ?? '')
          .split(',')
          .map((label) => label.trim())
          .filter(Boolean)

        const { data, error: insertError } = await iddb.table<Recording>('gong_recordings').insertOne({
          title,
          link,
          customer: row.customer?.trim() || undefined,
          owner: row.owner?.trim() || undefined,
          callDate: row.callDate?.trim() || new Date().toISOString().slice(0, 10),
          labels,
          transcript: row.transcript?.trim() || undefined,
        })

        if (insertError || !data) {
          skipped++
          continue
        }
        added.push(data)
      }

      if (added.length > 0) onImported(added)
      setResult({ added: added.length, skipped })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong reading that file.')
    } finally {
      setImporting(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
      >
        Import from CSV
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Import Gong calls from CSV</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Close
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Columns: <code>title, link, customer, owner, callDate, labels, transcript</code>. Only{' '}
        <code>title</code> and <code>link</code> are required; <code>labels</code> is
        comma-separated within its own field (quote it, e.g. <code>"FastPass, Gold Scale"</code>).
        Calls whose <code>link</code> already exists in the library are skipped automatically.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={importing}
          className="text-sm text-slate-600"
        />
        <button
          type="button"
          onClick={downloadSampleCsv}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          Download sample CSV
        </button>
      </div>
      {importing && <p className="text-xs text-slate-500">Importing…</p>}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      {result && (
        <p className="text-xs font-medium text-emerald-700">
          Added {result.added} new call{result.added === 1 ? '' : 's'}
          {result.skipped > 0 ? ` — skipped ${result.skipped} (already in the library or missing data)` : ''}.
        </p>
      )}
    </div>
  )
}
