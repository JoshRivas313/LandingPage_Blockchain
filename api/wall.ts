import { readFile } from "node:fs/promises"
import type { IncomingMessage, ServerResponse } from "node:http"
import { formidable, type File } from "formidable"
import { createPage, queryDataSource, uploadFileToNotion } from "./_notion"

export const config = {
  api: { bodyParser: false },
}

const WALL_PAGE_SIZE = 60
const MAX_FILE_BYTES = 8 * 1024 * 1024

type WallEntry = {
  id: string
  nombre: string
  tipo: string
  credencialUrl: string | null
}

function textOf(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? ""
}

function fileOf(value: File | File[] | undefined): File | undefined {
  return Array.isArray(value) ? value[0] : value
}

function firstFileUrl(prop: any): string | null {
  const file = prop?.files?.[0]
  if (!file) return null
  return file.type === "external" ? file.external.url : (file.file?.url ?? null)
}

async function listWall(res: ServerResponse): Promise<void> {
  const { results } = await queryDataSource(WALL_PAGE_SIZE)
  const entries: WallEntry[] = results.map((page) => ({
    id: page.id,
    nombre: page.properties?.Nombre?.title?.[0]?.plain_text ?? "",
    tipo: page.properties?.Tipo?.select?.name ?? "Digital",
    credencialUrl: firstFileUrl(page.properties?.Credencial),
  }))
  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ entries }))
}

async function createWallEntry(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const form = formidable({ maxFileSize: MAX_FILE_BYTES, multiples: false })
  const [fields, files] = await form.parse(req)

  const kind = textOf(fields.kind)
  const nombre = textOf(fields.nombre)
  const username = textOf(fields.username)
  const credencial = fileOf(files.credencial)

  if (kind !== "digital" && kind !== "fisico") {
    res.statusCode = 400
    res.end(JSON.stringify({ error: "kind invalido" }))
    return
  }
  if (!nombre || !credencial) {
    res.statusCode = 400
    res.end(JSON.stringify({ error: "Falta el nombre o la imagen de la credencial" }))
    return
  }

  let recibeNombre = ""
  let whatsapp = ""
  let operacion = ""
  let comprobante: File | undefined

  if (kind === "fisico") {
    recibeNombre = textOf(fields.recibeNombre)
    whatsapp = textOf(fields.whatsapp)
    operacion = textOf(fields.operacion)
    comprobante = fileOf(files.comprobante)
    if (!recibeNombre || !whatsapp || !operacion || !comprobante) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: "Faltan datos del pago para el badge fisico" }))
      return
    }
  }

  const credencialBytes = await readFile(credencial.filepath)
  const credencialUploadId = await uploadFileToNotion(
    credencialBytes,
    credencial.originalFilename ?? "credencial.png",
    credencial.mimetype ?? "image/png",
  )

  let comprobanteUploadId: string | undefined
  if (comprobante) {
    const comprobanteBytes = await readFile(comprobante.filepath)
    comprobanteUploadId = await uploadFileToNotion(
      comprobanteBytes,
      comprobante.originalFilename ?? "comprobante.jpg",
      comprobante.mimetype ?? "image/jpeg",
    )
  }

  const properties: Record<string, unknown> = {
    Nombre: { title: [{ text: { content: nombre } }] },
    Tipo: { select: { name: kind === "fisico" ? "Físico" : "Digital" } },
    Credencial: { files: [{ type: "file_upload", file_upload: { id: credencialUploadId }, name: "credencial.png" }] },
  }
  if (username) properties["Usuario X"] = { rich_text: [{ text: { content: username } }] }
  if (kind === "fisico") {
    properties["Nombre de quien recibe"] = { rich_text: [{ text: { content: recibeNombre } }] }
    properties.WhatsApp = { rich_text: [{ text: { content: whatsapp } }] }
    properties["N Operacion Yape"] = { rich_text: [{ text: { content: operacion } }] }
    properties["Comprobante de pago"] = {
      files: [{ type: "file_upload", file_upload: { id: comprobanteUploadId }, name: "comprobante.jpg" }],
    }
  }

  const page = await createPage(properties)
  res.statusCode = 201
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ id: page.id }))
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    if (req.method === "GET") {
      await listWall(res)
      return
    }
    if (req.method === "POST") {
      await createWallEntry(req, res)
      return
    }
    res.statusCode = 405
    res.end(JSON.stringify({ error: "Metodo no soportado" }))
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "No pudimos procesar la solicitud. Intentalo mas tarde." }))
  }
}
