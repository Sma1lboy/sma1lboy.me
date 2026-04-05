import fs from "fs";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig, type Plugin } from "vite";

// vite plugins
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import Fonts from "unplugin-fonts/vite";
// @ts-ignore
import imagemin from "unplugin-imagemin/vite";
import { compression } from "vite-plugin-compression2";
import Inspect from "vite-plugin-inspect";
import svgr from "vite-plugin-svgr";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

import { fonts } from "./configs/fonts.config";

/**
 * Vite plugin: serves & builds /api/*.json from src/data/*.json.
 * - Dev: serves fresh files via middleware
 * - Build: copies into dist/api/
 */
function jsonApiPlugin(): Plugin {
  const DATA_DIR = path.resolve(__dirname, "src/data");

  function serveJson(filename: string) {
    return (
      _req: unknown,
      res: {
        setHeader: (k: string, v: string) => void;
        statusCode: number;
        end: (s: string) => void;
      },
    ) => {
      try {
        const json = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(json);
      } catch {
        res.statusCode = 500;
        res.end("[]");
      }
    };
  }

  return {
    name: "json-api",

    configureServer(server) {
      server.middlewares.use("/api/thoughts.json", serveJson("thoughts.json"));
      server.middlewares.use("/api/projects.json", serveJson("projects.json"));
      server.middlewares.use("/api/blog-posts.json", serveJson("blog-posts.json"));
    },

    writeBundle() {
      const outDir = path.resolve(__dirname, "dist/api");
      fs.mkdirSync(outDir, { recursive: true });
      for (const file of ["thoughts.json", "projects.json", "blog-posts.json"]) {
        const src = path.join(DATA_DIR, file);
        if (fs.existsSync(src)) {
          fs.writeFileSync(path.join(outDir, file), fs.readFileSync(src, "utf-8"));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    svgr(),
    react(),
    Inspect(),
    compression(),
    imagemin(),
    tailwindcss(),
    Fonts({ google: { families: fonts } }),
    AutoImport({
      imports: ["react"],
      dts: "./auto-imports.d.ts",
      eslintrc: { filepath: "./eslint.config.js" },
      dirs: ["./src/components/ui"],
    }),
    jsonApiPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // Core vendor: React, router, state, styling utilities
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/framer-motion/") ||
            id.includes("/motion/") ||
            id.includes("/@tanstack/react-router/") ||
            id.includes("/zustand/") ||
            id.includes("/clsx/") ||
            id.includes("/class-variance-authority/") ||
            id.includes("/tailwind-merge/")
          ) {
            return "vendor";
          }

          // Markdown rendering
          if (
            id.includes("/react-markdown/") ||
            id.includes("/remark-gfm/") ||
            id.includes("/prism-react-renderer/")
          ) {
            return "markdown";
          }

          // Three.js (heavy, lazy-loaded)
          if (id.includes("/three/")) {
            return "three-d";
          }

          // Canvas libs
          if (
            id.includes("/konva/") ||
            id.includes("/react-konva/") ||
            id.includes("/matter-js/")
          ) {
            return "canvas";
          }

          // Carousel
          if (id.includes("/embla-carousel")) {
            return "embla";
          }

          // QR code
          if (id.includes("/qrcode/")) {
            return "qrcode";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
