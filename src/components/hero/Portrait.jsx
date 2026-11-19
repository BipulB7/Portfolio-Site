import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { GraduationCap } from "lucide-react";
import bips from "../../assets/bips.jpg";
import { ease } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { NowBuilding } from "./NowBuilding";
import { fade, rise } from "./variants";

const tiltSpring = { stiffness: 140, damping: 18, mass: 0.5 };
const MAX_TILT = 8;

/** Thin camera-viewfinder corner brackets + a tiny REC tally, like a camcorder frame. */
const Viewfinder = () => (
  <div aria-hidden className="pointer-events-none absolute inset-3.5 sm:inset-5">
    <span className="absolute left-0 top-0 h-5 w-5 rounded-tl-md border-l-[1.5px] border-t-[1.5px] border-white/70" />
    <span className="absolute right-0 top-0 h-5 w-5 rounded-tr-md border-r-[1.5px] border-t-[1.5px] border-white/70" />
    <span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl-md border-b-[1.5px] border-l-[1.5px] border-white/70" />
    <span className="absolute bottom-0 right-0 h-5 w-5 rounded-br-md border-b-[1.5px] border-r-[1.5px] border-white/70" />
    <span className="absolute left-7 top-[3px] flex items-center gap-1.5 font-mono text-[0.58rem] tracking-[0.24em] text-white/85 [text-shadow:0_1px_6px_rgb(0_0_0/0.5)]">
      <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_hsl(var(--neon))] animate-pulse-subtle" />
      REC
    </span>
  </div>
);

/** Below lg the big scene sun is hidden, so the portrait gets its own small sunset. */
const MobileSun = ({ show }) => (
  <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden">
    <div className="absolute -top-[12%] bottom-[22%] left-1/2 w-[170%] -translate-x-1/2 overflow-hidden">
      <motion.div
        className="absolute bottom-0 left-1/2 w-[72%] -translate-x-1/2"
        initial={{ y: "70%", opacity: 0 }}
        animate={show ? { y: "0%", opacity: 1 } : { y: "70%", opacity: 0 }}
        transition={{ duration: 2.2, delay: 0.15, ease: ease.outExpo }}
      >
        <div className="relative aspect-square translate-y-[32%]">
          <div className="absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,hsl(var(--neon)/0.35),transparent)] blur-2xl" />
          <div className="retro-sun absolute inset-0 opacity-75 dark:opacity-85" />
        </div>
      </motion.div>
    </div>
    <motion.div
      className="absolute bottom-[22%] left-1/2 h-px w-[170%] -translate-x-1/2"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: show ? 1 : 0 }}
      transition={{ duration: 1.8, delay: 0.3, ease: ease.outExpo }}
    >
      <div className="mask-fade-x h-px w-full bg-sunset opacity-80" />
      <div className="mask-fade-x absolute inset-x-[10%] -top-[3px] h-[7px] bg-sunset opacity-40 blur-[6px]" />
    </motion.div>
  </div>
);

/**
 * Hero portrait: spinning conic ring border, colored glow, faint scanlines,
 * viewfinder brackets, and a 3D tilt toward the cursor (mouse only).
 * Floating glass widgets sit in front of it with their own parallax.
 */
export const Portrait = ({ show, reduce, active }) => {
  const ref = useRef(null);
  const px = useMotionValue(0); // -0.5 … 0.5 across the frame
  const py = useMotionValue(0);
  const hover = useMotionValue(0);

  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), tiltSpring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), tiltSpring);
  const glareX = useTransform(px, [-0.5, 0.5], [15, 85]);
  const glareY = useTransform(py, [-0.5, 0.5], [5, 75]);
  const glare = useMotionTemplate`radial-gradient(55% 45% at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.16), transparent 70%)`;
  const glareOpacity = useSpring(hover, { stiffness: 120, damping: 20 });
  // Floating widgets drift further than the frame tilts, so they read as closer
  const nearX = useSpring(useTransform(px, [-0.5, 0.5], [-16, 16]), tiltSpring);
  const nearY = useSpring(useTransform(py, [-0.5, 0.5], [-10, 10]), tiltSpring);
  const farX = useSpring(useTransform(px, [-0.5, 0.5], [-24, 24]), tiltSpring);
  const farY = useSpring(useTransform(py, [-0.5, 0.5], [-14, 14]), tiltSpring);

  const anim = show ? "show" : "hidden";

  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set(Math.min(0.5, Math.max(-0.5, (e.clientX - r.left) / r.width - 0.5)));
    py.set(Math.min(0.5, Math.max(-0.5, (e.clientY - r.top) / r.height - 0.5)));
    hover.set(1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    hover.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto w-full max-w-[16.5rem] [perspective:1000px] sm:max-w-[20rem] lg:mr-0 lg:max-w-[26rem] xl:max-w-[27.5rem]"
    >
      <MobileSun show={show} />

      <motion.div
        style={reduce ? undefined : { rotateX, rotateY }}
        className="relative"
      >
        {/* colored glow behind the frame */}
        <motion.div
          aria-hidden
          initial="hidden"
          animate={anim}
          variants={fade(0.6, 2.2)}
          className="pointer-events-none absolute -inset-6 sm:-inset-10"
        >
          <div className="h-full w-full rounded-[3rem] bg-[conic-gradient(from_210deg,hsl(var(--heat)/0.7),hsl(var(--neon)/0.6),hsl(var(--primary)/0.7),hsl(var(--ice)/0.55),hsl(var(--heat)/0.7))] opacity-25 blur-3xl animate-pulse-subtle dark:opacity-40" />
        </motion.div>

        {/* frame: spinning conic ring visible as a 1.5px border */}
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0% round 2rem)", opacity: 0 }}
          animate={
            show
              ? { clipPath: "inset(0% 0% 0% 0% round 2rem)", opacity: 1 }
              : { clipPath: "inset(100% 0% 0% 0% round 2rem)", opacity: 0 }
          }
          transition={{ duration: 1.6, delay: 0.2, ease: ease.outExpo }}
          className="relative overflow-hidden rounded-[2rem] p-[1.5px] shadow-[0_40px_80px_-40px_hsl(var(--primary)/0.7)]"
        >
          <div
            aria-hidden
            className={cn(
              "absolute left-1/2 top-1/2 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow bg-[conic-gradient(from_0deg,hsl(var(--heat)),hsl(var(--neon)),hsl(var(--primary)),hsl(var(--ice)),hsl(var(--primary)),hsl(var(--heat)))]",
              !active && "[animation-play-state:paused]"
            )}
          />
          <div className="relative overflow-hidden rounded-[calc(2rem-1.5px)] bg-card">
            <motion.img
              src={bips}
              alt="Bipul Banjade standing in a garden, wearing a light-blue shirt and tie"
              width={686}
              height={685}
              fetchPriority="high"
              initial={{ scale: 1.18 }}
              animate={{ scale: show ? 1 : 1.18 }}
              transition={{ duration: 2.2, delay: 0.2, ease: ease.outExpo }}
              className="aspect-[4/5] w-full object-cover object-[50%_20%]"
            />
            {/* lofi grade: warm light leak top-left, violet dusk at the bottom */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_0%_0%,hsl(var(--heat)/0.18),transparent_60%)] mix-blend-screen" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/35 via-neon/[0.08] to-transparent" />
            <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-30" />
            <motion.div
              aria-hidden
              style={{ backgroundImage: glare, opacity: glareOpacity }}
              className="pointer-events-none absolute inset-0"
            />
            <Viewfinder />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating widgets live outside the 3D layer so their glass keeps its
          backdrop blur; they get their own spring parallax instead. */}
      <motion.div
        style={reduce ? undefined : { x: nearX, y: nearY }}
        className="absolute -bottom-9 -left-6 z-10 sm:-left-12 lg:-left-8 lg:bottom-14 xl:-left-16"
      >
        <motion.div initial="hidden" animate={anim} variants={rise(1.15, { y: 20 })}>
          <div className="animate-float">
            <NowBuilding active={active} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { x: farX, y: farY }}
        className="absolute -right-4 -top-4 z-10 sm:-right-8 sm:top-6 lg:-right-4 lg:top-14 xl:-right-10"
      >
        <motion.div initial="hidden" animate={anim} variants={rise(1.3, { y: 16 })}>
          <div className="glass flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-[0.72rem] animate-float-slow sm:text-xs">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-ice/15 text-ice">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="whitespace-nowrap text-foreground">CS + Physics</span>
            <span aria-hidden className="text-muted-foreground">·</span>
            <span className="whitespace-nowrap font-mono text-[0.68rem] text-muted-foreground">NYU ’26</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
