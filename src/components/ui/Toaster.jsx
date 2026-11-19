import * as ToastPrimitive from "@radix-ui/react-toast";
import { CircleAlert, X } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { DiamondMark } from "./DiamondMark";
import { cn } from "../../lib/utils";

/**
 * Renders toasts from the use-toast store with Radix Toast.
 * Glass card with a thin sunset accent bar, slides in from the right,
 * swipe right to dismiss (follows --radix-toast-swipe-move-x).
 */

const css = `
@layer components {
  .toaster-root[data-state="open"] { animation: toaster-in 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  .toaster-root[data-state="closed"] { animation: toaster-out 0.32s cubic-bezier(0.5, 0, 0.75, 0) forwards; }
  .toaster-root[data-swipe="move"] { transform: translate3d(var(--radix-toast-swipe-move-x), 0, 0); }
  .toaster-root[data-swipe="cancel"] { transform: translate3d(0, 0, 0); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
  .toaster-root[data-swipe="end"] { animation: toaster-swipe-out 0.28s ease-out forwards; }
  @keyframes toaster-in {
    from { opacity: 0; transform: translate3d(calc(100% + 1rem), 0, 0) scale(0.96); filter: blur(6px); }
    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
  }
  @keyframes toaster-out {
    from { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
    to { opacity: 0; transform: translate3d(0, 0.5rem, 0) scale(0.95); }
  }
  @keyframes toaster-swipe-out {
    from { transform: translate3d(var(--radix-toast-swipe-end-x), 0, 0); }
    to { opacity: 0; transform: translate3d(calc(100% + 1rem), 0, 0); }
  }
}
`;

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
      <style>{css}</style>

      {toasts.map(({ id, title, description, variant, open, onOpenChange, duration }) => {
        const destructive = variant === "destructive";
        return (
          <ToastPrimitive.Root
            key={id}
            open={open}
            onOpenChange={onOpenChange}
            duration={duration}
            className={cn(
              "toaster-root group/toast pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl",
              "border bg-card/85 py-3.5 pl-5 pr-12 backdrop-blur-xl backdrop-saturate-150",
              "shadow-[inset_0_1px_0_0_hsl(var(--foreground)/0.06),0_24px_60px_-24px_hsl(233_60%_2%/0.7)]",
              "touch-pan-y select-none",
              destructive ? "border-destructive/40" : "border-border/80"
            )}
          >
            {/* accent bar */}
            <span
              aria-hidden
              className={cn("absolute inset-y-0 left-0 w-[3px]", destructive && "bg-destructive")}
              style={
                destructive
                  ? undefined
                  : {
                      backgroundImage:
                        "linear-gradient(to bottom, hsl(var(--heat)), hsl(var(--neon)) 35%, hsl(var(--primary)) 65%, hsl(var(--ice)))",
                    }
              }
            />
            {/* soft glow bleeding from the bar */}
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 w-24 opacity-60",
                destructive
                  ? "bg-gradient-to-r from-destructive/15 to-transparent"
                  : "bg-gradient-to-r from-neon/12 to-transparent"
              )}
            />

            <span
              aria-hidden
              className={cn(
                "relative mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border",
                destructive ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border/80 bg-background/40"
              )}
            >
              {destructive ? <CircleAlert className="h-4 w-4" /> : <DiamondMark className="h-[1.1rem] w-[1.1rem]" glow />}
            </span>

            <div className="relative grid min-w-0 gap-0.5 pt-0.5">
              {title && (
                <ToastPrimitive.Title className="text-sm font-medium leading-snug text-foreground">
                  {title}
                </ToastPrimitive.Title>
              )}
              {description && (
                <ToastPrimitive.Description className="text-[0.8rem] leading-relaxed text-muted-foreground">
                  {description}
                </ToastPrimitive.Description>
              )}
            </div>

            <ToastPrimitive.Close
              aria-label="Dismiss"
              className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors duration-300 hover:bg-foreground/5 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        );
      })}

      <ToastPrimitive.Viewport className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[110] m-0 flex w-[min(92vw,380px)] list-none flex-col gap-2 p-0 outline-none" />
    </ToastPrimitive.Provider>
  );
};
