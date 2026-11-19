import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { StarBackground } from "../components/StarBackground";
import { Monogram } from "../components/chrome/Monogram";
import { RetroHorizon } from "../components/chrome/RetroHorizon";
import { ThemeToggle } from "../components/ThemeToggle";
import { profile } from "../data/content";
import { ease } from "../lib/motion";

const rise = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: ease.outExpo },
});

export const NotFound = () => {
  useEffect(() => {
    const previous = document.title;
    document.title = `Lost in orbit | ${profile.firstName} ${profile.lastName}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      <StarBackground />

      {/* Synthwave horizon behind everything */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute left-1/2 top-[38%] h-[60vh] w-[90vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.14),transparent_65%)]" />
        <div className="absolute inset-0 opacity-75 dark:opacity-100">
          <div className="sm:hidden">
            <RetroHorizon sunSize={250} horizon={150} rise={0.64} sunOpacity={0.3} gridOpacity={0.5} gridSize={34} animated />
          </div>
          <div className="hidden sm:block">
            <RetroHorizon sunSize={460} horizon={170} rise={0.66} sunOpacity={0.3} gridOpacity={0.5} gridSize={46} animated />
          </div>
        </div>
      </div>

      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
        <Monogram as={Link} to="/" aria-label={`${profile.firstName} ${profile.lastName}, home`} />
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pb-32 pt-24 text-center">
        <motion.p {...rise(0.05)} className="eyebrow flex items-center gap-2.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_hsl(var(--neon))]" />
          Error 404
          <span aria-hidden="true" className="h-px w-6 bg-primary/50" />
          Signal lost
        </motion.p>

        <motion.p
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease: ease.outExpo }}
          className="mt-4 select-none font-display text-[clamp(7.5rem,30vw,17rem)] leading-[0.82] tracking-[-0.04em]"
        >
          <span className="animate-flicker inline-block text-sunset pr-[0.06em] [filter:drop-shadow(0_0_22px_hsl(var(--neon)/0.45))]">
            4<span className="italic">0</span>4
          </span>
        </motion.p>

        <motion.h1
          {...rise(0.3)}
          className="mt-6 font-display text-[clamp(2.1rem,6vw,3.4rem)] leading-[1.02] tracking-[-0.02em]"
        >
          Lost in <span className="italic text-thermal">orbit</span>
        </motion.h1>

        <motion.p {...rise(0.42)} className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
          This page drifted out of range.
        </motion.p>

        <motion.div {...rise(0.55)} className="mt-10">
          <Link to="/" className="cosmic-button group">
            <ArrowLeft
              aria-hidden="true"
              strokeWidth={1.8}
              className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1"
            />
            Back to home
          </Link>
        </motion.div>
      </main>
    </div>
  );
};
