import { useEffect, useRef, useState } from 'react'

export function useCountUp({
  target,
  decimals = 2,
  duration = 900,
  start = false,
  reducedMotion = false,
}) {
  const finalText = target.toFixed(decimals)
  const [displayValue, setDisplayValue] = useState(() => (0).toFixed(decimals))
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    if (reducedMotion || hasCompletedRef.current || !start) return undefined

    let frameId = null
    let startTime = null

    const step = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased

      if (progress < 1) {
        setDisplayValue(current.toFixed(decimals))
        frameId = window.requestAnimationFrame(step)
      } else {
        hasCompletedRef.current = true
        setDisplayValue(target.toFixed(decimals))
      }
    }

    frameId = window.requestAnimationFrame(step)
    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [target, decimals, duration, start, reducedMotion])

  if (reducedMotion) return finalText
  return displayValue
}
