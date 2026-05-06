/**
 * Vercel build entry: each client project sets SITE_ID in env; this validates
 * before delegating to `npm run build` (Vite + sites/<SITE_ID>/).
 */
import { spawnSync } from 'node:child_process'

import { resolveSitePaths } from '../vite/resolve-site.mjs'

try {
  const { siteId } = resolveSitePaths({ requireExplicit: true })
  console.log(`[vercel-build] SITE_ID=${siteId}`)
} catch (err) {
  console.error('[vercel-build]', err instanceof Error ? err.message : err)
  process.exit(1)
}

const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

process.exit(result.status === null ? 1 : result.status)
