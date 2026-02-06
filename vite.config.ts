import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Caminho raiz do projeto
const ROOT = process.cwd();

export default defineConfig({
  root: path.resolve(ROOT, "client"), // raiz do client
  publicDir: path.resolve(ROOT, "client", "public"), // assets públicos
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(ROOT, "client", "src"), // import "@/..." aponta para src
      "@shared": path.resolve(ROOT, "shared"),
      "@assets": path.resolve(ROOT, "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(ROOT, "dist/public"), // build para dist/public
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173, // porta padrão Vite
    strictPort: false,
    fs: {
      strict: true,
      allow: [ROOT],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Evita erro do @import do Google Fonts no CSS
        additionalData: `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");`,
      },
    },
  },
  define: {
    "process.env": process.env, // permite usar process.env no front
  },
});
