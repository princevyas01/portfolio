import { GraduationCap } from 'lucide-react'
import { educationTimeline } from '../data/experience'
import { useInView } from '../hooks/useInView'
import AnimatedScore from './AnimatedScore'

export default function Education() {
  const [sectionRef, isVisible] = useInView({ threshold: 0.1, once: true })
  const revealClass = isVisible ? 'reveal-item is-visible' : 'reveal-item'

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className={`lg:col-span-4 space-y-4 ${revealClass}`}>
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>[ Education History ]</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Academic Timeline.
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-xs">
            Chronological academic progression, institutions, and verified academic scores.
          </p>
        </div>

        {/* Right Column: Vertical Timeline */}
        <div className="lg:col-span-8 relative pl-7 sm:pl-9 ml-1.5">
          {/* Base Track */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-900"
          />
          {/* Animated Progress Fill */}
          <div
            aria-hidden="true"
            className={`timeline-progress-line absolute left-0 top-2 bottom-2 w-px bg-zinc-900 dark:bg-zinc-300 ${
              isVisible ? 'is-visible' : ''
            }`}
          />

          <ol className="space-y-9">
            {educationTimeline.map((entry, index) => {
              const verifiedSemesters = (entry.semesters || []).filter(
                (sem) => sem.verified && typeof sem.sgpa === 'number'
              )

              return (
                <li
                  key={entry.id}
                  className={`relative group ${revealClass}`}
                  style={{ '--reveal-delay': `${80 + index * 95}ms` }}
                >
                  {/* Timeline Node */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[34px] sm:-left-[42px] top-1.5 w-3.5 h-3.5 rounded-full border transition-colors duration-300 flex items-center justify-center ${
                      isVisible
                        ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-black'
                        : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-black'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-transform duration-300 ${
                        isVisible
                          ? 'bg-emerald-500 scale-100'
                          : 'bg-zinc-400 scale-0'
                      }`}
                    />
                  </span>

                  <div className="space-y-3">
                    {/* Degree & Period Header */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4">
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white tracking-tight">
                        {entry.degree}
                      </h3>
                      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 whitespace-nowrap shrink-0">
                        {entry.period}
                      </span>
                    </div>

                    {/* Institution */}
                    <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      {entry.institution}
                    </div>

                    {/* Concise Summary */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-2xl">
                      {entry.summary}
                    </p>

                    {/* Verified Scores Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-lg">
                      {entry.scores.map((score) => (
                        <AnimatedScore
                          key={score.id}
                          label={score.label}
                          value={score.value}
                          decimals={score.decimals}
                          suffix={score.suffix}
                          scale={score.scale}
                          duration={900}
                        />
                      ))}
                    </div>

                    {/* Verified Semester SGPA Records (rendered only when verified records exist) */}
                    {verifiedSemesters.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          Verified Semester SGPA
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg">
                          {verifiedSemesters.map((sem) => (
                            <AnimatedScore
                              key={sem.semester}
                              label={sem.semester}
                              value={sem.sgpa}
                              decimals={2}
                              scale={`/ ${sem.scale || 10}`}
                              duration={850}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
