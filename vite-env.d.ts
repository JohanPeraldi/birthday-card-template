/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Card Content
  readonly VITE_CARD_TITLE?: string;
  readonly VITE_CARD_RECIPIENT?: string;
  readonly VITE_CARD_IMAGE?: string;
  readonly VITE_CARD_MESSAGE?: string;
  readonly VITE_CARD_ID?: string;

  // Authentication
  readonly VITE_AUTH_METHOD?: 'magic-link' | 'qr-code' | 'none';

  // Email Configuration
  readonly VITE_EMAIL_FROM_NAME?: string;
  readonly VITE_EMAIL_SUBJECT?: string;

  // Security
  readonly VITE_LINK_EXPIRATION_MINUTES?: string;
  readonly VITE_MAX_EMAIL_SENDS?: string;
  readonly VITE_RATE_LIMIT?: string;

  // Development
  readonly VITE_DEBUG?: string;
  readonly VITE_DEV_AUTO_REDIRECT?: string;

  // Base URLs
  readonly NEXT_PUBLIC_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
