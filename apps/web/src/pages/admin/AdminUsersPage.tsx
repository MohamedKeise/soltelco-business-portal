import { useState, useEffect } from "react";
import { postJson } from "../../api/httpClient";
import { useAuth } from "../../auth/useAuth";
import type { UserRole } from "../../auth/portalToken";

type CreateUserResponse = {
  id: string;
  email: string;
  role: UserRole;
};

const ROLE_OPTIONS: UserRole[] = [
  "ENTERPRISE",
  "DEVELOPER",
  "RESELLER",
  "ADMIN",
  "SUPER_ADMIN",
];

export default function AdminUsersPage() {
  const { role: currentRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("ENTERPRISE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 4000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const allowedRoles =
    currentRole === "SUPER_ADMIN"
      ? ROLE_OPTIONS
      : ROLE_OPTIONS.filter(
          (r) => r === "ENTERPRISE" || r === "DEVELOPER" || r === "RESELLER"
        );

  useEffect(() => {
    if (!allowedRoles.includes(role)) {
      setRole(allowedRoles[0]);
    }
  }, [allowedRoles, role]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await postJson<CreateUserResponse>(
        "/api/admin/users",
        { email, password, role },
        { auth: true }
      );

      setSuccess(`User created successfully: ${data.email} (${data.role})`);
      setEmail("");
      setPassword("");
      setRole("ENTERPRISE");
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Users
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create and manage admin and customer accounts.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create User
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add a new user account and assign a role.
          </p>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
              {success}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@company.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter temporary password"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-primary/30"
              >
                {allowedRoles.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notes
          </h2>

          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              Admins can only create customer roles.
            </p>
            <p>
              Super admins can create both admin and customer roles.
            </p>
            <p>
              Backend validation will enforce these rules automatically.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
