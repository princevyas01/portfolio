import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Award, ExternalLink, Calendar, Hash, FileText, CheckCircle, X } from 'lucide-react'

// Verified certifications list (real certifications only)
const certificationsData = [
  {
    id: 1,
    name: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    type: 'professional',
    issuer: 'Oracle University',
    date: 'December 17, 2025',
    credentialId: '324566171OCI25AICFA',
    verificationLink: null,
    previewImage: '/certificates/oracle_ai_foundations.png',
    previewText: 'Demonstrated fundamental knowledge of Artificial Intelligence, Machine Learning, Deep Learning, Generative AI, NLP, and Oracle Cloud Infrastructure AI Services.'
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
    previewText: 'Completed practical training on designing, building, and deploying autonomous AI Agents using Google and Kaggle developer tools.'
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
    previewText: 'Built modern, responsive, and interactive front-end web interfaces using semantic HTML5, CSS3 styles, and functional JavaScript.'
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
    previewText: 'Learned the core basics of structuring web pages, writing style rules, and building mobile-first grid layouts.'
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
    previewText: 'Learned schema configurations, page templates, content management, and deployment strategies using WordPress.'
  },
  {
    id: 6,
    name: 'Data Analytics Essentials',
    type: 'course',
    issuer: "MMCOE / Cisco Networking Academy",
    date: 'April 26, 2025',
    credentialId: null,
    verificationLink: null,
    previewImage: '/certificates/data_analytics_cisco.png',
    previewText: 'Completed coursework on data lifecycle stages, basic analysis, visualization, database schemas, and statistical tools through Cisco Academy.'
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
    previewText: 'Participated and contributed to the product development competition organized as part of Web Technology Lab & Database Management System Lab CIE.'
  }
]

export default function Certifications() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all', 'course', 'professional', 'achievement'
  const [selectedImage, setSelectedImage] = useState(null)

  const filteredCerts = certificationsData.filter((cert) => {
    const matchesSearch =
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.previewText.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab = activeTab === 'all' || cert.type === activeTab

    return matchesSearch && matchesTab
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section id="certifications" className="py-24 md:py-32 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="space-y-16">
        {/* Section Heading */}
        <div className="space-y-4 max-w-xl">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Award className="w-4 h-4" />
            [ Credentials & Learning ]
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Certifications.
          </h2>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 font-light leading-relaxed">
            A verified record of my academic certificates, professional qualifications, and specialized technical training courses.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-md self-start">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs font-mono px-4 py-2 rounded transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-zinc-800 text-white dark:bg-zinc-850'
                  : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
              }`}
            >
              All ({certificationsData.length})
            </button>
            <button
              onClick={() => setActiveTab('course')}
              className={`text-xs font-mono px-4 py-2 rounded transition-colors cursor-pointer ${
                activeTab === 'course'
                  ? 'bg-zinc-800 text-white dark:bg-zinc-850'
                  : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
              }`}
            >
              Course Certs
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`text-xs font-mono px-4 py-2 rounded transition-colors cursor-pointer ${
                activeTab === 'professional'
                  ? 'bg-zinc-800 text-white dark:bg-zinc-850'
                  : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
              }`}
            >
              Professional Certs
            </button>
            <button
              onClick={() => setActiveTab('achievement')}
              className={`text-xs font-mono px-4 py-2 rounded transition-colors cursor-pointer ${
                activeTab === 'achievement'
                  ? 'bg-zinc-800 text-white dark:bg-zinc-850'
                  : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
              }`}
            >
              Achievements & Participation
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certs or issuers..."
              className="w-full bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-950 dark:text-white rounded pl-9 pr-4 py-2 text-xs font-mono transition-colors outline-none"
            />
          </div>
        </div>

        {/* Certifications Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert) => (
              <motion.div
                key={cert.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/20 hover:border-zinc-350 dark:hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between group h-full shadow-sm dark:shadow-none"
              >
                <div className="space-y-4">
                  {/* Preview Image Thumbnail (if available) */}
                  {cert.previewImage && (
                    <div 
                      className="relative aspect-[4/3] w-full mb-4 overflow-hidden rounded border border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-950 cursor-pointer"
                      onClick={() => setSelectedImage(cert.previewImage)}
                    >
                      <img 
                        src={cert.previewImage} 
                        alt={cert.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-mono text-white gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Click to view
                      </div>
                    </div>
                  )}

                  {/* Category Type Indicator & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950 text-zinc-500">
                      {cert.type === 'course' 
                        ? 'Course Certificate' 
                        : cert.type === 'professional' 
                        ? 'Professional Exam' 
                        : 'Participation / Activity'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${cert.credentialId || cert.type === 'achievement' || cert.previewImage ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-[9px] font-mono text-zinc-550 dark:text-zinc-500 uppercase tracking-wider">
                        {cert.credentialId || cert.previewImage ? 'Verified' : 'In Progress'}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-md font-semibold text-zinc-950 dark:text-white tracking-tight leading-snug group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-colors">
                    {cert.name}
                  </h3>

                  {/* Issuer & Date */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      <CheckCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-650 shrink-0" />
                      <span>{cert.issuer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{cert.date}</span>
                    </div>
                    {cert.credentialId && (
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 dark:text-zinc-600">
                        <Hash className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  {/* Description / Learnings */}
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed border-t border-zinc-100 dark:border-zinc-900 pt-3 mt-3">
                    {cert.previewText}
                  </p>
                </div>

                {/* Footer Links & Preview */}
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-500 font-mono flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    {cert.previewImage ? (
                      <button 
                        onClick={() => setSelectedImage(cert.previewImage)}
                        className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                      >
                        View Certificate
                      </button>
                    ) : (
                      <span>Preview Placeholder</span>
                    )}
                  </div>
                  {cert.verificationLink && (
                    <a
                      href={cert.verificationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-white dark:text-black bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 px-3 py-1.5 rounded transition-colors"
                    >
                      Verify
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCerts.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-900 rounded-lg">
              <p className="text-sm font-mono text-zinc-500">No certifications matched your search criteria.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center"
            >
              <img 
                src={selectedImage} 
                alt="Certificate Full Preview" 
                className="w-full h-auto max-h-[80vh] object-contain p-2"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-zinc-100 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-850 text-zinc-800 dark:text-white rounded-full p-2 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
