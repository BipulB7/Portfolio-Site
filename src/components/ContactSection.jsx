import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import emailjs from "@emailjs/browser";
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { profile, socials } from "../data/content";
import { useToast } from "../hooks/use-toast";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";
import { Magnetic } from "./ui/Magnetic";
import { DiamondMark } from "./ui/DiamondMark";
import { FloatingField } from "./skills-contact/FloatingField";
import { LocalTimeCard } from "./skills-contact/LocalTimeCard";
import { cn } from "../lib/utils";
import { ease } from "../lib/motion";
import "./skills-contact/skills-contact.css";

const SOCIAL_ICONS = { linkedin: Linkedin, github: Github, instagram: Instagram };

const TILE = {
  neon: "text-neon border-neon/30 bg-neon/10 group-hover/row:shadow-[0_0_24px_-6px_hsl(var(--neon)/0.8)]",
  ice: "text-ice border-ice/30 bg-ice/10 group-hover/row:shadow-[0_0_24px_-6px_hsl(var(--ice)/0.8)]",
  heat: "text-heat border-heat/30 bg-heat/10 group-hover/row:shadow-[0_0_24px_-6px_hsl(var(--heat)/0.8)]",
};

const IconTile = ({ icon: Icon, tone }) => (
  <span
    className={cn(
      "grid h-11 w-11 shrink-0 place-items-center rounded-xl border backdrop-blur-md transition-shadow duration-500",
      TILE[tone]
    )}
  >
    <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.6} aria-hidden />
  </span>
);

const RowLabel = ({ children }) => (
  <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground">{children}</p>
);

const swap = {
  initial: { opacity: 0, y: 14, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: ease.outExpo } },
  exit: { opacity: 0, y: -14, filter: "blur(4px)", transition: { duration: 0.25, ease: ease.outQuart } },
};

export const ContactSection = () => {
  const { toast } = useToast();
  const formRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { margin: "240px 0px 240px 0px" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [copied, setCopied] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      later(() => setCopied(false), 1800);
      toast({ title: "Email copied", description: `${profile.email} is on your clipboard.` });
    } catch {
      toast({
        title: "Couldn't copy",
        description: `Your browser blocked the clipboard. The address is ${profile.email}.`,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");

    emailjs.sendForm("service_i0avfq9", "template_qtnp7vd", formRef.current, "6TfPOFtk2k8xG9t6F").then(
      () => {
        toast({
          title: "Message sent",
          description: "Thanks for reaching out. I'll get back to you soon.",
        });
        formRef.current?.reset();
        setStatus("sent");
        later(() => setStatus("idle"), 2500);
      },
      (error) => {
        toast({
          title: "Couldn't send",
          description: "Please try again or email me directly.",
          variant: "destructive",
        });
        console.error("EmailJS error:", error);
        setStatus("idle");
      }
    );
  };

  const busy = status !== "idle";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={cn("relative isolate overflow-hidden py-28 md:py-36", !inView && "sc-offscreen")}
    >
      {/* low sunset glow that hands off to the footer horizon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[26rem] bg-[radial-gradient(50%_55%_at_50%_75%,hsl(var(--neon)/0.08),hsl(var(--primary)/0.05)_45%,transparent_75%)] [mask-image:linear-gradient(to_bottom,transparent,#000_35%,#000_70%,transparent)]"
      />

      <div className="container relative">
        <SectionHeading
          track="04"
          eyebrow="Contact"
          title="Let's build"
          highlight="something"
          subtitle="Have a role, a project or a hard problem in mind? I'm always open to talking about new opportunities."
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          {/* ---------------- Info column ---------------- */}
          <div className="flex min-w-0 flex-col gap-9 lg:col-span-2">
            <Reveal blur={false} y={24}>
              <ul className="divide-y divide-border/60 border-y border-border/60">
                <li className="group/row flex items-center gap-4 py-5">
                  <IconTile icon={Mail} tone="neon" />
                  <div className="min-w-0 flex-1">
                    <RowLabel>Email</RowLabel>
                    <a
                      href={`mailto:${profile.email}`}
                      className="mt-1 block truncate text-[1.05rem] leading-snug tracking-[-0.005em] md:text-lg text-foreground transition-colors duration-300 hover:text-primary"
                    >
                      {profile.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={copied ? "Email copied" : "Copy email address"}
                    title="Copy email"
                    className={cn(
                      "relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-card/40 text-muted-foreground backdrop-blur-md",
                      "transition-[color,border-color,box-shadow] duration-300 hover:border-neon/50 hover:text-foreground hover:shadow-[0_0_18px_-4px_hsl(var(--neon)/0.6)]",
                      copied && "border-ice/60 text-ice"
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={copied ? "done" : "copy"}
                        initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
                        transition={{ duration: 0.3, ease: ease.outExpo }}
                        className="grid place-items-center"
                      >
                        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </li>

                <li className="group/row flex items-center gap-4 py-5">
                  <IconTile icon={Phone} tone="ice" />
                  <div className="min-w-0 flex-1">
                    <RowLabel>Phone</RowLabel>
                    <a
                      href={profile.phoneHref}
                      className="mt-1 inline-flex items-center gap-2 tabular-nums text-[1.05rem] leading-snug tracking-[-0.005em] md:text-lg text-foreground transition-colors duration-300 hover:text-primary"
                    >
                      {profile.phone}
                      <ArrowUpRight
                        aria-hidden
                        className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-500 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:opacity-100"
                      />
                    </a>
                  </div>
                </li>

                <li className="group/row flex items-center gap-4 py-5">
                  <IconTile icon={MapPin} tone="heat" />
                  <div className="min-w-0 flex-1">
                    <RowLabel>Location</RowLabel>
                    <p className="mt-1 text-[1.05rem] leading-snug tracking-[-0.005em] md:text-lg text-foreground">
                      {profile.location}
                    </p>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal blur={false} y={24} delay={0.08}>
              <RowLabel>Elsewhere</RowLabel>
              <ul className="mt-3 flex flex-wrap gap-2">
                {socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.icon] ?? ArrowUpRight;
                  return (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group/social chroma-hover inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/40 px-3.5 py-2 text-sm text-foreground backdrop-blur-md",
                          "transition-[border-color,box-shadow,background-color] duration-500 hover:border-neon/50 hover:bg-neon/[0.06] hover:shadow-[0_0_22px_-6px_hsl(var(--neon)/0.6)]"
                        )}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover/social:text-neon" aria-hidden />
                        {s.name}
                        <ArrowUpRight
                          aria-hidden
                          className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-500 group-hover/social:-translate-y-0.5 group-hover/social:translate-x-0.5"
                        />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal blur={false} y={24} delay={0.16}>
              <LocalTimeCard />
            </Reveal>
          </div>

          {/* ---------------- Form card ---------------- */}
          <Reveal blur={false} y={40} delay={0.1} className="min-w-0 lg:col-span-3">
            <div className="glass gradient-border relative flex h-full flex-col overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10">
              {/* sending scan line */}
              <AnimatePresence>
                {status === "sending" && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-8 top-0 h-px overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="sc-scan absolute inset-y-0 left-0 w-1/3 bg-sunset" />
                  </motion.span>
                )}
              </AnimatePresence>
              {/* soft corner glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 -z-10 h-64 w-64 rounded-full bg-neon/10 blur-3xl"
              />

              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-display text-[2.1rem] leading-[1.05] tracking-[-0.01em] md:text-[2.6rem]">
                    Send a <span className="italic text-sunset pr-[0.06em]">message</span>
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">
                    A few lines is plenty. It goes straight to my inbox.
                  </p>
                </div>
                <DiamondMark className="mt-1 h-9 w-9 shrink-0 animate-float-slow" glow />
              </div>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                aria-busy={status === "sending"}
                className="mt-8 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 md:gap-5 lg:grid-rows-[auto_1fr_auto]"
              >
                <FloatingField id="contact-name" name="name" label="Your name" autoComplete="name" required />
                <FloatingField
                  id="contact-email"
                  name="email"
                  type="email"
                  label="Email address"
                  autoComplete="email"
                  required
                />
                <FloatingField
                  id="contact-message"
                  name="message"
                  label="What are you working on?"
                  multiline
                  rows={6}
                  required
                  className="sm:col-span-2"
                  inputClassName="lg:h-full"
                />

                <div className="mt-2 flex flex-col-reverse items-stretch gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground">
                    All fields required
                  </p>
                  <Magnetic strength={0.25} className="block w-full sm:inline-block sm:w-auto">
                    <button
                      type="submit"
                      aria-disabled={busy}
                      className="cosmic-button h-12 w-full sm:w-auto sm:min-w-[12.5rem]"
                      style={
                        status === "sent"
                          ? {
                              boxShadow:
                                "0 0 0 1px hsl(var(--ice) / 0.55), 0 14px 40px -12px hsl(var(--ice) / 0.75), inset 0 1px 0 hsl(0 0% 100% / 0.3)",
                            }
                          : undefined
                      }
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={status} {...swap} className="inline-flex items-center gap-2">
                          {status === "idle" && (
                            <>
                              Send message
                              <Send className="h-4 w-4" aria-hidden />
                            </>
                          )}
                          {status === "sending" && (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                              Sending...
                            </>
                          )}
                          {status === "sent" && (
                            <>
                              <Check className="h-4 w-4" aria-hidden />
                              Sent
                            </>
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </Magnetic>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
