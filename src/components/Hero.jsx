import { ArrowRight, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'
import { profile } from '../data/profile'
import profilePhoto from '../assets/profile.webp'

const socialLinks = [
  { name: 'GitHub', url: profile.githubUrl, icon: GithubIcon, external: true },
  { name: 'LinkedIn', url: profile.linkedinUrl, icon: LinkedinIcon, external: true },
  { name: 'Email', url: `mailto:${profile.email}`, icon: Mail, external: false },
]

export default function Hero({ onNavigate }) {
  const handleAnchorClick = (event, targetId) => {
    if (!onNavigate) return
    event.preventDefault()
    onNavigate('/', targetId)
  }

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center relative pt-24 px-6 max-w-6xl mx-auto"
    >
      <div className="flex flex-col justify-between flex-grow py-6 md:py-8">
        {/* Hero Central Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-4">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8 md:space-y-9">
            {/* Location Status */}
            <div className="inline-flex hero-fade">
              <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-950/60 px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {profile.location}
              </div>
            </div>

            {/* Display Headline */}
            <h1 className="hero-rise hero-delay-1 text-5xl sm:text-7xl md:text-8xl lg:text-[90px] font-bold tracking-tight text-zinc-950 dark:text-white leading-[0.95] max-w-4xl">
              {profile.hero.headlineLines.map((line, index) => (
                <span key={line} className="block">
                  {line}
                  {index < profile.hero.headlineLines.length - 1 ? '' : ''}
                </span>
              ))}
            </h1>

            {/* Concise Intro */}
            <p className="hero-rise hero-delay-2 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-light max-w-2xl leading-relaxed">
              {profile.hero.intro}
            </p>

            {/* Primary Actions */}
            <div className="hero-rise hero-delay-3 flex flex-col sm:flex-row gap-4 pt-1">
              <a
                href={profile.hero.primaryCta.href}
                onClick={(event) => handleAnchorClick(event, 'about')}
                className="flex items-center justify-center gap-2 text-sm text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-6 py-3 rounded-md font-medium transition-colors duration-150 group"
              >
                {profile.hero.primaryCta.label}
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
              </a>
              <a
                href={profile.hero.secondaryCta.href}
                onClick={(event) => handleAnchorClick(event, 'contact')}
                className="flex items-center justify-center gap-2 text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white bg-zinc-100 border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 px-6 py-3 rounded-md font-medium transition-colors duration-150"
              >
                {profile.hero.secondaryCta.label}
              </a>
            </div>
          </div>

          {/* Right Column: Original Profile Photo */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end hero-fade hero-delay-4">
            <div className="relative group w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950/60 shadow-xl dark:shadow-2xl transition-colors duration-200">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zinc-400 dark:border-zinc-600 rounded-tl z-10 opacity-70 transition-transform duration-200 group-hover:scale-105" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zinc-400 dark:border-zinc-600 rounded-tr z-10 opacity-70 transition-transform duration-200 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zinc-400 dark:border-zinc-600 rounded-bl z-10 opacity-70 transition-transform duration-200 group-hover:scale-105" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zinc-400 dark:border-zinc-600 rounded-br z-10 opacity-70 transition-transform duration-200 group-hover:scale-105" />

              <img
                src={profilePhoto}
                alt={profile.name}
                className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.015]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Connect Bar */}
        <div className="hero-rise hero-delay-5 border-t border-zinc-200 dark:border-zinc-900 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              [ Let&apos;s Connect ]
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target={social.external ? '_blank' : undefined}
                    rel={social.external ? 'noreferrer' : undefined}
                    className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/70 dark:bg-zinc-950/40 px-3.5 py-1.5 rounded transition-colors duration-150 group shadow-xs"
                  >
                    <Icon className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150" />
                    <span className="uppercase tracking-wider font-medium">{social.name}</span>
                  </a>
                )
              })}
            </div>
          </div>

          <a
            href="#about"
            onClick={(event) => handleAnchorClick(event, 'about')}
            className="text-xs font-mono text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 flex items-center gap-1.5 self-end md:self-auto pt-2 md:pt-0 transition-colors duration-150 group"
          >
            <span>Scroll to discover</span>
            <span className="inline-block transition-transform duration-150 group-hover:translate-y-0.5">↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}
