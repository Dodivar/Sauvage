const express = require('express')
const rateLimit = require('express-rate-limit')
const Stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')
const { getBaseUrl } = require('../utils/getBaseUrl')
const { signPaymentCancelToken, verifyPaymentCancelToken } = require('../utils/paymentCancelToken')

const router = express.Router()

const RESERVE_MINUTES = 30

const checkoutRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.STRIPE_CHECKOUT_RATE_LIMIT_MAX || '30', 10),
  standardHeaders: true,
  legacyHeaders: false,
})

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabase = null

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
} else {
  console.warn('⚠️  Supabase non configuré. Les fonctionnalités Stripe nécessitent Supabase.')
}

async function tryClaimStripeEvent(event) {
  const { error } = await supabase.from('stripe_processed_events').insert({
    event_id: event.id,
    event_type: event.type,
  })
  if (!error) {
    return { duplicate: false }
  }
  if (error.code === '23505') {
    return { duplicate: true }
  }
  throw error
}

async function releaseStripeEventClaim(eventId) {
  await supabase.from('stripe_processed_events').delete().eq('event_id', eventId)
}

async function rollbackReservation(watchId) {
  await supabase.from('watches').update({
    checkout_reserved_until: null,
    updated_at: new Date().toISOString(),
  }).eq('id', watchId)
}

async function handleCheckoutSessionCompleted(session) {
  const watchId = session.metadata?.watch_id
  if (!watchId) {
    throw new Error('watch_id manquant dans les métadonnées de la session')
  }

  const { error: updateError } = await supabase
    .from('watches')
    .update({
      is_sold: true,
      is_available: false,
      sale_date: new Date().toISOString(),
      checkout_reserved_until: null,
      stripe_checkout_session_id: session.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', watchId)

  if (updateError) {
    throw updateError
  }

  console.log(`✅ Montre ${watchId} marquée comme vendue (session ${session.id})`)
  console.log(`💰 Montant payé: ${session.amount_total != null ? session.amount_total / 100 : '?'} ${(session.currency || '').toUpperCase()}`)
  console.log(`📧 Email client: ${session.customer_details?.email || 'Non fourni'}`)
}

async function handleCheckoutSessionExpired(session) {
  const watchId = session.metadata?.watch_id
  if (!watchId) {
    console.warn('checkout.session.expired sans watch_id dans les métadonnées')
    return
  }

  const { error } = await supabase
    .from('watches')
    .update({
      checkout_reserved_until: null,
      stripe_checkout_session_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', watchId)
    .eq('is_sold', false)
    .eq('stripe_checkout_session_id', session.id)

  if (error) {
    throw error
  }
  console.log(`ℹ️  Réservation libérée pour montre ${watchId} (session expirée ${session.id})`)
}

router.post('/create-checkout-session', checkoutRateLimiter, async (req, res) => {
  try {
    const { watchId } = req.body

    if (!watchId) {
      return res.status(400).json({
        success: false,
        error: 'ID de montre manquant',
      })
    }

    if (!process.env.PAYMENT_CANCEL_SECRET) {
      console.error('❌ PAYMENT_CANCEL_SECRET non configuré')
      return res.status(500).json({
        success: false,
        error: 'Configuration serveur incomplète (paiement)',
      })
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Configuration Supabase manquante',
      })
    }

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

    if (!watch.is_available || watch.is_sold) {
      return res.status(400).json({
        success: false,
        error: "Cette montre n'est plus disponible à la vente",
      })
    }

    const { data: reserved, error: rpcError } = await supabase.rpc('reserve_watch_for_checkout', {
      p_watch_id: watchId,
      p_reserve_minutes: RESERVE_MINUTES,
    })

    if (rpcError) {
      console.error('❌ reserve_watch_for_checkout:', rpcError)
      return res.status(500).json({
        success: false,
        error:
          rpcError.message?.includes('function') || rpcError.code === '42883'
            ? 'Migration SQL requise (reserve_watch_for_checkout). Voir supabase/migrations.'
            : 'Impossible de réserver la montre',
      })
    }

    if (reserved !== true) {
      return res.status(409).json({
        success: false,
        error: 'Montre non disponible ou réservation en cours pour un autre acheteur',
      })
    }

    const { data: firstImage } = await supabase
      .from('watch_images')
      .select('image_url, image_path')
      .eq('watch_id', watchId)
      .order('image_order', { ascending: true })
      .limit(1)
      .single()

    let watchImageUrl = null
    if (firstImage) {
      if (firstImage.image_url) {
        watchImageUrl = firstImage.image_url
      } else if (firstImage.image_path) {
        const { data } = supabase.storage.from('watch-images').getPublicUrl(firstImage.image_path)
        watchImageUrl = data.publicUrl
      }
    }

    const baseUrl = getBaseUrl()

    let cancelToken
    try {
      cancelToken = signPaymentCancelToken(watchId)
    } catch (e) {
      await rollbackReservation(watchId)
      console.error('❌ Token annulation:', e)
      return res.status(500).json({
        success: false,
        error: e.message || 'Erreur configuration paiement',
      })
    }

    const successUrl = `${baseUrl}/paiement-succes?session_id={CHECKOUT_SESSION_ID}&watch_id=${watchId}`
    const cancelUrl = `${baseUrl}/paiement-annule?watch_id=${watchId}&token=${encodeURIComponent(cancelToken)}`

    const productData = {
      name: watch.name,
      description: `Réf. ${watch.reference}`,
    }
    if (watchImageUrl) {
      productData.images = [watchImageUrl]
    }

    let session
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: productData,
              unit_amount: Math.round(watch.price * 100),
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
      })
    } catch (stripeErr) {
      await rollbackReservation(watchId)
      console.error('❌ Erreur Stripe create session:', stripeErr)
      return res.status(500).json({
        success: false,
        error: stripeErr.message || 'Erreur lors de la création de la session de paiement',
      })
    }

    const { error: sidErr } = await supabase
      .from('watches')
      .update({
        stripe_checkout_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', watchId)

    if (sidErr) {
      console.error('❌ Impossible d’enregistrer stripe_checkout_session_id:', sidErr)
    }

    console.log(`✅ Session Stripe créée pour la montre ${watch.name} (${watch.id}): ${session.id}`)
    if (watchImageUrl) {
      console.log(`📸 Image ajoutée à la session: ${watchImageUrl}`)
    }

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

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET non configuré')
    return res.status(503).json({ error: 'Webhook secret not configured' })
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('❌ Erreur de validation du webhook Stripe:', err.message)
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`)
  }

  const handledTypes = ['checkout.session.completed', 'checkout.session.expired']
  if (!handledTypes.includes(event.type)) {
    console.log(`ℹ️  Événement Stripe ignoré: ${event.type}`)
    return res.status(200).json({ received: true })
  }

  if (!supabase) {
    console.error('❌ Supabase non configuré — webhook non traité')
    return res.status(503).json({ error: 'Database not configured' })
  }

  let claimResult
  try {
    claimResult = await tryClaimStripeEvent(event)
  } catch (e) {
    console.error('❌ Erreur claim événement Stripe:', e)
    return res.status(500).json({ error: 'Could not record event' })
  }

  if (claimResult.duplicate) {
    return res.status(200).json({ received: true, duplicate: true })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutSessionCompleted(event.data.object)
    } else {
      await handleCheckoutSessionExpired(event.data.object)
    }
    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('❌ Erreur traitement webhook:', err)
    try {
      await releaseStripeEventClaim(event.id)
    } catch (releaseErr) {
      console.error('❌ Erreur suppression claim webhook:', releaseErr)
    }
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
})

router.get('/verify-session', async (req, res) => {
  try {
    const { session_id, watch_id, token } = req.query

    if (session_id) {
      if (!watch_id) {
        return res.status(400).json({
          valid: false,
          reason: 'watch_id manquant',
        })
      }

      try {
        const session = await stripe.checkout.sessions.retrieve(session_id)

        if (!session) {
          console.warn(`⚠️  Tentative d'accès avec session_id invalide: ${session_id}`)
          return res.status(200).json({
            valid: false,
            reason: 'Session Stripe invalide',
          })
        }

        if (session.payment_status !== 'paid') {
          console.warn(`⚠️  Tentative d'accès avec session non payée: ${session_id}`)
          return res.status(200).json({
            valid: false,
            reason: 'Paiement non complété',
          })
        }

        if (String(session.metadata?.watch_id) !== String(watch_id)) {
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

    if (token) {
      if (!watch_id) {
        return res.status(400).json({
          valid: false,
          reason: 'watch_id manquant',
        })
      }

      if (!verifyPaymentCancelToken(token, watch_id)) {
        console.warn(`⚠️  Tentative d'accès avec token annulation invalide ou expiré`)
        return res.status(200).json({
          valid: false,
          reason: 'Token invalide ou expiré',
        })
      }

      console.log(`✅ Token annulation vérifié pour watch_id: ${watch_id}`)
      return res.status(200).json({
        valid: true,
      })
    }

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
