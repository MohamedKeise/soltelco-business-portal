// apps/web/src/pages/marketing/Roles/Reseller/ResellerPage.tsx
import { Link } from "react-router-dom";
import { motion, useInView, type Variants } from "framer-motion";
import { useMemo, useRef, useState } from "react";

// Assets (you already created these)
import smsLight from "../../../../assets/marketing/reseller-api-sms-light.png";
import smsDark from "../../../../assets/marketing/reseller-api-sms-dark.png";

import allocationLight from "../../../../assets/marketing/reseller-bundles-allocation-light.png";
import allocationDark from "../../../../assets/marketing/reseller-bundles-allocation-dark.png";

import dashboardLight from "../../../../assets/marketing/reseller-dashboard-light.png";
import dashboardDark from "../../../../assets/marketing/reseller-dashboard-dark.png";

// If you later add a 4th pair, plug it here:
// import growthLight from "../../../../assets/marketing/reseller-growth-light.png";
// import growthDark from "../../../../assets/marketing/reseller-growth-dark.png";

const easing = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easing } },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: easing } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function useOnceInView() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  return { ref, inView };
}

function AnimatedInView({
  children,
  className = "",
  variant = "fadeUp",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "fadeUp" | "fade" | "pop";
  delay?: number;
}) {
  const { ref, inView } = useOnceInView();

  const base = useMemo(() => {
    if (variant === "fade") return fade;
    if (variant === "pop") return pop;
    return fadeUp;
  }, [variant]);

  const v: Variants = useMemo(
    () => ({
      hidden: base.hidden,
      show: {
        ...(base.show as object),
        transition: { ...(((base.show as any)?.transition ?? {}) as object), delay },
      },
    }),
    [base, delay]
  );

  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={inView ? "show" : "hidden"} variants={v}>
      {children}
    </motion.div>
  );
}

function GlassCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[28px] border",
        "border-slate-200/70 dark:border-slate-800/55",
        "bg-white/70 dark:bg-slate-950/35 backdrop-blur-xl",
        "shadow-[0_30px_80px_-40px_rgba(2,6,23,0.25)] dark:shadow-[0_30px_100px_-55px_rgba(0,0,0,0.7)]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.9] dark:opacity-[0.85]">
        <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5" />
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}

function ImageSwitch({
  lightSrc,
  darkSrc,
  alt,
  className = "",
}: {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={["relative w-full aspect-[16/10] overflow-hidden rounded-3xl", className].join(" ")}>
      <img 
        src={lightSrc} 
        alt={alt} 
        className="block w-full h-full object-cover dark:hidden" 
        loading="lazy" 
      />
      <img 
        src={darkSrc} 
        alt={alt} 
        className="hidden w-full h-full object-cover dark:block" 
        loading="lazy" 
      />
    </div>
  );
}

function Pill({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/60 bg-white/55 dark:bg-slate-950/25 backdrop-blur-xl px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
        <span className="text-xs font-black tracking-wide text-slate-600 dark:text-slate-300 uppercase">{title}</span>
      </div>
      <div className="mt-1 text-base font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function Step({
  n,
  title,
  desc,
  icon,
}: {
  n: string;
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <motion.div 
      variants={fadeUp}
      className="group relative overflow-hidden rounded-3xl p-0.5 bg-gradient-to-br from-primary/30 via-fuchsia-500/20 to-transparent shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Main card */}
      <div className="relative z-10 h-full rounded-[calc(1.5rem-1px)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6">
        <div className="flex items-start gap-5">
          {/* Step number with animated gradient circle */}
          <div className="relative flex-shrink-0">
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-fuchsia-500 text-white font-black text-xl shadow-lg shadow-primary/20">
              <span className="relative z-10">{n}</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Icon badge */}
            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-white dark:border-slate-900 shadow-md group-hover:scale-110 transition-transform duration-300">
              <span className="text-primary text-sm material-symbols-outlined">{icon}</span>
            </div>
            
            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-2xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              {desc}
            </p>
            
            {/* Learn more link */}
            <div className="mt-4">
              <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-fuchsia-600 transition-colors">
                <span>Learn more</span>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress connector (except for last step) */}
        {n !== '03' && (
          <div className="absolute -bottom-6 left-[52px] h-6 w-0.5 bg-gradient-to-b from-primary/20 via-fuchsia-500/20 to-transparent" />
        )}
        
        {/* Decorative elements */}
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-fuchsia-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </motion.div>
  );
}

function FeatureChip({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 backdrop-blur-xl">
      <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{text}</span>
    </div>
  );
}

type Showcase = {
  id: "sms" | "alloc" | "dash" | "ops";
  title: string;
  subtitle: string;
  light: string;
  dark: string;
  highlights: string[];
  accent: string; // gradient tailwind string
};

function ResellerSidePanel() {
  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative h-full">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 backdrop-blur-xl shadow-lg">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5" />
          </div>
          
          <div className="relative p-6">
            <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-500">
              Why Choose Our Platform?
            </h3>
            
            <div className="mt-6 space-y-4">
              {[
                "Real-time SMS delivery tracking",
                "Automated billing & invoicing",
                "24/7 dedicated support",
                "White-label branding options"
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                  <span className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/60 dark:bg-slate-900/30 p-4 text-center">
                <div className="text-2xl font-black text-primary">10K+</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Resellers
                </div>
              </div>
              <div className="rounded-2xl bg-white/60 dark:bg-slate-900/30 p-4 text-center">
                <div className="text-2xl font-black text-primary">4.9</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Rating
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800/50">
              <Link
                to="/contact"
                className="block w-full text-center px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-fuchsia-500 text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                Get Started Now
              </Link>
              <p className="mt-3 text-xs text-center text-slate-500 dark:text-slate-400">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResellerPage() {
  const showcase: Showcase[] = useMemo(
    () => [
      {
        id: "sms",
        title: "SMS API Gateway",
        subtitle: "OTP, alerts, and transactional messaging with clean logs and delivery status.",
        light: smsLight,
        dark: smsDark,
        highlights: ["API keys and secure auth", "Delivery tracking and retries", "Message logs for teams"],
        accent: "from-[#9a4bad] to-[#ba56d4]",
      },
      {
        id: "alloc",
        title: "Bundles Allocation",
        subtitle: "Sell and allocate bundles to customers with a simple, guided flow.",
        light: allocationLight,
        dark: allocationDark,
        highlights: ["Sell bundles confidently", "Allocate to groups or customers", "Clear status and actions"],
        accent: "from-[#4b6cb7] to-[#8a46d4]",
      },
      {
        id: "dash",
        title: "Reseller Dashboard",
        subtitle: "Track usage, balance, clients, and active bundles with clarity-first UI.",
        light: dashboardLight,
        dark: dashboardDark,
        highlights: ["Usage snapshots", "Clients list and status", "Balance movement visibility"],
        accent: "from-[#6a11cb] to-[#2575fc]",
      },
      {
        // 4th tile, we reuse dashboard assets but present it as Ops.
        // When you add a 4th real pair later, replace light/dark here.
        id: "ops",
        title: "Operations Control",
        subtitle: "Fast actions, fewer mistakes, and predictable flows for daily selling.",
        light: dashboardLight,
        dark: dashboardDark,
        highlights: ["Quick actions for teams", "Readable data blocks", "Consistency across devices"],
        accent: "from-[#ff4d8d] to-[#8b5cf6]",
      },
    ],
    []
  );

  const [active, setActive] = useState<Showcase["id"]>("sms");
  const activeCard = showcase.find((s) => s.id === active) ?? showcase[0];

  return (
    <main className="w-full overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      {/* HERO */}
      <section className="relative px-4 pt-14 pb-14 md:pt-16 md:pb-16 lg:px-12 xl:px-40">
        {/* ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 left-1/2 -translate-x-1/2 h-[680px] w-[680px] rounded-full bg-primary/15 blur-3xl"
            animate={{ y: [0, 16, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 8, repeat: Infinity, ease: easing }}
          />
          <motion.div
            className="absolute top-24 left-[-40px] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl"
            animate={{ x: [0, 18, 0], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 10, repeat: Infinity, ease: easing }}
          />
          <motion.div
            className="absolute top-40 right-[-60px] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
            animate={{ x: [0, -16, 0], opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 11, repeat: Infinity, ease: easing }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/70 dark:to-slate-950/70" />
        </div>

        <div className="relative mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Story */}
            <motion.div className="lg:col-span-6" initial="hidden" animate="show" variants={container}>
              <motion.div variants={pop}>
                <GlassCard className="p-7 md:p-9">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider border border-primary/15">
                      <span className="material-symbols-outlined text-[16px]">storefront</span>
                      Reseller
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-950/25 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800/60 text-xs font-black text-slate-700 dark:text-slate-200">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                      Sell bundles with confidence
                    </div>
                  </div>

                  <motion.h1 variants={fadeUp} className="mt-5 text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
                    Start selling.
                    <br />
                    Keep it simple.
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-500">
                      Scale like a pro.
                    </span>
                  </motion.h1>

                  <motion.p variants={fadeUp} className="mt-5 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    Soltelco Reseller tools help you sell bundles and send messages using SMS API. Designed for fast daily work, clean
                    flows, and a dashboard that is easy to trust.
                  </motion.p>

                  <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
                    <Link
                      to="/contact"
                      className="group inline-flex items-center justify-center rounded-2xl h-12 px-6 bg-primary text-white text-sm md:text-base font-black shadow-xl shadow-primary/25 hover:opacity-95 transition"
                    >
                      Talk to Sales
                      <span className="material-symbols-outlined text-[18px] ml-2 transition-transform group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </Link>

                    <Link
                      to="/solutions"
                      className="inline-flex items-center justify-center rounded-2xl h-12 px-6 bg-white/70 dark:bg-slate-950/25 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800/60 text-slate-900 dark:text-white text-sm md:text-base font-black hover:bg-white/90 dark:hover:bg-slate-900/35 transition"
                    >
                      Explore Solutions
                    </Link>
                  </motion.div>

                  <motion.div variants={fadeUp} className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Pill icon="bolt" title="Speed" value="Quick daily actions" />
                    <Pill icon="shield" title="Trust" value="Clear logs and status" />
                    <Pill icon="insights" title="Clarity" value="Readable dashboards" />
                  </motion.div>

                  <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-2">
                    <FeatureChip text="SMS API Gateway access" />
                    <FeatureChip text="All bundles reselling" />
                    <FeatureChip text="Allocation to customers" />
                    <FeatureChip text="Dashboard tracking" />
                  </motion.div>
                </GlassCard>
              </motion.div>
            </motion.div>

            {/* Right: Interactive Showcase (new design, not like other pages) */}
            <motion.div className="lg:col-span-6" initial="hidden" animate="show" variants={container}>
              <motion.div variants={pop}>
                <GlassCard className="p-6 md:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Live preview
                      </div>
                      <div className="mt-1 text-lg md:text-xl font-black">See the reseller experience</div>
                    </div>

                  </div>

                  {/* Tabs */}
                  <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {showcase.map((s) => {
                      const isActive = s.id === active;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setActive(s.id)}
                          className={[
                            "relative rounded-2xl px-3 py-3 text-left transition",
                            "border bg-white/55 dark:bg-slate-950/25 backdrop-blur-xl",
                            isActive
                              ? "border-transparent shadow-lg"
                              : "border-slate-200/70 dark:border-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-900/35",
                          ].join(" ")}
                        >
                          {isActive && (
                            <div className="pointer-events-none absolute inset-0 rounded-2xl p-[1px]">
                              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${s.accent} opacity-60`} />
                              <div className="absolute inset-[1px] rounded-2xl bg-white/70 dark:bg-slate-950/35" />
                            </div>
                          )}
                          <div className="relative">
                            <div className="text-xs font-black text-slate-700 dark:text-slate-200">{s.title}</div>
                            <div className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                              {s.id === "sms" && "API, OTP, logs"}
                              {s.id === "alloc" && "Sell and allocate"}
                              {s.id === "dash" && "Usage and clients"}
                              {s.id === "ops" && "Daily operations"}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Showcase Canvas */}
                  <div className="mt-5">
                    <motion.div
                      key={activeCard.id}
                      initial={{ opacity: 0, y: 10, scale: 0.995 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.55, ease: easing }}
                      className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/55 dark:bg-slate-950/25 backdrop-blur-xl"
                    >
                      <div className="pointer-events-none absolute inset-0">
                        <div className={`absolute -top-28 -right-24 h-72 w-72 rounded-full bg-gradient-to-br ${activeCard.accent} opacity-15 blur-3xl`} />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60 dark:to-slate-950/55" />
                      </div>

                      <div className="relative p-5 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-xl md:text-2xl font-black">{activeCard.title}</div>
                            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {activeCard.subtitle}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              to="/contact"
                              className="inline-flex items-center justify-center gap-2 rounded-2xl h-11 px-5 bg-primary text-white text-sm font-black shadow-xl shadow-primary/25 hover:opacity-95 transition"
                            >
                              Request demo
                              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </Link>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-4">
                          {/* Vertical stack of image and highlights card */}
                          <div className="w-full space-y-4">
                            {/* Image container */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, ease: easing, delay: 0.1 }}
                              className="relative"
                            >
                              <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5" />
                                <ImageSwitch
                                  lightSrc={activeCard.light}
                                  darkSrc={activeCard.dark}
                                  alt={activeCard.title}
                                />
                              </div>
                            </motion.div>

                            {/* Highlights card */}
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, ease: easing, delay: 0.2 }}
                              className="rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 backdrop-blur-xl p-5"
                            >
                              <div className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                                Highlights
                              </div>

                              <div className="mt-3 space-y-3">
                                {activeCard.highlights.map((h, i) => (
                                  <motion.div
                                    key={h}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.45, ease: easing, delay: 0.06 * i }}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="material-symbols-outlined text-primary text-[18px] mt-[1px]">
                                      check_circle
                                    </span>
                                    <span className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{h}</span>
                                  </motion.div>
                                ))}
                              </div>

                              <div className="mt-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 p-4">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-black">Built for resellers</div>
                                  <div className="inline-flex items-center gap-1 text-xs font-black text-primary">
                                    <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                                    Reliable
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                  Customer-facing, simple wording, fast actions, consistent flows.
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Small animated “signal” */}
                        <motion.div
                          className="mt-5 flex flex-wrap gap-2"
                          initial="hidden"
                          animate="show"
                          variants={container}
                        >
                          {["Fast selling flow", "Clear status", "Clean logs", "Easy to train staff"].map((t, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * i, duration: 0.4, ease: "easeOut" }}
                              variants={fade}
                              className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-slate-200/70 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl hover:shadow-md transition-all duration-200 hover:border-primary/40 dark:hover:border-primary/50"
                            >
                              <span className="material-symbols-outlined text-primary text-[16px]">workspace_premium</span>
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Premium Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 h-[1200px] w-[1200px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 h-[1200px] w-[1200px] rounded-full bg-gradient-to-tr from-fuchsia-500/5 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2lpdHk9IjAuMDIiPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgeD0iMCIgeT0iMCIgcng9IjMiPjwvcmVjdD48L2c+PC9nPjwvc3ZnPg==')] opacity-10 dark:opacity-5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <AnimatedInView>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 via-fuchsia-500/10 to-primary/10 text-primary text-xs font-black tracking-wider border border-primary/10 dark:border-white/5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                TRANSFORM YOUR BUSINESS
              </div>
              <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                The Complete Reseller
                <span className="block bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">Success Platform</span>
              </h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Join thousands of successful resellers who've scaled their business with our powerful platform. 
                <span className="font-medium text-slate-800 dark:text-slate-200">Start your journey today.</span>
              </p>
            </AnimatedInView>
          </div>

          <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column - Steps */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-120px" }} 
                variants={container} 
                className="relative space-y-8"
              >
                <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block" />
                
                <Step
                  n="01"
                  icon="rocket_launch"
                  title="Create your reseller setup"
                  desc="Get onboarded with our dedicated support team, configure your account settings, and set up team roles with granular permissions for complete control over your business operations."
                />
                
                <Step
                  n="02"
                  icon="shopping_cart"
                  title="Pick bundles, then allocate or sell"
                  desc="Choose from our wide range of high-quality bundles, sell directly to end customers, or allocate to your business clients with just a few clicks through our intuitive interface."
                />
                
                <Step
                  n="03"
                  icon="insights"
                  title="Track clients, usage, and outcomes"
                  desc="Monitor your business performance with real-time analytics, track customer usage patterns, and make data-driven decisions to optimize your sales strategy and maximize profits."
                />
              </motion.div>
              
              <div className="mt-12 text-center lg:text-left">
                <Link 
                  to="/pricing" 
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 bg-gradient-to-r from-primary to-fuchsia-500 text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span>Get Started Now</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No credit card required • 14-day free trial</p>
              </div>
            </div>
            
            {/* Right Column - Visuals */}
            <div className="lg:col-span-5 sticky top-28">
              <AnimatedInView className="space-y-8">
                {/* Stats Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/80 dark:to-slate-900/90 p-6 shadow-xl border border-slate-200/70 dark:border-slate-800/50">
                  <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/5 blur-2xl" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Why resellers love us</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">
                    Join thousands of successful resellers growing their business with our platform
                  </p>
                  
                  <div className="mt-6 space-y-4">
                    {[
                      { icon: 'trending_up', value: '4.9/5', label: 'Average Rating' },
                      { icon: 'groups', value: '10K+', label: 'Active Resellers' },
                      { icon: 'rocket_launch', value: '24/7', label: 'Support' },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Testimonial */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 to-fuchsia-500/5 p-6 border border-slate-200/70 dark:border-slate-800/50">
                  <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-fuchsia-500/5 blur-2xl" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-lg">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Sahra Jaamac</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Reseller since 2022</div>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-700 dark:text-slate-300 italic">
                    "This platform transformed our business. The tools are intuitive and the support is exceptional. We've seen a 3x increase in sales!"
                  </p>
                  <div className="mt-4 flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[20px]">star</span>
                    ))}
                  </div>
                </div>
              </AnimatedInView>
            </div>

            <div className="lg:col-span-7">
              <AnimatedInView variant="pop" className="h-full">
                <div className="relative h-full rounded-[32px] border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 backdrop-blur-xl overflow-hidden">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60 dark:to-slate-950/55" />
                  </div>

                  <div className="relative p-6 md:p-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                          Quick preview
                        </div>
                        <div className="mt-1 text-xl md:text-2xl font-black">Your reseller workspace</div>
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/60 dark:bg-slate-950/25 border border-slate-200/70 dark:border-slate-800/60">
                        <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200">Customer-ready</span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 overflow-hidden">
                        <div className="p-4">
                          <div className="text-sm font-black">SMS API</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                            OTP and notifications, with logs and delivery status.
                          </div>
                        </div>
                        <div className="px-4 pb-4">
                          <ImageSwitch lightSrc={smsLight} darkSrc={smsDark} alt="SMS API" className="rounded-2xl overflow-hidden" />
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 overflow-hidden">
                        <div className="p-4">
                          <div className="text-sm font-black">Allocation</div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                            Bundle selling and customer allocation flow.
                          </div>
                        </div>
                        <div className="px-4 pb-4">
                          <ImageSwitch
                            lightSrc={allocationLight}
                            darkSrc={allocationDark}
                            alt="Bundle Allocation"
                            className="rounded-2xl overflow-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 overflow-hidden">
                      <div className="p-4">
                        <div className="text-sm font-black">Dashboard</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          Usage, active bundles, reseller balance, and clients.
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <ImageSwitch
                          lightSrc={dashboardLight}
                          darkSrc={dashboardDark}
                          alt="Reseller Dashboard"
                          className="rounded-2xl overflow-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedInView>
            </div>

            <div className="lg:col-span-5">
              <ResellerSidePanel />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 lg:px-12 xl:px-40">
        <div className="mx-auto max-w-[1200px]">
          <AnimatedInView variant="pop">
            <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/30 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-primary/25 to-fuchsia-500/10 blur-3xl" />
                <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/15 to-primary/10 blur-3xl" />
              </div>

              <div className="relative p-7 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8">
                  <div className="text-2xl md:text-4xl font-black leading-tight">
                    Ready to start selling bundles with Soltelco?
                  </div>
                  <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    Get onboarded as a reseller and use SMS API for OTP and notifications. A clean experience that your team can learn fast.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/contact"
                      className="group inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-primary text-white text-sm font-black shadow-xl shadow-primary/25 hover:opacity-95 transition"
                    >
                      Contact Sales
                      <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </Link>

                    <Link
                      to="/solutions"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-white/70 dark:bg-slate-950/25 border border-slate-200/70 dark:border-slate-800/60 text-slate-900 dark:text-white text-sm font-black hover:bg-white/90 dark:hover:bg-slate-900/35 transition"
                    >
                      See all solutions
                      <span className="material-symbols-outlined text-[18px]">view_cozy</span>
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 backdrop-blur-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 text-primary">
                        <span className="material-symbols-outlined text-[22px]">support_agent</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black">Onboarding support</div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          We help you set up the reseller flow and make sure your team is ready.
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 h-px w-full bg-slate-200/70 dark:bg-slate-800/60" />

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 p-3">
                        <div className="text-xs font-black text-slate-600 dark:text-slate-300">Focus</div>
                        <div className="mt-1 text-sm font-black">Selling</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/25 p-3">
                        <div className="text-xs font-black text-slate-600 dark:text-slate-300">Tools</div>
                        <div className="mt-1 text-sm font-black">API, bundles</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedInView>
        </div>
      </section>
    </main>
  );
}
