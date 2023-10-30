import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@source": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@services": path.resolve(__dirname, "src/services"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@store": path.resolve(__dirname, "src/store"),
      "@common": path.resolve(__dirname, "src/components/Common"),
      "@pages": path.resolve(__dirname, "src/components/Pages"),
      "@app": path.resolve(__dirname, "src/components/App"),
      "@extract": path.resolve(__dirname, "src/components/App/Extract"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
});
