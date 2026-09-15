/** Texto que se publica. Vive en el servidor a proposito: el cliente nunca
 *  decide que se escribe en el perfil de nadie, solo lo muestra para confirmar. */
export const SHARE_TEXT = `🚀 ¡Yo seré parte de Blockchain Conf!

Un día para conectar, aprender y explorar el ecosistema blockchain, Web3 y sus aplicaciones.

📅 19 de septiembre
📍 Auditorio UTP Sede Central

🔗 Regístrate y crea tu propio pase:
https://luma.com/r750uqs6?tk=aylyJO

#BlockchainConf #Blockchain #Web3 #ComunidadTech`

export const IMAGE_ALT = "Credencial de Blockchain Conf"
export const IMAGE_TITLE = "Blockchain Conf · 19 de septiembre"

/** 1.5 MB: la credencial ronda 1.1 MB y Vercel corta el cuerpo en 4.5 MB. */
export const MAX_IMAGE_BYTES = 1_500_000

export const SESSION_COOKIE = "bc_li"
export const STATE_COOKIE = "bc_li_state"

/** Vida de la cookie de sesion. El token de LinkedIn dura 60 dias; se corta
 *  mucho antes porque para este caso de uso basta con una sesion corta. */
export const SESSION_MAX_AGE = 60 * 60 * 2

export interface LinkedInEnv {
  clientId: string
  clientSecret: string
  sessionSecret: string
}

/**
 * Lee la configuracion. Devuelve null si falta cualquier pieza, y en ese caso
 * el frontend esconde el boton en lugar de llevar a nadie a un OAuth roto.
 */
export function readEnv(): LinkedInEnv | null {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
  const sessionSecret = process.env.SESSION_SECRET

  if (!clientId || !clientSecret || !sessionSecret) return null
  return { clientId, clientSecret, sessionSecret }
}

/** URL publica del despliegue, para construir el redirect_uri de OAuth. */
export function siteOrigin(req: { headers: Record<string, string | string[] | undefined> }): string {
  if (process.env.LINKEDIN_REDIRECT_ORIGIN) return process.env.LINKEDIN_REDIRECT_ORIGIN

  const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "")
  const proto = String(req.headers["x-forwarded-proto"] ?? "https")
  return `${proto}://${host}`
}

export function redirectUri(origin: string): string {
  return `${origin}/api/linkedin/callback`
}
