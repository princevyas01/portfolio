import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useInView({ threshold = 0.08, rootMargin = '0px 0px -24px 0px', once = true } = {}) {
  const ref = useRef(null)
  const reducedMotion = useReducedMotion()
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (reducedMotion) return undefined

    const element = ref.current
    if (!element) return undefined

    let frameId = null

    if (typeof IntersectionObserver === 'undefined') {
      frameId = window.requestAnimationFrame(() => setIsInView(true))
      return () => window.cancelAnimationFrame(frameId)
    }

    // If the user jumped past this element (e.g. via hash navigation), reveal it smoothly
    const rect = element.getBoundingClientRect()
    if (rect.top <= window.innerHeight * 0.96) {
      frameId = window.requestAnimationFrame(() => setIsInView(true))
      if (once) {
        return () => window.cancelAnimationFrame(frameId)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true)
            if (once) {
              observer.disconnect()
              break
            }
          } else if (!once) {
            setIsInView(false)
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [threshold, rootMargin, once, reducedMotion])

  return [ref, reducedMotion || isInView]
}
