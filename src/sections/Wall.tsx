import { useCallback, useEffect, useState } from "react"
import { WALL_UPDATED_EVENT, fetchWall, type WallEntry } from "@/utils/wallApi"

/** Cuantas tarjetas se muestran antes de necesitar "Ver mas". */
const PAGE_SIZE = 8

export function Wall() {
  const [entries, setEntries] = useState<WallEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const load = useCallback(() => {
    fetchWall()
      .then(setEntries)
      .catch(() => {
        /* Seccion decorativa: si falla, se queda vacia sin romper la pagina. */
      })
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    load()
    window.addEventListener(WALL_UPDATED_EVENT, load)
    return () => window.removeEventListener(WALL_UPDATED_EVENT, load)
  }, [load])

  if (loaded && entries.length === 0) return null

  return (
    <section className="bc-wall" id="muro">
      <div className="bc-wrap">
        <div className="bc-wall__head" data-reveal>
          <span className="bc-badge">Comunidad</span>
          <h2>El muro de Blockchain Conf</h2>
          <p>Credenciales de quienes ya confirmaron que serán parte.</p>
          <span className="bc-wall__count">
            {entries.length} {entries.length === 1 ? "credencial publicada" : "credenciales publicadas"}
          </span>
        </div>

        <div className="bc-wall__grid" data-reveal>
          {entries.slice(0, visibleCount).map((entry) => (
            <figure className="bc-wall__item" key={entry.id}>
              {entry.credencialUrl && (
                <img
                  src={entry.credencialUrl}
                  alt={entry.nombre}
                  width={1122}
                  height={1402}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <figcaption>{entry.nombre}</figcaption>
            </figure>
          ))}
        </div>

        {visibleCount < entries.length && (
          <button
            className="bc-wall__more"
            type="button"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
          >
            Ver más
          </button>
        )}
      </div>
    </section>
  )
}
