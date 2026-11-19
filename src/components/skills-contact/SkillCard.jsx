import { Fragment } from "react";
import { motion } from "motion/react";
import { BrainCircuit, Server, LayoutTemplate, ChartLine, Thermometer, Box, Network, Sparkles } from "lucide-react";
import { GlowCard } from "../ui/GlowCard";
import { cn } from "../../lib/utils";
import { ease, viewport } from "../../lib/motion";

/* content.js stores icon names as strings; map them explicitly. */
const ICONS = {
  BrainCircuit,
  Server,
  LayoutTemplate,
  LineChart: ChartLine,
  ChartLine,
  Thermometer,
  Box,
  Network,
};

/* Full class strings so Tailwind can see them. */
const TONES = {
  neon: {
    tile: "text-neon border-neon/30 bg-neon/10 shadow-[inset_0_0_14px_-4px_hsl(var(--neon)/0.55),0_0_22px_-10px_hsl(var(--neon)/0.8)]",
    glow: "group-hover/glow:shadow-[inset_0_0_16px_-3px_hsl(var(--neon)/0.7),0_0_28px_-6px_hsl(var(--neon)/0.8)]",
    rule: "from-neon/70",
  },
  ice: {
    tile: "text-ice border-ice/30 bg-ice/10 shadow-[inset_0_0_14px_-4px_hsl(var(--ice)/0.55),0_0_22px_-10px_hsl(var(--ice)/0.8)]",
    glow: "group-hover/glow:shadow-[inset_0_0_16px_-3px_hsl(var(--ice)/0.7),0_0_28px_-6px_hsl(var(--ice)/0.8)]",
    rule: "from-ice/70",
  },
  primary: {
    tile: "text-primary border-primary/30 bg-primary/10 shadow-[inset_0_0_14px_-4px_hsl(var(--primary)/0.55),0_0_22px_-10px_hsl(var(--primary)/0.8)]",
    glow: "group-hover/glow:shadow-[inset_0_0_16px_-3px_hsl(var(--primary)/0.7),0_0_28px_-6px_hsl(var(--primary)/0.8)]",
    rule: "from-primary/70",
  },
  heat: {
    tile: "text-heat border-heat/30 bg-heat/10 shadow-[inset_0_0_14px_-4px_hsl(var(--heat)/0.55),0_0_22px_-10px_hsl(var(--heat)/0.8)]",
    glow: "group-hover/glow:shadow-[inset_0_0_16px_-3px_hsl(var(--heat)/0.7),0_0_28px_-6px_hsl(var(--heat)/0.8)]",
    rule: "from-heat/70",
  },
};

const GROUP_TONE = {
  ai: "neon",
  backend: "ice",
  frontend: "primary",
  data: "ice",
  hardware: "heat",
  mechanical: "neon",
  infra: "primary",
};

/* Wide cards go side by side (title left, chips bottom-right) from the
   breakpoint at which they span two columns. */
const WIDE_LAYOUT = {
  md: {
    root: "md:flex-row md:items-end md:gap-10",
    head: "md:w-[42%] md:shrink-0 md:self-start",
    chips: "md:mt-0 md:flex-1 md:pt-0",
  },
  lg: {
    root: "lg:flex-row lg:items-end lg:gap-10",
    head: "lg:w-[42%] lg:shrink-0 lg:self-start",
    chips: "lg:mt-0 lg:flex-1 lg:pt-0",
  },
};

const pad = (n) => String(n).padStart(2, "0");

/* Render "AI & Machine Learning" with an italic serif ampersand. */
const Label = ({ text }) => {
  const parts = text.split(" & ");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className="px-[0.18em] italic text-sunset">&amp;</span>}
    </Fragment>
  ));
};

const chipList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.25 } },
};
const chipItem = {
  hidden: { opacity: 0, y: 10, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: ease.outExpo } },
};

export const SkillCard = ({ group, index, wideAt = null }) => {
  const Icon = ICONS[group.icon] ?? Sparkles;
  const tone = TONES[GROUP_TONE[group.id] ?? "primary"];
  const wide = WIDE_LAYOUT[wideAt];

  return (
    <GlowCard as="article" className={cn("flex h-full flex-col p-6 md:p-7", wide?.root)}>
      {/* crystal lattice wash on the wide cards */}
      {wide && (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-3/4 bg-lattice opacity-80" />
      )}

      {/* faint outlined index numeral */}
      <span
        aria-hidden
        className="sc-index pointer-events-none absolute -top-3 right-4 select-none font-display text-[6.5rem] italic leading-none md:text-[7.5rem]"
      >
        {pad(index + 1)}
      </span>

      <div className={cn("relative", wide?.head)}>
        <span
          className={cn(
            "relative grid h-11 w-11 place-items-center rounded-xl border backdrop-blur-md",
            "transition-shadow duration-500",
            tone.tile,
            tone.glow
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
        </span>

        <h3
          className={cn(
            "relative mt-7 font-display text-[1.75rem] leading-[1.1] tracking-[-0.01em] text-foreground md:text-[2rem]",
            wideAt === "md" && "md:text-[2.5rem]",
            wideAt === "lg" && "lg:text-[2.5rem]"
          )}
        >
          <Label text={group.label} />
        </h3>

        <p className="relative mt-3 flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
          <span aria-hidden className={cn("h-px w-8 bg-gradient-to-r to-transparent", tone.rule)} />
          {pad(group.items.length)} tools
        </p>
      </div>

      <motion.ul
        className={cn("relative mt-6 flex flex-wrap gap-2 pt-1 md:mt-auto md:pt-7", wide?.chips)}
        variants={chipList}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {group.items.map((item) => (
          <motion.li key={item} variants={chipItem} className="chip sc-chip">
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </GlowCard>
  );
};
