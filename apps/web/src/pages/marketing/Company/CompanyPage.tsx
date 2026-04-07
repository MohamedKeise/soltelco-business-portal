import { Link } from "react-router-dom";
import logo from "../../../assets/marketing/logo.png";
import { motion, useInView, type Variants } from "framer-motion";
import { useMemo, useRef, useState } from "react";

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
  hidden: { opacity: 0, scale: 0.965 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: easing } },
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09, when: "beforeChildren" } },
};

const float = (amp = 10): Variants => ({
  initial: { y: 0 },
  animate: (i: number) => ({
    y: [0, amp, 0],
    transition: {
      duration: 7 + i,
      repeat: Infinity,
      repeatType: 'reverse' as const,
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

function AnimatedInView({
  children,
  className = "",
  delay = 0,
  variant = "fadeUp",
}: AnimatedInViewProps) {
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


function MiniPoint({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="material-symbols-outlined text-primary text-[18px] mt-[1px]">{icon}</span>
      <span className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{text}</span>
    </div>
  );
}

function ValueTile({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start gap-4">
        <IconDot icon={icon} />
        <div className="min-w-0">
          <div className="text-lg font-black">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</div>
        </div>
      </div>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Customer-first delivery, consistent improvements, and a clear focus on quality.
      </div>
    </motion.div>
  );
}

function BranchChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-full text-sm font-black",
        "border transition",
        active
          ? "bg-primary text-white border-primary/30 shadow-lg shadow-primary/20"
          : "bg-white/80 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function BranchCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div className="flex items-start gap-4">
        <IconDot icon={icon} />
        <div className="min-w-0">
          <div className="text-lg font-black">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * NOTE:
 * You said "remove this section", I removed the old TIMELINE/JOURNEY section completely,
 * and replaced it with the new Branches + compact info panel style like your screenshot.
 */
export default function CompanyPage() {
  const branches = useMemo(
    () => [
      { city: "Hargeisa", name: "Soltelco HQ, Hargeisa" },
      { city: "Hargeisa", name: "Soltelco Sales HQ, Hargeisa" },
      { city: "Hargeisa", name: "Soltelco Safari branch, Hargeisa" },
      { city: "Hargeisa", name: "Soltelco Idaacadda branch, Hargeisa" },
      { city: "Hargeisa", name: "Soltelco New Hargeisa branch, Hargeisa" },
      { city: "Hargeisa", name: "Soltelco Gacanta branch, Hargeisa" },
      { city: "Borama", name: "Borama HQ, Borama" },
      { city: "Wajaale", name: "Soltelco Wajaale branch, Wajaale" },
      { city: "Gebiley", name: "Gebiley, Gebiley" },
      { city: "Berbera", name: "Soltelco Berbera HQ, Berbera" },
      { city: "Burco", name: "Soltelco Burco HQ, Burco" },
      { city: "Burco", name: "Soltelco Dero branch, Burco" },
      { city: "Lasanod", name: "Soltelco Las'anod HQ, Las'anod" },
      { city: "Ceerigaabo", name: "Soltelco Ceerigaabo HQ, Ceerigaabo" },
      { city: "Buhodle", name: "Soltelco Buhodle branch, Buhodle" },
    ],
    []
  );

  const cities = useMemo(() => {
    const unique = Array.from(new Set(branches.map((b) => b.city)));
    unique.sort((a, b) => a.localeCompare(b));
    return ["All", ...unique];
  }, [branches]);

  const [activeCity, setActiveCity] = useState<string>("All");

  const filtered = useMemo(() => {
    if (activeCity === "All") return branches;
    return branches.filter((b) => b.city === activeCity);
  }, [activeCity, branches]);

  return (
    <main className="flex flex-col w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden">
      {/* HERO (cinematic, different from Solutions) */}
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
            {/* Left: story card */}
            <motion.div
              className="lg:col-span-7 rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-7 md:p-9 shadow-2xl relative overflow-hidden"
              initial="hidden"
              animate="show"
              variants={pop}
            >
              <div className="absolute -left-24 -bottom-24 size-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />

              <AnimatedInView variant="fade" className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider border border-primary/15">
                  <span className="material-symbols-outlined text-[16px]">apartment</span>
                  Company
                </div>
              </AnimatedInView>

              <AnimatedInView delay={0.05} className="mt-5">
                <h1 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
                  Who are we?
                  <br />
                  Soltelco, built for Somaliland.
                </h1>
              </AnimatedInView>

              <AnimatedInView delay={0.1} className="mt-5">
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  Soltelco is the first Telecommunications Company in Somaliland headquartered in Hargeisa,
                  and revived to provide innovative, reliable and low cost telecommunication services.
                  It provides Mobile Broadband, voice and mobile money services.
                </p>
              </AnimatedInView>

              <AnimatedInView delay={0.14} className="mt-4">
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  Soltelco is committed to continuously steering service innovations with an aim to enhance
                  customer experience in telecommunication services. Our goal is to shape the future of the
                  market and provide customers with new communications and digital experience.
                </p>
              </AnimatedInView>

              <AnimatedInView delay={0.18} className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center rounded-2xl h-12 px-6 bg-primary text-white text-sm md:text-base font-black shadow-xl shadow-primary/25 hover:opacity-95 transition"
                >
                  Contact Us
                  <span className="material-symbols-outlined text-[18px] ml-2 transition-transform group-hover:translate-x-0.5">
                    arrow_forward
                  </span>
                </Link>

                <Link
                  to="/solutions"
                  className="inline-flex items-center justify-center rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm md:text-base font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  View Solutions
                </Link>
              </AnimatedInView>

              {/* Compact info ribbon like your screenshot */}
            </motion.div>

            {/* Right: mission + mini points */}
            <motion.div
              className="lg:col-span-5 rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 md:p-8 shadow-2xl overflow-hidden relative"
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <div className="absolute -right-24 top-16 size-72 rounded-full bg-primary/10 blur-3xl" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 shadow-sm flex items-center justify-center">
                    <div className="h-9 w-9 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center">
                      <img src={logo} alt="Soltelco" className="h-6 w-6 object-contain" />
                    </div>
                  </div>
                  <div className="leading-tight">
                    <div className="text-base font-black">Soltelco</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Telecommunications, Somaliland
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-black text-primary bg-primary/10 border border-primary/15 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  Trusted services
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 p-6">
                <div className="flex items-start gap-4">
                  <IconDot icon="public" />
                  <div className="min-w-0">
                    <div className="text-lg font-black">Our mission</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Enhance customer experience through continuous innovation, while delivering reliable
                      and low cost telecom services across Somaliland.
                    </div>
                  </div>
                </div>

                <div className="mt-5 h-px w-full bg-slate-200 dark:bg-slate-800" />

                <div className="mt-5 space-y-3">
                  <MiniPoint icon="bolt" text="Drive service innovations that customers feel." />
                  <MiniPoint icon="shield" text="Build reliability into everyday connectivity." />
                  <MiniPoint icon="savings" text="Keep services accessible and affordable." />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Link
                  to="/solutions"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">view_cozy</span>
                  Explore Solutions
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-primary text-white text-sm font-black shadow-xl shadow-primary/25 hover:opacity-95 transition"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  Talk to our team
                </Link>
              </div>

              <AnimatedInView variant="fade" delay={0.08} className="mt-5 text-xs text-slate-500 dark:text-slate-500">
                Customer-first, innovation-driven, built for Somaliland.
              </AnimatedInView>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES (tiles, modern) */}
      <section className="px-4 py-12 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <AnimatedInView>
            <div className="flex flex-col gap-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider border border-primary/15">
                <span className="material-symbols-outlined text-[16px]">favorite</span>
                Values
              </div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">What we stand for</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Reliability, affordability, and continuous innovation, all focused on customer experience.
              </p>
            </div>
          </AnimatedInView>

          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
            variants={container}
          >
            <motion.div variants={fadeUp}>
              <ValueTile
                icon="thumb_up"
                title="Reliable services"
                desc="Dependable telecom experiences for individuals and organizations."
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <ValueTile
                icon="savings"
                title="Low cost access"
                desc="Affordable services that expand digital access and connectivity."
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <ValueTile
                icon="emoji_objects"
                title="Innovation mindset"
                desc="We evolve services to match market needs and new opportunities."
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <ValueTile
                icon="support_agent"
                title="Customer experience"
                desc="We improve based on feedback and real usage patterns."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* BRANCHES (new section like your screenshot) */}
      <section className="px-4 pb-14 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <AnimatedInView>
            <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-7 md:p-9 shadow-2xl overflow-hidden relative">
              <div className="absolute -left-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -right-24 -bottom-24 size-72 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative">
                <div className="text-3xl md:text-5xl font-black text-primary text-center">
                  Welcome to Soltelco Branches
                </div>
                <div className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400 text-center">
                  Please select your location to find our sites here.
                </div>

                <div className="mt-8 flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-lg font-black text-primary">Our Popular Cities</div>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((c) => (
                      <BranchChip key={c} label={c} active={activeCity === c} onClick={() => setActiveCity(c)} />
                    ))}
                  </div>
                </div>

                <motion.div
                  className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-120px" }}
                  variants={container}
                >
                  <BranchCard
                    icon="location_city"
                    title={activeCity === "All" ? "All branches" : `${activeCity} branches`}
                    desc={
                      activeCity === "All"
                        ? "Browse Soltelco branches across Somaliland. Select a city to filter."
                        : `Showing branches and sites in ${activeCity}.`
                    }
                  />
                  <BranchCard
                    icon="search"
                    title="Quick browsing"
                    desc="You can use the city chips to instantly filter and find nearby branches faster."
                  />
                </motion.div>

                <motion.div
                  key={activeCity}
                  className="mt-8 flex flex-wrap justify-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: easing }}
                >
                  {filtered.map((b) => (
                    <span
                      key={b.name}
                      className="px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/20 font-black text-sm"
                    >
                      {b.name}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </AnimatedInView>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <AnimatedInView variant="pop">
            <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7 p-7 md:p-9">
                  <div className="text-2xl md:text-3xl font-black leading-tight">Want to partner with Soltelco?</div>
                  <div className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    Reach out and we will help you find the right path for enterprise services, APIs, and partnerships.
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/contact"
                      className="group inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-primary text-white text-sm font-black shadow-xl shadow-primary/25 hover:opacity-95 transition"
                    >
                      Contact Us
                      <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </Link>

                    <Link
                      to="/solutions"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">view_cozy</span>
                      Explore Solutions
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
                      <div className="text-xs text-slate-500 dark:text-slate-400">Headquartered in Hargeisa, Somaliland</div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-5">
                    <div className="flex items-start gap-3">
                      <IconDot icon="shield" />
                      <div className="min-w-0">
                        <div className="text-sm font-black">Our promise</div>
                        <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Innovative, reliable, and low cost telecommunication services built to improve customer experience.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-500 dark:text-slate-500">Built for strong core services now, and growth later.</div>
                </div>
              </div>
            </div>
          </AnimatedInView>
        </div>
      </section>
    </main>
  );
}
