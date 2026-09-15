/**
 * Cliente minimo de la API REST de Notion para las funciones serverless.
 *
 * Se usa la API de data sources (version 2025-09-03) porque la base
 * "Badgets de Blockchain Conf" se creo con ese modelo: una base puede tener
 * varias fuentes de datos, y las paginas cuelgan de una fuente, no de la
 * base directamente.
 */

const NOTION_VERSION = "2025-09-03"
const NOTION_API = "https://api.notion.com/v1"

function env(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Falta configurar la variable de entorno ${name} en Vercel.`)
  return value
}

function apiKey(): string {
  return env("NOTION_API_KEY")
}

export function dataSourceId(): string {
  return env("NOTION_DATA_SOURCE_ID")
}

async function notionFetch(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${NOTION_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Notion-Version": NOTION_VERSION,
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Notion API ${res.status} en ${path}: ${body.slice(0, 500)}`)
  }
  return res.json()
}

/**
 * Sube un archivo binario a Notion y devuelve el id de file_upload listo
 * para referenciar en una propiedad de tipo Files & media.
 */
export async function uploadFileToNotion(
  bytes: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  const created = await notionFetch("/file_uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, content_type: contentType }),
  })

  const form = new FormData()
  form.append("file", new Blob([new Uint8Array(bytes)], { type: contentType }), filename)

  const sendRes = await fetch(`${NOTION_API}/file_uploads/${created.id}/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Notion-Version": NOTION_VERSION,
    },
    body: form,
  })
  if (!sendRes.ok) {
    const body = await sendRes.text().catch(() => "")
    throw new Error(`Notion file upload ${sendRes.status}: ${body.slice(0, 500)}`)
  }

  return created.id as string
}

export type NotionProperties = Record<string, unknown>

export function createPage(properties: NotionProperties): Promise<{ id: string }> {
  return notionFetch("/pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      parent: { type: "data_source_id", data_source_id: dataSourceId() },
      properties,
    }),
  })
}

export function queryDataSource(pageSize: number): Promise<{ results: any[] }> {
  return notionFetch(`/data_sources/${dataSourceId()}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page_size: pageSize,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    }),
  })
}
