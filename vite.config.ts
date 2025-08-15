import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // Always use relative paths for Capacitor compatibility
  base: "./",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // ✅ Generate source maps for debugging
    minify: false,   // ✅ Disable minification to keep readable stack traces
    target: "esnext", // ✅ Modern JS so line numbers match exactly
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("development"), // ✅ Force dev mode inside APK
  },
}));
