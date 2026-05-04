/**
 * Drapeaux par site (`site.config.js` → `features`) pour activer ou non les routes
 * et les entrées de navigation. Les clés absentes du manifest client héritent
 * de DEFAULT_SITE_FEATURES.
 */
export const DEFAULT_SITE_FEATURES = {
  collection: true,
  blog: true,
  recherche: true,
  estimation: true,
  estimationProcess: true,
  merci: true,
  about: true,
  legal: true,
  paymentReturn: true,
  admin: true,
}

export function mergeSiteFeatures(partial = {}) {
  const merged = { ...DEFAULT_SITE_FEATURES, ...partial }
  if (!merged.estimation) {
    merged.estimationProcess = false
  }
  return merged
}

/** Cible de secours après paiement ou liens « retour boutique » si la collection est off. */
export function getBrowsePath(features) {
  return features.collection ? '/collection' : '/'
}
