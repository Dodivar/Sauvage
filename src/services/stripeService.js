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


