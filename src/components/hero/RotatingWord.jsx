import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "../../lib/motion";
import { cn } from "../../lib/utils";

/**
 * Cycles through `words` with a vertical slide + blur. All words are stacked
 * invisibly in one grid cell so the box always reserves the longest word's
 * width and nothing around it jumps. Pauses when `active` is false or the tab
 * is hidden. Screen readers get the full list once instead of the animation.
 */
export const RotatingWord = ({ words, active = true, interval = 2600, className }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || words.length < 2) return undefined;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [active, interval, words.length]);

  const word = words[index];

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span
        aria-hidden
        className={cn(
          "relative inline-grid overflow-hidden whitespace-nowrap align-bottom pb-[0.16em] -mb-[0.16em] pr-[0.12em]",
          className
        )}
      >
        {words.map((w) => (
          <span key={w} className="invisible col-start-1 row-start-1">
            {w}
          </span>
        ))}
        <AnimatePresence initial={false}>
          <motion.span
            key={word}
            className="text-gradient col-start-1 row-start-1 justify-self-start pr-[0.1em]"
            initial={{ y: "85%", opacity: 0, filter: "blur(8px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-85%", opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.9, ease: ease.outExpo }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
};
