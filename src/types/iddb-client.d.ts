/**
 * Ambient types for the private `@iddb/client` package (Okta App Platform's
 * database SDK). The real package lives on a private registry and isn't
 * installed in local dev — see src/lib/iddb.ts and vite.config.ts for how
 * local dev falls back to a stub with this same shape. This declaration
 * only covers the subset of the API this app actually uses.
 */
declare module '@iddb/client' {
  export interface IddbQueryResult<T> {
    data: T | null
    error: { message: string } | null
  }

  export interface IddbQueryBuilder<Row> {
    select(columns?: string): IddbQueryBuilder<Row>
    insert(values: Partial<Row> | Partial<Row>[]): IddbQueryBuilder<Row>
    update(values: Partial<Row>): IddbQueryBuilder<Row>
    delete(): IddbQueryBuilder<Row>
    eq(column: string, value: unknown): IddbQueryBuilder<Row>
    order(column: string, options?: { ascending?: boolean }): IddbQueryBuilder<Row>
    range(from: number, to: number): IddbQueryBuilder<Row>
    single(): Promise<IddbQueryResult<Row>>
    then<TResult>(
      onFulfilled: (result: IddbQueryResult<Row[]>) => TResult,
    ): Promise<TResult>
  }

  export interface IddbClient {
    from<Row = Record<string, unknown>>(table: string): IddbQueryBuilder<Row>
    auth: {
      setSession(session: { access_token: string; refresh_token: string }): Promise<void>
      getSession(): Promise<{ data: { session: unknown | null } }>
    }
  }

  export function createIddbClient(config: {
    tenant: string
    key: string
    baseUrl?: string
  }): IddbClient
}
