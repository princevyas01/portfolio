import { useState, useEffect, useCallback, useRef } from 'react'
import { flushSync } from 'react-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectCaseStudy from './components/ProjectCaseStudy'
import CommandPalette from './components/CommandPalette'
import { getProjectBySlug } from './data/projects'
import { useReducedMotion } from './hooks/useReducedMotion'
import { ScrollTrigger } from './lib/motion'

const SECTION_IDS = ['hero', 'about', 'projects', 'skills', 'education', 'contact']

function parseLocation() {
  if (typeof window === 'undefined') {
    return { route: 'home', slug: null }
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const hash = window.location.hash

  if (pathname === '/certifications' || hash === '#certifications') {
    return { route: 'certifications', slug: null }
  }

  if (pathname.startsWith('/projects/')) {
    const slug = pathname.slice('/projects/'.length)
    return { route: 'project', slug }
  }

  if (hash.startsWith('#/projects/')) {
    const slug = hash.slice('#/projects/'.length)
    return { route: 'project', slug }
  }

  return { route: 'home', slug: null }
}

function clearSharedTransitionNames() {
  if (typeof document === 'undefined') return
  document.querySelectorAll('[data-shared-project-media]').forEach((el) => {
    el.style.viewTransitionName = ''
  })
}

export default function App() {
  const [locationState, setLocationState] = useState(parseLocation)
  const [activeSection, setActiveSection] = useState('hero')
  const [fallbackTransitionKey, setFallbackTransitionKey] = useState(0)
  const [transitionProjectSlug, setTransitionProjectSlug] = useState(null)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  const reducedMotion = useReducedMotion()
  const locationStateRef = useRef(locationState)
  const reducedMotionRef = useRef(reducedMotion)

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    locationStateRef.current = locationState
  }, [locationState])

  useEffect(() => {
    reducedMotionRef.current = reducedMotion
  }, [reducedMotion])

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Global Ctrl+K / Cmd+K shortcut for Command Palette
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  const scrollToSection = useCallback((sectionId, instant = false) => {
    const behavior = instant || reducedMotionRef.current ? 'instant' : 'smooth'
    if (!sectionId || sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior })
      return
    }
    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({ behavior })
    }
  }, [])

  const commitRouteState = useCallback((nextState, postCommit, sharedSlug = null) => {
    const prevState = locationStateRef.current
    const isRouteSwitch =
      nextState.route !== prevState.route || nextState.slug !== prevState.slug

    if (!isRouteSwitch || reducedMotionRef.current) {
      clearSharedTransitionNames()
      setTransitionProjectSlug(null)
      setLocationState(nextState)
      if (postCommit) postCommit()
      return
    }

    if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
      clearSharedTransitionNames()

      // Enable shared-image morph only for home <-> single project detail navigation
      const isHomeToProject = prevState.route === 'home' && nextState.route === 'project'
      const isProjectToHome = prevState.route === 'project' && nextState.route === 'home'

      if (isHomeToProject && sharedSlug) {
        const sourceCardMedia = document.querySelector(
          `[data-shared-project-media="${sharedSlug}"]`
        )
        if (sourceCardMedia && !sourceCardMedia.closest('[hidden]')) {
          sourceCardMedia.style.viewTransitionName = 'project-hero-image'
        }
      }

      if (!isProjectToHome && prevState.route === 'project') {
        const detailHero = document.querySelector('[data-case-shared-image]')
        if (detailHero) detailHero.style.viewTransitionName = ''
      }

      const vt = document.startViewTransition(() => {
        flushSync(() => {
          setTransitionProjectSlug(isProjectToHome ? sharedSlug : null)
          setLocationState(nextState)
        })
        if (postCommit) postCommit()
      })

      vt.finished.finally(() => {
        clearSharedTransitionNames()
        setTransitionProjectSlug(null)
      })
      return
    }

    setFallbackTransitionKey((prev) => prev + 1)
    setLocationState(nextState)
    if (postCommit) postCommit()
  }, [])

  useEffect(() => {
    const syncLocation = () => {
      const prevState = locationStateRef.current
      const nextState = parseLocation()
      const sharedSlug =
        prevState.route === 'project'
          ? prevState.slug
          : nextState.route === 'project'
          ? nextState.slug
          : null

      commitRouteState(
        nextState,
        () => {
          if (nextState.route === 'home') {
            const rawHash = window.location.hash.replace('#', '')
            if (rawHash && SECTION_IDS.includes(rawHash)) {
              const target = document.getElementById(rawHash)
              if (target) {
                target.scrollIntoView({ behavior: 'instant' })
                setActiveSection(rawHash)
              }
            }
            window.requestAnimationFrame(() => ScrollTrigger.refresh())
          }
        },
        sharedSlug
      )
    }

    window.addEventListener('popstate', syncLocation)
    window.addEventListener('hashchange', syncLocation)
    return () => {
      window.removeEventListener('popstate', syncLocation)
      window.removeEventListener('hashchange', syncLocation)
    }
  }, [commitRouteState])

  // Handle initial hash target on cold load (e.g. /#education or /#projects)
  useEffect(() => {
    if (locationState.route !== 'home') return undefined
    const rawHash = window.location.hash.replace('#', '')
    if (!rawHash || !SECTION_IDS.includes(rawHash)) return undefined

    const timer = window.setTimeout(() => {
      const target = document.getElementById(rawHash)
      if (target) {
        target.scrollIntoView({ behavior: 'instant' })
        setActiveSection(rawHash)
        ScrollTrigger.refresh()
      }
    }, 60)

    return () => window.clearTimeout(timer)
  }, [locationState.route])

  // Scroll-spy for home navigation highlight based on consistent reading line
  useEffect(() => {
    if (locationState.route !== 'home') return undefined

    let frameId = null

    const updateActiveSection = () => {
      frameId = null
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      if (scrollY < 80) {
        setActiveSection((prev) => (prev === 'hero' ? prev : 'hero'))
        return
      }

      if (scrollY + viewportHeight >= docHeight - 24) {
        setActiveSection((prev) => (prev === 'contact' ? prev : 'contact'))
        return
      }

      const readingOffset = viewportHeight * 0.34
      let current = 'hero'

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= readingOffset) {
          current = id
        }
      }

      setActiveSection((prev) => (prev === current ? prev : current))
    }

    const onScrollOrResize = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateActiveSection)
      }
    }

    updateActiveSection()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [locationState.route])

  const navigate = useCallback(
    (path, sectionId = null) => {
      const targetUrl = sectionId && path === '/' && sectionId !== 'hero' ? `/#${sectionId}` : path
      if (window.location.pathname + window.location.hash !== targetUrl) {
        window.history.pushState({}, '', targetUrl)
      }

      const prevState = locationStateRef.current
      const nextState = parseLocation()
      const isRouteSwitch =
        nextState.route !== prevState.route || nextState.slug !== prevState.slug
      const sharedSlug =
        nextState.route === 'project'
          ? nextState.slug
          : prevState.route === 'project'
          ? prevState.slug
          : null

      commitRouteState(
        nextState,
        () => {
          if (nextState.route === 'home') {
            if (sectionId) {
              setActiveSection(sectionId)
              if (isRouteSwitch) {
                scrollToSection(sectionId, true)
                window.requestAnimationFrame(() => ScrollTrigger.refresh())
              } else {
                window.requestAnimationFrame(() => {
                  window.setTimeout(() => scrollToSection(sectionId, false), 20)
                })
              }
            } else {
              window.scrollTo({
                top: 0,
                behavior: isRouteSwitch || reducedMotionRef.current ? 'instant' : 'smooth',
              })
              if (isRouteSwitch) {
                window.requestAnimationFrame(() => ScrollTrigger.refresh())
              }
            }
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' })
          }
        },
        sharedSlug
      )
    },
    [commitRouteState, scrollToSection]
  )

  const openCaseStudy = useCallback(
    (slug) => {
      navigate(`/projects/${slug}`)
    },
    [navigate]
  )

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const activeProject =
    locationState.route === 'project' ? getProjectBySlug(locationState.slug) : null

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen text-zinc-700 dark:text-zinc-400 font-sans antialiased">
      <Navbar
        route={locationState.route}
        activeSection={activeSection}
        onNavigate={navigate}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
      />

      <main
        key={fallbackTransitionKey > 0 ? `vt-fallback-${fallbackTransitionKey}` : undefined}
        className={fallbackTransitionKey > 0 ? 'route-enter' : undefined}
      >
        {locationState.route === 'certifications' ? (
          <Certifications />
        ) : locationState.route === 'project' ? (
          <ProjectCaseStudy
            key={activeProject?.slug || 'not-found'}
            project={activeProject}
            onBack={() => navigate('/', 'projects')}
            onSelectProject={openCaseStudy}
          />
        ) : (
          <div className="space-y-12">
            <Hero onNavigate={navigate} theme={theme} />
            <About />
            <Projects
              onOpenCaseStudy={openCaseStudy}
              transitionProjectSlug={transitionProjectSlug}
            />
            <Skills />
            <Education />
            <Contact />
          </div>
        )}
      </main>

      <Footer />

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigate={navigate}
        onSelectProject={openCaseStudy}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  )
}
