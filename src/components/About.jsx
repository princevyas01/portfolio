import { Code2, Compass, Cpu, MapPin } from 'lucide-react'
import { profile } from '../data/profile'
import { useInView } from '../hooks/useInView'

const highlightIcons = [Cpu, Compass, Code2, MapPin]

export default function About() {
  const [sectionRef, isVisible] = useInView({ threshold: 0.08 })
  const revealClass = isVisible ? 'reveal-item is-visible' : 'reveal-item'

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div
              className={`font-mono text-xs uppercase tracking-widest text-zinc-500 ${revealClass}`}
            >
              [ About Me ]
            </div>
            <h2
              className={`text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight ${revealClass}`}
              style={{ '--reveal-delay': '40ms' }}
            >
              {profile.about.heading}
            </h2>
            <div
              className={`space-y-4 text-zinc-600 dark:text-zinc-400 font-light leading-relaxed ${revealClass}`}
              style={{ '--reveal-delay': '80ms' }}
            >
              {profile.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Languages & Strengths */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-zinc-200 dark:border-zinc-900 ${revealClass}`}
            style={{ '--reveal-delay': '120ms' }}
          >
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                [ Languages ]
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.about.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 text-xs font-mono"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {lang.name}
                    </span>
                    <span className="text-[10px] text-zinc-500">({lang.level})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                [ Strengths ]
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.about.strengths.map((strength) => (
                  <div
                    key={strength}
                    className="flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 text-xs text-zinc-800 dark:text-zinc-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-mono text-[11px]">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-10">
          <div
            className={`space-y-3.5 ${revealClass}`}
            style={{ '--reveal-delay': '100ms' }}
          >
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              [ Focus &amp; Direction ]
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.about.highlights.map((item, index) => {
                const Icon = highlightIcons[index] || Cpu
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3.5 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/30 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors duration-150 group"
                  >
                    <div className="p-2.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-white group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-150 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-zinc-950 dark:text-white font-mono leading-snug">
                        {item.value}
                      </span>
                      <span className="block text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wider">
                        {item.label}
                      </span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div
            className={`space-y-3.5 ${revealClass}`}
            style={{ '--reveal-delay': '150ms' }}
          >
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              [ Technical Interests ]
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.about.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center text-xs font-mono text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3 py-1.5 rounded hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors duration-150"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
