import { useEffect, useRef } from "react";
import { motion, useIsPresent } from "motion/react";
import { ExternalLink, Github, Lock, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { ease } from "../../lib/motion";
import { akashResults, SHOW_AKASH_RESULTS } from "../../data/content";
import { ProjectArt } from "../ProjectArt";
import { OrgBadge } from "./OrgBadge";
import { acquireScrollLock, layoutSpring, releaseScrollLock } from "./scrollLock";

const pad = (n) => String(n).padStart(2, "0");

const content = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.2 } },
  exit: {},
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: ease.outExpo } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Project detail dialog. The panel, cover and title share layoutIds with the
 * clicked card, so the card morphs into this panel (and back on close).
 * Rendered in a portal on <body> so it sits above the nav (z-[90]).
 */
export const ProjectModal = ({ project, number, total, onClose }) => {
  const isPresent = useIsPresent();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = `project-title-${project.id}`;
  const descId = `project-summary-${project.id}`;
  const showResults = SHOW_AKASH_RESULTS && project.showResults;
  const isWork = project.kind === "work";

  useEffect(() => {
    acquireScrollLock();
    closeRef.current?.focus({ preventScroll: true });
    return releaseScrollLock;
  }, []);

  useEffect(() => {
    if (!isPresent) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isPresent, onClose]);

  // Keep Tab focus inside the dialog
  const onKeyDown = (e) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const nodes = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
      (n) => n.getClientRects().length > 0
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={cn("fixed inset-0 z-[90]", !isPresent && "pointer-events-none")}>
      {/* backdrop */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: ease.outQuart }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(60%_80%_at_50%_100%,hsl(var(--neon)/0.14),transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      />

      <div
        className="absolute inset-0 flex items-center justify-center p-3 sm:p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={panelRef}
          layoutId={`card-${project.id}`}
          transition={{ layout: layoutSpring }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          onKeyDown={onKeyDown}
          style={{ borderRadius: 24 }}
          className={cn(
            "relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl",
            "border border-border/70 bg-card/95 backdrop-blur-2xl",
            "shadow-[0_50px_120px_-40px_hsl(var(--primary)/0.5),0_0_0_1px_hsl(var(--foreground)/0.03)]"
          )}
        >
          <motion.button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.25, duration: 0.5, ease: ease.outExpo } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline-white sm:right-4 sm:top-4"
          >
            <X className="h-4.5 w-4.5" strokeWidth={1.8} />
          </motion.button>

          <motion.div
            layoutScroll
            data-lenis-prevent
            tabIndex={0}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:outline-none"
          >
            <motion.div
              layoutId={`cover-${project.id}`}
              transition={{ layout: layoutSpring }}
              className="relative h-56 w-full shrink-0 overflow-hidden sm:h-80"
              style={{ borderRadius: 0 }}
            >
              <ProjectArt variant={project.art} image={project.image} active />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </motion.div>

            <motion.div
              className="relative -mt-8 px-6 pb-9 sm:px-10 sm:pb-11"
              variants={content}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.div variants={item} className="flex flex-wrap items-center gap-3">
                <OrgBadge project={project} />
                <span className="font-mono text-xs tracking-wider text-muted-foreground">{project.year}</span>
                <span className="ml-auto font-mono text-[11px] tracking-[0.22em] text-muted-foreground">
                  {pad(number)} / {pad(total)}
                </span>
              </motion.div>

              <motion.h2
                id={titleId}
                layoutId={`title-${project.id}`}
                layout="position"
                transition={{ layout: layoutSpring }}
                className="mt-5 font-display text-[2.4rem] leading-[1.02] tracking-[-0.015em] text-balance sm:text-[3.25rem]"
              >
                {project.title}
              </motion.h2>

              <motion.p variants={item} className="mt-3 font-display text-xl italic text-muted-foreground sm:text-2xl">
                {project.tagline}
              </motion.p>

              <motion.p
                id={descId}
                variants={item}
                className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85 text-pretty"
              >
                {project.summary}
              </motion.p>

              {project.stats?.length > 0 && (
                <motion.dl
                  variants={item}
                  className="mt-9 grid grid-cols-3 gap-4 border-y border-border/60 py-6 sm:gap-8"
                >
                  {project.stats.map((s) => (
                    <div key={s.label} className="flex min-w-0 flex-col-reverse justify-end">
                      <dt className="mt-2 font-mono text-[10px] uppercase leading-snug tracking-[0.16em] text-muted-foreground">
                        {s.label}
                      </dt>
                      <dd className="font-display text-4xl leading-none text-gradient sm:text-5xl">{s.value}</dd>
                    </div>
                  ))}
                </motion.dl>
              )}

              {showResults && (
                <motion.section variants={item} className="mt-10" aria-labelledby={`${titleId}-results`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 id={`${titleId}-results`} className="eyebrow">
                      Results
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Rounded, high-level figures
                    </p>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {akashResults.map((r) => (
                      <div
                        key={r.label}
                        className="flex flex-col-reverse justify-end rounded-2xl border border-border/70 bg-secondary/40 p-4"
                      >
                        <dt className="mt-2 text-xs leading-snug text-muted-foreground">{r.label}</dt>
                        <dd className="font-display text-[2rem] leading-none text-thermal">{r.value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.section>
              )}

              {project.points?.length > 0 && (
                <motion.section variants={item} className="mt-10" aria-labelledby={`${titleId}-points`}>
                  <h3 id={`${titleId}-points`} className="eyebrow">
                    Highlights
                  </h3>
                  <ol className="mt-4 divide-y divide-border/60 border-y border-border/60">
                    {project.points.map((p, i) => (
                      <li key={p} className="grid grid-cols-[2.25rem_1fr] gap-3 py-4">
                        <span className="pt-[3px] font-mono text-[11px] tracking-wider text-neon/80">{pad(i + 1)}</span>
                        <p className="text-[15px] leading-relaxed text-foreground/85 text-pretty">{p}</p>
                      </li>
                    ))}
                  </ol>
                </motion.section>
              )}

              <motion.ul variants={item} className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
                {project.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </motion.ul>

              {isWork ? (
                <motion.div
                  variants={item}
                  className="mt-8 flex gap-3 rounded-2xl border border-ice/25 bg-ice/[0.06] p-4"
                >
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ice" aria-hidden />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Internal work at Akash Systems, shown at a high level. Code, data and tools are not public.
                  </p>
                </motion.div>
              ) : (
                project.links?.length > 0 && (
                  <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
                    {project.links.map((l) =>
                      l.kind === "github" ? (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="ghost-button">
                          <Github className="h-4 w-4" aria-hidden />
                          {l.label}
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="cosmic-button">
                          {l.label}
                          <ExternalLink className="h-4 w-4" aria-hidden />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      )
                    )}
                  </motion.div>
                )
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
