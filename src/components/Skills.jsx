import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Code, Layers, Database, Cpu, Compass } from 'lucide-react'
import { skillCategories, exploringSkills } from '../data/skills'
import ElasticDivider from './ElasticDivider'
import ScrambleLabel from './ScrambleLabel'
import { attachSpotlight, gsap, MOTION_DURATION, MOTION_EASE, prefersReducedMotion } from '../lib/motion'

const categoryIcons = {
  programming: Code,
  development: Layers,
  databases: Database,
  'applied-ai': Cpu,
}

const WEB3_EDGES = [
  { id: 'e1', x1: 14, y1: 26, x2: 38, y2: 11 },
  { id: 'e2', x1: 38, y1: 11, x2: 68, y2: 18 },
  { id: 'e3', x1: 38, y1: 11, x2: 52, y2: 31 },
  { id: 'e4', x1: 14, y1: 26, x2: 52, y2: 31 },
  { id: 'e5', x1: 52, y1: 31, x2: 92, y2: 20 },
  { id: 'e6', x1: 68, y1: 18, x2: 92, y2: 20 },
]

const WEB3_NODES = [
  { id: 'n1', cx: 14, cy: 26, accent: false },
  { id: 'n2', cx: 38, cy: 11, accent: true },
  { id: 'n3', cx: 52, cy: 31, accent: false },
  { id: 'n4', cx: 68, cy: 18, accent: false },
  { id: 'n5', cx: 92, cy: 20, accent: true },
]

export default function Skills() {
  const sectionRef = useRef(null)
  const web3SvgRef = useRef(null)
  const [web3Hovered, setWeb3Hovered] = useState(false)

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(
      '[data-skill-category], [data-skill-exploring]'
    )
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
          gsap.set('[data-skills-header], [data-skill-category], [data-skill-exploring]', {
            clearProps: 'all',
          })
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
          '[data-skills-header]',
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION_DURATION.section,
            ease: MOTION_EASE.reveal,
            clearProps: 'transform,opacity',
          },
          0
        )

        tl.fromTo(
          '[data-skill-category]',
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.46,
            stagger: 0.075,
            ease: MOTION_EASE.ui,
            clearProps: 'transform,opacity',
          },
          0.12
        )

        tl.fromTo(
          '[data-skill-exploring]',
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.44,
            ease: MOTION_EASE.ui,
            clearProps: 'transform,opacity',
          },
          0.32
        )
      },
      sectionRef
    )

    return () => mm.revert()
  }, [])

  // Pre-configure stroke-dasharray on the subtle Web3 node illustration
  useLayoutEffect(() => {
    const svgEl = web3SvgRef.current
    if (!svgEl) return undefined

    const lines = svgEl.querySelectorAll('[data-web3-edge]')
    lines.forEach((line) => {
      const length = typeof line.getTotalLength === 'function' ? line.getTotalLength() : 40
      line.setAttribute('stroke-dasharray', String(length))
      line.setAttribute('stroke-dashoffset', '0')
    })

    return undefined
  }, [])

  const triggerWeb3Interaction = useCallback(() => {
    setWeb3Hovered(true)
    const svgEl = web3SvgRef.current
    if (!svgEl || prefersReducedMotion()) return

    const lines = svgEl.querySelectorAll('[data-web3-edge]')
    const nodes = svgEl.querySelectorAll('[data-web3-node]')

    gsap.killTweensOf([lines, nodes])

    lines.forEach((line, idx) => {
      const length = typeof line.getTotalLength === 'function' ? line.getTotalLength() : 40
      gsap.fromTo(
        line,
        { strokeDashoffset: length, opacity: 0.25 },
        {
          strokeDashoffset: 0,
          opacity: 0.95,
          duration: 0.42,
          delay: idx * 0.045,
          ease: MOTION_EASE.ui,
        }
      )
    })

    gsap.fromTo(
      nodes,
      { scale: 0.9 },
      {
        scale: 1.15,
        duration: 0.2,
        stagger: 0.045,
        ease: MOTION_EASE.ui,
        transformOrigin: 'center center',
        onComplete: () => {
          gsap.to(nodes, {
            scale: 1,
            duration: 0.26,
            ease: MOTION_EASE.reveal,
            transformOrigin: 'center center',
          })
        },
      }
    )
  }, [])

  const resetWeb3Interaction = useCallback(() => {
    setWeb3Hovered(false)
    const svgEl = web3SvgRef.current
    if (!svgEl || prefersReducedMotion()) return

    const lines = svgEl.querySelectorAll('[data-web3-edge]')
    gsap.to(lines, {
      opacity: 0.5,
      duration: 0.24,
      ease: MOTION_EASE.ui,
    })
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 max-w-6xl mx-auto"
    >
      <ElasticDivider />
      <div className="space-y-12">
        {/* Section Heading */}
        <div data-skills-header className="space-y-4 max-w-xl">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            <ScrambleLabel text="[ Technical Toolkit ]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Skills &amp; Technical Stack.
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            Languages, frameworks, local databases, and AI tooling used across shipped applications and engineering prototypes.
          </p>
        </div>

        {/* Core Skill Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillCategories.map((category) => {
            const Icon = categoryIcons[category.id] || Code
            return (
              <div
                key={category.id}
                data-skill-category
                className="spotlight-card p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/30 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors duration-150 flex flex-col"
              >
                <div className="flex items-center gap-2.5 border-b border-zinc-200/80 dark:border-zinc-900 pb-3 mb-4">
                  <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <h3 className="text-xs font-mono text-zinc-900 dark:text-white tracking-wider uppercase font-medium">
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-mono rounded border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Separate Exploring Subsection with Subtle Interactive Web3 Node Diagram */}
        <div
          data-skill-exploring
          tabIndex={0}
          onMouseEnter={triggerWeb3Interaction}
          onMouseLeave={resetWeb3Interaction}
          onFocus={triggerWeb3Interaction}
          onBlur={resetWeb3Interaction}
          className={`spotlight-card p-5 rounded-lg border transition-colors duration-200 outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/70 bg-zinc-100/60 dark:bg-zinc-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            web3Hovered
              ? 'border-zinc-300 dark:border-zinc-700'
              : 'border-zinc-200 dark:border-zinc-900'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <Compass className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <h3 className="text-xs font-mono text-zinc-900 dark:text-white uppercase tracking-wider font-medium">
                {exploringSkills.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light">
              {exploringSkills.note}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            {/* Minimal conceptual Web3 node illustration (hover / focus triggered) */}
            <svg
              ref={web3SvgRef}
              viewBox="0 0 106 40"
              aria-hidden="true"
              className="w-[96px] h-9 shrink-0 overflow-visible"
            >
              {WEB3_EDGES.map((edge) => (
                <line
                  key={edge.id}
                  data-web3-edge
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  strokeWidth="1.2"
                  className={`transition-colors duration-200 ${
                    web3Hovered
                      ? 'stroke-emerald-500/75 dark:stroke-emerald-400/75'
                      : 'stroke-zinc-300 dark:stroke-zinc-700'
                  }`}
                />
              ))}
              {WEB3_NODES.map((node) => (
                <circle
                  key={node.id}
                  data-web3-node
                  cx={node.cx}
                  cy={node.cy}
                  r={node.accent ? 3 : 2.2}
                  className={
                    node.accent
                      ? 'fill-emerald-500 dark:fill-emerald-400'
                      : 'fill-zinc-400 dark:fill-zinc-500'
                  }
                />
              ))}
            </svg>

            <div className="flex flex-wrap gap-2">
              {exploringSkills.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 text-xs font-mono rounded border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
