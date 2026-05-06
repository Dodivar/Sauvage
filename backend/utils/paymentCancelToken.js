const crypto = require('crypto')

const DEFAULT_TTL_SECONDS = 60 * 60 // 1 hour

/**
 * Stateless signed cancel URL token: base64url(payload).hmacSha256
 * Payload: { watchId: string, exp: unix seconds }
 *
 * Le secret est fourni explicitement (multi-tenant) — chaque site dispose de son propre
 * `PAYMENT_CANCEL_SECRET` via `SITE_<ID>__PAYMENT_CANCEL_SECRET`.
 *
 * @param {string} secret Secret HMAC du site.
 * @param {string|number} watchId
 * @param {number} [ttlSeconds]
 */
function signPaymentCancelToken(secret, watchId, ttlSeconds = DEFAULT_TTL_SECONDS) {
  if (!secret) {
    throw new Error('PAYMENT_CANCEL_SECRET manquant pour ce site')
  }
  const payload = {
    watchId: String(watchId),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  }
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url')
  return `${payloadB64}.${sig}`
}

/**
 * Vérifie la signature et l'expiration, et que payload.watchId correspond.
 * @param {string} secret Secret HMAC du site.
 * @param {string} token
 * @param {string|number} watchId
 * @returns {boolean}
 */
function verifyPaymentCancelToken(secret, token, watchId) {
  if (!secret || !token || watchId == null) {
    return false
  }
  const parts = String(token).split('.')
  if (parts.length !== 2) {
    return false
  }
  const [payloadB64, sig] = parts
  let expected
  try {
    expected = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url')
  } catch {
    return false
  }
  let sigBuf
  let expBuf
  try {
    sigBuf = Buffer.from(sig, 'base64url')
    expBuf = Buffer.from(expected, 'base64url')
  } catch {
    return false
  }
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false
  }
  let payload
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
  } catch {
    return false
  }
  if (!payload || typeof payload.exp !== 'number') {
    return false
  }
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return false
  }
  return String(payload.watchId) === String(watchId)
}

module.exports = {
  signPaymentCancelToken,
  verifyPaymentCancelToken,
  DEFAULT_TTL_SECONDS,
}
