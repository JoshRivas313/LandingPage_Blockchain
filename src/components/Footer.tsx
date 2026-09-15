import logo from "@/assets/blockchain-conf-logo.webp"
import { FOOTER_EXPLORE, FOOTER_INFO, SOCIAL_LINKS } from "@/constants/site"

export function Footer() {
  return (
    <footer className="bc-footer">
      <div className="bc-footer__cols">
        <div className="bc-footer__brand">
          <img
            className="bc-footer__logo"
            src={logo}
            alt="Blockchain Conf"
            width={169}
            height={55}
            loading="lazy"
            decoding="async"
          />
          <p className="bc-footer__tagline">
            Conectando ideas, tecnología y comunidad para construir el futuro del desarrollo de
            blockchain
          </p>
        </div>

        <div className="bc-footer__col">
          <h4>Redes Sociales</h4>
          <div className="bc-footer__list">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="bc-footer__col">
          <h4>Explorar</h4>
          <div className="bc-footer__list">
            {FOOTER_EXPLORE.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="bc-footer__col">
          <h4>Información</h4>
          <div className="bc-footer__list">
            {FOOTER_INFO.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...("external" in link && link.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bc-footer__legal">
        © 2026 Blockchain Conf · Organizado por Developer Student Clubs UTP
      </div>
    </footer>
  )
}
