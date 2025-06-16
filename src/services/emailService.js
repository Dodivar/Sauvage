/**
 * Service pour gérer l'envoi d'emails depuis les formulaires
 */

// Configuration de l'API URL
const API_URL = import.meta.env.PROD
  ? 'https://sauvage-watches-mail-server.onrender.com'
  : 'http://localhost:3000'

/**
 * Envoie un email à partir des données du formulaire
 * @param {FormData} formData - Les données du formulaire
 * @returns {Promise<Object>} La réponse du serveur
 * @throws {Error} Si l'envoi échoue
 */
export async function sendEmail(formData) {
  try {
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi du formulaire")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error)
    throw error
  }
}

/**
 * Prépare les données du formulaire d'estimation
 * @param {HTMLFormElement} form - Le formulaire d'estimation
 * @returns {FormData} Les données du formulaire formatées
 */
export function prepareEstimationFormData(form) {
  const formData = new FormData(form)

  // Récupérer les fichiers du champ 'photos' et les ajouter comme 'attachments'
  const fileInput = form.querySelector('input[name="photos"]')
  if (fileInput && fileInput.files.length > 0) {
    Array.from(fileInput.files).forEach((file) => {
      formData.append('attachments', file)
    })
  }

  // Supprimer le champ 'photos' original
  formData.delete('photos')

  return formData
}

/**
 * Prépare les données du formulaire de recherche
 * @param {HTMLFormElement} form - Le formulaire de recherche
 * @returns {FormData} Les données du formulaire formatées
 */
export function prepareSearchFormData(form) {
  return new FormData(form)
}

/**
 * Gère la soumission d'un formulaire
 * @param {HTMLFormElement} form - Le formulaire à soumettre
 * @param {Function} prepareFormData - Fonction pour préparer les données du formulaire
 * @param {Function} onSuccess - Callback en cas de succès
 * @param {Function} onError - Callback en cas d'erreur
 * @returns {Promise<void>}
 */
export async function handleFormSubmit(form, prepareFormData, onSuccess, onError) {
  try {
    const formData = prepareFormData(form)
    const response = await sendEmail(formData)
    onSuccess(response)
  } catch (error) {
    onError(error)
  }
}

// Fonction pour envoyer un email avec retry
export const sendEmailWithRetry = async (endpoint, formData, maxRetries = 3) => {
  let retries = 0
  const retryDelay = 2000 // 2 secondes

  while (retries < maxRetries) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de l'envoi de l'email")
      }

      return await response.json()
    } catch (error) {
      console.error(`Tentative ${retries + 1} échouée:`, error)
      retries++

      if (retries === maxRetries) {
        throw new Error(
          'Le serveur met du temps à démarrer. Veuillez réessayer dans quelques instants.',
        )
      }

      // Attendre avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
    }
  }
}
