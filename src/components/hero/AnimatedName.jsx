import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { letter, lineStagger } from "./variants";

/*
 * Letter-by-letter name reveal. Each letter rises out of a mask with a slight
 * tilt and blur.
 *
 * The second line uses the sunset gradient. A gradient clipped to text cannot
 * span children that have their own transforms, so while the letters animate
 * each one carries a slice of one shared gradient (measured from layout).
 * Once the last letter lands we swap in a single span with the same gradient,
 * which can then shimmer. Kerning is off on both so the swap is pixel-stable.
 */

// Mask that clips the rising letters; padded so italic overhangs and the
// descender of "j" are not cut off.
const MASK = "block overflow-hidden px-[0.08em] -mx-[0.08em] pt-[0.06em] -mt-[0.06em] pb-[0.2em] -mb-[0.2em]";

const PlainLine = ({ text }) => (
  <span className={MASK}>
    <span className="inline-block [font-kerning:none]">
      {Array.from(text).map((ch, i) => (
        <motion.span key={i} variants={letter} className="inline-block origin-bottom-left">
          {ch}
        </motion.span>
      ))}
    </span>
  </span>
);

const GradientLine = ({ text, className }) => {
  const wrapRef = useRef(null);
  const [geo, setGeo] = useState(null);
  const [settled, setSettled] = useState(false);
  const chars = Array.from(text);

  useLayoutEffect(() => {
    if (settled) return undefined;
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    const measure = () => {
      const nodes = wrap.querySelectorAll("[data-ch]");
      setGeo({ width: wrap.offsetWidth, lefts: Array.from(nodes, (n) => n.offsetLeft) });
    };
    measure();
    // Re-measure when the display font finishes loading or the viewport resizes
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [settled]);

  const wordClass = "relative inline-block pr-[0.14em] italic [font-kerning:none]";

  return (
    <span className={`${MASK} ${className ?? ""}`}>
      {settled ? (
        <span className={`${wordClass} text-sunset animate-shimmer`}>{text}</span>
      ) : (
        <span ref={wrapRef} className={wordClass}>
          {chars.map((ch, i) => (
            <motion.span
              key={i}
              data-ch
              variants={letter}
              onAnimationComplete={(def) => {
                if (def === "show" && i === chars.length - 1) setSettled(true);
              }}
              className="text-sunset inline-block origin-bottom-left pr-[0.16em] -mr-[0.16em]"
              style={
                geo
                  ? {
                      backgroundSize: `${geo.width * 2}px 100%`,
                      backgroundPosition: `${-(geo.lefts[i] ?? 0)}px 50%`,
                    }
                  : undefined
              }
            >
              {ch}
            </motion.span>
          ))}
        </span>
      )}
    </span>
  );
};

export const AnimatedName = ({ first, last, show }) => {
  const anim = show ? "show" : "hidden";
  return (
    <h1 className="font-display-tight text-[clamp(3.75rem,8vw,8rem)] tracking-[-0.025em] text-foreground">
      <span className="sr-only">
        {first} {last}
      </span>
      <motion.span aria-hidden className="block" initial="hidden" animate={anim} variants={lineStagger(0.12, 0.05)}>
        <PlainLine text={first} />
      </motion.span>
      <motion.span
        aria-hidden
        className="block sm:pl-[0.42em]"
        initial="hidden"
        animate={anim}
        variants={lineStagger(0.34, 0.05)}
      >
        <GradientLine text={last} />
      </motion.span>
    </h1>
  );
};
