import { useCallback } from "react";
import { clearPortalAuth, getPortalEmail, getPortalRole, getPortalToken, getCurrentPortal } from "./portalToken";

export function useAuth() {
  const currentPortal = getCurrentPortal();
  const token = getPortalToken(currentPortal);
  const role = getPortalRole(currentPortal);
  const email = getPortalEmail(currentPortal);

  const logout = useCallback(() => {
    clearPortalAuth(currentPortal);
    // Check if current path is in admin portal and redirect accordingly
    const isAdminPortal = currentPortal === 'admin';
    window.location.href = isAdminPortal ? "/admin/login" : "/login";
  }, [currentPortal]);

  return {
    token,
    role,
    email,
    isLoggedIn: Boolean(token),
    logout,
  };
}
