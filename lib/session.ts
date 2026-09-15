import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto"
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./config.js"

export interface Session {
  /** Access token de LinkedIn. Nunca sale del servidor. */
  token: string
  /** urn:li:person:xxxx */
  personUrn: string
  name: string
  /** epoch en segundos */
  exp: number
}

function key(secret: string): Buffer {
  return createHash("sha256").update(secret).digest()
}

/** AES-256-GCM. La cookie es httpOnly, pero ademas va cifrada: si alguna vez se
 *  filtra el valor, no entrega el access token de nadie. */
export function seal(data: Session, secret: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key(secret), iv)
  const body = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, body]).toString("base64url")
}

export function unseal(raw: string, secret: string): Session | null {
  try {
    const buf = Buffer.from(raw, "base64url")
    if (buf.length < 29) return null

    const decipher = createDecipheriv("aes-256-gcm", key(secret), buf.subarray(0, 12))
    decipher.setAuthTag(buf.subarray(12, 28))
    const json = Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString(
      "utf8",
    )

    const session = JSON.parse(json) as Session
    if (!session.token || !session.personUrn) return null
    if (session.exp && session.exp < Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
}

export function readCookie(header: string | undefined, name: string): string | null {
  if (!header) return null
  for (const part of header.split(";")) {
    const idx = part.indexOf("=")
    if (idx === -1) continue
    if (part.slice(0, idx).trim() === name) return decodeURIComponent(part.slice(idx + 1).trim())
  }
  return null
}

/** SameSite=Lax: el navegador la manda al volver de linkedin.com (navegacion
 *  GET de nivel superior) pero no en un POST desde otro sitio, que es
 *  justamente el vector de CSRF contra /publish. */
export function cookie(name: string, value: string, maxAge: number): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ]
  return parts.join("; ")
}

export function clearCookie(name: string): string {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}

export function sessionCookie(data: Session, secret: string): string {
  return cookie(SESSION_COOKIE, seal(data, secret), SESSION_MAX_AGE)
}
