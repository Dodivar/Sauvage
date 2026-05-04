import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { siteFromConfigPlugin } from '../../vite/site-from-config.mjs'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const baseSrc = fileURLToPath(new URL('../../packages/base/src', import.meta.url))
const siteSrc = fileURLToPath(new URL('./src', import.meta.url))

function createNodeLocalStorage() {
  const values = new Map()

  return {
    get length() {
      return values.size
    },
    clear() {
      values.clear()
    },
    getItem(key) {
      return values.get(String(key)) ?? null
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null
    },
    removeItem(key) {
      values.delete(String(key))
    },
    setItem(key, value) {
      values.set(String(key), String(value))
    },
  }
}

function ensureNodeLocalStorage() {
  if (typeof globalThis.localStorage?.getItem === 'function') return

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: createNodeLocalStorage(),
  })
}

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [siteFromConfigPlugin(), vue()]

  if (command === 'serve') {
    ensureNodeLocalStorage()
    const { default: vueDevTools } = await import('vite-plugin-vue-devtools')
    plugins.push(vueDevTools())
  }

  return {
    root: fileURLToPath(new URL('.', import.meta.url)),
    // Load .env from repo root (not sites/sauvage-watches), so VITE_* matches import.meta.env
    envDir: repoRoot,
    publicDir: 'public',
    base: '/',
    plugins,
    resolve: {
      alias: {
        '@': baseSrc,
        '@site': siteSrc,
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
  }
})
