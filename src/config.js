export const WHATSAPP_NUMBER = '+33612843926'
export const EMAIL_CONTACT = 'contact@sauvage-watches.fr'

const urlProduction = 'https://sauvage-watches.fr'
const urlStaging = 'https://recette.sauvage-watches.fr'
const urlDevelopment = 'http://localhost:5173'

// Détection automatique de l'URL de base selon l'environnement
function getBaseUrl() {
  // Si VITE_BASE_URL est défini explicitement, l'utiliser (priorité)
  if (import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL
  }

  // En production Vercel (branche main)
  if (import.meta.env.VERCEL_ENV === 'production') {
    return urlProduction
  }

  // En preview/staging Vercel (branche staging ou autres previews)
  if (import.meta.env.VERCEL_ENV === 'preview' || import.meta.env.VERCEL_URL) {
    // Si on est sur le domaine de staging, utiliser l'URL de recette
    if (import.meta.env.VERCEL_URL?.includes('recette') || 
        typeof window !== 'undefined' && window.location.hostname.includes('recette')) {
      return urlStaging
    }
    // Sinon, utiliser l'URL Vercel preview
    return `https://${import.meta.env.VERCEL_URL || 'recette.sauvage-watches.fr'}`
  }

  // En développement local
  if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
    return urlDevelopment
  }

  // Par défaut : production
  return urlProduction
}

export const BASE_URL = getBaseUrl()
