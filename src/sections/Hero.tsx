import dscLogo from "@/assets/blockchain-logo.webp"
import mascot from "@/assets/main-logo.webp"
import { REGISTRATION_URL } from "@/constants/site"

/**
 * Above the fold. La mascota es la candidata a LCP, asi que va con
 * fetchPriority="high" y sin loading="lazy".
 */
export function Hero() {
  return (
    <section className="bc-hero" id="evento">
      <div className="bc-hero__inner">
        <div className="bc-hero__copy">
          <h1 className="bc-hero__title">Blockchain Conf</h1>

          <p className="bc-hero__lead">
            Conectando tecnología, innovación y comunidad para explorar el futuro de blockchain
          </p>

          <div className="bc-hero__meta">
            <span>📅 19 Sep</span>
            <span className="bc-hero__dot" aria-hidden="true" />
            <span>🕘 9:00 AM – 3:00 PM</span>
            <span className="bc-hero__dot" aria-hidden="true" />
            <span>📍 Auditorio UTP Sede Central</span>
          </div>

          <a className="bc-hero__cta" href={REGISTRATION_URL} target="_blank" rel="noreferrer">
            ¡YO SERÉ PARTE!
          </a>

          <div className="bc-hero__org">
            <span>Organizado por</span>
            <img src={dscLogo} alt="DSC UTP" width={255} height={68} decoding="async" />
          </div>
        </div>

        <div className="bc-hero__art">
          <img
            className="bc-hero__mascot"
            src={mascot}
            alt="Blockchain Conf mascota"
            width={787}
            height={840}
            fetchPriority="high"
            decoding="async"
          />
          <span className="bc-hero__chip bc-hero__chip--cyan" aria-hidden="true" />
          <span className="bc-hero__chip bc-hero__chip--violet" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
