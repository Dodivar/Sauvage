/**
 * Caches mémoïsés des clients tiers (Stripe / Supabase / Mailjet) par siteId.
 *
 * Pour éviter d'instancier un client à chaque requête tout en supportant N sites
 * sur un même process. Si un secret requis est manquant, on lève une erreur typée
 * avec `code = 'MISSING_SECRETS'` que les routes traduisent en réponse 503.
 */

const Stripe = require('stripe')
const Mailjet = require('node-mailjet')
const { createClient: createSupabaseClient } = require('@supabase/supabase-js')

const stripeCache = new Map()
const supabaseCache = new Map()
const mailjetCache = new Map()

class MissingSecretsError extends Error {
  constructor(provider, siteId, missing) {
    super(
      `Secrets ${provider} manquants pour le site "${siteId}" : ${missing.join(', ')}. Voir backend/env.example.`,
    )
    this.code = 'MISSING_SECRETS'
    this.provider = provider
    this.siteId = siteId
    this.missing = missing
  }
}

/**
 * @param {{ id: string, secrets: object }} site
 * @returns {Stripe}
 */
function getStripeClient(site) {
  const cached = stripeCache.get(site.id)
  if (cached) return cached
  const key = site.secrets?.stripe?.secretKey
  if (!key) {
    throw new MissingSecretsError('Stripe', site.id, ['STRIPE_SECRET_KEY'])
  }
  const client = new Stripe(key, { apiVersion: '2024-12-18.acacia' })
  stripeCache.set(site.id, client)
  return client
}

/**
 * @param {{ id: string, secrets: object }} site
 * @returns {ReturnType<typeof createSupabaseClient>}
 */
function getSupabaseClient(site) {
  const cached = supabaseCache.get(site.id)
  if (cached) return cached
  const url = site.secrets?.supabase?.url
  const serviceKey = site.secrets?.supabase?.serviceRoleKey
  const missing = []
  if (!url) missing.push('SUPABASE_URL')
  if (!serviceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
  if (missing.length) {
    throw new MissingSecretsError('Supabase', site.id, missing)
  }
  const client = createSupabaseClient(url, serviceKey)
  supabaseCache.set(site.id, client)
  return client
}

/**
 * @param {{ id: string, secrets: object }} site
 * @returns {ReturnType<typeof Mailjet.apiConnect>}
 */
function getMailjetClient(site) {
  const cached = mailjetCache.get(site.id)
  if (cached) return cached
  const apiKey = site.secrets?.mailjet?.apiKey
  const secretKey = site.secrets?.mailjet?.secretKey
  const missing = []
  if (!apiKey) missing.push('MAILJET_API_KEY')
  if (!secretKey) missing.push('MAILJET_SECRET_KEY')
  if (missing.length) {
    throw new MissingSecretsError('Mailjet', site.id, missing)
  }
  const client = Mailjet.apiConnect(apiKey, secretKey)
  mailjetCache.set(site.id, client)
  return client
}

/**
 * Vide les caches (utile pour les tests).
 */
function _resetSiteClientsForTests() {
  stripeCache.clear()
  supabaseCache.clear()
  mailjetCache.clear()
}

module.exports = {
  getStripeClient,
  getSupabaseClient,
  getMailjetClient,
  MissingSecretsError,
  _resetSiteClientsForTests,
}
