import { motion } from "motion/react";
import { ease, viewport } from "../../lib/motion";

/**
 * Scroll reveal (rise + un-blur) like ui/Reveal, but it clears `filter` once
 * finished. A leftover filter, even blur(0px), on an ancestor stops glass
 * cards (backdrop-filter) inside from blurring what is behind them.
 */
export const Rise = ({
  as = "div",
  children,
  className,
  delay = 0,
  x = 0,
  y = 28,
  blur = 8,
  duration = 1,
  amount = 0.2,
  ...rest
}) => {
  const Component = motion[as] ?? motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ ...viewport, amount }}
      variants={{
        hidden: { opacity: 0, x, y, filter: `blur(${blur}px)` },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          transition: { duration, delay, ease: ease.outExpo },
          transitionEnd: { filter: "none" },
        },
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};
