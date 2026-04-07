// C:\Soltelco Project\soltelco-business-portal\apps\web\src\pages\marketing\Solutions\SolutionsPage.tsx

import { Link } from "react-router-dom";
import logo from "../../../assets/marketing/logo.png";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";
import type { Variants } from "framer-motion";

type FeatureCardProps = {
  icon: string;
  title: string;
  desc: string;
  bullets: string[];
  badge?: string;
};

type SimpleCardProps = {
  icon: string;
  title: string;
  desc: string;
};

type StatPillProps = {
  icon: string;
  title: string;
  value: string;
};

type AnimatedInViewProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

// ✅ TS-safe cubic bezier
const easeOutCubic = [0.16, 1, 0.3, 1] as const;

// ✅ Variants typed to remove red underlines
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: "beforeChildren" },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutCubic },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutCubic },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: easeOutCubic },
  },
  hover: {
    y: -4,
    transition: { duration: 0.25, ease: easeOutCubic },
  },
};

// ✅ typed as Variants, supports function variant for "animate"
const easing = [0.16, 1, 0.3, 1] as const;

const float = (y = 8): Variants => ({
  initial: { y: 0 },
  animate: (i: number) => ({
    y: [0, y, 0],
    transition: {
      duration: 6 + i,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: easing,
      delay: i * 0.15,
    },
  }),
});

function AnimatedInView({ children, className = "", delay = 0 }: AnimatedInViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function SolutionsPage() {
  return (
    <main className="flex flex-col w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden">
      {/* HERO */}
      <section className="relative px-4 pt-14 pb-10 md:pt-16 md:pb-12 lg:px-12 xl:px-40 flex justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl"
            variants={float(10)}
            custom={0}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className="absolute top-40 left-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl"
            variants={float(8)}
            custom={1}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className="absolute top-28 right-10 h-44 w-44 rounded-full bg-primary/15 blur-2xl"
            variants={float(12)}
            custom={2}
            initial="initial"
            animate="animate"
          />
        </div>

        <div className="max-w-[1200px] w-full">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            initial="hidden"
            animate="show"
            variants={container}
          >
            {/* LEFT */}
            <motion.div className="flex flex-col gap-5" variants={container}>
              <motion.span
                className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/15"
                variants={item}
              >
                <span className="material-symbols-outlined text-[16px]">stars</span>
                Solutions
              </motion.span>

              <motion.h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight" variants={item}>
                Soltelco Business Module
                <br />
                Telecom solutions for enterprises, developers, and resellers
              </motion.h1>

              <motion.p
                className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
                variants={item}
              >
                A professional business portal that provides structured telecom services and APIs. Start with the
                core services available today, then expand into planned digital services as the platform grows.
              </motion.p>

              <motion.div className="flex flex-wrap gap-3 pt-1" variants={item}>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center rounded-xl h-12 px-6 bg-primary text-white text-base font-bold hover:opacity-95 transition shadow-xl shadow-primary/25"
                >
                  Talk to Sales
                  <span className="material-symbols-outlined text-[18px] ml-2 transition-transform group-hover:translate-x-0.5">
                    arrow_forward
                  </span>
                </Link>

                <Link
                  to="/roles/enterprise"
                  className="inline-flex items-center justify-center rounded-xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Explore Roles
                </Link>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 pt-4"
                variants={container}
              >
                <motion.div variants={item}>
                  <StatPill icon="domain" title="Enterprise" value="Bulk offers + control" />
                </motion.div>
                <motion.div variants={item}>
                  <StatPill icon="code" title="Developers" value="SMS + Payments APIs" />
                </motion.div>
                <motion.div variants={item}>
                  <StatPill icon="storefront" title="Resellers" value="Controlled resale" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              className="w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={scaleIn}
              whileHover="hover"
              transition={{ type: "spring", damping: 12, stiffness: 110, delay: 0.15 }}
            >
              <motion.div
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md shadow-2xl overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)",
                    "0 25px 50px -12px rgb(0 0 0 / 0.18)",
                    "0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <div className="p-6 md:p-7 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0">
                      <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl opacity-80" />
                      <div className="relative h-11 w-11 rounded-full bg-primary/10 border border-primary/20 ring-1 ring-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">view_cozy</span>
                      </div>
                    </div>

                    <div className="flex flex-col leading-tight">
                      <div className="text-base font-black">What you get today</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Core services delivered first</div>
                    </div>
                  </div>

                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 shadow-sm flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center">
                      <img src={logo} alt="Soltelco" className="h-6 w-6 object-contain" />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MiniFeature icon="local_offer" title="Business Offers" desc="Bulk data and voice packages for organizations." />
                    <MiniFeature icon="sms" title="SMS Services" desc="SMS API plus portal SMS messaging and usage tracking." />
                    <MiniFeature icon="payments" title="WAAFI Pay API" desc="Secure payment initiation, callbacks, and tracking." />
                    <MiniFeature icon="receipt_long" title="Reporting" desc="Invoices, usage, billing, and exports." />
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 p-5">
                    <div className="flex items-start gap-3">
                      <IconBadge icon="shield" />
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-black">Role-based access</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Enterprise, Developer, and Reseller experiences are separated by permissions, so each user only
                          sees what they are allowed to use.
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="mt-6 flex flex-wrap gap-3"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={container}
                  >
                    <motion.div variants={item}>
                      <Link
                        to="/roles/developer"
                        className="inline-flex items-center gap-2 rounded-xl h-11 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">code</span>
                        Developer APIs
                      </Link>
                    </motion.div>

                    <motion.div variants={item}>
                      <Link
                        to="/roles/enterprise"
                        className="inline-flex items-center gap-2 rounded-xl h-11 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">domain</span>
                        Enterprise Offers
                      </Link>
                    </motion.div>

                    <motion.div variants={item}>
                      <Link
                        to="/roles/reseller"
                        className="inline-flex items-center gap-2 rounded-xl h-11 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                        Reseller Model
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              <AnimatedInView className="mt-4 text-xs text-slate-500 dark:text-slate-500" delay={0.1}>
                Built for strong core services now, and planned expansion later.
              </AnimatedInView>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CURRENT FEATURES */}
      <section className="px-4 py-12 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <AnimatedInView>
            <SectionHeader
              badge="Current"
              title="Current features available today"
              desc="These are the services delivered first to provide immediate value for customers and partners."
            />
          </AnimatedInView>

          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
          >
            <FeatureCard
              icon="local_offer"
              badge="Current"
              title="Business Offers (Data and Voice)"
              desc="Organizations can access and manage business data and voice offers designed for enterprise usage."
              bullets={[
                "View available business data and voice packages",
                "Purchase bulk data or voice offers",
                "Divide offers among employees or departments",
                "Set limits per user or department",
                "Monitor usage and remaining balances",
              ]}
            />
            <FeatureCard
              icon="sms"
              badge="Current"
              title="SMS API Services"
              desc="Businesses and developers can integrate SMS into their systems using secure API access."
              bullets={[
                "Register for SMS API access",
                "Manage API credentials",
                "Send SMS through Soltelco SMS gateway",
                "Monitor basic SMS usage",
              ]}
            />
            <FeatureCard
              icon="chat"
              badge="Current"
              title="Portal SMS Messaging"
              desc="Authorized users can send SMS directly from the dashboard without API integration."
              bullets={[
                "Compose and send SMS from the web portal",
                "Manage recipients (single or groups, or uploaded lists where applicable)",
                "Use approved sender IDs based on policy",
                "View basic message history and usage summaries",
              ]}
            />
            <FeatureCard
              icon="payments"
              badge="Current"
              title="WAAFI Pay Payment Gateway API"
              desc="Businesses can process digital payments securely using WAAFI Pay integration."
              bullets={[
                "Access WAAFI Pay API services",
                "Secure payment initiation",
                "Payment confirmation and callback handling",
                "Basic transaction tracking",
              ]}
            />
            <FeatureCard
              icon="admin_panel_settings"
              badge="Current"
              title="Role-Based Access Control"
              desc="Secure permissions so each role has its own allowed services."
              bullets={[
                "Enterprise role for offers and allocation management",
                "Developer role for APIs and technical resources",
                "Reseller role for allowed resale services",
                "Clear access control to protect system integrity",
              ]}
            />
            <FeatureCard
              icon="receipt_long"
              badge="Current"
              title="Reporting (Invoices, Usage, Billing)"
              desc="Reporting for offers, APIs, and payments to support business operations."
              bullets={[
                "Usage reports for Data, Voice, and SMS API",
                "Invoice generation for purchases and renewals",
                "Payment and transaction reports (paid, pending, failed)",
                "Export reports (PDF, CSV, Excel) with filters",
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* PLANNED FEATURES */}
      <section className="px-4 pb-14 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <AnimatedInView>
            <SectionHeader
              badge="Planned"
              title="Planned features for upcoming phases"
              desc="These features are planned for later phases after the current services are deployed and evaluated."
            />
          </AnimatedInView>

          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
          >
            <PlannedCard icon="dialpad" title="USSD Services" desc="Session-based interactions for business and customer engagement." />
            <PlannedCard icon="support_agent" title="IVR Services" desc="Automated voice-based customer interactions and service management." />
            <PlannedCard icon="memory" title="IoT Services" desc="Enterprise monitoring, tracking, and smart solutions." />
            <PlannedCard icon="insights" title="Advanced Reporting and Analytics" desc="Dashboards, deeper insights, and analytics for decision-making." />
            <PlannedCard icon="api" title="Additional Digital Services" desc="New APIs and digital services added based on demand and strategy." />

            <motion.div
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition"
              variants={item}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
            >
              <div className="flex items-start gap-3">
                <IconBadge icon="route" />
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-black">Phase by phase growth</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The platform stays focused on core telecom services first, then grows into bigger digital services as it matures.
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip>Build</Chip>
                    <Chip>Deploy</Chip>
                    <Chip>Measure</Chip>
                    <Chip>Expand</Chip>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <AnimatedInView delay={0.05}>
            <div className="mt-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-primary/10 to-transparent p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-black">Ready to explore a role-based journey?</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Pick a role and see the services that match it.</div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/roles/enterprise"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-primary text-white text-sm font-bold shadow-xl shadow-primary/25 hover:opacity-95 transition"
                  >
                    <span className="material-symbols-outlined text-[18px]">domain</span>
                    Enterprise
                  </Link>
                  <Link
                    to="/roles/developer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">code</span>
                    Developer
                  </Link>
                  <Link
                    to="/roles/reseller"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    Reseller
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedInView>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <AnimatedInView>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 md:p-9 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 shadow-sm flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center">
                      <img src={logo} alt="Soltelco" className="h-7 w-7 object-contain" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="text-xl font-black">Let’s build your business solution</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Contact sales or explore the portal experience.</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-primary text-white text-sm font-bold shadow-xl shadow-primary/25 hover:opacity-95 transition"
                  >
                    Contact Us
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
                      arrow_forward
                    </span>
                  </Link>
                  <Link
                    to="/company"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    About Company
                    <span className="material-symbols-outlined text-[18px]">info</span>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedInView>

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-500">
            Content shows current services and planned roadmap features.
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeader({ badge, title, desc }: { badge: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3 max-w-3xl">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/15">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          {badge}
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">{title}</h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{desc}</p>
    </div>
  );
}

function IconBadge({ icon }: { icon: string }) {
  return (
    <div className="relative size-12 shrink-0">
      <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl opacity-80" />
      <div className="relative size-12 rounded-full bg-primary/10 border border-primary/20 ring-1 ring-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-[26px]">{icon}</span>
      </div>
    </div>
  );
}

function CornerBadge({ text }: { text: string }) {
  return (
    <div
      className={[
        "absolute top-5 right-5",
        "text-[10px] font-black uppercase tracking-wider",
        "px-3 py-1.5 rounded-full",
        "bg-primary/10 text-primary border border-primary/15",
        "shadow-sm shadow-primary/10",
        "whitespace-nowrap",
      ].join(" ")}
    >
      {text}
    </div>
  );
}

function FeatureCard({ icon, title, desc, bullets, badge }: FeatureCardProps) {
  return (
    <motion.div
      className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-2xl transition"
      variants={item}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      {badge ? <CornerBadge text={badge} /> : null}

      <div className="flex items-start gap-3 pr-24">
        <IconBadge icon={icon} />
        <div className="flex flex-col min-w-0">
          <h3 className="text-lg font-black leading-snug">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {bullets.map((b, idx) => (
          <motion.div
            key={`${b}-${idx}`}
            className="flex items-start gap-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: idx * 0.03 + 0.08 }}
          >
            <span className="material-symbols-outlined text-primary text-[18px] mt-[1px]">check_circle</span>
            <span className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{b}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PlannedCard({ icon, title, desc }: SimpleCardProps) {
  return (
    <motion.div
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl transition"
      variants={item}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div className="flex items-start gap-3">
        <IconBadge icon={icon} />
        <div className="flex flex-col">
          <div className="text-lg font-black">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</div>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 border border-primary/15 px-3 py-1.5 rounded-full">
        <span className="material-symbols-outlined text-[16px]">schedule</span>
        Planned feature
      </div>
    </motion.div>
  );
}

function StatPill({ icon, title, value }: StatPillProps) {
  return (
    <motion.div
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-4 transition hover:shadow-lg h-[120px]"
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <div className="flex items-start gap-3 h-full">
        <motion.div
          className="relative size-10 shrink-0"
          whileHover={{ rotate: [0, -6, 6, -6, 0] }}
          transition={{ duration: 0.55 }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-full bg-primary/25 blur-md opacity-70" />
          <div className="relative size-10 rounded-full bg-primary/10 border border-primary/20 ring-1 ring-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-black leading-tight whitespace-nowrap">{title}</div>
          <div className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-normal break-normal">
            {value}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MiniFeature({ icon, title, desc }: SimpleCardProps) {
  return (
    <motion.div
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-lg transition"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: easeOutCubic }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-3">
        <div className="relative size-10 shrink-0">
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-lg opacity-80" />
          <div className="relative size-10 rounded-full bg-primary/10 border border-primary/20 ring-1 ring-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-sm font-black">{title}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <motion.span
      className="text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      {children}
    </motion.span>
  );
}
