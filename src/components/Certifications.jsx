import { useState, useEffect, useRef } from 'react'
import { Search, Award, ExternalLink, Calendar, Hash, FileText, CheckCircle, X } from 'lucide-react'

const certificationsData = [
  {
    id: 8,
    name: 'PromptWars Virtual — Top 400 Leaderboard (Challenge 3)',
    type: 'achievement',
    issuer: 'Google for Developers / Hack2Skill',
    date: 'November 8, 2026',
    credentialId: '2026H2S06PWVCHL3-AT00124',
    verificationLink: null,
    previewImage: '/certificates/promptwars_hack2skill.png',
    previewText:
      'Earned a Top 400 Leaderboard position in Challenge 3 during PromptWars Virtual (Build with AI) for developing functional Generative AI applications.',
  },
  {
    id: 9,
    name: 'PyTorch Deep Learning Masterclass: CNNs, Transformers, GANs, Autoencoders and Diffusion',
    type: 'course',
    issuer: 'Cursa',
    date: 'October 9, 2026',
    credentialId: '7914f474f0f39c1c98f938ce2fc5bf9c',
    verificationLink: 'https://cursa.app/pt/my-certificate',
    previewImage: '/certificates/pytorch_deep_learning_cursa.png',
    previewText:
      'Completed coursework covering PyTorch architectures including CNNs, Transformers, GANs, Autoencoders, and Diffusion models.',
  },
  {
    id: 1,
    name: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    type: 'professional',
    issuer: 'Oracle University',
    date: 'December 17, 2025',
    credentialId: '324566171OCI25AICFA',
    verificationLink: null,
    previewImage: '/certificates/oracle_ai_foundations.png',
    previewText:
      'Foundational knowledge of Artificial Intelligence, Machine Learning, Deep Learning, Generative AI, NLP, and Oracle Cloud Infrastructure AI Services.',
  },
  {
    id: 2,
    name: '5-Day AI Agents Intensive Course with Google',
    type: 'course',
    issuer: 'Kaggle / Google',
    date: 'December 18, 2025',
    credentialId: null,
    verificationLink: null,
    previewImage: '/certificates/ai_agents_kaggle.png',
    previewText:
      'Practical training on designing, building, and evaluating autonomous AI Agents using Google and Kaggle developer tooling.',
  },
  {
    id: 3,
    name: 'Responsive Web Development with HTML5, CSS3, JavaScript',
    type: 'course',
    issuer: 'Infosys Springboard',
    date: 'April 28, 2026',
    credentialId: null,
    verificationLink: 'https://verify.onwingspan.com',
    previewImage: '/certificates/responsive_web_advanced_infosys.png',
    previewText:
      'Built responsive front-end web interfaces using semantic HTML5, modern CSS3 layouts, and interactive JavaScript.',
  },
  {
    id: 4,
    name: 'Beginning Responsive Web Development with HTML and CSS',
    type: 'course',
    issuer: 'Infosys Springboard',
    date: 'April 15, 2026',
    credentialId: null,
    verificationLink: 'https://verify.onwingspan.com',
    previewImage: '/certificates/responsive_web_beginning_infosys.png',
    previewText:
      'Core foundations of page structure, styling rules, and mobile-first responsive grid layouts.',
  },
  {
    id: 5,
    name: 'Build a free website with WordPress',
    type: 'course',
    issuer: 'Coursera',
    date: 'April 30, 2026',
    credentialId: 'K8TJTCCBNF97',
    verificationLink: 'https://coursera.org/verify/K8TJTCCBNF97',
    previewImage: '/certificates/wordpress_coursera.png',
    previewText:
      'Configured site templates, content workflows, and deployment settings using WordPress.',
  },
  {
    id: 6,
    name: 'Data Analytics Essentials',
    type: 'course',
    issuer: 'MMCOE / Cisco Networking Academy',
    date: 'April 26, 2025',
    credentialId: null,
    verificationLink: null,
    previewImage: '/certificates/data_analytics_cisco.png',
    previewText:
      'Coursework on data lifecycle stages, exploratory analysis, visualization, and database schemas through Cisco Academy.',
  },
  {
    id: 7,
    name: 'In-House Product Development Competition',
    type: 'achievement',
    issuer: "Marathwada Mitra Mandal's College of Engineering (MMCOE), Pune",
    date: 'March 13, 2026',
    credentialId: null,
    verificationLink: null,
    previewImage: '/certificates/product_competition_mmcoe.png',
    previewText:
      'Participated and contributed to the In-House Product Development Competition held at MMCOE, Pune.',
  },
]

const filterTabs = [
  { id: 'all', label: `All (${certificationsData.length})` },
  { id: 'course', label: 'Course Certs' },
  { id: 'professional', label: 'Professional Certs' },
  { id: 'achievement', label: 'Achievements' },
]

export default function Certifications() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCert, setSelectedCert] = useState(null)
  const closeButtonRef = useRef(null)
  const lastTriggerRef = useRef(null)

  const filteredCerts = certificationsData.filter((cert) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      cert.name.toLowerCase().includes(query) ||
      cert.issuer.toLowerCase().includes(query) ||
      cert.previewText.toLowerCase().includes(query)

    const matchesTab = activeTab === 'all' || cert.type === activeTab
    return matchesSearch && matchesTab
  })

  useEffect(() => {
    if (!selectedCert) return undefined

    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedCert(null)
        lastTriggerRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCert])

  const openModal = (cert, triggerEl) => {
    lastTriggerRef.current = triggerEl || document.activeElement
    setSelectedCert(cert)
  }

  const closeModal = () => {
    setSelectedCert(null)
    lastTriggerRef.current?.focus()
  }

  return (
    <section id="certifications" className="py-24 md:py-32 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="space-y-14">
        {/* Heading */}
        <div className="space-y-4 max-w-xl">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>[ Credentials &amp; Learning ]</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Certifications.
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            A verified record of certifications, technical coursework, and competition participation.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-6">
          <div className="flex flex-wrap gap-2 p-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-md self-start">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs font-mono px-3.5 py-2 rounded transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search certs or issuers..."
              aria-label="Search certifications or issuers"
              className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-900 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-950 dark:text-white rounded pl-9 pr-4 py-2 text-xs font-mono transition-colors duration-150 outline-none"
            />
          </div>
        </div>

        {/* Certifications Grid */}
        <div
          key={`${activeTab}-${searchQuery}`}
          className="project-grid-enter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
        >
          {filteredCerts.map((cert) => (
            <article
              key={cert.id}
              className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/30 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors duration-150 flex flex-col justify-between group h-full shadow-sm dark:shadow-none"
            >
              <div className="space-y-4">
                {cert.previewImage && (
                  <button
                    type="button"
                    onClick={(event) => openModal(cert, event.currentTarget)}
                    aria-label={`View full certificate for ${cert.name}`}
                    className="relative aspect-[4/3] w-full mb-2 overflow-hidden rounded border border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-950 cursor-pointer block text-left"
                  >
                    <img
                      src={cert.previewImage}
                      alt={cert.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center text-[10px] font-mono text-white gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Click to view
                    </span>
                  </button>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
                    {cert.type === 'course'
                      ? 'Course Certificate'
                      : cert.type === 'professional'
                      ? 'Professional Exam'
                      : 'Participation'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                      Verified
                    </span>
                  </span>
                </div>

                <h2 className="text-base font-semibold text-zinc-950 dark:text-white tracking-tight leading-snug">
                  {cert.name}
                </h2>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    <CheckCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                    <span>{cert.issuer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{cert.date}</span>
                  </div>
                  {cert.credentialId && (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                      <Hash className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cert.credentialId}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed border-t border-zinc-200/70 dark:border-zinc-900 pt-3">
                  {cert.previewText}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200/70 dark:border-zinc-900 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(event) => openModal(cert, event.currentTarget)}
                  className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-mono flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span>View Certificate</span>
                </button>
                {cert.verificationLink && (
                  <a
                    href={cert.verificationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-3 py-1.5 rounded transition-colors duration-150"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          ))}

          {filteredCerts.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-900 rounded-lg">
              <p className="text-sm font-mono text-zinc-500">
                No certifications matched your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedCert.name}
          onClick={closeModal}
          className="modal-backdrop-enter fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-pointer"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="modal-dialog-enter relative max-w-4xl max-h-[85vh] overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center cursor-default"
          >
            <img
              src={selectedCert.previewImage}
              alt={selectedCert.name}
              className="w-full h-auto max-h-[82vh] object-contain p-2"
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              aria-label="Close certificate preview"
              className="absolute top-3 right-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white rounded-full p-2 border border-zinc-200 dark:border-zinc-800 transition-colors duration-150 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
