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
2. **A tool catalog** — searchable/filterable by lifecycle phase. Anyone on
   the team can add a new tool via "Add AI Tool" — it's saved to a shared
   database and immediately visible to everyone, not just the browser that
   added it.
3. **A Gong recordings library** — searchable and filterable by label (the
   use-case tags from the team's Gong catalog sheet, e.g. "SBR," "FastPass,"
   "Gold Scale" — not lifecycle phases), kept fully separate from the
   passport mechanic. Populated with real call recordings. Anyone can add a
   call via "Add Gong Call," same shared-database behavior as tools —
   includes an optional transcript field, captured now for a possible future
   "find me an example call" search feature (not built yet).
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
  (Customer research, Customer outreach, Customer organization, Resource
  gathering) now that placeholders are gone — a CSM can't yet earn those
  stamps through a suggested tool. Worth populating before this goes out for
  real use.
- **Tools can be marked `comingSoon`** (see `src/data/tools.ts`) to show a
  "Coming soon" badge and disable the open/stamp actions — used today for
  the Gold Scale Strategic Coaching Agent.
- **Users can upload their own tool** on the My Tools page — a name, an
  optional phase assignment, and a file. The file is stored only in the
  browser's `localStorage` as a data URL; nothing is uploaded anywhere.
- **The Gong Library holds real call recordings** sourced from the team's
  Gong catalog sheet (`src/data/recordings.ts`), searchable by title,
  customer, or owner, and filterable by **label** — free-text use-case tags
  extracted from the sheet's "Use Case" column (e.g. "SBR," "FastPass"),
  independent of the passport's lifecycle phases. Gong platform tools (AI
  Assistant, AI Trainer, etc.) live in the Tool Catalog instead, and
  Gong training/FAQ docs live in Home's "How-to guides for self-enablement"
  section.
- **Passport stamps are self-reported**, with no verification layer yet.
- **Favoriting works; "assign to workflow" is a visible stub**, not
  functional.
- **State is mixed.** Stamps, favorites, custom tool uploads, and the
  passport's dismissed state are still per-browser, in `localStorage` — that
  part is intentionally personal. Catalog tools and Gong recordings are now
  **shared**, backed by Okta App Platform's Postgres database via
  `@iddb/client` (see `src/lib/iddb.ts`, `src/hooks/useTools.ts`,
  `src/hooks/useRecordings.ts`). Adding a tool or call writes to that shared
  database; everyone who loads the app sees it.
- **No login screen.** The app sits behind OAP's own Okta-backed access
  gate (`first_party_oidc`), so by the time anyone reaches this app they're
  already signed in, and `@iddb/client` picks up that session automatically
  — no sign-in code was needed here.

## Backend setup (one-time, already done for the deployed app)

This app's shared data lives in two Postgres tables, `ai_tools` and
`gong_recordings`, created and seeded via the SQL files in `db/`:

1. `db/001_create_ai_tools_and_gong_recordings.sql` — run once via the OAP
   dashboard's SQL editor for the `ai-tools` tenant. Creates both tables
   with RLS enabled and a permissive "any signed-in teammate can read and
   write" policy (not per-user-owner scoped — this is shared team data).
2. `db/002_seed_data.sql` — generated from the original hardcoded
   `src/data/tools.ts` / `src/data/recordings.ts` arrays via
   `npx tsx db/generate-seed-sql.ts`; run once, after (1), to carry the
   existing catalog into the new tables. Re-running it duplicates rows.

Those static arrays remain in the repo as a fallback: if the database fetch
fails for any reason, the Catalog/Gong Library pages fall back to showing
that seeded data instead of breaking.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build   # type-checks and produces a static build in dist/
```

### Local dev and `@iddb/client`

`@iddb/client` lives on OAP's private npm registry, not the public one —
plain `npm install @iddb/client` won't resolve it without that registry's
credentials configured locally (not yet set up for this tenant as of this
writing). Until that's sorted out:

- `npm install`/`npm run dev`/`npm run build` all work anyway — `vite.config.ts`
  automatically falls back to a local stub (`src/lib/iddb-client-stub.ts`)
  whenever the real package isn't in `node_modules`. The stub returns empty
  results instead of talking to a real database, and the Catalog/Gong
  Library pages fall back to the seeded static data in that case — so local
  dev still looks and works like the app, it just can't actually read/write
  the shared tables.
- To test real shared reads/writes locally, you need the real `@iddb/client`
  installed. Once the tenant's npm registry is configured (`iddb npm set`,
  tenant-admin action), run `npm install @iddb/client` again — the stub
  automatically stops being used once the real package is present.
- Either way, add a `.env.local` (gitignored) with:
  ```
  VITE_IDDB_ANON_KEY=<the ai-tools tenant's anon key>
  ```
  This is the browser-safe key — fine to share among teammates working on
  this repo, but don't commit it.
