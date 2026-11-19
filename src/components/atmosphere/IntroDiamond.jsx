import { useId } from "react";
import { motion } from "motion/react";
import { ease } from "../../lib/motion";

/**
 * Brilliant-cut diamond for the intro. Strokes itself in, the facets flash
 * one after another, a light sweep crosses the stone and a small glint pops
 * on the table corner. Generic geometry, not anyone's logo.
 *
 * viewBox 160 x 140: table y=20, girdle y=50, culet y=132.
 */

const OUTLINE = "M50 20H110L150 50L80 132L10 50Z";
const GIRDLE = "M10 50H150";
const CROWN = ["M50 20L42 50", "M80 20L42 50", "M80 20L118 50", "M110 20L118 50"];
const PAVILION = ["M42 50L80 132", "M118 50L80 132", "M26 50L66 104", "M134 50L94 104"];

// Facet polygons for the shimmer, ordered roughly left to right.
const FACETS = [
  { points: "10,50 50,20 42,50", tone: "--heat" },
  { points: "50,20 80,20 42,50", tone: "--neon" },
  { points: "80,20 42,50 118,50", tone: "--primary" },
  { points: "80,20 110,20 118,50", tone: "--ice" },
  { points: "110,20 150,50 118,50", tone: "--ice" },
  { points: "10,50 42,50 80,132", tone: "--neon" },
  { points: "42,50 118,50 80,132", tone: "--primary" },
  { points: "118,50 150,50 80,132", tone: "--ice" },
];

const DRAW_START = 0.05;

export const IntroDiamond = ({ className = "" }) => {
  const id = useId().replace(/:/g, "");
  const strokeId = `intro-stroke-${id}`;
  const clipId = `intro-clip-${id}`;
  const sweepId = `intro-sweep-${id}`;

  const draw = (delay, duration = 0.7) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: {
      pathLength: { duration, delay, ease: ease.inOutQuint },
      opacity: { duration: 0.15, delay },
    },
  });

  return (
    <svg
      viewBox="0 0 160 140"
      fill="none"
      className={className}
      style={{
        overflow: "visible",
        filter:
          "drop-shadow(0 0 5px hsl(var(--neon) / 0.45)) drop-shadow(0 0 18px hsl(var(--primary) / 0.35))",
      }}
    >
      <defs>
        <linearGradient id={strokeId} x1="0" y1="0" x2="160" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="hsl(var(--heat))" />
          <stop offset="0.38" stopColor="hsl(var(--neon))" />
          <stop offset="0.68" stopColor="hsl(var(--primary))" />
          <stop offset="1" stopColor="hsl(var(--ice))" />
        </linearGradient>
        <linearGradient id={sweepId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="hsl(var(--foreground))" stopOpacity="0" />
          <stop offset="0.5" stopColor="hsl(var(--foreground))" stopOpacity="0.55" />
          <stop offset="1" stopColor="hsl(var(--foreground))" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={OUTLINE} />
        </clipPath>
      </defs>

      {/* Facet shimmer: each facet flashes, then settles to a faint body tint */}
      <g>
        {FACETS.map((f, i) => (
          <motion.polygon
            key={f.points}
            points={f.points}
            fill={`hsl(var(${f.tone}))`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.32, 0.07] }}
            transition={{ duration: 0.75, delay: 0.62 + i * 0.045, ease: "easeOut", times: [0, 0.35, 1] }}
          />
        ))}
      </g>

      {/* Light sweep across the stone */}
      <g clipPath={`url(#${clipId})`}>
        <g transform="skewX(-18)">
          {/* motion treats x on SVG as a transform, so the skew lives on the parent */}
          <motion.rect
            y="0"
            width="46"
            height="140"
            fill={`url(#${sweepId})`}
            initial={{ x: -40 }}
            animate={{ x: 230 }}
            transition={{ duration: 0.8, delay: 0.82, ease: ease.inOutQuint }}
          />
        </g>
      </g>

      <g
        stroke={`url(#${strokeId})`}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <motion.path d={OUTLINE} {...draw(DRAW_START, 0.85)} />
        <motion.path d={GIRDLE} {...draw(DRAW_START + 0.22, 0.55)} />
        {CROWN.map((d, i) => (
          <motion.path key={d} d={d} {...draw(DRAW_START + 0.3 + i * 0.05, 0.45)} />
        ))}
        {PAVILION.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            strokeOpacity={i > 1 ? 0.55 : 1}
            {...draw(DRAW_START + 0.38 + i * 0.05, 0.5)}
          />
        ))}
      </g>

      {/* Glint on the table corner */}
      <motion.g
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 45, 90] }}
        transition={{ duration: 0.7, delay: 0.92, ease: "easeInOut" }}
      >
        <path
          d="M110 8L111.6 18.4L122 20L111.6 21.6L110 32L108.4 21.6L98 20L108.4 18.4Z"
          fill="hsl(var(--foreground))"
        />
      </motion.g>
    </svg>
  );
};
