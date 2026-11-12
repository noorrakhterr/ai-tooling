import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/passport', label: 'Passport' },
  { to: '/catalog', label: 'Tool Catalog' },
  { to: '/gong-library', label: 'Gong Library' },
  { to: '/my-tools', label: 'My Tools' },
  // Workflows hidden from nav for now — route still exists at /workflows
]

export function TopNav() {
  return (
    <header className="flex h-14 w-full flex-shrink-0 items-center gap-6 border-b border-slate-200 bg-white px-6">
      <span className="font-heading text-sm font-semibold text-slate-900">CS Scale AI Enablement</span>
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
