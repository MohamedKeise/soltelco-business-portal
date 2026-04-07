export type PortalType = "admin" | "customer";

export type UserRole =
  | "ENTERPRISE"
  | "DEVELOPER"
  | "RESELLER"
  | "ADMIN"
  | "SUPER_ADMIN";

// Portal-specific storage keys
const ADMIN_TOKEN_KEY = "soltelco_auth_admin_token";
const ADMIN_ROLE_KEY = "soltelco_auth_admin_role";
const ADMIN_EMAIL_KEY = "soltelco_auth_admin_email";

const CUSTOMER_TOKEN_KEY = "soltelco_auth_customer_token";
const CUSTOMER_ROLE_KEY = "soltelco_auth_customer_role";
const CUSTOMER_EMAIL_KEY = "soltelco_auth_customer_email";

function getStorageKeys(portal: PortalType) {
  if (portal === "admin") {
    return {
      token: ADMIN_TOKEN_KEY,
      role: ADMIN_ROLE_KEY,
      email: ADMIN_EMAIL_KEY,
    };
  }
  
  return {
    token: CUSTOMER_TOKEN_KEY,
    role: CUSTOMER_ROLE_KEY,
    email: CUSTOMER_EMAIL_KEY,
  };
}

// Portal-scoped token functions
export function getPortalToken(portal: PortalType): string | null {
  const { token } = getStorageKeys(portal);
  return localStorage.getItem(token);
}

export function setPortalToken(portal: PortalType, token: string): void {
  const { token: tokenKey } = getStorageKeys(portal);
  localStorage.setItem(tokenKey, token);
}

export function clearPortalToken(portal: PortalType): void {
  const { token } = getStorageKeys(portal);
  localStorage.removeItem(token);
}

// Portal-scoped role functions
export function getPortalRole(portal: PortalType): UserRole | null {
  const { role } = getStorageKeys(portal);
  return (localStorage.getItem(role) as UserRole) || null;
}

export function setPortalRole(portal: PortalType, role: UserRole): void {
  const { role: roleKey } = getStorageKeys(portal);
  localStorage.setItem(roleKey, role);
}

export function clearPortalRole(portal: PortalType): void {
  const { role } = getStorageKeys(portal);
  localStorage.removeItem(role);
}

// Portal-scoped email functions
export function getPortalEmail(portal: PortalType): string | null {
  const { email } = getStorageKeys(portal);
  return localStorage.getItem(email);
}

export function setPortalEmail(portal: PortalType, email: string): void {
  const { email: emailKey } = getStorageKeys(portal);
  localStorage.setItem(emailKey, email);
}

export function clearPortalEmail(portal: PortalType): void {
  const { email } = getStorageKeys(portal);
  localStorage.removeItem(email);
}

// Portal-scoped auth management
export function clearPortalAuth(portal: PortalType): void {
  clearPortalToken(portal);
  clearPortalRole(portal);
  clearPortalEmail(portal);
}

// Helper to detect current portal from URL
export function getCurrentPortal(): PortalType {
  return window.location.pathname.startsWith('/admin') ? 'admin' : 'customer';
}
