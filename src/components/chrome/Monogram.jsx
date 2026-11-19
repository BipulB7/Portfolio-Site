import { DiamondMark } from "../ui/DiamondMark";
import { profile } from "../../data/content";
import { cn } from "../../lib/utils";

/**
 * Diamond mark + name in the display serif. Renders as whatever element or
 * component is passed in `as` (an <a> by default, a router Link on the 404).
 */
export const Monogram = ({ as: Component = "a", className, size = "md", ...props }) => {
  const large = size === "lg";
  return (
    <Component
      className={cn(
        "group relative inline-flex items-center gap-2.5 rounded-full outline-offset-4",
        className
      )}
      {...props}
    >
      <span className="relative grid place-items-center" aria-hidden="true">
        {/* soft neon bloom that wakes up on hover */}
        <span className="absolute inset-[-6px] rounded-full bg-[radial-gradient(circle,hsl(var(--neon)/0.35),transparent_70%)] opacity-0 blur-[2px] transition-opacity duration-700 group-hover:opacity-100" />
        <DiamondMark
          glow
          className={cn(
            "relative transition-transform duration-700 ease-out-expo group-hover:-translate-y-0.5 group-hover:scale-110",
            large ? "h-8 w-8" : "h-[1.4rem] w-[1.4rem]"
          )}
        />
      </span>
      <span
        className={cn(
          "whitespace-nowrap font-display leading-none tracking-[-0.01em] text-foreground",
          large ? "text-[1.6rem]" : "text-[1.22rem]"
        )}
      >
        {profile.firstName}{" "}
        <span className="italic text-foreground/75 transition-colors duration-500 group-hover:text-foreground">
          {profile.lastName}
        </span>
      </span>
    </Component>
  );
};
