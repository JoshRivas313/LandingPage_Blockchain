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
    topic: "La blockchain en el campo legal",
    image: gerardoHuaman,
    linkedin: "https://www.linkedin.com/in/gerardo-huaman-morales-a4baa71ab/",
  },
  {
    id: 2,
    name: "Gianella Xiomara Coronel Manchego",
    role: "Ingeniera de Software · Country Lead",
    company: "Dev3pack Perú",
    topic: "Experiencias de hackathones internacionales blockchain",
    image: gianellaCoronel,
    linkedin: "https://www.linkedin.com/in/gianellacoronelmanchego/",
  },
  {
    id: 3,
    name: "Fredy Alberto Polar Urviola",
    role: "Comunidad Estudiantil",
    company: "Club Blockchain PUCP",
    topic: "Cómo poder formar tu propio club estudiantil de blockchain",
    image: fredyPolar,
    linkedin: "https://www.linkedin.com/in/fredy-alberto-polar-urviola/",
  },
  {
    id: 4,
    name: "Marcelo Vizcarra Tarrillo",
    role: "Ingeniero de Sistemas · Core Team",
    company: "Dev3pack Perú",
    topic: "Visión de la blockchain desde el ámbito empresarial",
    image: marceloVizcarra,
    linkedin: "https://www.linkedin.com/in/marcelo-vizcarra-7459841b1/",
  },
  {
    id: 5,
    name: "Fernando Paredes",
    role: "Investigador IA+Blockchain",
    company: "Uconecta",
    topic: "Blockchain en procesos electorales",
    image: fernandoParedes,
    linkedin: "https://linkedin.com/in/develcuy",
  },
  {
    id: 6,
    name: "Alejandra Cecilia Catacora Vasquez",
    role: "Web3 Developer",
    company: "Club Blockchain UPC",
    topic: "Día a día en un trabajo Web3",
    image: alejandraCatacora,
    linkedin: "https://www.linkedin.com/in/alejandra-catacora-7155931b8/",
  },
  {
    id: 7,
    name: "Yamille Celis",
    role: "Arbitrum Ambassador",
    company: "ETH Lima",
    topic: "Arbitrum",
    image: yamilleCelis,
    linkedin: "https://www.linkedin.com/in/cycelisgomez",
  },
  {
    id: 8,
    name: "Jennifer Gabriela Ramírez Montero",
    role: "Blockchain Specialist",
    company: "Stellar",
    topic: "Zero Knowledge",
    image: jenniferRamirez,
    linkedin: "https://www.linkedin.com/in/jennifer-gabriela-r-m",
  },
]
