import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePassportStore } from '../state/usePassportStore'
import { PassportHomePreview } from '../components/PassportHomePreview'
import { ResourceLinksModal } from '../components/ResourceLinksModal'
import { RESOURCES } from '../data/resources'
import type { ReferenceResource } from '../types'

function WelcomeIntroBox() {
  const hasSeenPassportIntro = usePassportStore((state) => state.hasSeenPassportIntro)
  const markPassportIntroSeen = usePassportStore((state) => state.markPassportIntroSeen)
  const [expanded, setExpanded] = useState(!hasSeenPassportIntro)

  const toggle = () => {
    if (expanded) markPassportIntroSeen()
    setExpanded((current) => !current)
  }

  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
      <button type="button" onClick={toggle} className="flex w-full items-center justify-between gap-4 text-left">
        <h2 className="font-heading text-base font-semibold text-slate-900">
          Welcome to CS Scale's AI Tool Repository!
        </h2>
        <span className="flex-shrink-0 text-xs font-medium text-slate-500">{expanded ? 'Hide ▲' : 'Show ▼'}</span>
      </button>
      {expanded && (
        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-700">
          <p>
            To get started, you can use your custom Tool Passport to guide you through setting up
            AI tools that can support your customer engagement journey.
          </p>
          <p>
            The passport tracks your progress through the customer lifecycle, plus three bonus
            phases (SBR, Customer organization, Resource gathering).
          </p>
          <p>
            Each phase has suggested AI tools. Use one, then hit <strong>"I used this"</strong> on
            that tool to stamp the phase. Stamp all seven core phases and your passport is
            complete.
          </p>
          <p>
            It's entirely self-reported: there's no verification step. It's just a way to track
            where you've adopted AI in your workflow, and a nudge toward phases you haven't tried
            yet.
          </p>
          <p>
            Your tools are saved in "My Tools," so you can access the ones you like whenever you
            want to go back to them and add your own.
          </p>
        </div>
      )}
    </div>
  )
}

export function HomePage() {
  const passportDismissed = usePassportStore((state) => state.passportDismissed)
  const [openResource, setOpenResource] = useState<ReferenceResource | null>(null)

  return (
    <div className="flex flex-col gap-10">
      <WelcomeIntroBox />

      {!passportDismissed ? (
        <PassportHomePreview />
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/catalog"
            className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-300"
          >
            <h3 className="text-sm font-semibold text-slate-900">Tool Catalog</h3>
            <p className="text-sm text-slate-500">Browse AI tools by lifecycle phase.</p>
          </Link>
          <Link
            to="/gong-library"
            className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-300"
          >
            <h3 className="text-sm font-semibold text-slate-900">Gong Library</h3>
            <p className="text-sm text-slate-500">Search call recordings by phase.</p>
          </Link>
          <Link
            to="/my-tools"
            className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-300"
          >
            <h3 className="text-sm font-semibold text-slate-900">My Tools</h3>
            <p className="text-sm text-slate-500">Favorited and your own uploaded tools.</p>
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {RESOURCES.map((resource) =>
            resource.links ? (
              <button
                key={resource.id}
                type="button"
                onClick={() => setOpenResource(resource)}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-brand-300"
              >
                <h3 className="text-sm font-semibold text-slate-900">{resource.title}</h3>
                <p className="text-sm text-slate-600">{resource.description}</p>
                <span className="mt-auto text-sm font-medium text-brand-600">Open links →</span>
              </button>
            ) : (
              <a
                key={resource.id}
                href={resource.link}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-300"
              >
                <h3 className="text-sm font-semibold text-slate-900">{resource.title}</h3>
                <p className="text-sm text-slate-600">{resource.description}</p>
                <span className="mt-auto text-sm font-medium text-brand-600">Open resource →</span>
              </a>
            ),
          )}
        </div>
      </div>

      {openResource?.links && (
        <ResourceLinksModal
          title={openResource.title}
          links={openResource.links}
          onClose={() => setOpenResource(null)}
        />
      )}
    </div>
  )
}
