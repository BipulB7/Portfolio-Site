import { useState } from "react";
import { motion } from "motion/react";

/* A sparse, static sky for the intro curtain (CSS dots, twinkling). */
const makeStars = (count) =>
  Array.from({ length: count }, (_, i) => {
    const near = Math.random() < 0.14;
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: near ? 1.6 + Math.random() * 0.8 : 0.8 + Math.random() * 0.8,
      opacity: near ? 0.55 + Math.random() * 0.35 : 0.18 + Math.random() * 0.35,
      delay: -Math.random() * 4,
      duration: 2.6 + Math.random() * 3,
    };
  });

/** Full-viewport backdrop drawn inside each curtain half. */
export const IntroBackdrop = () => {
  const [stars] = useState(() => makeStars(64));
  return (
    <div className="absolute inset-0 bg-background">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 50%, hsl(var(--primary) / 0.12), transparent 70%), radial-gradient(90% 60% at 50% 120%, hsl(var(--neon) / 0.07), transparent 60%)",
        }}
      />
      <div className="bg-lattice absolute inset-0 opacity-70" />
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-foreground animate-pulse-subtle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

/* Tiny cassette with turning reels, for the "Side A" label. */
export const CassetteGlyph = ({ className = "" }) => (
  <svg viewBox="0 0 30 20" fill="none" className={className} aria-hidden="true">
    <rect x="0.75" y="0.75" width="28.5" height="18.5" rx="2.5" stroke="currentColor" strokeOpacity="0.7" />
    <rect x="6" y="5" width="18" height="7" rx="3.5" stroke="currentColor" strokeOpacity="0.45" />
    <path d="M8 19.25L10 15H20L22 19.25" stroke="currentColor" strokeOpacity="0.45" />
    {[10.5, 19.5].map((cx) => (
      <motion.g
        key={cx}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={cx} cy="8.5" r="2.1" stroke="hsl(var(--neon))" strokeWidth="1" />
        <path
          d={`M${cx} 6.6V7.6M${cx + 1.65} 9.45L${cx + 0.8} 8.95M${cx - 1.65} 9.45L${cx - 0.8} 8.95`}
          stroke="hsl(var(--neon))"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </motion.g>
    ))}
  </svg>
);
