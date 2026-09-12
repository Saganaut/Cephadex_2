import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import svgr from "vite-plugin-svgr";
import { loadEnv } from "vite";

dotenv.config();

export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode, "env", "");
  const envDir = path.resolve(__dirname);
  // only grab the VITE_-prefixed vars
  const env = loadEnv(mode, envDir, "VITE_");

  Object.assign(process.env, env);
  console.log("🌱  Values:", env, "\n");
  return {
    plugins: [
      react(),
      svgr({ include: "**/*.svg?react" }),
      splitVendorChunkPlugin(),
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
      sentryVitePlugin({
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
        org: process.env.VITE_ORG,
        project: process.env.VITE_PROJECT,
        release: {
          name: process.env.VITE_APP_NAME,
          version: process.env.VITE_APP_VERSION,
        },
      }),
    ],

    server: {
      allowedHosts: true,
      host: "0.0.0.0",
      proxy: {
        "/*": {
          target: process.env.VITE_APP_BASE_URL,
          changeOrigin: true,
        },
      },
      watch: {
        usePolling: process.env.VITE_APP_ENV === "development",
      },
    },

    resolve: {
      alias: {
        "@source": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@account": path.resolve(__dirname, "./src/pages/Account"),
        "@blog": path.resolve(__dirname, "./src/pages/Blog"),
        "@contact": path.resolve(__dirname, "./src/pages/Contact"),
        "@dashboard": path.resolve(__dirname, "./src/pages/Dashboard"),
        "@deck": path.resolve(__dirname, "./src/pages/Deck"),
        "@decks": path.resolve(__dirname, "./src/pages/Decks"),
        "@documentation": path.resolve(__dirname, "src/pages/Documentation"),
        "@extract": path.resolve(__dirname, "./src/pages/Extract"),
        "@groups": path.resolve(__dirname, "./src/pages/Groups"),
        "@landingpage": path.resolve(__dirname, "./src/pages/LandingPage"),
        "@layouts": path.resolve(__dirname, "./src/pages/layouts"),
        "@legal": path.resolve(__dirname, "./src/pages/Legal"),
        "@main": path.resolve(__dirname, "./src/pages/Main"),
        "@play": path.resolve(__dirname, "./src/pages/Play"),
        "@quiz": path.resolve(__dirname, "./src/pages/Quiz"),
        "@quizzes": path.resolve(__dirname, "./src/pages/Quizzes"),
        "@study": path.resolve(__dirname, "./src/pages/Study"),
        "@terms": path.resolve(__dirname, "./src/pages/Terms"),
        "@upgrade": path.resolve(__dirname, "./src/pages/Upgrade"),
        "@utils": path.resolve(__dirname, "./src/lib/utils"),
        "@contexts": path.resolve(__dirname, "./src/lib/contexts"),
        "@services": path.resolve(__dirname, "./src/lib/services"),
        "@hooks": path.resolve(__dirname, "./src/lib/hooks"),
        "@store": path.resolve(__dirname, "./src/lib/store"),
        "@common": path.resolve(__dirname, "./src/common"),
        "@customTypes": path.resolve(__dirname, "./src/types"),
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@client": path.resolve(__dirname, "./src/client"),
      },
    },

    build: {
      // sourcemap: true,
      minify: "esbuild",
      chunkSizeWarningLimit: 1000,
      // assetsInclude: ['**/*.ttf'],
    },
    // publicDir: 'public',
  };
});
