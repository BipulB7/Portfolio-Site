import { memo } from "react";
import { Backdrop } from "./Backdrop";
import { Pulse } from "./parts";
import { C, pts } from "./palette";

/* ======================================================================
   06 CONSTELLATION: optional screenshot under a night tint + star figures
   ====================================================================== */
const FIGURES_EDGE = [
  { stars: [[30, 44], [50, 32], [68, 46], [88, 34], [108, 48]], delay: 0 },
  { stars: [[318, 56], [338, 46], [356, 60], [348, 86], [326, 82], [318, 56], [356, 60], [378, 40]], delay: -3.6 },
  { stars: [[34, 150], [54, 140], [74, 146], [90, 160], [114, 154], [122, 176], [96, 182], [90, 160]], delay: -7.2 },
];
const FIGURE_CENTER = {
  stars: [[160, 70], [184, 58], [206, 76], [232, 64], [252, 88], [226, 108], [200, 100], [206, 76]],
  delay: -1.8,
};
const figurePath = (s) => `M${s.map((p) => p.join(" ")).join("L")}`;

const Figure = ({ fig }) => {
  const unique = fig.stars.filter((p, i, a) => a.findIndex((q) => q[0] === p[0] && q[1] === p[1]) === i);
  return (
    <g>
      <path
        d={figurePath(fig.stars)}
        pathLength="100"
        fill="none"
        stroke={C.ice}
        strokeOpacity="0.6"
        strokeWidth="0.6"
        strokeLinejoin="round"
        strokeDasharray="100 100"
        className="pa-draw"
        style={{ animationDelay: `${fig.delay}s` }}
      />
      {unique.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.8" fill={C.neon} opacity="0.16" />
          <circle
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 1.8 : 1.3}
            fill={C.white}
            className="pa-twinkle"
            style={{ animationDelay: `${-((i * 0.9 + fig.delay) % 3.6).toFixed(2)}s` }}
          />
        </g>
      ))}
    </g>
  );
};

export const ConstellationScene = memo(({ uid, accent, seed, image }) => (
  <>
    <defs>
      <linearGradient id={`${uid}-tint`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.skyTop} stopOpacity="0.6" />
        <stop offset="0.5" stopColor={C.skyMid} stopOpacity="0.28" />
        <stop offset="1" stopColor={C.skyLow} stopOpacity="0.85" />
      </linearGradient>
      <radialGradient id={`${uid}-bloom`} cx="0.5" cy="1" r="0.75">
        <stop offset="0" stopColor={C.neon} stopOpacity="0.32" />
        <stop offset="0.5" stopColor={C.violet} stopOpacity="0.1" />
        <stop offset="1" stopColor={C.violet} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${uid}-meteor`} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor={C.white} />
        <stop offset="1" stopColor={C.ice} stopOpacity="0" />
      </linearGradient>
    </defs>

    {image ? (
      <>
        <rect width="400" height="240" fill={C.skyTop} />
        <image href={image} x="0" y="0" width="400" height="240" preserveAspectRatio="xMidYMid slice" opacity="0.92" />
        <rect width="400" height="240" fill={`url(#${uid}-tint)`} />
        <rect width="400" height="240" fill={`url(#${uid}-bloom)`} />
      </>
    ) : (
      <Backdrop uid={uid} accent={accent} seed={seed} />
    )}

    {FIGURES_EDGE.map((f, i) => (
      <Figure key={i} fig={f} />
    ))}
    {!image && <Figure fig={FIGURE_CENTER} />}

    <g className="pa-meteor" style={{ animationDelay: "-2s" }}>
      <line x1="300" y1="30" x2="330" y2="12" stroke={`url(#${uid}-meteor)`} strokeWidth="1" strokeLinecap="round" />
    </g>
    <g className="pa-meteor" style={{ animationDelay: "-6.5s", animationDuration: "12s" }}>
      <line x1="230" y1="22" x2="252" y2="9" stroke={`url(#${uid}-meteor)`} strokeWidth="0.8" strokeLinecap="round" />
    </g>
  </>
));
ConstellationScene.displayName = "ConstellationScene";

/* ======================================================================
   07 LEDGER: chain of isometric blocks with a value pulse along the chain
   ====================================================================== */
const BW = 25;
const BH = 14.5;
const BD = 27;
const BY = 92;
const BLOCKS = [72, 136, 200, 264, 328];
const LEDGER_T = 5;
const cube = (cx) => ({
  top: pts([[cx, BY - BH], [cx + BW, BY], [cx, BY + BH], [cx - BW, BY]]),
  facet: pts([[cx, BY - BH * 0.5], [cx + BW * 0.5, BY], [cx, BY + BH * 0.5], [cx - BW * 0.5, BY]]),
  left: pts([[cx - BW, BY], [cx, BY + BH], [cx, BY + BH + BD], [cx - BW, BY + BD]]),
  right: pts([[cx + BW, BY], [cx, BY + BH], [cx, BY + BH + BD], [cx + BW, BY + BD]]),
  rows: [6, 11, 16].map((o) => {
    const y = (x) => BY + BH - ((x - cx) * BH) / BW + o;
    return `M${cx + 4} ${y(cx + 4).toFixed(2)}L${cx + BW - 5} ${y(cx + BW - 5).toFixed(2)}`;
  }),
});
const CUBES = BLOCKS.map((cx) => ({ cx, ...cube(cx) }));
const CHAIN_Y = BY + BH / 2 + BD / 2;
const CHAIN_X0 = 40;
const CHAIN_X1 = 360;
const CHAIN_D = `M${CHAIN_X0} ${CHAIN_Y} L${CHAIN_X1} ${CHAIN_Y}`;
// time at which the (linear) pulse passes each block, minus the flash rise
const flashDelay = (cx) => {
  const s = ((cx - CHAIN_X0) / (CHAIN_X1 - CHAIN_X0)) * 100;
  const t = ((s + 8) / 116) * 0.62 * LEDGER_T;
  return (t - 0.3 - LEDGER_T).toFixed(2);
};

export const LedgerScene = memo(({ uid, accent, seed }) => (
  <>
    <Backdrop uid={uid} accent={accent} seed={seed} />
    <defs>
      <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#241a57" />
        <stop offset="1" stopColor="#151040" />
      </linearGradient>
    </defs>

    <line x1={CHAIN_X0} y1={CHAIN_Y} x2={CHAIN_X1} y2={CHAIN_Y} stroke={C.amber} strokeOpacity="0.25" strokeWidth="0.6" />
    <Pulse d={CHAIN_D} color={C.amber} dur={LEDGER_T} width={1.4} linear />

    {CUBES.map((b, k) => (
      <g key={b.cx}>
        {k < CUBES.length - 1 && (
          <g fill="none" stroke={C.amber} strokeOpacity="0.75" strokeWidth="0.8">
            <ellipse cx={b.cx + 29} cy={CHAIN_Y} rx="4.6" ry="2.5" />
            <ellipse cx={b.cx + 35} cy={CHAIN_Y} rx="4.6" ry="2.5" />
          </g>
        )}
        <g stroke={C.violet} strokeOpacity="0.7" strokeWidth="0.6" strokeLinejoin="round">
          <polygon points={b.left} fill="#100c30" />
          <polygon points={b.right} fill="#0b0924" />
          <polygon points={b.top} fill={`url(#${uid}-top)`} />
        </g>
        <polygon points={b.facet} fill="none" stroke={C.amber} strokeOpacity="0.45" strokeWidth="0.55" />
        <g stroke={C.amber} strokeOpacity="0.32" strokeWidth="0.6" strokeLinecap="round">
          {b.rows.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <polygon
          points={b.top}
          fill={C.amber}
          className="pa-flash"
          opacity="0"
          style={{ "--peak": 0.55, animationDuration: `${LEDGER_T}s`, animationDelay: `${flashDelay(b.cx)}s` }}
        />
      </g>
    ))}

    {/* genesis / head markers */}
    <g fill={C.amber}>
      <circle cx={CHAIN_X0} cy={CHAIN_Y} r="2" opacity="0.8" />
      <circle cx={CHAIN_X1} cy={CHAIN_Y} r="2" className="pa-twinkle" />
    </g>
  </>
));
LedgerScene.displayName = "LedgerScene";

/* ======================================================================
   08 NEURAL: conv feature maps feeding dense nodes, activations pulsing
   ====================================================================== */
const plane = (x, yc, a, wd, k) => {
  const P = (u, v) => [x + u * wd, yc - a / 2 + k / 2 - u * k + v * a];
  return {
    P,
    poly: pts([P(0, 0), P(1, 0), P(1, 1), P(0, 1)]),
  };
};
const NEURAL_T = 4.5;
const INPUT = plane(56, 106, 70, 30, 14);
const INPUT_GRID = (() => {
  let d = "";
  for (let t = 1; t < 6; t++) {
    const u = t / 6;
    const a = INPUT.P(u, 0);
    const b = INPUT.P(u, 1);
    const c = INPUT.P(0, u);
    const e = INPUT.P(1, u);
    d += `M${a[0]} ${a[1]}L${b[0]} ${b[1]}M${c[0]} ${c[1]}L${e[0]} ${e[1]}`;
  }
  return d;
})();
const INPUT_PIXELS = [[1, 1], [2, 1], [3, 1], [4, 1], [4, 2], [3, 3], [3, 4], [2, 4], [2, 5]].map(([i, j]) =>
  pts([INPUT.P(i / 6, j / 6), INPUT.P((i + 1) / 6, j / 6), INPUT.P((i + 1) / 6, (j + 1) / 6), INPUT.P(i / 6, (j + 1) / 6)])
);
const KERNEL = pts([INPUT.P(0, 0), INPUT.P(2 / 6, 0), INPUT.P(2 / 6, 2 / 6), INPUT.P(0, 2 / 6)]);
const L2 = Array.from({ length: 4 }, (_, m) => plane(124 + m * 7, 106, 52, 22, 10));
const L2_CELL = (() => {
  const p = L2[3].P;
  return pts([p(0, 0), p(1 / 3, 0), p(1 / 3, 1 / 3), p(0, 1 / 3)]);
})();
const L3 = Array.from({ length: 6 }, (_, m) => plane(190 + m * 5, 106, 34, 14, 7));
const DENSE = Array.from({ length: 6 }, (_, n) => [270, 106 + (n - 2.5) * 13]);
const OUT = Array.from({ length: 3 }, (_, n) => [322, 106 + (n - 1) * 20]);
const frustum = (a, b) => {
  const a0 = a.P(1, 0);
  const a1 = a.P(1, 1);
  const b0 = b.P(0, 0);
  const b1 = b.P(0, 1);
  return `M${a0[0]} ${a0[1]}L${b0[0]} ${b0[1]}M${a1[0]} ${a1[1]}L${b1[0]} ${b1[1]}`;
};
const L3_OUT = [L3[5].P(1, 0.5)[0], 106];

export const NeuralScene = memo(({ uid, accent, seed }) => (
  <>
    <Backdrop uid={uid} accent={accent} seed={seed} />

    {/* receptive-field frustums */}
    <g fill="none" stroke={C.violet} strokeOpacity="0.2" strokeWidth="0.5" strokeDasharray="1.5 2">
      <path d={frustum(INPUT, L2[0])} />
      <path d={frustum(L2[3], L3[0])} />
    </g>

    {/* input image */}
    <polygon points={INPUT.poly} fill={C.panel} stroke={C.ice} strokeOpacity="0.75" strokeWidth="0.6" />
    <g fill={C.ice} fillOpacity="0.45">
      {INPUT_PIXELS.map((p) => (
        <polygon key={p} points={p} />
      ))}
    </g>
    <path d={INPUT_GRID} stroke={C.ice} strokeOpacity="0.16" strokeWidth="0.4" />
    <polygon points={INPUT.poly} fill={C.ice} className="pa-flash" opacity="0" style={{ "--peak": 0.18, animationDuration: `${NEURAL_T}s`, animationDelay: `${-NEURAL_T}s` }} />
    <polygon
      points={KERNEL}
      fill={C.heat}
      fillOpacity="0.16"
      stroke={C.heat}
      strokeWidth="0.9"
      className="pa-kernel"
      style={{ "--sx": "10px", "--sy1": "-4.67px", "--sy2": "-9.33px", "--dy": "23.33px", animationDuration: `${NEURAL_T}s` }}
    />

    {/* conv block 1 */}
    {L2.map((p, m) => (
      <polygon key={m} points={p.poly} fill={C.panel} fillOpacity="0.92" stroke={C.violet} strokeOpacity={0.4 + m * 0.12} strokeWidth="0.6" />
    ))}
    <polygon points={L2[3].poly} fill={C.violet} className="pa-flash" opacity="0" style={{ "--peak": 0.22, animationDuration: `${NEURAL_T}s`, animationDelay: `${(0.18 * NEURAL_T - NEURAL_T).toFixed(2)}s` }} />
    <polygon
      points={L2_CELL}
      fill={C.heat}
      fillOpacity="0.45"
      className="pa-kernel"
      style={{ "--sx": "7.33px", "--sy1": "-3.33px", "--sy2": "-6.67px", "--dy": "17.33px", animationDuration: `${NEURAL_T}s` }}
    />

    {/* conv block 2 */}
    {L3.map((p, m) => (
      <polygon key={m} points={p.poly} fill={C.panel} fillOpacity="0.92" stroke={C.neon} strokeOpacity={0.35 + m * 0.09} strokeWidth="0.55" />
    ))}
    <polygon points={L3[5].poly} fill={C.neon} className="pa-flash" opacity="0" style={{ "--peak": 0.3, animationDuration: `${NEURAL_T}s`, animationDelay: `${(0.36 * NEURAL_T - NEURAL_T).toFixed(2)}s` }} />

    {/* dense + output connections */}
    <g stroke={C.violet} strokeOpacity="0.24" strokeWidth="0.45">
      {DENSE.map(([x, y]) => (
        <line key={`a${y}`} x1={L3_OUT[0]} y1={L3_OUT[1]} x2={x} y2={y} />
      ))}
      {DENSE.flatMap(([x, y]) => OUT.map(([ox, oy]) => <line key={`b${y}-${oy}`} x1={x} y1={y} x2={ox} y2={oy} strokeOpacity="0.55" />))}
    </g>
    {DENSE.filter((_, n) => n % 2 === 0).map(([x, y], n) => (
      <Pulse
        key={y}
        d={`M${L3_OUT[0]} ${L3_OUT[1]} L${x} ${y} L${OUT[1][0]} ${OUT[1][1]}`}
        color={n === 1 ? C.neon : C.ice}
        dur={NEURAL_T}
        delay={(0.42 * NEURAL_T - NEURAL_T + n * 0.12).toFixed(2)}
        width={1}
      />
    ))}

    {DENSE.map(([x, y], n) => (
      <g key={y}>
        <circle cx={x} cy={y} r="3.3" fill={C.panel} stroke={C.ice} strokeOpacity="0.75" strokeWidth="0.6" />
        <circle
          cx={x}
          cy={y}
          r="2"
          fill={C.ice}
          className="pa-flash"
          opacity="0"
          style={{ "--peak": 0.95, animationDuration: `${NEURAL_T}s`, animationDelay: `${(0.6 * NEURAL_T - NEURAL_T + n * 0.05).toFixed(2)}s` }}
        />
      </g>
    ))}
    {OUT.map(([x, y], n) => (
      <g key={y}>
        <circle cx={x} cy={y} r="4.2" fill={C.panel} stroke={n === 1 ? C.neon : C.violet} strokeOpacity="0.85" strokeWidth="0.7" />
        {n === 1 && (
          <>
            <circle cx={x} cy={y} r="8" fill="none" stroke={C.neon} strokeOpacity="0.35" strokeWidth="0.5" />
            <circle
              cx={x}
              cy={y}
              r="2.6"
              fill={C.neon}
              className="pa-flash"
              opacity="0"
              style={{ "--peak": 1, animationDuration: `${NEURAL_T}s`, animationDelay: `${(0.78 * NEURAL_T - NEURAL_T).toFixed(2)}s` }}
            />
          </>
        )}
      </g>
    ))}
  </>
));
NeuralScene.displayName = "NeuralScene";
