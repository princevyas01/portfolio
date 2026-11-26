import { useLayoutEffect, useRef, useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { educationTimeline } from '../data/experience'
import ElasticDivider from './ElasticDivider'
import ScrambleLabel from './ScrambleLabel'
import { gsap, MOTION_DURATION, MOTION_EASE, ScrollTrigger } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import AnimatedScore from './AnimatedScore'

export default function Education() {
  const sectionRef = useRef(null)
  const timelineListRef = useRef(null)
  const progressLineRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [activatedIds, setActivatedIds] = useState({})
  const [focusedEntryId, setFocusedEntryId] = useState(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        normal: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { reduceMotion: isReduced } = context.conditions
        const headerEl = sectionRef.current?.querySelector('[data-education-header]')
        const entryNodes = gsap.utils.toArray('[data-timeline-entry]', sectionRef.current)

        if (isReduced) {
          if (headerEl) gsap.set(headerEl, { clearProps: 'all' })
          if (progressLineRef.current) {
            gsap.set(progressLineRef.current, { scaleY: 1 })
          }
          entryNodes.forEach((node) => {
            const contentEl = node.querySelector('[data-timeline-content]')
            const dotEl = node.querySelector('[data-timeline-dot]')
            if (contentEl) gsap.set(contentEl, { clearProps: 'all' })
            if (dotEl) gsap.set(dotEl, { scale: 1, opacity: 1 })
          })
          return
        }

        if (headerEl) {
          gsap.fromTo(
            headerEl,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: MOTION_DURATION.section,
              ease: MOTION_EASE.reveal,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 84%',
                once: true,
              },
            }
          )
        }

        // Signature scroll-linked progress line tied directly to scroll position
        if (progressLineRef.current && timelineListRef.current) {
          gsap.fromTo(
            progressLineRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timelineListRef.current,
                start: 'top 74%',
                end: 'bottom 72%',
                scrub: 0.3,
              },
            }
          )
        }

        // Per-entry milestone marker activation + content reveal + score odometer trigger
        entryNodes.forEach((node) => {
          const entryId = node.getAttribute('data-timeline-entry')
          const dotEl = node.querySelector('[data-timeline-dot]')
          const contentEl = node.querySelector('[data-timeline-content]')

          if (dotEl) {
            gsap.set(dotEl, { opacity: 0, scale: 0.5 })
          }
          if (contentEl) {
            gsap.set(contentEl, { opacity: 0, y: 10 })
          }

          ScrollTrigger.create({
            trigger: node,
            start: 'top 84%',
            once: true,
            onEnter: () => {
              if (entryId) {
                setActivatedIds((prev) => (prev[entryId] ? prev : { ...prev, [entryId]: true }))
              }
              if (dotEl) {
                gsap.to(dotEl, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.28,
                  ease: MOTION_EASE.ui,
                })
              }
              if (contentEl) {
                gsap.to(contentEl, {
                  opacity: 1,
                  y: 0,
                  duration: MOTION_DURATION.timelineEntry,
                  ease: MOTION_EASE.reveal,
                  clearProps: 'transform,opacity',
                })
              }
            },
          })
        })
      },
      sectionRef
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 max-w-6xl mx-auto"
    >
      <ElasticDivider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div data-education-header className="lg:col-span-4 space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <ScrambleLabel text="[ Education History ]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Academic Timeline.
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-xs">
            Chronological academic progression, institutions, and verified academic scores.
          </p>
        </div>

        {/* Right Column: Interactive Vertical Timeline */}
        <div ref={timelineListRef} className="lg:col-span-8 relative pl-7 sm:pl-9 ml-1.5">
          {/* Base Track */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-800/90"
          />
          {/* Scroll-Linked Emerald Accent Progress Line */}
          <div
            ref={progressLineRef}
            aria-hidden="true"
            className="timeline-progress-line absolute left-0 -translate-x-[0.25px] top-2 bottom-2 w-[1.5px] bg-emerald-600/80 dark:bg-emerald-500/80"
          />

          <ol className="space-y-9">
            {educationTimeline.map((entry) => {
              const isEntryActive = reducedMotion || Boolean(activatedIds[entry.id])
              const isMilestoneFocused = focusedEntryId === entry.id
              const verifiedSemesters = (entry.semesters || []).filter(
                (sem) => sem.verified && typeof sem.sgpa === 'number'
              )

              return (
                <li
                  key={entry.id}
                  data-timeline-entry={entry.id}
                  tabIndex={0}
                  onMouseEnter={() => setFocusedEntryId(entry.id)}
                  onMouseLeave={() =>
                    setFocusedEntryId((prev) => (prev === entry.id ? null : prev))
                  }
                  onFocus={() => setFocusedEntryId(entry.id)}
                  onBlur={() =>
                    setFocusedEntryId((prev) => (prev === entry.id ? null : prev))
                  }
                  className="relative group rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/70"
                >
                  {/* Interactive Timeline Node */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[34px] sm:-left-[42px] top-1.5 w-3.5 h-3.5 rounded-full border transition-[border-color,transform,box-shadow] duration-200 flex items-center justify-center bg-zinc-50 dark:bg-black ${
                      isMilestoneFocused
                        ? 'border-emerald-500 scale-110 ring-4 ring-emerald-500/15'
                        : isEntryActive
                        ? 'border-zinc-900 dark:border-white'
                        : 'border-zinc-300 dark:border-zinc-800'
                    }`}
                  >
                    <span
                      data-timeline-dot
                      className={`w-1.5 h-1.5 rounded-full transition-transform duration-200 ${
                        isMilestoneFocused
                          ? 'bg-emerald-500 scale-125'
                          : isEntryActive
                          ? 'bg-emerald-500'
                          : 'bg-zinc-400'
                      }`}
                    />
                  </span>

                  {/* Subtle Left Accent Rail on Hover / Keyboard Focus */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-3.5 sm:-left-4 top-1.5 bottom-1.5 w-[2px] rounded-full bg-emerald-500/75 origin-top transition-[transform,opacity] duration-200 ease-out ${
                      isMilestoneFocused ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
                    }`}
                  />

                  <div data-timeline-content className="space-y-3">
                    {/* Degree & Period Header */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4">
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white tracking-tight">
                        {entry.degree}
                      </h3>
                      <span
                        className={`text-xs font-mono whitespace-nowrap shrink-0 transition-colors duration-150 ${
                          isMilestoneFocused
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {entry.period}
                      </span>
                    </div>

                    {/* Institution */}
                    <div
                      className={`text-xs font-mono transition-colors duration-150 ${
                        isMilestoneFocused
                          ? 'text-zinc-900 dark:text-zinc-200'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {entry.institution}
                    </div>

                    {/* Concise Summary */}
                    <p
                      className={`text-sm font-light leading-relaxed max-w-2xl transition-colors duration-150 ${
                        isMilestoneFocused
                          ? 'text-zinc-800 dark:text-zinc-300'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {entry.summary}
                    </p>

                    {/* Verified Odometer Scores Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-lg">
                      {entry.scores.map((score) => (
                        <AnimatedScore
                          key={score.id}
                          label={score.label}
                          value={score.value}
                          decimals={score.decimals}
                          suffix={score.suffix}
                          scale={score.scale}
                          duration={880}
                          isActive={isEntryActive}
                          isEmphasized={isMilestoneFocused}
                        />
                      ))}
                    </div>

                    {/* Verified Semester SGPA Records (rendered only when verified records exist) */}
                    {verifiedSemesters.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          Verified Semester SGPA
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg">
                          {verifiedSemesters.map((sem) => (
                            <AnimatedScore
                              key={sem.semester}
                              label={sem.semester}
                              value={sem.sgpa}
                              decimals={2}
                              scale={`/ ${sem.scale || 10}`}
                              duration={850}
                              isActive={isEntryActive}
                              isEmphasized={isMilestoneFocused}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
