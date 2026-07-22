import { motion } from 'framer-motion'
import { Award, BookOpen, GraduationCap, CheckCircle } from 'lucide-react'

const stats = [
  {
    label: 'Academic Performance',
    value: '8.59 CGPA',
    description: 'First Year Engineering',
    icon: GraduationCap,
  },
  {
    label: 'Focus Area',
    value: 'AI & ML',
    description: 'Self-paced exploration',
    icon: BookOpen,
  },
  {
    label: 'Skill Development',
    value: 'Continuous',
    description: 'Programming & Projects',
    icon: Award,
  },
  {
    label: 'Certifications Portfolio',
    value: 'Growing',
    description: 'Self-guided credentials',
    icon: CheckCircle,
  },
]

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section id="about" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
      >
        {/* Left Side: About Me, Languages & Strengths */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <motion.div variants={itemVariants} className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              [ About Me ]
            </motion.div>
            <motion.h2 
              variants={itemVariants} 
              className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight"
            >
              Driven by Curiosity, Focused on AI.
            </motion.h2>
            <motion.div variants={itemVariants} className="space-y-4 text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              <p>
                I am a Computer Engineering student based in Pune, India. Rather than just learning theoretical concepts, I believe in building projects, experimenting with new software, and constantly evolving my toolkit.
              </p>
              <p>
                With a primary interest in Artificial Intelligence and Machine Learning, I spend my time outside the classroom writing scripts, analyzing data, and exploring how intelligent technologies can solve real-world problems.
              </p>
            </motion.div>
          </div>

          {/* Languages & Strengths Subgrid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-150 dark:border-zinc-900/80">
            {/* Languages */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">[ Languages ]</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'English', desc: 'Professional' },
                  { name: 'Hindi', desc: 'Native' },
                  { name: 'Marathi', desc: 'Fluent' },
                  { name: 'Japanese', desc: 'Basic' },
                ].map((lang) => (
                  <div 
                    key={lang.name} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/40 text-xs font-mono"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{lang.name}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">({lang.desc})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">[ Strengths ]</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Communication',
                  'Adaptability',
                  'Continuous Learning',
                  'Team Collaboration',
                ].map((strength) => (
                  <div 
                    key={strength} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/40 text-xs text-zinc-800 dark:text-zinc-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-mono text-[11px]">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Stats & Interests */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-10">
          {/* Stats Cards */}
          <div className="space-y-3.5">
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">[ Academic Stats ]</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/20 hover:border-zinc-350 dark:hover:border-zinc-800 transition-colors group"
                  >
                    <div className="p-2.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-white group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-950 dark:text-white font-mono leading-tight">{stat.value}</span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{stat.label}</span>
                      </div>
                      <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-1 leading-normal">{stat.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Interests */}
          <motion.div variants={itemVariants} className="space-y-3.5">
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">[ Personal Interests ]</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Artificial Intelligence', icon: '🤖' },
                { name: 'Machine Learning', icon: '🧠' },
                { name: 'Reading', icon: '📚' },
                { name: 'Exploring Technologies', icon: '🔍' },
                { name: 'Travelling', icon: '✈️' },
                { name: 'Music', icon: '🎵' },
              ].map((interest) => (
                <span 
                  key={interest.name} 
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-700 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/40 px-3 py-1.5 rounded hover:border-zinc-350 dark:hover:border-zinc-800 transition-colors"
                >
                  <span>{interest.icon}</span>
                  <span>{interest.name}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
