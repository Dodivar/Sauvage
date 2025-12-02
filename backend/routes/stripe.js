const express = require('express')
const router = express.Router()
const Stripe = require('stripe')
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
    const successUrl = `${baseUrl}/paiement-succes?session_id={CHECKOUT_SESSION_ID}&watch_id=${watchId}`
    const cancelUrl = `${baseUrl}/paiement-annule?watch_id=${watchId}`

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

module.exports = router

