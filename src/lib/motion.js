import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip)
}

export const MOTION_EASE = {
  reveal: 'power3.out',
  ui: 'power2.out',
  flip: 'power2.inOut',
  gentle: 'sine.out',
  count: 'power3.out',
}

export const MOTION_DURATION = {
  indicator: 0.24,
  button: 0.17,
  cardHover: 0.28,
  heroLine: 0.62,
  heroMedia: 0.68,
  projectFlip: 0.38,
  projectFlipMobile: 0.3,
  section: 0.54,
  timelineEntry: 0.44,
  modal: 0.21,
  route: 0.26,
  score: 900,
}

const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_+-·'

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isCompactViewport() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(max-width: 767px)').matches
}

export function supportsFinePointer() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !prefersReducedMotion()
  )
}

/**
 * Crisp monospace character decode animation. Respects reduced motion and cancels cleanly.
 */
export function runTextScramble(element, targetText, { duration = 0.34, delay = 0 } = {}) {
  if (!element || !targetText) return () => {}
  if (prefersReducedMotion()) {
    element.textContent = targetText
    return () => {}
  }

  const state = { progress: 0 }
  const length = targetText.length

  const tween = gsap.to(state, {
    progress: 1,
    duration,
    delay,
    ease: 'none',
    overwrite: 'auto',
    onUpdate: () => {
      const revealedCount = Math.floor(state.progress * length)
      let output = ''
      for (let i = 0; i < length; i += 1) {
        const ch = targetText[i]
        if (i < revealedCount || ch === ' ' || ch === '[' || ch === ']' || ch === ',') {
          output += ch
        } else {
          const seed = Math.floor((state.progress * 37 + i * 13) % SCRAMBLE_GLYPHS.length)
          output += SCRAMBLE_GLYPHS[seed]
        }
      }
      element.textContent = output
    },
    onComplete: () => {
      element.textContent = targetText
    },
  })

  return () => {
    tween.kill()
    element.textContent = targetText
  }
}

/**
 * Updates CSS spotlight variables (--spot-x, --spot-y) strictly on hovered card using cached rect.
 */
export function attachSpotlight(element) {
  if (!element || !supportsFinePointer()) return () => {}

  let rect = null

  const handleEnter = (event) => {
    rect = element.getBoundingClientRect()
    element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
    element.style.setProperty('--spot-active', '1')
  }

  const handleMove = (event) => {
    if (!rect) rect = element.getBoundingClientRect()
    element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  const handleLeave = () => {
    rect = null
    element.style.setProperty('--spot-active', '0')
  }

  element.addEventListener('pointerenter', handleEnter)
  element.addEventListener('pointermove', handleMove)
  element.addEventListener('pointerleave', handleLeave)

  return () => {
    element.removeEventListener('pointerenter', handleEnter)
    element.removeEventListener('pointermove', handleMove)
    element.removeEventListener('pointerleave', handleLeave)
    element.style.removeProperty('--spot-active')
  }
}

/**
 * Attach restrained magnetic attraction (5-7px max) to a desktop fine-pointer control.
 */
export function attachMagnetic(
  element,
  { strength = 5.5, innerStrength = 2, duration = 0.32 } = {}
) {
  if (!element || !supportsFinePointer()) return () => {}

  const innerEl = element.querySelector('[data-magnetic-inner]')
  let rect = null

  const quickX = gsap.quickTo(element, 'x', { duration, ease: MOTION_EASE.reveal })
  const quickY = gsap.quickTo(element, 'y', { duration, ease: MOTION_EASE.reveal })
  const quickInnerX = innerEl
    ? gsap.quickTo(innerEl, 'x', { duration: duration * 0.9, ease: MOTION_EASE.reveal })
    : null
  const quickInnerY = innerEl
    ? gsap.quickTo(innerEl, 'y', { duration: duration * 0.9, ease: MOTION_EASE.reveal })
    : null

  const handleEnter = () => {
    rect = element.getBoundingClientRect()
  }

  const handleMove = (event) => {
    if (!rect) rect = element.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const nx = Math.max(
      -1,
      Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2))
    )
    const ny = Math.max(
      -1,
      Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2))
    )

    quickX(nx * strength)
    quickY(ny * strength)
    if (quickInnerX && quickInnerY) {
      quickInnerX(nx * innerStrength)
      quickInnerY(ny * innerStrength)
    }
  }

  const handleLeave = () => {
    rect = null
    quickX(0)
    quickY(0)
    if (quickInnerX && quickInnerY) {
      quickInnerX(0)
      quickInnerY(0)
    }
  }

  element.addEventListener('pointerenter', handleEnter)
  element.addEventListener('pointermove', handleMove)
  element.addEventListener('pointerleave', handleLeave)

  return () => {
    element.removeEventListener('pointerenter', handleEnter)
    element.removeEventListener('pointermove', handleMove)
    element.removeEventListener('pointerleave', handleLeave)
    gsap.killTweensOf(element)
    gsap.set(element, { clearProps: 'x,y' })
    if (innerEl) {
      gsap.killTweensOf(innerEl)
      gsap.set(innerEl, { clearProps: 'x,y' })
    }
  }
}

/**
 * Attach subtle 2D pointer parallax crop shift inside an overflow-clipped image container.
 */
export function attachPointerParallax(
  container,
  image,
  { range = 4.5, hoverScale = 1.032, duration = 0.36 } = {}
) {
  if (!container || !image || !supportsFinePointer()) return () => {}

  let rect = null

  const quickX = gsap.quickTo(image, 'x', { duration, ease: MOTION_EASE.reveal })
  const quickY = gsap.quickTo(image, 'y', { duration, ease: MOTION_EASE.reveal })

  const handleEnter = () => {
    rect = container.getBoundingClientRect()
    gsap.to(image, {
      scale: hoverScale,
      duration: 0.34,
      ease: MOTION_EASE.ui,
      overwrite: 'auto',
    })
  }

  const handleMove = (event) => {
    if (!rect) rect = container.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const nx = Math.max(
      -1,
      Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2))
    )
    const ny = Math.max(
      -1,
      Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2))
    )

    quickX(-nx * range)
    quickY(-ny * range)
  }

  const handleLeave = () => {
    rect = null
    quickX(0)
    quickY(0)
    gsap.to(image, {
      scale: 1,
      duration: 0.44,
      ease: MOTION_EASE.reveal,
      overwrite: 'auto',
    })
  }

  container.addEventListener('pointerenter', handleEnter)
  container.addEventListener('pointermove', handleMove)
  container.addEventListener('pointerleave', handleLeave)

  return () => {
    container.removeEventListener('pointerenter', handleEnter)
    container.removeEventListener('pointermove', handleMove)
    container.removeEventListener('pointerleave', handleLeave)
    gsap.killTweensOf(image)
    gsap.set(image, { clearProps: 'x,y,scale' })
  }
}

export { gsap, ScrollTrigger, Flip }
