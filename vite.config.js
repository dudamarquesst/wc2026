import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Base para o GitHub Pages (mantido igual ao original)
  base: "/wc2026/",

  server: {
    // Proxy: qualquer requisição /api em desenvolvimento é redirecionada
    // para o servidor Express na porta 3001, evitando erros de CORS
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        // Mantém o prefixo /api — o Express espera /api/feedbacks
      },
    },
  },
});
