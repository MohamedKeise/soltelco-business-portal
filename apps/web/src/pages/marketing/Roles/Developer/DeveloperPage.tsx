import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  type Transition,
  type Variants,
} from "framer-motion";

// Images
import apiStepsLight from "../../../../assets/marketing/developer-api-integration-steps light mode.png";
import apiStepsDark from "../../../../assets/marketing/developer-api-integration-steps dark mode.png";
import apiOverviewLight from "../../../../assets/marketing/developer-sms-payment-api light mode.png";
import apiOverviewDark from "../../../../assets/marketing/developer-sms-payment-api dark mode.png";
import otpLight from "../../../../assets/marketing/developer-sms-otp-security light mode.png";
import otpDark from "../../../../assets/marketing/developer-sms-otp-security dark mode.png";
import logo from "../../../../assets/marketing/logo.png";

// ================== Types ==================
type PropsWithChildren = { children: React.ReactNode };

type MagicBackgroundProps = PropsWithChildren;

type AnimatedInViewProps = PropsWithChildren & {
  className?: string;
  delay?: number;
  variants?: Variants;
};

type ImageSwitchProps = {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
};

type SpotlightCardProps = PropsWithChildren & {
  className?: string;
};

type PillProps = {
  icon: string;
  text: string;
};

type StatMiniProps = {
  icon: string;
  label: string;
  value: string;
};

type BulletProps = {
  text: string;
};

type GradientButtonProps = PropsWithChildren & {
  to: string;
  icon?: string;
};

type OutlineButtonProps = PropsWithChildren & {
  to: string;
  icon?: string;
};

type TabId = "sms" | "otp" | "pay";

type TabItem = {
  id: TabId;
  label: string;
  icon: string;
  description: string;
};

type CopyTextFn = (text: string) => Promise<void>;

// ================== Motion Presets ==================
const easing: Transition["ease"] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easing } },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: easing } },
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, when: "beforeChildren" },
  },
};

// ================== Magic Background Component ==================
const MagicBackground: React.FC<MagicBackgroundProps> = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const bg = useMotionTemplate`
    radial-gradient(
      circle at ${mouseX} ${mouseY},
      rgba(99, 102, 241, 0.5) 0%,
      rgba(0, 0, 0, 0) 70%
    )
  `;

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none"
        style={{ background: bg }}
      />
      {children}
    </div>
  );
};



// ================== Building Blocks ==================
function AnimatedInView({
  children,
  className = "",
  delay = 0,
  variants = fadeUp,
}: AnimatedInViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-140px" });

  const v = useMemo<Variants>(() => {
    const hidden = (variants as Variants).hidden ?? {};
    const show = (variants as Variants).show ?? {};
    const baseTransition =
      typeof show === "object" && show && "transition" in show ? (show as any).transition : undefined;

    return {
      hidden,
      show: {
        ...(typeof show === "object" ? show : {}),
        transition: { ...(baseTransition || {}), delay },
      },
    };
  }, [variants, delay]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={v}
    >
      {children}
    </motion.div>
  );
}

function ImageSwitch({ lightSrc, darkSrc, alt, className = "" }: ImageSwitchProps) {
  return (
    <div className={["relative w-full", className].join(" ")}>
      <img src={lightSrc} alt={alt} className="block w-full dark:hidden" loading="lazy" />
      <img src={darkSrc} alt={alt} className="hidden w-full dark:block" loading="lazy" />
    </div>
  );
}

function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const bg = useMotionTemplate`
    radial-gradient(520px circle at ${mx}px ${my}px,
      rgba(136, 39, 235, 0.14),
      rgba(136, 39, 235, 0.06) 35%,
      transparent 70%)
  `;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={[
        "relative rounded-[28px] overflow-hidden",
        "border border-slate-200/70 dark:border-slate-800/70",
        "bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl",
        "shadow-[0_20px_60px_-30px_rgba(2,6,23,0.45)]",
        className,
      ].join(" ")}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: bg }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 size-72 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function Pill({ icon, text }: PillProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-slate-800/70 backdrop-blur-md">
      <span className="material-symbols-outlined text-[16px] text-primary">{icon}</span>
      <span className="text-xs font-black text-slate-700 dark:text-slate-200">{text}</span>
    </div>
  );
}

function StatMini({ icon, label, value }: StatMiniProps) {
  return (
    <div className="h-full rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/55 dark:bg-slate-950/25 backdrop-blur-md p-4">
      <div className="flex items-start gap-3 h-full">
        <div className="flex-shrink-0 pt-0.5">
          <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-lg font-black text-slate-900 dark:text-white leading-tight">{value}</div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">{label}</div>
        </div>
      </div>
    </div>
  );
}

function Bullet({ text }: BulletProps) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="material-symbols-outlined text-primary text-[18px] mt-[1px]">check_circle</span>
      <span className="text-sm text-slate-700 dark:text-slate-200">{text}</span>
    </div>
  );
}

function GradientButton({ to, children, icon = "arrow_forward" }: GradientButtonProps) {
  return (
    <Link
      to={to}
      className={[
        "group inline-flex items-center justify-center gap-2",
        "rounded-2xl h-12 px-6",
        "bg-gradient-to-r from-[#7c3aed] via-[#8827eb] to-[#a855f7]",
        "text-white text-sm md:text-base font-black",
        "shadow-[0_18px_40px_-18px_rgba(136,39,235,0.65)]",
        "hover:opacity-95 transition",
      ].join(" ")}
    >
      {children}
      <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
        {icon}
      </span>
    </Link>
  );
}

function OutlineButton({ to, children, icon = "description" }: OutlineButtonProps) {
  return (
    <Link
      to={to}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-2xl h-12 px-6",
        "bg-white/70 dark:bg-slate-950/10 backdrop-blur",
        "border border-slate-200/70 dark:border-slate-800/70",
        "text-slate-900 dark:text-white text-sm md:text-base font-black",
        "hover:bg-white hover:dark:bg-slate-900/60 transition-colors",
      ].join(" ")}
    >
      <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
      {children}
    </Link>
  );
}

// ================== Code Tabs ==================
function CodeTabs() {
  const [tab, setTab] = useState<TabId>("sms");
  const [copied, setCopied] = useState(false);

  const tabs = useMemo<TabItem[]>(
    () => [
      { id: "sms", label: "SMS API", icon: "sms", description: "Send transactional and marketing SMS messages" },
      { id: "otp", label: "OTP Flow", icon: "verified_user", description: "Secure one-time password generation and verification" },
      { id: "pay", label: "Payment API", icon: "payments", description: "Process payments with webhook callbacks" },
    ],
    []
  );

  const code = useMemo<Record<TabId, string>>(
    () => ({
      sms: `// Send an SMS
POST /v1/sms/send
Content-Type: application/json
Authorization: Bearer \${API_KEY}

{
  "to": "+2526XXXXXXX",
  "message": "Your verification code is 152473",
  "sender_id": "YOUR_SENDER_ID",
  "callback_url": "https://yourapi.com/delivery-reports"
}`,
      otp: `// Generate OTP
POST /v1/otp/request
Content-Type: application/json

{
  "phone_number": "+2526XXXXXXX",
  "message": "Your verification code is {{otp}}",
  "length": 6,
  "expiry_seconds": 300,
  "sender_id": "YOUR_SENDER_ID"
}

// Verify OTP
POST /v1/otp/verify
Content-Type: application/json

{
  "request_id": "req_123abc",
  "code": "123456"
}`,
      pay: `// Initiate payment
POST /v1/payments/initiate
Content-Type: application/json
Authorization: Bearer \${API_KEY}

{
  "amount": 1000,
  "currency": "USD",
  "description": "API Payment for Order #123",
  "customer": {
    "phone": "+2526XXXXXXX",
    "email": "customer@example.com"
  },
  "callback_url": "https://yourapi.com/payment-callback"
}`,
    }),
    []
  );

  const sampleResponses = useMemo<Record<TabId, string>>(
    () => ({
      sms: `{
  "success": true,
  "message_id": "msg_1234567890",
  "recipient": "+2526XXXXXXX",
  "status": "queued",
  "timestamp": "2025-01-04T20:13:00Z"
}`,
      otp: `{
  "success": true,
  "request_id": "req_123abc",
  "status": "pending",
  "expires_at": "2025-01-04T20:18:00Z"
}`,
      pay: `{
  "success": true,
  "payment_id": "pay_1234567890",
  "amount": 1000,
  "currency": "USD",
  "status": "pending",
  "payment_url": "https://pay.soltelco.so/checkout/123"
}`,
    }),
    []
  );

  const copyToClipboard: CopyTextFn = async (text) => {
    try {
      if (!navigator?.clipboard?.writeText) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Copy failed:", err);
    }
  };

  const active = useMemo(() => tabs.find((t) => t.id === tab), [tabs, tab]);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-950/20 backdrop-blur-sm shadow-xl">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/30 p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">API Playground</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500" />
            Operational
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => copyToClipboard(code[tab])}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            title="Copy to clipboard"
          >
            <span className="material-symbols-outlined text-[16px]">{copied ? "check" : "content_copy"}</span>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap border-b border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/30">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={[
              "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition",
              tab === t.id
                ? "text-primary"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            {t.label}
            {tab === t.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                layoutId="activeTab"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-slate-200/70 dark:border-slate-800/70 bg-white/50 dark:bg-slate-950/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Request</span>
            <button
              type="button"
              onClick={() => copyToClipboard(code[tab])}
              className="text-xs text-slate-400 hover:text-primary transition-colors"
              title="Copy code"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-sm overflow-x-auto">
            <code className="font-mono text-slate-800 dark:text-slate-200">{code[tab]}</code>
          </pre>
        </div>

        <div className="flex-1 p-5 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Sample Response</span>
            <button
              type="button"
              onClick={() => copyToClipboard(sampleResponses[tab])}
              className="text-xs text-slate-400 hover:text-primary transition-colors"
              title="Copy response"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-sm overflow-x-auto">
            <code className="font-mono text-slate-800 dark:text-slate-200">{sampleResponses[tab]}</code>
          </pre>
        </div>
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">{active?.label}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{active?.description}</p>
          </div>
          <Link
            to="/docs/api-reference"
            className="text-xs font-black text-primary hover:underline inline-flex items-center gap-1"
          >
            Docs
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ================== Page ==================
const DeveloperPage: React.FC = () => {
  const stats = useMemo<StatMiniProps[]>(
    () => [
      { icon: "key", label: "Credentials", value: "Keys + Secrets" },
      { icon: "security", label: "Security", value: "OTP Ready" },
      { icon: "integration_instructions", label: "Integration", value: "SMS + Pay" },
    ],
    []
  );

  return (
    <MagicBackground>
      <main className="flex flex-col w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden">
        {/* HERO */}
        <section className="relative px-4 pt-14 pb-12 md:pt-16 md:pb-16 lg:px-12 xl:px-40 flex justify-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[720px] w-[720px] rounded-full bg-primary/20 blur-3xl opacity-70" />
            <div className="absolute top-56 left-10 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute top-24 right-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/70 dark:to-slate-950/70" />
          </div>

          <div className="max-w-[1200px] w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
              <AnimatedInView className="lg:col-span-7" variants={pop}>
                <div className="group">
                  <SpotlightCard className="p-7 md:p-9">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider border border-primary/15">
                        <span className="material-symbols-outlined text-[16px]">code</span>
                        Developer
                      </div>
                      <Pill icon="sms" text="SMS API" />
                      <Pill icon="payments" text="Payment API" />
                      <Pill icon="verified_user" text="OTP" />
                    </div>

                    <h1 className="mt-5 text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
                      Build messaging and payments,
                      <br />
                      with developer-first APIs.
                    </h1>

                    <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      Integrate OTP and system SMS, connect secure payments, handle callbacks, and monitor usage with a clean portal experience.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <GradientButton to="/signup">Get API Access</GradientButton>
                      <OutlineButton to="/contact" icon="support_agent">
                        Request Docs
                      </OutlineButton>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
                      {stats.map((s) => (
                        <StatMini key={s.label} {...s} />
                      ))}
                    </div>

                    <div className="mt-7 rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-950/20 backdrop-blur-xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[20px]">rocket_launch</span>
                          </div>
                          <div className="leading-tight">
                            <div className="text-sm font-black">Fast setup</div>
                            <div className="text-xs text-slate-500 dark:text-slate-500">Create account, generate keys, integrate, monitor.</div>
                          </div>
                        </div>
                        <div className="text-xs font-black text-primary bg-primary/10 border border-primary/15 px-3 py-1.5 rounded-full">
                          Ready for production
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              </AnimatedInView>

              <AnimatedInView className="lg:col-span-5" delay={0.06}>
                <div className="group">
                  <SpotlightCard className="p-6 md:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 text-xs font-black text-primary bg-primary/10 border border-primary/15 px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-[16px]">hub</span>
                        API overview
                      </div>

                      <div className="inline-flex items-center gap-2 text-xs font-black text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-[18px] text-primary">shield</span>
                        Secure by design
                      </div>
                    </div>

                    <div className="mt-5 rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950/20 p-3">
                      <ImageSwitch
                        lightSrc={apiOverviewLight}
                        darkSrc={apiOverviewDark}
                        alt="Developer SMS and Payment API"
                        className="rounded-2xl overflow-hidden"
                      />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-950/20 p-4">
                        <div className="flex items-center gap-2 text-primary font-black">
                          <span className="material-symbols-outlined text-[18px]">sms</span>
                          SMS API
                        </div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">OTP, alerts, notifications.</div>
                      </div>

                      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-950/20 p-4">
                        <div className="flex items-center gap-2 text-primary font-black">
                          <span className="material-symbols-outlined text-[18px]">payments</span>
                          Pay API
                        </div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Initiate, confirm, callbacks.</div>
                      </div>
                    </div>

                    <div className="mt-5 text-xs text-slate-500 dark:text-slate-500">Clean portal UX, optimized for clarity and speed.</div>
                  </SpotlightCard>
                </div>
              </AnimatedInView>
            </div>
          </div>
        </section>

        {/* API PLAYGROUND */}
        <section
          id="playground"
          className="px-4 py-16 lg:px-12 xl:px-40 flex justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/30 dark:to-slate-950/50"
        >
          <div className="max-w-[1200px] w-full">
            <AnimatedInView className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/15 mb-4">
                <span className="material-symbols-outlined text-primary text-[18px]">code</span>
                <span className="text-sm font-black text-primary">DEVELOPER TOOLS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Interactive API Playground
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Test our APIs directly in your browser with real code examples and responses.
              </p>
            </AnimatedInView>

            <AnimatedInView delay={0.1} className="mt-12">
              <SpotlightCard className="p-0 overflow-hidden border-0 shadow-xl">
                <div className="p-1 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
                  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white">API Explorer</h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Select an endpoint to see the request and response format
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                            <span>API Status: Operational</span>
                          </div>
                          <a href="/docs" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                            API Reference
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 md:px-8 pb-8 -mt-2">
                      <CodeTabs />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 border-t border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <span className="material-symbols-outlined text-primary">terminal</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Try it yourself</h4>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Copy the code and test in your environment</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <span className="material-symbols-outlined text-blue-500">code</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">SDKs & Libraries</h4>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Available for Node.js, Python, PHP, and more</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <span className="material-symbols-outlined text-emerald-500">support_agent</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Need help?</h4>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Our support team is here to help</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedInView>
          </div>
        </section>

        {/* SERVICES */}
        <section id="features" className="px-4 py-12 lg:px-12 xl:px-40 flex justify-center">
          <div className="max-w-[1200px] w-full">
            <AnimatedInView className="text-center">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">What you get</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Strong core capabilities for real products, not just demos.
              </p>
            </AnimatedInView>

            <motion.div
              className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
            >
              <motion.div variants={fadeUp}>
                <div className="group">
                  <SpotlightCard className="p-7">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">sms</span>
                      </div>
                      <div>
                        <div className="text-xl font-black">SMS API</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">OTP, verification, system notifications, alerts.</div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <Bullet text="OTP and verification messages for login and security." />
                      <Bullet text="Auto system alerts, confirmations, and status updates." />
                      <Bullet text="Clean integration approach, predictable behavior." />
                    </div>

                    <div className="mt-6 rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950/20 p-3">
                      <ImageSwitch lightSrc={otpLight} darkSrc={otpDark} alt="SMS OTP Security" className="rounded-2xl overflow-hidden" />
                    </div>
                  </SpotlightCard>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="group">
                  <SpotlightCard className="p-7">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">payments</span>
                      </div>
                      <div>
                        <div className="text-xl font-black">Payment API</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Integrate secure payments and handle callbacks.</div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <Bullet text="Initiate payments inside your app flow." />
                      <Bullet text="Receive confirmation and handle callbacks safely." />
                      <Bullet text="Track transactions and statuses with clarity." />
                    </div>

                    <div className="mt-6 rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950/20 p-3">
                      <ImageSwitch
                        lightSrc={apiOverviewLight}
                        darkSrc={apiOverviewDark}
                        alt="Payment API concept"
                        className="rounded-2xl overflow-hidden"
                      />
                    </div>
                  </SpotlightCard>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* INTEGRATION STEPS */}
        <section id="steps" className="px-4 py-14 lg:px-12 xl:px-40 flex justify-center">
          <div className="max-w-[1200px] w-full">
            <AnimatedInView className="text-center">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Integration steps</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                A simple path that keeps developers productive from day one.
              </p>
            </AnimatedInView>

            <AnimatedInView delay={0.06} className="mt-10">
              <div className="group">
                <SpotlightCard className="p-4 md:p-6">
                  <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950/20 p-3">
                    <ImageSwitch lightSrc={apiStepsLight} darkSrc={apiStepsDark} alt="API Integration Steps" className="rounded-2xl overflow-hidden" />
                  </div>
                </SpotlightCard>
              </div>
            </AnimatedInView>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 lg:px-12 xl:px-40 flex justify-center">
          <div className="max-w-[1200px] w-full">
            <AnimatedInView variants={pop}>
              <div className="group">
                <SpotlightCard className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-7 p-7 md:p-9">
                      <div className="inline-flex items-center gap-2 text-xs font-black text-primary bg-primary/10 border border-primary/15 px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                        Developer access
                      </div>

                      <div className="mt-4 text-2xl md:text-3xl font-black leading-tight">Ready to build with Soltelco?</div>

                      <div className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                        Create your developer account, generate keys, and integrate SMS and Payments with confidence.
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <GradientButton to="/signup">Start as Developer</GradientButton>
                        <OutlineButton to="/contact" icon="mail">
                          Contact Support
                        </OutlineButton>
                      </div>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
                        <StatMini icon="bolt" label="Setup" value="Fast" />
                        <StatMini icon="shield" label="Security" value="Strong" />
                        <StatMini icon="query_stats" label="Tracking" value="Clear" />
                      </div>
                    </div>

                    <div className="md:col-span-5 p-7 md:p-9 bg-gradient-to-br from-primary/10 to-transparent border-t md:border-t-0 md:border-l border-slate-200/70 dark:border-slate-800/70">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 shadow-sm flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center">
                            <img src={logo} alt="Soltelco" className="h-7 w-7 object-contain" />
                          </div>
                        </div>
                        <div className="leading-tight">
                          <div className="text-base font-black">Soltelco</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Developer Role</div>
                        </div>
                      </div>

                      <div className="mt-6 rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-950/20 backdrop-blur-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-black">Build real flows</div>
                            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              OTP verification, transaction confirmation, and system messaging with clear integration patterns.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                        Premium UX, clean API thinking, fast developer outcomes.
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </AnimatedInView>
          </div>
        </section>
      </main>
    </MagicBackground>
  );
};

export default DeveloperPage;
