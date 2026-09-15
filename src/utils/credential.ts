import templateUrl from "@/assets/credencial-template.webp"

/**
 * Composicion maestra de la credencial: UNICA fuente de verdad.
 *
 * El preview (DOM) y la exportacion (canvas) leen estas mismas cifras, asi que
 * no pueden divergir. Antes las coordenadas estaban escritas dos veces: en
 * porcentajes CSS dentro del markup y en pixeles dentro del canvas.
 *
 * Todo va en fracciones de la lamina maestra de 1122x1402.
 */
export const CREDENTIAL = {
  width: 1122,
  height: 1402,
  /** Recuadro de la fotografia. radius va en fraccion del ancho del recuadro. */
  photo: { left: 0.33, top: 0.375, width: 0.35, height: 0.3, radius: 0.07 },
  /** Caja del nombre: centrada, linea base al 75 % de la altura. */
  name: { left: 0.175, right: 0.179, top: 0.71, height: 0.08, baseline: 0.75 },
  /** Caja del usuario de X: alineada a la izquierda, linea base al 84.5 %. */
  handle: { left: 0.38, right: 0.27, top: 0.81, height: 0.07, baseline: 0.845 },
  placeholder: { name: "TU NOMBRE", handle: "@tuusuario" },
} as const

export const templateSrc = templateUrl

/** Ancho util de la caja del handle, en fraccion. */
const HANDLE_MAX_W = 1 - CREDENTIAL.handle.left - CREDENTIAL.handle.right

/** Tamano del nombre en px de la lamina maestra. */
export function nameFontPx(name: string): number {
  const len = (name || CREDENTIAL.placeholder.name).length
  return len <= 14 ? 48 : len <= 22 ? 39 : 30
}

/** Tamano del handle en px de la lamina maestra. */
export function handleFontPx(handle: string): number {
  return handle.length <= 12 ? 25 : handle.length <= 15 ? 21 : 18
}

/** px de la maestra -> unidad de contenedor, para que el preview escale solo. */
export function toCqw(px: number): string {
  return `${((px / CREDENTIAL.width) * 100).toFixed(2)}cqw`
}

export function formatName(name: string): string {
  return (name || CREDENTIAL.placeholder.name).toUpperCase()
}

export function formatHandle(username: string): string {
  return username ? `@${username}` : CREDENTIAL.placeholder.handle
}

/* ------------------------------------------------------------------ */
/* Exportacion                                                         */
/* ------------------------------------------------------------------ */

let templatePromise: Promise<HTMLImageElement> | null = null

/** La lamina se descarga y decodifica una sola vez por sesion, no por descarga. */
function loadTemplate(): Promise<HTMLImageElement> {
  templatePromise ??= new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("No se pudo cargar la plantilla"))
    img.src = templateSrc
  })
  return templatePromise
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("No se pudo cargar la fotografia"))
    img.src = src
  })
}

/**
 * Canvas no espera a que las webfonts esten listas: si no se fuerza la carga,
 * el nombre puede acabar dibujado con la tipografia del sistema.
 */
async function ensureFonts(name: string, handle: string): Promise<void> {
  if (!document.fonts) return
  try {
    await Promise.all([
      document.fonts.load(`800 ${nameFontPx(name)}px Manrope`, formatName(name)),
      document.fonts.load(`700 ${handleFontPx(handle)}px Inter`, handle),
    ])
  } catch {
    /* si falla, el navegador usa el fallback declarado */
  }
}

function roundedClip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  ctx.clip()
}

/** Dibuja la maestra a resolucion completa. Solo se llama al descargar/compartir. */
export async function renderCredential(input: {
  name: string
  username: string
  photoUrl: string
}): Promise<HTMLCanvasElement> {
  const { width: W, height: H } = CREDENTIAL
  const handle = formatHandle(input.username)

  const [template] = await Promise.all([loadTemplate(), ensureFonts(input.name, handle)])

  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D no disponible")

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, W, H)
  ctx.drawImage(template, 0, 0, W, H)

  // --- Fotografia, recortada con las esquinas redondeadas del preview ---
  if (input.photoUrl) {
    const { left, top, width, height, radius } = CREDENTIAL.photo
    const fx = left * W
    const fy = top * H
    const fw = width * W
    const fh = height * H
    const photo = await loadImage(input.photoUrl)

    // object-fit: cover
    const scale = Math.max(fw / photo.width, fh / photo.height)
    const sw = fw / scale
    const sh = fh / scale
    const sx = (photo.width - sw) / 2
    const sy = (photo.height - sh) / 2

    ctx.save()
    roundedClip(ctx, fx, fy, fw, fh, fw * radius)
    ctx.drawImage(photo, sx, sy, sw, sh, fx, fy, fw, fh)
    ctx.restore()
  }

  ctx.textBaseline = "middle"

  // --- Nombre ---
  const name = formatName(input.name)
  ctx.font = `800 ${nameFontPx(input.name)}px Manrope, sans-serif`
  ctx.fillStyle = "#17164F"
  ctx.textAlign = "center"
  const nameCx = ((CREDENTIAL.name.left + (1 - CREDENTIAL.name.right)) / 2) * W
  ctx.fillText(name, nameCx, CREDENTIAL.name.baseline * H)

  // --- Usuario de X, con el mismo recorte por elipsis que el preview ---
  ctx.font = `700 ${handleFontPx(handle)}px Inter, sans-serif`
  ctx.fillStyle = input.username ? "#17164F" : "#94a3b8"
  ctx.textAlign = "left"
  const maxWidth = HANDLE_MAX_W * W
  let shown = handle
  if (ctx.measureText(shown).width > maxWidth) {
    while (ctx.measureText(`${shown}…`).width > maxWidth && shown.length > 5) {
      shown = shown.slice(0, -1)
    }
    shown += "…"
  }
  ctx.fillText(shown, CREDENTIAL.handle.left * W, CREDENTIAL.handle.baseline * H)

  return canvas
}

/** toBlob evita construir el data URL en base64 (~33 % mas grande) en el hilo principal. */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo generar la imagen"))),
      "image/png",
    )
  })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  // El click es sincrono, pero Safari necesita un respiro antes del revoke.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Reduce la foto subida antes de guardarla en estado.
 *
 * El hueco de la credencial mide 393x421 px en la maestra; una foto de movil
 * llega con 3000-4000 px de lado. Se recorta a 1200 (casi 3x lo necesario, sin
 * perdida visible) y se guarda como blob: preview y exportacion dejan de
 * manejar una cadena base64 de varios MB.
 */
export async function prepareUpload(file: File, maxSide = 1200): Promise<string> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // Formato que el navegador no sabe decodificar asi (HEIC en algunos moviles):
    // se deja el archivo tal cual y que lo resuelva el <img>.
    return URL.createObjectURL(file)
  }
  try {
    const longest = Math.max(bitmap.width, bitmap.height)
    if (longest <= maxSide) return URL.createObjectURL(file)

    const ratio = maxSide / longest
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bitmap.width * ratio)
    canvas.height = Math.round(bitmap.height * ratio)
    const ctx = canvas.getContext("2d")
    if (!ctx) return URL.createObjectURL(file)

    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.92))
    return URL.createObjectURL(blob ?? file)
  } finally {
    bitmap.close()
  }
}
