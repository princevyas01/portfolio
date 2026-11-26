import { useEffect, useRef } from 'react'
import { prefersReducedMotion, supportsFinePointer } from '../lib/motion'

/**
 * Architectural dot-matrix background field inside the Hero.
 * Pauses its rAF loop automatically when settled or scrolled out of view.
 */
export default function InteractiveDotField({ theme = 'dark' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !supportsFinePointer() || prefersReducedMotion()) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let rafId = null
    let isHeroVisible = true
    let width = 0
    let height = 0
    let dpr = 1

    const target = { x: -9999, y: -9999 }
    const current = { x: -9999, y: -9999 }
    let hasPointer = false

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawFrame(true)
    }

    const drawFrame = (forceStatic = false) => {
      if (!width || !height) return

      ctx.clearRect(0, 0, width, height)

      const isDark = theme === 'dark'
      const spacing = 34
      const radiusOfInfluence = 148
      const baseAlpha = isDark ? 0.085 : 0.11

      // Smooth pointer interpolation when active
      if (!forceStatic && hasPointer) {
        current.x += (target.x - current.x) * 0.18
        current.y += (target.y - current.y) * 0.18
      } else if (!hasPointer) {
        current.x += (target.x - current.x) * 0.15
        current.y += (target.y - current.y) * 0.15
      }

      const startX = (width % spacing) / 2 + spacing / 2
      const startY = (height % spacing) / 2 + spacing / 2

      for (let gx = startX; gx < width - 12; gx += spacing) {
        for (let gy = startY; gy < height - 12; gy += spacing) {
          let drawX = gx
          let drawY = gy
          let dotR = 1.05
          let alpha = baseAlpha
          let emeraldMix = 0

          if (current.x > -500 && current.y > -500) {
            const dx = current.x - gx
            const dy = current.y - gy
            const distSq = dx * dx + dy * dy
            if (distSq < radiusOfInfluence * radiusOfInfluence) {
              const dist = Math.sqrt(distSq)
              const t = 1 - dist / radiusOfInfluence
              const smoothT = t * t * (3 - 2 * t)
              // Subtle outward ripple away from pointer center for breathing clarity
              const pull = smoothT * 3.5
              const invDist = dist > 0.001 ? 1 / dist : 0
              drawX -= dx * invDist * pull
              drawY -= dy * invDist * pull
              dotR = 1.05 + smoothT * 1.45
              alpha = baseAlpha + smoothT * (isDark ? 0.42 : 0.48)
              emeraldMix = smoothT
            }
          }

          if (emeraldMix > 0.2) {
            ctx.fillStyle = isDark
              ? `rgba(16, 185, 129, ${(alpha * emeraldMix * 0.85).toFixed(3)})`
              : `rgba(5, 150, 105, ${(alpha * emeraldMix * 0.8).toFixed(3)})`
          } else {
            ctx.fillStyle = isDark
              ? `rgba(161, 161, 170, ${alpha.toFixed(3)})`
              : `rgba(82, 82, 91, ${alpha.toFixed(3)})`
          }

          ctx.beginPath()
          ctx.arc(drawX, drawY, dotR, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const scheduleTick = () => {
      if (rafId !== null || !isHeroVisible) return
      rafId = window.requestAnimationFrame(tick)
    }

    const tick = () => {
      rafId = null
      if (!isHeroVisible) return

      drawFrame(false)

      const settled =
        Math.abs(target.x - current.x) < 0.25 && Math.abs(target.y - current.y) < 0.25
      if (!settled) {
        rafId = window.requestAnimationFrame(tick)
      }
    }

    const parentSection = canvas.parentElement
    const handlePointerMove = (event) => {
      if (!parentSection) return
      const rect = canvas.getBoundingClientRect()
      if (event.clientY < rect.top || event.clientY > rect.bottom) {
        if (hasPointer) {
          hasPointer = false
          target.x = -9999
          target.y = -9999
          scheduleTick()
        }
        return
      }
      hasPointer = true
      target.x = event.clientX - rect.left
      target.y = event.clientY - rect.top
      if (current.x < -500) {
        current.x = target.x
        current.y = target.y
      }
      scheduleTick()
    }

    const handlePointerLeave = () => {
      hasPointer = false
      target.x = -9999
      target.y = -9999
      scheduleTick()
    }

    let io = null
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          isHeroVisible = Boolean(entries[0]?.isIntersecting)
          if (isHeroVisible) {
            drawFrame(true)
          } else if (rafId !== null) {
            window.cancelAnimationFrame(rafId)
            rafId = null
          }
        },
        { threshold: 0.05 }
      )
      if (parentSection) io.observe(parentSection)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeave)

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      if (io) io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseleave', handlePointerLeave)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none hidden md:block absolute inset-x-0 top-14 bottom-4 w-full h-[calc(100%-4.5rem)] [mask-image:radial-gradient(ellipse_78%_72%_at_52%_48%,#000_42%,transparent_100%)]"
    />
  )
}
