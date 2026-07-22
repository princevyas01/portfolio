import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Terminal, Cpu, Trophy, Users, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { GithubIcon } from './icons'

export default function Projects() {
  const [activeTab, setActiveTab] = useState('EXPERIMENTS')
  const [showDetails, setShowDetails] = useState(false)
  
  // 3D Tilt Effect State
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Rotation calculations (tilt angle limit: 6 degrees)
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6
    
    // Radial glow coordinates
    const glowX = (x / rect.width) * 100
    const glowY = (y / rect.height) * 100

    setTilt({ x: rotateX, y: rotateY })
    setGlow({ x: glowX, y: glowY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  const techStack = ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Vitest', 'Gemini AI']

  const details = [
    {
      icon: Terminal,
      title: 'What it does',
      text: 'Personalized carbon footprint assessment with an interactive onboarding flow. Users get category-wise breakdowns, trend charts, and benchmarking against Indian averages.',
      prefix: '🔍'
    },
    {
      icon: Cpu,
      title: 'AI Layer',
      text: 'Gemini 2.0 Flash generates localized recommendations based on the user\'s actual lifestyle data — not generic global tips.',
      prefix: '🤖'
    },
    {
      icon: Trophy,
      title: 'Engagement',
      text: 'Gamification system with XP, streaks, achievements, and progression levels to drive consistent behavior change over time.',
      prefix: '🎮'
    },
    {
      icon: Users,
      title: 'Architecture',
      text: 'Multi-user support with fully isolated profiles, stats, and progress tracking.',
      prefix: '👥'
    }
  ]

  const keyLearnings = [
    'Learned how to integrate and prompt Gemini API for context-aware, structured AI responses',
    'Built multi-user data isolation patterns in Next.js with TypeScript',
    'Designed gamification logic (XP, streaks) from scratch to encourage habit formation',
    'Worked with India-specific emission datasets and understood how regional factors affect carbon calculations',
    'First time shipping a full-stack product with real analytics (Recharts) and test coverage (Vitest)'
  ]

  return (
    <section id="projects" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900">
      <div className="space-y-16">
        
        {/* Section Header & Monospace Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-900 pb-6">
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              [ PORTFOLIO WORK ]
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Things I've Actually Built.
            </h2>
          </div>
          
          {/* Monospace Tabs Selector */}
          <div className="flex gap-4 font-mono text-xs select-none">
            {['PROJECTS', 'EXPERIMENTS'].map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-2 px-2 cursor-pointer transition-colors font-medium tracking-wider uppercase ${
                    isActive 
                      ? 'text-zinc-950 dark:text-white' 
                      : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
                  }`}
                >
                  <span>[ {tab} ]</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.6)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content Switching Container */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'PROJECTS' ? (
              // Tab 1: PROJECTS (Placeholder Card)
              <motion.div
                key="projects-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex justify-center w-full"
              >
                <div className="w-full max-w-3xl border border-dashed border-zinc-350 dark:border-zinc-850 rounded-2xl bg-zinc-100/50 dark:bg-zinc-950/20 p-16 flex flex-col items-center justify-center text-center shadow-xs">
                  <Terminal className="w-8 h-8 text-zinc-400 dark:text-zinc-700 mb-4 stroke-[1.5]" />
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">
                    More coming soon.
                  </p>
                </div>
              </motion.div>
            ) : (
              // Tab 2: EXPERIMENTS (CarbonLens Project Card)
              <motion.div
                key="experiments-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex justify-center w-full"
              >
                {/* Anti-gravity floating outer motion wrapper */}
                <motion.div
                  animate={isHovered ? {} : { y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut"
                  }}
                  className="w-full max-w-3xl"
                >
                  {/* Interactive 3D Card */}
                  <div
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                      transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      background: isHovered 
                        ? `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(0, 255, 136, 0.12) 0%, transparent 60%), rgba(9, 9, 11, 0.95)` 
                        : 'rgba(9, 9, 11, 0.92)'
                    }}
                    className="relative rounded-2xl border border-[#00ff88]/20 dark:border-[#00ff88]/15 hover:border-[#00ff88] p-8 md:p-10 text-zinc-100 transition-colors duration-500 shadow-xl dark:shadow-2xl hover:shadow-[0_0_30px_rgba(0,255,136,0.18)]"
                  >
                    {/* Top accent badge */}
                    <div className="absolute top-0 right-10 -translate-y-1/2 px-3.5 py-1 bg-zinc-900 border border-[#00ff88]/30 rounded-full font-mono text-[9px] uppercase tracking-widest text-[#00ff88] shadow-sm select-none">
                      Featured Project
                    </div>

                    {/* Title & Tagline */}
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                        CarbonLens — AI Carbon Intelligence for India
                      </h3>
                      <p className="text-sm md:text-base font-mono text-[#00ff88]/90 tracking-tight font-light">
                        Most carbon tools are built on global assumptions. CarbonLens is built for India.
                      </p>
                    </div>

                    {/* Short Description */}
                    <p className="text-sm md:text-md text-zinc-400 font-light leading-relaxed mt-6">
                      Tracks real emissions across regional electricity grids, local transport, and dietary patterns — then converts that data into personalized, AI-driven action plans using Google Gemini 2.0 Flash.
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      {techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-[10px] font-mono rounded bg-[#00ff88]/5 text-[#00ff88] border border-[#00ff88]/10 hover:border-[#00ff88]/40 hover:bg-[#00ff88]/10 hover:shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all duration-300 select-none"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons Links */}
                    <div className="flex flex-wrap gap-4 mt-8 pt-2">
                      <a
                        href="https://github.com/princevyas01/Carbon-Footprint-Awareness-Platform"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-mono text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-2.5 rounded transition-all shadow-sm cursor-pointer"
                      >
                        <GithubIcon className="w-4 h-4" />
                        GitHub Repository
                      </a>
                      <a
                        href="https://carbon-footprint-awareness-platforsdfsdfsd2736m-omega.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-mono text-black bg-[#00ff88] hover:bg-[#00e676] px-4 py-2.5 rounded font-medium transition-all shadow-md hover:shadow-[0_0_15px_rgba(0,255,136,0.4)] cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    </div>

                    {/* Toggle Collapsible Details */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/80">
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-2 text-xs font-mono text-[#00ff88] hover:text-[#00e676] transition-colors cursor-pointer select-none"
                      >
                        {showDetails ? (
                          <>
                            <ChevronUp className="w-4 h-4 animate-pulse" />
                            [-] Hide Implementation Details & Learnings
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 animate-pulse" />
                            [+] Show Implementation Details & Learnings
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {showDetails && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {/* Detailed Explanations */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pb-2">
                              {details.map((detail) => {
                                const Icon = detail.icon
                                return (
                                  <div
                                    key={detail.title}
                                    className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/60"
                                  >
                                    <div className="flex items-center gap-2 mb-2 font-mono text-xs text-white">
                                      <span className="text-sm">{detail.prefix}</span>
                                      <span className="font-semibold">{detail.title}</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                                      {detail.text}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Key Learnings Block */}
                            <div className="mt-6 pt-6 border-t border-zinc-800/80 space-y-4">
                              <h4 className="text-xs font-mono text-white uppercase tracking-wider">
                                Key Learnings & takeaways
                              </h4>
                              <ul className="space-y-2.5">
                                {keyLearnings.map((learning, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-zinc-400 font-light flex items-start gap-2.5 leading-relaxed"
                                  >
                                    <CheckCircle className="w-4 h-4 text-[#00ff88]/80 shrink-0 mt-0.5" />
                                    <span>{learning}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Thin animated green sliding/wave line at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00ff88]/10 overflow-hidden rounded-b-2xl">
                      <motion.div
                        className="h-full bg-gradient-to-r from-transparent via-[#00ff88] to-transparent"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3.5,
                          ease: "linear"
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
