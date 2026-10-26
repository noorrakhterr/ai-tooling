import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { usePassportStore } from '../state/usePassportStore'
import { PassportIntroModal } from './PassportIntroModal'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/passport', label: 'Passport' },
  { to: '/catalog', label: 'Tool Catalog' },
  { to: '/gong-library', label: 'Gong Library' },
  { to: '/my-tools', label: 'My Tools' },
  { to: '/workflows', label: 'Workflows' },
]

export function Sidebar() {
  const hasSeenPassportIntro = usePassportStore((state) => state.hasSeenPassportIntro)
  const markPassportIntroSeen = usePassportStore((state) => state.markPassportIntroSeen)
  const [introOpen, setIntroOpen] = useState(!hasSeenPassportIntro)

  const closeIntro = () => {
    setIntroOpen(false)
    markPassportIntroSeen()
  }

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
          <div key={item.to} className="flex items-center">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
            {item.to === '/passport' && (
              <button
                type="button"
                onClick={() => setIntroOpen(true)}
                aria-label="What's the passport?"
                title="What's the passport?"
                className="mr-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
              >
                ?
              </button>
            )}
          </div>
        ))}
      </nav>
      {introOpen && <PassportIntroModal onClose={closeIntro} />}
    </aside>
  )
}
