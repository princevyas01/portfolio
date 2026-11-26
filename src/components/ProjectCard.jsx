import { useEffect, useRef } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from './icons'
import { attachMagnetic, attachPointerParallax, attachSpotlight } from '../lib/motion'

export default function ProjectCard({
  project,
  onOpenCaseStudy,
  isVisible = true,
  isSharedTransitionActive = false,
  onPreviewShow,
  onPreviewMove,
  onPreviewHide,
}) {
  const cardRef = useRef(null)
  const mediaFrameRef = useRef(null)
  const mediaImgRef = useRef(null)
  const caseStudyLinkRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return undefined

    const cleanups = [
      attachSpotlight(cardRef.current),
      attachPointerParallax(mediaFrameRef.current, mediaImgRef.current, {
        range: 4,
        hoverScale: 1.032,
        duration: 0.34,
      }),
      attachMagnetic(caseStudyLinkRef.current, {
        strength: 4.5,
        innerStrength: 1.5,
        duration: 0.3,
      }),
    ]

    return () => cleanups.forEach((fn) => fn())
  }, [isVisible])

  const handleCaseStudy = (event) => {
    event.preventDefault()
    onPreviewHide?.()
    onOpenCaseStudy(project.slug)
  }

  const handleTriggerPointerEnter = (event) => {
    if (event.pointerType === 'touch') return
    onPreviewShow?.(project, { x: event.clientX, y: event.clientY, mode: 'pointer' })
  }

  const handleTriggerPointerMove = (event) => {
    if (event.pointerType === 'touch') return
    onPreviewMove?.(event.clientX, event.clientY)
  }

  const handleTriggerPointerLeave = () => {
    onPreviewHide?.()
  }

  const handleTriggerFocus = (event) => {
    // Only show keyboard floating preview when focus enters via keyboard navigation
    if (event.currentTarget.matches(':focus-visible')) {
      const rect = event.currentTarget.getBoundingClientRect()
      onPreviewShow?.(project, {
        x: rect.right,
        y: rect.top,
        mode: 'keyboard',
      })
    }
  }

  const handleTriggerBlur = () => {
    onPreviewHide?.()
  }

  return (
    <article
      ref={cardRef}
      data-flip-id={project.slug}
      hidden={!isVisible}
      aria-hidden={!isVisible}
      style={isVisible ? undefined : { display: 'none' }}
      className="spotlight-card project-card-surface group flex flex-col h-full rounded-xl border border-zinc-200 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-950/60 hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden"
    >
      {/* Pointer-Reactive Fixed Media Frame & Shared View Transition Target */}
      <a
        ref={mediaFrameRef}
        href={`/projects/${project.slug}`}
        onClick={handleCaseStudy}
        tabIndex={isVisible ? 0 : -1}
        aria-label={`Open ${project.title} case study`}
        data-shared-project-media={project.slug}
        style={
          isSharedTransitionActive && isVisible
            ? { viewTransitionName: 'project-hero-image' }
            : undefined
        }
        className={`relative aspect-[16/10] w-full overflow-hidden border-b border-zinc-200 dark:border-zinc-800/80 block shrink-0 ${
          project.imageFit === 'contain'
            ? 'bg-zinc-100 dark:bg-zinc-950 p-3 flex items-center justify-center'
            : 'bg-zinc-100 dark:bg-zinc-900'
        }`}
      >
        <img
          ref={mediaImgRef}
          src={project.image}
          alt={project.imageAlt}
          decoding="async"
          className={
            project.imageFit === 'contain'
              ? `max-w-full max-h-full object-contain will-change-transform select-none ${
                  project.isAppIcon ? 'rounded-2xl bg-white p-1 shadow-sm max-h-[84%]' : 'rounded-md'
                }`
              : 'w-full h-full object-cover object-top will-change-transform select-none'
          }
        />
      </a>

      {/* Equal-Height Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category & Year */}
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>

        {/* Title (triggers floating project preview on hover / keyboard focus) */}
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-950 dark:text-white leading-snug">
          <a
            href={`/projects/${project.slug}`}
            onClick={handleCaseStudy}
            onPointerEnter={handleTriggerPointerEnter}
            onPointerMove={handleTriggerPointerMove}
            onPointerLeave={handleTriggerPointerLeave}
            onFocus={handleTriggerFocus}
            onBlur={handleTriggerBlur}
            tabIndex={isVisible ? 0 : -1}
            className="inline-block hover:underline underline-offset-4 decoration-zinc-400 dark:decoration-zinc-600"
          >
            {project.title}
          </a>
        </h3>

        {/* Concise Description */}
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Bottom-Aligned Metadata & Actions */}
        <div className="mt-auto pt-4">
          {/* Max 4 Technology Labels */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[11px] font-mono rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="mt-4 pt-3.5 border-t border-zinc-200/80 dark:border-zinc-900 flex items-center justify-between gap-3">
            <a
              ref={caseStudyLinkRef}
              href={`/projects/${project.slug}`}
              onClick={handleCaseStudy}
              onPointerEnter={handleTriggerPointerEnter}
              onPointerMove={handleTriggerPointerMove}
              onPointerLeave={handleTriggerPointerLeave}
              onFocus={handleTriggerFocus}
              onBlur={handleTriggerBlur}
              tabIndex={isVisible ? 0 : -1}
              className="project-card-link inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-950 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150"
            >
              <span data-magnetic-inner className="inline-flex items-center gap-1.5">
                <span>Case Study</span>
                <ArrowRight className="project-card-arrow w-3.5 h-3.5" />
              </span>
            </a>

            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={isVisible ? 0 : -1}
                  aria-label={`${project.title} live demo`}
                  className="inline-flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Demo</span>
                </a>
              )}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                tabIndex={isVisible ? 0 : -1}
                aria-label={`${project.title} GitHub repository`}
                className="inline-flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
