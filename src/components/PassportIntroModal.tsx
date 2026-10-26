interface PassportIntroModalProps {
  onClose: () => void
}

export function PassportIntroModal({ onClose }: PassportIntroModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm font-medium text-indigo-600">What's the passport?</p>
        <h2 className="font-heading mt-1 text-xl font-semibold text-slate-900">
          Your AI enablement journey, gamified
        </h2>
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
          <p>
            The passport tracks your progress through the customer lifecycle — Customer research,
            AE outreach, Customer outreach, Meeting prep, Meeting, Post meeting, and Closing out
            customer — plus three bonus phases (SBR, Customer organization, Resource gathering).
          </p>
          <p>
            Each phase has suggested AI tools. Use one, then hit <strong>"I used this"</strong> on
            that tool to stamp the phase. Stamp all seven core phases and your passport is
            complete.
          </p>
          <p>
            It's entirely self-reported — there's no verification step. It's just a way to track
            where you've adopted AI in your workflow, and a nudge toward phases you haven't tried
            yet.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
