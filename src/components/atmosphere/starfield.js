/**
 * Canvas starfield engine (no React). Three parallax depth layers, twinkle,
 * shooting stars and a cursor "diamond lattice" constellation.
 *
 *   const destroy = createStarfield(canvas);
 *
 * Performance notes
 * - All per-frame state lives in plain variables; nothing touches React.
 * - Stars are drawn from pre-rendered sprites (no shadowBlur per star).
 * - devicePixelRatio is capped at 2 and resize is debounced.
 * - The loop stops while the tab is hidden; reduced motion draws one static frame.
 */

const TAU = Math.PI * 2;

/* Depth layers: far (tiny, dim, slow) -> near (larger, bright, glowing, fast). */
const LAYERS = [
  { share: 0.58, r: [0.45, 0.85], a: [0.3, 0.62], tw: [0.6, 1.6], amp: [0.25, 0.55], depth: 0.025, pull: 5 },
  { share: 0.29, r: [0.8, 1.25], a: [0.5, 0.85], tw: [0.5, 1.3], amp: [0.2, 0.45], depth: 0.07, pull: 12 },
  { share: 0.13, r: [1.15, 1.85], a: [0.75, 1], tw: [0.35, 1], amp: [0.15, 0.35], depth: 0.15, pull: 24 },
];

const DENSITY = 9000; // px^2 per star
const MAX_STARS = 450;
const MIN_STARS = 70;
const LIGHT_SHARE = 0.6; // fraction of stars kept in light mode
const WRAP = 12; // px margin so stars wrap off-screen, not at the edge

/* Shooting stars: 215deg in the usual math convention (y up) = down-left. */
const METEOR_ANGLE = (215 * Math.PI) / 180;
const METEOR_DIR = { x: Math.cos(METEOR_ANGLE), y: -Math.sin(METEOR_ANGLE) };

/* Cursor lattice */
const LATTICE_RADIUS = 150;
const LATTICE_LINK = 95;
const LATTICE_IDLE = 2.6; // seconds without movement before it fades away

const rand = (a, b) => a + Math.random() * (b - a);
const mod = (n, m) => ((n % m) + m) % m;

/* "252 88% 74%" -> [h, s, l] */
const readToken = (name, fallback) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parts = (raw || fallback).split(/\s+/);
  return parts.length >= 3 ? parts.slice(0, 3) : fallback.split(/\s+/);
};
const hsla = ([h, s, l], a = 1) => `hsla(${h}, ${s}, ${l}, ${a})`;

const makeCanvas = (size) => {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  return c;
};

/* Soft round star core. Drawn at ~3x the star radius. */
const dotSprite = (color) => {
  const s = 32;
  const c = makeCanvas(s);
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, hsla(color, 1));
  grad.addColorStop(0.4, hsla(color, 0.95));
  grad.addColorStop(0.68, hsla(color, 0.4));
  grad.addColorStop(1, hsla(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
};

/* Wide halo for near stars and meteor heads. */
const glowSprite = (color) => {
  const s = 64;
  const c = makeCanvas(s);
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, hsla(color, 0.5));
  grad.addColorStop(0.18, hsla(color, 0.2));
  grad.addColorStop(0.5, hsla(color, 0.05));
  grad.addColorStop(1, hsla(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
};

/* Four-point diamond glint (diffraction spikes) for a few bright stars. */
const glintSprite = (color) => {
  const s = 64;
  const c = makeCanvas(s);
  const g = c.getContext("2d");
  const h = g.createLinearGradient(0, 0, s, 0);
  h.addColorStop(0, hsla(color, 0));
  h.addColorStop(0.5, hsla(color, 0.9));
  h.addColorStop(1, hsla(color, 0));
  g.fillStyle = h;
  g.fillRect(0, s / 2 - 0.75, s, 1.5);
  const v = g.createLinearGradient(0, 0, 0, s);
  v.addColorStop(0, hsla(color, 0));
  v.addColorStop(0.5, hsla(color, 0.9));
  v.addColorStop(1, hsla(color, 0));
  g.fillStyle = v;
  g.fillRect(s / 2 - 0.75, 0, 1.5, s);
  return c;
};

export function createStarfield(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const root = document.documentElement;
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fineMq = window.matchMedia("(hover: hover) and (pointer: fine)");

  let W = 0;
  let H = 0;
  let dpr = 1;
  let stars = [];
  let meteors = [];
  let raf = 0;
  let running = false;
  let lastT = 0;
  let nextMeteor = 0;
  let resizeTimer = 0;
  let firstPaint = true;

  /* theme-dependent palette */
  let dark = root.classList.contains("dark");
  let theme = null;

  /* pointer: target (t*) and eased (x/y) positions in px */
  const mouse = { tx: 0, ty: 0, x: 0, y: 0, inside: false, lastMove: -10, ready: false };
  let latticeFade = 0;
  const near = []; // lattice candidates, reused each frame

  const buildTheme = () => {
    dark = root.classList.contains("dark");
    const star = readToken("--star", dark ? "0 0% 100%" : "232 45% 25%");
    const ice = readToken("--ice", dark ? "190 95% 72%" : "194 88% 38%");
    const neon = readToken("--neon", dark ? "326 100% 68%" : "326 85% 55%");
    const heat = readToken("--heat", dark ? "22 100% 63%" : "18 92% 52%");
    const primary = readToken("--primary", dark ? "252 88% 74%" : "252 62% 56%");

    // Colour mix: mostly white, a few ice-blue, rare pink / amber tints.
    const colors = dark ? [star, ice, neon, heat] : [star, ice, primary];
    const weights = dark ? [0.84, 0.12, 0.02, 0.02] : [0.84, 0.1, 0.06];
    const cumulative = [];
    weights.reduce((acc, w, i) => (cumulative[i] = acc + w), 0);

    theme = {
      colors,
      cumulative,
      dots: colors.map(dotSprite),
      glows: colors.map(glowSprite),
      glints: colors.map(glintSprite),
      headGlow: glowSprite(dark ? star : primary),
      alpha: dark ? 1 : 0.6,
      glow: dark ? 1 : 0.35,
      lattice: dark ? 1 : 0.6,
      lineA: primary,
      lineB: ice,
      meteorHead: dark ? star : primary,
      meteorTails: dark ? [ice, ice, neon] : [primary, ice],
    };
    stars.forEach(assignColor);
  };

  const assignColor = (s) => {
    const i = theme.cumulative.findIndex((c) => s.cr <= c);
    s.ci = i === -1 ? 0 : i;
  };

  const makeStars = (count) => {
    const list = [];
    LAYERS.forEach((L, li) => {
      const n = Math.round(count * L.share);
      for (let i = 0; i < n; i++) {
        const s = {
          nx: Math.random(),
          ny: Math.random(),
          layer: li,
          r: rand(L.r[0], L.r[1]),
          a: rand(L.a[0], L.a[1]),
          tw: rand(L.tw[0], L.tw[1]),
          amp: rand(L.amp[0], L.amp[1]),
          ph: Math.random() * TAU,
          cr: Math.random(),
          lite: Math.random() < LIGHT_SHARE,
          glint: li === 2 && Math.random() < 0.3,
          ci: 0,
          sx: 0,
          sy: 0,
        };
        if (theme) assignColor(s);
        list.push(s);
      }
    });
    return list;
  };

  const targetCount = () =>
    Math.max(MIN_STARS, Math.min(MAX_STARS, Math.round((W * H) / DENSITY)));

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    W = w;
    H = h;
    // Positions are normalised, so a small resize (mobile URL bar) keeps the
    // same sky; only regenerate when the star count would change noticeably.
    const target = targetCount();
    if (!stars.length || Math.abs(target - stars.length) / stars.length > 0.2) {
      stars = makeStars(target);
    }
    if (!running) drawStatic();
  };

  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  };

  /* ---------------------------------------------------------------- */
  /* Meteors                                                           */
  /* ---------------------------------------------------------------- */
  const spawnMeteor = (delay = 0, from) => {
    const x = from ? from.x + rand(-140, 140) : rand(W * 0.3, W * 1.05);
    const y = from ? from.y + rand(-50, 70) : rand(-H * 0.05, H * 0.42);
    const tails = theme.meteorTails;
    meteors.push({
      x,
      y,
      age: -delay,
      life: rand(0.85, 1.2),
      speed: rand(Math.max(520, W * 0.45), Math.max(760, W * 0.65)),
      len: rand(130, 240),
      w: rand(1, 1.6),
      tail: tails[Math.floor(Math.random() * tails.length)],
    });
  };

  const scheduleMeteor = (t, min = 3, max = 7) => {
    nextMeteor = t + rand(min, max);
  };

  const drawMeteors = (dt) => {
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.age += dt;
      if (m.age < 0) continue;
      const p = m.age / m.life;
      if (p >= 1) {
        meteors.splice(i, 1);
        continue;
      }
      const fade = p < 0.12 ? p / 0.12 : p > 0.55 ? Math.max(0, 1 - (p - 0.55) / 0.45) : 1;
      const travelled = m.speed * m.age;
      const hx = m.x + METEOR_DIR.x * travelled;
      const hy = m.y + METEOR_DIR.y * travelled;
      const tailLen = Math.min(m.len, travelled);
      const tx = hx - METEOR_DIR.x * tailLen;
      const ty = hy - METEOR_DIR.y * tailLen;

      const grad = ctx.createLinearGradient(hx, hy, tx, ty);
      grad.addColorStop(0, hsla(theme.meteorHead, (dark ? 0.95 : 0.75) * fade));
      grad.addColorStop(0.22, hsla(m.tail, 0.6 * fade * (dark ? 1 : 0.7)));
      grad.addColorStop(1, hsla(m.tail, 0));
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grad;
      ctx.lineWidth = m.w;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      const g = 16 + m.w * 6;
      ctx.globalAlpha = fade * (dark ? 0.9 : 0.5);
      ctx.drawImage(theme.headGlow, hx - g / 2, hy - g / 2, g, g);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Drawing                                                           */
  /* ---------------------------------------------------------------- */
  const drawStars = (t, animated) => {
    const scroll = animated ? window.scrollY : 0;
    const rangeX = W + WRAP * 2;
    const rangeY = H + WRAP * 2;
    // Mouse offset in [-0.5, 0.5]; stars drift opposite to the cursor.
    const mox = animated && mouse.ready ? -(mouse.x / W - 0.5) : 0;
    const moy = animated && mouse.ready ? -(mouse.y / H - 0.5) : 0;
    const collect = animated && latticeFade > 0.01;
    near.length = 0;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!dark && !s.lite) continue;
      const L = LAYERS[s.layer];
      const x = mod(s.nx * rangeX + mox * L.pull, rangeX) - WRAP;
      const y = mod(s.ny * rangeY - scroll * L.depth + moy * L.pull, rangeY) - WRAP;
      s.sx = x;
      s.sy = y;

      const wave = animated ? 0.5 + 0.5 * Math.sin(t * s.tw + s.ph) : 0.7;
      const alpha = s.a * (1 - s.amp * wave) * theme.alpha;
      if (alpha <= 0.01) continue;

      const size = s.r * 3;
      ctx.globalAlpha = alpha;
      ctx.drawImage(theme.dots[s.ci], x - size / 2, y - size / 2, size, size);

      if (s.layer === 2) {
        const g = s.r * 11;
        ctx.globalAlpha = alpha * 0.85 * theme.glow;
        ctx.drawImage(theme.glows[s.ci], x - g / 2, y - g / 2, g, g);

        // Brief diamond glint at the top of the twinkle cycle
        if (s.glint) {
          const peak = animated ? Math.max(0, (1 - wave - 0.55) / 0.45) : 0.35;
          if (peak > 0.02) {
            const k = s.r * 9 * (0.75 + peak * 0.5);
            ctx.globalAlpha = peak * 0.7 * theme.glow;
            ctx.drawImage(theme.glints[s.ci], x - k / 2, y - k / 2, k, k);
          }
        }
      }

      if (collect && s.layer > 0) {
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < LATTICE_RADIUS) near.push({ x, y, d });
      }
    }
  };

  const drawLattice = () => {
    if (near.length < 2) return;
    const base = 0.68 * latticeFade * theme.lattice;
    ctx.lineWidth = 0.75;
    for (let i = 0; i < near.length; i++) {
      const a = near[i];
      for (let j = i + 1; j < near.length; j++) {
        const b = near[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > LATTICE_LINK) continue;
        const proximity = 1 - (a.d + b.d) / 2 / LATTICE_RADIUS;
        const alpha = base * (1 - d / LATTICE_LINK) * Math.min(1, proximity * 1.6);
        if (alpha <= 0.01) continue;
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, hsla(theme.lineA, alpha));
        grad.addColorStop(1, hsla(theme.lineB, alpha));
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    // Tiny diamond nodes on the lattice points
    ctx.strokeStyle = hsla(theme.lineB, 1);
    ctx.lineWidth = 0.6;
    for (let i = 0; i < near.length; i++) {
      const n = near[i];
      const alpha = base * 0.9 * (1 - n.d / LATTICE_RADIUS);
      if (alpha <= 0.02) continue;
      const k = 3.2;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y - k);
      ctx.lineTo(n.x + k, n.y);
      ctx.lineTo(n.x, n.y + k);
      ctx.lineTo(n.x - k, n.y);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const reveal = () => {
    if (!firstPaint) return;
    firstPaint = false;
    canvas.style.opacity = "1";
  };

  const drawStatic = () => {
    if (!W || !H) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawStars(0, false);
    ctx.globalAlpha = 1;
    reveal();
  };

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const t = now / 1000;
    const dt = Math.min(0.05, Math.max(0, t - lastT));
    lastT = t;

    // Ease toward the cursor (frame-rate independent)
    const k = 1 - Math.exp(-dt * 3.2);
    mouse.x += (mouse.tx - mouse.x) * k;
    mouse.y += (mouse.ty - mouse.y) * k;

    const wantLattice = mouse.inside && t - mouse.lastMove < LATTICE_IDLE ? 1 : 0;
    const fadeRate = wantLattice ? 2.6 : 1.1;
    latticeFade += (wantLattice - latticeFade) * (1 - Math.exp(-dt * fadeRate));

    if (t >= nextMeteor) {
      if (nextMeteor) {
        spawnMeteor();
        if (Math.random() < 0.22) spawnMeteor(rand(0.15, 0.4), meteors[meteors.length - 1]);
      }
      // first one lands just after the intro curtain opens, then every 3-7s
      scheduleMeteor(t, nextMeteor ? 3 : 2.4, nextMeteor ? 7 : 3.6);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawStars(t, true);
    if (latticeFade > 0.01) drawLattice();
    drawMeteors(dt);
    ctx.globalAlpha = 1;
    reveal();
  };

  const start = () => {
    if (running || reducedMq.matches || document.hidden) return;
    running = true;
    lastT = performance.now() / 1000;
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const applyMotionPreference = () => {
    if (reducedMq.matches) {
      stop();
      meteors = [];
      drawStatic();
    } else {
      start();
    }
  };

  /* ---------------------------------------------------------------- */
  /* Events                                                            */
  /* ---------------------------------------------------------------- */
  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse" || !fineMq.matches) return;
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
    if (!mouse.ready) {
      mouse.x = W / 2;
      mouse.y = H / 2;
      mouse.ready = true;
    }
    mouse.inside = true;
    mouse.lastMove = performance.now() / 1000;
  };
  const onMouseOut = (e) => {
    if (!e.relatedTarget) mouse.inside = false;
  };
  const onBlur = () => {
    mouse.inside = false;
  };
  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  const observer = new MutationObserver(() => {
    if (root.classList.contains("dark") === dark) return;
    buildTheme();
    if (!running) drawStatic();
  });

  /* ---------------------------------------------------------------- */
  /* Boot                                                              */
  /* ---------------------------------------------------------------- */
  buildTheme();
  resize();
  observer.observe(root, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("mouseout", onMouseOut, { passive: true });
  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onVisibility);
  reducedMq.addEventListener?.("change", applyMotionPreference);
  applyMotionPreference();

  return () => {
    stop();
    clearTimeout(resizeTimer);
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("mouseout", onMouseOut);
    window.removeEventListener("blur", onBlur);
    document.removeEventListener("visibilitychange", onVisibility);
    reducedMq.removeEventListener?.("change", applyMotionPreference);
  };
}
