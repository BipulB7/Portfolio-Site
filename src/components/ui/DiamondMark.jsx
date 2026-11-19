import { useId } from "react";

/**
 * Generic faceted-diamond glyph (brilliant cut, side view). Used as the site
 * monogram mark and as a neutral stand-in where a company logo isn't available.
 * Not anyone's brand mark.
 *
 * <DiamondMark className="h-6 w-6" />
 * <DiamondMark className="h-10 w-10" glow />
 */
export const DiamondMark = ({ className = "h-6 w-6", glow = false, strokeWidth = 1.4, title }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      fill="none"
      style={glow ? { filter: "drop-shadow(0 0 6px hsl(var(--neon) / 0.6))" } : undefined}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`dm-${id}`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="hsl(var(--heat))" />
          <stop offset="0.4" stopColor="hsl(var(--neon))" />
          <stop offset="0.7" stopColor="hsl(var(--primary))" />
          <stop offset="1" stopColor="hsl(var(--ice))" />
        </linearGradient>
      </defs>
      <g stroke={`url(#dm-${id})`} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
        {/* outline: table, crown, girdle, pavilion to culet */}
        <path d="M14 8h20l10 11L24 42 4 19 14 8Z" />
        {/* girdle line */}
        <path d="M4 19h40" />
        {/* crown facets */}
        <path d="M14 8l4 11M34 8l-4 11M24 8l-6 11M24 8l6 11" />
        {/* pavilion facets */}
        <path d="M18 19l6 23M30 19l-6 23" />
      </g>
    </svg>
  );
};
