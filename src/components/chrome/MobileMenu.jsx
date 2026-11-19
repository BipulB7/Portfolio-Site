import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "../../data/content";
import { ease } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { ThemeToggle } from "../ThemeToggle";
import { Monogram } from "./Monogram";
import { MenuButton } from "./MenuButton";
import { SocialLinks } from "./SocialLinks";
import { RetroHorizon } from "./RetroHorizon";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.22 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const linkVariants = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: ease.outExpo } },
  exit: { y: "-40%", opacity: 0, transition: { duration: 0.35, ease: ease.inOutQuint } },
};
const footVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.55, ease: ease.outExpo } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * Full-screen mobile menu. Opens as a circle expanding from the hamburger
 * (origin = { x, y, r } in viewport px). Mirrors the header bar at the top so
 * the hamburger appears to morph into the close button in place.
 */
export const MobileMenu = ({ open, origin, links, active, onClose, onNavigate, onTop }) => {
  const reduce = useReducedMotion();
  const panelRef = useRef(null);
  const firstLinkRef = useRef(null);

  // Escape to close, Tab cycles inside the dialog, focus moves in on open
  useEffect(() => {
    if (!open) return undefined;
    const raf = requestAnimationFrame(() => firstLinkRef.current?.focus({ preventScroll: true }));

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!panelRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const closed = `circle(0px at ${origin.x}px ${origin.y}px)`;
  const opened = `circle(${origin.r}px at ${origin.x}px ${origin.y}px)`;
  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { clipPath: closed },
        animate: { clipPath: opened, transition: { duration: 0.85, ease: ease.outExpo } },
        exit: { clipPath: closed, transition: { duration: 0.6, ease: ease.inOutQuint, delay: 0.1 } },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-lenis-prevent
          className="fixed inset-0 z-[55] flex flex-col overflow-y-auto overscroll-contain bg-background md:hidden"
          {...panelMotion}
        >
          {/* Night-sky backdrop: violet glow up top, sunset haze and horizon below */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/4 left-1/2 h-[70vh] w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.16),transparent_65%)]" />
            <div className="absolute inset-0 bg-lattice opacity-70" />
          </div>

          {/* Top bar: same geometry as the header bar underneath */}
          <div className="relative px-4 pt-3">
            <div className="flex items-center justify-between rounded-full border border-transparent py-1.5 pl-4 pr-1.5">
              <Monogram
                href="#hero"
                aria-label={`${profile.firstName} ${profile.lastName}, back to top`}
                onClick={onTop}
              />
              <MenuButton open playOnMount onClick={onClose} />
            </div>
          </div>

          <nav aria-label="Mobile" className="relative z-[1] flex flex-1 flex-col justify-center px-7 py-10">
            <p className="eyebrow mb-6 text-muted-foreground">Tracklist</p>
            <motion.ul className="space-y-1" variants={listVariants} initial="hidden" animate="show" exit="exit">
              {links.map((item, index) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="overflow-hidden">
                    <motion.a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={`#${item.id}`}
                      onClick={(event) => onNavigate(event, item.id)}
                      aria-current={isActive ? "true" : undefined}
                      variants={linkVariants}
                      className="group flex items-baseline gap-4 rounded-lg py-1.5 outline-offset-2"
                    >
                      <span
                        className={cn(
                          "w-6 font-mono text-[0.7rem] tracking-[0.18em] transition-colors",
                          isActive ? "text-neon" : "text-muted-foreground"
                        )}
                      >
                        {item.track}
                      </span>
                      <span
                        className={cn(
                          "font-display text-[clamp(2.6rem,12vw,3.6rem)] leading-[1.05] tracking-[-0.02em]",
                          isActive ? "text-sunset italic pr-2" : "text-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                    </motion.a>
                  </li>
                );
              })}
            </motion.ul>
          </nav>

          <motion.div
            className="relative flex min-h-40 flex-col justify-end px-7 pb-8"
            variants={footVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Sun sets on this block's top edge; the horizon line is its divider */}
            <div aria-hidden="true" className="absolute inset-0 opacity-60 dark:opacity-100">
              <RetroHorizon fill sunSize={210} rise={0.6} sunOpacity={0.18} gridOpacity={0.22} gridSize={34} perspective={200} />
            </div>
            <div className="relative flex items-center justify-between gap-4">
              <SocialLinks />
              <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card/50 p-0.5">
                <ThemeToggle />
              </div>
            </div>
            <div className="relative mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 font-mono text-[0.8rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
                {profile.email}
              </a>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-foreground/85 transition-colors hover:text-foreground"
              >
                Resume
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
