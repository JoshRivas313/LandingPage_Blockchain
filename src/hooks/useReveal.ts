import { useEffect } from "react"

/**
 * Revela los elementos marcados con `data-reveal` cuando entran en pantalla.
 *
 * Un único IntersectionObserver para todos, y cada elemento deja de observarse
 * en cuanto se revela: la animación ocurre una sola vez y el coste desaparece
 * al terminar el scroll. Nada de listeners de scroll ni de medir posiciones en
 * cada frame.
 *
 * Los hermanos que comparten `data-stagger` entran escalonados: a cada uno se
 * le pone `--i` con su posición, y el CSS lo convierte en retardo.
 *
 * Si el navegador no soporta IntersectionObserver, o la persona pidió menos
 * movimiento, todo queda visible de entrada.
 */
export function useReveal(): void {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-shown", ""))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement

          // El escalonado se calcula al revelar, contando solo los hermanos
          // que aún no han entrado: así el primero visible siempre abre.
          if (el.dataset.stagger !== undefined && el.parentElement) {
            const pending = [...el.parentElement.children].filter(
              (sib) => sib instanceof HTMLElement && !sib.hasAttribute("data-shown"),
            )
            const index = pending.indexOf(el)
            if (index > 0) el.style.setProperty("--i", String(Math.min(index, 6)))
          }

          el.setAttribute("data-shown", "")
          observer.unobserve(el)
        }
      },
      // Se dispara un poco antes de que asome, para que llegue ya animándose.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
