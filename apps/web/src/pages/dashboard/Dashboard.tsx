import { useAuth } from "../../auth/useAuth";

export default function Dashboard() {
  const { role } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Logged in role: <b>{role || "Unknown"}</b></p>
      <p>Next: role based pages (RBAC).</p>
    </div>
  );
}
