/**
 * Tiny bridge to the Lenis smooth-scroll instance.
 * SmoothScroll registers the instance; anything can call scrollToId / lockScroll.
 * Falls back to native scrolling when Lenis is not running (reduced motion, SSR).
 */

let lenis = null;

export const setLenis = (instance) => {
  lenis = instance;
};

export const getLenis = () => lenis;

// The nav clearance comes from `section[id] { scroll-margin-top }` in index.css.
// Lenis already honours scroll-margin-top, so no extra offset here (it would double up).
const NAV_OFFSET = 0;

/** Smoothly scroll to a section by id ("about") or selector ("#about"). */
export const scrollToId = (idOrSelector, options = {}) => {
  const selector = idOrSelector.startsWith("#") ? idOrSelector : `#${idOrSelector}`;
  const el = document.querySelector(selector);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.6, ...options });
  } else {
    // Native fallback also honours scroll-margin-top
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.8 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
};

/** Pause page scrolling (e.g. while a modal or mobile menu is open). */
export const lockScroll = () => {
  if (lenis) lenis.stop();
  document.documentElement.style.overflow = "hidden";
};

export const unlockScroll = () => {
  if (lenis) lenis.start();
  document.documentElement.style.overflow = "";
};
