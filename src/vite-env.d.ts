/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_MIA_API_URL: string;
  readonly VITE_PARSER_URL: string;
  readonly VITE_PARSER_API_KEY: string;
  readonly VITE_SUBMISSION_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
