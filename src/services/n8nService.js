/**
 * Service pour appeler les workflows n8n
 */

// URL du workflow n8n pour la génération d'articles
const N8N_WORKFLOW_URL = 'https://sauvage-watches.app.n8n.cloud/webhook/0adc09a6-a55c-4cd6-be94-f99c3036d441' //'https://sauvage-watches.app.n8n.cloud/webhook-test/0adc09a6-a55c-4cd6-be94-f99c3036d441'

/**
 * Génère un article depuis le nom d'une montre ou d'une marque via n8n
 * @param {string} watchName - Le nom de la montre ou de la marque
 * @returns {Promise<Object>} La réponse du workflow n8n
 * @throws {Error} Si l'appel échoue
 */
export async function generateArticleFromWatch(watchName) {
  if (!watchName || !watchName.trim()) {
    throw new Error('Le nom de la montre ou de la marque est obligatoire')
  }

  try {
    // Préparer les données en FormData
    const formData = new FormData()
    formData.append('watchName', watchName.trim())

    console.log(`Appel du workflow n8n pour générer un article: ${watchName}`)

    // Appeler le webhook n8n
    const response = await fetch(N8N_WORKFLOW_URL, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = 'Erreur lors de la génération de l\'article'
      
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.error || errorMessage
      } catch {
        errorMessage = errorText || `Erreur HTTP ${response.status}`
      }

      throw new Error(errorMessage)
    }

    // Essayer de parser la réponse en JSON
    let result
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
    } else {
      const text = await response.text()
      result = { success: true, message: text || 'Article généré avec succès' }
    }

    console.log('Workflow n8n exécuté avec succès:', result)
    return result
  } catch (error) {
    console.error('Erreur lors de l\'appel au workflow n8n:', error)
    
    // Si c'est déjà une Error avec un message, la relancer
    if (error instanceof Error) {
      throw error
    }
    
    // Sinon, créer une nouvelle erreur
    throw new Error(
      error.message || 
      'Une erreur est survenue lors de la génération de l\'article. Veuillez réessayer.'
    )
  }
}

