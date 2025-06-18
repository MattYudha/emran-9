import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "/assets/logo.png",
        "/apple-touch-icon.png",
        "robots.txt",
        "/images/background.jpg", // Tambahkan gambar latar belakang jika ada
        "/icon-192.png",
        "/icon-512.png",
      ],
      devOptions: {
        enabled: true, // Untuk debugging di mode development
      },
      workbox: {
        // Strategi caching untuk offline mode
        globPatterns: ["**/*.{js,css,html,png,jpg,svg}"], // Cache semua file JS, CSS, HTML, dan gambar
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst", // Cache gambar dengan strategi CacheFirst
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 50, // Batas cache untuk gambar
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: "StaleWhileRevalidate", // Cache JS dan CSS, tapi perbarui di background
            options: {
              cacheName: "static-resources",
            },
          },
          {
            urlPattern: /^https:\/\/emranghanisahi\.netlify\.app\/.*/,
            handler: "NetworkFirst", // Prioritaskan jaringan untuk halaman, fallback ke cache
            options: {
              cacheName: "pages",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
              },
            },
          },
        ],
      },
      manifest: {
        name: "Emran Ghani Asahi Printing",
        short_name: "EG Asahi",
        description: "Premium printing solutions for businesses",
        theme_color: "#16a34a",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@headlessui/react", "framer-motion"],
        },
      },
    },
  },
});
