import type { VercelRequest, VercelResponse } from "@vercel/node"
import { STATE_COOKIE, readEnv, redirectUri, siteOrigin } from "../../lib/config.js"
import { exchangeCode, fetchMember } from "../../lib/linkedin.js"
import { clearCookie, readCookie, sessionCookie } from "../../lib/session.js"

/** Vuelta de LinkedIn: valida el state, canjea el code y guarda la sesion. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const env = readEnv()
  if (!env) {
    res.status(503).send("LinkedIn no está configurado en este despliegue.")
    return
  }

  /**
   * El OAuth se abre en una ventana emergente para no perder lo que el usuario
   * ya escribio y subio. Esta respuesta avisa a la ventana original y se cierra;
   * si alguien llega aqui sin opener, se cae a una redireccion normal.
   */
  const back = (status: string) => {
    const origin = siteOrigin(req)
    const safe = status.replace(/[^a-z]/g, "")
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.status(200).send(
      `<!doctype html><meta charset="utf-8"><title>LinkedIn</title>
<body style="font:14px system-ui;padding:24px;color:#17164F">Puedes cerrar esta ventana.
<script>
(function(){
  var s=${JSON.stringify(safe)}, o=${JSON.stringify(origin)};
  try{ if(window.opener){ window.opener.postMessage({source:"bc-linkedin",status:s},o); window.close(); return; } }catch(e){}
  location.replace("/?linkedin="+s+"#credencial");
})();
</script></body>`,
    )
  }

  // El usuario pudo cancelar en la pantalla de LinkedIn.
  if (typeof req.query.error === "string") {
    res.setHeader("Set-Cookie", clearCookie(STATE_COOKIE))
    back(req.query.error === "user_cancelled_login" ? "cancelled" : "denied")
    return
  }

  const code = typeof req.query.code === "string" ? req.query.code : ""
  const state = typeof req.query.state === "string" ? req.query.state : ""
  const expected = readCookie(req.headers.cookie, STATE_COOKIE)

  if (!code || !state || !expected || state !== expected) {
    res.setHeader("Set-Cookie", clearCookie(STATE_COOKIE))
    back("state")
    return
  }

  try {
    const origin = siteOrigin(req)
    const { accessToken, expiresIn } = await exchangeCode({
      code,
      clientId: env.clientId,
      clientSecret: env.clientSecret,
      redirectUri: redirectUri(origin),
    })
    const member = await fetchMember(accessToken)

    res.setHeader("Set-Cookie", [
      clearCookie(STATE_COOKIE),
      sessionCookie(
        {
          token: accessToken,
          personUrn: member.personUrn,
          name: member.name,
          exp: Math.floor(Date.now() / 1000) + Math.min(expiresIn, 60 * 60 * 2),
        },
        env.sessionSecret,
      ),
    ])
    back("ok")
  } catch (err) {
    console.error("linkedin callback:", err)
    res.setHeader("Set-Cookie", clearCookie(STATE_COOKIE))
    back("error")
  }
}
