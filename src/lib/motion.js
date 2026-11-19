/**
 * Shared motion language so every section moves the same way.
 * Easing: long, soft "expo out" settles. Reveals use a small rise + blur.
 */

export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOutQuint: [0.83, 0, 0.17, 1],
};

export const duration = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
};

/** Default whileInView viewport: animate once, slightly before fully in view. */
export const viewport = { once: true, amount: 0.2, margin: "0px 0px -8% 0px" };

/** Rise + un-blur. Use with initial="hidden" whileInView="show". */
export const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.base, ease: ease.outExpo },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: ease.outExpo } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(6px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: duration.slow, ease: ease.outExpo },
  },
};

/** Text line that slides up from behind a mask (parent needs overflow-hidden). */
export const maskUp = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1, ease: ease.outExpo } },
};

/** Parent container that staggers its children's variants. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Spring used for cursor-follow effects (tilt, magnetic, spotlight). */
export const softSpring = { stiffness: 150, damping: 18, mass: 0.4 };
