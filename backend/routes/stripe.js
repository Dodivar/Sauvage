const express = require('express')
const router = express.Router()
const Stripe = require('stripe')
const crypto = require('crypto')
const { createClient } = require('@supabase/supabase-js')
const { getBaseUrl } = require('../utils/getBaseUrl')

// Configuration Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabase = null

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
} else {
  console.warn('⚠️  Supabase non configuré. Les fonctionnalités Stripe nécessitent Supabase.')
}

// Système de tokens temporaires pour sécuriser PaymentCancel
// Structure: Map<token, { watchId, expiresAt }>
const paymentTokens = new Map()
const TOKEN_EXPIRATION_MS = 60 * 60 * 1000 // 1 heure

// Fonction pour générer un token unique
function generatePaymentToken() {
  return crypto.randomUUID()
}

// Fonction pour nettoyer les tokens expirés
function cleanupExpiredTokens() {
  const now = Date.now()
  let cleanedCount = 0
  
  for (const [token, data] of paymentTokens.entries()) {
    if (data.expiresAt < now) {
      paymentTokens.delete(token)
      cleanedCount++
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Nettoyage: ${cleanedCount} token(s) expiré(s) supprimé(s)`)
  }
}

// Nettoyer les tokens expirés toutes les 30 minutes
setInterval(cleanupExpiredTokens, 30 * 60 * 1000)

// Route pour créer une session Stripe Checkout
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { watchId } = req.body

    if (!watchId) {
      return res.status(400).json({
        success: false,
        error: 'ID de montre manquant',
      })
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Configuration Supabase manquante',
      })
    }

    // Vérifier que la montre existe et est disponible
    const { data: watch, error: watchError } = await supabase
      .from('watches')
      .select('id, name, reference, price, is_available, is_sold')
      .eq('id', watchId)
      .single()

    if (watchError || !watch) {
      return res.status(404).json({
        success: false,
        error: 'Montre non trouvée',
      })
    }

    // Vérifier que la montre est disponible
    if (!watch.is_available || watch.is_sold) {
      return res.status(400).json({
        success: false,
        error: 'Cette montre n\'est plus disponible à la vente',
      })
    }

    const baseUrl = getBaseUrl()
    
    // Générer un token temporaire pour sécuriser l'accès à PaymentCancel
    const cancelToken = generatePaymentToken()
    const expiresAt = Date.now() + TOKEN_EXPIRATION_MS
    
    // Stocker le token avec le watch_id et la date d'expiration
    paymentTokens.set(cancelToken, {
      watchId,
      expiresAt,
    })
    
    const successUrl = `${baseUrl}/paiement-succes?session_id={CHECKOUT_SESSION_ID}&watch_id=${watchId}`
    const cancelUrl = `${baseUrl}/paiement-annule?watch_id=${watchId}&token=${cancelToken}`

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: watch.name,
              description: `Réf. ${watch.reference}`,
            },
            unit_amount: Math.round(watch.price * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        watch_id: watch.id,
        watch_name: watch.name,
        watch_reference: watch.reference || '',
      },
      customer_email: undefined, // Laisse Stripe demander l'email
    })

    console.log(`✅ Session Stripe créée pour la montre ${watch.name} (${watch.id}): ${session.id}`)

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('❌ Erreur lors de la création de la session Stripe:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Une erreur est survenue lors de la création de la session de paiement',
    })
  }
})

// Route pour gérer les webhooks Stripe
// IMPORTANT: Cette route doit recevoir le body brut pour valider la signature
// IMPORTANT: Les webhooks doivent TOUJOURS retourner 200 pour éviter les réessais Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  // Toujours retourner 200 pour éviter les réessais Stripe, même en cas d'erreur
  // Les erreurs sont loggées pour être tracées

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET non configuré - Webhook ignoré')
    return res.status(200).json({ received: true, error: 'Webhook secret manquant' })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('❌ Erreur de validation du webhook Stripe:', err.message)
    console.error('❌ Signature reçue:', sig)
    // Retourner 200 pour éviter les réessais, mais logger l'erreur
    return res.status(200).json({ received: true, error: `Webhook validation failed: ${err.message}` })
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    console.log(`✅ Paiement réussi pour la session: ${session.id}`)
    console.log(`📦 Métadonnées:`, session.metadata)

    const watchId = session.metadata?.watch_id

    if (!watchId) {
      console.error('❌ watch_id manquant dans les métadonnées de la session')
      console.error('❌ Session ID:', session.id)
      console.error('❌ Métadonnées complètes:', JSON.stringify(session.metadata, null, 2))
      // Retourner 200 pour éviter les réessais, mais logger l'erreur
      return res.status(200).json({ received: true, error: 'watch_id manquant dans les métadonnées' })
    }

    if (!supabase) {
      console.error('❌ Supabase non configuré - Impossible de mettre à jour le stock')
      console.error('❌ Session ID:', session.id)
      console.error('❌ Watch ID:', watchId)
      // Retourner 200 pour éviter les réessais, mais logger l'erreur critique
      // NOTE: Dans ce cas, la montre ne sera pas marquée comme vendue automatiquement
      // Il faudra le faire manuellement depuis le dashboard Stripe
      return res.status(200).json({ received: true, error: 'Configuration Supabase manquante' })
    }

    try {
      // Mettre à jour la montre dans Supabase
      const { error: updateError } = await supabase
        .from('watches')
        .update({
          is_sold: true,
          is_available: false,
          sale_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', watchId)

      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour de la montre:', updateError)
        console.error('❌ Session ID:', session.id)
        console.error('❌ Watch ID:', watchId)
        console.error('❌ Détails de l\'erreur Supabase:', JSON.stringify(updateError, null, 2))
        // Retourner 200 pour éviter les réessais, mais logger l'erreur critique
        // NOTE: Dans ce cas, la montre ne sera pas marquée comme vendue automatiquement
        // Il faudra le faire manuellement depuis le dashboard Supabase
        return res.status(200).json({ received: true, error: 'Erreur lors de la mise à jour du stock', details: updateError.message })
      }

      console.log(`✅ Montre ${watchId} marquée comme vendue`)
      console.log(`💰 Montant payé: ${session.amount_total / 100} ${session.currency.toUpperCase()}`)
      console.log(`📧 Email client: ${session.customer_details?.email || 'Non fourni'}`)

      // Retourner une réponse 200 pour confirmer la réception du webhook
      res.status(200).json({ received: true, success: true })
    } catch (error) {
      console.error('❌ Erreur lors du traitement du webhook:', error)
      console.error('❌ Stack trace:', error.stack)
      console.error('❌ Session ID:', session.id)
      console.error('❌ Watch ID:', watchId)
      // Retourner 200 pour éviter les réessais, mais logger l'erreur critique
      res.status(200).json({ received: true, error: error.message })
    }
  } else {
    // Pour les autres événements, on retourne juste une confirmation
    console.log(`ℹ️  Événement Stripe reçu (non traité): ${event.type}`)
    res.status(200).json({ received: true })
  }
})

// Route pour vérifier la validité d'une session de paiement
router.get('/verify-session', async (req, res) => {
  try {
    const { session_id, watch_id, token } = req.query

    // Si on a un session_id, c'est pour PaymentSuccess
    if (session_id) {
      if (!watch_id) {
        return res.status(400).json({
          valid: false,
          reason: 'watch_id manquant',
        })
      }

      try {
        // Vérifier avec Stripe que la session existe et est complétée
        const session = await stripe.checkout.sessions.retrieve(session_id)

        if (!session) {
          console.warn(`⚠️  Tentative d'accès avec session_id invalide: ${session_id}`)
          return res.status(200).json({
            valid: false,
            reason: 'Session Stripe invalide',
          })
        }

        // Vérifier que la session est complétée
        if (session.payment_status !== 'paid') {
          console.warn(`⚠️  Tentative d'accès avec session non payée: ${session_id}`)
          return res.status(200).json({
            valid: false,
            reason: 'Paiement non complété',
          })
        }

        // Vérifier que le watch_id correspond aux métadonnées de la session
        if (session.metadata?.watch_id !== watch_id) {
          console.warn(
            `⚠️  Tentative d'accès avec watch_id incorrect: session=${session_id}, watch_id=${watch_id}`,
          )
          return res.status(200).json({
            valid: false,
            reason: 'watch_id ne correspond pas à la session',
          })
        }

        console.log(`✅ Session vérifiée avec succès: ${session_id}`)
        return res.status(200).json({
          valid: true,
          session: {
            id: session.id,
            payment_status: session.payment_status,
            amount_total: session.amount_total,
            currency: session.currency,
          },
        })
      } catch (error) {
        console.error('❌ Erreur lors de la vérification de la session Stripe:', error)
        return res.status(200).json({
          valid: false,
          reason: 'Erreur lors de la vérification de la session',
        })
      }
    }

    // Si on a un token, c'est pour PaymentCancel
    if (token) {
      if (!watch_id) {
        return res.status(400).json({
          valid: false,
          reason: 'watch_id manquant',
        })
      }

      // Nettoyer les tokens expirés avant de vérifier
      cleanupExpiredTokens()

      // Vérifier que le token existe
      const tokenData = paymentTokens.get(token)

      if (!tokenData) {
        console.warn(`⚠️  Tentative d'accès avec token invalide ou expiré: ${token}`)
        return res.status(200).json({
          valid: false,
          reason: 'Token invalide ou expiré',
        })
      }

      // Vérifier que le token n'est pas expiré
      if (tokenData.expiresAt < Date.now()) {
        paymentTokens.delete(token)
        console.warn(`⚠️  Tentative d'accès avec token expiré: ${token}`)
        return res.status(200).json({
          valid: false,
          reason: 'Token expiré',
        })
      }

      // Vérifier que le watch_id correspond au token
      if (tokenData.watchId !== watch_id) {
        console.warn(
          `⚠️  Tentative d'accès avec watch_id incorrect: token=${token}, watch_id=${watch_id}`,
        )
        return res.status(200).json({
          valid: false,
          reason: 'watch_id ne correspond pas au token',
        })
      }

      // Token valide - le supprimer pour éviter la réutilisation
      paymentTokens.delete(token)

      console.log(`✅ Token vérifié avec succès pour watch_id: ${watch_id}`)
      return res.status(200).json({
        valid: true,
      })
    }

    // Ni session_id ni token fourni
    return res.status(400).json({
      valid: false,
      reason: 'session_id ou token requis',
    })
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
    return res.status(500).json({
      valid: false,
      reason: 'Erreur serveur lors de la vérification',
    })
  }
})

module.exports = router

