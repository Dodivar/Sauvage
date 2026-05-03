import { getSiteConfig } from '@/site/getSiteConfig.js'

function initFlagName() {
  return getSiteConfig().integrations.gaInitFlag
}

function pendingWaitersKey() {
  return getSiteConfig().integrations.gaPendingWaitersKey
}

function pagePath() {
  return `${window.location.pathname}${window.location.search}`
}

/**
 * Charge gtag.js et envoie une config pour la page courante.
 * Idempotent : un seul script ; appels concurrents avant onload n’envoient qu’une page vue.
 * @param {string | undefined} measurementId — ex. G-XXXXXXXX
 */
export function ensureGoogleAnalytics(measurementId) {
  if (!measurementId) {
    if (import.meta.env.DEV) {
      console.info(
        `${getSiteConfig().integrations.gaDevLogPrefix} Google Analytics : VITE_GA_ID absent, chargement ignoré.`,
      )
    }
    return
  }

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag

  const applyConfig = () => {
    gtag('config', measurementId, {
      page_path: pagePath(),
      send_page_view: true,
    })
  }

  const INIT_FLAG = initFlagName()
  if (window[INIT_FLAG]) {
    applyConfig()
    return
  }

  const pendingKey = pendingWaitersKey()
  const pending = (window[pendingKey] = window[pendingKey] || [])
  pending.push(1)

  if (pending.length > 1) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  script.onload = () => {
    window[INIT_FLAG] = true
    gtag('js', new Date())
    window[pendingKey] = []
    applyConfig()
  }
  document.head.appendChild(script)
}
