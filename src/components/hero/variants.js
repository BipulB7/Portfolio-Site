import { ease } from "../../lib/motion";

/**
 * Entrance variants for the hero choreography. Every piece uses
 * initial="hidden" animate={introDone ? "show" : "hidden"} with its own delay,
 * so the whole sequence starts the moment the intro curtain opens.
 *
 * Final states clear `filter` (transitionEnd) so glass panels inside keep
 * their backdrop blur: any non-"none" filter on an ancestor would stop it.
 */
export const rise = (delay = 0, { y = 24, blur = 8, duration = 1.1 } = {}) => ({
  hidden: { opacity: 0, y, filter: `blur(${blur}px)` },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration, delay, ease: ease.outExpo },
    transitionEnd: { filter: "none" },
  },
});

export const fade = (delay = 0, duration = 1.2) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration, delay, ease: ease.outExpo } },
});

/** One letter of the hero name: slides up out of a mask with a slight tilt and blur. */
export const letter = {
  hidden: { y: "112%", rotate: 9, opacity: 0, filter: "blur(10px)" },
  show: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.15, ease: ease.outExpo },
    transitionEnd: { filter: "none" },
  },
};

export const lineStagger = (delayChildren = 0, staggerChildren = 0.045) => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});
