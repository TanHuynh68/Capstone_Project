  import path from "path";
  import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

  import tailwindcss from "@tailwindcss/vite"
  export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
      environment: 'jsdom', // giả lập DOM
      globals: true, // cho phép dùng describe/test mà không cần import
      setupFiles: './src/setupTests.ts', // nơi cấu hình test bổ sung (nếu có)
    },
    css: {
      postcss: './postcss.config.cjs', // Chỉ cần chỉ định đúng file config
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
