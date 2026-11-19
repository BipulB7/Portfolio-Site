import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const lineTransition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] };

const top = {
  closed: { y: -3.5, rotate: 0, scaleX: 1 },
  open: { y: 0, rotate: 45, scaleX: 1 },
};
const bottom = {
  // shorter line, right-aligned with the top one
  closed: { y: 3.5, x: 3.4, rotate: 0, scaleX: 0.62 },
  open: { y: 0, x: 0, rotate: -45, scaleX: 1 },
};

/**
 * Two-line hamburger that morphs into an X.
 * `playOnMount` makes a freshly mounted button animate from the closed shape
 * (used by the copy inside the mobile menu so the morph is visible).
 */
export const MenuButton = ({ open, onClick, playOnMount = false, className, ref, ...props }) => {
  const state = open ? "open" : "closed";
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full text-foreground",
        "border border-border/70 bg-card/50 transition-colors duration-300 hover:border-primary/50",
        className
      )}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        className="absolute h-[1.5px] w-[18px] origin-center rounded-full bg-current"
        variants={top}
        initial={playOnMount ? "closed" : false}
        animate={state}
        transition={lineTransition}
      />
      <motion.span
        aria-hidden="true"
        className="absolute h-[1.5px] w-[18px] origin-center rounded-full bg-current"
        variants={bottom}
        initial={playOnMount ? "closed" : false}
        animate={state}
        transition={lineTransition}
      />
    </button>
  );
};
