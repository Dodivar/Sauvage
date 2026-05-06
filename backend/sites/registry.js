/**
 * Registry des sites disponibles côté backend.
 *
 * Charge tous les `sites/<id>/site.config.js` du monorepo via dynamic import
 * (les manifests sont en ESM, le backend en CJS) puis construit des index :
 *   - byId       : siteId → SiteEntry
 *   - byOrigin   : Origin (ex. "https://sauvage-watches.fr") → SiteEntry
 *   - byHost     : host header → SiteEntry
 *   - allOrigins : Set<string> de toutes les origines autorisées (CORS dynamique)
 *
 * Chaque entrée expose la config normalisée et les secrets résolus depuis l'env.
 */

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')

const { normalizeSiteConfig, hostOf, trimTrailingSlash } = require('./normalize')
const { getSiteSecrets } = require('./secrets')

const SITES_DIR = path.resolve(__dirname, '../../sites')

/**
 * @typedef {Object} SiteEntry
 * @property {string} id
 * @property {object} config       Manifest normalisé (voir normalize.js)
 * @property {object} secrets      Secrets résolus depuis l'env
 * @property {string[]} allowedOrigins
 * @property {string[]} allowedHosts
 */

function listSiteIds() {
  if (!fs.existsSync(SITES_DIR)) return []
  return fs
    .readdirSync(SITES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
}

async function loadSiteConfig(siteId) {
  const cfgPath = path.join(SITES_DIR, siteId, 'site.config.js')
  if (!fs.existsSync(cfgPath)) return null
  const mod = await import(pathToFileURL(cfgPath).href)
  if (!mod || !mod.default) {
    throw new Error(`sites/${siteId}/site.config.js doit exporter un objet par défaut`)
  }
  return normalizeSiteConfig(mod.default)
}

/**
 * Charge tous les sites et construit les index.
 * @returns {Promise<{
 *   byId: Map<string, SiteEntry>,
 *   byOrigin: Map<string, SiteEntry>,
 *   byHost: Map<string, SiteEntry>,
 *   allOrigins: Set<string>,
 *   list(): SiteEntry[]
 * }>}
 */
async function buildRegistry() {
  const ids = listSiteIds()
  const byId = new Map()
  const byOrigin = new Map()
  const byHost = new Map()
  const allOrigins = new Set()

  for (const id of ids) {
    let normalized
    try {
      normalized = await loadSiteConfig(id)
    } catch (err) {
      console.error(`❌ [registry] Échec du chargement de sites/${id}/site.config.js :`, err.message)
      continue
    }
    if (!normalized) continue

    const entry = {
      id: normalized.id,
      config: normalized,
      secrets: getSiteSecrets(normalized.id),
      allowedOrigins: normalized.allowedOrigins,
      allowedHosts: normalized.allowedHosts,
    }
    byId.set(entry.id, entry)

    for (const origin of normalized.allowedOrigins) {
      const key = trimTrailingSlash(origin)
      if (!key) continue
      if (byOrigin.has(key) && byOrigin.get(key).id !== entry.id) {
        console.warn(
          `⚠️  [registry] Origin ${key} déjà associée à "${byOrigin.get(key).id}" — ignorée pour "${entry.id}".`,
        )
        continue
      }
      byOrigin.set(key, entry)
      allOrigins.add(key)
    }
    for (const host of normalized.allowedHosts) {
      if (!host) continue
      if (byHost.has(host) && byHost.get(host).id !== entry.id) continue
      byHost.set(host, entry)
    }
  }

  return {
    byId,
    byOrigin,
    byHost,
    allOrigins,
    list() {
      return Array.from(byId.values())
    },
  }
}

module.exports = {
  buildRegistry,
  loadSiteConfig,
  listSiteIds,
  SITES_DIR,
  hostOf,
}
