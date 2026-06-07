import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { visualizer } from 'rollup-plugin-visualizer'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), ViteImageOptimizer({
    png: { quality: 70 },
    jpeg: { quality: 70 },
    jpg: { quality: 70 },
    webp: { lossless: false, quality: 65 },
    avif: { lossless: false, quality: 55 },
    includePublic: true,
    logStats: true,
  }), visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true }), cloudflare()],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'vendor-animations';
          }
          if (id.includes('node_modules/swiper')) {
            return 'vendor-swiper';
          }
          if (id.includes('node_modules/sonner') || id.includes('node_modules/react-icons') || id.includes('node_modules/react-countup')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules')) {
            return 'vendor-other';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});