import { Navigate } from "react-router-dom";
import { getPortalRole, getPortalToken } from "../../auth/portalToken";

type Props = {
  children: React.ReactNode;
};

export function AdminProtectedRoute({ children }: Props) {
  const token = getPortalToken("admin");
  const role = getPortalRole("admin");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
