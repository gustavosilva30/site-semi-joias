import crypto from 'crypto'

export const ADMIN_COOKIE_NAME = 'admin_session_token'
const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'aurea_semi_joias_super_secret_key_2026_admin'

export interface SessionPayload {
  userId: string
  email: string
  exp: number
}

export function createSessionToken(userId: string, email: string): string {
  const payload: SessionPayload = {
    userId,
    email,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas de validade
  }
  const payloadStr = JSON.stringify(payload)
  const b64Payload = Buffer.from(payloadStr).toString('base64url')
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(b64Payload).digest('hex')
  return `${b64Payload}.${signature}`
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [b64Payload, signature] = parts
    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(b64Payload).digest('hex')

    const sigBuffer = Buffer.from(signature, 'hex')
    const expBuffer = Buffer.from(expectedSignature, 'hex')
    if (sigBuffer.length !== expBuffer.length) return null

    if (!crypto.timingSafeEqual(sigBuffer, expBuffer)) return null

    const payloadStr = Buffer.from(b64Payload, 'base64url').toString('utf-8')
    const payload: SessionPayload = JSON.parse(payloadStr)

    if (payload.exp < Date.now()) return null

    return payload
  } catch {
    return null
  }
}
