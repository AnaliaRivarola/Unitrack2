// admin-frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "0.0.0.0", // Permite el acceso desde otros dispositivos en la red local
    port: 5173,       // Puerto de desarrollo de Vite (puedes cambiarlo si lo necesitas)
  },
  mimeTypes: {
    'sw.js': 'application/javascript'
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Admin Panel",
        short_name: "Admin",
        description: "Admin Panel PWA",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});


