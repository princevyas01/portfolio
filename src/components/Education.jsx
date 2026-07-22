import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'

const educationList = [
  {
    degree: 'B.Tech in Computer Engineering',
    institution: "Marathwada Mitra Mandal's College of Engineering (MMCOE), Pune",
    period: '2024 — 2028',
    description: 'Focusing on computer science fundamentals, engineering systems, and developing advanced technical capabilities.',
    highlights: [
      'First Year CGPA: 8.59',
      'Building foundations in Programming, Data Structures, Databases, and Software Development',
      'Exploring Artificial Intelligence and Machine Learning',
      'Actively pursuing certifications and practical learning'
    ]
  },
  {
    degree: 'Higher Secondary Education (12th Grade)',
    institution: 'Dr. Kalmadi Shamarao Junior College, Pune',
    period: 'Completed 2024',
    description: 'Completed higher secondary education under the Science stream, focused on physics, chemistry, mathematics, and programming basics.',
    highlights: [
      'Score: 67.67%'
    ]
  },
  {
    degree: 'Secondary Education (10th Grade)',
    institution: 'P. Jog English Medium School, Pune',
    period: 'Completed 2022',
    description: 'Completed secondary education with a strong academic performance in science, mathematics, and computing foundations.',
    highlights: [
      'Score: 88.20%'
    ]
  }
]

export default function Education() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section id="education" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Side: Title */}
        <div className="lg:col-span-4 space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            [ Education History ]
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Academic Timeline.
          </h2>
          <p className="text-sm text-zinc-550 dark:text-zinc-500 font-light leading-relaxed max-w-xs">
            A history of academic learning, score milestones, and core engineering fundamentals.
          </p>
        </div>

        {/* Right Side: Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="lg:col-span-8 relative border-l border-zinc-200 dark:border-zinc-900 pl-6 md:pl-8 ml-2 space-y-12"
        >
          {educationList.map((edu, index) => (
            <motion.div
              key={`${edu.degree}-${edu.institution}`}
              variants={itemVariants}
              className="relative group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-black group-hover:bg-zinc-950 dark:group-hover:bg-white group-hover:border-zinc-950 dark:group-hover:border-white transition-colors duration-300" />

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">{edu.degree}</h3>
                    <span className="text-xs font-mono text-zinc-500">@ {edu.institution}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 sm:text-right">{edu.period}</span>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                  {edu.description}
                </p>

                <ul className="space-y-1.5 pt-1">
                  {edu.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-xs text-zinc-500 font-light flex items-start gap-2.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-850 mt-1.5 shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
