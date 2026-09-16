export type WallEntry = {
  id: string
  nombre: string
  tipo: string
  credencialUrl: string | null
}

export async function fetchWall(): Promise<WallEntry[]> {
  const res = await fetch("/api/wall")
  if (!res.ok) throw new Error("No se pudo cargar el muro")
  const data = await res.json()
  return data.entries as WallEntry[]
}

export type DigitalWallInput = {
  kind: "digital"
  nombre: string
  username: string
  credencial: Blob
}

export type PhysicalBadgeInput = {
  kind: "fisico"
  nombre: string
  username: string
  credencial: Blob
  recibeNombre: string
  whatsapp: string
  operacion: string
  comprobante: Blob
}

/** Publica una credencial en el muro, o una solicitud de badge fisico (que tambien publica). */
export async function submitWallEntry(input: DigitalWallInput | PhysicalBadgeInput): Promise<string> {
  const body = new FormData()
  body.append("kind", input.kind)
  body.append("nombre", input.nombre)
  body.append("username", input.username)
  body.append("credencial", input.credencial, "credencial.png")

  if (input.kind === "fisico") {
    body.append("recibeNombre", input.recibeNombre)
    body.append("whatsapp", input.whatsapp)
    body.append("operacion", input.operacion)
    body.append("comprobante", input.comprobante, "comprobante.jpg")
  }

  const res = await fetch("/api/wall", { method: "POST", body })
  if (!res.ok) throw new Error("No se pudo enviar la solicitud")
  const data = await res.json()

  // Toda publicacion exitosa (digital o fisica) queda en el muro: se avisa
  // aqui, en un solo lugar, para que ningun caller pueda olvidarlo.
  notifyWallUpdated()
  return data.id as string
}

export type PhysicalBadgeUpdateInput = {
  recibeNombre: string
  whatsapp: string
  operacion: string
  comprobante: Blob
}

/**
 * Sube el comprobante de un badge fisico sobre una credencial que YA esta
 * publicada en el muro, en vez de crear una fila duplicada.
 */
export async function updateWallEntry(entryId: string, input: PhysicalBadgeUpdateInput): Promise<void> {
  const body = new FormData()
  body.append("recibeNombre", input.recibeNombre)
  body.append("whatsapp", input.whatsapp)
  body.append("operacion", input.operacion)
  body.append("comprobante", input.comprobante, "comprobante.jpg")

  const res = await fetch(`/api/wall?id=${encodeURIComponent(entryId)}`, { method: "PATCH", body })
  if (!res.ok) throw new Error("No se pudo enviar la solicitud")

  notifyWallUpdated()
}

/** El muro escucha este evento para refrescarse tras cada publicacion exitosa. */
export const WALL_UPDATED_EVENT = "bc:wall-updated"

export function notifyWallUpdated(): void {
  window.dispatchEvent(new Event(WALL_UPDATED_EVENT))
}
