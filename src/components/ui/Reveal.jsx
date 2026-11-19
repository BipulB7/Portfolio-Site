import { motion } from "motion/react";
import { ease, viewport as defaultViewport } from "../../lib/motion";

/**
 * Scroll-triggered reveal: rises, fades and un-blurs once when it enters view.
 *
 * <Reveal delay={0.1}>...</Reveal>
 * <Reveal as="li" y={16} blur={false}>...</Reveal>
 */
export const Reveal = ({
  as = "div",
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  blur = true,
  duration = 0.9,
  once = true,
  amount = 0.2,
  ...rest
}) => {
  const Component = motion[as] ?? motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, x, filter: blur ? "blur(8px)" : "blur(0px)" }}
      // filter: "none" at the end: a lingering blur(0px) on an ancestor
      // would stop glass (backdrop-filter) children from blurring.
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ ...defaultViewport, once, amount }}
      transition={{ duration, delay, ease: ease.outExpo }}
      {...rest}
    >
      {children}
    </Component>
  );
};
