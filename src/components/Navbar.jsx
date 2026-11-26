import { useState, useEffect, useRef } from 'react'
import { Menu, X, ArrowUpRight, Cpu, Sun, Moon } from 'lucide-react'
import { profile } from '../data/profile'

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
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const isLinkActive = (link) => {
    if (route === 'certifications') return link.id === 'certifications'
    if (route === 'project') return link.id === 'projects'
    return activeSection === link.id
  }

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
      className={`fixed top-0 left-0 w-full z-50 transition-[background-color,border-color,padding,backdrop-filter] duration-200 ease-out ${
        scrolled
          ? 'bg-white/85 dark:bg-black/75 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 py-3'
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
            <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-zinc-400 dark:border-zinc-500 rounded-tl-sm opacity-60" />
            <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-zinc-400 dark:border-zinc-500 rounded-br-sm opacity-60" />
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-200" />
              {profile.brandCode}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-900 dark:text-white text-sm font-medium tracking-tight group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-150 whitespace-nowrap">
              {profile.name}
            </span>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase leading-none whitespace-nowrap">
                {profile.subtitle}
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6 xl:gap-7">
          {navLinks.map((link) => {
            const active = isLinkActive(link)
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(event) => handleLinkClick(event, link)}
                aria-current={active ? 'page' : undefined}
                className={`text-xs font-mono tracking-wider relative py-1 whitespace-nowrap transition-colors duration-150 ${
                  active
                    ? 'text-zinc-950 dark:text-white font-medium'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {link.name}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 bottom-0 h-px bg-zinc-950 dark:bg-white origin-left transition-transform duration-200 ease-out ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            )
          })}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150 cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <a
            href="/#contact"
            onClick={handleContactClick}
            className="group flex items-center gap-1 text-xs text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-4 py-2 rounded font-mono transition-colors duration-150 whitespace-nowrap"
          >
            Get in touch
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Tablet & Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150 cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150 cursor-pointer"
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
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-200 ease-out border-zinc-200 dark:border-zinc-900 bg-white/95 dark:bg-black/95 backdrop-blur-lg ${
          isOpen ? 'max-h-[420px] opacity-100 border-b' : 'max-h-0 opacity-0 pointer-events-none border-b-0'
        }`}
      >
        <nav aria-label="Mobile navigation" className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => {
            const active = isLinkActive(link)
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(event) => handleLinkClick(event, link)}
                tabIndex={isOpen ? 0 : -1}
                className={`text-sm font-mono tracking-wide py-1 transition-colors duration-150 ${
                  active
                    ? 'text-zinc-950 dark:text-white font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {link.name}
              </a>
            )
          })}
          <a
            href="/#contact"
            onClick={handleContactClick}
            tabIndex={isOpen ? 0 : -1}
            className="flex items-center justify-center gap-1.5 text-xs text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 py-3 rounded font-mono font-medium transition-colors duration-150 mt-2"
          >
            Get in touch
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </nav>
      </div>
    </header>
  )
}
