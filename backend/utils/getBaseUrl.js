/**
 * Renvoie l'URL publique du frontend pour un site donné.
 * Utilisée pour générer les URLs absolues (success_url / cancel_url Stripe).
 *
 * Ordre de résolution :
 *   1. `site.secrets.baseUrlOverride` (variable `SITE_<ID>__BASE_URL`, ou fallback `BASE_URL` legacy pour Sauvage)
 *   2. En production : `site.config.urls.production`
 *   3. En dev : `site.config.urls.development` (sinon http://localhost:5173)
 *
 * @param {object} site Site normalisé (registry.byId).
 * @returns {string}
 */
function getBaseUrl(site) {
  if (!site) {
    throw new Error('getBaseUrl(site) appelée sans site (req.site manquant)')
  }
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'

  const override = site.secrets && site.secrets.baseUrlOverride
  if (override) return override

  const urls = (site.config && site.config.urls) || {}
  if (isProduction) {
    if (urls.production) return urls.production
  }
  return urls.development || 'http://localhost:5173'
}

module.exports = { getBaseUrl }
