/**
 * Fixed "night sky" palette for the generative project covers.
 * Covers look like a series of lofi album sleeves, so they stay dark in both
 * site themes. Values mirror the dark-theme tokens in index.css.
 */
export const C = {
  skyTop: "#04061a",
  skyMid: "#0a0b2a",
  skyLow: "#1a0f3a",
  horizon: "#3a1552",
  floorTop: "#150b33",
  floorBot: "#04040f",
  panel: "#0b0a24",
  panelHi: "#141238",
  violet: "#9b83f7",
  ice: "#74e5fb",
  neon: "#ff5cb8",
  heat: "#ff8742",
  amber: "#ffb35c",
  white: "#f4f2ff",
};

/** viewBox geometry shared by every cover */
export const W = 400;
export const H = 240;
export const HORIZON = 170;

/** Album-series order, label shown in the cover corner */
export const VARIANTS = {
  lattice: { no: "01", name: "Lattice", accent: C.violet },
  thermal: { no: "02", name: "Thermal", accent: C.heat },
  replay: { no: "03", name: "Replay", accent: C.neon },
  cad: { no: "04", name: "Exploded", accent: C.ice },
  network: { no: "05", name: "Topology", accent: C.violet },
  constellation: { no: "06", name: "Constellation", accent: C.neon },
  ledger: { no: "07", name: "Ledger", accent: C.amber },
  neural: { no: "08", name: "Neural", accent: C.ice },
};

/** Small deterministic PRNG so star fields are stable between renders. */
export const rng = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Interpolate a colour ramp: stops = [[t, "#hex"], ...] sorted by t. */
export const ramp = (stops, t) => {
  const v = Math.min(1, Math.max(0, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (v <= t1) {
      const k = (v - t0) / (t1 - t0 || 1);
      const a = hexToRgb(c0);
      const b = hexToRgb(c1);
      const m = a.map((x, j) => Math.round(x + (b[j] - x) * k));
      return `rgb(${m[0]}, ${m[1]}, ${m[2]})`;
    }
  }
  return stops[stops.length - 1][1];
};

/** Cool -> hot thermal ramp (ice, violet, neon, heat) */
export const thermalRamp = [
  [0, C.ice],
  [0.38, C.violet],
  [0.7, C.neon],
  [1, C.heat],
];

export const pts = (arr) => arr.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
