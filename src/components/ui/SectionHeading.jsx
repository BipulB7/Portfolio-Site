import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { ease, viewport } from "../../lib/motion";

/**
 * Consistent section header with a retro cassette-style eyebrow.
 *
 *   TRACK 02 ──── WORK
 *   Selected *projects*
 *   Optional subtitle.
 *
 * Props:
 *  - track: "02"            → mono "Track 02" with a neon dot
 *  - eyebrow: "Work"        → label after the rule
 *  - title: "Selected"      → plain words (display serif)
 *  - highlight: "projects"  → italic, sunset-gradient words after the title
 *  - subtitle: string
 *  - align: "center" | "left"
 *
 * Each word slides up from behind a mask, staggered.
 */
export const SectionHeading = ({
  track,
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
  className,
}) => {
  const words = [
    ...(title ? title.split(" ").map((w) => ({ w, hl: false })) : []),
    ...(highlight ? highlight.split(" ").map((w) => ({ w, hl: true })) : []),
  ];

  return (
    <div
      className={cn(
        "mb-14 md:mb-20 flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {(track || eyebrow) && (
        <motion.div
          className="flex items-center gap-3 eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease: ease.outExpo }}
        >
          {track && (
            <span className="flex items-center gap-2 text-neon">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-neon animate-ping-slow opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_hsl(var(--neon))]" />
              </span>
              Track {track}
            </span>
          )}
          {track && eyebrow && (
            <motion.span
              className="h-px w-10 bg-sunset origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={{ duration: 1, delay: 0.2, ease: ease.outExpo }}
            />
          )}
          {eyebrow && <span className="text-muted-foreground">{eyebrow}</span>}
        </motion.div>
      )}

      <motion.h2
        className="font-display-tight text-5xl sm:text-6xl md:text-7xl text-balance"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        transition={{ staggerChildren: 0.07, delayChildren: 0.1 }}
      >
        {words.map(({ w, hl }, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className={cn("inline-block", hl && "italic text-sunset animate-shimmer pr-[0.06em]")}
              variants={{
                hidden: { y: "110%", rotate: 4 },
                show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: ease.outExpo } },
              }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </motion.h2>

      {subtitle && (
        <motion.p
          className={cn(
            "max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed text-pretty",
            align === "center" && "mx-auto"
          )}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
          viewport={viewport}
          transition={{ duration: 0.9, delay: 0.35, ease: ease.outExpo }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
