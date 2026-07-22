import { motion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import profilePhoto from '../assets/profile.webp'

// EASILY UPDATE YOUR RESUME LINK HERE:
const RESUME_URL = '#'

// EASILY UPDATE YOUR SOCIAL LINKS HERE:
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/princevyas01', icon: GithubIcon },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/prince-vyas-545398353?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', icon: LinkedinIcon },
  { name: 'Resume', url: RESUME_URL, icon: FileText },
]

export default function Hero() {
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
        ease: [0.16, 1, 0.3, 1], // Custom elegant ease-out
      },
    },
  }

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center relative pt-24 px-6 max-w-6xl mx-auto"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col justify-between flex-grow py-6 md:py-8"
      >
        {/* Hero Central Grid (Text Left, Photo Right on large screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-4">
          {/* Left Column: Headline and Content */}
          <div className="lg:col-span-7 space-y-8 md:space-y-10">
            {/* Status Badge */}
            <motion.div variants={itemVariants} className="inline-flex">
              <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/50 px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Pune, Maharashtra, India
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[90px] font-bold tracking-tight text-zinc-950 dark:text-white leading-[0.95] max-w-4xl"
            >
              Learning. <br />
              Building. <br />
              Evolving.
            </motion.h1>

            {/* Value Proposition */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-light max-w-2xl leading-relaxed"
            >
              I am Prince Vyas, a Computer Engineering student exploring Artificial Intelligence, Machine Learning, and software engineering. Through continuous learning, hands-on projects, and technical experimentation, I am developing the skills needed to build intelligent and impactful technology solutions.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <a
                href="#about"
                className="flex items-center justify-center gap-2 text-sm text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-6 py-3 rounded-md font-medium transition-all group"
              >
                Discover My Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white bg-zinc-100 border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 px-6 py-3 rounded-md font-medium transition-all"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Right Column: Profile Photo */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative group w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/85 bg-zinc-150 dark:bg-zinc-950/40 shadow-xl dark:shadow-2xl transition-all duration-300">
              {/* Decorative Tech Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zinc-400 dark:border-zinc-600 rounded-tl z-10 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zinc-400 dark:border-zinc-600 rounded-tr z-10 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zinc-400 dark:border-zinc-600 rounded-bl z-10 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zinc-400 dark:border-zinc-600 rounded-br z-10 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              
              {/* Glowing Background Ring / Light effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              
              <img
                src={profilePhoto}
                alt="Prince Vyas"
                className="w-full h-full object-cover object-center hover:scale-[1.02] transition-transform duration-500 ease-out z-10 relative"
              />
            </div>
          </motion.div>
        </div>

        {/* Footer/Socials within Hero */}
        <motion.div
          variants={itemVariants}
          className="border-t border-zinc-200 dark:border-zinc-900 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-550 dark:text-zinc-500">
              [ Let's Connect ]
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 bg-white/60 dark:bg-zinc-950/30 px-3.5 py-1.5 rounded transition-all group shadow-xs hover:shadow-sm"
                  >
                    <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
                    <span className="uppercase tracking-wider font-medium">{social.name}</span>
                  </a>
                )
              })}
            </div>
          </div>
          <div className="text-xs font-mono text-zinc-400 dark:text-zinc-650 flex items-center gap-1.5 select-none self-end md:self-auto pt-2 md:pt-0">
            <span>Scroll to discover</span>
            <span className="text-zinc-550 dark:text-zinc-500 animate-bounce">↓</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
