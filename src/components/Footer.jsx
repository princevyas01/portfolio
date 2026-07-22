export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-500 dark:text-zinc-650">
        <div>
          <span>© {currentYear} Prince Vyas. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Engineered with React + Tailwind v4 + Framer Motion</span>
        </div>
      </div>
    </footer>
  )
}
