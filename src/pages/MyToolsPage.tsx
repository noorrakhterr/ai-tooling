import { ALL_PHASES } from '../data/phases'
import { TOOLS } from '../data/tools'
import { usePassportStore } from '../state/usePassportStore'
import { ToolCard } from '../components/ToolCard'
import { CustomToolCard } from '../components/CustomToolCard'
import { CustomToolUploadForm } from '../components/CustomToolUploadForm'
import { EmptyState } from '../components/EmptyState'

export function MyToolsPage() {
  const favoriteToolIds = usePassportStore((state) => state.favoriteToolIds)
  const customTools = usePassportStore((state) => state.customTools)
  const favoriteTools = TOOLS.filter((tool) => favoriteToolIds.includes(tool.id))

  const unassignedCustomTools = customTools.filter((tool) => tool.phaseIds.length === 0)
  const hasAnyTools = favoriteTools.length > 0 || customTools.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">My Tools</h1>
        <p className="mt-1 text-sm text-slate-500">
          Favorited catalog tools and your own uploaded tools, grouped by lifecycle phase.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Upload your own tool
        </h2>
        <CustomToolUploadForm />
      </section>

      {!hasAnyTools ? (
        <EmptyState
          title="No tools yet"
          message="Favorite a tool from the Catalog, or upload one of your own above, to see it here."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {ALL_PHASES.map((phase) => {
            const toolsForPhase = favoriteTools.filter((tool) => tool.phaseIds.includes(phase.id))
            const customToolsForPhase = customTools.filter((tool) => tool.phaseIds.includes(phase.id))
            if (toolsForPhase.length === 0 && customToolsForPhase.length === 0) return null
            return (
              <section key={phase.id}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {phase.title}
                </h2>
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

          {unassignedCustomTools.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Unassigned
              </h2>
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
