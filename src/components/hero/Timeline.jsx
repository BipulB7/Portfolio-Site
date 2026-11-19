import { Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { akashResults, experience, SHOW_AKASH_RESULTS } from "../../data/content";
import { ease } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { DiamondMark } from "../ui/DiamondMark";
import { GlowCard } from "../ui/GlowCard";

// Rail x-position (centre of the line and of every node)
const RAIL_X = "left-[11px] sm:left-[19px]";

const entryVariants = {
  hidden: { opacity: 0, x: 56, filter: "blur(10px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: ease.outExpo, delayChildren: 0.3, staggerChildren: 0.07 },
    transitionEnd: { filter: "none" },
  },
};

const entryViewport = { once: true, amount: 0, margin: "0px 0px -12% 0px" };

const itemVariants = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: ease.outExpo } },
};

export const PingDot = ({ className = "bg-neon", size = "h-1.5 w-1.5" }) => (
  <span aria-hidden className={cn("relative flex shrink-0", size)}>
    <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping-slow", className)} />
    <span className={cn("relative inline-flex rounded-full", size, className)} />
  </span>
);

export const CurrentBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/40 bg-neon/10 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-foreground dark:text-neon">
    <PingDot />
    Current
  </span>
);

export const LogoTile = ({ logo, company, className }) =>
  logo ? (
    <div className={cn("h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/80 sm:h-14 sm:w-14", className)}>
      <img src={logo} alt={`${company} logo`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </div>
  ) : (
    <div
      className={cn(
        "glass grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14",
        className
      )}
    >
      <DiamondMark className="h-7 w-7 sm:h-8 sm:w-8" glow />
    </div>
  );

const Sep = ({ className }) => (
  <span aria-hidden className={cn("h-1 w-1 shrink-0 rotate-45 bg-muted-foreground/50", className)} />
);

const joinParts = (parts) =>
  parts.map((part, i) => (
    <Fragment key={part}>
      {i > 0 && <Sep />}
      <span>{part}</span>
    </Fragment>
  ));

/**
 * Meta line: title (only if known), type, period, location, skipping nulls.
 * Below lg it breaks into two tidy lines (role, then when/where) instead of
 * wrapping mid-list with a dangling separator.
 */
const MetaLine = ({ entry, className }) => {
  const role = [entry.title, entry.type].filter(Boolean);
  const when = [entry.period, entry.location].filter(Boolean);
  return (
    <p
      className={cn(
        "flex flex-col gap-1 font-mono text-[0.68rem] tracking-wide text-muted-foreground sm:text-xs lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-2.5",
        className
      )}
    >
      {role.length > 0 && <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">{joinParts(role)}</span>}
      {role.length > 0 && when.length > 0 && <Sep className="hidden lg:block" />}
      {when.length > 0 && <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">{joinParts(when)}</span>}
    </p>
  );
};

const Results = () => (
  <motion.div
    variants={itemVariants}
    className="mt-7 rounded-2xl border border-border/70 bg-background/40 p-4 sm:p-5"
  >
    <p className="flex items-center gap-2.5 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
      <span aria-hidden className="h-px w-6 bg-thermal" />
      Selected results, rounded
    </p>
    <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {akashResults.map((r) => (
        <div
          key={r.label}
          className="flex flex-col-reverse justify-end gap-2 rounded-xl border border-border/60 bg-card/60 p-3.5"
        >
          <dt className="text-[0.72rem] leading-snug text-muted-foreground sm:text-xs">{r.label}</dt>
          <dd className="w-fit pr-[0.06em] font-display text-[1.7rem] leading-none text-thermal sm:text-[2rem]">{r.value}</dd>
        </div>
      ))}
    </dl>
  </motion.div>
);

const TimelineEntry = ({ entry }) => {
  const ref = useRef(null);
  // Lights up roughly when the progress rail's tip reaches it
  const lit = useInView(ref, { margin: "0px 0px -35% 0px" });
  const featured = Boolean(entry.featured);

  return (
    <li ref={ref} className="relative pl-9 sm:pl-16">
      {/* node on the rail */}
      <span
        aria-hidden
        className={cn("absolute top-9 grid h-5 w-5 -translate-x-1/2 place-items-center sm:top-11", RAIL_X)}
      >
        <span
          className={cn(
            "h-2.5 w-2.5 rotate-45 border transition-[background-color,border-color,box-shadow] duration-700",
            lit
              ? "border-neon bg-neon shadow-[0_0_0_4px_hsl(var(--neon)/0.15),0_0_16px_2px_hsl(var(--neon)/0.7)]"
              : "border-muted-foreground/40 bg-background"
          )}
        />
      </span>

      {/* tall cards: trigger on the top edge, not a share of their height */}
      <motion.div initial="hidden" whileInView="show" viewport={entryViewport} variants={entryVariants}>
        <GlowCard className={cn("p-5 sm:p-7", featured && "sm:p-9")}>
          {featured && (
            <>
              {/* subtle lit-sign frame, a crystal lattice in the corner, a thermal hairline */}
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-50">
                <div className="neon-frame h-full w-full rounded-[inherit] animate-flicker" />
              </div>
              <div aria-hidden className="bg-lattice pointer-events-none absolute -right-24 -top-24 h-80 w-80 opacity-90" />
              <div aria-hidden className="pointer-events-none absolute inset-x-10 top-0 h-px bg-thermal opacity-80" />
            </>
          )}

          <div className="relative">
            {/* header: logo + company; meta sits under the name (full width on phones) */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3.5 sm:gap-x-5 sm:gap-y-2.5">
              <LogoTile
                logo={entry.logo}
                company={entry.company}
                className={cn("sm:row-span-2 sm:self-start", featured && "sm:h-16 sm:w-16")}
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:self-end">
                <h4
                  className={cn(
                    "font-display leading-none text-foreground",
                    featured ? "text-[1.9rem] sm:text-[2.6rem]" : "text-[1.6rem] sm:text-[2rem]"
                  )}
                >
                  {entry.company}
                </h4>
                {featured && <CurrentBadge />}
              </div>
              <MetaLine entry={entry} className="col-span-2 sm:col-span-1 sm:col-start-2 sm:self-start" />
            </div>

            {/* body aligns under the company name with a readable measure */}
            <div className={cn("sm:pl-[4.75rem]", featured && "sm:pl-[5.25rem]")}>
              <motion.p
                variants={itemVariants}
                className={cn(
                  "mt-5 max-w-3xl leading-relaxed text-foreground/85 text-pretty",
                  featured ? "text-base sm:text-lg" : "text-[0.95rem] sm:text-base"
                )}
              >
                {entry.summary}
              </motion.p>

              <ul className="mt-4 max-w-3xl space-y-2.5">
                {entry.highlights.map((h) => (
                  <motion.li
                    key={h}
                    variants={itemVariants}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-ice shadow-[0_0_8px_hsl(var(--ice)/0.7)]"
                    />
                    <span>{h}</span>
                  </motion.li>
                ))}
              </ul>

              {featured && SHOW_AKASH_RESULTS && akashResults.length > 0 && <Results />}

              <motion.ul variants={itemVariants} className="mt-6 flex flex-wrap gap-2" aria-label="Tools and skills">
                {entry.tags.map((t) => (
                  <li key={t} className="chip font-mono text-[0.68rem]">
                    {t}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </li>
  );
};

/**
 * Vertical experience timeline. A thermal-gradient rail fills as you scroll
 * through it, with a glowing heat pulse riding the tip; each node lights as
 * its entry comes into view.
 */
export const ExperienceTimeline = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.35 });
  const tipY = useTransform(progress, [0, 1], ["0%", "100%"]);
  const tipOpacity = useTransform(progress, [0, 0.015, 1], [0, 1, 1]);

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className={cn("pointer-events-none absolute bottom-4 top-4 w-px -translate-x-1/2", RAIL_X)}>
        <div className="absolute inset-0 bg-border" />
        <motion.div
          style={{ scaleY: reduce ? 1 : progress }}
          className="absolute inset-0 origin-top bg-[linear-gradient(to_bottom,hsl(var(--heat)),hsl(var(--neon))_35%,hsl(var(--primary))_68%,hsl(var(--ice)))] shadow-[0_0_10px_hsl(var(--neon)/0.55)]"
        />
        {!reduce && (
          <motion.div style={{ y: tipY }} className="absolute inset-x-0 top-0 h-full">
            <motion.span
              style={{ opacity: tipOpacity }}
              className="absolute left-1/2 top-0 flex h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute inline-flex h-full w-full rounded-full bg-heat opacity-70 animate-ping-slow" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-heat shadow-[0_0_0_3px_hsl(var(--heat)/0.2),0_0_18px_4px_hsl(var(--heat)/0.75)]" />
            </motion.span>
          </motion.div>
        )}
      </div>

      <ol className="relative space-y-8 sm:space-y-10">
        {experience.map((entry) => (
          <TimelineEntry key={entry.id} entry={entry} />
        ))}
      </ol>
    </div>
  );
};
