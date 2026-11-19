import { cn } from "../../lib/utils";

/**
 * Decorative synthwave horizon: a setting retro sun with a neon perspective
 * grid floor in front of it. Purely visual.
 *
 * Two layouts:
 *  - default: absolutely positioned at the bottom of its (relative,
 *    overflow-hidden) parent; `horizon` is the floor height in px.
 *  - fill: the component fills its parent (absolute inset-0) and the whole
 *    parent becomes the floor; the sun rises above the parent's top edge.
 *
 * sunSize      diameter of the sun in px
 * rise         how much of the sun shows above the horizon (0-1)
 * animated     scroll the grid toward the viewer
 */
export const RetroHorizon = ({
  className,
  fill = false,
  sunSize = 360,
  horizon = 110,
  rise = 0.62,
  sunOpacity = 0.2,
  gridOpacity = 0.35,
  gridSize = 44,
  perspective,
  animated = false,
}) => {
  const visibleSun = Math.round(sunSize * rise);
  const floor = fill ? "100%" : `${horizon}px`;
  const depth = perspective ?? (fill ? 220 : Math.round(horizon * 1.6));

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute",
        fill ? "inset-0" : "inset-x-0 bottom-0 overflow-hidden",
        className
      )}
      style={fill ? undefined : { height: horizon + visibleSun + 60 }}
    >
      {/* Sun, clipped at the horizon (wrapper is wider so the glow survives) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
        style={{ bottom: floor, width: sunSize + 160, height: visibleSun + 60, opacity: sunOpacity }}
      >
        <div
          className="retro-sun absolute left-1/2 -translate-x-1/2"
          style={{ top: 60, width: sunSize, height: sunSize }}
        />
      </div>

      {/* Haze sitting on the horizon */}
      <div
        className="absolute left-1/2 h-24 w-[70%] max-w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,hsl(var(--neon)/0.22),transparent_70%)] blur-xl"
        style={{ bottom: `calc(${floor} - 48px)`, opacity: Math.min(1, sunOpacity * 3) }}
      />

      {/* Perspective grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{
          height: floor,
          perspective: `${depth}px`,
          perspectiveOrigin: "50% 0%",
          opacity: gridOpacity,
        }}
      >
        <div
          className={cn(
            "retro-grid absolute bottom-0 left-[-60%] w-[220%] origin-bottom",
            animated && "animate-grid-scroll"
          )}
          style={{
            height: fill ? "240%" : horizon * 2.4,
            transform: "rotateX(68deg)",
            "--grid-size": `${gridSize}px`,
          }}
        />
      </div>

      {/* Horizon line */}
      <div
        className="absolute inset-x-0 h-px bg-sunset mask-fade-x"
        style={{ bottom: floor, opacity: Math.min(1, gridOpacity * 1.6) }}
      />
    </div>
  );
};
