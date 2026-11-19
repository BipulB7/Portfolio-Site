import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "../lib/scroll";

/**
 * Buttery inertial scrolling for the whole page (Lenis).
 * - Honors prefers-reduced-motion (Lenis drops smoothing).
 * - Intercepts in-page #anchor links and offsets them for the floating nav.
 * - Anything scrollable inside a modal should carry data-lenis-prevent.
 */
export const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      autoRaf: true,
      // offset comes from scroll-margin-top in index.css (Lenis honours it)
      anchors: { duration: 1.6 },
      respectReducedMotion: true,
    });
    setLenis(lenis);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return children;
};
