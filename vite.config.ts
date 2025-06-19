import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';

// vite plugins
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import Fonts from 'unplugin-fonts/vite';
// @ts-ignore
import imagemin from 'unplugin-imagemin/vite';
import { compression } from 'vite-plugin-compression2';
import Inspect from 'vite-plugin-inspect';
import svgr from 'vite-plugin-svgr';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

import { fonts } from './configs/fonts.config';

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
      imports: ['react'],
      dts: './auto-imports.d.ts',
      eslintrc: { filepath: './eslint.config.js' },
      dirs: ['./src/components/ui'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
