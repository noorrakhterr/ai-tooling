import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/catalog', label: 'Tool Catalog', icon: '🧰' },
  { to: '/gong-library', label: 'Gong Library', icon: '🎧' },
  { to: '/my-tools', label: 'My Tools', icon: '⭐' },
  { to: '/workflows', label: 'Workflows', icon: '🧭' },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600" />
        <span className="text-sm font-semibold text-slate-900">AI Tooling Passport</span>
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
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
