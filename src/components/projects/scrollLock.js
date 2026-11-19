import { lockScroll, unlockScroll } from "../../lib/scroll";

/**
 * Reference-counted wrapper around lockScroll/unlockScroll so a modal that is
 * still animating out cannot unlock the page under a modal that just opened.
 */
let locks = 0;

export const acquireScrollLock = () => {
  if (locks++ === 0) lockScroll();
};

export const releaseScrollLock = () => {
  locks = Math.max(0, locks - 1);
  if (locks === 0) unlockScroll();
};

/** Shared spring for the card <-> modal morph and grid reflow. */
export const layoutSpring = { type: "spring", bounce: 0.14, duration: 0.7 };
