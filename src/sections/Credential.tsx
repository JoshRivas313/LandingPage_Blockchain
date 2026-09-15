import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { PhysicalBadgeModal } from "@/components/PhysicalBadgeModal"
import { SHARE_TEXT } from "@/constants/site"
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
import {
  canShareFile,
  copyText,
  copyTextEager,
  openComposer,
  shareFile,
  supportsFileShare,
  toBadgeFile,
} from "@/utils/linkedin"
import { submitWallEntry } from "@/utils/wallApi"

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

/** El toast se monta, se anuncia y se va. No reserva sitio en el layout. */
const TOAST_MS = 2600

export function Credential() {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [isGenerated, setIsGenerated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState("")
  const [fallback, setFallback] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [showBadgeModal, setShowBadgeModal] = useState(false)

  /**
   * PNG ya generado, listo para compartir.
   *
   * Se prepara al crear el pase porque navigator.share() necesita el gesto del
   * usuario intacto: un await para generarlo dentro del propio clic consume la
   * activación en Safari.
   */
  const badgeRef = useRef<Blob | null>(null)

  /** Si el navegador comparte archivos, el botón abre el menú del sistema. */
  const [nativeShare] = useState(supportsFileShare)

  const toastTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const flash = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(""), TOAST_MS)
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

  /** Al cambiar cualquier dato el PNG cacheado deja de valer. */
  const invalidate = useCallback(() => {
    badgeRef.current = null
    setIsGenerated(false)
    setFallback(false)
  }, [])

  const replacePhoto = useCallback(
    (next: string) => {
      setPhotoUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return next
      })
      invalidate()
    },
    [invalidate],
  )

  const onPhotoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      replacePhoto(await prepareUpload(file))
    },
    [replacePhoto],
  )

  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value)
      invalidate()
    },
    [invalidate],
  )

  const onUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(
      e.target.value
        .replace(/^@+/, "")
        .replace(/[^A-Za-z0-9_]/g, "")
        .slice(0, 15),
    )
    invalidate()
  }, [invalidate])

  const requireInputs = () => {
    if (!name.trim() || !photoUrl) {
      alert("Por favor ingresa tu nombre y fotografía para generar la credencial.")
      return false
    }
    return true
  }

  /**
   * Genera el PNG y lo deja en memoria.
   *
   * Aquí sí se hace el trabajo: tener el archivo listo antes de compartir es
   * lo que permite llamar a navigator.share() sin await de por medio.
   */
  const handleGenerate = async () => {
    if (creating || !requireInputs()) return
    setCreating(true)
    try {
      badgeRef.current = await buildBlob()
      setIsGenerated(true)
    } catch (err) {
      console.error(err)
      flash("No pudimos crear tu pase. Inténtalo de nuevo.")
    } finally {
      setCreating(false)
    }
  }

  const buildBlob = async () => canvasToBlob(await renderCredential({ name, username, photoUrl }))
  const fileName = () =>
    `blockchain-conf-${name.trim().toLowerCase().replace(/\s+/g, "-") || "invitado"}.png`

  const downloadCredential = async () => {
    if (busy) return
    setBusy(true)
    try {
      downloadBlob(badgeRef.current ?? (await buildBlob()), fileName())
    } finally {
      setBusy(false)
    }
  }

  /** Sube la credencial ya generada a la galeria publica del muro. */
  const publishToWall = async () => {
    if (publishing || !badgeRef.current) return
    setPublishing(true)
    try {
      await submitWallEntry({ kind: "digital", nombre: name, username, credencial: badgeRef.current })
      flash("✓ Publicado en el muro")
    } catch {
      flash("No pudimos publicar tu credencial. Inténtalo de nuevo.")
    } finally {
      setPublishing(false)
    }
  }

  /** Escritorio: descargar, copiar y abrir el compositor. */
  const shareOnDesktop = async () => {
    downloadBlob(badgeRef.current ?? (await buildBlob()), fileName())
    const copied = await copyText(SHARE_TEXT)
    openComposer(SHARE_TEXT)
    flash(copied ? "✓ Pase descargado y texto copiado" : "✓ Pase descargado")
  }

  /**
   * Compartir.
   *
   * En móvil se abre el menú del sistema con la imagen. El texto se copia
   * ANTES, porque cada app decide si usa el campo `text` de Web Share y varias
   * —LinkedIn entre ellas— lo descartan al recibir una imagen: así al menos
   * está en el portapapeles para pegarlo.
   *
   * La copia se lanza sin esperarla a propósito. Un await aquí consumiría la
   * activación del gesto y Safari rechazaría el menú.
   */
  const shareLinkedIn = async () => {
    if (busy || !requireInputs()) return

    const cached = badgeRef.current
    if (cached && canShareFile(toBadgeFile(cached))) {
      const copying = copyTextEager(SHARE_TEXT)
      const sharing = shareFile(toBadgeFile(cached), SHARE_TEXT)

      copying.then((ok) => {
        if (ok) flash("✓ Texto copiado · selecciona dónde compartir")
      })

      const result = await sharing
      if (result === "denied") setFallback(true)
      else if (result === "failed") {
        flash("No pudimos abrir el menú de compartir. Guarda tu pase e inténtalo de nuevo.")
      }
      // "cancelled" es cerrar el menú a propósito: no se avisa de nada.
      return
    }

    setBusy(true)
    setIsGenerated(true)
    try {
      if (nativeShare) setFallback(true)
      else await shareOnDesktop()
    } catch (err) {
      console.error(err)
      flash("No pudimos preparar tu pase. Inténtalo de nuevo.")
    } finally {
      setBusy(false)
    }
  }

  const handle = formatHandle(username)

  return (
    <section className="bc-cred" id="credencial">
      <div className="bc-wrap">
        <div className="bc-cred__head" data-reveal>
          <h2>Comparte que serás parte</h2>
          <p>
            Crea tu pase en segundos y compártelo en LinkedIn para contarle a tu comunidad que
            estarás en Blockchain Conf.
          </p>
        </div>

        <div className="bc-cred__cols">
          <div className="bc-cred__form" data-reveal="left">
            <p className="bc-cred__form-intro">
              Completa tus datos, genera tu pase y déjalo listo para compartir.
            </p>

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

            <button
              className="bc-cred__submit"
              type="button"
              onClick={handleGenerate}
              disabled={creating}
            >
              {creating ? (
                <>
                  <span className="bc-spinner" aria-hidden="true" />
                  Creando tu pase…
                </>
              ) : isGenerated ? (
                "✓ ¡Tu pase está listo!"
              ) : (
                "Crear mi pase"
              )}
            </button>

            {isGenerated && (
              <div className="bc-cred__badge-actions">
                <button
                  className="bc-cred__wall"
                  type="button"
                  onClick={publishToWall}
                  disabled={publishing}
                >
                  {publishing ? "Publicando…" : "Publicar en muro"}
                </button>
                <button
                  className="bc-cred__physical"
                  type="button"
                  onClick={() => setShowBadgeModal(true)}
                >
                  Solicitar badge físico
                </button>
              </div>
            )}
          </div>

          <div className="bc-cred__side" data-reveal="right">
            {/* Preview = la maestra escalada. Las medidas salen de CREDENTIAL. */}
            <div className={`bc-pass${isGenerated ? " bc-pass--ready" : ""}`} style={PASS_VARS}>
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
              {/* Compartir es la accion principal; descargar queda de apoyo. */}
              <button
                className="bc-cred__share"
                type="button"
                onClick={shareLinkedIn}
                disabled={busy}
              >
                {nativeShare ? (
                  <>
                    <svg
                      className="bc-cred__share-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 3v13M12 3 8 7M12 3l4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Compartir
                  </>
                ) : (
                  "Compartir en LinkedIn"
                )}
              </button>
              <button
                className="bc-cred__download"
                type="button"
                onClick={downloadCredential}
                disabled={busy}
              >
                ⬇ Descargar mi pase
              </button>

              {fallback && (
                <div className="bc-cred__fallback">
                  <p>Tu pase está listo</p>
                  <div className="bc-cred__fallback-actions">
                    <button type="button" onClick={downloadCredential} disabled={busy}>
                      Descargar pase
                    </button>
                    <button
                      type="button"
                      onClick={async () =>
                        flash(
                          (await copyText(SHARE_TEXT))
                            ? "✓ Texto copiado"
                            : "No pudimos copiar el texto",
                        )
                      }
                    >
                      Copiar texto
                    </button>
                  </div>
                </div>
              )}

              <p className="bc-cred__nudge">
                Comparte tu pase y etiqueta a alguien que también debería estar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="bc-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

      {showBadgeModal && badgeRef.current && (
        <PhysicalBadgeModal
          name={name}
          username={username}
          credencial={badgeRef.current}
          onClose={() => setShowBadgeModal(false)}
          onSuccess={() => {
            setShowBadgeModal(false)
            flash("✓ Solicitud de badge físico enviada")
          }}
        />
      )}
    </section>
  )
}
