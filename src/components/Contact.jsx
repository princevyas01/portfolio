import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight, Mail, MapPin, Check, AlertCircle, Loader2, Copy } from 'lucide-react'
import { profile } from '../data/profile'
import ElasticDivider from './ElasticDivider'
import ScrambleLabel from './ScrambleLabel'
import { attachMagnetic, attachSpotlight, gsap, MOTION_DURATION, MOTION_EASE } from '../lib/motion'

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [emailCopied, setEmailCopied] = useState(false)
  const sectionRef = useRef(null)
  const submitButtonRef = useRef(null)
  const formCardRef = useRef(null)
  const copyTimerRef = useRef(null)

  useEffect(() => {
    const cleanupMagnetic = attachMagnetic(submitButtonRef.current, {
      strength: 5,
      innerStrength: 1.5,
      duration: 0.3,
    })
    const cleanupSpotlight = attachSpotlight(formCardRef.current)
    return () => {
      cleanupMagnetic()
      cleanupSpotlight()
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current)
    }
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(profile.email)
    } catch {
      // Fallback if clipboard API blocked in sandboxed environments
    }
    setEmailCopied(true)
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current)
    copyTimerRef.current = window.setTimeout(() => {
      copyTimerRef.current = null
      setEmailCopied(false)
    }, 2000)
  }

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        normal: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { reduceMotion } = context.conditions

        if (reduceMotion) {
          gsap.set('[data-contact-left], [data-contact-form]', { clearProps: 'all' })
          return
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 84%',
            once: true,
          },
        })

        tl.fromTo(
          '[data-contact-left]',
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION_DURATION.section,
            ease: MOTION_EASE.reveal,
            clearProps: 'transform,opacity',
          },
          0
        )

        tl.fromTo(
          '[data-contact-form]',
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION_DURATION.section,
            ease: MOTION_EASE.reveal,
            clearProps: 'transform,opacity',
          },
          0.08
        )
      },
      sectionRef
    )

    return () => mm.revert()
  }, [])

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
    if (errorMessage) {
      setErrorMessage(null)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

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
      className="relative py-24 md:py-32 px-6 max-w-6xl mx-auto"
    >
      <ElasticDivider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div data-contact-left className="lg:col-span-5 space-y-6">
          <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            <ScrambleLabel text="[ Connect ]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Let&apos;s start a conversation.
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-sm">
            Open to internships, software engineering collaborations, and discussions on applied AI or Web3.
          </p>

          <div className="space-y-4 pt-3">
            <div className="flex items-center gap-3 text-xs font-mono">
              <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label={emailCopied ? 'Email copied to clipboard' : `Copy email address ${profile.email}`}
                className="group inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-150 cursor-pointer text-left"
              >
                <span className="underline decoration-zinc-300 dark:decoration-zinc-800 underline-offset-4 group-hover:decoration-zinc-500">
                  {profile.email}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/70 text-[10px]">
                  {emailCopied ? (
                    <>
                      <Check className="feedback-enter w-3 h-3 text-emerald-500" />
                      <span className="feedback-enter text-emerald-600 dark:text-emerald-400 font-medium">
                        Copied
                      </span>
                    </>
                  ) : (
                    <Copy className="w-3 h-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-150" />
                  )}
                </span>
              </button>
              <span className="sr-only" aria-live="polite">
                {emailCopied ? `Copied ${profile.email}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div
          ref={formCardRef}
          data-contact-form
          className="spotlight-card lg:col-span-7 bg-white/70 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 p-6 md:p-8 rounded-lg shadow-sm dark:shadow-none"
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
                className={`w-full bg-white dark:bg-zinc-950/50 border text-zinc-950 dark:text-white rounded p-3 text-xs font-mono transition-[border-color,background-color] duration-[160ms] ease-out outline-none ${
                  fieldErrors.name
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-zinc-200 dark:border-zinc-900 focus:border-zinc-500 dark:focus:border-zinc-600'
                }`}
                disabled={isSubmitting}
              />
              {fieldErrors.name && (
                <p
                  id="contact-name-error"
                  className="feedback-enter text-[11px] font-mono text-red-500 dark:text-red-400"
                >
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
                className={`w-full bg-white dark:bg-zinc-950/50 border text-zinc-950 dark:text-white rounded p-3 text-xs font-mono transition-[border-color,background-color] duration-[160ms] ease-out outline-none ${
                  fieldErrors.email
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-zinc-200 dark:border-zinc-900 focus:border-zinc-500 dark:focus:border-zinc-600'
                }`}
                disabled={isSubmitting}
              />
              {fieldErrors.email && (
                <p
                  id="contact-email-error"
                  className="feedback-enter text-[11px] font-mono text-red-500 dark:text-red-400"
                >
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
                className={`w-full bg-white dark:bg-zinc-950/50 border text-zinc-950 dark:text-white rounded p-3 text-xs font-mono transition-[border-color,background-color] duration-[160ms] ease-out resize-none outline-none ${
                  fieldErrors.message
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-zinc-200 dark:border-zinc-900 focus:border-zinc-500 dark:focus:border-zinc-600'
                }`}
                disabled={isSubmitting}
              />
              {fieldErrors.message && (
                <p
                  id="contact-message-error"
                  className="feedback-enter text-[11px] font-mono text-red-500 dark:text-red-400"
                >
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                ref={submitButtonRef}
                type="submit"
                disabled={isSubmitting}
                className={`group w-full flex items-center justify-center gap-2 text-xs font-mono py-3 px-4 rounded transition-colors duration-[170ms] ease-out font-medium cursor-pointer will-change-transform ${
                  isSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600'
                }`}
              >
                <span data-magnetic-inner className="inline-flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 feedback-enter" />
                      <span>Message Sent Successfully</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-[170ms] ease-out group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </div>

            {errorMessage && (
              <div
                role="alert"
                aria-live="polite"
                className="feedback-enter flex items-start gap-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 rounded text-xs font-mono mt-3"
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
