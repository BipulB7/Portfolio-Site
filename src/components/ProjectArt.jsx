import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";
import { VARIANTS } from "./projects/art/palette";
import { CadScene, LatticeScene, NetworkScene, ReplayScene, ThermalScene } from "./projects/art/scenesWork";
import { ConstellationScene, LedgerScene, NeuralScene } from "./projects/art/scenesPersonal";
import "./projects/art/project-art.css";

const SCENES = {
  lattice: LatticeScene,
  thermal: ThermalScene,
  replay: ReplayScene,
  cad: CadScene,
  network: NetworkScene,
  constellation: ConstellationScene,
  ledger: LedgerScene,
  neural: NeuralScene,
};

const subscribeVisibility = (cb) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};
const getVisible = () => document.visibilityState !== "hidden";
const getVisibleServer = () => true;

/**
 * Generative, animated cover art for a project: a cohesive series of
 * lofi-night "album covers" (night sky, horizon glow, neon grid floor,
 * scanlines, vignette) with a subject per variant.
 *
 * Animations only run while the cover is on screen and the tab is visible,
 * never with reduced motion; `active` (hover / open) plays them faster and
 * a touch brighter.
 */
export const ProjectArt = ({ variant = "lattice", image, active = false, className }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.05 });
  const pageVisible = useSyncExternalStore(subscribeVisibility, getVisible, getVisibleServer);
  const uid = `pa${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const meta = VARIANTS[variant] ?? VARIANTS.lattice;
  const Scene = SCENES[variant] ?? SCENES.lattice;
  const seed = Number(meta.no) * 7919;
  const play = inView && pageVisible && !reduce;

  // Speed up (or restore) every CSS animation inside the cover without a jump.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.getAnimations !== "function") return;
    const rate = active ? 1.9 : 1;
    try {
      el.getAnimations({ subtree: true }).forEach((a) => {
        if (typeof a.updatePlaybackRate === "function") a.updatePlaybackRate(rate);
        else a.playbackRate = rate;
      });
    } catch {
      /* older engines: keep default speed */
    }
  }, [active, play]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-play={play ? "" : undefined}
      data-active={active ? "" : undefined}
      className={cn("pa relative isolate h-full w-full overflow-hidden bg-[#04061a]", className)}
    >
      <svg
        className="pa-svg absolute inset-0 h-full w-full"
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <Scene uid={uid} accent={meta.accent} seed={seed} image={image} />
      </svg>

      {/* CRT scanlines, vignette and a faint top sheen */}
      <div className="pointer-events-none absolute inset-0 scanlines opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_42%,transparent_52%,rgba(2,3,12,0.72)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.035] to-transparent" />

      {/* album-series corner label */}
      <div className="pointer-events-none absolute left-4 top-3.5 flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.28em] text-white/55">
        <span className="text-white/85">{meta.no}</span>
        <span className="h-px w-4 bg-white/35" />
        <span>{meta.name}</span>
      </div>
    </div>
  );
};
