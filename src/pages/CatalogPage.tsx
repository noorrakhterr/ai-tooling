import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ALL_PHASES } from '../data/phases'
import { useTools } from '../hooks/useTools'
import { useEngagement } from '../hooks/useEngagement'
import { ToolCard } from '../components/ToolCard'
import { AddAiToolForm } from '../components/AddAiToolForm'
import { EmptyState } from '../components/EmptyState'
import { GuideModal } from '../components/GuideModal'
import { FilterSelect } from '../components/FilterSelect'
import { usePassportStore } from '../state/usePassportStore'
import type { Tool } from '../types'

export function CatalogPage() {
  const { tools, addTool, updateTool, removeTool } = useTools()
  const engagement = useEngagement()
  const [query, setQuery] = useState('')
  const [phaseFilter, setPhaseFilter] = useState<string | 'all'>('all')
  const [editingTool, setEditingTool] = useState<Tool | null>(null)
  const [sortByMostUsed, setSortByMostUsed] = useState(false)
  const [searchParams] = useSearchParams()
  const openAddFromPhase = searchParams.get('openAdd') === '1'
  const initialPhaseId = searchParams.get('phase') ?? undefined

  const hasSeenCatalogGuide = usePassportStore((state) => state.hasSeenCatalogGuide)
  const markCatalogGuideSeen = usePassportStore((state) => state.markCatalogGuideSeen)
  const [guideOpen, setGuideOpen] = useState(!hasSeenCatalogGuide)

  const closeGuide = () => {
    setGuideOpen(false)
    markCatalogGuideSeen()
  }

  const displayedTools = useMemo(() => {
    const matches = tools.filter((tool) => {
      const matchesQuery =
        query.trim() === '' ||
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
      const matchesPhase = phaseFilter === 'all' || tool.phaseIds.includes(phaseFilter)
      return matchesQuery && matchesPhase
    })
    if (!sortByMostUsed) return matches
    return [...matches].sort((a, b) => engagement.usageCountForTool(b.id) - engagement.usageCountForTool(a.id))
  }, [tools, query, phaseFilter, sortByMostUsed, engagement])

  return (
    <div className="flex flex-col gap-5">
      {guideOpen && (
        <GuideModal title="How to use this" onClose={closeGuide}>
          <p>
            Sort tools by filters or search. Click the star to add to My Tools. When you click "My
            Tools," the site indicates that you use this tool. You can also leave a comment on a
            tool you have feedback for or want to show appreciation for.
          </p>
          <p>You can also add a tool to our repository by clicking Add AI Tool.</p>
        </GuideModal>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">Tool Catalog</h1>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            aria-label="How to use the Tool Catalog"
            title="How to use the Tool Catalog"
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            ?
          </button>
        </div>
        {!editingTool && !openAddFromPhase && <AddAiToolForm onAdded={addTool} />}
      </div>

      {editingTool && (
        <AddAiToolForm
          onAdded={addTool}
          editingTool={editingTool}
          onUpdated={(tool) => {
            updateTool(tool)
            setEditingTool(null)
          }}
          onCancelEdit={() => setEditingTool(null)}
        />
      )}

      {!editingTool && openAddFromPhase && <AddAiToolForm onAdded={addTool} initialPhaseId={initialPhaseId} />}

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none sm:max-w-xs"
        />
        <FilterSelect value={phaseFilter} onChange={setPhaseFilter}>
          <option value="all">All phases</option>
          {ALL_PHASES.map((phase) => (
            <option key={phase.id} value={phase.id}>
              {phase.title}
            </option>
          ))}
        </FilterSelect>
        <button
          type="button"
          onClick={() => setSortByMostUsed((current) => !current)}
          className={[
            'flex-shrink-0 rounded-full px-3 py-2 text-sm transition-colors',
            sortByMostUsed ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          ].join(' ')}
        >
          Sort: Most used
        </button>
      </div>

      {displayedTools.length === 0 ? (
        <EmptyState title="No tools match" message="Try a different search term or phase filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={setEditingTool}
              onDeleted={removeTool}
              engagement={{
                usageCount: engagement.usageCountForTool(tool.id),
                isUsingIt: Boolean(engagement.myUsageForTool(tool.id)),
                onToggleUsage: () => engagement.toggleUsage(tool.id),
                comments: engagement.commentsByToolId.get(tool.id) ?? [],
                currentUserEmail: engagement.currentUserEmail,
                onAddComment: (body) => engagement.addComment(tool.id, body),
                onDeleteComment: engagement.deleteComment,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
