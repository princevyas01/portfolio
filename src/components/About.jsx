import { useEffect, useLayoutEffect, useRef } from 'react'
import { Code2, Compass, Cpu, MapPin } from 'lucide-react'
import { profile } from '../data/profile'
import ElasticDivider from './ElasticDivider'
import ScrambleLabel from './ScrambleLabel'
import { attachSpotlight, gsap, MOTION_DURATION, MOTION_EASE } from '../lib/motion'

const highlightIcons = [Cpu, Compass, Code2, MapPin]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('[data-about-highlight]')
    if (!cards?.length) return undefined
    const cleanups = Array.from(cards, (card) => attachSpotlight(card))
    return () => cleanups.forEach((fn) => fn())
  }, [])

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        normal: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { reduceMotion } = context.conditions

        if (reduceMotion) {
          gsap.set(
            '[data-about-label], [data-about-heading], [data-about-paragraph], [data-about-meta], [data-about-highlight], [data-about-interests]',
            { clearProps: 'all' }
          )
          return
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        })

        tl.fromTo(
          '[data-about-label]',
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: MOTION_EASE.ui,
            clearProps: 'transform,opacity',
          },
          0
        )

        tl.fromTo(
          '[data-about-heading]',
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION_DURATION.section,
            ease: MOTION_EASE.reveal,
            clearProps: 'transform,opacity',
          },
          0.05
        )

        // Differentiated: natural opacity transition for body paragraphs
        tl.fromTo(
          '[data-about-paragraph]',
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.56,
            stagger: 0.08,
            ease: MOTION_EASE.gentle,
            clearProps: 'opacity',
          },
          0.16
        )

        tl.fromTo(
          '[data-about-meta]',
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.44,
            ease: MOTION_EASE.ui,
            clearProps: 'transform,opacity',
          },
          0.26
        )

        tl.fromTo(
          '[data-about-highlight]',
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.055,
            ease: MOTION_EASE.ui,
            clearProps: 'transform,opacity',
          },
          0.18
        )

        tl.fromTo(
          '[data-about-interests]',
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: MOTION_EASE.ui,
            clearProps: 'transform,opacity',
          },
          0.34
        )
      },
      sectionRef
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 max-w-6xl mx-auto"
    >
      <ElasticDivider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div
              data-about-label
              className="font-mono text-xs uppercase tracking-widest text-zinc-500"
            >
              <ScrambleLabel text="[ About Me ]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight overflow-hidden pb-1 -mb-1">
              <span data-about-heading className="block">
                {profile.about.heading}
              </span>
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              {profile.about.paragraphs.map((paragraph) => (
                <p key={paragraph} data-about-paragraph>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Languages & Strengths */}
          <div
            data-about-meta
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-zinc-200 dark:border-zinc-900"
          >
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                [ Languages ]
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.about.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 text-xs font-mono"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {lang.name}
                    </span>
                    <span className="text-[10px] text-zinc-500">({lang.level})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                [ Strengths ]
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.about.strengths.map((strength) => (
                  <div
                    key={strength}
                    className="flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 text-xs text-zinc-800 dark:text-zinc-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-mono text-[11px]">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-10">
          <div className="space-y-3.5">
            <h3
              data-about-label
              className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest"
            >
              [ Focus &amp; Direction ]
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.about.highlights.map((item, index) => {
                const Icon = highlightIcons[index] || Cpu
                return (
                  <div
                    key={item.label}
                    data-about-highlight
                    className="spotlight-card flex items-start gap-3.5 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/30 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors duration-150 group"
                  >
                    <div className="p-2.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-white group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-150 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-zinc-950 dark:text-white font-mono leading-snug">
                        {item.value}
                      </span>
                      <span className="block text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wider">
                        {item.label}
                      </span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div data-about-interests className="space-y-3.5">
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              [ Technical Interests ]
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.about.interests.map((interest) => {
                const isWeb3 = interest.toLowerCase().includes('web3')
                return (
                  <span
                    key={interest}
                    className={`group/interest inline-flex items-center gap-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3 py-1.5 rounded transition-colors duration-150 ${
                      isWeb3
                        ? 'hover:border-emerald-500/45 dark:hover:border-emerald-500/45'
                        : 'hover:border-zinc-300 dark:hover:border-zinc-800'
                    }`}
                  >
                    {isWeb3 && (
                      <svg
                        viewBox="0 0 18 14"
                        aria-hidden="true"
                        className="w-4 h-3.5 shrink-0 text-zinc-400 dark:text-zinc-600 group-hover/interest:text-emerald-500 transition-colors duration-200"
                      >
                        <line x1="3" y1="10" x2="9" y2="3" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="9" y1="3" x2="15" y2="10" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="3" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.65" />
                        <circle cx="3" cy="10" r="1.7" fill="currentColor" />
                        <circle cx="9" cy="3" r="1.9" className="fill-emerald-500" />
                        <circle cx="15" cy="10" r="1.7" fill="currentColor" />
                      </svg>
                    )}
                    <span>{interest}</span>
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
