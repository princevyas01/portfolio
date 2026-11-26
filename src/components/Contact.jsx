import { useState } from 'react'
import { ArrowRight, Mail, MapPin, Send, Check, AlertCircle } from 'lucide-react'
import { profile } from '../data/profile'
import { useInView } from '../hooks/useInView'

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [sectionRef, isVisible] = useInView({ threshold: 0.08 })
  const revealClass = isVisible ? 'reveal-item is-visible' : 'reveal-item'

  const validate = () => {
    const errors = {}
    if (!formState.name.trim()) errors.name = 'Please enter your name.'
    if (!formState.email.trim()) {
      errors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!formState.message.trim()) errors.message = 'Please enter a message.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage(null)
    setIsSuccess(false)

    if (!validate()) return

    setIsSubmitting(true)

    if (event.target.botcheck && event.target.botcheck.checked) {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormState({ name: '', email: '', message: '' })
      return
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

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
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name.trim(),
          email: formState.email.trim(),
          message: formState.message.trim(),
          subject: `New Portfolio Contact Form Message from ${formState.name.trim()}`,
          from_name: 'Prince Vyas Portfolio',
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsSuccess(true)
        setFormState({ name: '', email: '', message: '' })
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        setErrorMessage(
          result.message || 'Submission failed. Please check your credentials and try again.'
        )
      }
    } catch {
      setErrorMessage('Network connection error. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-900"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`font-mono text-xs uppercase tracking-widest text-zinc-500 ${revealClass}`}>
            [ Connect ]
          </div>
          <h2
            className={`text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight ${revealClass}`}
            style={{ '--reveal-delay': '40ms' }}
          >
            Let&apos;s start a conversation.
          </h2>
          <p
            className={`text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-sm ${revealClass}`}
            style={{ '--reveal-delay': '80ms' }}
          >
            Open to internships, software engineering collaborations, and discussions on applied AI or Web3.
          </p>

          <div
            className={`space-y-4 pt-3 ${revealClass}`}
            style={{ '--reveal-delay': '120ms' }}
          >
            <div className="flex items-center gap-3 text-xs font-mono">
              <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
              <a
                href={`mailto:${profile.email}`}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150"
              >
                {profile.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div
          className={`lg:col-span-7 bg-white/70 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 p-6 md:p-8 rounded-lg shadow-sm dark:shadow-none ${revealClass}`}
          style={{ '--reveal-delay': '90ms' }}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formState.name}
                onChange={(event) => handleFieldChange('name', event.target.value)}
                placeholder="Your Name"
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                className={`w-full bg-white dark:bg-zinc-950/50 border text-zinc-950 dark:text-white rounded p-3 text-xs font-mono transition-colors duration-150 outline-none ${
                  fieldErrors.name
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-zinc-200 dark:border-zinc-900 focus:border-zinc-400 dark:focus:border-zinc-700'
                }`}
                disabled={isSubmitting}
              />
              {fieldErrors.name && (
                <p id="contact-name-error" className="text-[11px] font-mono text-red-500 dark:text-red-400">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formState.email}
                onChange={(event) => handleFieldChange('email', event.target.value)}
                placeholder="your.email@example.com"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                className={`w-full bg-white dark:bg-zinc-950/50 border text-zinc-950 dark:text-white rounded p-3 text-xs font-mono transition-colors duration-150 outline-none ${
                  fieldErrors.email
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-zinc-200 dark:border-zinc-900 focus:border-zinc-400 dark:focus:border-zinc-700'
                }`}
                disabled={isSubmitting}
              />
              {fieldErrors.email && (
                <p id="contact-email-error" className="text-[11px] font-mono text-red-500 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="message"
                className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={formState.message}
                onChange={(event) => handleFieldChange('message', event.target.value)}
                placeholder="Hi Prince, let's connect about..."
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                className={`w-full bg-white dark:bg-zinc-950/50 border text-zinc-950 dark:text-white rounded p-3 text-xs font-mono transition-colors duration-150 resize-none outline-none ${
                  fieldErrors.message
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-zinc-200 dark:border-zinc-900 focus:border-zinc-400 dark:focus:border-zinc-700'
                }`}
                disabled={isSubmitting}
              />
              {fieldErrors.message && (
                <p id="contact-message-error" className="text-[11px] font-mono text-red-500 dark:text-red-400">
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group w-full flex items-center justify-center gap-2 text-xs font-mono py-3 px-4 rounded transition-colors duration-150 font-medium cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Sending Message...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Message Sent Successfully</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 rounded text-xs font-mono mt-3"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Submission Error</span>
                  {errorMessage}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
