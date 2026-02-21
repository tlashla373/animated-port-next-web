import type { Variants } from 'framer-motion'

// Shared premium easing curve — all motion in the site uses this
export const LUXURY_EASE = [0.16, 1, 0.3, 1] as const

// Generic fade-up variant for text reveals
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(4px)',
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.1,
      ease: LUXURY_EASE,
      delay,
    },
  }),
}

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
}

// Letter-spacing expand → contract on enter
export const letterSpacingVariants: Variants = {
  hidden: { letterSpacing: '0.5em', opacity: 0 },
  visible: {
    letterSpacing: '0.3em',
    opacity: 1,
    transition: { duration: 1.4, ease: LUXURY_EASE },
  },
}

// Line reveal using clip-path
export const lineRevealVariants: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 1.2, ease: LUXURY_EASE },
  },
}
