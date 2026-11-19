import { motion } from "motion/react";
import { profile } from "../../data/content";
import { cn } from "../../lib/utils";
import { DiamondMark } from "../ui/DiamondMark";

// Per-bar animation offsets/durations so the equalizer never moves in lockstep
const BARS = [
  { delay: -0.2, dur: 0.95 },
  { delay: -0.65, dur: 1.15 },
  { delay: -0.35, dur: 0.85 },
  { delay: -0.9, dur: 1.3 },
  { delay: -0.5, dur: 1.05 },
];

/**
 * Decorative lofi "now playing" card: tiny album art, track, artist, an
 * equalizer and a looping progress bar. Copy comes from profile.nowBuilding.
 */
export const NowBuilding = ({ active = true, className }) => {
  const { label, track, artist } = profile.nowBuilding;

  return (
    <div
      className={cn(
        "glass flex w-[16.25rem] items-center gap-3 rounded-2xl p-2.5 pr-3.5 sm:w-[16.5rem]",
        className
      )}
    >
      {/* album art */}
      <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-sunset shadow-[0_10px_24px_-10px_hsl(var(--neon)/0.8)]">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,hsl(0_0%_100%/0.3),transparent_45%)]" />
        <div className="scanlines absolute inset-0 opacity-60" />
        <DiamondMark className="relative h-7 w-7 [&_g]:stroke-white" strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-primary dark:text-neon">
            {label}
          </span>
          <span aria-hidden className="flex h-3 items-end gap-[2px]">
            {BARS.map((b, i) => (
              <span
                key={i}
                className={cn(
                  "h-full w-[3px] origin-bottom rounded-full bg-[linear-gradient(to_top,hsl(var(--heat)),hsl(var(--neon))_55%,hsl(var(--primary)))] animate-eq",
                  !active && "[animation-play-state:paused]"
                )}
                style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
              />
            ))}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[0.8rem] font-medium leading-snug text-foreground">{track}</p>
        <p className="truncate text-[0.7rem] leading-snug text-muted-foreground">{artist}</p>
        <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            className="h-full w-full origin-left bg-sunset"
            initial={{ transform: "scaleX(0.12)" }}
            animate={active ? { transform: ["scaleX(0.12)", "scaleX(1)"] } : undefined}
            transition={{ duration: 16, ease: "linear", repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
};
