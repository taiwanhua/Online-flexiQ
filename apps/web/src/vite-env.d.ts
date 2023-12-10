// env see : https://vitejs.dev/guide/env-and-mode

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_SERVER_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
