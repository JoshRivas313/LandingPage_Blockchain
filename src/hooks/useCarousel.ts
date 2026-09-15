import { useCallback, useEffect, useRef, useState } from "react"

const TABLET_MQ = "(max-width: 980px)"
const MOBILE_MQ = "(max-width: 620px)"
const REDUCED_MQ = "(prefers-reduced-motion: reduce)"

const AUTOPLAY_MS = 3500
const RESUME_MS = 1500
const SWIPE_PX = 40

/** 1 tarjeta en movil, 2 en tablet, 3 en escritorio. */
function readVisibleCount(): number {
  if (typeof window === "undefined") return 3
  if (window.matchMedia(MOBILE_MQ).matches) return 1
  if (window.matchMedia(TABLET_MQ).matches) return 2
  return 3
}

interface CarouselApi {
  index: number
  visibleCount: number
  atStart: boolean
  atEnd: boolean
  next: () => void
  prev: () => void
  handlers: {
    onKeyDown: (e: React.KeyboardEvent) => void
    onTouchStart: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
}

/**
 * Carrusel de speakers. Reemplaza la logica que vivia suelta en el componente
 * unico de la pagina; el comportamiento es el mismo:
 *
 *  - avance de 1 tarjeta cada 3.5 s, volviendo al inicio al llegar al final
 *  - flechas que se desactivan en los extremos
 *  - swipe tactil, flechas de teclado
 *  - pausa al interactuar y reanudacion 1.5 s despues
 *  - sin autoplay con prefers-reduced-motion
 *
 * Lo que cambia: visibleCount se lee de forma sincrona en el primer render. El
 * original arrancaba siempre en 3 y lo corregia en componentDidMount, asi que
 * en movil se veian 3 tarjetas comprimidas durante un frame antes de saltar a 1.
 */
export function useCarousel(total: number): CarouselApi {
  const [visibleCount, setVisibleCount] = useState(readVisibleCount)
  const [index, setIndex] = useState(0)

  const autoplayRef = useRef<number | undefined>(undefined)
  const resumeRef = useRef<number | undefined>(undefined)
  const touchXRef = useRef<number | null>(null)

  const maxIndex = Math.max(0, total - visibleCount)

  const stop = useCallback(() => {
    window.clearInterval(autoplayRef.current)
    autoplayRef.current = undefined
  }, [])

  const start = useCallback(() => {
    stop()
    if (window.matchMedia(REDUCED_MQ).matches) return
    autoplayRef.current = window.setInterval(() => {
      setIndex((i) => (i >= Math.max(0, total - readVisibleCount()) ? 0 : i + 1))
    }, AUTOPLAY_MS)
  }, [stop, total])

  const pause = useCallback(() => {
    stop()
    window.clearTimeout(resumeRef.current)
  }, [stop])

  const scheduleResume = useCallback(() => {
    window.clearTimeout(resumeRef.current)
    resumeRef.current = window.setTimeout(start, RESUME_MS)
  }, [start])

  // Un unico efecto para el ciclo de vida del autoplay y los listeners.
  useEffect(() => {
    start()

    const tablet = window.matchMedia(TABLET_MQ)
    const mobile = window.matchMedia(MOBILE_MQ)
    const sync = () => setVisibleCount(readVisibleCount())

    tablet.addEventListener("change", sync)
    mobile.addEventListener("change", sync)

    return () => {
      stop()
      window.clearTimeout(resumeRef.current)
      tablet.removeEventListener("change", sync)
      mobile.removeEventListener("change", sync)
    }
  }, [start, stop])

  // Al pasar de 1 a 3 tarjetas el indice puede quedar fuera de rango.
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const prev = useCallback(() => {
    pause()
    setIndex((i) => Math.max(0, i - 1))
    scheduleResume()
  }, [pause, scheduleResume])

  const next = useCallback(() => {
    pause()
    setIndex((i) => Math.min(maxIndex, i + 1))
    scheduleResume()
  }, [maxIndex, pause, scheduleResume])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        next()
      }
    },
    [next, prev],
  )

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchXRef.current = e.touches[0].clientX
      pause()
    },
    [pause],
  )

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const startX = touchXRef.current
      touchXRef.current = null
      if (startX === null) {
        scheduleResume()
        return
      }
      const dx = e.changedTouches[0].clientX - startX
      if (dx > SWIPE_PX) prev()
      else if (dx < -SWIPE_PX) next()
      else scheduleResume()
    },
    [next, prev, scheduleResume],
  )

  return {
    index,
    visibleCount,
    atStart: index === 0,
    atEnd: index >= maxIndex,
    next,
    prev,
    handlers: {
      onKeyDown,
      onTouchStart,
      onTouchEnd,
      onMouseEnter: pause,
      onMouseLeave: scheduleResume,
    },
  }
}
