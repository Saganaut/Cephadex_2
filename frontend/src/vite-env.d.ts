interface ImportMetaEnv {
  readonly VITE_DISCORD_REDIRECT_URI: string;
  readonly VITE_DISCORD_CLIENT_ID: string;
  readonly VITE_STRIPE_PRICING_TABLE_ID: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_NOTIFICATIONS_URL: string;
  readonly VITE_DISCORD_URL: string;
  readonly VITE_DISCORD_CLIENT_SECRET: string;
  readonly VITE_MICROSOFT_REDIRECT_URI: string;
  readonly VITE_MICROSOFT_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_APP_PUBLIC_POSTHOG_KEY: string;
  readonly VITE_APP_PUBLIC_POSTHOG_HOST: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_SENTRY_AUTH_TOKEN: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_WS_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.svg?url" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

// declare module '*.ttf' {
//     const content: string
//     export default content
// }
