const express = require('express')
const cors = require('cors')
const path = require('path')
// Chargement du fichier .env depuis le répertoire backend
require('dotenv').config({ path: path.join(__dirname, '.env') })

// Import des routes
const mailjetRoutes = require('./routes/mailjet')
const stripeRoutes = require('./routes/stripe')
const n8nRoutes = require('./routes/n8n')

const app = express()

// Configuration CORS pour le déploiement
// Détection de l'environnement de production (vérifie NODE_ENV ou si on est sur Render)
const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.RENDER === 'true'

const corsOptions = {
  origin: isProduction
    ? [
        'https://sauvage-watches.fr',
        'https://www.sauvage-watches.fr',
        'https://recette.sauvage-watches.fr',
      ]
    : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Requested-With',
    'Origin',
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}

// Log de la configuration CORS au démarrage
console.log('🔧 Configuration CORS:', {
  isProduction,
  allowedOrigins: corsOptions.origin,
  methods: corsOptions.methods,
  allowedHeaders: corsOptions.allowedHeaders,
  NODE_ENV: process.env.NODE_ENV,
  RENDER: process.env.RENDER,
})

app.use(cors(corsOptions))

// Gestion explicite des requêtes OPTIONS (preflight)
app.options('*', cors(corsOptions))

// Middleware de logging pour diagnostiquer les problèmes CORS en production
if (isProduction) {
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      console.log('🔍 Requête OPTIONS (preflight) reçue:', {
        origin: req.headers.origin,
        method: req.method,
        path: req.path,
        allowedOrigins: corsOptions.origin,
      })
    }
    next()
  })
}

// Middleware pour parser JSON (sauf pour le webhook Stripe qui a besoin du body brut)
// Le webhook Stripe doit recevoir le body brut pour valider la signature
app.use((req, res, next) => {
  if (req.path === '/api/stripe/webhook') {
    return next()
  }
  express.json()(req, res, next)
})

// Montage des routes
app.use('/api', mailjetRoutes)
app.use('/api/stripe', stripeRoutes)
app.use('/api/n8n', n8nRoutes)

// Route de test pour vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    mailjet: 'configured'
  })
})

// Démarrage du serveur
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
