import "./styles/index.css";

import * as Sentry from "@sentry/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

import { App } from "./App";

const POSTHOG_KEY = import.meta.env.VITE_APP_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_APP_PUBLIC_POSTHOG_HOST;
const ENVIRONMENT = import.meta.env.VITE_APP_ENV;
const RELEASE_VERISON = import.meta.env.VITE_APP_VERSION;

if (ENVIRONMENT === "production") {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: true,
  });
}

const sentryDsn =
  ENVIRONMENT === "production"
    ? "https://b0e9693879a6c023c7ead81f70d7abd5@o4506774392078336.ingest.us.sentry.io/4506774455058432"
    : undefined;

Sentry.init({
  dsn: sentryDsn,
  release: RELEASE_VERISON,
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
const root = ReactDOM.createRoot(document.getElementById("root"));
const backendUrl = import.meta.env.VITE_BACKEND_URL;

if (ENVIRONMENT === "development") {
  // eslint-disable-next-line no-console
  console.log("posthog key: ", POSTHOG_KEY);
  // eslint-disable-next-line no-console
  console.log("VERSION: ", RELEASE_VERISON);
  // eslint-disable-next-line no-console
  console.log("Backend URL is: ", backendUrl);
  // eslint-disable-next-line no-console
  console.log("Environment is: ", ENVIRONMENT);
}

root.render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </React.StrictMode>
);
