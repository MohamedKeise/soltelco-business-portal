import { Link } from "react-router-dom";
import { motion, useInView, type Variants } from "framer-motion";
import { useMemo, useRef } from "react";

// Images (adjust paths if your folder differs)
import logo from "../../../../assets/marketing/logo.png";

import waafiLight from "../../../../assets/marketing/waafi light.png";
import waafiDark from "../../../../assets/marketing/waafi dark.png";

import smsLight from "../../../../assets/marketing/sms light.png";
import smsDark from "../../../../assets/marketing/sms dark.png";

import businessLight from "../../../../assets/marketing/business light.png";
import businessDark from "../../../../assets/marketing/business dark.png";

const easing = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easing } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.55, ease: easing } },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: easing } },
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
};

const float = (amp = 10): Variants => ({
  initial: { y: 0 },
  animate: (i: number) => ({
    y: [0, amp, 0],
    transition: {
      duration: 7 + i,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: easing,
      delay: i * 0.35,
    },
  }),
}) satisfies { initial: any; animate: (i: number) => any };

type AnimatedInViewProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeUp" | "fade" | "pop";
};

function AnimatedInView({ children, className = "", delay = 0, variant = "fadeUp" }: AnimatedInViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

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
    <motion.div ref={ref} className={className} initial="hidden" animate={isInView ? "show" : "hidden"} variants={v}>
      {children}
    </motion.div>
  );
}

function IconDot({ icon }: { icon: string }) {
  return (
    <div className="relative size-12 shrink-0">
      <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl opacity-80" />
      <div className="relative size-12 rounded-full bg-primary/10 border border-primary/20 ring-1 ring-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
    </div>
  );
}

function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        "rounded-[28px] border border-slate-200 dark:border-slate-800",
        "bg-white/75 dark:bg-slate-900/60 backdrop-blur-md",
        "shadow-2xl overflow-hidden",
        className,
      ].join(" ")}
    >
      {children}
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
    <div className={["relative w-full", className].join(" ")}>
      <img src={lightSrc} alt={alt} className="block w-full dark:hidden" loading="lazy" />
      <img src={darkSrc} alt={alt} className="hidden w-full dark:block" loading="lazy" />
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  bullets,
  lightImg,
  darkImg,
  gradient = 'from-[#9a4bad] to-[#ba56d4]'
}: {
  title: string;
  desc: string;
  bullets: string[];
  lightImg: string;
  darkImg: string;
  gradient?: string;
}) {
  const hoverAnimation = {
    y: -5,
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0, 0.2, 1] as const 
    }
  } as const;
  return (
    <motion.div 
      className="group h-full relative"
      whileHover="hover"
      variants={{ hover: hoverAnimation }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full ${gradient.replace('from-', 'from-').replace('to-', 'to-').split(' ')[0]} opacity-5 blur-3xl group-hover:opacity-20 transition-all duration-700`} />
      </div>

      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/30 bg-white/80 dark:bg-slate-900/40 backdrop-blur-sm hover:backdrop-blur transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-transparent">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-3xl p-[1px] pointer-events-none">
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
        </div>

        <div className="relative flex-1 flex flex-col p-0">
          {/* Image section - larger and more prominent */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              <ImageSwitch 
                lightSrc={lightImg} 
                darkSrc={darkImg} 
                alt={title}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-5">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h3>
            </div>
          </div>

          {/* Content section */}
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{desc}</p>
            
            <div className="mt-2 space-y-2.5">
              {bullets.map((bullet, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: i * 0.08,
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                  viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                  className="relative group/bullet"
                  whileHover={{ 
                    y: -1,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                >
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-slate-100/80 dark:border-slate-700/50 group-hover/bullet:border-transparent group-hover/bullet:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] dark:group-hover/bullet:shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-300">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover/bullet:opacity-100 transition-opacity duration-300" style={{ 
                        background: `linear-gradient(90deg, ${gradient.split(' ')[0].replace('from-', '')} 0%, ${gradient.split(' ')[2]?.replace('to-', '') || gradient.split(' ')[0].replace('from-', '')} 100%)` 
                      }} />
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-700/80 dark:to-slate-800/90 shadow-sm group-hover/bullet:shadow-md transition-all duration-300">
                        <span className="material-symbols-outlined text-[16px] text-slate-700 dark:text-slate-200 group-hover/bullet:scale-110 transition-transform duration-200">check_circle</span>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur opacity-0 group-hover/bullet:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="text-[13.5px] leading-snug text-slate-700 dark:text-slate-200 font-medium">{bullet}</span>
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-0 group-hover/bullet:opacity-100 group-hover/bullet:h-6 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Action button */}
          <div className="px-6 pb-6 pt-2">
            <motion.button 
              className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group/button 
                shadow-[0_4px_20px_-5px_#9a4bad80] hover:shadow-[0_6px_25px_-3px_#9a4badcc]`}
              whileHover={{ 
                y: -2,
                scale: 1.02,
                boxShadow: `0 8px 30px -5px ${gradient.includes('indigo') ? 'rgba(99, 102, 241, 0.8)' : 'rgba(154, 75, 173, 0.8)'}`
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Learn more</span>
              <span className="material-symbols-outlined text-lg group-hover/button:translate-x-1 transition-transform relative z-10">
                arrow_forward
              </span>
              <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function EnterprisePage() {
  const features = useMemo(
    () => [
      {
        title: "Waafi Payments",
        desc: "Seamlessly accept payments with our secure, enterprise-grade payment processing solution that scales with your business needs.",
        bullets: [
          "One-click checkout experience",
          "Bank-level security & compliance",
          "Real-time transaction tracking",
          "Multi-currency support"
        ],
        lightImg: waafiLight,
        darkImg: waafiDark,
      },
      {
        title: "SMS & Notifications",
        desc: "Powerful messaging API for all your communication needs, from OTPs to marketing campaigns and transactional alerts.",
        bullets: [
          "High-volume message delivery",
          "Global reach with local numbers",
          "Delivery analytics & reporting",
          "Simple REST API integration"
        ],
        lightImg: smsLight,
        darkImg: smsDark,
      },
      {
        title: "Business Solutions",
        desc: "Comprehensive tools for managing your business operations, from inventory to customer relationships and beyond.",
        bullets: [
          "Custom data bundles & plans",
          "Team & role management",
          "Usage analytics dashboard",
          "Bulk operations & automation"
        ],
        lightImg: businessLight,
        darkImg: businessDark,
      },
    ],
    []
  );

  return (
    <main className="flex flex-col w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden">
      {/* HERO */}
      <section className="relative px-4 pt-14 pb-10 md:pt-16 md:pb-12 lg:px-12 xl:px-40 flex justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-28 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl"
            variants={float(12)}
            custom={0}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className="absolute top-40 left-10 h-44 w-44 rounded-full bg-primary/15 blur-2xl"
            variants={float(10)}
            custom={1}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className="absolute top-24 right-10 h-56 w-56 rounded-full bg-primary/15 blur-2xl"
            variants={float(14)}
            custom={2}
            initial="initial"
            animate="animate"
          />
        </div>

        <div className="max-w-[1200px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left */}
            <motion.div className="lg:col-span-7" initial="hidden" animate="show" variants={pop}>
              <SoftCard className="p-7 md:p-9 relative">
                <div className="absolute -left-24 -bottom-24 size-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />

                <AnimatedInView variant="fade" className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider border border-primary/15">
                    <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
                    Enterprise
                  </div>
                </AnimatedInView>

                <AnimatedInView delay={0.06} className="mt-5">
                  <h1 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
                    Enterprise tools,
                    <br />
                    built to scale.
                  </h1>
                </AnimatedInView>

                <AnimatedInView delay={0.12} className="mt-5">
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    Soltelco Enterprise helps businesses manage bundles, messaging, and payments in one place, with a clean,
                    modern, and reliable experience.
                  </p>
                </AnimatedInView>

                <AnimatedInView delay={0.16} className="mt-7 flex flex-wrap gap-3">
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
                    className="inline-flex items-center justify-center rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm md:text-base font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Explore Solutions
                  </Link>
                </AnimatedInView>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { k: "Secure", v: "Enterprise-ready security", icon: "shield" },
                    { k: "Fast", v: "Optimized for quick actions", icon: "bolt" },
                    { k: "Clear", v: "Simple, readable dashboards", icon: "view_cozy" },
                  ].map((item) => (
                    <div
                      key={item.k}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md p-4"
                    >
                      <div className="flex items-center gap-2 text-primary font-black">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        {item.k}
                      </div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{item.v}</div>
                    </div>
                  ))}
                </div>
              </SoftCard>
            </motion.div>

            {/* Right */}
            <motion.div className="lg:col-span-5" initial="hidden" animate="show" variants={fadeUp}>
              <SoftCard className="p-7 md:p-8 relative">
                <div className="absolute -right-24 top-16 size-72 rounded-full bg-primary/10 blur-3xl" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 shadow-sm flex items-center justify-center">
                      <div className="h-9 w-9 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center">
                        <img src={logo} alt="Soltelco" className="h-6 w-6 object-contain" />
                      </div>
                    </div>
                    <div className="leading-tight">
                      <div className="text-base font-black">Soltelco Enterprise</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Business tools, Somaliland</div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-black text-primary bg-primary/10 border border-primary/15 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                    Reliable platform
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 p-6">
                  <div className="flex items-start gap-4">
                    <IconDot icon="assignment" />
                    <div className="min-w-0">
                      <div className="text-lg font-black">What you get</div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        A modern enterprise experience with payments, messaging, and offers in one simple place.
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 h-px w-full bg-slate-200 dark:bg-slate-800" />

                  <div className="mt-5 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-[1px]">check_circle</span>
                      <span className="text-sm text-slate-700 dark:text-slate-200">Clean UI and fast actions for teams.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-[1px]">check_circle</span>
                      <span className="text-sm text-slate-700 dark:text-slate-200">Secure flows, predictable behavior.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-[1px]">check_circle</span>
                      <span className="text-sm text-slate-700 dark:text-slate-200">Enterprise bundles, allocations, controls.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-primary text-white text-sm font-black shadow-xl shadow-primary/25 hover:opacity-95 transition"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    Request a demo
                  </Link>

                  <Link
                    to="/solutions"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">view_cozy</span>
                    View all solutions
                  </Link>
                </div>

                <AnimatedInView variant="fade" delay={0.08} className="mt-5 text-xs text-slate-500 dark:text-slate-500">
                  Built for clarity, speed, and enterprise confidence.
                </AnimatedInView>
              </SoftCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#9a4bad]/5 blur-3xl"
            variants={float(20)}
            custom={0}
            initial="initial"
            animate="animate"
          />
          <motion.div 
            className="absolute top-1/2 -right-40 w-[700px] h-[700px] rounded-full bg-[#ba56d4]/5 blur-3xl"
            variants={float(15)}
            custom={1}
            initial="initial"
            animate="animate"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 dark:to-slate-950/80 z-10 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          <AnimatedInView className="text-center max-w-4xl mx-auto">
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#9a4bad] to-[#ba56d4] text-white text-sm font-medium mb-8 shadow-xl shadow-purple-500/20"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              whileInView={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.6, 
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.1
                } 
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <span className="material-symbols-outlined text-lg animate-bounce">rocket_launch</span>
              <span className="font-bold tracking-wide">ENTERPRISE MODULES</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8, 
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.2
                } 
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              Everything your business needs
            </motion.h2>
            
            <motion.p 
              className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8, 
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.3
                } 
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              Designed to be simple for users, while staying strong enough for enterprise operations.
            </motion.p>
          </AnimatedInView>

          <motion.div 
            className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1],
                      delay: index * 0.1
                    }
                  }
                }}
                className="h-full"
              >
                <FeatureCard 
                  {...feature}
                  gradient={[
                    'from-[#9a4bad] to-[#ba56d4]',
                    'from-[#4b6cb7] to-[#8a46d4]',
                    'from-[#6a11cb] to-[#2575fc]'
                  ][index % 3]}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <AnimatedInView variant="pop">
            <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7 p-7 md:p-9">
                  <div className="text-2xl md:text-3xl font-black leading-tight">Ready to onboard your company?</div>
                  <div className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    Talk to the team to get the right enterprise setup, bundles, messaging, and payments.
                  </div>

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
                      className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">view_cozy</span>
                      See Solutions
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-5 p-7 md:p-9 bg-gradient-to-br from-primary/10 to-transparent border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 shadow-sm flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center">
                        <img src={logo} alt="Soltelco" className="h-7 w-7 object-contain" />
                      </div>
                    </div>
                    <div className="leading-tight">
                      <div className="text-base font-black">Soltelco</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Enterprise, Somaliland</div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-5">
                    <div className="flex items-start gap-3">
                      <IconDot icon="shield" />
                      <div className="min-w-0">
                        <div className="text-sm font-black">Enterprise promise</div>
                        <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Secure, simple, and consistent experiences designed for business teams and admins.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                    Strong core features now, and easy expansion later.
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
