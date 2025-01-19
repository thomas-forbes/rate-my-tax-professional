/// <reference types="vinxi/types/client" />

interface ImportMetaEnv {
  SITE_NAME: string
  SESSION_SECRET: string
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DB_URL: string
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
