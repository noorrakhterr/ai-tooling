/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IDDB_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
