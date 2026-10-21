import { NavLink } from 'react-router-dom'
import { usePassportStore } from '../state/usePassportStore'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Tool Catalog' },
  { to: '/gong-library', label: 'Gong Library' },
  { to: '/my-tools', label: 'My Tools' },
  { to: '/workflows', label: 'Workflows' },
]

export function Sidebar() {
  const passportDismissed = usePassportStore((state) => state.passportDismissed)
  const reopenPassport = usePassportStore((state) => state.reopenPassport)

  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600" />
        <span className="font-heading text-sm font-semibold text-slate-900">
          CS Scale AI Enablement
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
        {passportDismissed && (
          <button
            type="button"
            onClick={reopenPassport}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Passport
          </button>
        )}
      </nav>
    </aside>
  )
}
