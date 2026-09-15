import { useEffect, useState } from "react"

/**
 * Indica si la página ya no está arriba del todo, para densificar el navbar.
 *
 * Usa un centinela de 1px al principio del documento en lugar de un listener
 * de scroll: el navegador avisa solo cuando cruza el borde, sin ejecutar nada
 * en cada frame mientras se hace scroll.
 */
export function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sentinel = document.createElement("div")
    sentinel.setAttribute("aria-hidden", "true")
    sentinel.style.cssText = "position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none"
    document.body.prepend(sentinel)

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [])

  return scrolled
}
