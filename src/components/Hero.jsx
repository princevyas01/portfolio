import { useEffect, useLayoutEffect, useRef } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import { profile } from '../data/profile'
import profilePhoto from '../assets/profile.webp'
import InteractiveDotField from './InteractiveDotField'
import ScrambleLabel from './ScrambleLabel'
import {
  attachMagnetic,
  attachPointerParallax,
  gsap,
  MOTION_DURATION,
  MOTION_EASE,
} from '../lib/motion'

const socialLinks = [
  { name: 'GitHub', url: profile.githubUrl, icon: GithubIcon, external: true },
  { name: 'LinkedIn', url: profile.linkedinUrl, icon: LinkedinIcon, external: true },
  { name: 'Email', url: `mailto:${profile.email}`, icon: Mail, external: false },
]

export default function Hero({ onNavigate, theme = 'dark' }) {
  const heroRef = useRef(null)
  const photoFrameRef = useRef(null)
  const photoImgRef = useRef(null)
  const primaryCtaRef = useRef(null)
  const secondaryCtaRef = useRef(null)
  const socialLinkRefs = useRef([])

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        desktop: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
        mobile: '(prefers-reduced-motion: no-preference) and (max-width: 767px)',
      },
      (context) => {
        const { reduceMotion, mobile } = context.conditions

        if (reduceMotion) {
          gsap.set(
            '[data-hero-badge], [data-hero-line], [data-hero-intro], [data-hero-actions], [data-hero-photo-frame], [data-hero-photo-img], [data-hero-connect], [data-hero-social]',
            { clearProps: 'all' }
          )
          return
        }

        const lineDistance = mobile ? 16 : 22
        const tl = gsap.timeline({
          defaults: { ease: MOTION_EASE.reveal },
        })

        // 1. Availability & location badge
        tl.fromTo(
          '[data-hero-badge]',
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            clearProps: 'transform,opacity',
          },
          0
        )

        // 2. Display tagline lines rising out of mask clip containers
        tl.fromTo(
          '[data-hero-line]',
          { opacity: 0, y: lineDistance },
          {
            opacity: 1,
            y: 0,
            duration: MOTION_DURATION.heroLine,
            stagger: 0.068,
            clearProps: 'transform,opacity',
          },
          0.05
        )

        // 3. Profile photo subtle mask & scale settle
        tl.fromTo(
          '[data-hero-photo-frame]',
          {
            opacity: 0,
            scale: 0.96,
            clipPath: 'inset(7% 3% 7% 3% round 1rem)',
          },
          {
            opacity: 1,
            scale: 1,
            clipPath: 'inset(0% 0% 0% 0% round 1rem)',
            duration: MOTION_DURATION.heroMedia,
            clearProps: 'transform,opacity,clipPath',
          },
          0.08
        )

        tl.fromTo(
          '[data-hero-photo-img]',
          { scale: 1.04 },
          {
            scale: 1,
            duration: 0.72,
            ease: MOTION_EASE.reveal,
            clearProps: 'transform',
          },
          0.08
        )

        // 4. Role, name & concise intro
        tl.fromTo(
          '[data-hero-intro]',
          { opacity: 0, y: mobile ? 10 : 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            clearProps: 'transform,opacity',
          },
          0.17
        )

        // 5. Primary & secondary action buttons
        tl.fromTo(
          '[data-hero-actions]',
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.44,
            ease: MOTION_EASE.ui,
            clearProps: 'transform,opacity',
          },
          0.25
        )

        // 6. Connect bar & social links
        tl.fromTo(
          '[data-hero-connect]',
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: MOTION_EASE.ui,
            clearProps: 'transform,opacity',
          },
          0.3
        )

        tl.fromTo(
          '[data-hero-social]',
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.34,
            stagger: 0.04,
            ease: MOTION_EASE.ui,
            clearProps: 'transform,opacity',
          },
          0.34
        )
      },
      heroRef
    )

    return () => mm.revert()
  }, [])

  // Desktop pointer interactions: portrait crop parallax & magnetic action controls
  useEffect(() => {
    const cleanups = [
      attachPointerParallax(photoFrameRef.current, photoImgRef.current, {
        range: 4.5,
        hoverScale: 1.045,
        duration: 0.38,
      }),
      attachMagnetic(primaryCtaRef.current, { strength: 6, innerStrength: 2 }),
      attachMagnetic(secondaryCtaRef.current, { strength: 5, innerStrength: 1.8 }),
      ...socialLinkRefs.current.map((el) =>
        attachMagnetic(el, { strength: 4.5, innerStrength: 1.5 })
      ),
    ]

    return () => cleanups.forEach((fn) => fn())
  }, [])

  const handleAnchorClick = (event, targetId) => {
    if (!onNavigate) return
    event.preventDefault()
    onNavigate('/', targetId)
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center relative pt-24 px-6 max-w-6xl mx-auto overflow-x-clip"
    >
      {/* Subtle Cursor-Proximate Architectural Dot Field */}
      <InteractiveDotField theme={theme} />

      <div className="relative z-10 flex flex-col justify-between flex-grow py-6 md:py-8">
        {/* Hero Central Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-4">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8 md:space-y-9">
            {/* Location Status with Telemetry Scramble */}
            <div data-hero-badge className="inline-flex">
              <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-950/60 px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <ScrambleLabel text={profile.location} />
              </div>
            </div>

            {/* Display Headline with Line Mask Reveal + Kinetic Hover Focus */}
            <h1 className="hero-kinetic-group text-5xl sm:text-7xl md:text-8xl lg:text-[90px] font-bold tracking-tight text-zinc-950 dark:text-white leading-[0.95] max-w-4xl">
              {profile.hero.headlineLines.map((line) => (
                <span
                  key={line}
                  className="block overflow-hidden pb-[0.1em] -mb-[0.1em] px-[0.02em] -mx-[0.02em]"
                >
                  <span
                    data-hero-line
                    className="hero-kinetic-line relative inline-block cursor-default after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[0.04em] after:h-[2px] after:bg-emerald-500/80 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:ease-out"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            {/* Concise Intro */}
            <p
              data-hero-intro
              className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-light max-w-2xl leading-relaxed"
            >
              {profile.hero.intro}
            </p>

            {/* Primary Actions with Magnetic Attraction */}
            <div data-hero-actions className="flex flex-col sm:flex-row gap-4 pt-1">
              <a
                ref={primaryCtaRef}
                href={profile.hero.primaryCta.href}
                onClick={(event) => handleAnchorClick(event, 'about')}
                className="flex items-center justify-center gap-2 text-sm text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-6 py-3 rounded-md font-medium transition-colors duration-[170ms] ease-out group will-change-transform"
              >
                <span data-magnetic-inner className="inline-flex items-center gap-2">
                  {profile.hero.primaryCta.label}
                  <ArrowRight className="w-4 h-4 transition-transform duration-[170ms] ease-out group-hover:translate-x-1" />
                </span>
              </a>
              <a
                ref={secondaryCtaRef}
                href={profile.hero.secondaryCta.href}
                onClick={(event) => handleAnchorClick(event, 'contact')}
                className="flex items-center justify-center gap-2 text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white bg-zinc-100 border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 px-6 py-3 rounded-md font-medium transition-colors duration-[170ms] ease-out will-change-transform"
              >
                <span data-magnetic-inner className="inline-flex items-center gap-2">
                  {profile.hero.secondaryCta.label}
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Pointer-Reactive Profile Photo */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              ref={photoFrameRef}
              data-hero-photo-frame
              className="relative group w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950/60 shadow-xl dark:shadow-2xl transition-colors duration-200"
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zinc-400 dark:border-zinc-600 rounded-tl z-10 opacity-70 transition-transform duration-200 ease-out group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zinc-400 dark:border-zinc-600 rounded-tr z-10 opacity-70 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zinc-400 dark:border-zinc-600 rounded-bl z-10 opacity-70 transition-transform duration-200 ease-out group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zinc-400 dark:border-zinc-600 rounded-br z-10 opacity-70 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5" />

              <img
                ref={photoImgRef}
                data-hero-photo-img
                src={profilePhoto}
                alt={profile.name}
                className="w-full h-full object-cover object-center will-change-transform select-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Connect Bar */}
        <div
          data-hero-connect
          className="border-t border-zinc-200 dark:border-zinc-900 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto">
            <ScrambleLabel
              text="[ Let's Connect ]"
              className="font-mono text-xs uppercase tracking-widest text-zinc-500 cursor-default"
            />
            <div className="flex flex-wrap gap-x-3 gap-y-2.5">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    ref={(el) => {
                      socialLinkRefs.current[idx] = el
                    }}
                    data-hero-social
                    href={social.url}
                    target={social.external ? '_blank' : undefined}
                    rel={social.external ? 'noreferrer' : undefined}
                    className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/70 dark:bg-zinc-950/40 px-3.5 py-1.5 rounded transition-colors duration-[160ms] ease-out group shadow-xs"
                  >
                    <span data-magnetic-inner className="inline-flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150" />
                      <span className="uppercase tracking-wider font-medium">{social.name}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </div>

          <a
            href="#about"
            onClick={(event) => handleAnchorClick(event, 'about')}
            className="text-xs font-mono text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 flex items-center gap-1.5 self-end md:self-auto pt-2 md:pt-0 transition-colors duration-150 group"
          >
            <span>Scroll to discover</span>
            <span className="inline-block transition-transform duration-150 group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
