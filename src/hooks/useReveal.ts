import { useEffect } from "react"

/**
 * Hace aparecer los elementos marcados con `data-reveal` cuando entran en
 * pantalla.
 *
 * Un único IntersectionObserver para todos, y cada elemento deja de observarse
 * en cuanto se revela: el coste desaparece al terminar el scroll. Nada de
 * listeners de scroll ni de medir posiciones en cada frame.
 *
 * Si el navegador no soporta IntersectionObserver, o la persona pidió menos
 * movimiento, todo queda visible de entrada.
 */
export function useReveal(): void {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-reveal", "shown"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute("data-reveal", "shown")
          observer.unobserve(entry.target)
        }
      },
      // Se dispara un poco antes de que asome, para que llegue ya animándose.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
