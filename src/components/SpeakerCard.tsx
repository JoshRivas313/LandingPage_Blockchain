import { memo } from "react"
import type { Speaker } from "@/data/speakers"

interface Props {
  speaker: Speaker
  /** Las 3 primeras son visibles de entrada; el resto puede esperar. */
  eager: boolean
}

/**
 * memo() esta puesto a proposito, no por rutina: el carrusel re-renderiza en
 * cada tick del autoplay (cada 3.5 s) y en cada swipe, y las 8 tarjetas son
 * identicas entre ticks. Solo cambia el transform del track.
 */
export const SpeakerCard = memo(function SpeakerCard({ speaker, eager }: Props) {
  return (
    <a className="bc-card" href={speaker.linkedin} target="_blank" rel="noreferrer">
      <div className="bc-card__rule" />
      <div className="bc-card__media">
        <img
          className="bc-card__photo"
          src={speaker.image}
          alt={speaker.name}
          width={389}
          height={200}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
        <span className="bc-card__role">{speaker.role}</span>
      </div>
      <div className="bc-card__body">
        <h3 className="bc-card__name">{speaker.name}</h3>
        <p className="bc-card__company">@ {speaker.company}</p>
        <div className="bc-card__topic">
          <p className="bc-card__topic-label">Tema de la charla</p>
          <p className="bc-card__topic-text">{speaker.topic}</p>
        </div>
      </div>
    </a>
  )
})
