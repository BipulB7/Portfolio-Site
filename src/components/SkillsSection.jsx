import { useRef } from "react";
import { useInView } from "motion/react";
import { skillGroups } from "../data/content";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";
import { SkillsMarquee } from "./skills-contact/SkillsMarquee";
import { SkillCard } from "./skills-contact/SkillCard";
import { cn } from "../lib/utils";
import "./skills-contact/skills-contact.css";

/* Bento spans: md has 2 columns, lg has 3.
   md:  [AI(2)] [Backend, Frontend] [Data, Hardware] [Mechanical, Infra]
   lg:  [AI(2), Backend] [Frontend, Data, Hardware] [Mechanical, Infra(2)] */
const SPANS = {
  ai: "md:col-span-2",
  infra: "lg:col-span-2",
};
const WIDE_AT = { ai: "md", infra: "lg" };

const pad = (n) => String(n).padStart(2, "0");
const totalTools = skillGroups.reduce((n, g) => n + g.items.length, 0);

export const SkillsSection = () => {
  const ref = useRef(null);
  // Pause CSS loops (marquee, pings) while the section is far off-screen.
  const inView = useInView(ref, { margin: "240px 0px 240px 0px" });

  return (
    <section
      id="skills"
      ref={ref}
      className={cn("relative py-28 md:py-36", !inView && "sc-offscreen")}
    >
      {/* crystal lattice behind the heading */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-6 h-[34rem] bg-lattice opacity-80" />

      <div className="container relative">
        <SectionHeading
          track="03"
          eyebrow="Skills"
          title="Tools of the"
          highlight="trade"
          subtitle="From GPU servers to the browser: the stack I use across software, data, hardware and mechanical work."
        />
      </div>

      <SkillsMarquee />

      <div className="container relative mt-16 md:mt-24">
        <Reveal
          blur={false}
          y={12}
          className="mb-6 flex items-center gap-4 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground"
        >
          <span>
            <span className="text-foreground">{pad(skillGroups.length)}</span> disciplines
          </span>
          <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-border via-border/60 to-transparent" />
          <span>
            <span className="text-foreground">{totalTools}</span> tools
          </span>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal
              key={group.id}
              blur={false}
              y={36}
              delay={(i % 3) * 0.08}
              className={cn("min-w-0", SPANS[group.id])}
            >
              <SkillCard group={group} index={i} wideAt={WIDE_AT[group.id]} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
