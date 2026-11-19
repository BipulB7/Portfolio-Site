import { useEffect, useRef } from "react";
import { createStarfield } from "./atmosphere/starfield";

/**
 * Site-wide atmosphere: drifting aurora, a canvas starfield with parallax,
 * shooting stars and a cursor lattice, an edge vignette, and a barely-there
 * film-grain + CRT scanline texture on top of everything.
 *
 * Self-contained (no props) so any page can drop it in.
 */

const AURORA = [
  {
    // violet, top left
    className: "-left-[16%] -top-[22%] h-[72vmax] w-[72vmax] opacity-[0.13] dark:opacity-[0.24]",
    color: "var(--primary)",
    delay: "0s",
    duration: "26s",
  },
  {
    // diamond ice, right
    className: "-right-[24%] top-[18%] h-[62vmax] w-[62vmax] opacity-[0.1] dark:opacity-[0.17]",
    color: "var(--ice)",
    delay: "-11s",
    duration: "34s",
  },
  {
    // faint neon / heat ember, bottom left (the "warm" end of the thermal story)
    className: "-bottom-[32%] left-[2%] h-[58vmax] w-[58vmax] opacity-[0.07] dark:opacity-[0.13]",
    color: "var(--neon)",
    color2: "var(--heat)",
    delay: "-19s",
    duration: "41s",
  },
];

const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden">
    {AURORA.map((blob, i) => (
      <div
        key={i}
        className={`absolute rounded-full animate-aurora ${blob.className}`}
        style={{
          background: blob.color2
            ? `radial-gradient(closest-side, hsl(${blob.color} / 0.9), hsl(${blob.color2} / 0.35) 55%, transparent)`
            : `radial-gradient(closest-side, hsl(${blob.color} / 0.95), hsl(${blob.color} / 0.4) 50%, transparent)`,
          animationDelay: blob.delay,
          animationDuration: blob.duration,
        }}
      />
    ))}
  </div>
);

const Starfield = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    return createStarfield(ref.current);
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[1600ms] ease-out"
    />
  );
};

export const StarBackground = () => {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Aurora />
        <Starfield />
        {/* Edge vignette keeps the eye in the middle and the corners deep */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 95% at 50% 42%, transparent 52%, hsl(var(--background) / 0.55) 82%, hsl(var(--background) / 0.9) 100%)",
          }}
        />
      </div>

      {/* Retro texture: film grain + CRT scanlines. Barely there on purpose. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
        <div className="noise absolute inset-0 opacity-[0.025] mix-blend-overlay dark:opacity-[0.04] dark:mix-blend-soft-light" />
        <div className="scanlines absolute inset-0 opacity-[0.07] dark:opacity-[0.22]" />
      </div>
    </>
  );
};
