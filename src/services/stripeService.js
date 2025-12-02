const BACKEND_URL = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_URL
  : 'http://localhost:3000'

/**
 * Crée une session Stripe Checkout et redirige l'utilisateur vers la page de paiement
 * @param {string} watchId - ID de la montre à acheter
 * @returns {Promise<void>}
 */
export async function createCheckoutSession(watchId) {
  try {
    if (!watchId) {
      throw new Error('ID de montre manquant')
    }

    // Appeler l'API backend pour créer la session
    const response = await fetch(`${BACKEND_URL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ watchId }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la création de la session de paiement')
    }

    if (!data.success || !data.url) {
      throw new Error('Réponse invalide du serveur')
    }

    // Rediriger vers Stripe Checkout
    window.location.href = data.url
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error)
    throw error
  }
}

/**
 * Vérifie la validité d'une session de paiement ou d'un token
 * @param {string|null} sessionId - ID de la session Stripe (pour PaymentSuccess)
 * @param {string} watchId - ID de la montre
 * @param {string|null} token - Token temporaire (pour PaymentCancel)
 * @returns {Promise<{valid: boolean, reason?: string}>}
 */
export async function verifyPaymentSession(sessionId, watchId, token = null) {
  try {
    if (!watchId) {
      return { valid: false, reason: 'watch_id manquant' }
    }

    // Construire les paramètres de requête
    const params = new URLSearchParams({ watch_id: watchId })
    
    if (sessionId) {
      params.append('session_id', sessionId)
    }
    
    if (token) {
      params.append('token', token)
    }

    // Appeler l'API backend pour vérifier
    const response = await fetch(`${BACKEND_URL}/api/stripe/verify-session?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        valid: false,
        reason: data.reason || 'Erreur lors de la vérification',
      }
    }

    return data
  } catch (error) {
    console.error('Erreur lors de la vérification de la session de paiement:', error)
    return {
      valid: false,
      reason: 'Erreur de connexion au serveur',
    }
  }
}


