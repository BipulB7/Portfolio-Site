import { ArrowUp, Mail } from "lucide-react";
import { navItems, profile } from "../data/content";
import { scrollToId, scrollToTop } from "../lib/scroll";
import { cn } from "../lib/utils";
import { Monogram } from "./chrome/Monogram";
import { SocialLinks } from "./chrome/SocialLinks";
import { RetroHorizon } from "./chrome/RetroHorizon";

const links = navItems.filter((item) => item.id !== "hero");

// stopPropagation keeps Lenis' own anchor handler from scrolling a second time
const go = (event, id) => {
  event.preventDefault();
  event.stopPropagation();
  scrollToId(id);
};

const toTop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  scrollToTop();
};

/** Two tiny cassette reels turning slowly. */
const Reels = () => (
  <span aria-hidden="true" className="inline-flex items-center gap-[3px]">
    {[0, 1].map((i) => (
      <svg key={i} viewBox="0 0 12 12" className="h-3 w-3 animate-spin-slow">
        <circle cx="6" cy="6" r="5.25" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="6" cy="6" r="1.4" fill="currentColor" />
        <path d="M6 1.6v2M9.8 8.2 8.1 7.2M2.2 8.2l1.7-1" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    ))}
  </span>
);

const Heading = ({ children }) => (
  <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">{children}</p>
);

export const Footer = () => {
  const year = new Date().getFullYear();
  const name = `${profile.firstName} ${profile.lastName}`;

  return (
    <footer className="relative z-10 overflow-hidden">
      {/* Sunset hairline with a soft glow spilling down */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
        <div className="h-px bg-sunset opacity-80 mask-fade-x" />
        <div className="absolute inset-x-[15%] top-0 h-3 bg-sunset opacity-25 blur-md mask-fade-x" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_45%_100%_at_50%_0%,hsl(var(--neon)/0.08),transparent)]" />
      </div>

      <div className="container relative pt-16 md:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_auto] md:gap-10">
          {/* Identity */}
          <div className="max-w-sm sm:col-span-2 md:col-span-1">
            <Monogram href="#hero" size="lg" aria-label={`${name}, back to top`} onClick={toTop} />
            <p className="mt-4 text-[0.95rem] text-foreground/85">{profile.role}</p>
            <p className="mt-1 font-mono text-[0.72rem] tracking-wide text-muted-foreground">{profile.location}</p>
            <div className="mt-6 flex items-start gap-3">
              <span aria-hidden="true" className="relative mt-[0.5rem] flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inset-0 rounded-full bg-ice animate-ping-slow" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-ice shadow-[0_0_8px_hsl(var(--ice))]" />
              </span>
              <p className="text-sm leading-relaxed">
                <span className="text-muted-foreground">Now at </span>
                <span className="text-foreground/90">{profile.current.company}</span>
                <span className="block text-muted-foreground">{profile.current.focus}</span>
              </p>
            </div>
          </div>

          {/* Tracklist */}
          <nav aria-label="Footer">
            <Heading>Tracklist</Heading>
            <ul className="space-y-2.5">
              {links.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => go(event, item.id)}
                    className="group inline-flex items-baseline gap-3 text-[0.95rem] text-foreground/80 transition-colors duration-300 hover:text-foreground"
                  >
                    <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground/80 transition-colors duration-300 group-hover:text-neon">
                      {item.track}
                    </span>
                    <span className="chroma-hover">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Elsewhere */}
          <div>
            <Heading>Connect</Heading>
            <SocialLinks />
            <a
              href={`mailto:${profile.email}`}
              className="mt-5 inline-flex items-center gap-2 font-mono text-[0.78rem] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <Mail aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />
              {profile.email}
            </a>
          </div>
        </div>

        {/* Bottom row: the sun sets on its top edge, the grid floor runs beneath it */}
        <div className="relative mt-32 md:mt-28">
          <div aria-hidden="true" className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 opacity-60 dark:opacity-100">
            <RetroHorizon fill sunSize={176} rise={0.6} sunOpacity={0.16} gridOpacity={0.22} gridSize={38} perspective={180} />
          </div>
          {/* Extra bottom room keeps the last line clear of floating UI */}
          <div className="relative flex flex-col gap-6 pb-24 pt-7 sm:flex-row sm:items-center sm:justify-between sm:pb-20">
            <div className="space-y-1 text-[0.8rem] text-muted-foreground">
              <p>
                <span aria-hidden="true">&copy;</span>
                <span className="sr-only">Copyright</span> {year} {name}
              </p>
              <p>Designed &amp; built with React, Tailwind and Motion</p>
            </div>

            <div className="flex items-center justify-between gap-8 sm:justify-end">
              <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
                <Reels />
                End of Side A
              </p>
              <button
                type="button"
                onClick={toTop}
                className="group inline-flex items-center gap-3 text-[0.82rem] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Back to top
                <span
                  className={cn(
                    "relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-border/70 bg-card/50",
                    "transition-[border-color,box-shadow] duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_-6px_hsl(var(--primary)/0.7)]"
                  )}
                >
                  <ArrowUp
                    aria-hidden="true"
                    strokeWidth={1.7}
                    className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-7"
                  />
                  <ArrowUp
                    aria-hidden="true"
                    strokeWidth={1.7}
                    className="absolute h-4 w-4 translate-y-7 text-primary transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
