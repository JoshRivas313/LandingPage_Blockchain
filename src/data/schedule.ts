export interface Slot {
  time: string
  title: string
  speaker?: string
  community?: string
  /** registration | lunch | closing se pintan en azul solido */
  type?: "registration" | "lunch" | "closing"
}

export const SCHEDULE: Slot[] = [
  { time: "09:00 am – 09:10 am", title: "Registro y acreditación", type: "registration" },
  { time: "09:10 am – 09:40 am", title: "Proximamente revelado" },
  {
    time: "09:40 am – 10:10 am",
    title: "El cumplimiento normativo como potenciador estratégico para startups web3",
    speaker: "Gerardo Huaman Morales",
    community: "Club del Bitcoin",
  },
  { time: "10:10 am – 10:40 am", title: "Proximamente revelado" },
  { time: "10:40 am – 11:10 am", title: "Proximamente revelado" },
  {
    time: "11:10 am – 11:40 am",
    title: "Construyendo comunidad, creando oportunidades",
    speaker: "Gianella Xiomara Coronel | Marcelo Vizcarra Tarrillo",
    community: "Dev3pack Perú (Solana)",
  },
  {
    time: "11:40 am – 12:10 pm",
    title: "Los herederos de Satoshi en la PUCP",
    speaker: "Fredy Alberto Polar Urviola",
    community: "Club Blockchain PUCP",
  },
  { time: "12:10 pm – 01:10 pm", title: "HORA DE ALMUERZO", type: "lunch" },
  {
    time: "01:10 pm – 01:40 pm",
    title: "Blockchain en la Transformación Digital Electoral del Perú",
    speaker: "Fernando Paredes",
    community: "Syscoin",
  },
  {
    time: "01:40 pm – 02:10 pm",
    title: "Ciberseguridad en ecosistemas Web3",
    speaker: "Alejandra Cecilia Catacora Vasquez",
    community: "Club Blockchain UPC",
  },
  {
    time: "02:10 pm – 02:40 pm",
    title: "Ethereum: una puerta local a un ecosistema global",
    speaker: "Yamille Celis",
    community: "ETH Lima",
  },
  {
    time: "02:40 pm – 02:55 pm",
    title: "Zero-Knowledge 101: Verificabilidad Matemática en Sistemas Descentralizados",
    speaker: "Jennifer Gabriela Ramírez Montero",
    community: "Stellar",
  },
  { time: "02:55 pm – 03:00 pm", title: "PALABRAS FINALES", type: "closing" },
]

export const SLOT_ICON: Record<string, string> = {
  lunch: "🍴 ",
  closing: "🎤 ",
}
