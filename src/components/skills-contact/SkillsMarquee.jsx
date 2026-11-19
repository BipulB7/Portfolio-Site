import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { marqueeSkills } from "../../data/content";
import { DiamondMark } from "../ui/DiamondMark";
import { cn } from "../../lib/utils";

/**
 * Two full-bleed rows of skills drifting in opposite directions.
 * Each track holds the list twice and slides by -50% for a seamless loop.
 * On top of the CSS loop, each row drifts a little with page scroll
 * (motion values only, no re-renders). Decorative: every skill also
 * appears in the category grid below, so the strip is aria-hidden.
 */

const Track = ({ children, reverse = false, duration }) => (
  <div
    className={cn("sc-marquee-track flex w-max", reverse ? "animate-marquee-reverse" : "animate-marquee")}
    style={{ "--marquee-duration": duration }}
  >
    <div className="flex shrink-0 items-center">{children}</div>
    <div className="flex shrink-0 items-center">{children}</div>
  </div>
);

const reversed = [...marqueeSkills].reverse();

export const SkillsMarquee = ({ className }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const driftA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [90, -150]);
  const driftB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-120, 110]);

  return (
    <div ref={ref} aria-hidden="true" className={cn("relative select-none overflow-hidden mask-fade-x", className)}>
      {/* Row 1: big italic display words, outlined / sunset-filled */}
      <div className="sc-marquee-row py-2">
        <motion.div style={{ x: driftA }}>
          <Track duration="70s">
            {marqueeSkills.map((word, i) => (
              <span key={word} className="flex items-center">
                <span
                  className={cn(
                    "px-5 pb-[0.12em] font-display text-5xl italic leading-[1.1] tracking-[-0.01em] md:px-9 md:text-7xl",
                    i % 2 === 0 ? "sc-outline" : "text-sunset"
                  )}
                  style={i % 2 === 0 ? undefined : { backgroundPosition: i % 4 === 1 ? "0% 50%" : "100% 50%" }}
                >
                  {word}
                </span>
                <DiamondMark className="h-4 w-4 shrink-0 opacity-70 md:h-6 md:w-6" strokeWidth={1.6} />
              </span>
            ))}
          </Track>
        </motion.div>
      </div>

      {/* Row 2: small mono caps on a hairline "tape" band, moving the other way */}
      <div className="sc-marquee-row mt-5 border-y border-border/60 bg-card/25 py-4 md:mt-7 md:py-5">
        <motion.div style={{ x: driftB }}>
          <Track reverse duration="48s">
            {reversed.map((word, i) => (
              <span key={word} className="flex items-center">
                <span
                  className={cn(
                    "px-6 font-mono text-xs uppercase tracking-[0.32em] md:px-8 md:text-sm",
                    i % 4 === 1 ? "neon-text" : i % 4 === 3 ? "text-ice" : "text-muted-foreground"
                  )}
                >
                  {word}
                </span>
                <span className="h-1.5 w-1.5 shrink-0 rotate-45 border border-ice/60" />
              </span>
            ))}
          </Track>
        </motion.div>
      </div>
    </div>
  );
};
