import { Link } from "react-router-dom";

const globeImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCnYdxwLJhzOEL71-7Xc2TQF1npgMZjjXAyWSLEJmhtSN9Pkjxv4_UAkViVIimDZqLed16J5sSyd75IbzyqDzA9LUu6YRotsRLmwk8B2_3UkUXxqxTACa_-UhNJhBsLwMjklZp3A_qFz2a9R52Eg6vKAT9j-ovBrkDM_qyY-oLi1ezrtJKs2b0pB5p5-XWpBRDXCsz1wdv4DwCD1iLQ3DNkIfFc1Ugmw91t6Um4Izw163GjPSGv4nCf0EkDYMKR2qx9d-BZgicQGgQ";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full max-w-[100vw] overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      {/* HERO */}
      <section className="flex justify-center px-4 py-12 md:py-20 lg:px-40">
        <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-left">
            <div className="flex flex-col gap-4">
              <span className="inline-block w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                Next Gen Connectivity
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Connecting <br />
                Your Business <br />
                to the Future
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-xl">
                Enterprise-grade APIs, IoT solutions, and connectivity infrastructure designed to scale with
                your ambition. Powering the next generation of digital commerce.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:opacity-95 transition shadow-lg shadow-primary/25"
              >
                Get Started
              </Link>

              <Link
                to="/solutions"
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                View Solutions
              </Link>

              <a
                href="#"
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Talk to Sales
              </a>
            </div>
          </div>

          <div className="w-full aspect-square lg:aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${globeImg}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 py-8 lg:px-40 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-[1200px] w-full mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat label="Uptime Guarantee" value="99.9%" />
            <Stat label="Daily API Calls" value="1M+" />
            <Stat label="Enterprise Clients" value="500+" />
            <Stat label="Countries Served" value="12" />
          </div>
        </div>
      </section>

      {/* TITLE */}
      <section className="px-4 pt-16 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <div className="flex flex-col gap-4 text-center md:text-left max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Comprehensive Digital Infrastructure
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed">
              From developer-friendly APIs to robust IoT networks, we provide the backbone for modern
              enterprises to innovate and grow.
            </p>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="px-4 py-10 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="api"
              title="API Ecosystem"
              desc="Seamlessly integrate secure payments with Waafipay and reliable SMS gateways for transactional messaging directly into your app."
              cta="Explore APIs"
            />
            <FeatureCard
              icon="hub"
              title="IoT Solutions"
              desc="Real-time asset tracking and remote monitoring for industrial efficiency. Connect thousands of devices securely."
              cta="View IoT Products"
            />
            <FeatureCard
              icon="business_center"
              title="Business Offers"
              desc="Bulk recharge, bulk SMS, and shared data bundles for optimized operations. Manage your team's connectivity centrally."
              cta="Business Plans"
            />
          </div>
        </div>
      </section>

      {/* DEVELOPERS BLOCK */}
      <section className="px-4 py-16 lg:px-40 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-3xl" />
        <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined">code</span>
              <span>Built for Developers</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Integrate in minutes, <br /> scale in seconds
            </h2>

            <p className="text-slate-300 text-lg leading-relaxed">
              Our APIs are designed with developer experience first. Comprehensive documentation, SDKs in
              major languages, and a sandbox environment let you start building immediately.
            </p>

            <ul className="flex flex-col gap-3 mt-2">
              <Bullet text="RESTful API Architecture" />
              <Bullet text="99.99% Uptime SLA" />
              <Bullet text="Bank-grade Security (PCI-DSS)" />
            </ul>

            <div className="pt-4">
              <a
                className="inline-flex items-center gap-2 text-white font-bold border-b border-white pb-1 hover:text-primary hover:border-primary transition-colors"
                href="#"
              >
                Read Documentation{" "}
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>

          <CodeCard />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 lg:px-40 bg-background-light dark:bg-background-dark">
        <div className="max-w-[960px] mx-auto bg-primary rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 size-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Ready to scale your infrastructure?
            </h2>
            <p className="text-purple-100 text-lg max-w-2xl">
              Join over 500 enterprise clients who trust Soltelco for their connectivity and payment needs.
              Get a custom quote today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                to="/login"
                className="flex items-center justify-center rounded-lg h-12 px-8 bg-white text-primary text-base font-bold hover:bg-slate-50 transition-colors"
              >
                Get Started
              </Link>
              <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-[#963ebd] text-white text-base font-bold hover:opacity-95 transition-colors border border-primary">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 p-2">
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  cta,
}: {
  icon: string;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-slate-900 dark:text-white text-xl font-bold">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>

      <a className="mt-auto text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all" href="#">
        {cta} <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </a>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="material-symbols-outlined text-green-400">check_circle</span>
      <span className="text-slate-200">{text}</span>
    </li>
  );
}

function CodeCard() {
  return (
    <div className="w-full rounded-xl bg-[#0d141b] border border-slate-700 p-6 shadow-2xl font-mono text-sm relative">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
        <div className="size-3 rounded-full bg-red-500" />
        <div className="size-3 rounded-full bg-yellow-500" />
        <div className="size-3 rounded-full bg-green-500" />
        <div className="ml-auto text-xs text-slate-500">POST /api/v1/sms/send</div>
      </div>

      <div className="text-slate-300 overflow-x-auto">
        <pre className="whitespace-pre">
{`const response = await fetch('https://api.soltelco.com/v1/sms', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_test_51Mz...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Your OTP code is: 4829',
    sender_id: 'Soltelco'
  })
});
const data = await response.json();
console.log(data);`}
        </pre>
      </div>
    </div>
  );
}
