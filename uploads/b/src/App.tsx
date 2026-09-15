import { useState, useRef, useEffect } from "react"
import mainLogo from "./imports/Community_Partner__5_.png"
import blockchainLogo from "./imports/Community_Partner.png"
import { Link, useLocation } from "react-router-dom"
import credentialTemplate from "./imports/CREDENCIALES.png"
import html2canvas from "html2canvas"

// --- SVG Icons ---
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
)
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)
const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)
const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 7.1C2.5 7.1 2.3 5.3 3.1 4.5C4 3.6 5 3.6 5.5 3.5C8.9 3.2 12 3.2 12 3.2C12 3.2 15.1 3.2 18.5 3.5C19 3.6 20 3.6 20.9 4.5C21.7 5.3 21.5 7.1 21.5 7.1C21.5 7.1 21.7 8.9 21.7 10.7V13.3C21.7 15.1 21.5 16.9 21.5 16.9C21.5 16.9 21.7 18.7 20.9 19.5C20 20.4 18.8 20.4 18.3 20.5C14.7 20.8 12 20.8 12 20.8C12 20.8 8.9 20.8 5.5 20.5C5 20.4 4 20.4 3.1 19.5C2.3 18.7 2.5 16.9 2.5 16.9C2.5 16.9 2.3 15.1 2.3 13.3V10.7C2.3 8.9 2.5 7.1 2.5 7.1Z" />
    <path d="M10 15L15.5 12L10 9V15Z" fill="currentColor" />
  </svg>
)
const UserCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
)
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)
const ComputerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="8" x="5" y="2" rx="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" />
    <path d="M6 18h2" />
    <path d="M12 18h6" />
  </svg>
)
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
)
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
)
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)
const XCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

// --- Constants ---
const REGISTRATION_URL = "https://luma.com/r750uqs6?tk=aylyJO"

// Rutas que `main` sabe renderizar; cualquier otra cae en el bloque 404.
const KNOWN_ROUTES = ["/", "/conducta", "/faq", "/recursos", "/ubicacion"]

// CREDENCIALES.png mide 1080x1350 y ya trae dibujado el marco donde va la foto.
// Estas medidas son ese marco y el hueco libre a su derecha, en % de la plantilla,
// para que la vista previa y la imagen descargada compongan exactamente igual.
const CREDENTIAL_RATIO = "1080 / 1350"
const CREDENTIAL_BG = "#f4f4f4"
const CREDENTIAL_FRAME = {
  left: "13.24%",
  top: "46.15%",
  width: "47.78%",
  height: "38.07%",
} as const
const CREDENTIAL_NAME_BOX = {
  left: "62%",
  right: "3.5%",
  top: "46.15%",
  height: "38.07%",
} as const

// TODO: apuntar a los perfiles reales del evento; hoy caen en la página de registro.
const SOCIAL_LINKS = [
  { label: "LinkedIn", href: REGISTRATION_URL, Icon: LinkedinIcon },
  { label: "Instagram", href: REGISTRATION_URL, Icon: InstagramIcon },
  { label: "YouTube", href: REGISTRATION_URL, Icon: YoutubeIcon },
]

const SCHEDULE_DATA = [
  {
    time: "09:00 am – 09:10 am",
    title: "Registro y acreditación",
    type: "registration",
  },
  {
    time: "09:10 am – 09:40 am",
    title: "Ponencia 1",
    speaker: "Por confirmar",
    type: "talk",
  },
  {
    time: "09:40 am – 10:10 am",
    title: "El cumplimiento normativo como potenciador estratégico para  startups web3",
    speaker: "Gerardo Huaman",
    community: "Club del Bitcoin",
    type: "talk",
  },
  {
    time: "10:10 am – 10:40 am",
    title: "Ponencia 3",
    speaker: "Por confirmar",
    type: "talk",
  },
  {
    time: "10:10 am – 10:40 am",
    title: "Ponencia 4",
    speaker: "Por confirmar",
    type: "talk",
  },
  {
    time: "11:10 am – 11:40 am",
    title: "Experiencias de hackathones internacionales blockchain",
    speaker: "Dev3pack Peru",
    community: "Solana",
    type: "talk",
  },
  {
    time: "11:40 am – 12:10 pm",
    title: "Cómo poder formar tu propio club estudiantil de blockchain",
    speaker: "Club Blockchain PUCP",
    type: "talk",
  },
  { time: "12:10 pm – 01:10 pm", title: "HORA DE ALMUERZO", type: "lunch" },
  {
    time: "01:10 pm – 01:40 pm",
    title: "Blockchain en procesos electorales",
    speaker: "Fer",
    community: "Syscoin",
    type: "talk",
  },
  {
    time: "01:40 pm – 02:10 pm",
    title: "Día a día en un trabajo Web3",
    speaker: "Alejandra Catacora",
    community: "Club Blockchain UPC",
    type: "talk",
  },
  {
    time: "02:10 pm – 02:40 pm",
    title: "Arbitrum",
    speaker: "Yamile Celis",
    community: "ETH Lima",
    type: "talk",
  },
  {
    time: "02:40 pm – 02:55 pm",
    title: "Zero Knowledge",
    speaker: "Gabriela",
    community: "Stellar",
    type: "talk",
  },
  { time: "02:55 pm – 03:00 pm", title: "PALABRAS FINALES", type: "closing" },
]

const SPEAKERS_DATA = [
  {
    id: 1,
    name: "Por confirmar",
    role: "Speaker Invitado",
    company: "-",
    topic: "Ponencia 1",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=800&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "Gerardo Huaman",
    role: "Abogado & Blockchain",
    company: "Club del Bitcoin",
    topic: "La blockchain en el campo legal",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop&auto=format",
  },
  {
    id: 3,
    name: "Por confirmar",
    role: "Speaker Invitado",
    company: "-",
    topic: "Ponencia 3",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dca08d11?w=800&h=800&fit=crop&auto=format",
  },
  {
    id: 4,
    name: "JJ",
    role: "Solutions Architect",
    company: "NTT Data",
    topic: "Visión de la blockchain desde el ámbito empresarial",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop&auto=format",
  },
  {
    id: 5,
    name: "Dev3pack Peru",
    role: "Hackathon Experts",
    company: "Solana",
    topic: "Experiencias de hackathones internacionales blockchain",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop&auto=format",
  },
  {
    id: 6,
    name: "Club Blockchain PUCP",
    role: "Comunidad Estudiantil",
    company: "PUCP",
    topic: "Cómo poder formar tu propio club estudiantil de blockchain",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop&auto=format",
  },
  {
    id: 7,
    name: "Fer",
    role: "Web3 Developer",
    company: "Syscoin",
    topic: "Blockchain en procesos electorales",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&auto=format",
  },
  {
    id: 8,
    name: "Alejandra Catacora",
    role: "Web3 Developer",
    company: "Club Blockchain UPC",
    topic: "Día a día en un trabajo Web3",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop&auto=format",
  },
  {
    id: 9,
    name: "Yamile Celis",
    role: "Arbitrum Ambassador",
    company: "ETH Lima",
    topic: "Arbitrum y escalabilidad",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop&auto=format",
  },
  {
    id: 10,
    name: "Gabriela",
    role: "Blockchain Specialist",
    company: "Stellar",
    topic: "Zero Knowledge",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&h=800&fit=crop&auto=format",
  },
]

const FAQ_DATA = [
  {
    q: "¿Necesito llevar mi entrada impresa?",
    a: "No es necesario llevar la entrada impresa, te recomendamos bajar el app de luma y podrás mostrar tu entrada mediante el QR de la app.",
  },
  {
    q: "¿Necesito llevar mi DNI para acceder al evento?",
    a: "Sí, es indispensable presentar tu DNI o documento de identidad original para validar tu registro en la puerta.",
  },
  {
    q: "¿Puedo salir y volver a entrar al evento?",
    a: "Sí, tu credencial te permitirá el reingreso libremente durante todo el día del evento.",
  },
  {
    q: "¿Hasta qué hora se extenderá el evento?",
    a: "Las actividades están programadas para finalizar a las 3:00 PM tras las palabras de cierre.",
  },
  {
    q: "¿Es necesario llevar una laptop al evento?",
    a: "No es estrictamente necesario, pero es muy recomendable para seguir los talleres prácticos o participar en las dinámicas tecnológicas.",
  },
  {
    q: "¿Cuál es el horario máximo de ingreso al evento?",
    a: "El registro de bienvenida es de 9:00 AM a 9:30 AM. Sin embargo, podrás ingresar posteriormente en cualquier momento presentando tu código QR.",
  },
  {
    q: "¿Habrá estacionamiento disponible en el lugar del evento?",
    a: "La sede no cuenta con estacionamiento público para asistentes. Recomendamos usar alternativas de movilidad o transporte público.",
  },
]

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window === "undefined") return false
    const saved = window.localStorage.getItem("theme")
    if (saved === "dark" || saved === "light") return saved === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })
  const [credData, setCredData] = useState({
    name: "",
    lastname: "",
    xUsername: "",
    photoUrl: "",
  })
  const [isGenerated, setIsGenerated] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isSliderPaused, setIsSliderPaused] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const credentialCaptureRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const path = location.pathname

  // Theme Toggle Effect
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkTheme)
    window.localStorage.setItem("theme", isDarkTheme ? "dark" : "light")
  }, [isDarkTheme])

  // React Router cambia la URL sin mover el scroll: los enlaces con ancla
  // (`/#speakers`) hay que resolverlos a mano.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" })
      return
    }
    const id = decodeURIComponent(location.hash.slice(1))
    // Un frame de margen para que la sección exista si acabamos de cambiar de ruta.
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [location.pathname, location.hash, location.key])

  // Smooth continuous-like auto-scroll for speakers
  useEffect(() => {
    if (isSliderPaused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
        const itemWidth = sliderRef.current.children[0]?.clientWidth + 24 || 350 // Add gap (24px)

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          sliderRef.current.scrollBy({ left: itemWidth, behavior: "smooth" })
        }
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [isSliderPaused])

  const scrollPrev = () => {
    if (sliderRef.current) {
      const itemWidth = sliderRef.current.children[0]?.clientWidth + 24 || 350
      sliderRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" })
    }
  }

  const scrollNext = () => {
    if (sliderRef.current) {
      const itemWidth = sliderRef.current.children[0]?.clientWidth + 24 || 350
      sliderRef.current.scrollBy({ left: itemWidth, behavior: "smooth" })
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCredData((prev) => ({
          ...prev,
          photoUrl: e.target?.result as string,
        }))
        setIsGenerated(false)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleGenerate = () => {
    if (
      !credData.name.trim() ||
      !credData.lastname.trim() ||
      !credData.photoUrl
    ) {
      alert(
        "Por favor ingresa tu nombre, apellido y fotografía para generar la credencial.",
      )
      return
    }
    setIsGenerated(true)
  }

  const downloadCredential = async () => {
    if (!credentialCaptureRef.current) return
    try {
      const canvas = await html2canvas(credentialCaptureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: CREDENTIAL_BG,
      })
      const data = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = data
      const cleanName = credData.name.trim().toLowerCase().replace(/\s+/g, "-")
      const cleanLastName = credData.lastname
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
      link.download = `github-day-conf-${cleanName}-${cleanLastName}.png`
      link.click()
    } catch (err) {
      console.error("Error al generar imagen", err)
      alert("Hubo un error al generar tu credencial. Inténtalo de nuevo.")
    }
  }

  const shareLinkedIn = () => {
    const text = `🚀 ¡Nos vemos en el GitHub Community Day! 🙌\n\nEstoy emocionado por ser parte del evento, un espacio donde la tecnología, desarrollo y comunidad se encuentran para compartir conocimientos, experiencias y nuevas oportunidades. 💻\n\nSerá una gran oportunidad para conectar con personas apasionadas por la tecnología, conocer nuevas ideas y seguir aprendiendo junto a la comunidad tech. 🔥\n\nNos vemos ahí. 🚀\n\n${REGISTRATION_URL}`
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(
          "¡Texto copiado al portapapeles!\n\n1. Descarga tu credencial.\n2. Pega este texto en tu nueva publicación de LinkedIn.\n3. Adjunta la imagen descargada.",
        )
        window.open("https://www.linkedin.com/feed/", "_blank")
      })
      .catch(() => {
        alert(
          "No pudimos copiar el texto al portapapeles. Por favor intenta de nuevo o da permisos.",
        )
      })
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-x-0 border-t-0 border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              <img
                src={blockchainLogo}
                alt="Blockchain Conf Logo"
                className="h-8 sm:h-10 w-auto object-contain dark:invert transition-all"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                to="/#comunidades"
                className="text-sm font-medium text-muted hover:text-primary transition-colors"
              >
                Comunidades
              </Link>
              <Link
                to="/#speakers"
                className="text-sm font-medium text-muted hover:text-primary transition-colors"
              >
                Speakers
              </Link>
              <Link
                to="/#cronograma"
                className="text-sm font-medium text-muted hover:text-primary transition-colors"
              >
                Cronograma
              </Link>

              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className="p-2 text-muted hover:text-primary transition-colors rounded-full hover:bg-surface-alt"
                aria-label="Toggle Theme"
              >
                {isDarkTheme ? <SunIcon /> : <MoonIcon />}
              </button>

              <a
                href={REGISTRATION_URL}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all text-sm shadow-md shadow-primary/20"
              >
                Registrarme
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className="p-2 text-muted hover:text-primary transition-colors rounded-full hover:bg-surface-alt"
                aria-label="Toggle Theme"
              >
                {isDarkTheme ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:text-primary p-2"
              >
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden bg-surface border-b border-border absolute w-full left-0">
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-xl">
              <Link
                to="/#comunidades"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-surface-alt hover:text-primary"
              >
                Comunidades
              </Link>
              <Link
                to="/#speakers"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-surface-alt hover:text-primary"
              >
                Speakers
              </Link>
              <Link
                to="/#cronograma"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-surface-alt hover:text-primary"
              >
                Cronograma
              </Link>
              <a
                href={REGISTRATION_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block mt-4 text-center px-3 py-3 bg-primary text-white font-semibold rounded-lg shadow-sm"
              >
                Registrarme
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16 md:pt-20">
        {path === "/" && (
          <>
            {/* HERO SECTION */}
            <section
              id="evento"
              className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-background"
            >
              {/* Background Gradients and Grid */}
              <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-50 z-0"></div>
              <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
              <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/15 rounded-full blur-[100px] pointer-events-none z-0"></div>

              {/* Floating decorative elements (like the reference image) */}
              <div className="absolute top-[15%] left-[5%] text-success opacity-80 animate-float">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 0h4v10h10v4H14v10h-4V14H0v-4h10V0z" />
                </svg>
              </div>
              <div className="absolute bottom-[20%] right-[8%] text-primary opacity-60 animate-float-delayed">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 0h4v10h10v4H14v10h-4V14H0v-4h10V0z" />
                </svg>
              </div>
              <div className="absolute top-[30%] right-[15%] text-accent opacity-50 animate-float scale-75">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 0h4v10h10v4H14v10h-4V14H0v-4h10V0z" />
                </svg>
              </div>
              <div className="absolute bottom-[35%] left-[12%] text-success opacity-40 animate-float-delayed scale-50">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 0h4v10h10v4H14v10h-4V14H0v-4h10V0z" />
                </svg>
              </div>

              <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                <div className="w-full lg:w-3/5 text-center lg:text-left flex flex-col items-center lg:items-start">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary font-bold text-xs sm:text-sm mb-6 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    El evento oficial de GitHub en Perú
                  </div>

                  <h1 className="sr-only">GitHub Community Day</h1>
                  <img
                    src={mainLogo}
                    alt="GitHub Community Day Logo"
                    className="h-16 sm:h-20 md:h-24 lg:h-32 w-auto object-contain mb-8 origin-center lg:origin-left dark:invert dark:brightness-200 transition-all drop-shadow-md"
                  />

                  <p className="text-lg sm:text-xl text-muted mb-8 max-w-xl font-medium leading-relaxed">
                    Conectando ideas, tecnología y comunidad para construir el
                    futuro del desarrollo.
                  </p>

                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-4 gap-y-3 mb-10 text-sm sm:text-base font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon /> <span>19 Sep</span>
                    </div>
                    <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border"></div>
                    <div className="flex items-center gap-2">
                      <ClockIcon /> <span>9:00 AM – 3:00 PM</span>
                    </div>
                    <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border"></div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon /> <span>Auditorio UTP Sede Central</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
                    <a
                      href={REGISTRATION_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all text-base sm:text-lg shadow-[0_8px_25px_rgba(139,92,246,0.3)] flex justify-center border border-white/10"
                    >
                      ¡YO SERÉ PARTE!
                    </a>
                  </div>
                </div>

                {/* Visual side - Floating Elements */}
                <div className="w-full lg:w-2/5 h-64 sm:h-80 lg:h-[450px] relative flex justify-center items-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 rounded-full blur-[60px]"></div>

                  {/* Main floating card */}
                  <div className="absolute w-40 h-40 md:w-56 md:h-56 glass-panel bg-gradient-to-br from-white/60 to-white/10 dark:from-surface/80 dark:to-surface/40 rounded-3xl rotate-6 animate-float shadow-[0_20px_50px_rgba(0,82,255,0.15)] flex items-center justify-center overflow-hidden border border-white/40 dark:border-white/10 backdrop-blur-xl">
                    <div className="absolute inset-0 bg-grid-pattern-small opacity-30"></div>
                    <img
                      src={mainLogo}
                      alt="Logo"
                      className="w-20 h-20 md:w-32 md:h-32 object-contain dark:invert relative z-10 drop-shadow-xl"
                    />
                  </div>

                  {/* Secondary floating cube/card */}
                  <div className="absolute w-20 h-20 md:w-28 md:h-28 glass-panel bg-gradient-to-tr from-accent/80 to-primary/80 rounded-2xl -bottom-4 right-4 md:right-8 animate-float-delayed shadow-2xl flex items-center justify-center border border-white/30 backdrop-blur-md">
                    <div className="w-10 h-10 md:w-14 md:h-14 text-white opacity-90">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </div>
                  </div>

                  {/* Accent dot */}
                  <div className="absolute w-12 h-12 md:w-16 md:h-16 glass-panel bg-success rounded-full top-8 left-4 md:left-8 -rotate-12 animate-float shadow-lg flex items-center justify-center border-2 border-white/50 backdrop-blur-md">
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-white rounded-full opacity-80"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* COMMUNITIES MARQUEE */}
            <section
              id="comunidades"
              className="py-16 sm:py-20 relative overflow-hidden bg-surface-alt border-y border-border"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Comunidades Aliadas
                </h2>
              </div>

              <div className="relative z-10 w-full flex overflow-x-hidden group">
                <div className="flex w-max animate-[marquee_30s_linear_infinite]">
                  {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((i, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[180px] sm:w-[220px] mx-3 sm:mx-4 flex items-center justify-center h-16 sm:h-20 bg-surface border border-border rounded-xl text-muted shadow-sm hover:border-primary/50 hover:text-primary transition-colors duration-300"
                    >
                      <span className="font-display font-bold text-sm sm:text-base tracking-wider uppercase">
                        Aliado {i}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PONENTES SECTION */}
            <section
              id="speakers"
              className="py-20 sm:py-24 bg-background relative overflow-hidden border-b border-border"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-40 z-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"></div>

              <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
                  <div className="text-left max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-surface shadow-sm text-primary font-bold text-xs uppercase tracking-widest mb-4">
                      Nuestros Expertos
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-foreground">
                      Conoce a nuestros ponentes
                    </h2>
                    <p className="text-base sm:text-lg text-muted">
                      Descubre a los líderes y especialistas que compartirán su
                      experiencia, conocimiento y visión sobre el ecosistema.
                    </p>
                  </div>

                  {/* Slider Controls (Desktop) */}
                  <div
                    className="hidden sm:flex gap-3"
                    onMouseEnter={() => setIsSliderPaused(true)}
                    onMouseLeave={() => setIsSliderPaused(false)}
                  >
                    <button
                      onClick={scrollPrev}
                      className="w-12 h-12 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 z-30"
                      aria-label="Anterior"
                    >
                      <ArrowLeftIcon />
                    </button>
                    <button
                      onClick={scrollNext}
                      className="w-12 h-12 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 z-30"
                      aria-label="Siguiente"
                    >
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>

                {/* Infinite Horizontal Track */}
                <div className="relative w-full -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div
                    ref={sliderRef}
                    onMouseEnter={() => setIsSliderPaused(true)}
                    onMouseLeave={() => setIsSliderPaused(false)}
                    onFocusCapture={() => setIsSliderPaused(true)}
                    onBlurCapture={() => setIsSliderPaused(false)}
                    onTouchStart={() => setIsSliderPaused(true)}
                    role="region"
                    aria-label="Ponentes del evento"
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar scroll-smooth"
                  >
                    {SPEAKERS_DATA.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="shrink-0 w-[calc(100vw-3rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] snap-center sm:snap-start glass-panel bg-surface border-border rounded-3xl overflow-hidden group hover:shadow-[0_15px_40px_rgba(9,105,218,0.1)] hover:border-primary/40 transition-all duration-300 relative flex flex-col"
                      >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent z-10 opacity-70 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative h-56 sm:h-64 overflow-hidden bg-surface-alt">
                          <div className="absolute inset-0 bg-grid-pattern-small opacity-30 z-0"></div>
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="relative z-10 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />

                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                            <div className="bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-border text-primary text-xs font-bold uppercase tracking-wider shadow-sm">
                              {speaker.role}
                            </div>
                            <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-foreground opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                              <svg
                                className="w-4 h-4 text-accent"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 sm:p-7 flex flex-col flex-1 relative bg-surface">
                          <div className="relative z-10">
                            <h3 className="font-display text-2xl font-bold mb-1.5 text-foreground group-hover:text-primary transition-colors">
                              {speaker.name}
                            </h3>
                            {speaker.company !== "-" ? (
                              <p className="text-muted text-sm font-medium mb-6 flex items-center gap-1.5">
                                <MapPinIcon /> @ {speaker.company}
                              </p>
                            ) : (
                              <div className="mb-6 h-5"></div>
                            )}

                            <div className="mt-auto pt-4 border-t border-border">
                              <p className="text-[10px] uppercase text-accent font-bold tracking-widest mb-1">
                                Tema de la charla
                              </p>
                              <p className="text-foreground font-semibold text-sm leading-snug">
                                {speaker.topic}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slider Controls (Mobile) */}
                <div className="flex sm:hidden justify-center gap-4 mt-2">
                  <button
                    onClick={scrollPrev}
                    className="w-10 h-10 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors z-30"
                    aria-label="Anterior"
                  >
                    <ArrowLeftIcon />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="w-10 h-10 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors z-30"
                    aria-label="Siguiente"
                  >
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
            </section>

            {/* CRONOGRAMA SECTION */}
            <section
              id="cronograma"
              className="py-20 sm:py-24 bg-surface-alt relative overflow-hidden border-b border-border"
            >
              <div className="absolute left-0 top-0 w-1/3 h-full bg-grid-pattern opacity-20 [mask-image:linear-gradient(to_right,white,transparent)] pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                    Cronograma del Evento
                  </h2>
                  <p className="text-base sm:text-lg text-muted mb-6">
                    Un día completo de aprendizaje y networking.
                  </p>

                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-surface border border-border shadow-sm text-primary rounded-lg text-sm font-bold uppercase tracking-wider">
                    <MapPinIcon /> Auditorio UTP Sede Central
                  </div>
                </div>

                <div className="relative border-l-2 border-border ml-3 sm:ml-6 space-y-8 sm:space-y-10">
                  {SCHEDULE_DATA.map((item, idx) => {
                    const isHighlight =
                      item.type === "lunch" || item.type === "closing"

                    return (
                      <div key={idx} className="relative pl-6 sm:pl-8 group">
                        <div
                          className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-surface border-[3px] border-primary transition-transform ${
                            isHighlight
                              ? "scale-125"
                              : "group-hover:scale-125 shadow-sm"
                          }`}
                        ></div>

                        <div
                          className={`border p-5 sm:p-6 rounded-2xl transition-all duration-300 ${
                            isHighlight
                              ? "bg-primary text-white border-primary shadow-lg scale-[1.02] transform"
                              : "glass-panel bg-surface border-border group-hover:border-primary/40 group-hover:shadow-md"
                          }`}
                        >
                          <div className="mb-3 relative z-10">
                            <span
                              className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-md inline-block ${
                                isHighlight
                                  ? "bg-white/20 text-white border border-white/20"
                                  : "text-primary bg-primary/5 border border-primary/10"
                              }`}
                            >
                              {item.time}
                            </span>
                          </div>

                          <h4
                            className={`relative z-10 font-display text-lg sm:text-xl font-bold mb-2 leading-tight flex items-center gap-2 ${
                              isHighlight ? "text-white" : "text-foreground"
                            }`}
                          >
                            {item.type === "lunch" && (
                              <span className="text-2xl">🍴</span>
                            )}
                            {item.type === "closing" && (
                              <span className="text-2xl">🎤</span>
                            )}
                            {item.title}
                          </h4>

                          {item.speaker && (
                            <div
                              className={`relative z-10 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm mt-3 pt-3 border-t ${
                                isHighlight
                                  ? "text-white/80 border-white/20"
                                  : "text-muted border-border"
                              }`}
                            >
                              <div
                                className={`flex items-center gap-2 font-semibold ${
                                  isHighlight ? "text-white" : "text-foreground"
                                }`}
                              >
                                <UserCircleIcon /> {item.speaker}
                              </div>
                              {item.community && (
                                <span
                                  className={`hidden sm:inline ${
                                    isHighlight ? "text-white/80" : "text-muted"
                                  }`}
                                >
                                  — {item.community}
                                </span>
                              )}
                              {item.community && (
                                <span
                                  className={`sm:hidden block pl-7 text-xs ${
                                    isHighlight ? "text-white/80" : "text-muted"
                                  }`}
                                >
                                  {item.community}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* CREDENTIAL GENERATOR SECTION */}
            <section
              id="credencial"
              className="py-20 sm:py-24 bg-background relative overflow-hidden border-b border-border"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                    Genera tu credencial
                  </h2>
                  <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">
                    Crea tu pase oficial digital para el evento. Completa tus
                    datos, visualiza el resultado y compártelo con tu red.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
                  {/* Form */}
                  <div className="w-full lg:w-[380px] shrink-0 glass-panel bg-surface p-6 sm:p-8 rounded-3xl">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Nombres
                        </label>
                        <input
                          type="text"
                          value={credData.name}
                          onChange={(e) => {
                            setCredData({ ...credData, name: e.target.value })
                            setIsGenerated(false)
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm placeholder-muted"
                          placeholder="Ej. Juan Carlos"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Apellidos
                        </label>
                        <input
                          type="text"
                          value={credData.lastname}
                          onChange={(e) => {
                            setCredData({
                              ...credData,
                              lastname: e.target.value,
                            })
                            setIsGenerated(false)
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm placeholder-muted"
                          placeholder="Ej. Pérez Gómez"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Usuario de X (Twitter)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">
                            @
                          </span>
                          <input
                            type="text"
                            value={credData.xUsername}
                            onChange={(e) => {
                              const val = e.target.value.replace("@", "")
                              setCredData({
                                ...credData,
                                xUsername: val,
                              })
                              setIsGenerated(false)
                            }}
                            className="w-full pl-9 pr-4 py-3 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-sm placeholder-muted"
                            placeholder="usuario"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Fotografía
                        </label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-surface-alt transition-all bg-background group"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          {credData.photoUrl ? (
                            <p className="text-sm text-primary font-bold">
                              ¡Fotografía subida! (Clic para cambiar)
                            </p>
                          ) : (
                            <p className="text-sm text-muted font-medium group-hover:text-foreground">
                              Subir fotografía
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleGenerate}
                          className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                          Generar credencial
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview & Actions */}
                  <div className="w-full flex-1 flex flex-col items-center">
                    {/* Misma proporción y mismas coordenadas que la captura, en
                        unidades de contenedor: lo que se ve aquí es exactamente
                        lo que se descarga. */}
                    <div
                      className="@container w-full max-w-[420px] relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-border"
                      style={{
                        aspectRatio: CREDENTIAL_RATIO,
                        backgroundColor: CREDENTIAL_BG,
                      }}
                    >
                      <img
                        src={credentialTemplate}
                        alt="Vista previa de tu credencial del evento"
                        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                      />

                      <div
                        className="absolute z-10 overflow-hidden rounded-[3.7%] [&_svg]:w-full [&_svg]:h-full"
                        style={CREDENTIAL_FRAME}
                      >
                        {credData.photoUrl ? (
                          <img
                            src={credData.photoUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#dbeafe] text-[#94a3b8]">
                            <div className="w-[26%] h-[26%]">
                              <UsersIcon />
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className="absolute z-10 flex flex-col justify-center"
                        style={CREDENTIAL_NAME_BOX}
                      >
                        <h3 className="font-display text-[4.26cqw] font-extrabold text-[#0B1020] leading-[1.05] uppercase break-words">
                          {credData.name || "NOMBRES"}
                        </h3>
                        <h3 className="font-display text-[4.26cqw] font-extrabold text-[#0052FF] leading-[1.05] uppercase break-words">
                          {credData.lastname || "APELLIDOS"}
                        </h3>
                        {credData.xUsername && (
                          <div className="mt-[2cqw] self-start max-w-full flex items-center gap-[0.9cqw] px-[1.85cqw] py-[0.9cqw] rounded-full bg-[#E6EDFF] border-2 border-[#B9CCFF] text-[#0052FF] [&_svg]:w-full [&_svg]:h-full">
                            <span className="w-[2.2cqw] h-[2.2cqw] shrink-0">
                              <XIcon />
                            </span>
                            <span className="text-[2.04cqw] font-bold tracking-wider break-words min-w-0">
                              @{credData.xUsername}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className={`w-full max-w-[420px] mt-8 flex flex-col sm:flex-row gap-4 transition-all duration-500 ${
                        isGenerated
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4 pointer-events-none"
                      }`}
                    >
                      <button
                        onClick={downloadCredential}
                        className="flex-1 py-4 bg-surface text-foreground font-bold rounded-xl border border-border hover:bg-surface-alt shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Descargar credencial
                      </button>
                      <button
                        onClick={shareLinkedIn}
                        className="flex-1 py-4 bg-[#0A66C2] text-white font-bold rounded-xl hover:bg-[#004182] shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <LinkedinIcon />
                        Compartir en LinkedIn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {path === "/conducta" && (
          <>
            {/* CODE OF CONDUCT SECTION */}
            <section
              id="conducta"
              className="py-20 sm:py-24 bg-surface-alt relative overflow-hidden border-b border-border"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                    Código de Conducta
                  </h2>
                  <p className="text-base sm:text-lg text-muted">
                    En GitHub Community Day, nos comprometemos a crear un
                    ambiente seguro e inclusivo para el evento. Nuestro objetivo
                    es que todos los participantes tengan una experiencia
                    positiva, colaborativa y respetuosa.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                    <h3 className="font-display text-xl font-bold mb-6 text-success flex items-center gap-2">
                      <CheckCircleIcon /> Lo que esperamos de ti
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="text-success mt-1">
                          <CheckCircleIcon />
                        </div>
                        <div>
                          <strong className="block text-foreground mb-1">
                            Sé respetuoso y amable
                          </strong>
                          <p className="text-sm text-muted">
                            Trata a todos los participantes con cortesía, sin
                            importar su experiencia o identidad.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="text-success mt-1">
                          <CheckCircleIcon />
                        </div>
                        <div>
                          <strong className="block text-foreground mb-1">
                            Promueve un ambiente positivo
                          </strong>
                          <p className="text-sm text-muted">
                            Fomenta la colaboración y el aprendizaje mutuo.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="text-success mt-1">
                          <CheckCircleIcon />
                        </div>
                        <div>
                          <strong className="block text-foreground mb-1">
                            Comunícate constructivamente
                          </strong>
                          <p className="text-sm text-muted">
                            Expresa tus ideas de forma profesional y respeta las
                            opiniones de los demás.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                    <h3 className="font-display text-xl font-bold mb-6 text-danger flex items-center gap-2">
                      <XCircleIcon /> Lo que no toleramos
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="text-danger mt-1">
                          <XCircleIcon />
                        </div>
                        <div>
                          <strong className="block text-foreground mb-1">
                            Acoso y discriminación
                          </strong>
                          <p className="text-sm text-muted">
                            No se permite ninguna forma de intimidación, acoso o
                            discriminación por género, etnia, religión,
                            habilidad técnica, etc.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="text-danger mt-1">
                          <XCircleIcon />
                        </div>
                        <div>
                          <strong className="block text-foreground mb-1">
                            Lenguaje ofensivo
                          </strong>
                          <p className="text-sm text-muted">
                            Evita el discurso de odio, comentarios despectivos y
                            cualquier contenido inapropiado.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="text-danger mt-1">
                          <XCircleIcon />
                        </div>
                        <div>
                          <strong className="block text-foreground mb-1">
                            Interrupción
                          </strong>
                          <p className="text-sm text-muted">
                            La interrupción intencional de las actividades del
                            evento no será tolerada.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-surface p-8 rounded-2xl border border-primary/20 shadow-sm text-center">
                  <h3 className="font-display text-xl font-bold mb-4 text-foreground">
                    ¿Cómo reportar un incidente?
                  </h3>
                  <p className="text-muted text-sm sm:text-base mb-4">
                    Si experimentas o presencias una violación de este código de
                    conducta, contacta de inmediato a un organizador del evento
                    o a un líder. Puedes hacerlo en persona o a través de
                    nuestros canales oficiales. Tu informe se manejará de forma
                    confidencial y se tomarán las medidas necesarias.
                  </p>
                  <p className="text-sm font-semibold text-danger">
                    Las consecuencias pueden incluir desde una advertencia hasta
                    la expulsión del evento.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {path === "/faq" && (
          <>
            {/* FAQ SECTION */}
            <section
              id="faq"
              className="py-20 sm:py-24 bg-background relative overflow-hidden border-b border-border"
            >
              <div className="absolute right-0 top-0 w-1/3 h-full bg-grid-pattern opacity-20 [mask-image:linear-gradient(to_left,white,transparent)] pointer-events-none"></div>

              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                    Preguntas Frecuentes
                  </h2>
                  <p className="text-base sm:text-lg text-muted">
                    Encuentra respuestas a las preguntas más comunes sobre
                    GitHub Community Day [Perú] 2026.
                  </p>
                </div>

                <div className="space-y-3">
                  {FAQ_DATA.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-surface-alt transition-colors"
                      >
                        <span className="font-bold text-foreground pr-4">
                          {faq.q}
                        </span>
                        <div
                          className={`text-muted transition-transform duration-300 ${
                            openFaq === idx ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDownIcon />
                        </div>
                      </button>
                      <div
                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                          openFaq === idx
                            ? "max-h-40 pb-5 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-muted text-sm border-t border-border pt-4">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {path === "/recursos" && (
          <>
            <section className="py-20 sm:py-32 bg-surface-alt relative overflow-hidden min-h-[70vh]">
              <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-6 text-foreground">
                    Recursos del Evento
                  </h1>
                  <p className="text-lg text-muted max-w-2xl mx-auto">
                    Descarga materiales oficiales, presentaciones y el media kit
                    de GitHub Community Day para compartir con tu comunidad.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="glass-panel bg-surface p-8 rounded-3xl group hover:border-primary/50 transition-all hover:shadow-[0_10px_40px_rgba(0,82,255,0.1)]">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3 text-foreground">
                      Media Kit Oficial
                    </h3>
                    <p className="text-muted mb-6">
                      Logos en alta resolución, banners para redes sociales y
                      paleta de colores oficial del evento.
                    </p>
                    <button className="text-primary font-bold hover:text-primary-hover flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      Descargar ZIP <ArrowRightIcon />
                    </button>
                  </div>

                  <div className="glass-panel bg-surface p-8 rounded-3xl group hover:border-accent/50 transition-all hover:shadow-[0_10px_40px_rgba(139,92,246,0.1)]">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                      <BookOpenIcon />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3 text-foreground">
                      Presentaciones
                    </h3>
                    <p className="text-muted mb-6">
                      Diapositivas y material de apoyo compartido por nuestros
                      speakers durante las charlas.
                    </p>
                    <button className="text-accent font-bold hover:text-accent flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      Ver carpeta Drive <ArrowRightIcon />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {path === "/ubicacion" && (
          <>
            <section className="py-20 sm:py-32 bg-background relative overflow-hidden min-h-[70vh]">
              <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

              <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-6 text-foreground">
                    Ubicación
                  </h1>
                  <p className="text-lg text-muted max-w-2xl mx-auto">
                    Te esperamos en el Auditorio de la UTP Sede Central. Conoce
                    cómo llegar y los accesos principales.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                  <div className="w-full lg:w-1/2 glass-panel p-2 rounded-3xl bg-surface">
                    <div className="aspect-video sm:aspect-square lg:aspect-auto lg:h-[400px] rounded-2xl overflow-hidden bg-surface-alt relative border border-border">
                      {/* Fake Map */}
                      <div className="absolute inset-0 bg-grid-pattern-small opacity-50"></div>
                      <div className="absolute inset-0 flex items-center justify-center flex-col text-primary">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                          <MapPinIcon />
                        </div>
                        <span className="font-bold text-lg">Auditorio UTP</span>
                        <span className="text-sm text-muted">
                          Av. Arequipa 265, Lima
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 space-y-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MapPinIcon />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground mb-2">
                          Dirección exacta
                        </h3>
                        <p className="text-muted">
                          Av. Arequipa 265, Cercado de Lima 15046.
                          <br />
                          Ingreso principal por la puerta 1.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M9 3v18" />
                          <path d="M15 3v18" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground mb-2">
                          Transporte Público
                        </h3>
                        <p className="text-muted">
                          Estación central del Metropolitano a 5 minutos
                          caminando. Múltiples líneas de buses por Av. Arequipa
                          y Av. Petit Thouars.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4l3 3" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground mb-2">
                          Estacionamiento
                        </h3>
                        <p className="text-muted">
                          La sede no cuenta con estacionamiento para visitantes.
                          Recomendamos usar parkings públicos cercanos o
                          servicios de taxi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {!KNOWN_ROUTES.includes(path) && (
          <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-24 bg-background">
            <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] opacity-40 z-0 pointer-events-none"></div>
            <div className="relative z-10 text-center max-w-xl">
              <p className="font-display text-7xl sm:text-8xl font-extrabold text-primary/25 mb-4">
                404
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Esta página no existe
              </h1>
              <p className="text-base sm:text-lg text-muted mb-10">
                El enlace que seguiste no lleva a ninguna sección del evento.
                Desde el inicio puedes ver el cronograma, los speakers y generar
                tu credencial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="px-6 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all shadow-md shadow-primary/20"
                >
                  Volver al inicio
                </Link>
                <Link
                  to="/faq"
                  className="px-6 py-3.5 bg-surface text-foreground font-semibold rounded-lg border border-border hover:bg-surface-alt transition-all"
                >
                  Preguntas frecuentes
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* NEW FOOTER */}
      <footer className="bg-surface py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-center md:text-left">
            <div className="lg:col-span-1 flex flex-col items-center md:items-start">
              <div className="flex items-center justify-start mb-4">
                <img
                  src={blockchainLogo}
                  alt="Blockchain Conf Logo"
                  className="h-10 sm:h-12 w-auto object-contain dark:invert transition-all"
                />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                GitHub Community Day
              </h3>
              <p className="text-sm text-muted max-w-xs mb-6">
                El evento oficial de GitHub en Perú. Conectando desarrolladores,
                código e innovación.
              </p>
              {/* TODO: reemplazar por las URLs reales de las redes del evento. */}
              <div className="flex items-center gap-4 text-muted">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="hover:text-primary transition-colors p-2 bg-surface-alt rounded-full"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">
                Explorar
              </h4>
              <ul className="space-y-3 flex flex-col items-center md:items-start">
                <li>
                  <Link
                    to="/#evento"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Evento
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#comunidades"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Comunidades
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#speakers"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Speakers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#cronograma"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Cronograma
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#credencial"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Credencial
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ubicacion"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Ubicación
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">
                Información
              </h4>
              <ul className="space-y-3 flex flex-col items-center md:items-start">
                <li>
                  <Link
                    to="/recursos"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/conducta"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Código de Conducta
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Preguntas frecuentes
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">
                Asistir
              </h4>
              <ul className="space-y-3 flex flex-col items-center md:items-start">
                <li>
                  <a
                    href={REGISTRATION_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Registrarme
                  </a>
                </li>
                <li>
                  <Link
                    to="/ubicacion"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Cómo llegar
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#cronograma"
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Horarios
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted">
              &copy; 2026 GitHub Community Day. Todos los derechos reservados.
            </p>
            <p className="text-xs text-muted">
              Desarrollado por la comunidad para la comunidad.
            </p>
          </div>
        </div>
      </footer>

      {/* CREDENCIAL OCULTA PARA LA CAPTURA A TAMAÑO REAL (1080x1350, el de la
          plantilla). Todo va en color literal a propósito: html2canvas 1.4.1 no
          sabe parsear el `oklab()` que Tailwind v4 genera para modificadores de
          opacidad tipo `bg-white/10`. */}
      <div
        className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-0"
        aria-hidden="true"
      >
        <div
          ref={credentialCaptureRef}
          className="w-[1080px] h-[1350px] relative overflow-hidden"
          style={{ backgroundColor: CREDENTIAL_BG }}
        >
          <img
            src={credentialTemplate}
            alt=""
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          />

          {/* Foto, encajada en el marco que trae la plantilla */}
          <div
            className="absolute z-10 overflow-hidden [&_svg]:w-full [&_svg]:h-full"
            style={{ ...CREDENTIAL_FRAME, borderRadius: "40px" }}
          >
            {credData.photoUrl ? (
              <img
                src={credData.photoUrl}
                crossOrigin="anonymous"
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "#dbeafe", color: "#94a3b8" }}
              >
                <div className="w-[140px] h-[140px]">
                  <UsersIcon />
                </div>
              </div>
            )}
          </div>

          {/* Nombre, en la franja libre a la derecha del marco */}
          <div
            className="absolute z-10 flex flex-col justify-center"
            style={CREDENTIAL_NAME_BOX}
          >
            <h3
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "46px",
                fontWeight: 800,
                lineHeight: 1.05,
                textTransform: "uppercase",
                overflowWrap: "break-word",
                color: "#0B1020",
              }}
            >
              {credData.name || "NOMBRES"}
            </h3>
            <h3
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "46px",
                fontWeight: 800,
                lineHeight: 1.05,
                textTransform: "uppercase",
                overflowWrap: "break-word",
                color: "#0052FF",
              }}
            >
              {credData.lastname || "APELLIDOS"}
            </h3>
            {credData.xUsername && (
              <div
                className="[&_svg]:w-full [&_svg]:h-full"
                style={{
                  marginTop: "22px",
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  maxWidth: "100%",
                  padding: "10px 20px",
                  borderRadius: "999px",
                  backgroundColor: "#E6EDFF",
                  border: "2px solid #B9CCFF",
                  color: "#0052FF",
                }}
              >
                <span
                  style={{ width: "24px", height: "24px", flexShrink: 0 }}
                >
                  <XIcon />
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    overflowWrap: "break-word",
                    minWidth: 0,
                  }}
                >
                  @{credData.xUsername}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
