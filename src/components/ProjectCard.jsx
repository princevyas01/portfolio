import { ArrowRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from './icons'

export default function ProjectCard({ project, onOpenCaseStudy }) {
  const handleCaseStudy = (event) => {
    event.preventDefault()
    onOpenCaseStudy(project.slug)
  }

  return (
    <article className="group flex flex-col h-full rounded-xl border border-zinc-200 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-950/60 hover:border-zinc-300 dark:hover:border-zinc-700 md:hover:-translate-y-0.5 transition-[border-color,transform] duration-200 ease-out overflow-hidden">
      {/* Consistent Media Frame */}
      <a
        href={`/projects/${project.slug}`}
        onClick={handleCaseStudy}
        aria-label={`Open ${project.title} case study`}
        className={`relative aspect-[16/10] w-full overflow-hidden border-b border-zinc-200 dark:border-zinc-800/80 block shrink-0 ${
          project.imageFit === 'contain'
            ? 'bg-zinc-100 dark:bg-zinc-950 p-3 flex items-center justify-center'
            : 'bg-zinc-100 dark:bg-zinc-900'
        }`}
      >
        <img
          src={project.image}
          alt={project.imageAlt}
          loading="lazy"
          className={
            project.imageFit === 'contain'
              ? `max-w-full max-h-full object-contain transition-transform duration-200 ease-out group-hover:scale-[1.018] ${
                  project.isAppIcon ? 'rounded-2xl bg-white p-1 shadow-sm max-h-[84%]' : 'rounded-md'
                }`
              : 'w-full h-full object-cover object-top transition-transform duration-200 ease-out group-hover:scale-[1.018]'
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

        {/* Title */}
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-950 dark:text-white leading-snug">
          <a
            href={`/projects/${project.slug}`}
            onClick={handleCaseStudy}
            className="hover:underline underline-offset-4 decoration-zinc-400 dark:decoration-zinc-600"
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
              href={`/projects/${project.slug}`}
              onClick={handleCaseStudy}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-950 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150 group/link"
            >
              <span>Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/link:translate-x-0.5" />
            </a>

            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
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
