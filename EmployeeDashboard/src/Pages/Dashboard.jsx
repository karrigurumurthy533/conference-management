import { useEffect, useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  FileText,
  UserPlus,
  Users,
  UserRound,
  RefreshCw,
} from "lucide-react";

import { getEmployeeDashboardApi } from "../api/employeeApis";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH EMPLOYEE DASHBOARD
  // ======================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEmployeeDashboardApi();

      if (response?.success) {
        setDashboardData(response?.data || {});
      } else {
        setDashboardData({});
        setError(
          response?.message || "Failed to load dashboard"
        );
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);

      setDashboardData({});
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ======================================================
  // NORMALIZE DASHBOARD DATA
  // ======================================================

  const data = dashboardData || {};

  const totalRegistrations =
    data?.totalRegistrations ??
    data?.registrationsCount ??
    data?.registrations ??
    0;

  const totalSpeakers =
    data?.totalSpeakers ??
    data?.speakersCount ??
    data?.speakers ??
    0;

  const totalAbstracts =
    data?.totalAbstracts ??
    data?.abstractsCount ??
    data?.abstracts ??
    0;

  const totalAttendances =
    data?.totalAttendances ??
    data?.totalAttendance ??
    data?.attendancesCount ??
    data?.attendance ??
    0;

  // ======================================================
  // LATEST ACTIVITY
  // Backend:
  // data.latestActivity
  // ======================================================

  const recentActivities =
    Array.isArray(data?.latestActivity)
      ? data.latestActivity
      : Array.isArray(data?.recentActivities)
      ? data.recentActivities
      : Array.isArray(data?.activities)
      ? data.activities
      : Array.isArray(data?.recentActivity)
      ? data.recentActivity
      : [];

  // ======================================================
  // STATS
  // ======================================================

  const stats = [
    {
      title: "Total Registrations",
      value: totalRegistrations,
      icon: UserPlus,
    },
    {
      title: "Total Speakers",
      value: totalSpeakers,
      icon: UserRound,
    },
    {
      title: "Total Abstracts",
      value: totalAbstracts,
      icon: FileText,
    },
    {
      title: "Total Attendences",
      value: totalAttendances,
      icon: Users,
    },
  ];

  // ======================================================
  // ACTIVITY HELPERS
  // ======================================================

  const getActivityType = (activity) => {
    return (
      activity?.type ||
      activity?.category ||
      activity?.activityType ||
      "Activity"
    );
  };

  const getActivityTitle = (activity) => {
    return (
      activity?.title ||
      activity?.name ||
      activity?.message ||
      "New activity"
    );
  };

  const getActivityDescription = (activity) => {
    return (
      activity?.description ||
      activity?.details ||
      activity?.message ||
      "A new activity was recorded."
    );
  };

  const getActivityDate = (activity) => {
    const date =
      activity?.createdAt ||
      activity?.updatedAt ||
      activity?.date;

    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  const getActivityIcon = (type) => {
    const normalizedType = String(type).toLowerCase();

    if (
      normalizedType.includes("registration") ||
      normalizedType.includes("register")
    ) {
      return (
        <UserPlus
          size={16}
          strokeWidth={2}
          className="text-[#8138A2]"
        />
      );
    }

    if (normalizedType.includes("speaker")) {
      return (
        <UserRound
          size={16}
          strokeWidth={2}
          className="text-[#8138A2]"
        />
      );
    }

    if (normalizedType.includes("abstract")) {
      return (
        <FileText
          size={16}
          strokeWidth={2}
          className="text-[#8138A2]"
        />
      );
    }

    if (normalizedType.includes("brochure")) {
      return (
        <FileText
          size={16}
          strokeWidth={2}
          className="text-[#8138A2]"
        />
      );
    }

    return (
      <CalendarDays
        size={16}
        strokeWidth={2}
        className="text-[#8138A2]"
      />
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-60px)] bg-[#f7f7fb] px-5 py-5">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-gray-100 bg-white px-4 py-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-3 w-28 rounded bg-gray-200" />
                    <div className="mt-3 h-7 w-16 rounded bg-gray-200" />
                  </div>

                  <div className="h-9 w-9 rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 animate-pulse rounded-xl border border-gray-100 bg-white">
            <div className="border-b border-gray-100 px-4 py-4">
              <div className="h-4 w-32 rounded bg-gray-200" />

              <div className="mt-2 h-3 w-64 rounded bg-gray-200" />
            </div>

            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex gap-3 border-b border-gray-100 px-4 py-4"
              >
                <div className="h-8 w-8 rounded-lg bg-gray-200" />

                <div className="flex-1">
                  <div className="h-3 w-48 rounded bg-gray-200" />

                  <div className="mt-2 h-3 w-72 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <section className="min-h-[calc(100vh-60px)] bg-[#f7f7fb] px-5 py-5">
        <div className="mx-auto flex min-h-[400px] w-full max-w-[1400px] items-center justify-center">
          <div className="rounded-xl border border-red-100 bg-white px-8 py-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-sm font-semibold text-gray-900">
              Unable to load dashboard
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDashboard}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#8138A2] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#8138A2]"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ======================================================
  // DASHBOARD
  // ======================================================

  return (
    <section className="min-h-[calc(100vh-60px)] bg-[#f7f7fb] px-5 py-5">
      <div className="mx-auto w-full max-w-[1400px]">

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="
                  rounded-xl
                  border
                  border-gray-100
                  bg-white
                  px-4
                  py-4
                  shadow-[0_2px_8px_rgba(0,0,0,0.03)]
                  transition
                  hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)]
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <p className="mt-1.5 text-[24px] font-bold leading-none text-gray-900">
                      {Number(stat.value || 0).toLocaleString()}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-purple-50
                    "
                  >
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className="text-[#8138A2]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            RECENT ACTIVITIES
        ====================================================== */}

        <div
          className="
            mt-5
            overflow-hidden
            rounded-xl
            border
            border-gray-100
            bg-white
            shadow-[0_2px_8px_rgba(0,0,0,0.03)]
          "
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h2 className="text-[14px] font-semibold text-gray-900">
                Recent Activities
              </h2>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Latest activities across your conferences.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDashboard}
              disabled={loading}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                px-3
                py-1.5
                text-[11px]
                font-medium
                text-gray-900
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>

          {/* Activity List */}

          {recentActivities.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <CalendarDays
                  size={18}
                  className="text-[#8138A2]"
                />
              </div>

              <p className="mt-3 text-sm font-medium text-gray-800">
                No recent activities
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Recent conference activities will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity, index) => {
                const type = getActivityType(activity);

                return (
                  <div
                    key={
                      activity?.data?._id ||
                      activity?._id ||
                      activity?.id ||
                      index
                    }
                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      transition
                      hover:bg-gray-50/70
                    "
                  >
                    {/* Icon */}

                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-purple-50
                      "
                    >
                      {getActivityIcon(type)}
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-[12px] font-semibold text-gray-800">
                          {getActivityTitle(activity)}
                        </h3>

                        <span
                          className="
                            rounded-full
                            bg-purple-50
                            px-2
                            py-0.5
                            text-[9px]
                            font-medium
                            text-[#8138A2]
                          "
                        >
                          {type}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-[11px] text-gray-500">
                        {getActivityDescription(activity)}
                      </p>
                    </div>

                    {/* Date */}

                    <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                      <CalendarDays
                        size={13}
                        strokeWidth={1.8}
                        className="text-gray-400"
                      />

                      <span className="text-[10px] text-gray-400">
                        {getActivityDate(activity)}
                      </span>
                    </div>

                    {/* Status */}

                    <div className="hidden shrink-0 md:block">
                      <CheckCircle2
                        size={16}
                        strokeWidth={1.8}
                        className="text-green-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;