export default function AdminPage() {
  const stats = [
    { label: "Total Users", value: "1,248" },
    { label: "Active Customers", value: "892" },
    { label: "Pending Requests", value: "18" },
    { label: "Monthly Revenue", value: "$12,480" },
  ];

  const quickActions = [
    "Create User",
    "Manage Roles",
    "View Reports",
  ];

  const recentActivities = [
    "New enterprise account created",
    "Admin updated customer permissions",
    "Monthly billing report generated",
    "Customer password reset requested",
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor users, roles, activity, and business performance.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>

          <div className="mt-4 flex flex-col gap-3">
            {quickActions.map((action) => (
              <button
                key={action}
                className="rounded-xl bg-primary px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-primary/80"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>

          <div className="mt-4 space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity}
                className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}