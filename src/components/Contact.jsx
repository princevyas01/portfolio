import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Send, Check, AlertCircle } from 'lucide-react'

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formState.name || !formState.email || !formState.message) return
    
    setIsSubmitting(true)
    setErrorMessage(null)
    setIsSuccess(false)

    // Honeypot spam check: if botcheck is checked, silent fail/ignore
    if (e.target.botcheck && e.target.botcheck.checked) {
      setIsSubmitting(false)
      // Act like it succeeded to throw off spam bots
      setIsSuccess(true)
      setFormState({ name: '', email: '', message: '' })
      return
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

    // Validation: make sure access key is present
    if (!accessKey || accessKey === 'your_access_key_here') {
      setIsSubmitting(false)
      setErrorMessage(
        'Setup Error: Web3Forms Access Key is missing. Please add VITE_WEB3FORMS_ACCESS_KEY to your .env file.'
      )
      return
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `New Portfolio Contact Form Message from ${formState.name}`,
          from_name: 'Prince Vyas Portfolio',
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsSuccess(true)
        setFormState({ name: '', email: '', message: '' })
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        setErrorMessage(result.message || 'Submission failed. Please check your credentials and try again.')
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <section id="contact" className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
      >
        {/* Left Side: Text Details */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div variants={itemVariants} className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            [ Connect ]
          </motion.div>
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight"
          >
            Let's start a conversation.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-sm text-zinc-555 dark:text-zinc-400 font-light leading-relaxed max-w-sm">
            Looking to connect for internships, academic collaborations, or just want to discuss Artificial Intelligence and Machine Learning? Feel free to reach out.
          </motion.p>

          <motion.div variants={itemVariants} className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-xs font-mono">
              <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
              <a href="mailto:princevyas13456@gmail.com" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                princevyas13456@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
              <span>Pune, Maharashtra, India</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <motion.div variants={itemVariants} className="lg:col-span-7 bg-white/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 p-6 md:p-8 rounded-lg shadow-sm dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Spam Protection Honeypot Checkbox (Hidden from users) */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your Name"
                className="w-full bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-955 dark:text-white rounded p-3 text-xs font-mono transition-colors outline-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                className="w-full bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-955 dark:text-white rounded p-3 text-xs font-mono transition-colors outline-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={formState.message}
                onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Hi Prince, let's connect about..."
                className="w-full bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-955 dark:text-white rounded p-3 text-xs font-mono transition-colors resize-none outline-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 text-xs font-mono py-3 px-4 rounded transition-all font-medium cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Send className="w-3.5 h-3.5 animate-pulse" />
                    Sending Message...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Message Sent Successfully
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Error Message Box */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2.5 bg-red-950/20 border border-red-900/50 text-red-400 p-4 rounded text-xs font-mono mt-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Submission Error</span>
                    {errorMessage}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </motion.div>
    </section>
  )
}
