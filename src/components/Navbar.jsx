import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, Cpu, Sun, Moon } from 'lucide-react'

const baseNavLinks = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar({ currentView, setView, theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    if (href === '#certifications') {
      e.preventDefault()
      setView('certifications')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.location.hash = 'certifications'
    } else {
      setView('home')
      // If we are currently on the certifications page, wait a tiny bit for the home page sections to render, then scroll
      if (currentView === 'certifications') {
        setTimeout(() => {
          const element = document.querySelector(href)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    }
    setIsOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900/80 py-3'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo / Brand - PV monogram with tech-inspired styling */}
        <a 
          href="#hero" 
          onClick={(e) => {
            e.preventDefault()
            setView('home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
            window.location.hash = ''
          }} 
          className="flex items-center gap-2.5 group"
        >
          <div className="relative flex items-center justify-center font-mono text-zinc-900 dark:text-white text-sm font-semibold tracking-wider bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700 px-2.5 py-1 rounded transition-colors group">
            {/* AI-inspired corner indicators */}
            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-zinc-400 dark:border-zinc-500 rounded-tl-sm opacity-50" />
            <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-zinc-400 dark:border-zinc-500 rounded-br-sm opacity-50" />
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300" />
              PV
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-900 dark:text-white text-sm font-medium tracking-tight group-hover:text-zinc-750 dark:group-hover:text-zinc-300 transition-colors">
              Prince Vyas
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase leading-none">
                Exploring, Learning & Building
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {baseNavLinks.map((link) => {
            const isActive = 
              (link.href === '#certifications' && currentView === 'certifications') ||
              (link.href !== '#certifications' && currentView === 'home')
            
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-xs font-mono tracking-wider transition-colors relative py-1 ${
                  isActive 
                    ? 'text-zinc-950 dark:text-white font-medium border-b border-zinc-950 dark:border-white' 
                    : 'text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {link.name}
              </a>
            )
          })}
        </nav>

        {/* Desktop Controls (Theme Toggle + CTA) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="flex items-center gap-1 text-xs text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-4 py-2 rounded font-mono transition-colors"
          >
            Get in touch
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2.5 md:hidden">
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-850 bg-zinc-100/50 dark:bg-zinc-950/40 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-zinc-205 dark:border-zinc-900 bg-white/95 dark:bg-black/95 backdrop-blur-lg"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {baseNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-zinc-600 dark:text-zinc-300 font-mono tracking-wide hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="flex items-center justify-center gap-1.5 text-xs text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 py-3 rounded font-mono font-medium transition-colors mt-2"
              >
                Get in touch
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
