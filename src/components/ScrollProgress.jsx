import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUp } from "lucide-react";
import { navItems } from "../data/content";
import { ease } from "../lib/motion";
import { scrollToTop } from "../lib/scroll";

/**
 * 1. A 2px sunset bar across the very top that fills as you read.
 * 2. A small lofi "tape deck" (desktop only) that appears after the hero:
 *    equalizer bars, the current section as a track, and a percent counter.
 *    Clicking it rewinds to the top.
 */

const BARS = [
  { delay: "-0.2s", duration: "1.05s" },
  { delay: "-0.65s", duration: "0.85s" },
  { delay: "-0.35s", duration: "1.2s" },
  { delay: "-0.9s", duration: "0.95s" },
  { delay: "-0.5s", duration: "1.1s" },
];
const BAR_W = 2;
const BAR_GAP = 2;
const BARS_SPAN = BARS.length * BAR_W + (BARS.length - 1) * BAR_GAP;

/** Track the section currently crossing the middle of the viewport. */
const useActiveSection = () => {
  const [activeId, setActiveId] = useState(navItems[0]?.id);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return navItems.find((item) => item.id === activeId) ?? navItems[0];
};

export const ScrollProgress = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35, restDelta: 0.0005 });

  // Leading spark rides the tip of the bar
  const sparkX = useTransform(progress, (v) => `${v * 100}%`);
  const sparkOpacity = useTransform(progress, [0, 0.01, 0.995, 1], [0, 1, 1, 0]);
  const percent = useTransform(scrollYProgress, (v) =>
    `${String(Math.round(Math.min(1, Math.max(0, v)) * 100)).padStart(3, "0")}%`
  );

  const pastHero = () => typeof window !== "undefined" && window.scrollY > window.innerHeight * 0.7;
  const [visible, setVisible] = useState(pastHero);
  const visibleRef = useRef(visible);

  // Only touches React state when the threshold is crossed, not every frame
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight * 0.7;
    if (next !== visibleRef.current) {
      visibleRef.current = next;
      setVisible(next);
    }
  });

  const active = useActiveSection();
  const trackText = `Track ${active.track} · ${active.label}`;

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px]">
        <motion.div
          className="h-full origin-left bg-sunset"
          style={{
            scaleX: progress,
            boxShadow: "0 0 10px hsl(var(--neon) / 0.55), 0 0 2px hsl(var(--neon) / 0.6)",
          }}
        />
        {/* full-width rail translated by progress, so the spark sits on the tip */}
        <motion.div className="absolute inset-0" style={{ x: sparkX, opacity: sparkOpacity }}>
          <span
            className="absolute -top-[3px] left-0 h-2 w-2 -translate-x-1/2 rounded-full bg-ice"
            style={{ boxShadow: "0 0 8px 2px hsl(var(--ice) / 0.7), 0 0 18px 4px hsl(var(--primary) / 0.4)" }}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {visible && (
          <motion.button
            key="tape-deck"
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className="group glass fixed bottom-6 left-6 z-[80] hidden items-center gap-3 rounded-full bg-background/75! py-2 pl-3.5 pr-2 font-mono text-[11px] leading-none transition-[border-color,box-shadow] duration-500 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_0_28px_-6px_hsl(var(--neon)/0.45)] md:flex"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: ease.outExpo }}
          >
            {/* Equalizer: the sunset gradient spans all bars together */}
            <span aria-hidden="true" className="flex h-3.5 items-end" style={{ gap: BAR_GAP }}>
              {BARS.map((bar, i) => (
                <span
                  key={i}
                  className="h-full origin-bottom rounded-full bg-sunset animate-eq"
                  style={{
                    width: BAR_W,
                    animationDelay: bar.delay,
                    animationDuration: bar.duration,
                    backgroundSize: `${BARS_SPAN}px 100%`,
                    backgroundPosition: `${-i * (BAR_W + BAR_GAP)}px 0`,
                  }}
                />
              ))}
            </span>

            <span aria-hidden="true" className="h-3.5 w-px bg-border" />

            {/* Current track label, flips like a deck display */}
            {/* mono font, so the width in ch is exact; it eases between labels */}
            <motion.span
              aria-hidden="true"
              className="relative block h-[1.1em] overflow-hidden text-left"
              initial={false}
              animate={{ width: `${trackText.length}ch` }}
              transition={{ duration: 0.5, ease: ease.outExpo }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={active.id}
                  className="absolute inset-0 whitespace-nowrap"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: ease.outExpo }}
                >
                  <span className="text-muted-foreground">Track {active.track}</span>
                  <span className="text-muted-foreground/60"> · </span>
                  <span className="text-foreground">{active.label}</span>
                </motion.span>
              </AnimatePresence>
            </motion.span>

            <motion.span aria-hidden="true" className="tabular-nums text-primary">
              {percent}
            </motion.span>

            <span
              aria-hidden="true"
              className="grid h-5 w-5 place-items-center rounded-full border border-border/80 text-muted-foreground transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary"
            >
              <ArrowUp className="h-3 w-3 transition-transform duration-500 ease-out group-hover:-translate-y-px" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
