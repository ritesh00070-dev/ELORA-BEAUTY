/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_PHONE?: string
  readonly VITE_EMAIL?: string
  readonly VITE_INSTAGRAM_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
