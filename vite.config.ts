import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite"
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: './postcss.config.cjs', // Chỉ cần chỉ định đúng file config
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
