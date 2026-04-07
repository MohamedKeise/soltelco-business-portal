import { Navigate } from "react-router-dom";
import { getPortalRole, getPortalToken } from "../../auth/portalToken";

type Props = {
  children: React.ReactNode;
};

export function CustomerProtectedRoute({ children }: Props) {
  const token = getPortalToken("customer");
  const role = getPortalRole("customer");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const allowed = ["ENTERPRISE", "DEVELOPER", "RESELLER"];

  if (!role || !allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
