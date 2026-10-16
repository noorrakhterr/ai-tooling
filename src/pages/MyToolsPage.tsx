import { ALL_PHASES } from '../data/phases'
import { SAMPLE_TOOLS } from '../data/tools'
import { usePassportStore } from '../state/usePassportStore'
import { ToolCard } from '../components/ToolCard'
import { EmptyState } from '../components/EmptyState'

export function MyToolsPage() {
  const favoriteToolIds = usePassportStore((state) => state.favoriteToolIds)
  const favoriteTools = SAMPLE_TOOLS.filter((tool) => favoriteToolIds.includes(tool.id))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">My Tools</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tools you've favorited from the catalog, grouped by lifecycle phase.
        </p>
      </div>

      {favoriteTools.length === 0 ? (
        <EmptyState
          icon="⭐"
          title="No favorites yet"
          message="Favorite a tool from the Catalog or a phase panel on Home to see it here."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {ALL_PHASES.map((phase) => {
            const toolsForPhase = favoriteTools.filter((tool) => tool.phaseIds.includes(phase.id))
            if (toolsForPhase.length === 0) return null
            return (
              <section key={phase.id}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {phase.title}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {toolsForPhase.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
