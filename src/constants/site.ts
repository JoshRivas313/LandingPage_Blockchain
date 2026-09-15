/** URL publica del sitio. Es la que se comparte y la que va en la metadata. */
export const EVENT_URL = "https://landing-page-blockchain.vercel.app/"

/**
 * Donde se registra la gente de verdad.
 *
 * Se mantiene separada de EVENT_URL a proposito: los botones "Registrarme" y
 * "YO SERE PARTE" tienen que llevar a algun sitio donde inscribirse, y
 * apuntarlos a esta misma landing seria un enlace circular.
 */
export const REGISTRATION_URL = "https://luma.com/r750uqs6?tk=aylyJO"

export const VENUE_MAP_URL =
  "https://www.google.com/maps/place/UTP+-+Torre+Arequipa/@-12.0661289,-77.0371124,17z/data=!4m6!3m5!1s0x9105c8ea52a218f9:0x4931f570fd313227!8m2!3d-12.0660957!4d-77.0368976!16s%2Fg%2F11g6ynrf1p"

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/dsc-utp/" },
  { label: "Instagram", href: "https://www.instagram.com/dsc.utp/" },
  { label: "YouTube", href: "https://www.youtube.com/@dsc-utp" },
] as const

export const SECTION_LINKS = [
  { label: "Comunidades", href: "#comunidades" },
  { label: "Speakers", href: "#speakers" },
  { label: "Cronograma", href: "#cronograma" },
  { label: "Muro", href: "#muro" },
] as const

export const FOOTER_EXPLORE = [
  { label: "Evento", href: "#evento" },
  ...SECTION_LINKS,
  { label: "Credencial", href: "#credencial" },
] as const

/** Datos fijos de cobro por Yape para el badge fisico. */
export const YAPE = {
  name: "Gianmarco Guerrero",
  phone: "919646023",
  amount: 6,
} as const

export const FOOTER_INFO = [
  { label: "Ubicación", href: VENUE_MAP_URL, external: true },
  { label: "Preguntas frecuentes", href: "/faq/" },
  { label: "Código de conducta", href: "/codigo-de-conducta/" },
] as const


/**
 * Texto que se copia al portapapeles y se prellena en el compositor.
 *
 * La mencion a Developer Student Club UTP es obligatoria y va escrita tal
 * cual: ni abreviada ni sustituida.
 */
export const SHARE_TEXT = `¡Nos vemos en #BlockchainConf! 🚀✨

Este 19 de septiembre nos reunimos junto a Developer Student Club UTP para conectar, aprender y compartir sobre blockchain, Web3 y comunidad.

Genera tu badge y súmate:

${EVENT_URL}

#Blockchain #Web3 #DSCUTP`

/**
 * Texto para LinkedIn. Solo difiere de SHARE_TEXT en el nombre de la
 * comunidad: alli se escribe "Developer Student Clubs - UTP".
 */
export const LINKEDIN_SHARE_TEXT = `¡Nos vemos en #BlockchainConf! 🚀✨

Este 19 de septiembre nos reunimos junto a Developer Student Clubs - UTP para conectar, aprender y compartir sobre blockchain, Web3 y comunidad.

Genera tu badge y súmate:

${EVENT_URL}

#Blockchain #Web3 #DSCUTP`
