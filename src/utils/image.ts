/**
 * Comprime una imagen subida por el usuario antes de enviarla al servidor.
 *
 * Una foto de camara de celular pesa 3-8 MB; el comprobante de Yape no
 * necesita mas de 1600 px de lado para leerse bien. Sin esto, el body de la
 * funcion serverless se acerca al limite de Vercel.
 */
export async function compressImageToBlob(file: File, maxSide = 1600, quality = 0.85): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // Formato que el navegador no decodifica asi (HEIC en algunos moviles): se
    // manda el archivo tal cual y que lo procese quien lo reciba.
    return file
  }
  try {
    const longest = Math.max(bitmap.width, bitmap.height)
    const ratio = longest > maxSide ? maxSide / longest : 1
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bitmap.width * ratio)
    canvas.height = Math.round(bitmap.height * ratio)
    const ctx = canvas.getContext("2d")
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality))
    return blob ?? file
  } finally {
    bitmap.close()
  }
}
