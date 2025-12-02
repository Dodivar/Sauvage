const express = require('express')
const router = express.Router()
const FormData = require('form-data')

// Configuration n8n
// Note: Utilisez /webhook/ pour la production (workflow activé) ou /webhook-test/ pour le mode test
const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.RENDER === 'true'

const defaultN8nUrl = isProduction
  ? 'https://n8n.srv1166238.hstgr.cloud/webhook/0adc09a6-a55c-4cd6-be94-f99c3036d441'
  : 'https://n8n.srv1166238.hstgr.cloud/webhook-test/0adc09a6-a55c-4cd6-be94-f99c3036d441'
const N8N_WORKFLOW_URL = process.env.N8N_WORKFLOW_URL || defaultN8nUrl

// Route proxy pour n8n (évite les problèmes CORS)
router.post('/generate-article', async (req, res) => {
  try {
    const { watchName } = req.body

    if (!watchName || !watchName.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Le nom de la montre ou de la marque est obligatoire' 
      })
    }

    console.log(`Appel du workflow n8n pour générer un article: ${watchName}`)
    console.log(`URL n8n utilisée: ${N8N_WORKFLOW_URL} (mode: ${isProduction ? 'production' : 'debug/test'})`)

    // Préparer les données en FormData pour n8n
    const formData = new FormData()
    formData.append('watchName', watchName.trim())

    // Appeler le webhook n8n depuis le serveur
    const response = await fetch(N8N_WORKFLOW_URL, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Erreur n8n (${response.status}):`, errorText)
      return res.status(response.status).json({ 
        success: false, 
        error: errorText || `Erreur HTTP ${response.status}` 
      })
    }

    // Parser la réponse
    const contentType = response.headers.get('content-type')
    let result
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
      
      // Normaliser la réponse n8n
      if (Array.isArray(result) && result.length > 0) {
        result = result[0]
      }
      
      if (result && typeof result === 'object' && result.body && !result.id && !result.articleId) {
        result = result.body
      }
    } else {
      const text = await response.text()
      result = { success: true, message: text || 'Article généré avec succès' }
    }

    console.log('Workflow n8n exécuté avec succès:', result)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Erreur lors de l\'appel au workflow n8n:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Une erreur est survenue lors de la génération de l\'article' 
    })
  }
})

module.exports = router

