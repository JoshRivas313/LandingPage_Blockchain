import { PARTNERS } from "@/data/partners"

// El marquee necesita la lista duplicada para que el bucle a -50% sea continuo.
const TRACK = [...PARTNERS, ...PARTNERS]

export function Partners() {
  return (
    <section className="bc-partners" id="comunidades">
      <h2 className="bc-partners__title" data-reveal>
        Community Partner
      </h2>

      {/*
        La entrada se aplica a la cinta entera, no logo a logo: el marquee los
        desplaza en horizontal dentro de un contenedor recortado, así que un
        logo puede no llegar a intersecar nunca y quedarse invisible. El
        movimiento de la sección ya lo aporta la propia marquesina; cada logo
        conserva su microinteracción al pasar el ratón.
      */}
      <div className="bc-partners__reveal" data-reveal>
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
      </div>
    </section>
  )
}
