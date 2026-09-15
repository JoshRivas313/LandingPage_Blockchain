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
] as const

export const FOOTER_EXPLORE = [
  { label: "Evento", href: "#evento" },
  ...SECTION_LINKS,
  { label: "Credencial", href: "#credencial" },
] as const

export const FOOTER_INFO = [
  { label: "Ubicación", href: VENUE_MAP_URL, external: true },
  { label: "Preguntas frecuentes", href: "/faq/" },
  { label: "Código de conducta", href: "/codigo-de-conducta/" },
] as const


/** Texto que se copia al portapapeles y se prellena en el compositor. */
export const SHARE_TEXT = `🚀 ¡Yo seré parte de Blockchain Conf!

Una jornada para conectar, aprender y explorar blockchain, Web3 y sus aplicaciones junto a la comunidad.

📅 19 de septiembre
📍 Auditorio UTP Sede Central

🔗 Regístrate y crea tu propio pase:
${REGISTRATION_URL}

#BlockchainConf #Blockchain #Web3 #ComunidadTech`
