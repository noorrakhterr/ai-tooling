import { EmptyState } from '../components/EmptyState'

export function WorkflowsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Workflows</h1>
        <p className="mt-1 text-sm text-slate-500">
          Assign favorited tools to your own custom workflows and tasks.
        </p>
      </div>
      <EmptyState
        title="Coming soon"
        message="Custom workflows will let you organize favorited tools into your own named task sequences. Not yet available in this prototype."
      />
    </div>
  )
}
