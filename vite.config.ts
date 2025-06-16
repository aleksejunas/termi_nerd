import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    fs: {
      strict: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: "public",
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg", "**/*.webp"],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          markdown: ["react-markdown", "remark-gfm"],
          ui: ["lucide-react"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "react-markdown"],
  },
});
/**
 * A simple Vite plugin that tags React components with a __file property for easier debugging.
 * Only runs in development mode.
 */
function componentTagger(): Plugin {
  return {
    name: "component-tagger",
    enforce: "post",
    transform(code, id) {
      if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) return;
      // Only tag default exported components
      if (/export\s+default\s+/.test(code)) {
        const tag = `\nif (typeof exports.default === "function") exports.default.__file = ${JSON.stringify(id)};\n`;
        return {
          code: code + tag,
          map: null,
        };
      }
      return;
    },
  };
}
