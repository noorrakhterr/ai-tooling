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
  **shared**, backed by Okta App Platform's auto-generated Postgres REST API
  via this app's own Node server (see `server.js`, `src/lib/iddb.ts`,
  `src/hooks/useTools.ts`, `src/hooks/useRecordings.ts`). Adding a tool or
  call writes to that shared database; everyone who loads the app sees it.
- **No login screen for the app itself.** It sits behind OAP's own
  Okta-backed access gate, so by the time anyone reaches this app they're
  already signed in.
- **This app runs as a real Node server, not a static SPA** — a real
  architectural requirement, not a preference. A static SPA's JS bundle is
  built once and served by nginx forever after; it can never read a secret
  that only exists in a running container's `process.env`. Both of this
  app's database credentials (`IDDB_ANON_KEY`, `IDDB_RESOURCE_KEY`) are
  exactly that kind of runtime secret — confirmed empirically, twice, that
  neither ever reaches the Vite build process no matter how they're set.
  Every other option for a static SPA was tried and ruled out before this:
  hardcoding (blocked by the platform's Gitleaks scan, plain and
  base64-encoded), an OAP serverless Function proxy (still requires a
  flagged key from the caller even in `auth_mode: anon`), Vite's `define`
  config (nothing in `process.env` to inline), and having the user's own
  browser run a PKCE OIDC flow against `ai-tools.platform.atko.ai/auth/v1`
  (that issuer has no browser-facing login page at all — confirmed via its
  discovery doc, via `prompt=login` still returning `login_required`, and
  via the one login URL anyone suggested 404ing). See git history around
  Oct 2026 for the full saga.

  `server.js` is a small Express app that serves the built `dist/` folder
  and exposes `/api/ai_tools` and `/api/gong_recordings`. Those routes hold
  `IDDB_RESOURCE_KEY` server-side and call OAP's **internal** API gateway
  (`IDDB_API_URL`, a cluster-internal hostname) — not the public
  `api.platform.atko.ai` endpoint, which isn't reachable from inside this
  app's own pod (confirmed via runtime logs: `ConnectTimeoutError` on every
  attempt). The internal gateway also rejects `IDDB_ANON_KEY` — it wants
  `IDDB_RESOURCE_KEY`, confirmed the same way, via a real deployed request
  and its runtime log. The browser never holds any credential at all; it
  just calls these same-origin routes.

  OAP detects the runtime per-deploy from the source (`iddb apps detect`),
  not from a fixed manifest field — a `package.json` `start` script that
  runs a real HTTP server is what pushes detection from `static-spa` to
  `node-server`. No app recreation was needed, just adding `server.js` and
  the `start` script and redeploying.

## Backend setup (one-time, already done for the deployed app)

This app's shared data lives in two Postgres tables, `ai_tools` and
`gong_recordings`, created and seeded via the SQL files in `db/`, run in
order against the OAP dashboard's SQL editor for the `ai-tools` tenant:

1. `001_create_ai_tools_and_gong_recordings.sql` — creates both tables,
   enables RLS (locks out all access until policies exist).
2. `002_add_rls_policies.sql` — policies for the app's own dedicated
   Postgres role (shown on the dashboard's "Manage grants" page after
   applying a resource grant there for both tables).
3. `003_seed_data.sql` — generated from the original hardcoded
   `src/data/tools.ts` / `src/data/recordings.ts` arrays via
   `npx tsx db/generate-seed-sql.ts`; carries the existing catalog into the
   new tables. Re-running it duplicates rows.
4. `004_grant_tenant_roles.sql` — grants + RLS policies for the tenant-wide
   `ai-tools_anon` / `ai-tools_authenticated` roles. Written back when the
   plan was still "browser calls the REST API directly with the anon key";
   kept since it's harmless and `IDDB_RESOURCE_KEY` likely authenticates
   through a related path, but the resource grant on the app's own role
   (step 2) is what this app's server actually relies on now.

Those static arrays remain in the repo as a fallback: if the database fetch
fails for any reason, the Catalog/Gong Library pages fall back to showing
that seeded data instead of breaking.

## Run it

```bash
npm install
npm run build   # type-checks and produces the client build in dist/
npm start        # runs server.js, which serves dist/ and the /api/* routes
```

```bash
npm run dev      # Vite dev server, client-only — see note below
```

### Local dev and the database

`npm run dev` serves the React app but not `server.js`, so `/api/*` calls
will fail locally and the Catalog/Gong Library pages fall back to the
seeded static data — that's expected, not a bug. `IDDB_RESOURCE_KEY` and
`IDDB_API_URL` are both runtime secrets/values that only exist inside
OAP's deployed container; there's no known way to reach the real database
from `npm run dev` or even `npm start` run locally, since `IDDB_API_URL`
is a cluster-internal hostname (`api-gateway.iddb-system.svc.cluster.local`)
unreachable from outside OAP's own infrastructure. Testing a real database
read/write needs the actual deployed app.

A `.env.local` (gitignored) with `VITE_IDDB_ANON_KEY=<the ai-tools
tenant's anon key>` is still around from the pre-Node-server architecture —
harmless to keep for now, but it's not used by anything in the current
`server.js`/`src/lib/iddb.ts` code path.
