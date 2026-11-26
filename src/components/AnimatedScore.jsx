import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'

export default function AnimatedScore({
  value,
  decimals = 2,
  suffix = '',
  scale = '',
  label,
  duration = 900,
}) {
  const [ref, isInView] = useInView({ threshold: 0.2, once: true })
  const reducedMotion = useReducedMotion()
  const formattedValue = useCountUp({
    target: value,
    decimals,
    duration,
    start: isInView,
    reducedMotion,
  })

  const finalAccessibleText = `${label}: ${value.toFixed(decimals)}${suffix}${scale ? ` ${scale}` : ''}`

  return (
    <div
      ref={ref}
      className="flex flex-col justify-between px-3.5 py-2.5 rounded-md border border-zinc-200 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-950/60"
    >
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="sr-only">{finalAccessibleText}</span>
        <span
          aria-hidden="true"
          className="text-lg sm:text-xl font-bold font-mono tabular-nums tracking-tight text-zinc-950 dark:text-white"
        >
          {formattedValue}
          {suffix}
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
