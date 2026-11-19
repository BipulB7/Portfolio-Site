import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { ChevronsRight } from "lucide-react";
import { useIntro } from "../context/IntroContext";
import { getLenis, unlockScroll } from "../lib/scroll";
import { ease } from "../lib/motion";
import { profile } from "../data/content";
import { IntroDiamond } from "./atmosphere/IntroDiamond";
import { CassetteGlyph, IntroBackdrop } from "./atmosphere/IntroParts";

/**
 * Cinematic opener (about 2.4s):
 *  1. a brilliant-cut diamond strokes itself in and its facets shimmer
 *  2. the name rises letter by letter, then the role line tracks in
 *  3. the picture collapses into a glowing sunset line (CRT style), and the
 *     curtain splits open from that line to reveal the site
 * The hero is told to start (markIntroDone) the moment the split begins.
 */

const T = {
  name: 0.3, // first letter starts
  letter: 0.03, // stagger per letter
  role: 0.74,
  counter: 1.3, // 000 -> 100
  collapse: 1.42, // picture folds into the line (0.3s)
  split: 1.72, // curtain opens
};
const SPLIT = 0.85;
const SPLIT_FAST = 0.6;
const CURTAIN_EASE = [0.83, 0, 0.17, 1];

const Letters = ({ text, startIndex, italic = false }) =>
  Array.from(text).map((char, i) => (
    <span
      key={`${char}-${i}`}
      className="inline-block pb-[0.14em]"
      // clip only below the baseline box so italic overhangs are never cut
      style={{ clipPath: "inset(-40% -25% 0 -25%)" }}
    >
      <motion.span
        className={`inline-block ${italic ? "italic" : ""}`}
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.8, delay: T.name + (startIndex + i) * T.letter, ease: ease.outExpo }}
      >
        {char}
      </motion.span>
    </span>
  ));

export const Intro = () => {
  const { shouldPlayIntro, markIntroDone } = useIntro();
  const [phase, setPhase] = useState(shouldPlayIntro ? "play" : "done");
  const [fast, setFast] = useState(false);
  const skipRef = useRef(() => {});

  const count = useMotionValue(0);
  const counterText = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const counterFill = useTransform(count, (v) => v / 100);

  useEffect(() => {
    if (!shouldPlayIntro) return undefined;

    // Lock scrolling. Lenis is created by a parent effect that runs after this
    // one, so stop it on the next frame.
    document.documentElement.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => getLenis()?.stop());

    const counter = animate(count, 100, { duration: T.counter, delay: 0.05, ease: [0.5, 0, 0.2, 1] });

    let stage = "play";
    const timers = [];
    const later = (fn, seconds) => timers.push(setTimeout(fn, seconds * 1000));
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };

    const finish = () => {
      if (stage === "done") return;
      stage = "done";
      clearTimers();
      unlockScroll();
      setPhase("done");
    };

    const split = (skipped) => {
      if (stage === "split" || stage === "done") return;
      stage = "split";
      clearTimers();
      if (skipped) {
        counter.stop();
        count.set(100);
      }
      setFast(skipped);
      setPhase("split");
      markIntroDone();
      later(finish, (skipped ? SPLIT_FAST : SPLIT) + 0.06);
    };

    later(() => {
      stage = "collapse";
      setPhase("collapse");
    }, T.collapse);
    later(() => split(false), T.split);

    skipRef.current = () => split(true);
    const onKey = (e) => {
      if (e.key === "Escape") split(true);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimers();
      cancelAnimationFrame(raf);
      counter.stop();
      window.removeEventListener("keydown", onKey);
      skipRef.current = () => {};
      unlockScroll();
    };
  }, [shouldPlayIntro, markIntroDone, count]);

  if (!shouldPlayIntro || phase === "done") return null;

  const splitting = phase === "split";
  const collapsed = phase !== "play";
  const curtain = { duration: fast ? SPLIT_FAST : SPLIT, ease: CURTAIN_EASE };
  const edgeGlow = {
    boxShadow: "0 0 10px 0.5px hsl(var(--neon) / 0.75), 0 0 34px 2px hsl(var(--primary) / 0.45)",
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Curtain: two halves that part from the centre line */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[calc(50%+1px)] overflow-hidden will-change-transform"
        initial={false}
        animate={{ y: splitting ? "-100%" : "0%" }}
        transition={curtain}
      >
        <div className="absolute inset-x-0 top-0 h-[calc(200%-2px)]">
          <IntroBackdrop />
        </div>
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px bg-sunset"
          style={edgeGlow}
          initial={false}
          animate={{ opacity: splitting ? 1 : 0 }}
          transition={{ duration: 0.05 }}
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[calc(50%+1px)] overflow-hidden will-change-transform"
        initial={false}
        animate={{ y: splitting ? "100%" : "0%" }}
        transition={curtain}
      >
        <div className="absolute inset-x-0 bottom-0 h-[calc(200%-2px)]">
          <IntroBackdrop />
        </div>
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-sunset"
          style={edgeGlow}
          initial={false}
          animate={{ opacity: splitting ? 1 : 0 }}
          transition={{ duration: 0.05 }}
        />
      </motion.div>

      {/* Stage: diamond + name. Folds into the line like a CRT switching over. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        initial={false}
        animate={
          collapsed
            ? fast
              ? { opacity: 0, scaleY: 1, scaleX: 1, filter: "brightness(1)" }
              : {
                  opacity: [1, 1, 0],
                  scaleY: [1, 0.012],
                  scaleX: [1, 1.08],
                  filter: ["brightness(1)", "brightness(2.2)"],
                }
            : { opacity: 1, scaleY: 1, scaleX: 1, filter: "brightness(1)" }
        }
        transition={
          fast
            ? { duration: 0.2, ease: "easeOut" }
            : { duration: 0.3, ease: [0.55, 0, 0.7, 0.2], opacity: { duration: 0.3, times: [0, 0.7, 1] } }
        }
      >
        <div className="relative">
          {/* soft bloom behind the stone */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, hsl(var(--neon) / 0.22), hsl(var(--primary) / 0.12) 55%, transparent)",
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35, ease: ease.outExpo }}
          />
          <IntroDiamond className="relative h-auto w-[132px] sm:w-[156px]" />
        </div>

        <div className="mt-9 whitespace-nowrap font-display text-[2.6rem] leading-none tracking-[-0.02em] text-foreground sm:text-6xl md:text-7xl">
          <Letters text={profile.firstName} startIndex={0} />
          <span className="inline-block w-[0.28em]" />
          <Letters text={profile.lastName} startIndex={profile.firstName.length} italic />
        </div>

        <motion.p
          className="mt-4 font-mono text-[10px] uppercase text-muted-foreground sm:text-[11px]"
          initial={{ opacity: 0, letterSpacing: "0.7em", filter: "blur(4px)" }}
          animate={{ opacity: 1, letterSpacing: "0.34em", filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: T.role, ease: ease.outExpo }}
        >
          {profile.role}
        </motion.p>
      </motion.div>

      {/* The line: flashes across the centre, then becomes the curtain edges */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-sunset"
        style={edgeGlow}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          splitting
            ? { scaleX: 1, opacity: 0 }
            : collapsed
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 0 }
        }
        transition={
          splitting
            ? { opacity: { duration: 0.2 }, scaleX: { duration: 0.2 } }
            : { scaleX: { duration: 0.55, delay: 0.1, ease: ease.outExpo }, opacity: { duration: 0.1, delay: 0.1 } }
        }
      />
      {/* hot spot in the middle of the line */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full [--core:var(--neon)] dark:[--core:var(--foreground)]"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--core) / 0.55), hsl(var(--neon) / 0.25) 45%, transparent)",
        }}
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={collapsed && !fast ? { opacity: [0, 1, 0], scaleX: [0.2, 1.4, 2] } : { opacity: 0, scaleX: 0.2 }}
        transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
      />

      {/* Cassette-deck HUD in the corners */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: collapsed ? 0 : 1 }}
        transition={{ duration: collapsed ? 0.2 : 0.6, delay: collapsed ? 0 : 0.15 }}
      >
        <div className="absolute bottom-6 left-5 font-mono sm:bottom-9 sm:left-9">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_hsl(var(--neon)/0.8)] animate-flicker" />
            Loading
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 tabular-nums">
            <motion.span className="text-2xl font-light text-foreground sm:text-[1.75rem]">{counterText}</motion.span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
          <div className="mt-2.5 h-px w-28 overflow-hidden bg-border sm:w-36">
            <motion.div className="h-full origin-left bg-sunset" style={{ scaleX: counterFill }} />
          </div>
        </div>

        <div className="absolute bottom-6 right-5 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:bottom-9 sm:right-9">
          <CassetteGlyph className="h-[16px] w-[24px] text-muted-foreground" />
          Side A
        </div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => skipRef.current()}
        aria-label="Skip intro"
        className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/40 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground backdrop-blur-sm transition-colors duration-300 hover:border-primary/60 hover:text-foreground sm:right-9 sm:top-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: collapsed ? 0 : 1 }}
        transition={{ duration: collapsed ? 0.2 : 0.6, delay: collapsed ? 0 : 0.25 }}
        style={{ pointerEvents: collapsed ? "none" : "auto" }}
        tabIndex={collapsed ? -1 : 0}
      >
        Skip intro
        <ChevronsRight className="h-3 w-3" aria-hidden="true" />
      </motion.button>
    </div>
  );
};
