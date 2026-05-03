/** Stockage du consentement cookies / traceurs (hors navigation HTTP du site). */

import { getSiteConfig } from '@/site/getSiteConfig.js'

export const COOKIE_CONSENT_STORAGE_KEY = getSiteConfig().integrations.cookieConsentStorageKey

export const COOKIE_CONSENT_VERSION = 1

/** Durée de mémorisation du choix (6 mois). */
export const COOKIE_CONSENT_TTL_MS = 180 * 24 * 60 * 60 * 1000

/**
 * @typedef {{ analytics: boolean, savedAt: string, expired: boolean } | null} ConsentState
 */

/**
 * @returns {ConsentState}
 */
export function getConsentState() {
  if (typeof localStorage === 'undefined') return null

  const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  if (!raw) return null

  try {
    const data = JSON.parse(raw)
    if (
      data.version !== COOKIE_CONSENT_VERSION ||
      typeof data.analytics !== 'boolean' ||
      typeof data.savedAt !== 'string'
    ) {
      return null
    }

    const saved = new Date(data.savedAt).getTime()
    if (Number.isNaN(saved)) return null

    const expired = Date.now() - saved > COOKIE_CONSENT_TTL_MS

    return {
      analytics: data.analytics,
      savedAt: data.savedAt,
      expired,
    }
  } catch {
    return null
  }
}

/**
 * Indique si un choix valide et non expiré a été enregistré.
 * @returns {boolean}
 */
export function hasValidConsent() {
  const state = getConsentState()
  return Boolean(state && !state.expired)
}

/**
 * Préférence mesure d’audience, uniquement si le consentement global est encore valide.
 * @returns {boolean}
 */
export function isAnalyticsAllowed() {
  const state = getConsentState()
  return Boolean(state && !state.expired && state.analytics)
}

/**
 * @returns {boolean} true si le bandeau doit s’afficher (pas de choix ou choix expiré).
 */
export function shouldShowBanner() {
  const state = getConsentState()
  return !state || state.expired
}

/**
 * @param {{ analytics: boolean }} params
 */
export function saveConsent({ analytics }) {
  if (typeof localStorage === 'undefined') return

  const payload = {
    version: COOKIE_CONSENT_VERSION,
    analytics: Boolean(analytics),
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(payload))
}
