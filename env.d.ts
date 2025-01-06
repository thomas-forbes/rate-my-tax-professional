/// <reference types="vinxi/types/client" />

interface ImportMetaEnv {
  SITE_NAME: string
  SESSION_SECRET: string
  VITE_POSTHOG_API_HOST: string
  VITE_POSTHOG_PROJECT: string
  VITE_TURNSTILE_SITE_KEY: string
  TURNSTILE_SECRET_KEY: string
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DB_URL: string
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
