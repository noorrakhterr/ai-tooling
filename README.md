# AI Tooling Passport

A v1 prototype dashboard for Okta Gold/Silver Scale CSMs, combining:

1. **The passport** — a lifetime, gamified AI-enablement journey. CSMs walk the
   customer lifecycle (Customer research → AE outreach and connection →
   Customer outreach → Meeting prep → Meeting → Post meeting → Closing out
   customer), plus three bonus phases (SBR, Customer organization, Resource
   gathering). Each phase surfaces suggested AI tools; self-reporting use of
   any one of them ("I used this") earns that phase's stamp.
2. **A tool catalog** — searchable/filterable by lifecycle phase.
3. **A Gong recordings library** — searchable/filterable by lifecycle phase,
   kept fully separate from the passport mechanic.
4. **My Tools** — favorited tools from the catalog, grouped by phase.
5. **Workflows** — a "coming soon" stub for assigning favorited tools to
   custom CSM workflows.

## Status: v1 prototype

- **Tool catalog data is sample/placeholder**, seeded from the "Gong and AI
  Tools Rollout Plan" starter entries. It is not the validated catalog —
  that lives in a separate Google Sheet owned by the rollout working group
  (Amelia: Gong inventory, Julia: AI inventory).
- **The Gong Library ships empty on purpose.** No real recordings exist yet;
  the page is fully wired (search, phase filter chips, empty state) ready to
  receive data once Amelia's Gong inventory is published.
- **Passport stamps are self-reported**, with no verification layer yet.
- **Favoriting works; "assign to workflow" is a visible stub**, not
  functional.
- **State is local only** — stamps and favorites persist to the browser's
  `localStorage`, no backend.
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
