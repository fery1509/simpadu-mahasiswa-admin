import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/simpadu/",
  server: {
    host: "::",
    port: 3000,
    proxy: {
      // Proxy untuk API login (TIDAK DIUBAH)
      "/api": {
        target: "https://ti054c03.agussbn.my.id",
        changeOrigin: true,
      },

      // 💡 BARU: Proxy untuk API Mata Kuliah
      "/matakuliah": {
        target: "https://ti054c01.agussbn.my.id",
        changeOrigin: true,
        // 'rewrite' tidak diperlukan di sini karena path-nya sama
        // Permintaan ke '/matakuliah' akan langsung diteruskan ke 'target/matakuliah'
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
