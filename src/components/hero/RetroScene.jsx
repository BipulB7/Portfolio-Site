import { motion, useTransform } from "motion/react";
import { ease } from "../../lib/motion";
import { fade } from "./variants";

// Floor plane tilt, and the same tilt shifted by one 48px grid cell (--grid-size)
const GRID_REST = "rotateX(74deg) translateY(0px)";
const GRID_STEP = "rotateX(74deg) translateY(48px)";

/**
 * Synthwave night behind the hero: a striped sun sinking into a neon grid
 * floor and a glowing horizon where they meet. The whole layer is masked to
 * transparent at the bottom (not painted over) so the fixed starfield runs
 * through seamlessly into the next section.
 *
 * Everything here is decorative (aria-hidden, pointer-events-none).
 *  - progress: scroll MotionValue (0 at top of hero, 1 when it has scrolled away)
 *  - show:     entrance gate (intro finished)
 *  - active:   hero is on screen; stops the grid loop when false
 *  - reduce:   prefers-reduced-motion, skips scroll-linked motion
 *
 * --floor is the height of the grid floor (horizon sits on top of it).
 */
export const RetroScene = ({ progress, show, active, reduce }) => {
  const sunSink = useTransform(progress, [0, 1], ["0%", "46%"]);
  const floorFade = useTransform(progress, [0, 0.7], [1, 0]);
  const skyFade = useTransform(progress, [0, 0.9], [1, 0.15]);
  const anim = show ? "show" : "hidden";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden [--floor:26%] [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] sm:[--floor:30%] lg:[--floor:34%]"
    >
      {/* Ambient nebula light */}
      <motion.div initial="hidden" animate={anim} variants={fade(0, 2.4)} className="absolute inset-0">
        <div className="absolute -left-[12%] -top-[18%] aspect-square w-[44rem] max-w-[95vw] rounded-full bg-primary/[0.09] blur-[120px] dark:bg-primary/[0.14]" />
        <div className="absolute right-[-8%] top-[12%] aspect-square w-[34rem] max-w-[85vw] rounded-full bg-neon/[0.06] blur-[130px] dark:bg-neon/[0.08]" />
      </motion.div>

      {/* Sky haze: warm sunset light just above the horizon */}
      <motion.div
        initial="hidden"
        animate={anim}
        variants={fade(0.3, 2.4)}
        className="absolute inset-x-0 bottom-[var(--floor)] hidden h-[42%] [mask-image:linear-gradient(90deg,transparent,#000_55%)] lg:block"
      >
        <motion.div
          style={reduce ? undefined : { opacity: skyFade }}
          className="h-full w-full bg-gradient-to-t from-neon/[0.07] via-primary/[0.035] to-transparent dark:from-neon/[0.11] dark:via-primary/[0.05]"
        />
      </motion.div>

      {/* Sun (lg+): mirrors the content grid so it sits behind the portrait,
          clipped at the horizon so its lower stripes sink below it. */}
      <div className="absolute inset-x-0 top-0 bottom-[var(--floor)] hidden overflow-hidden lg:block">
        <div className="container h-full">
          <div className="grid h-full grid-cols-12 gap-8">
            <div className="relative col-span-5 col-start-8">
              <motion.div
                className="absolute bottom-0 left-1/2 w-[clamp(30rem,37vw,34rem)] -translate-x-1/2"
                initial={{ y: "75%", opacity: 0 }}
                animate={show ? { y: "0%", opacity: 1 } : { y: "75%", opacity: 0 }}
                transition={{ duration: 2.4, delay: 0.1, ease: ease.outExpo }}
              >
                <motion.div style={reduce ? undefined : { y: sunSink }}>
                  <div className="relative aspect-square translate-y-[30%]">
                    <div className="absolute -inset-[22%] rounded-full bg-[radial-gradient(closest-side,hsl(var(--neon)/0.32),hsl(var(--heat)/0.12)_55%,transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,hsl(var(--neon)/0.42),hsl(var(--heat)/0.16)_55%,transparent)]" />
                    <div className="retro-sun absolute inset-0 opacity-75 dark:opacity-90" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid floor */}
      <motion.div
        initial="hidden"
        animate={anim}
        variants={fade(0.35, 2)}
        className="absolute inset-x-0 bottom-0 h-[var(--floor)] lg:[mask-image:linear-gradient(90deg,rgb(0_0_0/0.45),#000_55%)]"
      >
        <motion.div
          style={reduce ? undefined : { opacity: floorFade }}
          className="absolute inset-0 overflow-hidden opacity-[0.17] [perspective:340px] [perspective-origin:50%_0%] dark:opacity-[0.36]"
        >
          {/* Drive toward the horizon by sliding the plane one grid cell along
              its own surface and looping. Same cadence as animate-grid-scroll,
              but transform-only, so the big 3D plane is never repainted. */}
          <motion.div
            className="retro-grid absolute bottom-0 left-1/2 h-[300%] w-[340%] -translate-x-1/2 origin-bottom"
            initial={{ transform: GRID_REST }}
            animate={{ transform: active ? [GRID_REST, GRID_STEP] : GRID_REST }}
            transition={active ? { duration: 3.2, ease: "linear", repeat: Infinity } : { duration: 0 }}
          />
        </motion.div>
        <div className="absolute inset-x-0 top-0 hidden h-[45%] bg-gradient-to-b from-neon/[0.05] to-transparent lg:block dark:from-neon/[0.07]" />
        {/* Sun reflection on the floor (lg+, under the sun) */}
        <div className="absolute inset-0 hidden lg:block">
          <div className="container h-full">
            <div className="grid h-full grid-cols-12 gap-8">
              <div className="relative col-span-5 col-start-8">
                <div className="absolute left-1/2 top-0 h-[70%] w-[min(22rem,70%)] -translate-x-1/2 bg-[radial-gradient(50%_100%_at_50%_0%,hsl(var(--neon)/0.16),transparent)] blur-md dark:bg-[radial-gradient(50%_100%_at_50%_0%,hsl(var(--neon)/0.22),transparent)]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Horizon line + glow (lg+), drawn outward from under the sun */}
      <motion.div
        className="absolute inset-x-0 bottom-[var(--floor)] hidden h-px origin-[70%_50%] [mask-image:linear-gradient(90deg,transparent_32%,#000_58%,#000_90%,transparent)] lg:block"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={show ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 2, delay: 0.2, ease: ease.outExpo }}
      >
        <div className="h-px w-full bg-sunset opacity-60 dark:opacity-80" />
        <div className="absolute inset-x-[8%] -top-[3px] h-[7px] bg-sunset opacity-35 blur-[6px] dark:opacity-50" />
      </motion.div>
    </div>
  );
};
