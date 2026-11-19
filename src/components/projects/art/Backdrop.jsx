import { C, HORIZON, rng } from "./palette";

/* Perspective grid floor. Horizontal lines follow a geometric series, so
   scaling the group by the series ratio around the vanishing point loops
   seamlessly (a classic "drive into the horizon"). */
const RATIO = 1.45;
const FLOOR_ROWS = Array.from({ length: 13 }, (_, i) => 1.1 * RATIO ** i);
const FLOOR_RAYS = Array.from({ length: 29 }, (_, i) => i - 14);

const makeStars = (seed, count = 38) => {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => {
    const y = Math.pow(r(), 1.35) * (HORIZON - 26);
    return {
      x: r() * 400,
      y: 4 + y,
      r: 0.35 + r() * 0.8,
      o: 0.3 + r() * 0.6,
      tw: i % 4 === 0,
      d: -(r() * 4).toFixed(2),
    };
  });
};

const STAR_CACHE = new Map();
const starsFor = (seed) => {
  if (!STAR_CACHE.has(seed)) STAR_CACHE.set(seed, makeStars(seed));
  return STAR_CACHE.get(seed);
};

/** Low distant ridges hugging the horizon at both edges (lofi-night depth). */
const RIDGE_L =
  "M0 170 L0 156 C 14 152, 22 147, 34 149 C 46 151, 52 141, 66 143 C 80 145, 86 154, 100 156 C 112 158, 122 163, 136 170 Z";
const RIDGE_R =
  "M400 170 L400 152 C 388 149, 378 144, 366 146 C 352 148, 346 140, 332 143 C 318 146, 312 155, 296 158 C 284 160, 274 165, 262 170 Z";

/**
 * Sky gradient, stars, horizon glow, ridges and the neon grid floor.
 * Rendered first inside each cover's <svg>.
 */
export const Backdrop = ({ uid, accent, seed = 1, sky = true, floor = true, ridges = true }) => {
  const stars = starsFor(seed);
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.skyTop} />
          <stop offset="0.55" stopColor={C.skyMid} />
          <stop offset="0.86" stopColor={C.skyLow} />
          <stop offset="1" stopColor={C.horizon} />
        </linearGradient>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.floorTop} />
          <stop offset="1" stopColor={C.floorBot} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="0.35" stopColor={accent} stopOpacity="0.18" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-hline`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={accent} stopOpacity="0" />
          <stop offset="0.5" stopColor={C.white} stopOpacity="0.85" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-fade`} gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON} x2="0" y2={HORIZON + 48}>
          <stop offset="0" stopColor={C.floorTop} />
          <stop offset="0.5" stopColor={C.floorTop} stopOpacity="0.55" />
          <stop offset="1" stopColor="#0b0720" stopOpacity="0" />
        </linearGradient>
      </defs>

      {sky && <rect width="400" height={HORIZON} fill={`url(#${uid}-sky)`} />}
      {floor && <rect y={HORIZON} width="400" height={240 - HORIZON} fill={`url(#${uid}-floor)`} />}

      {/* stars */}
      <g fill={C.white}>
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x.toFixed(1)}
            cy={s.y.toFixed(1)}
            r={s.r.toFixed(2)}
            opacity={s.tw ? undefined : s.o.toFixed(2)}
            className={s.tw ? "pa-twinkle" : undefined}
            style={s.tw ? { animationDelay: `${s.d}s` } : undefined}
          />
        ))}
      </g>

      {floor && (
        <g>
          <g stroke={C.violet} strokeOpacity="0.45" strokeWidth="0.5">
            {FLOOR_RAYS.map((k) => (
              <line key={k} x1={200 + k * 3} y1={HORIZON} x2={200 + k * 40} y2="240" />
            ))}
          </g>
          <g className="pa-floor" stroke={C.neon} strokeOpacity="0.55" strokeWidth="0.45">
            {FLOOR_ROWS.map((d, i) => (
              <line key={i} x1="-320" y1={HORIZON + d} x2="720" y2={HORIZON + d} />
            ))}
          </g>
          <rect x="0" y={HORIZON} width="400" height="48" fill={`url(#${uid}-fade)`} />
        </g>
      )}

      {/* horizon glow */}
      <ellipse cx="200" cy={HORIZON} rx="250" ry="64" fill={`url(#${uid}-glow)`} />
      <ellipse className="pa-boost" cx="200" cy={HORIZON} rx="150" ry="30" fill={`url(#${uid}-glow)`} />

      {ridges && (
        <g fill="#0a0820">
          <path d={RIDGE_L} />
          <path d={RIDGE_R} />
          <path d={RIDGE_L} fill="none" stroke={accent} strokeOpacity="0.28" strokeWidth="0.5" />
          <path d={RIDGE_R} fill="none" stroke={accent} strokeOpacity="0.28" strokeWidth="0.5" />
        </g>
      )}

      {/* the horizon line itself */}
      <rect x="0" y={HORIZON - 0.4} width="400" height="0.8" fill={`url(#${uid}-hline)`} />
    </g>
  );
};
