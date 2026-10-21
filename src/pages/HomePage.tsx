import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome</h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          CS Scale AI Enablement is a shared home for the AI tools and Gong resources available to
          Gold and Silver Scale CSMs. If you're new here, work through the enablement passport on
          the right to get oriented — otherwise, jump straight into the catalog or your saved tools.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          to="/catalog"
          className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
        >
          <h2 className="text-sm font-semibold text-slate-900">Tool Catalog</h2>
          <p className="text-sm text-slate-500">Browse AI tools by lifecycle phase.</p>
        </Link>
        <Link
          to="/gong-library"
          className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
        >
          <h2 className="text-sm font-semibold text-slate-900">Gong Library</h2>
          <p className="text-sm text-slate-500">Search call recordings by phase.</p>
        </Link>
        <Link
          to="/my-tools"
          className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
        >
          <h2 className="text-sm font-semibold text-slate-900">My Tools</h2>
          <p className="text-sm text-slate-500">Favorited and your own uploaded tools.</p>
        </Link>
      </div>
    </div>
  )
}
