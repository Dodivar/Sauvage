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
      ? ['https://dodivar.github.io', 'https://sauvage-watches.com']
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
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'doryandillen@gmail.com',
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
  content += `Nom: ${formData.name}\n`
  content += `Email: ${formData.email}\n`
  content += `Téléphone: ${formData.phone}\n`

  // Contenu spécifique au formulaire d'estimation
  if (formData.type === 'estimation') {
    content += `\nType d'estimation: ${formData.estimationType}\n`
    content += `Marque: ${formData.brand}\n`
    content += `Modèle: ${formData.model}\n`
    content += `Référence: ${formData.reference}\n`
    content += `Année: ${formData.year}\n`
    content += `État: ${formData.condition}\n`
    content += `Accessoires: ${formData.accessories}\n`
    content += `Prix souhaité: ${formData.price}\n`
    content += `Possession: ${formData.possession}\n`
    content += `Série: ${formData.serie}\n`
    content += `Message: ${formData.message}\n`
  }
  // Contenu spécifique au formulaire de recherche personnalisée
  else if (formData.type === 'search') {
    content += `\nType de montre: ${formData.watchType}\n`
    content += `Budget: ${formData.budget}\n`
    content += `État souhaité: ${formData.condition}\n`
    content += `Message: ${formData.message}\n`
  }

  return content
}

// Route pour l'envoi d'email avec pièces jointes
app.post('/api/send-email', upload.array('attachments', 5), async (req, res) => {
  try {
    const { type, ...formData } = req.body
    const files = req.files || []

    // Configuration de l'email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'doryandillen@gmail.com',
      to: 'doryandillen@gmail.com',
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

    // Envoi de l'email
    await transporter.sendMail(mailOptions)

    // Nettoyage des fichiers temporaires
    files.forEach((file) => {
      const fs = require('fs')
      fs.unlink(file.path, (err) => {
        if (err) console.error('Erreur lors de la suppression du fichier:', err)
      })
    })

    res.json({ success: true, message: 'Email envoyé avec succès' })
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error)
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
