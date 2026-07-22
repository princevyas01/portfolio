import { motion } from 'framer-motion'
import { Code, Database, Sparkles } from 'lucide-react'

const skillCategories = [
  {
    title: 'Programming Languages',
    icon: Code,
    skills: ['Python', 'Java (Basic)', 'C (Basic)', 'C++ (Basic)'],
  },
  {
    title: 'Databases',
    icon: Database,
    skills: ['SQL (Basic)', 'MongoDB (Basic)'],
  },
  {
    title: 'Areas of Interest',
    icon: Sparkles,
    skills: [
      'Artificial Intelligence',
      'Machine Learning',
      'Data Analysis',
      'Emerging Technologies'
    ],
  },
]

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="skills" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900">
      <div className="space-y-16">
        {/* Section Heading */}
        <div className="space-y-4 max-w-xl">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">[ Technical Toolkit ]</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Current Abilities & Interests.
          </h2>
          <p className="text-sm text-zinc-550 dark:text-zinc-500 font-light leading-relaxed">
            A precise summary of the programming languages and databases I have actually worked with, along with my primary learning domains.
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                variants={itemVariants}
                className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/20 hover:border-zinc-350 dark:hover:border-zinc-800 transition-colors flex flex-col justify-between shadow-sm dark:shadow-none"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                    <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                    <h3 className="text-sm font-mono text-zinc-850 dark:text-white tracking-wider uppercase">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {category.skills.map((skill) => (
                      <li
                        key={skill}
                        className="text-xs text-zinc-600 dark:text-zinc-400 font-light flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-zinc-350 dark:bg-zinc-700" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
