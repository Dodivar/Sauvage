/**
 * Middleware Express : résout `req.site` à partir de la requête entrante.
 *
 * Ordre de résolution :
 *   1. Param URL `:siteId` (utilisé par /api/stripe/webhook/:siteId)
 *   2. Header `X-Site-Id` (utile pour curl/dev/tests)
 *   3. Header `Origin` → registry.byOrigin
 *   4. Header `Host` (sans schéma) → registry.byHost
 *   5. En dev, fallback `DEV_DEFAULT_SITE_ID` ou `sauvage-watches`
 *   6. Sinon → 400 Unknown site
 */

const { trimTrailingSlash } = require('../sites/normalize')

const DEV_FALLBACK_SITE_ID =
  process.env.DEV_DEFAULT_SITE_ID && process.env.DEV_DEFAULT_SITE_ID.trim()
    ? process.env.DEV_DEFAULT_SITE_ID.trim()
    : 'sauvage-watches'

function isProdEnv() {
  return process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'
}

/**
 * Tente de résoudre un site sans envoyer de réponse HTTP. Pratique pour le webhook
 * Stripe qui doit répondre proprement même si le site n'est pas trouvé.
 * @param {import('express').Request} req
 * @param {ReturnType<import('../sites/registry').buildRegistry> extends Promise<infer R> ? R : never} registry
 * @returns {object|null}
 */
function resolveSiteFromRequest(req, registry) {
  const paramId = req.params && req.params.siteId
  if (paramId && registry.byId.has(paramId)) {
    return registry.byId.get(paramId)
  }

  const headerId = req.headers['x-site-id']
  if (typeof headerId === 'string' && headerId.trim()) {
    const headerEntry = registry.byId.get(headerId.trim())
    if (headerEntry) return headerEntry
  }

  const origin = req.headers.origin
  if (typeof origin === 'string' && origin.trim()) {
    const key = trimTrailingSlash(origin.trim())
    const entry = registry.byOrigin.get(key)
    if (entry) return entry
  }

  const host = req.headers.host
  if (typeof host === 'string' && host.trim()) {
    const entry = registry.byHost.get(host.trim().toLowerCase())
    if (entry) return entry
  }

  if (!isProdEnv()) {
    const fallback = registry.byId.get(DEV_FALLBACK_SITE_ID)
    if (fallback) return fallback
  }

  return null
}

/**
 * Construit un middleware Express qui pose `req.site` ou répond 400.
 * @param {*} registry
 * @param {{ optional?: boolean }} [opts] Si optional=true, n'écrit pas de réponse en cas d'échec
 *   (le handler peut décider).
 */
function resolveSite(registry, opts = {}) {
  return function resolveSiteMiddleware(req, res, next) {
    const site = resolveSiteFromRequest(req, registry)
    if (!site) {
      if (opts.optional) return next()
      return res.status(400).json({
        success: false,
        error: 'Unknown site (Origin / X-Site-Id / :siteId non reconnu)',
      })
    }
    req.site = site
    next()
  }
}

module.exports = {
  resolveSite,
  resolveSiteFromRequest,
  DEV_FALLBACK_SITE_ID,
}
