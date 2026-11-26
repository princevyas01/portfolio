import { useMemo, useRef, useState } from 'react'
import { PROJECT_CATEGORIES, projects } from '../data/projects'
import { useInView } from '../hooks/useInView'
import ProjectCard from './ProjectCard'

export default function Projects({ onOpenCaseStudy }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const tabRefs = useRef({})
  const [sectionRef, isVisible] = useInView({ threshold: 0.06 })
  const revealClass = isVisible ? 'reveal-item is-visible' : 'reveal-item'

  const categoryCounts = useMemo(() => {
    const counts = { All: projects.length }
    for (const category of PROJECT_CATEGORIES) {
      if (category !== 'All') {
        counts[category] = projects.filter((project) => project.category === category).length
      }
    }
    return counts
  }, [])

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((project) => project.category === activeCategory)
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
      setActiveCategory(nextCategory)
      tabRefs.current[nextCategory]?.focus()
    }
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900"
    >
      <div className="space-y-12">
        {/* Header & Category Tabs */}
        <div
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-900 pb-6 ${revealClass}`}
        >
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              [ Portfolio Work ]
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Projects Built.
            </h2>
          </div>

          {/* Underline Category Tabs */}
          <div
            role="tablist"
            aria-label="Project categories"
            className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pb-1 font-mono text-xs select-none"
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
                  onClick={() => setActiveCategory(category)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`relative pb-2.5 whitespace-nowrap cursor-pointer transition-colors duration-150 tracking-wider uppercase ${
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
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 bottom-0 h-0.5 bg-zinc-950 dark:bg-white origin-left transition-transform duration-200 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Equal-Sized 3-Column Project Grid */}
        <div
          id="projects-grid-panel"
          role="tabpanel"
          aria-labelledby={`project-tab-${activeCategory.replace(/\s+/g, '-').toLowerCase()}`}
          key={activeCategory}
          className="project-grid-enter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch auto-rows-fr"
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onOpenCaseStudy={onOpenCaseStudy}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
