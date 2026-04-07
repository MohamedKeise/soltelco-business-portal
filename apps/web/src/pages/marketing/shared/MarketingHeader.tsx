import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import type { Variants } from "framer-motion";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useScopedTheme } from "../../../app/theme/ScopedThemeProvider";
import logo from "../../../assets/marketing/logo.png";

type NavItemType = { to: string; label: string; icon: string; desc: string };

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getFocusable(container: HTMLElement | null) {
  if (!container) return [];
  const selectors = [
    'a[href]:not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  );
}

/** ---------------------------------------------
 *  Premium Desktop Nav Item + Animated Indicator
 *  --------------------------------------------- */
const DesktopNavItem = React.memo(function DesktopNavItem({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        cx(
          "group inline-flex items-center justify-center px-2 py-1 text-[13px] font-semibold tracking-[-0.01em] transition-colors",
          "text-slate-700 hover:!text-primary dark:text-slate-200 dark:hover:!text-primary",
          isActive && "!text-primary dark:!text-primary",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b1220]"
        )
      }
    >
      {({ isActive }) => (
        <span
          className={cx(
            "relative inline-block",
            "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
            "after:bottom-0 after:h-[1.5px] after:rounded-full after:bg-primary",
            "after:transition-all after:duration-300",
            isActive ? "after:w-full" : "after:w-0 group-hover:after:w-full"
          )}
        >
          {label}
        </span>
      )}
    </NavLink>
  );
});

/** ---------------------------------------------
 *  Mobile Nav Item
 *  --------------------------------------------- */
function MobileNavItem({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={to === "/"}
      className={({ isActive }) =>
        [
          "px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
          "text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800",
          isActive ? "bg-primary/10 text-primary dark:text-primary" : "",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function MarketingHeader() {
  const HEADER_H = 64; // 16 * 4px = 64px (h-16)

  const { theme, toggleTheme } = useScopedTheme();
  const location = useLocation();
  const isRolesActive = location.pathname.startsWith("/roles");

  const prefersReducedMotion = useReducedMotion();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [mobileRolesOpen, setMobileRolesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const rolesWrapRef = useRef<HTMLDivElement | null>(null);
  const rolesPanelRef = useRef<HTMLDivElement | null>(null);

  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuJustOpened = useRef(false);

  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const roleItems: NavItemType[] = useMemo(
    () => [
      {
        to: "/roles/enterprise",
        label: "Enterprise",
        icon: "domain",
        desc: "Secure workflows, governance, and scale for large organizations.",
      },
      {
        to: "/roles/developer",
        label: "Developer",
        icon: "code",
        desc: "APIs, docs, and tooling for builders and system integrators.",
      },
      {
        to: "/roles/reseller",
        label: "Reseller",
        icon: "storefront",
        desc: "Partner-ready portal for service providers and resellers.",
      },
    ],
    []
  );

  const topItems = useMemo(
    () => [
      { to: "/solutions", label: "Solutions" },
      { to: "/contact", label: "Contact Us" },
      { to: "/company", label: "About Us" },
    ],
    []
  );

  /** Close menus on route change */
  useEffect(() => {
    setMobileOpen(false);
    setRolesOpen(false);
    setMobileRolesOpen(false);
  }, [location.pathname]);

  /** Scroll behavior */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(y > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Lock body scroll when mobile menu open */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  /** Outside click + ESC */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (
        menuJustOpened.current ||
        (menuButtonRef.current && menuButtonRef.current.contains(e.target as Node))
      ) {
        menuJustOpened.current = false;
        return;
      }

      if (rolesWrapRef.current && !rolesWrapRef.current.contains(e.target as Node)) {
        setRolesOpen(false);
      }

      if (mobileOpen && mobilePanelRef.current && !mobilePanelRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setRolesOpen(false);
        setMobileOpen(false);
        setMobileRolesOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  /** Focus trap for Roles dropdown (desktop) */
  useEffect(() => {
    if (!rolesOpen) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const panel = rolesPanelRef.current;
    const focusables = getFocusable(panel);
    (focusables[0] || panel)?.focus?.();

    const onKeyDown = (e: KeyboardEvent) => {
      if (!rolesOpen) return;
      if (e.key !== "Tab") return;

      const items = getFocusable(panel);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !panel?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lastFocusedRef.current?.focus?.();
      lastFocusedRef.current = null;
    };
  }, [rolesOpen]);

  const closeRoles = useCallback(() => setRolesOpen(false), []);
  const toggleRoles = useCallback(() => setRolesOpen((v) => !v), []);

  /** Motion variants (desktop mega dropdown) */
  const megaContainer = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -8, scale: prefersReducedMotion ? 1 : 0.98 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: prefersReducedMotion
          ? { duration: 0.12 }
          : { type: "spring", stiffness: 520, damping: 36, mass: 0.6, staggerChildren: 0.06, delayChildren: 0.02 },
      },
      exit: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : -8,
        scale: prefersReducedMotion ? 1 : 0.98,
        transition: prefersReducedMotion
          ? { duration: 0.1 }
          : { duration: 0.14, ease: "easeOut", staggerChildren: 0.03, staggerDirection: -1 },
      },
    }),
    [prefersReducedMotion]
  );

  const megaItem = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
      show: {
        opacity: 1,
        y: 0,
        transition: prefersReducedMotion ? { duration: 0.1 } : { type: "spring", stiffness: 560, damping: 32 },
      },
      exit: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 8,
        transition: prefersReducedMotion ? { duration: 0.08 } : { duration: 0.12 },
      },
    }),
    [prefersReducedMotion]
  );


  return (
    <>
      {/* Fixed header */}
      <header
        ref={headerRef}
        className={cx(
          "fixed top-0 left-0 right-0 z-50 w-full h-16",
          "transition-all duration-300",
          scrolled
            ? "border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/90"
            : "bg-white/90 backdrop-blur-md dark:bg-slate-900/90"
        )}
      >
        {/* Ambient top highlight */}
        <div
          className={cx(
            "pointer-events-none absolute inset-x-0 top-0 h-[72px]",
            "bg-gradient-to-b from-primary/10 via-transparent to-transparent",
            "opacity-80 dark:opacity-60"
          )}
          aria-hidden="true"
        />

        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 md:px-10">
          <div className="relative flex w-full items-center justify-between gap-3 md:gap-6">
            {/* Left: Logo */}
            <Link
              to="/"
              className={cx(
                "group flex items-center gap-2.5 rounded-2xl pr-2",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b1220]"
              )}
              aria-label="Soltelco home"
            >
              <div className="relative">
                <div
                  className={cx(
                    "absolute -inset-2 rounded-[18px] opacity-0 blur-xl transition duration-300",
                    "bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.45),transparent_60%)]",
                    "group-hover:opacity-100"
                  )}
                  aria-hidden="true"
                />
                <div
                  className={cx(
                    "relative grid h-11 w-11 place-items-center rounded-2xl",
                    "bg-white/70 dark:bg-white/10",
                    "ring-1 ring-slate-900/[0.08] dark:ring-white/[0.10]",
                    "shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)]",
                    "transition-transform duration-200 group-hover:scale-[1.03] active:scale-[0.99]"
                  )}
                >
                  <img src={logo} alt="Soltelco" className="h-11 w-11 object-contain" />
                </div>
              </div>

              <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-[15px] font-extrabold tracking-[-0.02em] text-slate-900 dark:text-white sm:text-[16px]">
                  Soltelco
                </span>
                <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Business</span>
              </div>
            </Link>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2 rounded-full px-2 py-1" aria-label="Primary">
              <DesktopNavItem to="/" label="Home" />

              {/* Roles dropdown trigger */}
              <div ref={rolesWrapRef} className="relative">
                <button
                  type="button"
                  onClick={toggleRoles}
                  className={cx(
                    "relative inline-flex items-center justify-center gap-1.5 px-2 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-colors",
                    "text-slate-700 hover:!text-primary dark:text-slate-200 dark:hover:!text-primary",
                    isRolesActive && "!text-primary dark:!text-primary",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b1220]"
                  )}
                  aria-haspopup="menu"
                  aria-expanded={rolesOpen}
                  aria-controls="roles-mega"
                >
                  <span
                    className={cx(
                      "relative inline-flex items-center gap-1",
                      "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                      "after:bottom-0 after:h-[1.5px] after:rounded-full after:bg-primary",
                      "after:transition-all after:duration-300",
                      isRolesActive ? "after:w-full" : "after:w-0 group-hover:after:w-full"
                    )}
                  >
                    <span>Roles</span>
                    <motion.span
                      className="material-symbols-outlined text-[18px]"
                      animate={{ rotate: rolesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                    >
                      expand_more
                    </motion.span>
                  </span>
                </button>

                {/* Roles: Premium Mega Dropdown */}
                <AnimatePresence>
                  {rolesOpen && (
                    <motion.div
                      key="roles"
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      variants={megaContainer}
                      className="absolute left-0 top-full z-50 pt-3"
                    >
                      <motion.div
                        id="roles-mega"
                        ref={rolesPanelRef}
                        tabIndex={-1}
                        role="menu"
                        aria-label="Roles menu"
                        className={cx(
                          "w-[720px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl",
                          "bg-white/[0.82] dark:bg-[#0b1220]/[0.78]",
                          "backdrop-blur-2xl",
                          "ring-1 ring-slate-900/[0.10] dark:ring-white/[0.12]",
                          "shadow-[0_30px_80px_-45px_rgba(0,0,0,0.65)]"
                        )}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3 border-b border-slate-900/[0.06] px-5 py-4 dark:border-white/[0.08]">
                          <div className="flex flex-col">
                            <span className="text-sm font-extrabold tracking-[-0.02em] text-slate-900 dark:text-white">
                              Choose your role
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Tailored experiences for every team.
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={closeRoles}
                            className={cx(
                              "inline-flex h-9 w-9 items-center justify-center rounded-2xl transition",
                              "bg-slate-900/[0.04] hover:bg-slate-900/[0.06] active:scale-[0.98]",
                              "dark:bg-white/[0.06] dark:hover:bg-white/[0.08]",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                            )}
                            aria-label="Close roles menu"
                          >
                            <span
                              className="material-symbols-outlined text-[20px] text-slate-700 dark:text-slate-200"
                              aria-hidden="true"
                            >
                              close
                            </span>
                          </button>
                        </div>

                        {/* Content */}
                        <div className="grid gap-4 p-5 md:grid-cols-3">
                          {roleItems.map((it) => (
                            <motion.div key={it.to} variants={megaItem}>
                              <NavLink
                                to={it.to}
                                onClick={() => setRolesOpen(false)}
                                className={({ isActive }) =>
                                  cx(
                                    "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-4 transition",
                                    "ring-1",
                                    isActive
                                      ? "ring-primary/30 bg-primary/10"
                                      : "ring-slate-900/[0.08] bg-slate-900/[0.03] hover:bg-slate-900/[0.05]",
                                    "dark:bg-white/[0.04] dark:hover:bg-white/[0.06] dark:ring-white/[0.10]",
                                    "hover:-translate-y-0.5 active:translate-y-0",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                                  )
                                }
                                role="menuitem"
                              >
                                <div
                                  className={cx(
                                    "pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition duration-300",
                                    "bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent_55%)]",
                                    "group-hover:opacity-100"
                                  )}
                                  aria-hidden="true"
                                />

                                <div className="relative flex items-start justify-between gap-3">
                                  <div
                                    className={cx(
                                      "grid h-11 w-11 place-items-center rounded-2xl",
                                      "bg-white/70 ring-1 ring-slate-900/[0.08] text-slate-800",
                                      "dark:bg-white/[0.06] dark:ring-white/[0.12] dark:text-slate-100",
                                      "transition group-hover:scale-[1.03]"
                                    )}
                                    aria-hidden="true"
                                  >
                                    <span className="material-symbols-outlined text-[22px]">{it.icon}</span>
                                  </div>

                                  <motion.span
                                    className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary"
                                    aria-hidden="true"
                                    initial={false}
                                    animate={prefersReducedMotion ? {} : { x: 0 }}
                                    whileHover={prefersReducedMotion ? {} : { x: 2 }}
                                    transition={{ type: "spring", stiffness: 520, damping: 28 }}
                                  >
                                    arrow_forward
                                  </motion.span>
                                </div>

                                <div className="relative mt-3">
                                  <div className="text-sm font-extrabold tracking-[-0.02em] text-slate-900 dark:text-white">
                                    {it.label}
                                  </div>
                                  <div className="mt-1 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                    {it.desc}
                                  </div>
                                </div>
                              </NavLink>
                            </motion.div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-3 border-t border-slate-900/[0.06] px-5 py-4 dark:border-white/[0.08]">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Not sure where you fit?
                          </span>
                          <Link
                            to="/contact"
                            onClick={() => setRolesOpen(false)}
                            className={cx(
                              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold",
                              "text-primary hover:opacity-90",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                            )}
                          >
                            Talk to sales
                            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                              north_east
                            </span>
                          </Link>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {topItems.map((it) => (
                <DesktopNavItem key={it.to} to={it.to} label={it.label} />
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className={cx(
                  "flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-2xl transition md:h-11 md:w-11",
                  "bg-slate-900/[0.04] hover:bg-slate-900/[0.06] active:scale-[0.98]",
                  "dark:bg-white/[0.06] dark:hover:bg-white/[0.08]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                )}
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme === "dark" ? "moon" : "sun"}
                    className="inline-grid h-[22px] w-[22px] place-items-center"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <span className="material-symbols-outlined text-[18px] leading-none md:text-[20px] text-slate-800 dark:text-slate-100">
                      {theme === "dark" ? "light_mode" : "dark_mode"}
                    </span>
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* Login */}
              <Link
                to="/login"
                className={cx(
                  "hidden sm:flex h-10 items-center justify-center rounded-2xl px-3 text-sm font-extrabold md:h-11 md:px-4",
                  "bg-slate-900/[0.04] text-slate-900 hover:bg-slate-900/[0.06] active:scale-[0.99]",
                  "dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.08]",
                  "ring-1 ring-slate-900/[0.08] dark:ring-white/[0.10]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                )}
              >
                <span className="whitespace-nowrap">Login</span>
              </Link>

              {/* Get Started */}
              <Link
                to="/login"
                className={cx(
                  "hidden sm:flex h-10 items-center justify-center rounded-2xl px-3 text-sm font-extrabold text-white md:h-11 md:px-5",
                  "bg-primary shadow-[0_18px_50px_-30px_rgba(99,102,241,0.95)]",
                  "ring-1 ring-white/15",
                  "transition active:scale-[0.99] hover:brightness-[1.02]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                )}
              >
                <span className="relative z-10 whitespace-nowrap">Get Started</span>
              </Link>

              {/* Mobile menu button */}
              <button
                ref={menuButtonRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  menuJustOpened.current = true;
                  setMobileOpen((prev) => !prev);
                }}
                className={cx(
                  "md:hidden h-10 w-10 rounded-xl transition-colors",
                  "bg-slate-100 text-slate-800 hover:bg-slate-200",
                  "dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
                  "flex items-center justify-center"
                )}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                title="Menu"
              >
                <span className="material-symbols-outlined text-[22px] pointer-events-none">
                  {mobileOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes shine {
            0% { transform: translateX(-120%) rotate(12deg); opacity: 0.0; }
            20% { opacity: 0.35; }
            55% { opacity: 0.25; }
            100% { transform: translateX(220%) rotate(12deg); opacity: 0.0; }
          }
        `}</style>
      </header>

      {/* Mobile menu overlay + panel (NOT inside header -> avoids clipping, stays below the fixed header) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="mobile-panel"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: "easeOut" }}
              className="fixed inset-x-0 z-[45] md:hidden"
              style={{
                top: HEADER_H,
                maxHeight: `calc(100vh - ${HEADER_H}px)`,
              }}
            >
              <div
                ref={mobilePanelRef}
                className={cx(
                  "mx-4 mt-3 rounded-2xl border border-slate-200 dark:border-slate-800",
                  "bg-white/90 dark:bg-[#0f1822]/90 backdrop-blur-md overflow-hidden"
                )}
                style={{ maxHeight: `calc(100vh - ${HEADER_H}px - 24px)` }}
              >
                <div className="max-h-full overflow-y-auto overscroll-contain">
                  {/* Login + Get Started */}
                  <div className="flex flex-row gap-3 p-3 border-b border-slate-200/50 dark:border-slate-800/50">
                    <Link
                      to="/login"
                      className={cx(
                        "flex-1 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold",
                        "bg-slate-900/[0.04] text-slate-900 hover:bg-slate-900/[0.06]",
                        "dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.08]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      Client Login
                    </Link>

                    <Link
                      to="/login"
                      className={cx(
                        "flex-1 flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-white",
                        "hover:brightness-105 active:brightness-95",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>

                  <div className="p-3 flex flex-col gap-2">
                    <MobileNavItem to="/" label="Home" onClick={() => setMobileOpen(false)} />

                    {/* Roles accordion */}
                    <button
                      type="button"
                      onClick={() => setMobileRolesOpen((v) => !v)}
                      className={cx(
                        "px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                        "text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800",
                        "flex items-center justify-between"
                      )}
                      aria-expanded={mobileRolesOpen}
                      aria-controls="mobile-roles"
                    >
                      <span>Roles</span>
                      <span className="material-symbols-outlined text-[20px]">
                        {mobileRolesOpen ? "expand_less" : "expand_more"}
                      </span>
                    </button>

                    {mobileRolesOpen && (
                      <div id="mobile-roles" className="pl-2 flex flex-col gap-2">
                        {roleItems.map((it) => (
                          <MobileNavItem
                            key={it.to}
                            to={it.to}
                            label={it.label}
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileRolesOpen(false);
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {topItems.map((it) => (
                      <MobileNavItem key={it.to} to={it.to} label={it.label} onClick={() => setMobileOpen(false)} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
