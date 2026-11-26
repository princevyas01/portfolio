import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { Menu, X, ArrowUpRight, Cpu, Sun, Moon, Search } from 'lucide-react'
import { profile } from '../data/profile'
import { attachMagnetic, gsap, MOTION_DURATION, MOTION_EASE, prefersReducedMotion } from '../lib/motion'

const navLinks = [
  { name: 'About', href: '/#about', id: 'about' },
  { name: 'Projects', href: '/#projects', id: 'projects' },
  { name: 'Skills', href: '/#skills', id: 'skills' },
  { name: 'Certifications', href: '/certifications', id: 'certifications' },
  { name: 'Education', href: '/#education', id: 'education' },
  { name: 'Contact', href: '/#contact', id: 'contact' },
]

export default function Navbar({
  route,
  activeSection,
  onNavigate,
  theme,
  toggleTheme,
  onOpenCommandPalette,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)
  const linkRefs = useRef({})
  const indicatorRef = useRef(null)
  const hasVisibleIndicatorRef = useRef(false)
  const contactCtaRef = useRef(null)

  const mobileMenuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const menuInitializedRef = useRef(false)
  const scrollProgressRef = useRef(null)

  useEffect(() => {
    const progressEl = scrollProgressRef.current
    if (!progressEl) return undefined

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        progressEl,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      )
    })

    return () => mm.revert()
  }, [route])

  useEffect(() => {
    return attachMagnetic(contactCtaRef.current, {
      strength: 5.5,
      innerStrength: 1.8,
      duration: 0.3,
    })
  }, [])

  const activeNavId =
    route === 'certifications'
      ? 'certifications'
      : route === 'project'
      ? 'projects'
      : activeSection

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Escape & focus restoration for mobile menu
  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Position and glide the single active navigation indicator cleanly
  const updateIndicator = useCallback(
    (immediate = false) => {
      const indicatorEl = indicatorRef.current
      if (!indicatorEl) return

      const activeEl = linkRefs.current[activeNavId]
      const reduced = prefersReducedMotion()

      if (!activeEl) {
        hasVisibleIndicatorRef.current = false
        gsap.to(indicatorEl, {
          opacity: 0,
          duration: immediate || reduced ? 0 : 0.16,
          ease: MOTION_EASE.ui,
          overwrite: 'auto',
        })
        return
      }

      const targetX = activeEl.offsetLeft
      const targetWidth = activeEl.offsetWidth

      if (!hasVisibleIndicatorRef.current || immediate || reduced) {
        gsap.set(indicatorEl, {
          x: targetX,
          width: targetWidth,
        })
        gsap.to(indicatorEl, {
          opacity: 1,
          duration: reduced ? 0 : 0.18,
          ease: MOTION_EASE.ui,
          overwrite: 'auto',
        })
        hasVisibleIndicatorRef.current = true
        return
      }

      gsap.to(indicatorEl, {
        x: targetX,
        width: targetWidth,
        opacity: 1,
        duration: MOTION_DURATION.indicator,
        ease: MOTION_EASE.reveal,
        overwrite: 'auto',
      })
    },
    [activeNavId]
  )

  useLayoutEffect(() => {
    updateIndicator(false)
  }, [updateIndicator])

  useEffect(() => {
    const navEl = navRef.current
    if (!navEl || typeof ResizeObserver === 'undefined') return undefined

    const observer = new ResizeObserver(() => {
      updateIndicator(true)
    })
    observer.observe(navEl)
    return () => observer.disconnect()
  }, [updateIndicator])

  // Mobile drawer enter / exit transitions with item stagger
  useLayoutEffect(() => {
    const panel = mobileMenuRef.current
    if (!panel) return undefined

    const items = panel.querySelectorAll('[data-mobile-nav-item]')
    const reduced = prefersReducedMotion()

    if (!menuInitializedRef.current) {
      menuInitializedRef.current = true
      gsap.set(panel, { autoAlpha: 0, y: -8, display: 'none' })
      gsap.set(items, { opacity: 0, y: 6 })
      return undefined
    }

    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.set(panel, { display: 'block' })
        if (reduced) {
          gsap.set(panel, { autoAlpha: 1, y: 0 })
          gsap.set(items, { opacity: 1, y: 0 })
          return
        }

        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: -8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.22,
            ease: MOTION_EASE.reveal,
            overwrite: 'auto',
          }
        )
        gsap.fromTo(
          items,
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            stagger: 0.03,
            delay: 0.04,
            ease: MOTION_EASE.ui,
            clearProps: 'transform',
            overwrite: 'auto',
          }
        )
      } else {
        if (reduced) {
          gsap.set(panel, { autoAlpha: 0, y: 0, display: 'none' })
          return
        }

        gsap.to(items, {
          opacity: 0,
          y: -4,
          duration: 0.12,
          ease: MOTION_EASE.ui,
          overwrite: 'auto',
        })
        gsap.to(panel, {
          autoAlpha: 0,
          y: -6,
          duration: 0.17,
          ease: MOTION_EASE.ui,
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(panel, { display: 'none' })
          },
        })
      }
    }, mobileMenuRef)

    return () => ctx.revert()
  }, [isOpen])

  const isLinkActive = (link) => activeNavId === link.id

  const handleLinkClick = (event, link) => {
    event.preventDefault()
    setIsOpen(false)
    if (link.id === 'certifications') {
      onNavigate('/certifications')
    } else {
      onNavigate('/', link.id)
    }
  }

  const handleBrandClick = (event) => {
    event.preventDefault()
    setIsOpen(false)
    onNavigate('/', 'hero')
  }

  const handleContactClick = (event) => {
    event.preventDefault()
    setIsOpen(false)
    onNavigate('/', 'contact')
  }

  return (
    <header
      className={`site-header fixed top-0 left-0 w-full z-50 transition-[background-color,border-color,padding,backdrop-filter] duration-200 ease-out ${
        isOpen
          ? 'bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 py-3.5'
          : scrolled
          ? 'bg-white/90 dark:bg-black/85 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 py-3'
          : 'bg-transparent border-b border-transparent py-4 md:py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand */}
        <a
          href="/"
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="relative flex items-center justify-center font-mono text-zinc-900 dark:text-white text-sm font-semibold tracking-wider bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 px-2.5 py-1 rounded transition-colors duration-150 shrink-0">
            <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-zinc-400 dark:border-zinc-500 rounded-tl-sm opacity-60 transition-transform duration-200 ease-out group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-zinc-400 dark:border-zinc-500 rounded-br-sm opacity-60 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-[color,transform] duration-300 ease-out group-hover:rotate-45" />
              {profile.brandCode}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-900 dark:text-white text-sm font-medium tracking-tight group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-150 whitespace-nowrap">
              {profile.name}
            </span>
            <div className="hidden sm:flex lg:hidden xl:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase leading-none whitespace-nowrap">
                {profile.subtitle}
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Nav with Single Sliding Emerald Active Indicator */}
        <nav
          ref={navRef}
          aria-label="Primary navigation"
          className="hidden lg:flex items-center lg:gap-4 xl:gap-7 relative"
        >
          {navLinks.map((link) => {
            const active = isLinkActive(link)
            return (
              <a
                key={link.id}
                ref={(el) => {
                  linkRefs.current[link.id] = el
                }}
                href={link.href}
                onClick={(event) => handleLinkClick(event, link)}
                aria-current={active ? 'page' : undefined}
                className={`text-xs font-mono tracking-wider relative py-1 whitespace-nowrap transition-colors duration-[180ms] ease-out after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-zinc-400/70 dark:after:bg-zinc-600/80 after:origin-left after:transition-transform after:duration-200 after:ease-out ${
                  active
                    ? 'text-zinc-950 dark:text-white font-medium after:scale-x-0'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {link.name}
              </a>
            )
          })}

          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 bottom-0 h-[1.5px] rounded-full bg-emerald-500 opacity-0"
          />
        </nav>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Open command palette (Ctrl+K or Cmd+K)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150 cursor-pointer active:scale-[0.97] text-[11px] font-mono"
          >
            <Search className="w-3.5 h-3.5" />
            <span>⌘K</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150 cursor-pointer active:scale-[0.96]"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <a
            ref={contactCtaRef}
            href="/#contact"
            onClick={handleContactClick}
            className="group flex items-center gap-1 text-xs text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-3 xl:px-4 py-2 rounded font-mono transition-colors duration-[170ms] ease-out whitespace-nowrap will-change-transform"
          >
            <span data-magnetic-inner className="inline-flex items-center gap-1">
              Get in touch
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-[170ms] ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </div>

        {/* Tablet & Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search or run command"
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150 cursor-pointer active:scale-[0.96]"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150 cursor-pointer active:scale-[0.96]"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150 cursor-pointer active:scale-[0.96]"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-panel"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Menu Panel */}
      <div
        id="mobile-navigation-panel"
        ref={mobileMenuRef}
        aria-hidden={!isOpen}
        className="lg:hidden border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-lg dark:shadow-black/60"
      >
        <nav aria-label="Mobile navigation" className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => {
            const active = isLinkActive(link)
            return (
              <a
                key={link.id}
                data-mobile-nav-item
                href={link.href}
                onClick={(event) => handleLinkClick(event, link)}
                tabIndex={isOpen ? 0 : -1}
                className={`text-sm font-mono tracking-wide py-1 flex items-center gap-2 transition-colors duration-150 ${
                  active
                    ? 'text-zinc-950 dark:text-white font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
                    active ? 'bg-emerald-500' : 'bg-transparent'
                  }`}
                />
                <span>{link.name}</span>
              </a>
            )
          })}
          <a
            data-mobile-nav-item
            href="/#contact"
            onClick={handleContactClick}
            tabIndex={isOpen ? 0 : -1}
            className="flex items-center justify-center gap-1.5 text-xs text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 py-3 rounded font-mono font-medium transition-colors duration-150 active:scale-[0.985] mt-2"
          >
            Get in touch
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </nav>
      </div>
      {/* Scroll Progress Hairline along Navbar Bottom Border */}
      <span
        ref={scrollProgressRef}
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] bg-emerald-500/75 origin-left scale-x-0 transition-opacity duration-200 ${
          scrolled && !isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </header>
  )
}
