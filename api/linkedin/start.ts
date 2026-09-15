import { randomBytes } from "node:crypto"
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { STATE_COOKIE, readEnv, redirectUri, siteOrigin } from "../../lib/config.js"
import { authorizeUrl } from "../../lib/linkedin.js"
import { cookie } from "../../lib/session.js"

/** Arranca el OAuth: guarda un `state` firmado en cookie y manda a LinkedIn. */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const env = readEnv()
  if (!env) {
    res.status(503).json({ error: "LinkedIn no está configurado en este despliegue." })
    return
  }

  const state = randomBytes(16).toString("base64url")
  const origin = siteOrigin(req)

  res.setHeader("Set-Cookie", cookie(STATE_COOKIE, state, 600))
  res.redirect(
    302,
    authorizeUrl({ clientId: env.clientId, redirectUri: redirectUri(origin), state }),
  )
}
