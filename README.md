# CS Scale AI Enablement

A v1 prototype dashboard for Okta Gold/Silver Scale CSMs, combining:

1. **The passport** — a lifetime, gamified AI-enablement journey. While
   active, the Home page shows the passport hero (phase strip + bonus
   stamps + a "Next up" / "Passport complete" indicator), followed by quick
   links to Tool Catalog / Gong Library / My Tools, and then a self-service
   "How-to guides for self-enablement" section. CSMs walk the customer
   lifecycle (Customer research → AE outreach and connection → Customer
   outreach → Meeting prep → Meeting → Post meeting → Closing out customer),
   plus three bonus phases (SBR, Customer organization, Resource gathering).
   Every other page shows a condensed one-line banner ("X of 7 stamped ·
   Next up: …") that links to a dedicated Passport page — which shows the
   full phase strip *and* per-phase suggested tools with the "I used this"
   stamp action — always reachable via its own sidebar tab. Once all core
   phases are stamped, Home's passport hero can be dismissed; it then falls
   back to a plain welcome message above the same quick links and guides,
   and the condensed banner disappears from the other pages too. The
   dedicated Passport page keeps showing the full view regardless of
   dismissal.
2. **A tool catalog** — searchable/filterable by lifecycle phase.
3. **A Gong recordings library** — searchable/filterable by lifecycle phase,
   kept fully separate from the passport mechanic.
4. **My Tools** — favorited catalog tools and your own uploaded tools
   (stored locally, assignable to one or more phases), grouped by phase.
5. **Workflows** — a "coming soon" stub for assigning favorited tools to
   custom CSM workflows.
6. **How-to guides for self-enablement** — reference material not tied to a
   phase (Agent/Gem library, Claude Skill guides), shown on Home.

## Status: v1 prototype

- **Tool catalog holds only real, submitted tools** (plus one
  `comingSoon`-flagged entry) — all linkless sample placeholders have been
  removed. More entries will be added as the full inventory from the "Gong
  and AI Tools Rollout Plan" working group (Amelia: Gong inventory, Julia: AI
  inventory) is validated. The catalog of record lives in a separate Google
  Sheet owned by that group.
- **Several core lifecycle phases currently have no suggested tool**
  (Customer research, AE outreach, Customer outreach, Meeting, Customer
  organization, Resource gathering) now that placeholders are gone — a CSM
  can't yet earn those stamps through a suggested tool. Worth populating
  before this goes out for real use.
- **Tools can be marked `comingSoon`** (see `src/data/tools.ts`) to show a
  "Coming soon" badge and disable the open/stamp actions — used today for
  the Gold Scale Strategic Coaching Agent.
- **Users can upload their own tool** on the My Tools page — a name, an
  optional phase assignment, and a file. The file is stored only in the
  browser's `localStorage` as a data URL; nothing is uploaded anywhere.
- **The Gong Library ships empty on purpose.** No real recordings exist yet;
  the page is fully wired (search, phase filter chips, empty state) ready to
  receive data once Amelia's Gong inventory is published.
- **Passport stamps are self-reported**, with no verification layer yet.
- **Favoriting works; "assign to workflow" is a visible stub**, not
  functional.
- **State is local only** — stamps, favorites, custom tools, and the
  passport's dismissed state persist to the browser's `localStorage`, no
  backend.
- **Okta App Platform (OAP) integration is intentionally deferred.** This is
  a plain Vite SPA so it satisfies OAP's static/SPA auto-detect
  (`framework: "spa"`) without rework; wiring up OAP's Postgres/auth/storage
  is a deliberate next iteration, not part of this prototype.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build   # type-checks and produces a static build in dist/
```
