import { SpeakerCard } from "@/components/SpeakerCard"
import { SPEAKERS } from "@/data/speakers"
import { useCarousel } from "@/hooks/useCarousel"

export function Speakers() {
  const { index, visibleCount, atStart, atEnd, next, prev, handlers } = useCarousel(SPEAKERS.length)

  return (
    <section className="bc-speakers" id="speakers">
      <div className="bc-wrap">
        <div className="bc-speakers__head" data-reveal>
          <div className="bc-speakers__intro">
            <span className="bc-badge">Nuestros Expertos</span>
            <h2>Las mentes que mueven blockchain</h2>
            <p>
              Descubre a los líderes y especialistas que compartirán su experiencia, conocimiento y
              visión sobre el ecosistema.
            </p>
          </div>
          <div className="bc-speakers__nav">
            <button
              className="bc-arrow"
              type="button"
              onClick={prev}
              disabled={atStart}
              aria-label="Speaker anterior"
            >
              ←
            </button>
            <button
              className="bc-arrow"
              type="button"
              onClick={next}
              disabled={atEnd}
              aria-label="Siguiente speaker"
            >
              →
            </button>
          </div>
        </div>

        <div
          data-reveal
          className="bc-carousel"
          tabIndex={0}
          aria-label="Carrusel de speakers, usa las flechas del teclado para navegar"
          {...handlers}
        >
          <div
            className="bc-carousel__track"
            style={{
              // Se delega en CSS calc(): el track solo recibe dos numeros y el
              // navegador resuelve el resto sin recalcular layout en JS.
              "--visible": visibleCount,
              transform: `translate3d(calc(-1 * ${index} * (100% + 24px) / ${visibleCount}), 0, 0)`,
            } as React.CSSProperties}
          >
            {SPEAKERS.map((speaker, i) => (
              <SpeakerCard key={speaker.id} speaker={speaker} eager={i < 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
