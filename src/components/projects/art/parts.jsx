import { C } from "./palette";

/**
 * A soft light pulse travelling along `d` (glow stroke + bright core).
 * Uses pathLength=100 so every path shares the same dash timing.
 */
export const Pulse = ({ d, color = C.ice, delay = 0, dur = 3.2, width = 1.2, reverse = false, linear = false }) => {
  const cls = `${reverse ? "pa-travel-rev" : "pa-travel"}${linear ? " pa-linear" : ""}`;
  const style = { animationDelay: `${delay}s`, animationDuration: `${dur}s` };
  return (
    <g fill="none" strokeLinecap="round">
      <path
        d={d}
        pathLength="100"
        stroke={color}
        strokeOpacity="0.28"
        strokeWidth={width * 3.4}
        strokeDasharray="12 140"
        className={cls}
        style={style}
      />
      <path
        d={d}
        pathLength="100"
        stroke={color}
        strokeWidth={width}
        strokeDasharray="12 140"
        className={cls}
        style={style}
      />
    </g>
  );
};

const LED_COLORS = [C.ice, C.neon, C.ice, C.heat, C.violet];

/** Abstract server rack: outlined box, slot lines and blinking status LEDs. */
export const Rack = ({ x, y, w = 22, h = 52, seed = 0, stroke = C.violet }) => {
  const slots = [];
  for (let sy = y + 5; sy < y + h - 3; sy += 5.5) slots.push(sy);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1.6" fill={C.panel} stroke={stroke} strokeOpacity="0.6" strokeWidth="0.6" />
      <rect x={x + 1.5} y={y + 1.5} width={w - 3} height="1.2" rx="0.6" fill={stroke} opacity="0.35" />
      <g stroke={stroke} strokeOpacity="0.28" strokeWidth="0.5">
        {slots.map((sy) => (
          <line key={sy} x1={x + 3} y1={sy} x2={x + w - 7} y2={sy} />
        ))}
      </g>
      {slots.map((sy, i) => {
        const k = (i + seed) % LED_COLORS.length;
        return (
          <circle
            key={`led-${sy}`}
            cx={x + w - 4}
            cy={sy - 0.2}
            r="0.85"
            fill={LED_COLORS[k]}
            className={(i + seed) % 3 === 0 ? undefined : "pa-blink"}
            style={{ animationDelay: `${-((i * 0.7 + seed * 0.37) % 2.4).toFixed(2)}s` }}
          />
        );
      })}
    </g>
  );
};

/** Small brilliant-cut gem glyph (generic; not anyone's logo). */
export const Gem = ({ cx, cy, s = 1, stroke, fill = C.panel }) => {
  const p = (x, y) => `${(cx + x * s).toFixed(2)},${(cy + y * s).toFixed(2)}`;
  return (
    <g strokeLinejoin="round" strokeWidth={0.8}>
      <polygon points={[p(-6, -6), p(6, -6), p(10, -1.5), p(0, 10), p(-10, -1.5)].join(" ")} fill={fill} stroke={stroke} />
      <path
        d={`M${p(-10, -1.5)} L${p(10, -1.5)} M${p(-6, -6)} L${p(-3, -1.5)} L${p(0, 10)} L${p(3, -1.5)} L${p(6, -6)}`}
        fill="none"
        stroke={stroke}
        strokeOpacity="0.7"
        strokeWidth={0.55}
      />
    </g>
  );
};
