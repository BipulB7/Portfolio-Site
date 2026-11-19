import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Lofi "local time" card: a live New York clock with a blinking colon,
 * a tiny equalizer and a miniature synthwave horizon.
 * The clock ticks once per second only while the card is on screen
 * and the tab is visible.
 */

const TZ = "America/New_York";
const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZoneName: "short",
});
const hourFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hourCycle: "h23" });

const read = (date) => {
  const p = {};
  for (const part of timeFmt.formatToParts(date)) p[part.type] = part.value;
  const h24 = Number(hourFmt.format(date)) % 24;
  const partOfDay = h24 < 5 ? "Late night" : h24 < 12 ? "Morning" : h24 < 17 ? "Afternoon" : h24 < 21 ? "Evening" : "Late night";
  return {
    hour: (p.hour ?? "").padStart(2, "0"),
    minute: p.minute ?? "00",
    period: p.dayPeriod ?? "",
    zone: p.timeZoneName ?? "ET",
    partOfDay,
  };
};

const BARS = [
  { delay: "-0.15s", dur: "1.05s" },
  { delay: "-0.55s", dur: "0.9s" },
  { delay: "-0.3s", dur: "1.25s" },
  { delay: "-0.8s", dur: "0.95s" },
  { delay: "-0.45s", dur: "1.15s" },
];

const Equalizer = () => (
  <span aria-hidden className="flex h-4 items-end gap-[3px]">
    {BARS.map((b, i) => (
      <span
        key={i}
        className="h-full w-[3px] origin-bottom animate-eq rounded-full"
        style={{
          animationDelay: b.delay,
          animationDuration: b.dur,
          background: "linear-gradient(to top, hsl(var(--heat)), hsl(var(--neon)) 55%, hsl(var(--primary)))",
        }}
      />
    ))}
  </span>
);

export const LocalTimeCard = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "120px 0px 120px 0px" });
  const reduce = useReducedMotion();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!inView) return undefined;
    let id = null;
    const stop = () => {
      if (id !== null) clearInterval(id);
      id = null;
    };
    const start = () => {
      stop();
      setNow(new Date());
      id = setInterval(() => setNow(new Date()), 1000);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [inView]);

  const t = read(now);
  const colonOn = reduce || now.getSeconds() % 2 === 0;

  return (
    <div ref={ref} className="glass relative isolate overflow-hidden rounded-2xl p-5 sm:p-6">
      {/* miniature synthwave horizon: sun setting behind a scrolling neon floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-40 [mask-image:linear-gradient(to_right,transparent,#000_55%)] sm:w-56"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon/[0.06] to-primary/[0.08]" />
        <div className="absolute inset-x-0 bottom-[30%] top-0 overflow-hidden">
          <div className="retro-sun absolute bottom-0 left-[58%] h-20 w-20 -translate-x-1/2 translate-y-[24%] opacity-75 sm:h-24 sm:w-24" />
        </div>
        <div className="absolute inset-x-0 bottom-[30%] h-px bg-sunset opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-[30%] overflow-hidden [perspective:150px]">
          <div
            className="retro-grid absolute inset-x-[-60%] bottom-0 h-[280%] origin-bottom animate-grid-scroll opacity-60 [transform:rotateX(62deg)]"
            style={{ "--grid-size": "14px" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-ice opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ice shadow-[0_0_8px_hsl(var(--ice))]" />
        </span>
        Local time
      </div>

      <p className="mt-3 flex items-baseline gap-2 font-mono text-foreground">
        <time dateTime={now.toISOString()} className="text-4xl font-medium tabular-nums tracking-tight sm:text-[2.75rem]">
          {t.hour}
          <span className="sc-colon" style={{ opacity: colonOn ? 1 : 0.15 }}>
            :
          </span>
          {t.minute}
        </time>
        <span className="text-sm text-muted-foreground">{t.period}</span>
        <span className="sr-only">Eastern Time</span>
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
        <span>
          <span className="text-foreground">New York</span>
          <span className="mx-2 text-border" aria-hidden>
            /
          </span>
          {t.partOfDay}
        </span>
        <Equalizer />
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em]">{t.zone}</span>
      </div>
    </div>
  );
};
