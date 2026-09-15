import { IMAGE_ALT, IMAGE_TITLE } from "./config.js"

const AUTHORIZE_URL = "https://www.linkedin.com/oauth/v2/authorization"
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
const USERINFO_URL = "https://api.linkedin.com/v2/userinfo"
const ASSETS_URL = "https://api.linkedin.com/v2/assets?action=registerUpload"
const UGC_POSTS_URL = "https://api.linkedin.com/v2/ugcPosts"

/**
 * openid + profile dan el `sub` con el que se arma el Person URN.
 * w_member_social es el que permite publicar en nombre del miembro.
 */
export const SCOPES = "openid profile w_member_social"

export function authorizeUrl(params: {
  clientId: string
  redirectUri: string
  state: string
}): string {
  const qs = new URLSearchParams({
    response_type: "code",
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    state: params.state,
    scope: SCOPES,
  })
  return `${AUTHORIZE_URL}?${qs}`
}

export async function exchangeCode(params: {
  code: string
  clientId: string
  clientSecret: string
  redirectUri: string
}): Promise<{ accessToken: string; expiresIn: number }> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: params.code,
      client_id: params.clientId,
      client_secret: params.clientSecret,
      redirect_uri: params.redirectUri,
    }),
  })

  if (!res.ok) {
    throw new Error(`token ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }

  const json = (await res.json()) as { access_token: string; expires_in: number }
  return { accessToken: json.access_token, expiresIn: json.expires_in }
}

export async function fetchMember(token: string): Promise<{ personUrn: string; name: string }> {
  const res = await fetch(USERINFO_URL, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    throw new Error(`userinfo ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }

  const json = (await res.json()) as { sub: string; name?: string; given_name?: string }
  return {
    personUrn: `urn:li:person:${json.sub}`,
    name: json.name ?? json.given_name ?? "",
  }
}

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "X-Restli-Protocol-Version": "2.0.0",
  }
}

/** Paso 1: registrar la subida y obtener uploadUrl + URN del asset. */
async function registerUpload(
  token: string,
  personUrn: string,
): Promise<{ uploadUrl: string; asset: string }> {
  const res = await fetch(ASSETS_URL, {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: personUrn,
        serviceRelationships: [
          { relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" },
        ],
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`registerUpload ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }

  const json = (await res.json()) as {
    value: {
      asset: string
      uploadMechanism: {
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest": { uploadUrl: string }
      }
    }
  }

  return {
    asset: json.value.asset,
    uploadUrl:
      json.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]
        .uploadUrl,
  }
}

/** Paso 2: subir el binario a la URL que devolvio LinkedIn. */
async function uploadBinary(uploadUrl: string, token: string, png: Buffer): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "image/png" },
    body: new Uint8Array(png),
  })

  if (!res.ok) {
    throw new Error(`upload ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }
}

/** Paso 3: crear la publicacion con el asset ya subido. */
async function createPost(params: {
  token: string
  personUrn: string
  text: string
  asset: string
}): Promise<string> {
  const res = await fetch(UGC_POSTS_URL, {
    method: "POST",
    headers: { ...headers(params.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      author: params.personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: params.text },
          shareMediaCategory: "IMAGE",
          media: [
            {
              status: "READY",
              media: params.asset,
              description: { text: IMAGE_ALT },
              title: { text: IMAGE_TITLE },
            },
          ],
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  })

  if (!res.ok) {
    throw new Error(`ugcPosts ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }

  return res.headers.get("x-restli-id") ?? ""
}

/** Registrar -> subir -> publicar. */
export async function publishImagePost(params: {
  token: string
  personUrn: string
  text: string
  png: Buffer
}): Promise<{ postUrn: string }> {
  const { uploadUrl, asset } = await registerUpload(params.token, params.personUrn)
  await uploadBinary(uploadUrl, params.token, params.png)
  const postUrn = await createPost({ ...params, asset })
  return { postUrn }
}
