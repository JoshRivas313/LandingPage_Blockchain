import alejandraCatacora from "@/assets/speakers/alejandra-catacora.webp"
import fernandoParedes from "@/assets/speakers/fernando-paredes.webp"
import fredyPolar from "@/assets/speakers/fredy-polar.webp"
import gerardoHuaman from "@/assets/speakers/gerardo-huaman.webp"
import gianellaCoronel from "@/assets/speakers/gianella-coronel.webp"
import jenniferRamirez from "@/assets/speakers/jennifer-ramirez.webp"
import marceloVizcarra from "@/assets/speakers/marcelo-vizcarra.webp"
import yamilleCelis from "@/assets/speakers/yamille-celis.webp"

export interface Speaker {
  id: number
  name: string
  role: string
  company: string
  topic: string
  image: string
  linkedin: string
}

export const SPEAKERS: Speaker[] = [
  {
    id: 1,
    name: "Gerardo Huaman Morales",
    role: "Abogado & Blockchain",
    company: "Club del Bitcoin",
    topic: "El cumplimiento normativo como potenciador estratégico para startups web3",
    image: gerardoHuaman,
    linkedin: "https://www.linkedin.com/in/gerardo-huaman-morales-a4baa71ab/",
  },
  {
    id: 2,
    name: "Gianella Xiomara Coronel Manchego",
    role: "Ingeniera de Software · Country Lead",
    company: "Dev3pack Perú",
    topic: "Construyendo comunidad, creando oportunidades",
    image: gianellaCoronel,
    linkedin: "https://www.linkedin.com/in/gianellacoronelmanchego/",
  },
  {
    id: 3,
    name: "Fredy Alberto Polar Urviola",
    role: "Comunidad Estudiantil",
    company: "Club Blockchain PUCP",
    topic: "Los herederos de Satoshi en la PUCP",
    image: fredyPolar,
    linkedin: "https://www.linkedin.com/in/fredy-alberto-polar-urviola/",
  },
  {
    id: 4,
    name: "Marcelo Vizcarra Tarrillo",
    role: "Ingeniero de Sistemas · Core Team",
    company: "Dev3pack Perú",
    topic: "Construyendo comunidad, creando oportunidades",
    image: marceloVizcarra,
    linkedin: "https://www.linkedin.com/in/marcelo-vizcarra-7459841b1/",
  },
  {
    id: 5,
    name: "Fernando Paredes",
    role: "Investigador IA+Blockchain",
    company: "Uconecta",
    topic: "Blockchain en la Transformación Digital Electoral del Perú",
    image: fernandoParedes,
    linkedin: "https://linkedin.com/in/develcuy",
  },
  {
    id: 6,
    name: "Alejandra Cecilia Catacora Vasquez",
    role: "Web3 Developer",
    company: "Club Blockchain UPC",
    topic: "Ciberseguridad en ecosistemas Web3",
    image: alejandraCatacora,
    linkedin: "https://www.linkedin.com/in/alejandra-catacora-7155931b8/",
  },
  {
    id: 7,
    name: "Yamille Celis",
    role: "Arbitrum Ambassador",
    company: "ETH Lima",
    topic: "Ethereum: una puerta local a un ecosistema global",
    image: yamilleCelis,
    linkedin: "https://www.linkedin.com/in/cycelisgomez",
  },
  {
    id: 8,
    name: "Jennifer Gabriela Ramírez Montero",
    role: "Blockchain Specialist",
    company: "Stellar",
    topic: "Zero-Knowledge 101: Verificabilidad Matemática en Sistemas Descentralizados",
    image: jenniferRamirez,
    linkedin: "https://www.linkedin.com/in/jennifer-gabriela-r-m",
  },
]
