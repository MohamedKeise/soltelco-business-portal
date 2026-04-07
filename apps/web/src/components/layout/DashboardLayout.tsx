import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type DashboardLayoutProps = {
  portal: "admin" | "customer";
};

function DashboardLayoutInner({ portal }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="relative flex min-h-screen">
        <Sidebar
          portal={portal}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />

          <main className="flex flex-1 flex-col p-4 md:p-6">
          <div className="mx-auto flex min-h-full w-full max-w-7xl flex-1 flex-col">
            <div className="flex-1">
              <Outlet />
            </div>

            <footer className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
              © 2026 Soltelco Business Portal. All rights reserved.
            </footer>
          </div>
        </main>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className={`absolute top-1/2 z-30 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition hover:scale-105 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 md:flex ${
            collapsed ? "left-[80px]" : "left-64"
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined text-[20px]">
            {collapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ portal }: DashboardLayoutProps) {
  return <DashboardLayoutInner portal={portal} />;
}
