import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Repo root (parent of `/vite`). */
export const REPO_ROOT = path.resolve(__dirname, '..')

/**
 * @param {{ requireExplicit?: boolean }} [options]
 * @returns {string}
 */
export function getSiteId(options = {}) {
  const { requireExplicit = false } = options
  const raw = process.env.SITE_ID || process.env.VITE_SITE_ID
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  if (trimmed) return trimmed
  if (requireExplicit) {
    throw new Error(
      'SITE_ID is required for this command. Example (Unix): SITE_ID=my-client npm run build | PowerShell: $env:SITE_ID="my-client"; npm run build',
    )
  }
  return 'sauvage-watches'
}

/**
 * @param {{ requireExplicit?: boolean }} [options]
 */
export function resolveSitePaths(options = {}) {
  const siteId = getSiteId(options)
  const siteRoot = path.join(REPO_ROOT, 'sites', siteId)
  const siteConfigPath = path.join(siteRoot, 'site.config.js')
  const siteSrcPath = path.join(siteRoot, 'src')

  if (!fs.existsSync(siteRoot)) {
    throw new Error(`Unknown SITE_ID "${siteId}": missing folder ${siteRoot}`)
  }
  if (!fs.existsSync(siteConfigPath)) {
    throw new Error(`SITE_ID "${siteId}" has no site.config.js at ${siteConfigPath}`)
  }

  return { siteId, siteRoot, siteConfigPath, siteSrcPath }
}
