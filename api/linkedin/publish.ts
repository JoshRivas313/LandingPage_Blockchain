import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  MAX_IMAGE_BYTES,
  SESSION_COOKIE,
  SHARE_TEXT,
  readEnv,
  siteOrigin,
} from "../../lib/config.js"
import { publishImagePost } from "../../lib/linkedin.js"
import { readCookie, unseal } from "../../lib/session.js"

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47])

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store")

  if (req.method !== "POST") {
    res.status(405).json({ error: "method" })
    return
  }

  const env = readEnv()
  if (!env) {
    res.status(503).json({ error: "not-configured" })
    return
  }

  // Defensa CSRF: la cookie es SameSite=Lax (no viaja en POST de otro sitio) y
  // ademas se exige que el Origin sea el propio despliegue.
  const origin = req.headers.origin
  if (origin && origin !== siteOrigin(req)) {
    res.status(403).json({ error: "origin" })
    return
  }

  const raw = readCookie(req.headers.cookie, SESSION_COOKIE)
  const session = raw ? unseal(raw, env.sessionSecret) : null
  if (!session) {
    res.status(401).json({ error: "unauthorized" })
    return
  }

  // La imagen viaja como base64 dentro de JSON: es el unico formato de cuerpo
  // que el runtime de Vercel parsea de forma garantizada.
  const body = req.body as { image?: unknown } | undefined
  const encoded = typeof body?.image === "string" ? body.image : ""
  if (!encoded) {
    res.status(400).json({ error: "body" })
    return
  }
  if (encoded.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 8) {
    res.status(413).json({ error: "too-large" })
    return
  }

  const png = Buffer.from(encoded, "base64")
  if (png.length < 8 || !png.subarray(0, 4).equals(PNG_MAGIC)) {
    res.status(400).json({ error: "not-png" })
    return
  }

  try {
    // El texto lo pone el servidor: este endpoint no publica texto arbitrario.
    const { postUrn } = await publishImagePost({
      token: session.token,
      personUrn: session.personUrn,
      text: SHARE_TEXT,
      png,
    })
    res.status(200).json({ ok: true, postUrn })
  } catch (err) {
    console.error("linkedin publish:", err)
    const message = err instanceof Error ? err.message : ""
    // 401/403 desde LinkedIn = token caducado o permiso revocado.
    const expired = /\b(401|403)\b/.test(message)
    res.status(expired ? 401 : 502).json({ error: expired ? "unauthorized" : "linkedin" })
  }
}
