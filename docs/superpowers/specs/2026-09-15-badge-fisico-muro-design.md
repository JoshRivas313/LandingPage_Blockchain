# Badge físico + Muro de credenciales — Diseño

Fecha: 2026-09-15

## Objetivo

Después de generar su pase digital, el usuario puede:
1. **Publicar en muro**: sube su credencial a una galería pública en el sitio.
2. **Solicitar badge físico**: paga S/6 por Yape, sube el comprobante, y pide que le
   entreguen un badge físico impreso el día del evento. Esta acción **siempre**
   publica también la credencial en el muro (regla de negocio, no opcional,
   sin toggle visible al usuario).

Los datos (incluyendo imágenes) se guardan en una base de datos de Notion
llamada **"Badgets de Blockchain Conf"**, a través de funciones serverless de
Vercel — el sitio ya se despliega en Vercel (`vercel.json` existente). El
token de Notion vive como variable de entorno en Vercel, nunca en el repo ni
en el bundle del navegador.

## Fuera de alcance (YAGNI)

- Verificación de email (el mockup original la mencionaba; se descarta — la
  app no pide email en ningún otro punto).
- Moderación/aprobación manual de publicaciones al muro (se publican de
  inmediato).
- Mostrar el comprobante de pago en el sitio público (es dato
  personal/financiero; solo vive en Notion, visible solo para el organizador).
- Deduplicación de publicaciones repetidas por la misma persona.
- Paginación real del muro (se trae un límite fijo de las más recientes).

## Notion — base de datos "Badgets de Blockchain Conf"

Propiedades:

| Propiedad | Tipo | Notas |
|---|---|---|
| Nombre | Title | Nombre del pase (el que se generó en la credencial) |
| Tipo | Select: `Digital`, `Físico` | |
| Usuario X | Rich text | Opcional |
| Nombre de quien recibe | Rich text | Solo en `Físico` |
| WhatsApp | Rich text | Solo en `Físico` |
| N° Operación Yape | Rich text | Solo en `Físico` |
| Comprobante de pago | Files & media | Solo en `Físico`. **Nunca** se expone vía `GET /api/wall`. |
| Credencial | Files & media | Imagen del pase. Pública (se muestra en el muro). |
| Fecha | Created time | Automático |

El acceso se hace con una **Internal Integration** de Notion (token del
usuario, configurado por él directamente en Vercel como `NOTION_API_KEY`, no
compartido en el chat). El usuario debe conectar la integración a la base de
datos desde Notion ("···" → "Connect to").

## Backend

Un solo endpoint Vercel serverless (Node.js runtime): `api/wall.ts`.

- `GET /api/wall`
  - Consulta la base de Notion (`POST /v1/databases/{id}/query`), ordenado
    por Fecha descendente, límite ~60.
  - Devuelve `[{ id, nombre, tipo, credencialUrl }]`. `credencialUrl` es la
    URL firmada de Notion (temporal, ~1h — está bien porque se pide fresca en
    cada carga de página).
  - Nunca incluye comprobante de pago ni datos de contacto.
- `POST /api/wall`
  - `multipart/form-data`, parseado con `formidable`.
  - Campos comunes: `kind` (`digital` | `fisico`), `nombre`, `username`
    (opcional), `credencial` (archivo imagen, requerido).
  - Campos solo si `kind=fisico`: `recibeNombre`, `whatsapp`, `operacion`,
    `comprobante` (archivo imagen, requerido).
  - Sube archivos a Notion vía su File Upload API (`POST /v1/file_uploads` →
    subir contenido → adjuntar por `file_upload.id` al crear la página) y
    crea una fila con `Tipo` según `kind`.
  - Si `NOTION_API_KEY`/`NOTION_DATABASE_ID` no están configuradas, responde
    `500` con un mensaje claro; el resto del sitio sigue funcionando.
  - Validación mínima: campos requeridos según `kind`, tamaño de archivo.

## Frontend

Archivos nuevos:
- `src/utils/wallApi.ts` — `fetchWall()`, `submitWallEntry(formData)`.
- `src/utils/image.ts` — extrae/generaliza la compresión de imagen que ya
  existe en `credential.ts` (`prepareUpload`) para reusarla también con el
  comprobante de pago (evitar subir fotos de 5-8MB de cámara tal cual).
- `src/components/PhysicalBadgeModal.tsx` — el modal de la captura: título
  "Badge físico", subtítulo "Entrega durante el evento · S/ 6", aviso (sin
  mención a email — ver más abajo), QR de Yape + datos de pago, formulario
  (nombre de quien recibe, WhatsApp, N° de operación, comprobante), botón
  "Publica tu credencial para continuar".
- `src/sections/Wall.tsx` — sección "Muro": `GET /api/wall` al montar, grid
  de tarjetas (imagen de credencial + nombre). Se re-consulta tras cada
  publicación exitosa (evento simple `window` o callback).

Archivos que cambian:
- `src/sections/Credential.tsx` — agrega dos botones nuevos, visibles solo
  cuando `isGenerated` es true: **"Publicar en muro"** y **"Solicitar badge
  físico"**. El primero llama `submitWallEntry` directamente con
  `kind=digital`. El segundo abre `PhysicalBadgeModal`.
- `src/constants/site.ts` — agrega `YAPE` (nombre, número, monto) y entradas
  de navegación para "Muro" (`SECTION_LINKS`, `FOOTER_EXPLORE`).
- `src/assets/yape-qr.png` — la sube el usuario; se importa como los demás
  assets.
- `src/pages/Home.tsx` — monta `<Wall />` entre Credencial y Footer.
- `src/styles/home.css` — estilos del modal, el muro y los botones nuevos,
  siguiendo el sistema visual existente (mismas variables de `tokens.css`).
- `package.json` — agrega `formidable` (y `@types/formidable` en dev) para
  el backend.

### Texto del aviso (corregido)

En vez de mencionar "email verificado" (no aplica, esta app no pide email):

> "Tu credencial se publicará en el muro junto con esta solicitud, para
> vincular el pago a tu pase."

### Reglas de validación en el modal

Requeridos para enviar: nombre de quien recibe, WhatsApp, N° de operación,
comprobante de pago. Si falta el pase generado (`isGenerated` false), el
botón "Solicitar badge físico" ni siquiera se muestra.

## Manejo de errores

- Notion no configurado aún → el usuario ve un toast de error genérico
  ("No pudimos procesar tu solicitud, inténtalo más tarde"); no rompe el
  resto del sitio.
- Falla la subida de un archivo a Notion → mismo toast, no se crea la fila
  a medias (se valida que ambas subidas de archivo terminen antes de crear
  la página).
- El muro, si `GET /api/wall` falla, muestra un estado vacío/discreto en vez
  de un error visible — es una sección decorativa, no crítica.

## Variables de entorno requeridas en Vercel

- `NOTION_API_KEY` — Internal Integration Secret (el usuario lo agrega).
- `NOTION_DATABASE_ID` — id de la base "Badgets de Blockchain Conf" (se lo
  paso yo al crearla).
