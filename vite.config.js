import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

const config = ({ mode }) => {
  return defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        },
      }),
      mkcert(),
    ],
    server: {
      https: true,
      proxy: {
        '/api': {
          target: 'http://54.179.58.119:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    base: "",
    define: {
      "process.env.NODE_ENV": `"${mode}"`,
    },
    optimizeDeps: {
      // 👈 optimizedeps
      esbuildOptions: {
        target: "esnext",
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
        supported: {
          bigint: true,
        },
      },
    },
    build: {
      target: ["esnext"],
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react',
              'react-dom'
            ],
          }
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  });
};

export default config;
