import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [view, setView] = useState('home') // 'home' or 'certifications'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      return saved || 'dark'
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

  // Listen to hash changes to sync view state (e.g. reload or back button)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#certifications') {
        setView('certifications')
      } else {
        setView('home')
      }
    }

    // Run on mount
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen text-zinc-600 dark:text-zinc-400 font-sans antialiased">
      {/* Navigation Header */}
      <Navbar currentView={view} setView={setView} theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Layout */}
      <main className="space-y-16">
        {view === 'certifications' ? (
          // Dedicated Certifications View
          <Certifications />
        ) : (
          // Main Single-Page Scroll View
          <>
            {/* Full-screen Hero Section */}
            <Hero />

            {/* Concise About Section */}
            <About />

            {/* Showcase Focus/Projects */}
            <Projects />

            {/* Categorized Skills Badge Matrix */}
            <Skills />

            {/* Vertical Academic timeline */}
            <Education />

            {/* Minimal Form-based Contact Portal */}
            <Contact />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
