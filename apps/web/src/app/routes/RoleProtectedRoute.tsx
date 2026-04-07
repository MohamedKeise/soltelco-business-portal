import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import type { UserRole } from "../../auth/portalToken";

export function RoleProtectedRoute({
  allowed,
  children,
}: {
  allowed: UserRole[];
  children: React.ReactNode;
}) {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!role) return <Navigate to="/login" replace />;
  if (!allowed.includes(role)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
