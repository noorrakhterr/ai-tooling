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
        <h2 className="font-heading text-xl font-semibold text-slate-900">
          Welcome to CS Scale's AI Tool Repository!
        </h2>
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
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
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
