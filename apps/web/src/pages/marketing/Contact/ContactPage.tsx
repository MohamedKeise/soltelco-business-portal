import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/marketing/logo.png";

type FormState = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  interest: "Enterprise" | "Developer" | "Reseller";
};

const initialState: FormState = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  interest: "Enterprise",
};

const SOLTELCO_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d668.038542714243!2d44.059424709291086!3d9.5611775555762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sso!4v1767194846958!5m2!1sen!2sso";

const SOLTELCO_GOOGLE_MAPS_LINK =
  "https://www.google.com/maps?q=9.561077318464793,44.05967818306133";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim().length >= 2 &&
      form.email.trim().includes("@") &&
      form.subject.trim().length >= 3 &&
      form.message.trim().length >= 10
    );
  }, [form]);

  const onChange = (key: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [key]: value } as FormState));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <main className="flex flex-col w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden">
      {/* HERO */}
      <section className="flex justify-center px-4 py-12 md:py-16 lg:px-40 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-start relative z-10">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">support_agent</span>
                Contact Us
              </span>

              <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                Reply in 24 hours
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Talk to Soltelco <br />
              Sales and Support
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-xl">
              Get help with enterprise onboarding, API integration, reseller partnership, or general
              inquiries. We usually respond within 24 hours.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/solutions"
                className="group flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:opacity-95 transition shadow-lg shadow-primary/25"
              >
                View Solutions
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </Link>

              <Link
                to="/company"
                className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                About Company
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <InfoCard
                icon="mail"
                title="Email"
                value="support@soltelco.com"
                hint="For support and onboarding"
              />
              <InfoCard
                icon="call"
                title="Phone"
                value="+252 67 000 0000"
                hint="Business hours support"
              />
              <InfoCard
                icon="location_on"
                title="Office"
                value="Hargeisa, Somaliland"
                hint="Head office location"
              />
              <InfoCard
                icon="verified"
                title="Priority support"
                value="Enterprise available"
                hint="For partner customers"
              />
            </div>
          </div>

          {/* FORM */}
          <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            <div className="relative p-6 md:p-7 border-b border-slate-200 dark:border-slate-800">
              <div className="absolute -top-20 -right-20 size-56 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3 relative">
                <div>
                  <h2 className="text-xl font-black">Send us a message</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Fill the form and our team will contact you.
                  </p>
                </div>
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">support_agent</span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-7">
              {submitted ? (
                <SuccessCard
                  onReset={() => {
                    setSubmitted(false);
                    setForm(initialState);
                  }}
                />
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Full name"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={(v) => onChange("fullName", v)}
                    />
                    <Field
                      label="Company"
                      placeholder="Company name"
                      value={form.company}
                      onChange={(v) => onChange("company", v)}
                      optional
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(v) => onChange("email", v)}
                      type="email"
                    />
                    <Field
                      label="Phone"
                      placeholder="+252 ..."
                      value={form.phone}
                      onChange={(v) => onChange("phone", v)}
                      optional
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      label="I'm interested in"
                      value={form.interest}
                      onChange={(v) => onChange("interest", v)}
                      options={["Enterprise", "Developer", "Reseller"]}
                    />
                    <Field
                      label="Subject"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={(v) => onChange("subject", v)}
                    />
                  </div>

                  <TextArea
                    label="Message"
                    placeholder="Tell us a bit about your request..."
                    value={form.message}
                    onChange={(v) => onChange("message", v)}
                  />

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={[
                      "flex items-center justify-center gap-2 rounded-lg h-12 px-6 text-base font-bold transition",
                      canSubmit
                        ? "bg-primary text-white hover:opacity-95 shadow-lg shadow-primary/25"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed",
                    ].join(" ")}
                  >
                    Send Message
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 p-4">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-black">Privacy note</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                          We only use your details to respond to your request. We do not share your
                          information.
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAP / LOCATION BLOCK */}
      <section className="px-4 pb-16 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 relative overflow-hidden">
            <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 relative">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">location_on</span>
              </div>
              <div>
                <h3 className="text-xl font-black">Our location</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Visit us or contact the nearest office.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <MiniLine icon="place" title="City" value="Hargeisa" />
              <MiniLine icon="public" title="Country" value="Somaliland" />
             <MiniLine icon="schedule" title="Hours" value="All days, 7am to 10pm" />
              <MiniLine icon="verified_user" title="Support" value="Sales + Technical" />
              <MiniLine icon="my_location" title="Coordinates" value="9.5610773, 44.0596782" />
              <MiniLine icon="pin_drop" title="Plus code" value="H365+CPF" />
            </div>

            <div className="mt-6 relative">
              <Link
                to="/company"
                className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-90 transition"
              >
                Learn about Soltelco
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 overflow-hidden relative min-h-[380px]">
            <iframe
              title="Soltelco Location"
              src={SOLTELCO_MAP_EMBED}
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Top label */}
            <div className="absolute top-2 left-2 right-4 flex items-start justify-between gap-2 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/90 dark:bg-[#0f1822]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-2 shadow-sm">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 shadow-sm flex items-center justify-center">
                  <div className="h-9 w-9 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center">
                    <img src={logo} alt="Soltelco" className="h-6 w-6 object-contain" />
                  </div>
                </div>

                <div className="flex flex-col leading-tight">
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    Soltelco Headquarter
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    H365+CPF, Hargeisa
                  </div>
                </div>
              </div>

             
            </div>

            {/* Bottom button (keeps away from attribution) */}
            <div className="absolute left-4 right-4 bottom-5 flex items-center justify-center pointer-events-none">
              <a
                href={SOLTELCO_GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl h-12 px-6
                           bg-primary text-white text-sm font-black
                           shadow-2xl shadow-primary/35
                           hover:shadow-primary/50 hover:-translate-y-[1px]
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <span className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">map</span>
                </span>

                <span>Open in Google Maps</span>

                <span className="material-symbols-outlined text-[18px] opacity-90 group-hover:translate-x-0.5 transition-transform">
                  open_in_new
                </span>
              </a>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* MINI FAQ */}
      <section className="px-4 pb-20 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <div className="flex flex-col gap-3 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Quick answers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Common questions before contacting sales and support.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FaqCard
              q="Do you provide enterprise onboarding?"
              a="Yes, we support enterprise onboarding with account setup, billing, and service provisioning."
              icon="domain"
            />
            <FaqCard
              q="Do you have API documentation?"
              a="Yes, developers can integrate using secure APIs. We also provide testing and sandbox options."
              icon="code"
            />
            <FaqCard
              q="How can resellers partner with Soltelco?"
              a="Resellers can apply through the portal. We support partner onboarding and customer provisioning."
              icon="storefront"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  value,
  hint,
}: {
  icon: string;
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-black">{title}</div>
          <div className="text-sm text-slate-700 dark:text-slate-200 mt-0.5">{value}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-slate-900 dark:text-white">
        {label}{" "}
        {optional ? <span className="text-xs text-slate-500 font-semibold">(optional)</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 px-4 text-sm
                   outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-slate-900 dark:text-white">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 px-4 text-sm
                   outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
      >
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-slate-900 dark:text-white">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 px-4 py-3 text-sm
                   outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition resize-none"
      />
    </label>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 p-6">
      <div className="flex items-start gap-3">
        <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xl font-black">Message sent</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Thanks, we received your request. Our team will contact you soon.
          </div>

          <button
            type="button"
            onClick={onReset}
            className="mt-2 w-fit rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold hover:opacity-95 transition shadow-lg shadow-primary/25"
          >
            Send another
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniLine({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
      <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-black">{title}</div>
        <div className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function FaqCard({ q, a, icon }: { q: string; a: string; icon: string }) {
  return (
    <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="mt-4 text-slate-900 dark:text-white text-lg font-black">{q}</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{a}</p>
    </div>
  );
}
