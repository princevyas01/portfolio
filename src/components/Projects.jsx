import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PROJECT_CATEGORIES, projects } from '../data/projects'
import {
  Flip,
  gsap,
  isCompactViewport,
  MOTION_DURATION,
  MOTION_EASE,
  prefersReducedMotion,
  supportsFinePointer,
} from '../lib/motion'
import ProjectCard from './ProjectCard'
import ElasticDivider from './ElasticDivider'
import ScrambleLabel from './ScrambleLabel'

const PREVIEW_WIDTH = 264
const PREVIEW_HEIGHT = 204
const PREVIEW_MARGIN = 16

function clampPreviewPosition(rawX, rawY, mode = 'pointer') {
  if (typeof window === 'undefined') return { x: 0, y: 0 }

  let targetX = rawX + 18
  let targetY = mode === 'keyboard' ? rawY - PREVIEW_HEIGHT - 12 : rawY - PREVIEW_HEIGHT + 24

  if (targetX + PREVIEW_WIDTH + PREVIEW_MARGIN > window.innerWidth) {
    targetX = rawX - PREVIEW_WIDTH - 18
  }
  if (targetY < 72) {
    targetY = rawY + 24
  }

  return {
    x: Math.max(PREVIEW_MARGIN, Math.min(window.innerWidth - PREVIEW_WIDTH - PREVIEW_MARGIN, targetX)),
    y: Math.max(72, Math.min(window.innerHeight - PREVIEW_HEIGHT - PREVIEW_MARGIN, targetY)),
  }
}

export default function Projects({ onOpenCaseStudy, transitionProjectSlug = null }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [previewState, setPreviewState] = useState(null)

  const sectionRef = useRef(null)
  const tablistRef = useRef(null)
  const tabRefs = useRef({})
  const tabIndicatorRef = useRef(null)
  const hasTabIndicatorInitRef = useRef(false)

  const gridRef = useRef(null)
  const pendingFlipStateRef = useRef(null)
  const flipTweenRef = useRef(null)

  const floatingPreviewRef = useRef(null)
  const previewQuickXRef = useRef(null)
  const previewQuickYRef = useRef(null)
  const previewCoordsRef = useRef({ x: 0, y: 0 })

  const categoryCounts = useMemo(() => {
    const counts = { All: projects.length }
    for (const category of PROJECT_CATEGORIES) {
      if (category !== 'All') {
        counts[category] = projects.filter((project) => project.category === category).length
      }
    }
    return counts
  }, [])

  // Section header & initial grid scroll reveal
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        normal: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { reduceMotion } = context.conditions
        const headerEl = sectionRef.current?.querySelector('[data-projects-header]')
        const cards = gridRef.current?.querySelectorAll('[data-flip-id]')

        if (reduceMotion) {
          if (headerEl) gsap.set(headerEl, { clearProps: 'all' })
          if (cards?.length) gsap.set(cards, { clearProps: 'transform,opacity' })
          return
        }

        if (headerEl) {
          gsap.fromTo(
            headerEl,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: MOTION_DURATION.section,
              ease: MOTION_EASE.reveal,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 84%',
                once: true,
              },
            }
          )
        }

        if (cards?.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.44,
              stagger: 0.032,
              ease: MOTION_EASE.reveal,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 86%',
                once: true,
              },
            }
          )
        }
      },
      sectionRef
    )

    return () => mm.revert()
  }, [])

  // Initialize quickTo trailing followers once the floating preview node mounts
  useLayoutEffect(() => {
    const previewEl = floatingPreviewRef.current
    if (!previewEl || !previewState) return undefined

    const { x, y } = previewCoordsRef.current
    const reduced = prefersReducedMotion()

    previewQuickXRef.current = gsap.quickTo(previewEl, 'x', {
      duration: reduced ? 0 : 0.28,
      ease: MOTION_EASE.reveal,
    })
    previewQuickYRef.current = gsap.quickTo(previewEl, 'y', {
      duration: reduced ? 0 : 0.28,
      ease: MOTION_EASE.reveal,
    })

    const ctx = gsap.context(() => {
      gsap.set(previewEl, { x, y })
      if (!reduced) {
        gsap.fromTo(
          previewEl,
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.18,
            ease: MOTION_EASE.ui,
            overwrite: 'auto',
          }
        )
      } else {
        gsap.set(previewEl, { opacity: 1, scale: 1 })
      }
    }, floatingPreviewRef)

    return () => {
      previewQuickXRef.current = null
      previewQuickYRef.current = null
      ctx.revert()
    }
  }, [previewState])

  // Dismiss floating preview automatically on scroll or Escape
  useEffect(() => {
    if (!previewState) return undefined
    const dismiss = () => setPreviewState(null)
    const onKeyDown = (event) => {
      if (event.key === 'Escape') dismiss()
    }
    window.addEventListener('scroll', dismiss, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('scroll', dismiss)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [previewState])

  const handlePreviewShow = useCallback((project, { x, y, mode }) => {
    if (mode === 'pointer' && !supportsFinePointer()) return
    if (mode === 'keyboard' && isCompactViewport()) return

    const clamped = clampPreviewPosition(x, y, mode)
    previewCoordsRef.current = clamped
    setPreviewState((prev) => (prev?.slug === project.slug ? prev : project))

    if (previewQuickXRef.current && previewQuickYRef.current) {
      previewQuickXRef.current(clamped.x)
      previewQuickYRef.current(clamped.y)
    }
  }, [])

  const handlePreviewMove = useCallback((rawX, rawY) => {
    if (!previewQuickXRef.current || !previewQuickYRef.current) return
    const clamped = clampPreviewPosition(rawX, rawY, 'pointer')
    previewCoordsRef.current = clamped
    previewQuickXRef.current(clamped.x)
    previewQuickYRef.current(clamped.y)
  }, [])

  const handlePreviewHide = useCallback(() => {
    setPreviewState(null)
  }, [])

  // Position & glide the single active tab indicator
  const updateTabIndicator = useCallback(
    (immediate = false) => {
      const indicator = tabIndicatorRef.current
      const activeTab = tabRefs.current[activeCategory]
      if (!indicator || !activeTab) return

      const reduced = prefersReducedMotion()
      const targetX = activeTab.offsetLeft
      const targetY = activeTab.offsetTop + activeTab.offsetHeight - 2
      const targetWidth = activeTab.offsetWidth

      if (!hasTabIndicatorInitRef.current || immediate || reduced) {
        hasTabIndicatorInitRef.current = true
        gsap.set(indicator, {
          x: targetX,
          y: targetY,
          width: targetWidth,
          opacity: 1,
        })
        return
      }

      gsap.to(indicator, {
        x: targetX,
        y: targetY,
        width: targetWidth,
        opacity: 1,
        duration: 0.28,
        ease: MOTION_EASE.reveal,
        overwrite: 'auto',
      })
    },
    [activeCategory]
  )

  useLayoutEffect(() => {
    updateTabIndicator(false)
  }, [updateTabIndicator])

  useEffect(() => {
    const tablist = tablistRef.current
    if (!tablist || typeof ResizeObserver === 'undefined') return undefined

    const observer = new ResizeObserver(() => {
      updateTabIndicator(true)
    })
    observer.observe(tablist)
    return () => observer.disconnect()
  }, [updateTabIndicator])

  // Synchronized category change capturing Flip First state before React updates layout
  const selectCategory = useCallback(
    (nextCategory) => {
      if (nextCategory === activeCategory) return
      setPreviewState(null)

      if (!prefersReducedMotion() && gridRef.current) {
        if (flipTweenRef.current) {
          flipTweenRef.current.progress(1).kill()
          flipTweenRef.current = null
        }

        const cards = gridRef.current.querySelectorAll('[data-flip-id]')
        gsap.killTweensOf(cards)
        pendingFlipStateRef.current = Flip.getState(cards)
      } else {
        pendingFlipStateRef.current = null
      }

      setActiveCategory(nextCategory)
    },
    [activeCategory]
  )

  // Play GSAP FLIP animation right after DOM updates
  useLayoutEffect(() => {
    const state = pendingFlipStateRef.current
    pendingFlipStateRef.current = null
    if (!state || !gridRef.current || prefersReducedMotion()) return undefined

    const gridEl = gridRef.current
    const cards = gridEl.querySelectorAll('[data-flip-id]')
    const compact = isCompactViewport()
    const flipDuration = compact ? MOTION_DURATION.projectFlipMobile : MOTION_DURATION.projectFlip

    flipTweenRef.current = Flip.from(state, {
      targets: cards,
      duration: flipDuration,
      ease: MOTION_EASE.flip,
      absolute: true,
      nested: true,
      prune: true,
      scale: false,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, y: compact ? 8 : 11 },
          {
            opacity: 1,
            y: 0,
            duration: flipDuration,
            stagger: 0.038,
            ease: MOTION_EASE.reveal,
            clearProps: 'transform,opacity',
          }
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          opacity: 0,
          scale: 0.98,
          duration: 0.2,
          ease: MOTION_EASE.ui,
        }),
      onComplete: () => {
        gsap.set(cards, {
          clearProps: 'transform,opacity,position,top,left,width,height,margin,zIndex,scale,x,y',
        })
        flipTweenRef.current = null
      },
    })

    return () => {
      if (flipTweenRef.current) {
        flipTweenRef.current.progress(1).kill()
        flipTweenRef.current = null
      }
    }
  }, [activeCategory])

  const handleTabKeyDown = (event, index) => {
    let nextIndex = null
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % PROJECT_CATEGORIES.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + PROJECT_CATEGORIES.length) % PROJECT_CATEGORIES.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = PROJECT_CATEGORIES.length - 1
    }

    if (nextIndex !== null) {
      event.preventDefault()
      const nextCategory = PROJECT_CATEGORIES[nextIndex]
      selectCategory(nextCategory)
      tabRefs.current[nextCategory]?.focus()
    }
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 max-w-6xl mx-auto relative"
    >
      <ElasticDivider />
      <div className="space-y-12">
        {/* Header & Category Tabs */}
        <div
          data-projects-header
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-900 pb-6"
        >
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              <ScrambleLabel text="[ Portfolio Work ]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Projects Built.
            </h2>
          </div>

          {/* Underline Category Tabs with Single Sliding Indicator */}
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Project categories"
            className="relative flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 pb-1 font-mono text-xs select-none"
          >
            {PROJECT_CATEGORIES.map((category, index) => {
              const isActive = activeCategory === category
              const count = categoryCounts[category] ?? 0
              return (
                <button
                  key={category}
                  ref={(el) => {
                    tabRefs.current[category] = el
                  }}
                  type="button"
                  role="tab"
                  id={`project-tab-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  aria-selected={isActive}
                  aria-controls="projects-grid-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectCategory(category)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`relative pb-2.5 whitespace-nowrap cursor-pointer transition-colors duration-150 tracking-wider uppercase active:scale-[0.98] ${
                    isActive
                      ? 'text-zinc-950 dark:text-white font-medium'
                      : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                  }`}
                >
                  <span>
                    {category}{' '}
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                      ({count})
                    </span>
                  </span>
                </button>
              )
            })}

            <span
              ref={tabIndicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-0.5 bg-zinc-950 dark:bg-white opacity-0"
            />
          </div>
        </div>

        {/* Equal-Sized 3-Column Project Grid */}
        <div
          id="projects-grid-panel"
          ref={gridRef}
          role="tabpanel"
          aria-labelledby={`project-tab-${activeCategory.replace(/\s+/g, '-').toLowerCase()}`}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch auto-rows-fr"
        >
          {projects.map((project) => {
            const isMatch = activeCategory === 'All' || project.category === activeCategory
            return (
              <ProjectCard
                key={project.slug}
                project={project}
                isVisible={isMatch}
                isSharedTransitionActive={transitionProjectSlug === project.slug}
                onOpenCaseStudy={onOpenCaseStudy}
                onPreviewShow={handlePreviewShow}
                onPreviewMove={handlePreviewMove}
                onPreviewHide={handlePreviewHide}
              />
            )
          })}
        </div>
      </div>

      {/* Floating Pointer-Trailing / Keyboard Preview (non-blocking pointer-events-none) */}
      {previewState && (
        <div
          ref={floatingPreviewRef}
          aria-hidden="true"
          data-floating-project-preview={previewState.slug}
          className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block w-[264px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-2xl dark:shadow-black/80 will-change-transform"
        >
          <div
            className={`aspect-[16/10] w-full overflow-hidden rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 ${
              previewState.imageFit === 'contain'
                ? 'bg-zinc-100 dark:bg-zinc-900 p-2 flex items-center justify-center'
                : 'bg-zinc-100 dark:bg-zinc-900'
            }`}
          >
            <img
              src={previewState.image}
              alt=""
              className={
                previewState.imageFit === 'contain'
                  ? `max-w-full max-h-full object-contain ${
                      previewState.isAppIcon ? 'rounded-xl bg-white p-1 max-h-[84%]' : 'rounded'
                    }`
                  : 'w-full h-full object-cover object-top'
              }
            />
          </div>
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-[10px] font-mono">
            <span className="truncate font-medium text-zinc-900 dark:text-white">
              {previewState.title}
            </span>
            <span className="inline-flex items-center gap-0.5 shrink-0 uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
              View Project
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
