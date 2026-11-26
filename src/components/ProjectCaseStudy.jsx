import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, ExternalLink } from 'lucide-react'
import { projects } from '../data/projects'
import { GithubIcon } from './icons'
import { attachPointerParallax, gsap, MOTION_EASE, prefersReducedMotion } from '../lib/motion'

export default function ProjectCaseStudy({ project, onBack, onSelectProject }) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [showMetrics, setShowMetrics] = useState(false)
  const articleRef = useRef(null)
  const showcaseFrameRef = useRef(null)
  const showcaseImageRef = useRef(null)
  const viewTabContainerRef = useRef(null)
  const viewTabRefs = useRef({})
  const viewPillRef = useRef(null)
  const hasViewPillInitRef = useRef(false)

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
          gsap.set('[data-case-header], [data-case-media], [data-case-section]', {
            clearProps: 'all',
          })
          return
        }

        const tl = gsap.timeline()

        tl.fromTo(
          '[data-case-header]',
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.44,
            ease: MOTION_EASE.reveal,
            clearProps: 'transform,opacity',
          },
          0
        )

        tl.fromTo(
          '[data-case-media]',
          { opacity: 0, y: 12, scale: 0.99 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.48,
            ease: MOTION_EASE.reveal,
            clearProps: 'transform,opacity',
          },
          0.08
        )

        gsap.utils.toArray('[data-case-section]', articleRef.current).forEach((sectionEl) => {
          gsap.fromTo(
            sectionEl,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.44,
              ease: MOTION_EASE.ui,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: sectionEl,
                start: 'top 88%',
                once: true,
              },
            }
          )
        })
      },
      articleRef
    )

    return () => mm.revert()
  }, [project?.slug])

  // Subtle crossfade/settle when switching gallery screenshots
  useLayoutEffect(() => {
    const imgEl = showcaseImageRef.current
    if (!imgEl || prefersReducedMotion() || selectedMediaIndex === 0) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgEl,
        { opacity: 0.4, scale: 0.992 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.24,
          ease: MOTION_EASE.ui,
          clearProps: 'transform,opacity',
        }
      )
    }, showcaseImageRef)

    return () => ctx.revert()
  }, [selectedMediaIndex])

  const galleryList =
    project?.gallery && project.gallery.length > 0
      ? project.gallery
      : project
      ? [
          {
            src: project.image,
            alt: project.imageAlt,
            caption: project.title,
            isChart: project.imageFit === 'contain',
          },
        ]
      : []

  const activeMediaIsChart = Boolean(
    (galleryList[selectedMediaIndex] || galleryList[0])?.isChart
  )

  useEffect(() => {
    if (!project || activeMediaIsChart) return undefined
    return attachPointerParallax(showcaseFrameRef.current, showcaseImageRef.current, {
      range: 3.5,
      hoverScale: 1.022,
      duration: 0.36,
    })
  }, [project, activeMediaIsChart, selectedMediaIndex])

  const updateViewPill = useCallback(
    (immediate = false) => {
      const pill = viewPillRef.current
      const activeBtn = viewTabRefs.current[selectedMediaIndex]
      if (!pill || !activeBtn) return

      const reduced = prefersReducedMotion()
      const target = {
        x: activeBtn.offsetLeft,
        y: activeBtn.offsetTop,
        width: activeBtn.offsetWidth,
        height: activeBtn.offsetHeight,
      }

      if (!hasViewPillInitRef.current || immediate || reduced) {
        hasViewPillInitRef.current = true
        gsap.set(pill, { ...target, opacity: 1 })
        return
      }

      gsap.to(pill, {
        ...target,
        opacity: 1,
        duration: 0.24,
        ease: MOTION_EASE.reveal,
        overwrite: 'auto',
      })
    },
    [selectedMediaIndex]
  )

  useLayoutEffect(() => {
    updateViewPill(false)
  }, [updateViewPill])

  useEffect(() => {
    const container = viewTabContainerRef.current
    if (!container || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => updateViewPill(true))
    observer.observe(container)
    return () => observer.disconnect()
  }, [updateViewPill])

  if (!project) {
    return (
      <section className="py-32 px-6 max-w-4xl mx-auto min-h-[70vh] flex flex-col justify-center items-start gap-6">
        <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          [ Project Not Found ]
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
          That case study route could not be found.
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-4 py-2.5 rounded transition-[background-color,transform] duration-150 cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </button>
      </section>
    )
  }

  const gallery =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : [
          {
            src: project.image,
            alt: project.imageAlt,
            caption: project.title,
            isChart: project.imageFit === 'contain',
          },
        ]

  const currentMedia = gallery[selectedMediaIndex] || gallery[0]
  const currentIndex = projects.findIndex((item) => item.slug === project.slug)
  const prevProject =
    projects[(currentIndex - 1 + projects.length) % projects.length]
  const nextProject = projects[(currentIndex + 1) % projects.length]

  const { caseStudy } = project

  return (
    <article ref={articleRef} className="py-28 md:py-32 px-6 max-w-4xl mx-auto">
      <div className="space-y-12">
        {/* Back Link & Header */}
        <header
          data-case-header
          className="space-y-6 border-b border-zinc-200 dark:border-zinc-900 pb-8"
        >
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
            Back to Projects
          </button>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider text-zinc-500">
            <span>[ {project.category} ]</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-2xl">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 px-4 py-2.5 rounded transition-[color,border-color,transform] duration-150 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              GitHub Repository
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-4 py-2.5 rounded font-medium transition-[background-color,transform] duration-150 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </a>
            )}
          </div>
        </header>

        {/* Visual Showcase */}
        <section data-case-media aria-label="Project visuals" className="space-y-4">
          <div
            ref={showcaseFrameRef}
            data-case-shared-image={project.slug}
            style={{ viewTransitionName: 'project-hero-image' }}
            className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 ${
              currentMedia.isChart
                ? 'bg-white p-3 sm:p-5 flex items-center justify-center'
                : 'bg-zinc-100 dark:bg-zinc-950'
            }`}
          >
            <img
              ref={showcaseImageRef}
              key={currentMedia.src}
              src={currentMedia.src}
              alt={currentMedia.alt}
              className={
                currentMedia.isChart
                  ? 'max-w-full max-h-full object-contain'
                  : 'w-full h-full object-cover object-top will-change-transform select-none'
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs font-mono text-zinc-500">{currentMedia.caption}</p>
            {gallery.length > 1 && (
              <div
                ref={viewTabContainerRef}
                className="relative flex flex-wrap gap-1.5 p-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950/70 self-start sm:self-auto"
              >
                <span
                  ref={viewPillRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 rounded bg-zinc-900 dark:bg-white opacity-0"
                />
                {gallery.map((item, idx) => (
                  <button
                    key={item.src}
                    ref={(el) => {
                      viewTabRefs.current[idx] = el
                    }}
                    type="button"
                    onClick={() => setSelectedMediaIndex(idx)}
                    aria-pressed={selectedMediaIndex === idx}
                    className={`relative z-10 px-2.5 py-1 text-[11px] font-mono rounded transition-colors duration-150 cursor-pointer active:scale-[0.97] ${
                      selectedMediaIndex === idx
                        ? 'text-white dark:text-black font-medium'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    View {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Streamlined 5-Section Case Study */}
        <div className="space-y-10">
          {/* 1. Overview */}
          <section
            data-case-section
            className="space-y-3 border-t border-zinc-200 dark:border-zinc-900 pt-8"
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              [ 01 · Overview ]
            </h2>
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
              {caseStudy.overview}
            </p>
          </section>

          {/* 2. What I Built */}
          <section
            data-case-section
            className="space-y-3 border-t border-zinc-200 dark:border-zinc-900 pt-8"
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              [ 02 · What I Built ]
            </h2>
            <ul className="space-y-2.5">
              {caseStudy.whatIBuilt.map((item) => (
                <li
                  key={item}
                  className="text-sm text-zinc-600 dark:text-zinc-400 font-light flex items-start gap-3 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Technology */}
          <section
            data-case-section
            className="space-y-4 border-t border-zinc-200 dark:border-zinc-900 pt-8"
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              [ 03 · Technology ]
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseStudy.technology.map((tech) => (
                <div
                  key={tech.name}
                  className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/60 dark:bg-zinc-950/40"
                >
                  <div className="text-xs font-mono font-semibold text-zinc-900 dark:text-white">
                    {tech.name}
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    {tech.role}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Interesting Technical Work */}
          <section
            data-case-section
            className="space-y-4 border-t border-zinc-200 dark:border-zinc-900 pt-8"
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              [ 04 · Interesting Technical Work ]
            </h2>
            <ul className="space-y-2.5">
              {caseStudy.interestingTechnicalWork.map((item) => (
                <li
                  key={item}
                  className="text-sm text-zinc-600 dark:text-zinc-400 font-light flex items-start gap-3 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {caseStudy.expandableMetrics && caseStudy.expandableMetrics.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowMetrics((prev) => !prev)}
                  aria-expanded={showMetrics}
                  className="inline-flex items-center gap-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded transition-colors duration-150 cursor-pointer active:scale-[0.98]"
                >
                  <span>{caseStudy.expandableTitle || 'Technical Benchmarks'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${
                      showMetrics ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {showMetrics && (
                  <div className="feedback-enter mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/60">
                    {caseStudy.expandableMetrics.map((metric) => (
                      <div key={metric.label} className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          {metric.label}
                        </span>
                        <span className="text-xs font-mono font-medium text-zinc-900 dark:text-white">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 5. Links and Results */}
          <section
            data-case-section
            className="space-y-4 border-t border-zinc-200 dark:border-zinc-900 pt-8"
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              [ 05 · Links &amp; Results ]
            </h2>
            <ul className="space-y-2">
              {caseStudy.results.map((result) => (
                <li
                  key={result}
                  className="text-sm text-zinc-700 dark:text-zinc-300 font-light flex items-start gap-3 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{result}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 rounded transition-[color,border-color,transform] duration-150 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                View Source on GitHub
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-4 py-2 rounded transition-[background-color,transform] duration-150 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Live Demo
                </a>
              )}
            </div>
          </section>
        </div>

        {/* Previous / Next Navigation */}
        <nav
          data-case-section
          aria-label="Project navigation"
          className="border-t border-zinc-200 dark:border-zinc-900 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <a
            href={`/projects/${prevProject.slug}`}
            onClick={(event) => {
              event.preventDefault()
              setSelectedMediaIndex(0)
              setShowMetrics(false)
              onSelectProject(prevProject.slug)
            }}
            className="project-card-surface group p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/60 dark:bg-zinc-950/40 flex flex-col gap-1"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              <ArrowLeft className="w-3 h-3 transition-transform duration-150 group-hover:-translate-x-1" />
              Previous Project
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              {prevProject.title}
            </span>
          </a>

          <a
            href={`/projects/${nextProject.slug}`}
            onClick={(event) => {
              event.preventDefault()
              setSelectedMediaIndex(0)
              setShowMetrics(false)
              onSelectProject(nextProject.slug)
            }}
            className="project-card-surface group p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/60 dark:bg-zinc-950/40 flex flex-col items-start sm:items-end gap-1"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Next Project
              <ArrowRight className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-1" />
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              {nextProject.title}
            </span>
          </a>
        </nav>
      </div>
    </article>
  )
}
