import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { runTextScramble, ScrollTrigger, supportsFinePointer } from '../lib/motion'

/**
 * Fixed-width monospace section label that decodes smoothly when entering viewport
 * and subtly re-scrambles once on hover without disturbing layout metrics.
 */
export default function ScrambleLabel({ text, className = '' }) {
  const labelRef = useRef(null)
  const cleanupScrambleRef = useRef(null)
  const lastRunTimeRef = useRef(0)

  const trigger = useCallback(
    (delay = 0) => {
      const now = performance.now()
      if (now - lastRunTimeRef.current < 480) return
      lastRunTimeRef.current = now
      cleanupScrambleRef.current?.()
      cleanupScrambleRef.current = runTextScramble(labelRef.current, text, {
        duration: 0.32,
        delay,
      })
    },
    [text]
  )

  useLayoutEffect(() => {
    const el = labelRef.current
    if (!el) return undefined

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => trigger(0.04),
    })

    return () => {
      st.kill()
      cleanupScrambleRef.current?.()
    }
  }, [trigger])

  useEffect(() => {
    return () => cleanupScrambleRef.current?.()
  }, [])

  const handleMouseEnter = () => {
    if (!supportsFinePointer()) return
    trigger(0)
  }

  return (
    <span
      ref={labelRef}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      {text}
    </span>
  )
}
