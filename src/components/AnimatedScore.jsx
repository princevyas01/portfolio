import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, MOTION_EASE } from '../lib/motion'

// 11 rows ending on 0 so trailing zeros (e.g. 88.20) roll cleanly without stopping static at row 0
const REEL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

export default function AnimatedScore({
  value,
  decimals = 2,
  suffix = '',
  scale = '',
  label,
  duration = 880,
  isActive = true,
  isEmphasized = false,
}) {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef(null)
  const hasCompletedRef = useRef(false)

  const formattedText = value.toFixed(decimals)
  const finalAccessibleText = `${label}: ${formattedText}${suffix}${scale ? ` ${scale}` : ''}`
  const chars = formattedText.split('')

  useLayoutEffect(() => {
    if (reducedMotion || !isActive) return undefined

    const containerEl = containerRef.current
    if (!containerEl) return undefined

    const reels = containerEl.querySelectorAll('[data-odometer-reel]')
    if (!reels.length) return undefined

    const ctx = gsap.context(() => {
      reels.forEach((reelEl, idx) => {
        const stopIndex = Number(reelEl.getAttribute('data-stop-index') || '0')
        const targetPercent = -(stopIndex * 100) / REEL_DIGITS.length

        if (hasCompletedRef.current) {
          gsap.set(reelEl, { yPercent: targetPercent })
          return
        }

        gsap.fromTo(
          reelEl,
          { yPercent: 0 },
          {
            yPercent: targetPercent,
            duration: duration / 1000,
            delay: idx * 0.055,
            ease: MOTION_EASE.count,
            overwrite: 'auto',
            onComplete:
              idx === reels.length - 1
                ? () => {
                    hasCompletedRef.current = true
                  }
                : undefined,
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isActive, reducedMotion, duration])

  return (
    <div
      ref={containerRef}
      className={`flex flex-col justify-between px-3.5 py-2.5 rounded-md border transition-[border-color,background-color] duration-200 ${
        isEmphasized
          ? 'border-emerald-500/45 dark:border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/15'
          : 'border-zinc-200 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-950/60'
      }`}
    >
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="sr-only">{finalAccessibleText}</span>

        <span
          aria-hidden="true"
          className="inline-flex items-baseline text-lg sm:text-xl font-bold font-mono tabular-nums tracking-tight text-zinc-950 dark:text-white"
        >
          {reducedMotion ? (
            <span>{formattedText}</span>
          ) : (
            chars.map((char, charIdx) => {
              const isDigit = char >= '0' && char <= '9'
              if (!isDigit) {
                return (
                  <span key={`sep-${charIdx}`} className="inline-block">
                    {char}
                  </span>
                )
              }

              const numericDigit = Number(char)
              const stopIndex = numericDigit === 0 ? 10 : numericDigit

              return (
                <span
                  key={`digit-${charIdx}`}
                  className="inline-block relative h-[1.2em] overflow-hidden align-baseline"
                >
                  <span
                    data-odometer-reel
                    data-stop-index={stopIndex}
                    className="flex flex-col will-change-transform"
                  >
                    {REEL_DIGITS.map((digitChar, rowIdx) => (
                      <span
                        key={rowIdx}
                        className="h-[1.2em] leading-[1.2em] flex items-center justify-center shrink-0"
                      >
                        {digitChar}
                      </span>
                    ))}
                  </span>
                </span>
              )
            })
          )}
          {suffix && <span className="inline-block">{suffix}</span>}
        </span>

        {scale && (
          <span
            aria-hidden="true"
            className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400"
          >
            {scale}
          </span>
        )}
      </div>
    </div>
  )
}
