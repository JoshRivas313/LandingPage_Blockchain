export interface LinkedInSession {
  configured: boolean
  authorized: boolean
  name: string | null
  /** Texto exacto que publicara el servidor. Se muestra tal cual al confirmar. */
  shareText: string | null
}

const OFFLINE: LinkedInSession = {
  configured: false,
  authorized: false,
  name: null,
  shareText: null,
}

/**
 * Consulta el estado de la integracion.
 *
 * Si el endpoint no existe (p. ej. `vite dev`, que no levanta las funciones de
 * Vercel) se resuelve como "no configurado" y la interfaz esconde el boton en
 * lugar de romperse.
 */
export async function getSession(): Promise<LinkedInSession> {
  try {
    const res = await fetch("/api/linkedin/session", { credentials: "same-origin" })
    if (!res.ok) return OFFLINE
    const json = (await res.json()) as Partial<LinkedInSession>
    return {
      configured: Boolean(json.configured),
      authorized: Boolean(json.authorized),
      name: json.name ?? null,
      shareText: json.shareText ?? null,
    }
  } catch {
    return OFFLINE
  }
}

/**
 * Autoriza en una ventana emergente y resuelve cuando termina.
 *
 * Se hace en popup para que la pagina no se recargue: si redirigiesemos, el
 * nombre, el usuario de X y la fotografia subida se perderian.
 */
export function authorize(): Promise<"ok" | "cancelled" | "blocked" | "error"> {
  const w = 600
  const h = 700
  const left = window.screenX + (window.outerWidth - w) / 2
  const top = window.screenY + (window.outerHeight - h) / 2

  const popup = window.open(
    "/api/linkedin/start",
    "bc-linkedin",
    `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  )
  if (!popup) return Promise.resolve("blocked")

  return new Promise((resolve) => {
    let settled = false
    const finish = (result: "ok" | "cancelled" | "error") => {
      if (settled) return
      settled = true
      window.removeEventListener("message", onMessage)
      window.clearInterval(timer)
      resolve(result)
    }

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.source !== "bc-linkedin") return
      finish(e.data.status === "ok" ? "ok" : e.data.status === "cancelled" ? "cancelled" : "error")
    }
    window.addEventListener("message", onMessage)

    // Si cierran la ventana a mano no llega ningun mensaje.
    const timer = window.setInterval(() => {
      if (popup.closed) finish("cancelled")
    }, 500)
  })
}

type PublishError = "unauthorized" | "too-large" | "network" | "linkedin"

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    // El data URL trae el prefijo "data:image/png;base64," que hay que quitar.
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "")
    reader.onerror = () => reject(new Error("read"))
    reader.readAsDataURL(blob)
  })
}

/** Envia el PNG. El texto lo pone el servidor, no el cliente. */
export async function publish(png: Blob): Promise<{ ok: true } | { ok: false; error: PublishError }> {
  let res: Response
  try {
    res = await fetch("/api/linkedin/publish", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: await toBase64(png) }),
    })
  } catch {
    return { ok: false, error: "network" }
  }

  if (res.ok) return { ok: true }
  if (res.status === 401) return { ok: false, error: "unauthorized" }
  if (res.status === 413) return { ok: false, error: "too-large" }
  return { ok: false, error: "linkedin" }
}

