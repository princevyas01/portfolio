import { Code, Layers, Database, Cpu, Compass } from 'lucide-react'
import { skillCategories, exploringSkills } from '../data/skills'
import { useInView } from '../hooks/useInView'

const categoryIcons = {
  programming: Code,
  development: Layers,
  databases: Database,
  'applied-ai': Cpu,
}

export default function Skills() {
  const [sectionRef, isVisible] = useInView({ threshold: 0.08 })
  const revealClass = isVisible ? 'reveal-item is-visible' : 'reveal-item'

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900"
    >
      <div className="space-y-12">
        {/* Section Heading */}
        <div className={`space-y-4 max-w-xl ${revealClass}`}>
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            [ Technical Toolkit ]
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Skills &amp; Technical Stack.
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            Languages, frameworks, local databases, and AI tooling used across shipped applications and engineering prototypes.
          </p>
        </div>

        {/* Core Skill Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillCategories.map((category, index) => {
            const Icon = categoryIcons[category.id] || Code
            return (
              <div
                key={category.id}
                className={`p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/30 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors duration-150 flex flex-col ${revealClass}`}
                style={{ '--reveal-delay': `${60 + index * 45}ms` }}
              >
                <div className="flex items-center gap-2.5 border-b border-zinc-200/80 dark:border-zinc-900 pb-3 mb-4">
                  <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                  <h3 className="text-xs font-mono text-zinc-900 dark:text-white tracking-wider uppercase font-medium">
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-mono rounded border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Separate Exploring Subsection */}
        <div
          className={`p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-zinc-100/60 dark:bg-zinc-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 ${revealClass}`}
          style={{ '--reveal-delay': '240ms' }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <Compass className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <h3 className="text-xs font-mono text-zinc-900 dark:text-white uppercase tracking-wider font-medium">
                {exploringSkills.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light">
              {exploringSkills.note}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {exploringSkills.items.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 text-xs font-mono rounded border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
