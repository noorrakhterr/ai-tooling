import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ALL_PHASES } from '../data/phases'
import { useTools } from '../hooks/useTools'
import { useEngagement } from '../hooks/useEngagement'
import { ToolCard } from '../components/ToolCard'
import { AddAiToolForm } from '../components/AddAiToolForm'
import { EmptyState } from '../components/EmptyState'
import { GuideModal } from '../components/GuideModal'
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Tool Catalog</h1>
            <p className="mt-1 text-sm text-slate-500">
              Some entries are validated and ready to use; others are placeholders pending the full AI
              &amp; Gong resource inventory.
            </p>
          </div>
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

      {guideOpen && (
        <GuideModal title="Using the Tool Catalog" onClose={closeGuide}>
          <p>
            Sort tools by filters or search. Click the star to add to My Tools. When you click "My
            Tools," the site indicates that you use this tool. You can also leave a comment on a
            tool you have feedback for or want to show appreciation for.
          </p>
          <p>You can also add a tool to our repository by clicking Add AI Tool.</p>
        </GuideModal>
      )}

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPhaseFilter('all')}
            className={[
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              phaseFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            ].join(' ')}
          >
            All phases
          </button>
          {ALL_PHASES.map((phase) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => setPhaseFilter(phase.id)}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                phaseFilter === phase.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              ].join(' ')}
            >
              {phase.title}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSortByMostUsed((current) => !current)}
            className={[
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              sortByMostUsed ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            ].join(' ')}
          >
            Sort: Most used
          </button>
        </div>
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
