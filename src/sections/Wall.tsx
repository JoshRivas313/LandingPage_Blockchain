import { useCallback, useEffect, useState } from "react"
import { WALL_UPDATED_EVENT, fetchWall, type WallEntry } from "@/utils/wallApi"

export function Wall() {
  const [entries, setEntries] = useState<WallEntry[]>([])
  const [loaded, setLoaded] = useState(false)

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
        </div>

        <div className="bc-wall__grid" data-reveal>
          {entries.map((entry) => (
            <figure className="bc-wall__item" key={entry.id}>
              {entry.credencialUrl && <img src={entry.credencialUrl} alt={entry.nombre} loading="lazy" />}
              <figcaption>{entry.nombre}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
