import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion, useInView } from "motion/react";
import { Github } from "lucide-react";
import { projects, socials } from "../data/content";
import { ease, viewport } from "../lib/motion";
import { SectionHeading } from "./ui/SectionHeading";
import { Magnetic } from "./ui/Magnetic";
import { FilterTabs } from "./projects/FilterTabs";
import { ProjectCard } from "./projects/ProjectCard";
import { ProjectModal } from "./projects/ProjectModal";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "work", label: "Akash Systems" },
  { id: "personal", label: "Personal" },
];

const GITHUB_URL = socials.find((s) => s.icon === "github")?.href ?? "https://github.com/BipulB7";

/**
 * Bento footprint per filter, chosen so every row fills:
 *  all (8):      lg  [2+1] [1 1 1] [1 1 1]     md  4 rows of 2
 *  work (5):     lg  [2+1] [1 1 1]             md  [2] [1 1] [1 1]
 *  personal (3): lg  [1 1 1]                   md  [2] [1 1]
 * tallLg gives the featured card's row-mate the same cover height.
 */
const spansFor = (filter, i) => {
  if (filter === "personal") return { lgSpan: false, mdSpan: i === 0, tallLg: false };
  return { lgSpan: i === 0, mdSpan: filter === "work" && i === 0, tallLg: i === 1 };
};

export const ProjectsSection = () => {
  const [filter, setFilter] = useState("all");
  const [hasFiltered, setHasFiltered] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const triggerRef = useRef(null);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.05 });

  const filters = useMemo(
    () =>
      FILTERS.map((f) => ({
        ...f,
        count: f.id === "all" ? projects.length : projects.filter((p) => p.kind === f.id).length,
      })),
    []
  );

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.kind === filter)),
    [filter]
  );

  const selectedIndex = projects.findIndex((p) => p.id === selectedId);
  const selected = selectedIndex >= 0 ? projects[selectedIndex] : null;

  const changeFilter = (id) => {
    if (id === filter) return;
    setHasFiltered(true);
    setFilter(id);
  };

  const openProject = useCallback((id, trigger) => {
    triggerRef.current = trigger;
    setSelectedId(id);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedId(null);
    const trigger = triggerRef.current;
    if (trigger) requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
  }, []);

  return (
    <section id="projects" className="relative isolate py-28 md:py-36">
      {/* quiet atmosphere: crystal lattice + violet bloom */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-[560px] bg-lattice opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[620px] w-[min(1100px,92vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.13),hsl(var(--neon)/0.05)_55%,transparent)]"
      />

      <div className="container">
        <div className="mb-12 flex flex-col gap-8 md:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <SectionHeading
            track="02"
            eyebrow="Work"
            title="Selected"
            highlight="projects"
            subtitle="Recent work at Akash Systems, described at a high level, plus things I've built on my own."
            align="left"
            className="mb-0 md:mb-0"
          />
          <motion.div
            className="shrink-0 lg:pb-1"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.9, delay: 0.45, ease: ease.outExpo }}
          >
            <FilterTabs filters={filters} value={filter} onChange={changeFilter} />
          </motion.div>
        </div>

        <LayoutGroup id="projects">
          <ul ref={gridRef} role="list" className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  index={i}
                  spans={spansFor(filter, i)}
                  inView={gridInView}
                  quick={hasFiltered}
                  onOpen={openProject}
                />
              ))}
            </AnimatePresence>
          </ul>

          <motion.div layout="position" className="mt-16 flex justify-center">
            <Magnetic>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="cosmic-button">
                <Github className="h-4 w-4" aria-hidden />
                More on GitHub
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Magnetic>
          </motion.div>

          {typeof document !== "undefined" &&
            createPortal(
              <AnimatePresence>
                {selected && (
                  <ProjectModal
                    key={selected.id}
                    project={selected}
                    number={selectedIndex + 1}
                    total={projects.length}
                    onClose={closeProject}
                  />
                )}
              </AnimatePresence>,
              document.body
            )}
        </LayoutGroup>
      </div>
    </section>
  );
};
