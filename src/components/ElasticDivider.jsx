import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, supportsFinePointer } from '../lib/motion'

const REST_PATH = 'M 0 18 Q 500 18 1000 18'

/**
 * Architectural 1px section divider that looks identical to a hairline border at rest,
 * and subtly flexes & snaps back elastically when swept across by a desktop pointer.
 */
export default function ElasticDivider({ className = '' }) {
  const containerRef = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const pathEl = pathRef.current
    if (!container || !pathEl || !supportsFinePointer() || prefersReducedMotion()) {
      return undefined
    }

    let rect = null
    let isHovered = false
    let settleTween = null

    const handleEnter = () => {
      rect = container.getBoundingClientRect()
      isHovered = true
      if (settleTween) {
        settleTween.kill()
        settleTween = null
      }
    }

    const handleMove = (event) => {
      if (!isHovered) return
      if (!rect) rect = container.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const relX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
      const centerOffsetY = event.clientY - (rect.top + rect.height / 2)
      const pullY = Math.max(-13, Math.min(13, centerOffsetY * 1.15))

      const cx = (relX * 1000).toFixed(1)
      const cy = (18 + pullY).toFixed(1)

      gsap.to(pathEl, {
        attr: { d: `M 0 18 Q ${cx} ${cy} 1000 18` },
        duration: 0.16,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const handleLeave = () => {
      isHovered = false
      rect = null
      settleTween = gsap.to(pathEl, {
        attr: { d: REST_PATH },
        duration: 0.78,
        ease: 'elastic.out(1, 0.34)',
        overwrite: 'auto',
      })
    }

    container.addEventListener('pointerenter', handleEnter)
    container.addEventListener('pointermove', handleMove)
    container.addEventListener('pointerleave', handleLeave)

    return () => {
      container.removeEventListener('pointerenter', handleEnter)
      container.removeEventListener('pointermove', handleMove)
      container.removeEventListener('pointerleave', handleLeave)
      gsap.killTweensOf(pathEl)
      pathEl.setAttribute('d', REST_PATH)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`group/divider pointer-events-auto absolute top-0 left-0 right-0 h-9 -translate-y-1/2 select-none flex items-center z-10 ${className}`}
    >
      <svg
        viewBox="0 0 1000 36"
        preserveAspectRatio="none"
        className="w-full h-9 overflow-visible pointer-events-none"
      >
        <path
          ref={pathRef}
          d={REST_PATH}
          fill="none"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          className="stroke-zinc-200 dark:stroke-zinc-900 group-hover/divider:stroke-emerald-500/45 dark:group-hover/divider:stroke-emerald-500/40 transition-colors duration-200"
        />
      </svg>
    </div>
  )
}
