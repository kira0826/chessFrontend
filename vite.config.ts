import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/ws-connect-js": {
        target: "ws://localhost:8081", 
        ws: true, 
        changeOrigin: true,
      },
    },
  },
  define: {
    global: {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
