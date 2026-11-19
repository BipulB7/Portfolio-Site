import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import { profile, socials } from "../data/content";
import { useIntro } from "../context/IntroContext";
import { scrollToId } from "../lib/scroll";
import { cn } from "../lib/utils";
import { Magnetic } from "./ui/Magnetic";
import { AnimatedName } from "./hero/AnimatedName";
import { Portrait } from "./hero/Portrait";
import { RetroScene } from "./hero/RetroScene";
import { RotatingWord } from "./hero/RotatingWord";
import { ScrollCue } from "./hero/ScrollCue";
import { getSocialIcon } from "./hero/socialIcons";
import { useMediaQuery } from "./hero/useMediaQuery";
import { rise } from "./hero/variants";

/**
 * Hero: a synthwave night over deep space. Name, role and intro on the left,
 * a framed portrait on the right with a striped sun setting behind it into a
 * neon grid floor. Entrance waits for the intro curtain (useIntro().introDone),
 * and the whole scene drifts apart as you scroll away.
 */
export const HeroSection = () => {
  const ref = useRef(null);
  const { introDone } = useIntro();
  const reduce = useReducedMotion();
  const inView = useInView(ref);
  // The stacked mobile hero is taller than the screen, so only the desktop
  // layout drifts and fades on scroll (otherwise copy fades while being read).
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const exit = isDesktop && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const portraitOpacity = useTransform(scrollYProgress, [0.15, 0.8], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const show = introDone;
  const anim = show ? "show" : "hidden";
  const { current } = profile;

  return (
    <section
      id="hero"
      ref={ref}
      aria-label="Introduction"
      className="relative flex min-h-[min(100svh,75rem)] items-center overflow-hidden pb-24 pt-28 sm:pb-32 lg:pb-24 lg:pt-[5.5rem]"
    >
      <RetroScene progress={scrollYProgress} show={show} active={inView} reduce={reduce} />

      <div className="container relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
          {/* ---------------- text column ---------------- */}
          <motion.div
            style={exit ? { y: textY, opacity: textOpacity } : undefined}
            className="order-2 min-w-0 lg:order-1 lg:col-span-7"
          >
            {/* status pill */}
            <motion.div initial="hidden" animate={anim} variants={rise(0.05, { y: 14 })}>
              <p className="glass inline-flex max-w-full items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4 text-xs sm:text-[0.8rem]">
                <span aria-hidden className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-ice opacity-70 animate-ping-slow" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ice shadow-[0_0_10px_hsl(var(--ice))]" />
                </span>
                <span className="whitespace-nowrap text-muted-foreground">
                  Currently at <span className="font-medium text-foreground">{current.company}</span>
                </span>
                <span aria-hidden className="hidden h-3.5 w-px shrink-0 bg-border sm:block" />
                <span className="hidden truncate text-muted-foreground sm:inline">{current.focus}</span>
              </p>
            </motion.div>

            {/* name */}
            <div className="mt-6">
              <AnimatedName first={profile.firstName} last={profile.lastName} show={show} />
            </div>

            {/* role + rotating line */}
            <motion.div initial="hidden" animate={anim} variants={rise(0.8)} className="mt-6">
              <p className="eyebrow flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-sunset" />
                {profile.role}
              </p>
              <p className="mt-2.5 font-display text-[1.6rem] leading-[1.15] text-foreground sm:text-[2.2rem]">
                I build <RotatingWord words={profile.rotatingWords} active={show && inView} className="italic" />
              </p>
            </motion.div>

            {/* intro copy */}
            <motion.div
              initial="hidden"
              animate={anim}
              variants={rise(0.95)}
              className="mt-5 max-w-xl space-y-2.5 text-[0.97rem] leading-relaxed text-muted-foreground text-pretty sm:text-base"
            >
              <p className="text-foreground/80">{profile.intro}</p>
              <p>{profile.introSecondary}</p>
            </motion.div>

            {/* CTAs + socials */}
            <motion.div
              initial="hidden"
              animate={anim}
              variants={rise(1.1)}
              className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Magnetic>
                <button type="button" onClick={() => scrollToId("projects")} className="cosmic-button group">
                  View my work
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                  />
                </button>
              </Magnetic>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="ghost-button">
                <Download aria-hidden className="h-4 w-4" />
                Resume
              </a>
              <ul className="flex items-center gap-1 sm:ml-2" aria-label="Social links">
                {socials.map((s) => {
                  const Icon = getSocialIcon(s.icon);
                  return (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.name} (opens in a new tab)`}
                        className={cn(
                          "chroma-hover grid h-11 w-11 place-items-center rounded-full border border-transparent text-muted-foreground",
                          "transition-[color,border-color,background-color,filter] duration-500",
                          "hover:border-border hover:bg-card/40 hover:text-foreground",
                          "hover:[filter:drop-shadow(-1.5px_0_hsl(var(--neon)/0.75))_drop-shadow(1.5px_0_hsl(var(--ice)/0.75))]"
                        )}
                      >
                        <Icon aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.7} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* stats */}
            <motion.dl
              initial="hidden"
              animate={anim}
              variants={rise(1.25)}
              className="mt-10 grid max-w-xl grid-cols-3 sm:mt-11"
            >
              {profile.heroStats.map((s, i) => (
                <div
                  key={s.label}
                  className={cn(
                    "flex min-w-0 flex-col-reverse justify-end gap-2 pr-3",
                    i > 0 && "border-l border-border/80 pl-4 sm:pl-6"
                  )}
                >
                  <dt className="font-mono text-[0.58rem] uppercase leading-snug tracking-[0.12em] text-muted-foreground sm:text-[0.64rem]">
                    {s.label}
                  </dt>
                  <dd className="font-display text-[1.9rem] leading-none text-foreground sm:text-[2.6rem]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* ---------------- portrait column ---------------- */}
          <motion.div
            style={exit ? { y: portraitY, scale: portraitScale, opacity: portraitOpacity } : undefined}
            className="order-1 pb-6 lg:order-2 lg:col-span-5 lg:pb-0"
          >
            <Portrait show={show} reduce={reduce} active={inView} />
          </motion.div>
        </div>
      </div>

      <ScrollCue
        show={show}
        onClick={() => scrollToId("about")}
        style={reduce ? undefined : { opacity: cueOpacity }}
      />
    </section>
  );
};
