import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { siteFromConfigPlugin } from '../../vite/site-from-config.mjs'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const baseSrc = fileURLToPath(new URL('../../packages/base/src', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  publicDir: 'public',
  base: '/',
  plugins: [siteFromConfigPlugin(), vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': baseSrc,
    },
  },
  build: {
    outDir: fileURLToPath(new URL('../../dist', import.meta.url)),
    emptyOutDir: true,
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
})
