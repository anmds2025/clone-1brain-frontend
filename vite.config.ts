import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
  server: {
    host: "::",
    port: 8080,
    // 👇 Dòng này giúp dev server không bị 404 khi reload route
    fs: { strict: false },
    middlewareMode: false,
    // Nếu bạn dùng history API (BrowserRouter), cần bật cái này
    historyApiFallback: true,
  },
}));