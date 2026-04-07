import { Link } from "react-router-dom";
import logo from "../../../assets/marketing/logo.png";

export default function MarketingFooter() {
  return (
    <footer className="bg-white dark:bg-[#0f1822] border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        {/* Top grid */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {/* Logo badge (same style as header) */}
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 shadow-sm flex items-center justify-center">
                <div className="h-7 w-7 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Soltelco"
                    className="h-10 w-10 object-contain"
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Soltelco
              </h3>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Building the digital backbone for tomorrow&apos;s enterprises.
            </p>

            <div className="flex items-center gap-4 pt-2 text-slate-400">
              <a
                className="hover:text-primary transition-colors"
                href="#"
                aria-label="Website"
              >
                <span className="material-symbols-outlined">public</span>
              </a>
              <a
                className="hover:text-primary transition-colors"
                href="#"
                aria-label="Email"
              >
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Solutions
            </h4>
            <FooterLink label="Waafipay API" to="#" />
            <FooterLink label="SMS Gateway" to="#" />
            <FooterLink label="IoT Connectivity" to="#" />
            <FooterLink label="Bulk Services" to="#" />
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Company
            </h4>
            <FooterLink label="About Us" to="#" />
            <FooterLink label="Careers" to="#" />
            <FooterLink label="Blog" to="#" />
            <FooterLink label="Contact" to="#" />
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Latest API updates and tech news.
            </p>

            <div className="mt-2 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 text-sm
                           text-slate-900 dark:text-white placeholder:text-slate-500
                           outline-none ring-0 focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                className="h-11 w-11 rounded-xl bg-primary text-white flex items-center justify-center
                           hover:opacity-95 transition shadow-lg shadow-primary/20"
                aria-label="Send"
                title="Send"
              >
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />

        {/* Bottom bar */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2025 Soltelco. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link className="hover:text-primary transition-colors" to="#">
              Privacy Policy
            </Link>
            <Link className="hover:text-primary transition-colors" to="#">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label, to }: { label: string; to: string }) {
  return (
    <a
      href={to}
      className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors w-fit"
    >
      {label}
    </a>
  );
}
