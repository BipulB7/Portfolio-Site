import { ArrowUpRight, Github, Instagram, Linkedin } from "lucide-react";
import { socials } from "../../data/content";
import { cn } from "../../lib/utils";

const ICONS = { github: Github, linkedin: Linkedin, instagram: Instagram };

/**
 * Round icon buttons for the profiles in content.js. On hover the glyph gets
 * a VHS-style RGB split (the icon equivalent of the chroma-hover utility).
 */
export const SocialLinks = ({ className, buttonClassName }) => (
  <ul className={cn("flex items-center gap-2.5", className)}>
    {socials.map((social) => {
      const Icon = ICONS[social.icon] ?? ArrowUpRight;
      return (
        <li key={social.name}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${social.name} (opens in a new tab)`}
            title={social.name}
            className={cn(
              "group grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card/40 text-muted-foreground",
              "transition-[color,border-color,background-color,box-shadow,transform] duration-500 ease-out-expo",
              "hover:-translate-y-0.5 hover:border-neon/45 hover:bg-card/70 hover:text-foreground",
              "hover:shadow-[0_0_22px_-6px_hsl(var(--neon)/0.65)]",
              buttonClassName
            )}
          >
            <Icon
              aria-hidden="true"
              strokeWidth={1.6}
              className="h-[1.05rem] w-[1.05rem] transition-[filter] duration-300 group-hover:[filter:drop-shadow(-1.5px_0_hsl(var(--neon)/0.85))_drop-shadow(1.5px_0_hsl(var(--ice)/0.85))]"
            />
          </a>
        </li>
      );
    })}
  </ul>
);
