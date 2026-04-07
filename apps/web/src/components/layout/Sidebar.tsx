import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { ADMIN_NAV_ITEMS, CUSTOMER_NAV_ITEMS } from "../../config/navigation";
import logo from "../../assets/marketing/logo.png";
import profileImage from "../../assets/default avatar image.jpg";

type SidebarProps = {
  portal: "admin" | "customer";
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function Sidebar({
  portal,
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { role, email } = useAuth();

  const navItems = portal === "admin" ? ADMIN_NAV_ITEMS : CUSTOMER_NAV_ITEMS;

  const items = navItems.filter((item) =>
    role ? item.allowed.includes(role) : false
  );

  const sidebarWidthClass = collapsed ? "w-[80px]" : "w-64";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen shrink-0 overflow-hidden border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-all duration-300 md:static md:z-auto ${sidebarWidthClass} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5 dark:border-gray-800">
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} w-full overflow-hidden`}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
                <img
                  src={logo}
                  alt="Soltelco"
                  className="h-13 w-13 object-contain"
                />
              </div>

              {!collapsed ? (
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-bold text-gray-900 dark:text-white">
                    Soltelco
                  </p>
                  <p className="truncate text-xs font-medium uppercase tracking-[0.16em] text-primary dark:text-primary/70">
                    Business
                  </p>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              className="ml-2 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white md:hidden"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            {!collapsed ? (
              <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">
                {portal === "admin" ? "Admin Portal" : "Customer Portal"}
              </p>
            ) : null}

            <nav className="flex flex-col gap-2">
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin" || item.path === "/app/dashboard"}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `group flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary/90"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    } ${collapsed ? "justify-center" : "gap-3"}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {getNavIcon(item.label)}
                  </span>

                  {!collapsed ? <span>{item.label}</span> : null}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-200 p-3 dark:border-gray-800">
            {collapsed ? (
              <div className="flex justify-center rounded-2xl bg-gray-50 p-3 dark:bg-gray-950">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-3xl bg-gray-50 p-4 dark:bg-gray-950">
                <div className="flex items-center gap-3">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-gray-900 dark:text-white">
                      {formatRole(role)}
                    </p>
                    <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                      {email || "No email available"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function formatRole(role: string | null) {
  if (!role) return "Unknown";
  return role.replaceAll("_", " ");
}

function getNavIcon(label: string) {
  switch (label) {
    case "Overview":
      return "grid_view";
    case "Users":
      return "group";
    case "Roles":
      return "verified_user";
    case "Activity":
      return "monitoring";
    case "Settings":
      return "settings";
    case "SMS":
      return "sms";
    case "API Keys":
      return "key";
    case "Billing":
      return "receipt_long";
    case "Reports":
      return "bar_chart";
    default:
      return "dashboard";
  }
}
