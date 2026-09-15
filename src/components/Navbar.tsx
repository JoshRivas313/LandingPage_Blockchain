import logo from "@/assets/blockchain-conf-logo.webp"
import { REGISTRATION_URL, SECTION_LINKS } from "@/constants/site"
import { useScrolled } from "@/hooks/useScrolled"

/**
 * El menu movil es un <details> nativo: bajo 860 px los enlaces del navbar
 * desaparecian sin sustituto y no habia forma de navegar. Resuelto sin estado
 * de React ni listeners.
 */
export function Navbar() {
  const scrolled = useScrolled()

  return (
    <nav className={`bc-nav${scrolled ? " bc-nav--scrolled" : ""}`}>
      <div className="bc-nav__inner">
        <a className="bc-nav__brand" href="#evento" aria-label="Blockchain Conf, inicio">
          <img
            className="bc-nav__logo"
            src={logo}
            alt="Blockchain Conf"
            width={190}
            height={51}
            fetchPriority="high"
            decoding="sync"
          />
        </a>

        <div className="bc-nav__right">
          <div className="bc-nav__links">
            {SECTION_LINKS.map((link, i) => (
              <a
                key={link.href}
                className="bc-nav__link"
                href={link.href}
                style={{ "--i": i + 1 } as React.CSSProperties}
              >
                {link.label}
              </a>
            ))}
          </div>

          <details className="bc-nav__menu">
            <summary className="bc-nav__menu-btn" aria-label="Abrir menú">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
            <div className="bc-nav__menu-panel">
              {SECTION_LINKS.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
              <a href="#credencial">Credencial</a>
            </div>
          </details>

          <a className="bc-btn" href={REGISTRATION_URL} target="_blank" rel="noreferrer">
            Registrarme
          </a>
        </div>
      </div>
    </nav>
  )
}
