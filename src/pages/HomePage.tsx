import { Link } from 'react-router-dom'
import { usePassportStore } from '../state/usePassportStore'
import { PassportFull } from '../components/PassportFull'
import { RESOURCES } from '../data/resources'

export function HomePage() {
  const passportDismissed = usePassportStore((state) => state.passportDismissed)

  return (
    <div className="flex flex-col gap-10">
      {!passportDismissed ? (
        <PassportFull showPhaseDetail={false} />
      ) : (
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            CS Scale AI Enablement is a shared home for the AI tools and Gong resources available
            to Gold and Silver Scale CSMs.
          </p>
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-slate-900">How-to guides</h2>
        <p className="mt-1 text-sm text-slate-500">
          Jump into any page, or browse reference material for learning the tools yourself.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/catalog"
            className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
          >
            <h3 className="text-sm font-semibold text-slate-900">Tool Catalog</h3>
            <p className="text-sm text-slate-500">Browse AI tools by lifecycle phase.</p>
          </Link>
          <Link
            to="/gong-library"
            className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
          >
            <h3 className="text-sm font-semibold text-slate-900">Gong Library</h3>
            <p className="text-sm text-slate-500">Search call recordings by phase.</p>
          </Link>
          <Link
            to="/my-tools"
            className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
          >
            <h3 className="text-sm font-semibold text-slate-900">My Tools</h3>
            <p className="text-sm text-slate-500">Favorited and your own uploaded tools.</p>
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {RESOURCES.map((resource) => (
            <a
              key={resource.id}
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
            >
              <h3 className="text-sm font-semibold text-slate-900">{resource.title}</h3>
              <p className="text-sm text-slate-600">{resource.description}</p>
              <span className="mt-auto text-sm font-medium text-indigo-600">Open resource →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
