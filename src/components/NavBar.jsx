import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { navItems, profile } from "../data/content";
import { ease } from "../lib/motion";
import { lockScroll, scrollToId, scrollToTop, unlockScroll } from "../lib/scroll";
import { useIntro } from "../context/IntroContext";
import { cn } from "../lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Monogram } from "./chrome/Monogram";
import { MenuButton } from "./chrome/MenuButton";
import { MobileMenu } from "./chrome/MobileMenu";
import { useActiveSection } from "./chrome/useActiveSection";

const links = navItems.filter((item) => item.id !== "hero");
const sectionIds = navItems.map((item) => item.id);

const HIDE_AFTER = 300;
const SOLID_AFTER = 24;

const pillSpring = { type: "spring", stiffness: 380, damping: 34, mass: 0.8 };

/** Shared look of the floating glass bars (desktop pill and mobile bar). */
const barClass = (solid) =>
  cn(
    "pointer-events-auto rounded-full border backdrop-blur-xl backdrop-saturate-150",
    "transition-[background-color,border-color,box-shadow] duration-700 ease-out-expo",
    solid
      ? "border-border/80 bg-card/75 shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.06),0_18px_50px_-24px_hsl(233_60%_2%/0.7),0_8px_30px_-18px_hsl(var(--primary)/0.35)]"
      : "border-border/50 bg-card/40 shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.05)]"
  );

export const NavBar = () => {
  const { introDone, shouldPlayIntro } = useIntro();
  const { scrollY } = useScroll();
  const active = useActiveSection(sectionIds);

  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0, r: 0 });

  const flags = useRef({ hidden: false, solid: false });
  const menuButtonRef = useRef(null);

  // Hide on scroll down / reveal on scroll up. State only flips at thresholds.
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? y);
    let nextHidden = flags.current.hidden;
    if (y < HIDE_AFTER) nextHidden = false;
    else if (delta > 2) nextHidden = true;
    else if (delta < -2) nextHidden = false;

    if (nextHidden !== flags.current.hidden) {
      flags.current.hidden = nextHidden;
      setHidden(nextHidden);
    }
    const nextSolid = y > SOLID_AFTER;
    if (nextSolid !== flags.current.solid) {
      flags.current.solid = nextSolid;
      setSolid(nextSolid);
    }
  });

  const reveal = () => {
    if (flags.current.hidden) {
      flags.current.hidden = false;
      setHidden(false);
    }
  };

  /* ---------------------------- mobile menu ---------------------------- */
  const openMenu = () => {
    const rect = menuButtonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 36;
    const y = rect ? rect.top + rect.height / 2 : 36;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 8;
    setOrigin({ x, y, r });
    setMenuOpen(true);
  };

  const closeMenu = useCallback(({ restoreFocus = true } = {}) => {
    setMenuOpen(false);
    unlockScroll();
    if (restoreFocus) menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  const closeFromKeyboardOrButton = useCallback(() => closeMenu(), [closeMenu]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    lockScroll();
    // Leaving the mobile breakpoint closes the overlay
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (event) => event.matches && closeMenu({ restoreFocus: false });
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      unlockScroll();
    };
  }, [menuOpen, closeMenu]);

  /* ----------------------------- navigation ---------------------------- */
  // stopPropagation keeps Lenis' own anchor handler from scrolling a second time
  const onLinkClick = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    scrollToId(id);
  };

  const onTopClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (menuOpen) closeMenu({ restoreFocus: false });
    scrollToTop();
  };

  const onMobileNavigate = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    closeMenu({ restoreFocus: false });
    window.setTimeout(() => scrollToId(id), 220);
  };

  const monogramLabel = `${profile.firstName} ${profile.lastName}, back to top`;

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-3 md:pt-4"
        initial={{ opacity: 0, y: -28 }}
        animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -28 }}
        transition={{ duration: 1, ease: ease.outExpo, delay: shouldPlayIntro ? 0.55 : 0.2 }}
        onFocusCapture={reveal}
      >
        <motion.div
          animate={{ y: hidden && !menuOpen ? "-140%" : "0%" }}
          transition={{ duration: hidden ? 0.45 : 0.7, ease: hidden ? ease.inOutQuint : ease.outExpo }}
        >
          {/* ---------- Desktop pill ---------- */}
          <nav
            aria-label="Primary"
            className={cn(barClass(solid), "relative mx-auto hidden w-fit items-center py-1.5 pl-4 pr-1.5 md:flex")}
          >
            <Monogram href="#hero" aria-label={monogramLabel} onClick={onTopClick} />

            <span aria-hidden="true" className="mx-4 h-5 w-px bg-border lg:mx-5" />

            <LayoutGroup id="primary-nav">
              <ul className="flex items-center" onPointerLeave={() => setHovered(null)}>
                {links.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(event) => onLinkClick(event, item.id)}
                        onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(item.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "relative block rounded-full px-3.5 py-2 text-[0.85rem] leading-none tracking-[-0.005em] transition-colors duration-300 lg:px-4",
                          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <AnimatePresence>
                          {hovered === item.id && (
                            <motion.span
                              layoutId="nav-hover"
                              aria-hidden="true"
                              className="absolute inset-0 rounded-full bg-foreground/[0.045]"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, transition: { duration: 0.25 } }}
                              transition={pillSpring}
                            />
                          )}
                        </AnimatePresence>
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full bg-foreground/[0.07] shadow-[inset_0_0_0_1px_hsl(var(--foreground)/0.08),0_0_24px_-10px_hsl(var(--neon)/0.6)]"
                            transition={pillSpring}
                          >
                            {/* neon tube under the active track */}
                            <span className="absolute bottom-[3px] left-1/2 h-px w-5 -translate-x-1/2 rounded-full bg-sunset shadow-[0_0_8px_hsl(var(--neon)/0.9)]" />
                          </motion.span>
                        )}
                        <span className="relative inline-flex items-start gap-1">
                          {item.label}
                          <span
                            aria-hidden="true"
                            className={cn(
                              "-mt-1 font-mono text-[0.55rem] tracking-wider transition-colors duration-300",
                              isActive ? "text-neon" : "text-muted-foreground/60"
                            )}
                          >
                            {item.track}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>

            <span aria-hidden="true" className="mx-3 h-5 w-px bg-border lg:mx-4" />

            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group inline-flex items-center gap-1 rounded-full border border-border/80 bg-card/40 py-1.5 pl-3.5 pr-2.5 text-[0.8rem] text-foreground/85",
                  "transition-[border-color,background-color,color,box-shadow] duration-500 ease-out-expo",
                  "hover:border-primary/50 hover:bg-primary/10 hover:text-foreground hover:shadow-[0_0_20px_-8px_hsl(var(--primary)/0.7)]"
                )}
              >
                Resume
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.7}
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-px group-hover:translate-x-px"
                />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            {/* sunset hairline that lights up once the page has scrolled */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -bottom-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-sunset mask-fade-x transition-opacity duration-700",
                solid ? "opacity-70" : "opacity-0"
              )}
            />
          </nav>

          {/* ---------- Mobile bar ---------- */}
          <div className={cn(barClass(solid), "flex items-center justify-between py-1.5 pl-4 pr-1.5 md:hidden")}>
            <Monogram href="#hero" aria-label={monogramLabel} onClick={onTopClick} />
            <MenuButton ref={menuButtonRef} open={menuOpen} onClick={menuOpen ? closeFromKeyboardOrButton : openMenu} />
          </div>
        </motion.div>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        origin={origin}
        links={links}
        active={active}
        onClose={closeFromKeyboardOrButton}
        onNavigate={onMobileNavigate}
        onTop={onTopClick}
      />
    </>
  );
};
