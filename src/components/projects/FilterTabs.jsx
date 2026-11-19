import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Glass segmented control with a sliding neon-edged pill.
 * filters: [{ id, label, count }]
 */
export const FilterTabs = ({ filters, value, onChange, className }) => (
  <div
    role="group"
    aria-label="Filter projects"
    className={cn("glass inline-flex max-w-full items-center rounded-full p-1", className)}
  >
    {filters.map((f) => {
      const active = f.id === value;
      return (
        <button
          key={f.id}
          type="button"
          aria-pressed={active}
          onClick={() => onChange(f.id)}
          className={cn(
            "relative whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-300 sm:px-4 sm:text-sm",
            active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {active && (
            <motion.span
              layoutId="projects-filter-pill"
              aria-hidden
              className="absolute inset-0 rounded-full bg-background/80 shadow-[0_6px_24px_-10px_hsl(var(--neon)/0.65),inset_0_0_0_1px_hsl(var(--primary)/0.28)] dark:bg-white/[0.07]"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            >
              <span className="absolute inset-x-4 -bottom-px h-px bg-sunset opacity-90" />
            </motion.span>
          )}
          <span className="relative z-10 flex items-center gap-2">
            {f.label}
            <span
              className={cn(
                "font-mono text-[10px] tabular-nums tracking-wider transition-colors duration-300",
                active ? "text-neon" : "text-muted-foreground/70"
              )}
            >
              {pad(f.count)}
            </span>
          </span>
        </button>
      );
    })}
  </div>
);
