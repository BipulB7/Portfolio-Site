import { memo } from "react";
import { Backdrop } from "./Backdrop";
import { Gem, Pulse, Rack } from "./parts";
import { C, pts, ramp, thermalRamp } from "./palette";

const MONO = "var(--font-mono), ui-monospace, monospace";

/* ======================================================================
   01 LATTICE: crystal lattice with data pulses, flanked by server racks
   ====================================================================== */
const LP = (i, j) => [200 + 19 * (i - j), 58 + 12.5 * (i + j)];
const LATTICE_EDGES = (() => {
  let d = "";
  for (let i = 0; i <= 4; i++)
    for (let j = 0; j <= 4; j++) {
      const [x, y] = LP(i, j);
      if (i < 4) {
        const [x2, y2] = LP(i + 1, j);
        d += `M${x} ${y}L${x2} ${y2}`;
      }
      if (j < 4) {
        const [x2, y2] = LP(i, j + 1);
        d += `M${x} ${y}L${x2} ${y2}`;
      }
    }
  return d;
})();
const LATTICE_VERT = (() => {
  let d = "";
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      const [x, y] = LP(i, j);
      d += `M${x} ${y}L${x} ${y + 25}`;
    }
  return d;
})();
const LATTICE_NODES = Array.from({ length: 25 }, (_, k) => LP(Math.floor(k / 5), k % 5));
const CABLE_L = "M74 134 C 96 134, 104 108, 124 108";
const CABLE_R = "M326 134 C 304 134, 296 108, 276 108";
const line = (a, b) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;

export const LatticeScene = memo(({ uid, accent, seed }) => (
  <>
    <Backdrop uid={uid} accent={accent} seed={seed} />
    <defs>
      <linearGradient id={`${uid}-gem`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.heat} />
        <stop offset="0.35" stopColor={C.neon} />
        <stop offset="0.65" stopColor={C.violet} />
        <stop offset="1" stopColor={C.ice} />
      </linearGradient>
      <radialGradient id={`${uid}-core`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={C.violet} stopOpacity="0.35" />
        <stop offset="1" stopColor={C.violet} stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* racks */}
    <Rack x={30} y={110} w={20} h={58} seed={1} />
    <Rack x={54} y={124} w={20} h={44} seed={3} />
    <Rack x={326} y={124} w={20} h={44} seed={2} />
    <Rack x={350} y={110} w={20} h={58} seed={4} />
    <g fill="none" stroke={C.violet} strokeOpacity="0.35" strokeWidth="0.6">
      <path d={CABLE_L} />
      <path d={CABLE_R} />
    </g>

    {/* lattice */}
    <ellipse cx="200" cy="108" rx="90" ry="60" fill={`url(#${uid}-core)`} />
    <path d={LATTICE_VERT} stroke={C.ice} strokeOpacity="0.12" strokeWidth="0.5" />
    <path d={LATTICE_EDGES} stroke={C.violet} strokeOpacity="0.38" strokeWidth="0.6" />
    <polygon
      points={pts([LP(0, 0), LP(4, 0), LP(4, 4), LP(0, 4)])}
      fill="none"
      stroke={`url(#${uid}-gem)`}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <polygon
      points={pts([[200, 44], [292, 108], [200, 172], [108, 108]])}
      fill="none"
      stroke={C.ice}
      strokeOpacity="0.14"
      strokeWidth="0.5"
      strokeDasharray="1.5 3"
    />

    {/* data flow */}
    <Pulse d={line(LP(0, 1), LP(4, 1))} color={C.ice} delay={-0.4} dur={3.4} />
    <Pulse d={line(LP(0, 3), LP(4, 3))} color={C.ice} delay={-2.1} dur={3.8} />
    <Pulse d={line(LP(1, 0), LP(1, 4))} color={C.neon} delay={-1.2} dur={3.6} />
    <Pulse d={line(LP(3, 0), LP(3, 4))} color={C.neon} delay={-2.8} dur={3.3} reverse />
    <Pulse d="M200 58 L200 158" color={C.heat} delay={-0.9} dur={4.2} />
    <Pulse d={CABLE_L} color={C.ice} delay={-1.6} dur={2.8} />
    <Pulse d={CABLE_R} color={C.neon} delay={-0.2} dur={3} />

    <g fill={C.ice}>
      {LATTICE_NODES.map(([x, y], k) => {
        const corner = k === 0 || k === 4 || k === 20 || k === 24;
        return (
          <circle
            key={k}
            cx={x}
            cy={y}
            r={corner ? 2 : 1.25}
            opacity={k % 3 === 0 ? undefined : 0.75}
            className={k % 3 === 0 ? "pa-twinkle" : undefined}
            style={k % 3 === 0 ? { animationDelay: `${-(k * 0.37).toFixed(2)}s` } : undefined}
          />
        );
      })}
    </g>
    <circle cx="200" cy="108" r="7" fill={C.white} opacity="0.08" />
    <circle cx="200" cy="108" r="2.6" fill={C.white} />
  </>
));
LatticeScene.displayName = "LatticeScene";

/* ======================================================================
   02 THERMAL: 4x2 die heat map cooling from hot to cool, BEFORE / AFTER
   ====================================================================== */
const DIES = Array.from({ length: 8 }, (_, k) => {
  const c = k % 4;
  const r = Math.floor(k / 4);
  return { c, r, x: 80 + c * 62, y: 58 + r * 50, delay: -((3 - c) * 0.42 + r * 0.25) };
});

export const ThermalScene = memo(({ uid, accent, seed }) => (
  <>
    <Backdrop uid={uid} accent={accent} seed={seed} />
    <defs>
      <linearGradient id={`${uid}-legend`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.heat} />
        <stop offset="0.35" stopColor={C.neon} />
        <stop offset="0.7" stopColor={C.violet} />
        <stop offset="1" stopColor={C.ice} />
      </linearGradient>
    </defs>

    <g transform="translate(0 6)">
    {/* substrate + faint traces */}
    <g stroke={C.violet} strokeOpacity="0.28" strokeWidth="0.5" fill="none">
      <path d="M70 84 H44 V70 H30" />
      <path d="M70 132 H50 V146 H34" />
      <path d="M330 84 H356 V70 H370" />
      <path d="M330 132 H350 V146 H366" />
    </g>
    <g fill={C.violet} opacity="0.5">
      <circle cx="30" cy="70" r="1.2" />
      <circle cx="34" cy="146" r="1.2" />
      <circle cx="370" cy="70" r="1.2" />
      <circle cx="366" cy="146" r="1.2" />
    </g>
    <rect x="70" y="48" width="260" height="112" rx="6" fill={C.panel} fillOpacity="0.88" stroke={C.violet} strokeOpacity="0.4" strokeWidth="0.6" />
    <rect x="73.5" y="51.5" width="253" height="105" rx="4" fill="none" stroke={C.white} strokeOpacity="0.05" strokeWidth="0.5" />

    {DIES.map(({ x, y, delay }, k) => {
      const cx = x + 27;
      const cy = y + 21;
      const style = { animationDelay: `${delay.toFixed(2)}s` };
      return (
        <g key={k}>
          <rect x={x} y={y} width="54" height="42" rx="3" className="pa-cool" fill={C.heat} fillOpacity="0.2" style={style} />
          <rect x={x} y={y} width="54" height="42" rx="3" fill="none" stroke={C.white} strokeOpacity="0.1" strokeWidth="0.5" />
          <circle cx={cx} cy={cy} r="18" className="pa-blob pa-fill-box" fill={C.amber} opacity="0.2" style={style} />
          <circle cx={cx} cy={cy} r="11" className="pa-blob pa-fill-box" fill={C.amber} opacity="0.38" style={style} />
          <circle cx={cx} cy={cy} r="5" className="pa-blob pa-fill-box" fill={C.amber} opacity="0.9" style={style} />
          <polygon
            points={pts([[cx, cy - 8], [cx + 6.5, cy], [cx, cy + 8], [cx - 6.5, cy]])}
            className="pa-gem"
            fill={C.ice}
            fillOpacity="0.12"
            stroke={C.white}
            strokeOpacity="0.85"
            strokeWidth="0.6"
            opacity="0"
            style={style}
          />
        </g>
      );
    })}

    {/* labels, right-aligned beside the legend */}
    <g fontFamily={MONO} fontSize="6.5" letterSpacing="1.5" textAnchor="end">
      <g className="pa-label-before" style={{ animationDelay: "-0.63s" }}>
        <text x="258" y="41" fill={C.white} fillOpacity="0.8">BEFORE</text>
        <circle cx="262.5" cy="38.8" r="1.5" fill={C.heat} />
      </g>
      <g className="pa-label-after" opacity="0" style={{ animationDelay: "-0.63s" }}>
        <text x="258" y="41" fill={C.white} fillOpacity="0.8">AFTER</text>
        <circle cx="262.5" cy="38.8" r="1.5" fill={C.ice} />
      </g>
    </g>
    <rect x="270" y="37.6" width="52" height="2.4" rx="1.2" fill={`url(#${uid}-legend)`} opacity="0.9" />
    <polygon points="270,42 267.6,45.6 272.4,45.6" fill={C.white} className="pa-legend" style={{ animationDelay: "-0.63s" }} />
    </g>
  </>
));
ThermalScene.displayName = "ThermalScene";

/* ======================================================================
   03 REPLAY: heat-map frame with a sweeping playhead and a scrubber
   ====================================================================== */
const gauss = (x, y, cx, cy, sx, sy) => Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));
const REPLAY_CELLS = (() => {
  const out = [];
  for (let c = 0; c < 16; c++)
    for (let r = 0; r < 6; r++) {
      const v = Math.max(gauss(c, r, 4.4, 2.2, 3.2, 1.9), 0.88 * gauss(c, r, 11.2, 3.3, 3.4, 2.1)) +
        0.07 * Math.sin(c * 1.7 + r * 2.3);
      out.push({ c, r, x: 89 + c * 14, y: 56 + r * 11, v: Math.min(1, Math.max(0, v)) });
    }
  return out;
})();
const REPLAY_T = 6;

export const ReplayScene = memo(({ uid, accent, seed }) => (
  <>
    <Backdrop uid={uid} accent={accent} seed={seed} />
    <defs>
      <linearGradient id={`${uid}-band`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.neon} stopOpacity="0" />
        <stop offset="0.5" stopColor={C.neon} stopOpacity="0.35" />
        <stop offset="1" stopColor={C.neon} stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${uid}-prog`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.heat} />
        <stop offset="0.4" stopColor={C.neon} />
        <stop offset="0.75" stopColor={C.violet} />
        <stop offset="1" stopColor={C.ice} />
      </linearGradient>
    </defs>

    <g transform="translate(0 8)">
    <rect x="83" y="50" width="234" height="76" rx="4" fill={C.panel} fillOpacity="0.75" stroke={C.violet} strokeOpacity="0.32" strokeWidth="0.6" />
    {REPLAY_CELLS.map(({ c, x, y, v }, k) => (
      <rect
        key={k}
        x={x}
        y={y}
        width="12"
        height="9"
        rx="1.2"
        fill={ramp(thermalRamp, v)}
        className="pa-scan"
        opacity={(0.22 + 0.6 * v).toFixed(2)}
        style={{
          "--o": (0.22 + 0.6 * v).toFixed(2),
          animationDelay: `${((c / 16) * REPLAY_T - REPLAY_T).toFixed(2)}s`,
        }}
      />
    ))}

    {/* playhead */}
    <g className="pa-sweep">
      <rect x="82" y="50" width="14" height="76" fill={`url(#${uid}-band)`} />
      <line x1="89" y1="47" x2="89" y2="130" stroke={C.white} strokeWidth="0.7" />
      <polygon points="86,44.5 92,44.5 89,48.5" fill={C.neon} />
    </g>

    {/* VCR-style on-screen label */}
    <g fontFamily={MONO} fontSize="6.5" letterSpacing="1.4" fill={C.white}>
      <text x="83" y="41" fillOpacity="0.75">PLAY</text>
      <polygon points="105,36.4 105,41.4 109.4,38.9" fill={C.white} fillOpacity="0.75" />
      <circle cx="313" cy="38.8" r="1.6" fill={C.neon} className="pa-blink" />
      <text x="308" y="41" textAnchor="end" fillOpacity="0.55">x1.0</text>
    </g>

    {/* scrubber */}
    <g>
      <rect x="69.5" y="142" width="1.8" height="8" rx="0.5" fill={C.white} fillOpacity="0.85" />
      <rect x="73.6" y="142" width="1.8" height="8" rx="0.5" fill={C.white} fillOpacity="0.85" />
      <line x1="89" y1="146" x2="311" y2="146" stroke={C.white} strokeOpacity="0.18" strokeWidth="1" strokeLinecap="round" />
      <rect x="89" y="145.4" width="222" height="1.2" rx="0.6" fill={`url(#${uid}-prog)`} className="pa-progress" />
      <g stroke={C.white} strokeOpacity="0.28" strokeWidth="0.5">
        {Array.from({ length: 17 }, (_, t) => (
          <line key={t} x1={89 + t * 13.875} y1="150.5" x2={89 + t * 13.875} y2={t % 4 === 0 ? 155 : 152.5} />
        ))}
      </g>
      <g className="pa-sweep">
        <circle cx="89" cy="146" r="5" fill={C.neon} opacity="0.25" />
        <circle cx="89" cy="146" r="2.4" fill={C.white} />
      </g>
    </g>
    </g>
  </>
));
ReplayScene.displayName = "ReplayScene";

/* ======================================================================
   04 CAD: blueprint isometric exploded view of a segmented tile assembly
   ====================================================================== */
const KX = 17.3;
const KY = 10;
const KZ = 20;
const iso = (x, y, z) => [200 + (x - y) * KX, 106 + (x + y) * KY - z * KZ];
const box = (x0, x1, y0, y1, z0, z1) => ({
  top: pts([iso(x0, y0, z1), iso(x1, y0, z1), iso(x1, y1, z1), iso(x0, y1, z1)]),
  left: pts([iso(x0, y1, z1), iso(x1, y1, z1), iso(x1, y1, z0), iso(x0, y1, z0)]),
  right: pts([iso(x1, y0, z1), iso(x1, y1, z1), iso(x1, y1, z0), iso(x1, y0, z0)]),
});
const ring = (o, i, z) => {
  const a = [iso(-o, -o, z), iso(o, -o, z), iso(o, o, z), iso(-o, o, z)];
  const b = [iso(-i, -i, z), iso(-i, i, z), iso(i, i, z), iso(i, -i, z)];
  const p = (arr) => `M${arr.map((q) => `${q[0].toFixed(2)} ${q[1].toFixed(2)}`).join("L")}Z`;
  return p(a) + p(b);
};
const BASE = box(-1.95, 1.95, -1.95, 1.95, -0.62, -0.4);
const FRAME = box(-1.95, 1.95, -1.95, 1.95, 0.32, 0.5);
const FRAME_RING = ring(1.95, 1.7, 0.5);
const TILES = (() => {
  const out = [];
  for (let s = 0; s <= 4; s++)
    for (let i = 0; i < 3; i++) {
      const j = s - i;
      if (j < 0 || j > 2) continue;
      const x0 = -1.64 + i * 1.14;
      const y0 = -1.64 + j * 1.14;
      const e = 0.3;
      const tx = ((i - 1) - (j - 1)) * KX * e;
      const ty = ((i - 1) + (j - 1)) * KY * e - 3;
      out.push({ k: `${i}-${j}`, ...box(x0, x0 + 1, y0, y0 + 1, 0, 0.12), tx, ty, glint: [iso(x0 + 0.2, y0 + 0.75, 0.12), iso(x0 + 0.75, y0 + 0.2, 0.12)] });
    }
  return out;
})();
const CORNERS = [
  [1.95, -1.95],
  [1.95, 1.95],
  [-1.95, 1.95],
];

const IsoBox = ({ b, stroke, topFill, op = 1 }) => (
  <g stroke={stroke} strokeWidth="0.6" strokeLinejoin="round" strokeOpacity={0.85 * op}>
    <polygon points={b.left} fill={stroke} fillOpacity={0.04 * op} />
    <polygon points={b.right} fill={stroke} fillOpacity={0.08 * op} />
    <polygon points={b.top} fill={topFill} />
  </g>
);

const DimLine = ({ a, b, tickA, tickB, color }) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  return (
    <g stroke={color} strokeWidth="0.5" fill="none">
      <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} strokeOpacity="0.8" />
      <path d={`M${tickA[0][0]} ${tickA[0][1]}L${tickA[1][0]} ${tickA[1][1]}M${tickB[0][0]} ${tickB[0][1]}L${tickB[1][0]} ${tickB[1][1]}`} strokeOpacity="0.8" />
      <polygon points={pts([[mx, my - 3.4], [mx + 2.6, my], [mx, my + 3.4], [mx - 2.6, my]])} fill={C.skyMid} strokeOpacity="0.9" />
    </g>
  );
};

export const CadScene = memo(({ uid, accent, seed }) => {
  const dimA = [iso(-1.95, 2.55, -0.62), iso(1.95, 2.55, -0.62)];
  const dimB = [iso(2.55, -1.95, 0.5), iso(2.55, 1.95, 0.5)];
  return (
    <>
      <Backdrop uid={uid} accent={accent} seed={seed} />
      <defs>
        <linearGradient id={`${uid}-tile`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.ice} stopOpacity="0.32" />
          <stop offset="1" stopColor={C.violet} stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* blueprint registration marks */}
      <g stroke={C.ice} strokeOpacity="0.35" strokeWidth="0.5" fill="none">
        <path d="M104 46 V40 H110 M296 46 V40 H290" />
        <circle cx="96" cy="106" r="3.2" />
        <path d="M90 106 H102 M96 100 V112" />
        <circle cx="304" cy="106" r="3.2" />
        <path d="M298 106 H310 M304 100 V112" />
      </g>

      {/* alignment axes, spanning the full explode range */}
      <g stroke={C.ice} strokeOpacity="0.22" strokeWidth="0.45" strokeDasharray="1.4 2.2">
        {CORNERS.map(([x, y]) => {
          const a = iso(x, y, 0.5);
          const b = iso(x, y, -0.62);
          return <line key={`${x}${y}`} x1={a[0]} y1={a[1] - 14} x2={b[0]} y2={b[1] + 14} />;
        })}
      </g>

      {/* base plate */}
      <g className="pa-explode" style={{ "--tx": "0px", "--ty": "14px" }}>
        <IsoBox b={BASE} stroke={C.violet} topFill="rgba(155,131,247,0.08)" />
        <g stroke={C.ice} strokeOpacity="0.3" strokeWidth="0.4">
          <line x1={iso(-1.95, 1.95, -0.62)[0]} y1={iso(-1.95, 1.95, -0.62)[1]} x2={dimA[0][0]} y2={dimA[0][1]} />
          <line x1={iso(1.95, 1.95, -0.62)[0]} y1={iso(1.95, 1.95, -0.62)[1]} x2={dimA[1][0]} y2={dimA[1][1]} />
        </g>
        <DimLine
          a={dimA[0]}
          b={dimA[1]}
          tickA={[iso(-1.95, 2.4, -0.62), iso(-1.95, 2.7, -0.62)]}
          tickB={[iso(1.95, 2.4, -0.62), iso(1.95, 2.7, -0.62)]}
          color={C.ice}
        />
      </g>

      {/* segmented tiles */}
      {TILES.map((t) => (
        <g key={t.k} className="pa-explode" style={{ "--tx": `${t.tx.toFixed(2)}px`, "--ty": `${t.ty.toFixed(2)}px` }}>
          <IsoBox b={t} stroke={C.ice} topFill={`url(#${uid}-tile)`} />
          <line x1={t.glint[0][0]} y1={t.glint[0][1]} x2={t.glint[1][0]} y2={t.glint[1][1]} stroke={C.white} strokeOpacity="0.35" strokeWidth="0.5" />
        </g>
      ))}

      {/* top frame (jig) */}
      <g className="pa-explode" style={{ "--tx": "0px", "--ty": "-14px" }}>
        <g stroke={C.neon} strokeWidth="0.6" strokeLinejoin="round" strokeOpacity="0.8">
          <polygon points={FRAME.left} fill={C.neon} fillOpacity="0.05" />
          <polygon points={FRAME.right} fill={C.neon} fillOpacity="0.09" />
          <path d={FRAME_RING} fill={C.neon} fillOpacity="0.1" fillRule="evenodd" />
        </g>
        <g stroke={C.ice} strokeOpacity="0.3" strokeWidth="0.4">
          <line x1={iso(1.95, -1.95, 0.5)[0]} y1={iso(1.95, -1.95, 0.5)[1]} x2={dimB[0][0]} y2={dimB[0][1]} />
          <line x1={iso(1.95, 1.95, 0.5)[0]} y1={iso(1.95, 1.95, 0.5)[1]} x2={dimB[1][0]} y2={dimB[1][1]} />
        </g>
        <DimLine
          a={dimB[0]}
          b={dimB[1]}
          tickA={[iso(2.4, -1.95, 0.5), iso(2.7, -1.95, 0.5)]}
          tickB={[iso(2.4, 1.95, 0.5), iso(2.7, 1.95, 0.5)]}
          color={C.ice}
        />
      </g>
    </>
  );
});
CadScene.displayName = "CadScene";

/* ======================================================================
   05 NETWORK: gateway, switch and racks with packets moving on the links
   ====================================================================== */
const RACKS = [
  { x: 96, h: 40 },
  { x: 148, h: 52 },
  { x: 200, h: 46 },
  { x: 252, h: 54 },
  { x: 304, h: 42 },
];
const NET_LINKS = RACKS.map((r, k) => {
  const sx = 160 + k * 20;
  const top = 166 - r.h;
  return `M${sx} 91 C ${sx} 110, ${r.x} ${top - 20}, ${r.x} ${top}`;
});
const PACKET_COLORS = [C.ice, C.neon, C.ice, C.violet, C.neon];

export const NetworkScene = memo(({ uid, accent, seed }) => (
  <>
    <Backdrop uid={uid} accent={accent} seed={seed} />
    <defs>
      <linearGradient id={`${uid}-gem`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.heat} />
        <stop offset="0.4" stopColor={C.neon} />
        <stop offset="0.7" stopColor={C.violet} />
        <stop offset="1" stopColor={C.ice} />
      </linearGradient>
    </defs>

    <g transform="translate(0 4)">
    {/* side nodes (monitoring, remote access) */}
    <g fill="none" stroke={C.violet} strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="2 2.5">
      <path d="M58 70 C 100 70, 112 84, 146 84" />
      <path d="M342 70 C 300 70, 288 84, 254 84" />
    </g>
    <Pulse d="M58 70 C 100 70, 112 84, 146 84" color={C.ice} delay={-1} dur={4.4} width={1} />
    <Pulse d="M342 70 C 300 70, 288 84, 254 84" color={C.neon} delay={-3} dur={4.8} width={1} />
    <g>
      <circle cx="52" cy="70" r="5.5" fill={C.panel} stroke={C.ice} strokeOpacity="0.8" strokeWidth="0.7" />
      <circle cx="52" cy="70" r="1.8" fill={C.ice} />
      <rect x="342.5" y="64.5" width="11" height="11" rx="2.5" fill={C.panel} stroke={C.neon} strokeOpacity="0.8" strokeWidth="0.7" />
      <circle cx="348" cy="70" r="1.6" fill={C.neon} className="pa-blink" />
    </g>

    {/* uplinks */}
    <line x1="200" y1="58" x2="200" y2="78" stroke={C.violet} strokeOpacity="0.5" strokeWidth="0.7" />
    <Pulse d="M200 58 L200 78" color={C.heat} delay={-0.5} dur={2.6} width={1} />
    <g fill="none" stroke={C.violet} strokeOpacity="0.38" strokeWidth="0.65">
      {NET_LINKS.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
    {NET_LINKS.map((d, k) => (
      <Pulse key={d} d={d} color={PACKET_COLORS[k]} delay={-(k * 0.83)} dur={3 + (k % 3) * 0.4} reverse={k % 2 === 1} width={1.1} />
    ))}

    {/* switch */}
    <rect x="146" y="78" width="108" height="13" rx="3" fill={C.panel} stroke={C.violet} strokeOpacity="0.65" strokeWidth="0.6" />
    {Array.from({ length: 12 }, (_, k) => (
      <rect
        key={k}
        x={152 + k * 8.2}
        y="83.2"
        width="4.4"
        height="2.6"
        rx="0.6"
        fill={k % 4 === 1 ? C.neon : C.ice}
        opacity={k % 3 === 0 ? 0.45 : 0.85}
        className={k % 3 === 2 ? "pa-blink" : undefined}
        style={{ animationDelay: `${-(k * 0.53).toFixed(2)}s` }}
      />
    ))}

    {/* racks */}
    {RACKS.map((r, k) => (
      <Rack key={r.x} x={r.x - 13} y={166 - r.h} w={26} h={r.h} seed={k * 2} />
    ))}

    {/* gateway gem with a monitoring ping */}
    <circle cx="200" cy="50" r="7" fill="none" stroke={C.ice} strokeWidth="0.6" className="pa-ping pa-fill-box" />
    <Gem cx={200} cy={50} s={0.95} stroke={`url(#${uid}-gem)`} />
    </g>
  </>
));
NetworkScene.displayName = "NetworkScene";
