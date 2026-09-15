import { useState } from "react"
import yapeQr from "@/assets/yape-qr.png"
import { YAPE } from "@/constants/site"
import { compressImageToBlob } from "@/utils/image"
import { submitWallEntry } from "@/utils/wallApi"

type Props = {
  name: string
  username: string
  credencial: Blob
  onClose: () => void
  onSuccess: () => void
}

export function PhysicalBadgeModal({ name, username, credencial, onClose, onSuccess }: Props) {
  const [recibeNombre, setRecibeNombre] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [operacion, setOperacion] = useState("")
  const [comprobante, setComprobante] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const canSubmit = recibeNombre.trim() && whatsapp.trim() && operacion.trim() && comprobante

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || sending) return
    setSending(true)
    setError("")
    try {
      const comprobanteBlob = await compressImageToBlob(comprobante!)
      await submitWallEntry({
        kind: "fisico",
        nombre: name,
        username,
        credencial,
        recibeNombre: recibeNombre.trim(),
        whatsapp: whatsapp.trim(),
        operacion: operacion.trim(),
        comprobante: comprobanteBlob,
      })
      onSuccess()
    } catch {
      setError("No pudimos procesar tu solicitud. Inténtalo de nuevo en unos minutos.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bc-modal" role="dialog" aria-modal="true" aria-labelledby="badge-fisico-title">
      <div className="bc-modal__backdrop" onClick={onClose} />
      <div className="bc-modal__panel">
        <div className="bc-modal__head">
          <div>
            <h3 id="badge-fisico-title">Badge físico</h3>
            <p>Entrega durante el evento · S/ {YAPE.amount}</p>
          </div>
          <button type="button" className="bc-modal__close" onClick={onClose} aria-label="Cerrar">
            Cerrar
          </button>
        </div>

        <p className="bc-modal__notice">
          Tu credencial se publicará en el muro junto con esta solicitud, para vincular el pago a tu
          pase.
        </p>

        <div className="bc-modal__yape">
          <img src={yapeQr} alt="Código QR de Yape" />
          <div>
            <span className="bc-modal__yape-label">Pago por Yape</span>
            <p className="bc-modal__yape-amount">Monto a pagar: S/ {YAPE.amount}</p>
            <p className="bc-modal__yape-name">{YAPE.name}</p>
            <p className="bc-modal__yape-phone">{YAPE.phone}</p>
            <p className="bc-modal__yape-hint">
              Escanea el QR o paga al número indicado y adjunta tu comprobante.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="bc-field">
            <label className="bc-field__label" htmlFor="badge-recibe">
              Nombre de quien recibe
            </label>
            <input
              id="badge-recibe"
              type="text"
              value={recibeNombre}
              onChange={(e) => setRecibeNombre(e.target.value)}
              placeholder="ej. María López"
            />
          </div>

          <div className="bc-field">
            <label className="bc-field__label" htmlFor="badge-whatsapp">
              Número de WhatsApp
            </label>
            <input
              id="badge-whatsapp"
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="ej. +51 961 679 031"
            />
          </div>

          <div className="bc-field">
            <label className="bc-field__label" htmlFor="badge-operacion">
              N.º de operación / referencia Yape
            </label>
            <input
              id="badge-operacion"
              type="text"
              value={operacion}
              onChange={(e) => setOperacion(e.target.value)}
              placeholder="ej. 12345678"
            />
          </div>

          <div className="bc-field">
            <span className="bc-field__label">Comprobante de pago</span>
            <label className={`bc-field__drop${comprobante ? " bc-field__drop--filled" : ""}`}>
              {comprobante ? "¡Comprobante subido! (clic para cambiar)" : "Subir comprobante"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setComprobante(e.target.files?.[0] ?? null)}
              />
            </label>
            <p className="bc-field__hint">JPG, PNG o WebP. Máximo 10 MB.</p>
          </div>

          {error && <p className="bc-modal__error">{error}</p>}

          <button className="bc-cred__submit" type="submit" disabled={!canSubmit || sending}>
            {sending ? (
              <>
                <span className="bc-spinner" aria-hidden="true" />
                Publicando…
              </>
            ) : (
              "Publica tu credencial para continuar"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
