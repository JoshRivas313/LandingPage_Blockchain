import type { VercelRequest, VercelResponse } from "@vercel/node"
import { SESSION_COOKIE, SHARE_TEXT, readEnv } from "../../lib/config.js"
import { readCookie, unseal } from "../../lib/session.js"

/**
 * Estado de la integracion para el frontend.
 *
 * Devuelve tambien el texto exacto que se publicara, para que la pantalla de
 * confirmacion muestre literalmente lo que el servidor va a enviar y ambos no
 * puedan desincronizarse. Nunca devuelve el access token.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const env = readEnv()
  res.setHeader("Cache-Control", "no-store")

  if (!env) {
    res.status(200).json({ configured: false, authorized: false, shareText: SHARE_TEXT })
    return
  }

  const raw = readCookie(req.headers.cookie, SESSION_COOKIE)
  const session = raw ? unseal(raw, env.sessionSecret) : null

  res.status(200).json({
    configured: true,
    authorized: Boolean(session),
    name: session?.name ?? null,
    shareText: SHARE_TEXT,
  })
}
