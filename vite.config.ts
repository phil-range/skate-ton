import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "docs",
  },
  // @ts-ignore
  base: process.env.GH_PAGES ? "/skate-ton/" : "./",
  server: {
    fs: {
      allow: ["../sdk", "./"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
