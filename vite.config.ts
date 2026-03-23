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
 * Vite plugin: serves & builds /api/thoughts.json from src/data/thoughts.json.
 * - Dev: serves fresh file via middleware
 * - Build: copies into dist/api/thoughts.json
 */
function thoughtsJsonPlugin(): Plugin {
  const JSON_PATH = path.resolve(__dirname, "src/data/thoughts.json");

  return {
    name: "thoughts-json",

    configureServer(server) {
      server.middlewares.use("/api/thoughts.json", (_req, res) => {
        try {
          const json = fs.readFileSync(JSON_PATH, "utf-8");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(json);
        } catch {
          res.statusCode = 500;
          res.end("[]");
        }
      });
    },

    writeBundle() {
      const json = fs.readFileSync(JSON_PATH, "utf-8");
      const outDir = path.resolve(__dirname, "dist/api");
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "thoughts.json"), json);
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
    thoughtsJsonPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
