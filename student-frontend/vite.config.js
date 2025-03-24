import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from 'path'; // Importar el módulo 'path'

export default defineConfig({
  server: {
    host: "0.0.0.0", // Permite el acceso desde otros dispositivos en la red local
    port: 5173,       // Puerto de desarrollo de Vite (puedes cambiarlo si lo necesitas)
  },
  
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Unitrack Student",
        short_name: "Unitrack",
        description: "Admin Panel PWA",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/public/icons/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/public/icons/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      // Ajusta la ruta de 'shared-frontend' según tu estructura de directorios
      'shared-frontend': path.resolve(__dirname, '../shared-frontend'), // <-- Esta es la clave
    },
  },
  optimizeDeps: {
    include: ['shared-frontend'], // Asegúrate de incluir shared-frontend
  },
  build: {
    rollupOptions: {
      external: ['react-router-dom'], // Externaliza react-router-dom
    },
  },
});
