import { ArrowRight, Download, MapPin } from "lucide-react";
import { education, experience, profile } from "../data/content";
import { scrollToId } from "../lib/scroll";
import { DiamondMark } from "./ui/DiamondMark";
import { GlowCard } from "./ui/GlowCard";
import { Magnetic } from "./ui/Magnetic";
import { SectionHeading } from "./ui/SectionHeading";
import { Rise } from "./hero/Rise";
import { ExperienceTimeline, PingDot } from "./hero/Timeline";

const CardLabel = ({ children, aside }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="eyebrow">{children}</span>
    {aside && <span className="font-mono text-[0.68rem] text-muted-foreground">{aside}</span>}
  </div>
);

const EducationCard = () => (
  <GlowCard className="p-6 sm:p-7">
    <div className="relative">
      <CardLabel aside={education.period}>Education</CardLabel>
      <div className="mt-5 flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/80">
          <img
            src={education.logo}
            alt={`${education.school} logo`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight text-foreground sm:text-[1.7rem]">{education.school}</h3>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{education.degree}</p>
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Selected coursework">
        {education.coursework.map((c) => (
          <li key={c} className="chip">
            {c}
          </li>
        ))}
      </ul>
    </div>
  </GlowCard>
);

const CurrentCard = ({ entry }) => (
  <GlowCard className="p-6 sm:p-7">
    <div aria-hidden className="bg-lattice pointer-events-none absolute -right-16 -top-20 h-64 w-64" />
    <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-thermal opacity-70" />
    <div className="relative">
      <CardLabel>Currently</CardLabel>
      <div className="mt-5 flex items-start gap-4">
        <div className="glass grid h-12 w-12 shrink-0 place-items-center rounded-xl">
          <DiamondMark className="h-7 w-7" glow />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight text-foreground sm:text-[1.7rem]">{entry.company}</h3>
          <p className="mt-1 font-mono text-[0.7rem] text-muted-foreground">
            {[entry.type, entry.period].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
      <p className="mt-5 flex items-center gap-2.5 text-sm text-foreground/85">
        <PingDot className="bg-ice" />
        {profile.current.focus}
      </p>
    </div>
  </GlowCard>
);

/**
 * About: a short personal intro with education and current role, then the
 * experience timeline, then a closing call to action.
 */
export const AboutMe = () => {
  const [lead, ...rest] = profile.about;
  const current = experience.find((e) => e.featured) ?? experience[0];

  return (
    <section id="about" className="relative py-24 sm:py-32">
      {/* soft ambient light behind the section */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-[12%] top-32 aspect-square w-[34rem] max-w-[90vw] rounded-full bg-primary/[0.08] blur-[120px]" />
        <div className="absolute -left-[16%] top-[42%] aspect-square w-[30rem] max-w-[90vw] rounded-full bg-heat/[0.05] blur-[130px]" />
        <div className="absolute -right-[10%] bottom-[10%] aspect-square w-[28rem] max-w-[90vw] rounded-full bg-ice/[0.05] blur-[130px]" />
      </div>

      <div className="container relative">
        <SectionHeading
          align="left"
          track="01"
          eyebrow="About"
          title="A path through"
          highlight="software & hardware"
        />

        {/* ---------- intro ---------- */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Rise>
              <p className="font-display text-[1.6rem] leading-[1.25] text-foreground text-pretty sm:text-[2rem] lg:text-[2.15rem]">
                {lead}
              </p>
            </Rise>
            {rest.map((para, i) => (
              <Rise key={i} delay={0.1 + i * 0.05}>
                <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                  {para}
                </p>
              </Rise>
            ))}
            <Rise delay={0.2}>
              <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <MapPin aria-hidden className="h-3.5 w-3.5 text-ice" />
                  {profile.location}
                </span>
                <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />
                <span>{profile.role}</span>
              </p>
            </Rise>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5">
            <Rise delay={0.05}>
              <EducationCard />
            </Rise>
            <Rise delay={0.15}>
              <CurrentCard entry={current} />
            </Rise>
          </div>
        </div>

        {/* ---------- experience ---------- */}
        <div className="mt-24 sm:mt-32">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-14">
            <Rise as="h3" className="font-display-tight text-[2.75rem] text-foreground sm:text-6xl">
              Experience
            </Rise>
            <Rise delay={0.1} blur={4}>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                Newest first
              </p>
            </Rise>
          </div>
          <ExperienceTimeline />
        </div>

        {/* ---------- closing CTA ---------- */}
        <Rise className="mt-20 flex flex-col gap-7 border-t border-border/60 pt-10 sm:mt-24 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-[2rem] leading-tight text-foreground sm:text-4xl">
              Want the <span className="italic text-sunset pr-[0.06em]">longer version</span>?
            </p>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              The resume has every detail, or you can just say hello.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <button type="button" onClick={() => scrollToId("contact")} className="cosmic-button group">
                Get in touch
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                />
              </button>
            </Magnetic>
            <a href={profile.resume} download className="ghost-button">
              <Download aria-hidden className="h-4 w-4" />
              Download resume
            </a>
          </div>
        </Rise>
      </div>
    </section>
  );
};
