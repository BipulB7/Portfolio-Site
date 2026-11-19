import { useRef } from "react";
import { cn } from "../../lib/utils";

/**
 * Glass card with a cursor-following "heat spot": a warm core that cools to
 * violet and ice as it spreads, echoing heat spreading through diamond.
 * Also lights a gradient hairline border near the cursor.
 *
 * Pure CSS variables (no re-renders on mouse move).
 */
export const GlowCard = ({ as: Component = "div", className, children, ...rest }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Component
      ref={ref}
      onPointerMove={onMove}
      className={cn(
        "group/glow relative isolate overflow-hidden rounded-2xl glass",
        "transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)]",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_30px_60px_-30px_hsl(var(--primary)/0.55)]",
        className
      )}
      {...rest}
    >
      {/* heat spot */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--heat) / 0.16), hsl(var(--neon) / 0.10) 25%, hsl(var(--primary) / 0.08) 45%, hsl(var(--ice) / 0.04) 60%, transparent 72%)",
        }}
      />
      {/* lit border near the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          padding: 1,
          background:
            "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--neon) / 0.7), hsl(var(--primary) / 0.4) 40%, transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </Component>
  );
};
