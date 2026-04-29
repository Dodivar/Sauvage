const crypto = require('crypto')

const DEFAULT_TTL_SECONDS = 60 * 60 // 1 hour

function getSecret() {
  return process.env.PAYMENT_CANCEL_SECRET || ''
}

/**
 * Stateless signed cancel URL token: base64url(payload).hmacSha256
 * Payload: { watchId: string, exp: unix seconds }
 */
function signPaymentCancelToken(watchId, ttlSeconds = DEFAULT_TTL_SECONDS) {
  const secret = getSecret()
  if (!secret) {
    throw new Error('PAYMENT_CANCEL_SECRET is not configured')
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
 * Verifies token signature, expiry, and that payload.watchId matches watchId param.
 */
function verifyPaymentCancelToken(token, watchId) {
  const secret = getSecret()
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
