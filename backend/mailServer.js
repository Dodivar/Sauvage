const express = require('express')
const cors = require('cors')
const multer = require('multer')
const nodemailer = require('nodemailer')
const path = require('path')
require('dotenv').config()

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

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: process.env.SMTP_PORT || 465,
  secure: true,
  connectionTimeout: 10000,
  auth: {
    user: process.env.SMTP_USER || 'contact@sauvage-watches.fr',
    pass: process.env.SMTP_PASS,
  },
})
// GMAIL
// host: process.env.SMTP_HOST || 'smtp.gmail.com',
// port: process.env.SMTP_PORT || 587,

// Fonction pour formater le contenu de l'email
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

    // Configuration de l'email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'contact@sauvage-watches.fr',
      to: 'contact@sauvage-watches.fr',
      subject:
        type === 'estimation'
          ? `Nouvelle demande d'estimation - ${formData.brand} ${formData.model}`
          : 'Nouvelle recherche personnalisée',
      text: formatEmailContent({ type, ...formData }),
      attachments: files.map((file) => ({
        filename: file.originalname,
        path: file.path,
      })),
    }

    console.log("Préparation de l'envoi du mail...")
    await transporter.sendMail(mailOptions)
    console.log('✅ Email envoyé avec succès à', mailOptions.to)

    // Nettoyage des fichiers temporaires
    files.forEach((file) => {
      const fs = require('fs')
      fs.unlink(file.path, (err) => {
        if (err) console.error('Erreur lors de la suppression du fichier:', err)
      })
    })

    res.json({ success: true, message: 'Email envoyé avec succès' })
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email",
      error: error.message,
    })
  }
})

// Route de test pour vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Démarrage du serveur
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
