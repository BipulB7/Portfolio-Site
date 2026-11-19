import { useRef } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "../lib/utils";
import { applyTheme, useIsDark } from "./chrome/theme";

const iconMotion = {
  initial: { rotate: -90, scale: 0.4, opacity: 0 },
  animate: { rotate: 0, scale: 1, opacity: 1 },
  exit: { rotate: 90, scale: 0.4, opacity: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Light / dark switch. With the View Transitions API the new theme is revealed
 * as a circle growing out of the button; otherwise it switches instantly.
 * Any number of instances stay in sync through the <html> class (useIsDark).
 */
export const ThemeToggle = ({ className }) => {
  const [isDark, setIsDark] = useIsDark();
  const buttonRef = useRef(null);

  const toggle = () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";

    const commit = () => {
      applyTheme(next);
      setIsDark(next === "dark");
    };

    if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) {
      commit();
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => {
      // Commit the class change and React's icon swap inside the snapshot
      flushSync(commit);
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 700,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {
        /* transition skipped (e.g. another one started): theme is already applied */
      });
  };

  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "group relative grid h-9 w-9 place-items-center overflow-hidden rounded-full text-muted-foreground",
        "transition-colors duration-300 hover:bg-foreground/[0.06] hover:text-foreground",
        className
      )}
    >
      {/* warm/cool halo behind the glyph */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-1.5 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100",
          isDark ? "bg-heat/30" : "bg-primary/25"
        )}
      />
      <AnimatePresence mode="popLayout" initial={false}>
        {isDark ? (
          <motion.span key="sun" className="relative grid place-items-center text-heat" {...iconMotion}>
            <Sun aria-hidden="true" className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
          </motion.span>
        ) : (
          <motion.span key="moon" className="relative grid place-items-center text-primary" {...iconMotion}>
            <Moon aria-hidden="true" className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
