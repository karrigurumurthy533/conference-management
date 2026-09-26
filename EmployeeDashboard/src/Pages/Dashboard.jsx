function Dashboard() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome to your GlobalScion employee dashboard.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Employees
            </p>

            <p className="mt-2 text-3xl font-bold text-violet-600">
              120
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Projects
            </p>

            <p className="mt-2 text-3xl font-bold text-violet-600">
              24
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Active Tasks
            </p>

            <p className="mt-2 text-3xl font-bold text-violet-600">
              18
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-violet-600">
              86
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;