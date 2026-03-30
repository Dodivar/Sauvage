const INIT_FLAG = '__sauvage_ga_initialized'

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
      console.info('[Sauvage] Google Analytics : VITE_GA_ID absent, chargement ignoré.')
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

  if (window[INIT_FLAG]) {
    applyConfig()
    return
  }

  const pending = (window.__sauvage_ga_pending_waiters =
    window.__sauvage_ga_pending_waiters || [])
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
    window.__sauvage_ga_pending_waiters = []
    applyConfig()
  }
  document.head.appendChild(script)
}
