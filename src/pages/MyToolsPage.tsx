import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ALL_PHASES } from '../data/phases'
import { useTools } from '../hooks/useTools'
import { usePassportStore } from '../state/usePassportStore'
import { ToolCard } from '../components/ToolCard'
import { CustomToolCard } from '../components/CustomToolCard'
import { CustomToolUploadForm } from '../components/CustomToolUploadForm'
import { EmptyState } from '../components/EmptyState'
import { GuideModal } from '../components/GuideModal'
import { FilterSelect } from '../components/FilterSelect'

export function MyToolsPage() {
  const { tools } = useTools()
  const favoriteToolIds = usePassportStore((state) => state.favoriteToolIds)
  const customTools = usePassportStore((state) => state.customTools)
  const favoriteTools = tools.filter((tool) => favoriteToolIds.includes(tool.id))

  const [phaseFilter, setPhaseFilter] = useState('all')

  const visiblePhases = useMemo(
    () => (phaseFilter === 'all' ? ALL_PHASES : ALL_PHASES.filter((phase) => phase.id === phaseFilter)),
    [phaseFilter],
  )

  const unassignedCustomTools = customTools.filter((tool) => tool.phaseIds.length === 0)
  const hasAnyTools = favoriteTools.length > 0 || customTools.length > 0

  const [searchParams] = useSearchParams()
  const initialPhaseId = searchParams.get('phase') ?? undefined

  const hasSeenMyToolsGuide = usePassportStore((state) => state.hasSeenMyToolsGuide)
  const markMyToolsGuideSeen = usePassportStore((state) => state.markMyToolsGuideSeen)
  const [guideOpen, setGuideOpen] = useState(!hasSeenMyToolsGuide)

  const closeGuide = () => {
    setGuideOpen(false)
    markMyToolsGuideSeen()
  }

  return (
    <div className="flex flex-col gap-6">
      {guideOpen && (
        <GuideModal title="How to use this" onClose={closeGuide}>
          <p>
            This holds all the tools you've starred for easy access. You can also add your own
            tool here without having it be shared with the entire team.
          </p>
          <p>
            Gong calls you save for later from the Gong Library show up on their own Saved Calls
            page, filterable the same way as the Gong Library.
          </p>
        </GuideModal>
      )}

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-slate-900">My Tools</h1>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          aria-label="How to use My Tools"
          title="How to use My Tools"
          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
        >
          ?
        </button>
      </div>

      <div className="flex flex-wrap items-start gap-3">
        <CustomToolUploadForm initialPhaseId={initialPhaseId} />
        <Link
          to="/saved-calls"
          className="self-start rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Saved Calls
        </Link>
      </div>

      {hasAnyTools && (
        <FilterSelect value={phaseFilter} onChange={setPhaseFilter}>
          <option value="all">All phases</option>
          {ALL_PHASES.map((phase) => (
            <option key={phase.id} value={phase.id}>
              {phase.title}
            </option>
          ))}
        </FilterSelect>
      )}

      {!hasAnyTools ? (
        <EmptyState
          title="No tools yet"
          message="Favorite a tool from the Catalog, or upload one of your own above, to see it here."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {visiblePhases.map((phase) => {
            const toolsForPhase = favoriteTools.filter((tool) => tool.phaseIds.includes(phase.id))
            const customToolsForPhase = customTools.filter((tool) => tool.phaseIds.includes(phase.id))
            if (toolsForPhase.length === 0 && customToolsForPhase.length === 0) return null
            return (
              <section key={phase.id}>
                <h2 className="mb-3 text-sm font-semibold text-slate-700">{phase.title}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {toolsForPhase.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                  {customToolsForPhase.map((tool) => (
                    <CustomToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )
          })}

          {phaseFilter === 'all' && unassignedCustomTools.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Unassigned</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unassignedCustomTools.map((tool) => (
                  <CustomToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
