import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Award,
  Check,
  Code2,
  Copy,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Home,
  Mail,
  Moon,
  Search,
  Sun,
  User,
  X,
} from 'lucide-react'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { gsap, MOTION_EASE, prefersReducedMotion } from '../lib/motion'

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onSelectProject,
  theme,
  toggleTheme,
}) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const overlayRef = useRef(null)
  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const itemRefs = useRef([])
  const prevFocusRef = useRef(null)

  const commands = useMemo(() => {
    const navItems = [
      { id: 'nav-home', group: 'Navigation', label: 'Home', hint: 'Top section', icon: Home, keywords: 'hero top landing', type: 'route', path: '/', sectionId: 'hero' },
      { id: 'nav-projects', group: 'Navigation', label: 'Projects', hint: 'Portfolio grid', icon: FolderKanban, keywords: 'work showcase filter', type: 'route', path: '/', sectionId: 'projects' },
      { id: 'nav-about', group: 'Navigation', label: 'About', hint: 'Background & focus', icon: User, keywords: 'bio languages strengths', type: 'route', path: '/', sectionId: 'about' },
      { id: 'nav-skills', group: 'Navigation', label: 'Skills', hint: 'Technical stack & Web3', icon: Code2, keywords: 'stack technologies python react flutter', type: 'route', path: '/', sectionId: 'skills' },
      { id: 'nav-education', group: 'Navigation', label: 'Education', hint: 'Academic timeline & scores', icon: GraduationCap, keywords: 'ssc hsc btech mmcoe cgpa', type: 'route', path: '/', sectionId: 'education' },
      { id: 'nav-certifications', group: 'Navigation', label: 'Certifications', hint: 'Credentials & awards', icon: Award, keywords: 'certificates courses promptwars oracle', type: 'route', path: '/certifications', sectionId: null },
      { id: 'nav-contact', group: 'Navigation', label: 'Contact', hint: 'Send a message', icon: Mail, keywords: 'email message form hire', type: 'route', path: '/', sectionId: 'contact' },
    ]

    const projectItems = projects.map((project) => ({
      id: `project-${project.slug}`,
      group: 'Projects',
      label: project.title,
      hint: project.category,
      icon: ArrowRight,
      keywords: `${project.category} ${project.technologies.join(' ')} ${project.shortDescription}`,
      type: 'project',
      slug: project.slug,
    }))

    const actionItems = [
      {
        id: 'action-github',
        group: 'Actions',
        label: 'Open GitHub',
        hint: 'princevyas01',
        icon: ExternalLink,
        keywords: 'git code repositories',
        type: 'external',
        url: profile.githubUrl,
      },
      {
        id: 'action-linkedin',
        group: 'Actions',
        label: 'Open LinkedIn',
        hint: 'Profile',
        icon: ExternalLink,
        keywords: 'social network career',
        type: 'external',
        url: profile.linkedinUrl,
      },
      {
        id: 'action-copy-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: profile.email,
        icon: Copy,
        keywords: 'clipboard mail contact',
        type: 'copy-email',
      },
      {
        id: 'action-theme',
        group: 'Actions',
        label: theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
        hint: theme === 'dark' ? 'Light mode' : 'Dark mode',
        icon: theme === 'dark' ? Sun : Moon,
        keywords: 'appearance color dark light mode',
        type: 'theme',
      },
    ]

    return [...navItems, ...projectItems, ...actionItems]
  }, [theme])

  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.group.toLowerCase().includes(q) ||
        cmd.hint.toLowerCase().includes(q) ||
        cmd.keywords.toLowerCase().includes(q)
    )
  }, [commands, query])

  const groupedCommands = useMemo(() => {
    const groups = new Map()
    filteredCommands.forEach((cmd, flatIndex) => {
      if (!groups.has(cmd.group)) groups.set(cmd.group, [])
      groups.get(cmd.group).push({ ...cmd, flatIndex })
    })
    return Array.from(groups.entries())
  }, [filteredCommands])

  const resetAndClose = useCallback(() => {
    setQuery('')
    setSelectedIndex(0)
    setCopiedEmail(false)
    onClose()
  }, [onClose])

  const closePalette = useCallback(() => {
    const reduced = prefersReducedMotion()
    if (reduced || !overlayRef.current || !panelRef.current) {
      resetAndClose()
      return
    }

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.14,
      ease: MOTION_EASE.ui,
    })
    gsap.to(panelRef.current, {
      opacity: 0,
      scale: 0.98,
      y: 4,
      duration: 0.14,
      ease: MOTION_EASE.ui,
      onComplete: () => resetAndClose(),
    })
  }, [resetAndClose])

  // Auto-dismiss briefly after copying email with clean effect cleanup
  useEffect(() => {
    if (!copiedEmail) return undefined
    const timer = window.setTimeout(() => {
      resetAndClose()
    }, 550)
    return () => window.clearTimeout(timer)
  }, [copiedEmail, resetAndClose])

  const handleSelectCommand = (command) => {
    if (!command) return

    if (command.type === 'route') {
      resetAndClose()
      onNavigate(command.path, command.sectionId)
      return
    }

    if (command.type === 'project') {
      resetAndClose()
      onSelectProject(command.slug)
      return
    }

    if (command.type === 'external') {
      resetAndClose()
      window.open(command.url, '_blank', 'noopener,noreferrer')
      return
    }

    if (command.type === 'theme') {
      toggleTheme()
      resetAndClose()
      return
    }

    if (command.type === 'copy-email') {
      navigator.clipboard?.writeText(profile.email).catch(() => {})
      setCopiedEmail(true)
    }
  }

  // Play open transition and auto-focus input cleanly when mounted
  useLayoutEffect(() => {
    if (!isOpen) return undefined

    prevFocusRef.current = document.activeElement
    const reduced = prefersReducedMotion()

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([overlayRef.current, panelRef.current], { opacity: 1, scale: 1, y: 0 })
        return
      }
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.18, ease: MOTION_EASE.ui }
      )
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.98, y: 6 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.2,
          ease: MOTION_EASE.reveal,
          clearProps: 'transform,opacity',
        }
      )
    })

    const frameId = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.cancelAnimationFrame(frameId)
      document.body.style.overflow = previousOverflow
      ctx.revert()
      window.requestAnimationFrame(() => {
        prevFocusRef.current?.focus?.()
      })
    }
  }, [isOpen])

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closePalette()
      return
    }

    if (filteredCommands.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((prev) => {
        const next = (prev + 1) % filteredCommands.length
        itemRefs.current[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((prev) => {
        const next = (prev - 1 + filteredCommands.length) % filteredCommands.length
        itemRefs.current[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (event.key === 'Enter') {
      event.preventDefault()
      handleSelectCommand(filteredCommands[selectedIndex] || filteredCommands[0])
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={closePalette}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 bg-zinc-950/45 dark:bg-black/70 backdrop-blur-xs flex items-start justify-center pt-[12vh] px-4 sm:px-6"
    >
      <div
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl dark:shadow-black/80 overflow-hidden"
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-900">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Jump to section, project, or action..."
            aria-label="Search commands"
            className="w-full bg-transparent text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-sans outline-none"
          />
          <button
            type="button"
            onClick={closePalette}
            aria-label="Close command palette"
            className="p-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[52vh] overflow-y-auto py-2 px-2 space-y-3">
          {groupedCommands.length === 0 ? (
            <div className="py-10 text-center text-xs font-mono text-zinc-500">
              No matching commands found.
            </div>
          ) : (
            groupedCommands.map(([groupName, groupItems]) => (
              <div key={groupName} className="space-y-1">
                <div className="px-2.5 pt-1 text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {groupName}
                </div>
                {groupItems.map((cmd) => {
                  const Icon =
                    cmd.id === 'action-copy-email' && copiedEmail ? Check : cmd.icon
                  const active = selectedIndex === cmd.flatIndex
                  return (
                    <button
                      key={cmd.id}
                      ref={(el) => {
                        itemRefs.current[cmd.flatIndex] = el
                      }}
                      type="button"
                      onMouseEnter={() => setSelectedIndex(cmd.flatIndex)}
                      onClick={() => handleSelectCommand(cmd)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-100 cursor-pointer ${
                        active
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            cmd.id === 'action-copy-email' && copiedEmail
                              ? 'text-emerald-500'
                              : active
                              ? 'text-emerald-500'
                              : 'text-zinc-400 dark:text-zinc-500'
                          }`}
                        />
                        <span className="text-sm font-medium truncate">
                          {cmd.id === 'action-copy-email' && copiedEmail
                            ? 'Copied email address'
                            : cmd.label}
                        </span>
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0 truncate max-w-[160px]">
                        {cmd.id === 'action-copy-email' && copiedEmail ? 'Copied' : cmd.hint}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50/80 dark:bg-zinc-950/80 text-[10px] font-mono text-zinc-500">
          <span>↑↓ Navigate · ↵ Select</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  )
}
