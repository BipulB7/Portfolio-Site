import { cn } from "../../lib/utils";
import { DiamondMark } from "../ui/DiamondMark";

/** "Akash Systems" (diamond mark, ice tint) or "Personal" chip. */
export const OrgBadge = ({ project, className }) => {
  if (project.kind === "work") {
    return (
      <span
        className={cn(
          "chip border-ice/30 bg-ice/10 text-secondary-foreground dark:text-ice",
          className
        )}
      >
        <DiamondMark className="h-3.5 w-3.5" strokeWidth={2.4} />
        {project.org}
      </span>
    );
  }
  return (
    <span className={cn("chip", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_6px_hsl(var(--neon)/0.8)]" />
      {project.org}
    </span>
  );
};
