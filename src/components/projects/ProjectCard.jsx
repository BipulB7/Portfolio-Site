import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { ease, softSpring } from "../../lib/motion";
import { ProjectArt } from "../ProjectArt";
import { OrgBadge } from "./OrgBadge";
import { layoutSpring } from "./scrollLock";

const MAX_TILT = 6;
const MAX_TAGS = 4;

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.97, filter: "blur(10px)" },
  show: ({ i, quick }) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: quick ? 0.7 : 1.1,
      ease: ease.outExpo,
      delay: quick ? 0.12 + i * 0.05 : i * 0.09,
    },
    transitionEnd: { filter: "none" },
  }),
  exit: {
    opacity: 0,
    scale: 0.94,
    filter: "blur(10px)",
    transition: { duration: 0.35, ease: ease.outQuart },
  },
};

/**
 * Bento project card: tilts toward the cursor, carries a heat-spot glow,
 * and morphs into the detail modal (shared layoutIds for card, cover, title).
 *
 * spans: { lgSpan, mdSpan, tallLg } decide the bento footprint per filter.
 */
export const ProjectCard = ({ ref, project, index, spans, inView, quick, onOpen }) => {
  const { lgSpan, mdSpan, tallLg } = spans;
  const reduce = useReducedMotion();
  const elRef = useRef(null);
  const btnRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, softSpring);
  const sry = useSpring(ry, softSpring);

  const setRefs = useCallback(
    (node) => {
      elRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const resetTilt = (instant = false) => {
    rx.set(0);
    ry.set(0);
    if (instant) {
      rx.jump(0);
      ry.jump(0);
      srx.jump(0);
      sry.jump(0);
    }
  };

  const onPointerMove = (e) => {
    const el = elRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (e.pointerType !== "mouse" || reduce) return;
    // wide (featured) cards tilt less so their edges don't swing too far
    const max = MAX_TILT * Math.min(1, 420 / r.width);
    ry.set((x / r.width - 0.5) * 2 * max);
    rx.set((0.5 - y / r.height) * 2 * max);
  };

  const onPointerEnter = (e) => {
    if (e.pointerType === "mouse") setHovered(true);
  };

  const onPointerLeave = () => {
    setHovered(false);
    resetTilt();
  };

  const open = () => {
    resetTilt(true);
    setHovered(false);
    onOpen(project.id, btnRef.current);
  };

  const active = hovered || focused;
  const extra = project.tags.length - MAX_TAGS;
  const featuredText = mdSpan || lgSpan;

  return (
    <motion.li
      ref={setRefs}
      layout
      layoutId={`card-${project.id}`}
      custom={{ i: index, quick }}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      exit="exit"
      transition={{ layout: layoutSpring }}
      style={{ borderRadius: 24, rotateX: srx, rotateY: sry, transformPerspective: 1100 }}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        "group/card relative isolate flex flex-col overflow-hidden rounded-3xl glass",
        "transition-[border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)]",
        "hover:border-primary/35 hover:shadow-[0_40px_80px_-40px_hsl(var(--primary)/0.55)]",
        "has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-4 has-[button:focus-visible]:outline-ring",
        mdSpan && "md:col-span-2",
        lgSpan ? "lg:col-span-2" : mdSpan && "lg:col-span-1"
      )}
    >
      {/* heat spot: warm core cooling to violet and ice as it spreads */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(460px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--heat) / 0.15), hsl(var(--neon) / 0.09) 25%, hsl(var(--primary) / 0.07) 45%, hsl(var(--ice) / 0.04) 60%, transparent 72%)",
        }}
      />

      {/* cover */}
      <motion.div
        layoutId={`cover-${project.id}`}
        transition={{ layout: layoutSpring }}
        className={cn(
          "relative w-full shrink-0 overflow-hidden",
          "h-52",
          mdSpan && "md:h-64",
          lgSpan || tallLg ? "lg:h-72" : mdSpan && "lg:h-52"
        )}
        style={{ borderRadius: 0 }}
      >
        <ProjectArt variant={project.art} image={project.image} active={active} />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-sunset opacity-30 transition-opacity duration-500 group-hover/card:opacity-90"
        />
      </motion.div>

      {/* body */}
      <motion.div layout="position" className="flex flex-1 flex-col p-6 sm:p-7">
        <div
          className={cn(
            mdSpan && "md:flex md:items-start md:justify-between md:gap-10",
            lgSpan ? "lg:flex lg:items-start lg:justify-between lg:gap-10" : mdSpan && "lg:block"
          )}
        >
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <OrgBadge project={project} />
              <span className="font-mono text-xs tracking-wider text-muted-foreground">{project.year}</span>
            </div>
            <motion.h3
              layoutId={`title-${project.id}`}
              layout="position"
              transition={{ layout: layoutSpring }}
              className={cn(
                "font-display text-[1.75rem] leading-[1.06] tracking-[-0.01em] text-balance",
                "transition-[text-shadow] duration-500 dark:group-hover/card:[text-shadow:-1px_0_hsl(var(--neon)/0.45),1px_0_hsl(var(--ice)/0.45)]",
                mdSpan && "md:text-[2.25rem]",
                lgSpan ? "lg:text-[2.5rem]" : mdSpan && "lg:text-[1.75rem]"
              )}
            >
              {project.title}
            </motion.h3>
            <p
              className={cn(
                "mt-3 text-sm leading-relaxed text-muted-foreground text-pretty",
                featuredText && "md:max-w-md"
              )}
            >
              {project.tagline}
            </p>
          </div>

          {project.stats?.length > 0 && featuredText && (
            <dl
              className={cn(
                "hidden shrink-0 gap-8 pt-9",
                mdSpan && "md:flex",
                lgSpan ? "lg:flex" : mdSpan && "lg:hidden"
              )}
            >
              {project.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse justify-end">
                  <dt className="mt-1 max-w-[7rem] font-mono text-[10px] uppercase leading-snug tracking-[0.16em] text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="font-display text-4xl leading-none text-gradient">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tags.slice(0, MAX_TAGS).map((t) => (
            <li key={t} className="chip text-[11px]">
              {t}
            </li>
          ))}
          {extra > 0 && (
            <li className="chip font-mono text-[11px] text-muted-foreground" aria-label={`and ${extra} more`}>
              +{extra}
            </li>
          )}
        </ul>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <button
              ref={btnRef}
              type="button"
              onClick={open}
              aria-haspopup="dialog"
              aria-label={`View details: ${project.title}`}
              className="text-sm font-medium text-foreground/90 transition-colors duration-300 after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:content-[''] focus-visible:outline-none group-hover/card:text-foreground"
            >
              View details
            </button>
            <span
              aria-hidden
              className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-border/80 transition-colors duration-500 group-hover/card:border-primary/50 group-hover/card:bg-primary/10"
            >
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/card:translate-x-5 group-hover/card:-translate-y-5" />
              <ArrowUpRight className="absolute h-4 w-4 -translate-x-5 translate-y-5 text-primary transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/card:translate-x-0 group-hover/card:translate-y-0" />
            </span>
          </div>
        </div>
      </motion.div>

      {/* lit border near the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          padding: 1,
          background:
            "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--neon) / 0.75), hsl(var(--primary) / 0.4) 40%, transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </motion.li>
  );
};
