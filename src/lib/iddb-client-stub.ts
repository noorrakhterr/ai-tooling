/**
 * Local stand-in for the private `@iddb/client` package, used only when
 * that package isn't installed (e.g. local dev without the OAP private
 * registry configured — see README). Mimics its documented shape closely
 * enough for `npm run dev`/`npm run build` to work locally; it does not
 * talk to a real database. vite.config.ts aliases '@iddb/client' to this
 * file only when node_modules/@iddb/client is missing, so production
 * deploys (where the real package resolves normally) are unaffected.
 */
import type { IddbClient, IddbQueryBuilder, IddbQueryResult } from '@iddb/client'

const STUB_WARNING =
  '[@iddb/client stub] Not talking to a real database — @iddb/client is not installed locally. ' +
  'See README for local dev setup.'

function createStubQueryBuilder<Row>(): IddbQueryBuilder<Row> {
  const result: IddbQueryResult<Row[]> = {
    data: [],
    error: { message: STUB_WARNING },
  }

  const builder: IddbQueryBuilder<Row> = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    order: () => builder,
    range: () => builder,
    single: async () => ({ data: null, error: { message: STUB_WARNING } }),
    then: (onFulfilled) => Promise.resolve(onFulfilled(result)),
  }

  return builder
}

export function createIddbClient(): IddbClient {
  console.warn(STUB_WARNING)
  return {
    from: () => createStubQueryBuilder(),
    auth: {
      setSession: async () => {
        console.warn(STUB_WARNING)
      },
      getSession: async () => ({ data: { session: null } }),
    },
  }
}
