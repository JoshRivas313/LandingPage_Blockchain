/**
 * Herramienta de un solo uso para obtener el access_token de OAuth de Notion.
 *
 * Se corre localmente (nunca en Vercel) porque el client_secret y el token
 * resultante solo deben pasar por la maquina de quien configura el proyecto,
 * no por ningun chat ni servidor compartido.
 *
 * Uso (PowerShell):
 *   $env:NOTION_CLIENT_ID = "..."
 *   $env:NOTION_CLIENT_SECRET = "..."
 *   node scripts/notion-oauth-setup.mjs
 *
 * Abre la URL que imprime, autoriza en el workspace correcto, y el token
 * queda impreso en esta misma terminal al volver.
 */
import { createServer } from "node:http"

const PORT = 4321
const REDIRECT_URI = `http://localhost:${PORT}/callback`

const clientId = process.env.NOTION_CLIENT_ID
const clientSecret = process.env.NOTION_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error("Falta NOTION_CLIENT_ID y/o NOTION_CLIENT_SECRET en el entorno.")
  process.exit(1)
}

const authorizeUrl =
  `https://api.notion.com/v1/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
  `&response_type=code&owner=user&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`

console.log("\nAbre esta URL en tu navegador y autoriza el workspace del evento:\n")
console.log(authorizeUrl)
console.log(`\nEsperando el redirect en ${REDIRECT_URI} ...\n`)

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI)
  if (url.pathname !== "/callback") {
    res.writeHead(404).end()
    return
  }

  const code = url.searchParams.get("code")
  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" }).end("<p>Falta el parametro code.</p>")
    return
  }

  try {
    const tokenRes = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: JSON.stringify({ grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI }),
    })
    const data = await tokenRes.json()

    if (!tokenRes.ok) {
      console.error("\nNotion respondio con un error:\n", data)
      res.writeHead(500, { "Content-Type": "text/html" }).end("<p>Error, revisa la terminal.</p>")
      return
    }

    console.log("\n== Listo ==")
    console.log("Workspace:", data.workspace_name)
    console.log("\nCopia este valor como NOTION_API_KEY en Vercel:\n")
    console.log(data.access_token)
    console.log("")

    res.writeHead(200, { "Content-Type": "text/html" }).end(
      "<p>Listo, ya puedes cerrar esta pestaña y volver a la terminal.</p>",
    )
  } finally {
    server.close()
  }
})

server.listen(PORT)
