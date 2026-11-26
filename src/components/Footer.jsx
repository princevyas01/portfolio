import { ArrowUp } from 'lucide-react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const reducedMotion = useReducedMotion()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <footer className="py-12 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono text-zinc-500">
        <div>
          <span>© {currentYear} Prince Vyas. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Engineered with React + Vite + Tailwind CSS</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150 cursor-pointer group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3 transition-transform duration-150 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
