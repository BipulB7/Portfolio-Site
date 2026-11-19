import { motion } from "motion/react";
import { rise } from "./variants";

/**
 * "Scroll" label over a short line with a glowing dot travelling down it.
 * `style` lets the hero fade it out as soon as scrolling starts.
 */
export const ScrollCue = ({ show, onClick, style }) => (
  <motion.div
    style={style}
    className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 sm:block [@media(max-height:640px)]:hidden"
  >
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Scroll to the About section"
      initial="hidden"
      animate={show ? "show" : "hidden"}
      variants={rise(1.65, { y: 10, blur: 4 })}
      className="group flex flex-col items-center gap-3 rounded-full px-3 py-2"
    >
      <span className="pl-[0.35em] font-mono text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
        Scroll
      </span>
      <span aria-hidden className="relative flex h-12 w-3 justify-center">
        <span className="h-full w-px bg-gradient-to-b from-foreground/35 via-foreground/15 to-transparent" />
        <motion.span
          className="absolute left-1/2 top-0 -ml-[3px] h-1.5 w-1.5 rounded-full bg-ice shadow-[0_0_10px_2px_hsl(var(--ice)/0.7)]"
          initial={{ transform: "translateY(0px)", opacity: 0 }}
          animate={{ transform: ["translateY(0px)", "translateY(42px)"], opacity: [0, 1, 1, 0] }}
          transition={{
            transform: { duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] },
            opacity: { duration: 2.2, repeat: Infinity, times: [0, 0.2, 0.75, 1] },
          }}
        />
      </span>
    </motion.button>
  </motion.div>
);
