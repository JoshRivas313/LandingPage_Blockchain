/**
 * Compartir en LinkedIn sin OAuth ni API.
 *
 * El pase se descarga, el texto se copia al portapapeles y se abre el
 * compositor de LinkedIn con ese mismo texto ya escrito. La persona solo
 * arrastra la imagen.
 */

/**
 * Abre el compositor con el texto puesto.
 *
 * `feed/?shareActive=true&text=` no está documentado por LinkedIn, pero es lo
 * que usan las webs que abren el compositor "con el mensaje listo": si hay
 * sesión iniciada lleva directo a redactar con el texto dentro; si no, pasa por
 * el login y vuelve.
 *
 * La imagen no puede prellenarse — LinkedIn no acepta adjuntos por URL —, por
 * eso el pase se descarga justo antes.
 */
export function openComposer(text: string): void {
  window.open(
    `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer",
  )
}

/**
 * Copia el texto al portapapeles. Es la red de seguridad por si el prellenado
 * no funciona: entonces basta con pegar.
 *
 * Se corta a los 2 s porque algunos navegadores dejan la promesa colgada
 * esperando un permiso que nunca resuelven.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000)),
    ])
    return true
  } catch {
    return false
  }
}
