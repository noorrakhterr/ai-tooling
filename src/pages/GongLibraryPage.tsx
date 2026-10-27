import { useMemo, useState } from 'react'
import { useRecordings } from '../hooks/useRecordings'
import { RecordingCard } from '../components/RecordingCard'
import { AddGongCallForm } from '../components/AddGongCallForm'
import { BulkImportGongCalls } from '../components/BulkImportGongCalls'
import { EmptyState } from '../components/EmptyState'
import { GuideModal } from '../components/GuideModal'
import { FilterSelect } from '../components/FilterSelect'
import { usePassportStore } from '../state/usePassportStore'
import type { Recording } from '../types'

const ALL_CALLS = 'all'
const NO_LABEL = '__no_label__'

export function GongLibraryPage() {
  const { recordings, addRecording, addRecordings, updateRecording, removeRecording } = useRecordings()
  const [query, setQuery] = useState('')
  const [labelFilter, setLabelFilter] = useState(ALL_CALLS)
  const [csmFilter, setCsmFilter] = useState(ALL_CALLS)
  const [editingRecording, setEditingRecording] = useState<Recording | null>(null)

  const hasSeenGongGuide = usePassportStore((state) => state.hasSeenGongGuide)
  const markGongGuideSeen = usePassportStore((state) => state.markGongGuideSeen)
  const [guideOpen, setGuideOpen] = useState(!hasSeenGongGuide)

  const closeGuide = () => {
    setGuideOpen(false)
    markGongGuideSeen()
  }

  const allLabels = useMemo(() => {
    const labels = new Set<string>()
    recordings.forEach((recording) => recording.labels.forEach((label) => labels.add(label)))
    return [...labels].sort()
  }, [recordings])

  const allCsms = useMemo(() => {
    const owners = new Set<string>()
    recordings.forEach((recording) => {
      if (recording.owner) owners.add(recording.owner)
    })
    return [...owners].sort()
  }, [recordings])

  const filteredRecordings = useMemo(() => {
    return recordings.filter((recording) => {
      const matchesQuery =
        query.trim() === '' ||
        recording.title.toLowerCase().includes(query.toLowerCase()) ||
        (recording.customer?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (recording.owner?.toLowerCase().includes(query.toLowerCase()) ?? false)
      const matchesLabel =
        labelFilter === ALL_CALLS ||
        (labelFilter === NO_LABEL ? recording.labels.length === 0 : recording.labels.includes(labelFilter))
      const matchesCsm = csmFilter === ALL_CALLS || recording.owner === csmFilter
      return matchesQuery && matchesLabel && matchesCsm
    })
  }, [recordings, query, labelFilter, csmFilter])

  return (
    <div className="flex flex-col gap-5">
      {guideOpen && (
        <GuideModal title="How to use this" onClose={closeGuide}>
          <p>
            Access the team's useful Gong calls. Filter or search at the top. You can add a call
            of your own or one you found useful by clicking Add Gong Call, or import several at
            once with Import from CSV.
          </p>
          <p>
            Click the star on a call to save it for later — it'll show up in a "Saved Calls"
            section on My Tools.
          </p>
        </GuideModal>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">Gong Library</h1>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            aria-label="How to use the Gong Library"
            title="How to use the Gong Library"
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            ?
          </button>
        </div>
        {!editingRecording && (
          <div className="flex flex-shrink-0 items-start gap-2">
            <AddGongCallForm onAdded={addRecording} />
            <BulkImportGongCalls existingRecordings={recordings} onImported={addRecordings} />
          </div>
        )}
      </div>

      {editingRecording && (
        <AddGongCallForm
          onAdded={addRecording}
          editingRecording={editingRecording}
          onUpdated={(recording) => {
            updateRecording(recording)
            setEditingRecording(null)
          }}
          onCancelEdit={() => setEditingRecording(null)}
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search recordings by title, customer, or owner…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none sm:max-w-xs"
        />
        <FilterSelect value={labelFilter} onChange={setLabelFilter}>
          <option value={ALL_CALLS}>All calls</option>
          <option value={NO_LABEL}>No label</option>
          {allLabels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={csmFilter} onChange={setCsmFilter}>
          <option value={ALL_CALLS}>All CSMs</option>
          {allCsms.map((csm) => (
            <option key={csm} value={csm}>
              {csm}
            </option>
          ))}
        </FilterSelect>
      </div>

      {filteredRecordings.length === 0 ? (
        <EmptyState title="No recordings match" message="Try a different search term or filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecordings.map((recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
              onEdit={setEditingRecording}
              onDeleted={removeRecording}
              showSaveForLater
            />
          ))}
        </div>
      )}
    </div>
  )
}
