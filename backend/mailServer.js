const express = require('express')
const cors = require('cors')
const multer = require('multer')
const Mailjet = require('node-mailjet')
const path = require('path')
const fs = require('fs')
// Chargement du fichier .env depuis le répertoire backend
require('dotenv').config({ path: path.join(__dirname, '.env') })

const app = express()
const upload = multer({ dest: 'uploads/' })

// Configuration CORS pour le déploiement
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          'https://dodivar.github.io',
          'https://sauvage-watches.fr',
          'https://www.sauvage-watches.fr',
        ]
      : 'http://localhost:5173',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())

// Configuration Mailjet
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || 'your_mailjet_api_key',
  process.env.MAILJET_SECRET_KEY || 'your_mailjet_secret_key'
)

// Fonction pour créer le template HTML de l'email
const createEmailTemplate = (formData) => {
  const isEstimation = formData.type === 'estimation'
  const title = isEstimation ? 'Nouvelle demande d\'estimation' : 'Nouvelle recherche personnalisée'
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #d4af37;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #d4af37;
                margin-bottom: 10px;
            }
            .title {
                font-size: 24px;
                color: #333;
                margin: 0;
            }
            .section {
                margin-bottom: 25px;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 5px;
                border-left: 4px solid #d4af37;
            }
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #d4af37;
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .field {
                margin-bottom: 10px;
                display: flex;
                flex-wrap: wrap;
            }
            .field-label {
                font-weight: bold;
                color: #555;
                min-width: 150px;
                margin-right: 10px;
            }
            .field-value {
                color: #333;
                flex: 1;
            }
            .message-section {
                background-color: #fff;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 5px;
                margin-top: 20px;
            }
            .message-text {
                font-style: italic;
                color: #666;
                white-space: pre-wrap;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 14px;
            }
            .attachments {
                background-color: #e8f4fd;
                border: 1px solid #b3d9ff;
                padding: 15px;
                border-radius: 5px;
                margin-top: 15px;
            }
            .attachment-item {
                color: #0066cc;
                margin-bottom: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">SAUVAGE WATCHES</div>
                <h1 class="title">${title}</h1>
            </div>

            <div class="section">
                <div class="section-title">Informations de contact</div>
                <div class="field">
                    <span class="field-label">Prénom:</span>
                    <span class="field-value">${formData.nickname || 'Non renseigné'}</span>
                </div>
                <div class="field">
                    <span class="field-label">Nom:</span>
                    <span class="field-value">${formData.name || 'Non renseigné'}</span>
                </div>
                <div class="field">
                    <span class="field-label">Email:</span>
                    <span class="field-value">${formData.email || 'Non renseigné'}</span>
                </div>
                <div class="field">
                    <span class="field-label">Téléphone:</span>
                    <span class="field-value">${formData.tel || 'Non renseigné'}</span>
                </div>
                <div class="field">
                    <span class="field-label">Préférence de contact:</span>
                    <span class="field-value">${Array.isArray(formData.contact_mode) ? formData.contact_mode.join(', ') : (formData.contact_mode || 'Pas de préférence')}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Détails de la montre</div>
                <div class="field">
                    <span class="field-label">Marque:</span>
                    <span class="field-value">${formData.brand || 'Non renseigné'}</span>
                </div>
                <div class="field">
                    <span class="field-label">Modèle:</span>
                    <span class="field-value">${formData.model || 'Non renseigné'}</span>
                </div>
                ${isEstimation ? `
                    <div class="field">
                        <span class="field-label">Type d'estimation:</span>
                        <span class="field-value">${formData.estimationType || 'Non renseigné'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Numéro de série:</span>
                        <span class="field-value">${formData.serienumber || 'Non renseigné'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Année:</span>
                        <span class="field-value">${formData.year || 'Non renseigné'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">État:</span>
                        <span class="field-value">${formData.condition || 'Non renseigné'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Accessoires:</span>
                        <span class="field-value">${formData.accessories || 'Non renseigné'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Possession:</span>
                        <span class="field-value">${formData.possession || 'Non renseigné'}</span>
                    </div>
                    <div class="field">
                        <span class="field-label">Série:</span>
                        <span class="field-value">${formData.serie || 'Non renseigné'}</span>
                    </div>
                ` : `
                    ${formData.budget_min && formData.budget_max ? `
                        <div class="field">
                            <span class="field-label">Budget:</span>
                            <span class="field-value">${formData.budget_min} € à ${formData.budget_max} €</span>
                        </div>
                    ` : ''}
                    ${formData.budget_min && !formData.budget_max ? `
                        <div class="field">
                            <span class="field-label">Budget minimum:</span>
                            <span class="field-value">${formData.budget_min} €</span>
                        </div>
                    ` : ''}
                    ${formData.budget_max && !formData.budget_min ? `
                        <div class="field">
                            <span class="field-label">Budget maximum:</span>
                            <span class="field-value">${formData.budget_max} €</span>
                        </div>
                    ` : ''}
                    <div class="field">
                        <span class="field-label">État souhaité:</span>
                        <span class="field-value">${formData.condition || 'Non renseigné'}</span>
                    </div>
                `}
            </div>

            ${formData.message ? `
                <div class="message-section">
                    <div class="section-title">Message</div>
                    <div class="message-text">${formData.message}</div>
                </div>
            ` : ''}

            <div class="footer">
                <p>Email envoyé automatiquement depuis le site Sauvage Watches</p>
                <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
            </div>
        </div>
    </body>
    </html>
  `
}

// Fonction pour formater le contenu texte de l'email (fallback)
const formatEmailContent = (formData) => {
  let content = ''

  // Informations de base communes aux deux formulaires
  content += `Prénom: ${formData.nickname}\n`
  content += `Nom: ${formData.name}\n`
  content += `Email: ${formData.email}\n`
  content += `Téléphone: ${formData.tel}\n`
  let contactPref = formData.contact_mode || 'pas de préférence'
  if (Array.isArray(contactPref)) {
    contactPref = contactPref.join(', ')
  }
  content += `Préférence de contact: ${contactPref}\n`

  content += `\nMarque: ${formData.brand}\n`
  content += `Modèle: ${formData.model}\n`

  // Contenu spécifique au formulaire d'estimation
  if (formData.type === 'estimation') {
    content += `Type d'estimation: ${formData.estimationType}\n`
    content += `Numéro de série: ${formData.serienumber}\n`
    content += `Année: ${formData.year}\n`
    content += `État: ${formData.condition}\n`
    content += `Accessoires: ${formData.accessories}\n`
    content += `Possession: ${formData.possession}\n`
    content += `Série: ${formData.serie}\n`
  }
  // Contenu spécifique au formulaire de recherche personnalisée
  else if (formData.type === 'search') {
    if (formData.budget_min && formData.budget_max) {
      content += `Budget: ${formData.budget_min} € à ${formData.budget_max} €\n`
    } else if (formData.budget_min) {
      content += `Budget minimum: ${formData.budget_min} €\n`
    } else if (formData.budget_max) {
      content += `Budget maximum: ${formData.budget_max} €\n`
    }
    content += `État souhaité: ${formData.condition}\n`
  }

  content += `\nMessage: ${formData.message}\n`
  return content
}

// Route pour l'envoi d'email avec pièces jointes
app.post('/api/send-email', upload.array('attachments', 20), async (req, res) => {
  try {
    console.log("--- Nouvelle requête d'envoi d'email reçue ---")
    const { type, ...formData } = req.body
    const files = req.files || []
    console.log('Type de formulaire:', type)
    console.log('Données reçues:', formData)
    console.log(
      'Fichiers reçus:',
      files.map((f) => f.originalname),
    )

    // Préparation des pièces jointes pour Mailjet
    const attachments = files.map(file => {
      const fileContent = fs.readFileSync(file.path)
      return {
        ContentType: file.mimetype || 'application/octet-stream',
        Filename: file.originalname,
        Base64Content: fileContent.toString('base64')
      }
    })

    // Configuration de l'email avec Mailjet
    const emailData = {
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM || 'contact@sauvage-watches.fr',
            Name: 'Sauvage Watches'
          },
          To: [
            {
              Email: 'contact@sauvage-watches.fr',
              Name: 'Sauvage Watches'
            }
          ],
          Subject: type === 'estimation'
            ? `Nouvelle demande d'estimation - ${formData.brand} ${formData.model}`
            : 'Nouvelle recherche personnalisée',
          TextPart: formatEmailContent({ type, ...formData }),
          HTMLPart: createEmailTemplate({ type, ...formData }),
          Attachments: attachments
        }
      ]
    }

    console.log("Préparation de l'envoi du mail avec Mailjet...")
    
    // Envoi de l'email via Mailjet
    const result = await mailjet.post('send', { version: 'v3.1' }).request(emailData)
    
    console.log('✅ Email envoyé avec succès via Mailjet')
    console.log('Mailjet Response:', result.body)

    // Nettoyage des fichiers temporaires
    files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Erreur lors de la suppression du fichier:', err)
      })
    })

    res.json({ 
      success: true, 
      message: 'Email envoyé avec succès',
      mailjetResponse: result.body
    })
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error)
    
    // Nettoyage des fichiers en cas d'erreur
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier:', err)
        })
      })
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email",
      error: error.message,
      details: error.response?.body || error.stack
    })
  }
})

// Route de test pour vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    mailjet: 'configured'
  })
})

// Route de diagnostic pour vérifier la configuration
app.get('/api/config-check', (req, res) => {
  const apiKey = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY
  
  res.json({
    apiKeyExists: !!apiKey,
    secretKeyExists: !!secretKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    secretKeyLength: secretKey ? secretKey.length : 0,
    apiKeyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'Non défini',
    secretKeyPreview: secretKey ? `${secretKey.substring(0, 8)}...` : 'Non défini',
    usingDefaults: apiKey === 'your_mailjet_api_key' || secretKey === 'your_mailjet_secret_key'
  })
})

// Route de test pour vérifier la configuration Mailjet
app.get('/api/test-mailjet', async (req, res) => {
  try {
    // Vérification préalable des clés
    const apiKey = process.env.MAILJET_API_KEY
    const secretKey = process.env.MAILJET_SECRET_KEY
    
    if (!apiKey || !secretKey || apiKey === 'your_mailjet_api_key' || secretKey === 'your_mailjet_secret_key') {
      return res.status(400).json({
        success: false,
        message: 'Clés API Mailjet non configurées',
        error: 'Veuillez configurer MAILJET_API_KEY et MAILJET_SECRET_KEY dans votre fichier .env',
        apiKeyExists: !!apiKey,
        secretKeyExists: !!secretKey
      })
    }

    const result = await mailjet.get('user').request()
    res.json({
      success: true,
      message: 'Mailjet configuration is valid',
      user: result.body
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Mailjet configuration error',
      error: error.message,
      details: error.response?.data || error.stack
    })
  }
})

// Démarrage du serveur
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log('Mailjet API configured')
})
