import type { UserRole } from "../auth/portalToken";

export type NavItem = {
  label: string;
  path: string;
  allowed: UserRole[];
};

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Overview", path: "/admin", allowed: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Users", path: "/admin/users", allowed: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Roles", path: "/admin/roles", allowed: ["SUPER_ADMIN"] },
  { label: "Activity", path: "/admin/activity", allowed: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Settings", path: "/admin/settings", allowed: ["ADMIN", "SUPER_ADMIN"] },
];

export const CUSTOMER_NAV_ITEMS: NavItem[] = [
  { label: "Overview", path: "/dashboard", allowed: ["ENTERPRISE", "DEVELOPER", "RESELLER"] },
  { label: "SMS", path: "/sms", allowed: ["ENTERPRISE", "DEVELOPER", "RESELLER"] },
  { label: "API Keys", path: "/api-keys", allowed: ["ENTERPRISE", "DEVELOPER"] },
  { label: "Billing", path: "/billing", allowed: ["ENTERPRISE"] },
  { label: "Reports", path: "/reports", allowed: ["ENTERPRISE", "DEVELOPER"] },
];
