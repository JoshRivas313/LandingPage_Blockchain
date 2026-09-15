/**
 * Compartir en X sin OAuth ni API.
 *
 * El pase se descarga, el texto se copia al portapapeles y se abre el
 * compositor de X con ese mismo texto ya escrito. La persona solo arrastra
 * la imagen.
 */

/**
 * Abre el compositor de X con el texto puesto.
 *
 * La imagen no puede prellenarse — X no acepta adjuntos por URL —, por eso
 * el pase se descarga justo antes.
 */
export function openComposer(text: string): void {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
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

/** Nombre del archivo que ve la persona en el menú de compartir del móvil. */
export const BADGE_FILENAME = "blockchain-conf-badge.png"

export function toBadgeFile(png: Blob): File {
  return new File([png], BADGE_FILENAME, { type: "image/png" })
}

/**
 * ¿Puede este navegador compartir el pase como archivo?
 *
 * Detección por capacidad, no por tamaño de pantalla ni por user agent:
 * `canShare({ files })` responde exactamente lo que necesitamos saber. En
 * escritorio casi siempre es false, y ahí seguimos con descargar + copiar.
 */
export function canShareFile(file: File): boolean {
  return (
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  )
}

/**
 * ¿Sabe este navegador compartir imágenes?
 *
 * Se prueba con un PNG mínimo en lugar del pase real, para poder consultarlo
 * al pintar —cuando aún no hay credencial generada— y decidir así qué dice el
 * botón. Es detección por capacidad, no por ancho de pantalla.
 */
export function supportsFileShare(): boolean {
  try {
    // No basta con que el navegador sepa compartir archivos: Chrome y Edge en
    // Windows tambien lo soportan, y alli el menu del sistema es peor que
    // abrir el compositor directamente. Se exige ademas puntero tactil, que es
    // lo que distingue un movil de un escritorio.
    if (!window.matchMedia("(pointer: coarse)").matches) return false
    const probe = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "probe.png", {
      type: "image/png",
    })
    return canShareFile(probe)
  } catch {
    return false
  }
}

/**
 * Copia sin esperar el resultado.
 *
 * Devuelve la promesa para consultarla después: esperarla antes de
 * navigator.share() consumiría la activación del gesto y Safari rechazaría el
 * menú con NotAllowedError.
 */
export function copyTextEager(text: string): Promise<boolean> {
  try {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => false,
    )
  } catch {
    return Promise.resolve(false)
  }
}

export type ShareResult = "shared" | "cancelled" | "denied" | "failed"

/**
 * Abre el menú nativo con la imagen y el texto.
 *
 * Importante: esto debe llamarse SIN ningún await previo dentro del manejador
 * del clic. Safari exige activación del usuario y un await intermedio la
 * consume, lo que acaba en NotAllowedError. Por eso el PNG se prepara antes,
 * al crear el pase.
 */
export async function shareFile(file: File, text: string): Promise<ShareResult> {
  try {
    await navigator.share({ text, files: [file] })
    return "shared"
  } catch (err) {
    const name = err instanceof Error ? err.name : ""
    // Cerrar el menú no es un fallo: es una decisión.
    if (name === "AbortError") return "cancelled"
    if (name === "NotAllowedError") return "denied"
    return "failed"
  }
}
