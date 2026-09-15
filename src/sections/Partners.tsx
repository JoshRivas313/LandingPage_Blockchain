import { PARTNERS } from "@/data/partners"

// El marquee necesita la lista duplicada para que el bucle a -50% sea continuo.
const TRACK = [...PARTNERS, ...PARTNERS]

export function Partners() {
  return (
    <section className="bc-partners" id="comunidades">
      <h2 className="bc-partners__title">Community Partner</h2>
      <div className="bc-partners__track">
        {TRACK.map((partner, i) => {
          // La segunda vuelta solo existe para cerrar el bucle: no se anuncia.
          const isClone = i >= PARTNERS.length
          return (
            <div
              className="bc-partners__item"
              key={`${partner.name}-${i}`}
              aria-hidden={isClone || undefined}
            >
              <img
                src={partner.logo}
                alt={isClone ? "" : partner.name}
                width={partner.width}
                height={partner.height}
                loading="lazy"
                decoding="async"
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
