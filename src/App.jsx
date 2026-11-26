import { useState, useEffect, useCallback } from 'react'
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
import { getProjectBySlug } from './data/projects'
import { useReducedMotion } from './hooks/useReducedMotion'

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

export default function App() {
  const [locationState, setLocationState] = useState(parseLocation)
  const [activeSection, setActiveSection] = useState('hero')
  const reducedMotion = useReducedMotion()
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const syncLocation = () => {
      setLocationState(parseLocation())
    }

    window.addEventListener('popstate', syncLocation)
    window.addEventListener('hashchange', syncLocation)
    return () => {
      window.removeEventListener('popstate', syncLocation)
      window.removeEventListener('hashchange', syncLocation)
    }
  }, [])

  // Handle initial hash target on cold load (e.g. /#education or /#projects)
  useEffect(() => {
    if (locationState.route !== 'home') return undefined
    const rawHash = window.location.hash.replace('#', '')
    if (!rawHash || !SECTION_IDS.includes(rawHash)) return undefined

    const timer = window.setTimeout(() => {
      const target = document.getElementById(rawHash)
      if (target) {
        target.scrollIntoView({ behavior: 'auto' })
        setActiveSection(rawHash)
      }
    }, 60)

    return () => window.clearTimeout(timer)
  }, [locationState.route])

  // Scroll-spy for home navigation highlight
  useEffect(() => {
    if (locationState.route !== 'home') return undefined
    if (typeof IntersectionObserver === 'undefined') return undefined

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (elements.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [locationState.route])

  const scrollToSection = useCallback(
    (sectionId) => {
      const behavior = reducedMotion ? 'auto' : 'smooth'
      if (!sectionId || sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior })
        return
      }
      const target = document.getElementById(sectionId)
      if (target) {
        target.scrollIntoView({ behavior })
      }
    },
    [reducedMotion]
  )

  const navigate = useCallback(
    (path, sectionId = null) => {
      const targetUrl = sectionId && path === '/' && sectionId !== 'hero' ? `/#${sectionId}` : path
      if (window.location.pathname + window.location.hash !== targetUrl) {
        window.history.pushState({}, '', targetUrl)
      }

      const nextState = parseLocation()
      setLocationState(nextState)

      if (nextState.route === 'home') {
        if (sectionId) {
          setActiveSection(sectionId)
          window.requestAnimationFrame(() => {
            window.setTimeout(() => scrollToSection(sectionId), 30)
          })
        } else {
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    },
    [reducedMotion, scrollToSection]
  )

  const openCaseStudy = useCallback(
    (slug) => {
      navigate(`/projects/${slug}`)
    },
    [navigate]
  )

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

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
      />

      <main>
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
            <Hero onNavigate={navigate} />
            <About />
            <Projects onOpenCaseStudy={openCaseStudy} />
            <Skills />
            <Education />
            <Contact />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
