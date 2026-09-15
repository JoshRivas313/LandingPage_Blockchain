import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import {
  CREDENTIAL,
  canvasToBlob,
  downloadBlob,
  formatHandle,
  formatName,
  handleFontPx,
  nameFontPx,
  prepareUpload,
  renderCredential,
  templateSrc,
  toCqw,
} from "@/utils/credential"
import { authorize, getSession, publish, type LinkedInSession } from "@/utils/linkedin"

const pct = (n: number) => `${(n * 100).toFixed(2)}%`

/** Cajas del preview derivadas de la composicion maestra: no hay medidas propias. */
const PHOTO_BOX: CSSProperties = {
  left: pct(CREDENTIAL.photo.left),
  top: pct(CREDENTIAL.photo.top),
  width: pct(CREDENTIAL.photo.width),
  height: pct(CREDENTIAL.photo.height),
  borderRadius: pct(CREDENTIAL.photo.radius),
}

const NAME_BOX: CSSProperties = {
  left: pct(CREDENTIAL.name.left),
  right: pct(CREDENTIAL.name.right),
  top: pct(CREDENTIAL.name.top),
  height: pct(CREDENTIAL.name.height),
}

const HANDLE_BOX: CSSProperties = {
  left: pct(CREDENTIAL.handle.left),
  right: pct(CREDENTIAL.handle.right),
  top: pct(CREDENTIAL.handle.top),
  height: pct(CREDENTIAL.handle.height),
}

const PASS_VARS = {
  "--pass-w": CREDENTIAL.width,
  "--pass-h": CREDENTIAL.height,
} as CSSProperties

type Phase =
  | { kind: "idle" }
  | { kind: "connecting" }
  | { kind: "preparing" }
  | { kind: "confirming"; previewUrl: string; blob: Blob }
  | { kind: "publishing"; previewUrl: string }
  | { kind: "published" }
  | { kind: "error"; message: string }

export function Credential() {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [isGenerated, setIsGenerated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState<Phase>({ kind: "idle" })
  const [session, setSession] = useState<LinkedInSession | null>(null)

  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    getSession().then(setSession)
  }, [])

  // Los object URL hay que revocarlos a mano o la foto se queda en memoria.
  const photoUrlRef = useRef("")
  useEffect(() => {
    photoUrlRef.current = photoUrl
  }, [photoUrl])
  useEffect(() => {
    return () => {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
    }
  }, [])

  // El <dialog> nativo aporta el foco atrapado y Escape sin JS extra.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const shouldOpen = phase.kind === "confirming" || phase.kind === "publishing"
    if (shouldOpen && !dialog.open) dialog.showModal()
    if (!shouldOpen && dialog.open) dialog.close()
  }, [phase.kind])

  const replacePhoto = useCallback((next: string) => {
    setPhotoUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return next
    })
    setIsGenerated(false)
  }, [])

  const onPhotoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      replacePhoto(await prepareUpload(file))
    },
    [replacePhoto],
  )

  const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setIsGenerated(false)
  }, [])

  const onUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(
      e.target.value
        .replace(/^@+/, "")
        .replace(/[^A-Za-z0-9_]/g, "")
        .slice(0, 15),
    )
    setIsGenerated(false)
  }, [])

  const requireInputs = () => {
    if (!name.trim() || !photoUrl) {
      alert("Por favor ingresa tu nombre y fotografía para generar la credencial.")
      return false
    }
    return true
  }

  /** Solo marca el pase como listo. El PNG no se genera hasta que se pide. */
  const handleGenerate = () => {
    if (requireInputs()) setIsGenerated(true)
  }

  const buildBlob = async () => canvasToBlob(await renderCredential({ name, username, photoUrl }))

  const downloadCredential = async () => {
    if (busy) return
    setBusy(true)
    try {
      const slug = name.trim().toLowerCase().replace(/\s+/g, "-") || "invitado"
      downloadBlob(await buildBlob(), `blockchain-conf-${slug}.png`)
    } finally {
      setBusy(false)
    }
  }

  const closeDialog = (previewUrl?: string) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPhase({ kind: "idle" })
  }

  /** Compartir = autorizar (si hace falta) -> generar -> confirmar -> publicar. */
  const shareLinkedIn = async () => {
    if (busy || !requireInputs()) return
    setBusy(true)
    setIsGenerated(true)

    try {
      let current = session ?? (await getSession())
      setSession(current)

      if (!current.authorized) {
        setPhase({ kind: "connecting" })
        const result = await authorize()

        if (result === "blocked") {
          setPhase({
            kind: "error",
            message: "Permite las ventanas emergentes para conectar con LinkedIn.",
          })
          return
        }
        if (result === "cancelled") {
          setPhase({ kind: "idle" })
          return
        }
        if (result === "error") {
          setPhase({ kind: "error", message: "No pudimos conectar con LinkedIn. Inténtalo de nuevo." })
          return
        }

        current = await getSession()
        setSession(current)
        if (!current.authorized) {
          setPhase({ kind: "error", message: "No pudimos conectar con LinkedIn. Inténtalo de nuevo." })
          return
        }
      }

      setPhase({ kind: "preparing" })
      const blob = await buildBlob()
      setPhase({ kind: "confirming", previewUrl: URL.createObjectURL(blob), blob })
    } catch (err) {
      console.error(err)
      setPhase({ kind: "error", message: "No pudimos preparar tu publicación. Inténtalo de nuevo." })
    } finally {
      setBusy(false)
    }
  }

  /** Paso final, siempre explicito: nada se publica sin este clic. */
  const confirmPublish = async () => {
    if (phase.kind !== "confirming") return
    const { blob, previewUrl } = phase
    setPhase({ kind: "publishing", previewUrl })

    const result = await publish(blob)
    URL.revokeObjectURL(previewUrl)

    if (result.ok) {
      setPhase({ kind: "published" })
      return
    }

    if (result.error === "unauthorized") {
      setSession((s) => (s ? { ...s, authorized: false } : s))
      setPhase({ kind: "error", message: "Tu sesión de LinkedIn caducó. Vuelve a intentarlo." })
    } else if (result.error === "network") {
      setPhase({ kind: "error", message: "Sin conexión. Revisa tu red e inténtalo de nuevo." })
    } else {
      setPhase({ kind: "error", message: "LinkedIn rechazó la publicación. Inténtalo más tarde." })
    }
  }

  const handle = formatHandle(username)
  const showLinkedIn = session?.configured === true
  const dialogPreview =
    phase.kind === "confirming" || phase.kind === "publishing" ? phase.previewUrl : null

  return (
    <section className="bc-cred" id="credencial">
      <div className="bc-wrap">
        <div className="bc-cred__head">
          <h2>Tu pase, a tu estilo</h2>
          <p>
            Personalízalo en segundos, visualízalo al instante y llévatelo contigo a Blockchain
            Conf.
          </p>
        </div>

        <div className="bc-cred__cols">
          <div className="bc-cred__form">
            <div className="bc-field">
              <label className="bc-field__label" htmlFor="cred-name">
                Nombre y apellido
              </label>
              <input
                id="cred-name"
                type="text"
                value={name}
                onChange={onNameChange}
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div className="bc-field">
              <label className="bc-field__label" htmlFor="cred-x">
                Usuario de X (Twitter)
              </label>
              <input
                id="cred-x"
                type="text"
                value={username}
                onChange={onUsernameChange}
                maxLength={15}
                placeholder="Ej. juanperez"
              />
              <p className="bc-field__hint">No incluyas el @, lo agregaremos automáticamente.</p>
            </div>

            <div className="bc-field">
              <span className="bc-field__label">Fotografía</span>
              <label className={`bc-field__drop${photoUrl ? " bc-field__drop--filled" : ""}`}>
                {photoUrl ? "¡Fotografía subida! (clic para cambiar)" : "Subir fotografía"}
                <input type="file" accept="image/*" onChange={onPhotoUpload} />
              </label>
            </div>

            <button className="bc-cred__submit" type="button" onClick={handleGenerate}>
              Crear mi pase
            </button>
          </div>

          <div className="bc-cred__side">
            {/* Preview = la maestra escalada. Las medidas salen de CREDENTIAL. */}
            <div className="bc-pass" style={PASS_VARS}>
              <img
                className="bc-pass__template"
                src={templateSrc}
                alt="Plantilla credencial"
                width={CREDENTIAL.width}
                height={CREDENTIAL.height}
                loading="lazy"
                decoding="async"
              />

              <div className="bc-pass__photo" style={PHOTO_BOX}>
                {photoUrl && <img src={photoUrl} alt="" />}
              </div>

              <div className="bc-pass__name" style={NAME_BOX}>
                <h3 style={{ fontSize: toCqw(nameFontPx(name)) }}>{formatName(name)}</h3>
              </div>

              <div className="bc-pass__handle" style={HANDLE_BOX}>
                <span
                  style={{
                    fontSize: toCqw(handleFontPx(handle)),
                    color: username ? "var(--c-navy)" : "var(--c-faint)",
                  }}
                >
                  {handle}
                </span>
              </div>
            </div>

            <div className={`bc-cred__actions${isGenerated ? "" : " bc-cred__actions--idle"}`}>
              <div className="bc-cred__buttons">
                <button
                  className="bc-cred__download"
                  type="button"
                  onClick={downloadCredential}
                  disabled={busy}
                >
                  ⬇ Descargar mi pase
                </button>
                {showLinkedIn && (
                  <button
                    className="bc-cred__share"
                    type="button"
                    onClick={shareLinkedIn}
                    disabled={busy}
                  >
                    Compartir en LinkedIn
                  </button>
                )}
              </div>

              {phase.kind === "connecting" && (
                <p className="bc-cred__status" role="status">
                  Conectando con LinkedIn…
                </p>
              )}
              {phase.kind === "preparing" && (
                <p className="bc-cred__status" role="status">
                  Preparando tu publicación…
                </p>
              )}
              {phase.kind === "published" && (
                <p className="bc-cred__status bc-cred__status--ok" role="status">
                  ✓ ¡Publicado en LinkedIn!
                </p>
              )}
              {phase.kind === "error" && (
                <p className="bc-cred__status bc-cred__status--error" role="alert">
                  {phase.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmacion explicita: se ve la imagen y el texto exactos antes de publicar. */}
      <dialog
        className="bc-confirm"
        ref={dialogRef}
        onCancel={(e) => {
          if (phase.kind === "publishing") e.preventDefault()
          else closeDialog(dialogPreview ?? undefined)
        }}
      >
        <h3 className="bc-confirm__title">Tu publicación está lista 🚀</h3>
        <p className="bc-confirm__who">
          Se publicará en tu perfil de LinkedIn
          {session?.name ? ` como ${session.name}` : ""}.
        </p>

        <div className="bc-confirm__body">
          {dialogPreview && (
            <img className="bc-confirm__image" src={dialogPreview} alt="Tu credencial" />
          )}
          <pre className="bc-confirm__text">{session?.shareText}</pre>
        </div>

        <div className="bc-confirm__actions">
          <button
            type="button"
            className="bc-confirm__cancel"
            onClick={() => closeDialog(dialogPreview ?? undefined)}
            disabled={phase.kind === "publishing"}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="bc-confirm__publish"
            onClick={confirmPublish}
            disabled={phase.kind === "publishing"}
          >
            {phase.kind === "publishing" ? "Publicando en LinkedIn…" : "Publicar en LinkedIn"}
          </button>
        </div>
      </dialog>
    </section>
  )
}
