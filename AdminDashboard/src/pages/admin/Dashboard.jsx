import React, { useEffect } from "react";

import {
  CalendarDays,
  Users,
  ClipboardList,
  Mic2,
  UserCheck,
  FileText,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { useDispatch, useSelector } from "react-redux";

import {
  getAdminStatistics,
  getAdminDashboardOverview,

  selectAdminStatistics,
  selectAdminError,

  selectRegistrationOverview,
  selectRecentConferences,
  selectRecentActivities,
} from "../../redux/dashboardSlice";


// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
  const dispatch = useDispatch();


  // ==========================================================
  // REDUX STATE
  // ==========================================================

  const statistics = useSelector(
    selectAdminStatistics
  );

  const error = useSelector(
    selectAdminError
  );

  const registrationOverview = useSelector(
    selectRegistrationOverview
  );

  const recentConferences = useSelector(
    selectRecentConferences
  );

  const recentActivities = useSelector(
    selectRecentActivities
  );


  // ==========================================================
  // FETCH DASHBOARD DATA
  // ==========================================================

  useEffect(() => {
    dispatch(getAdminStatistics());

    dispatch(getAdminDashboardOverview());
  }, [dispatch]);


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const stats = [
    {
      title: "Conferences",
      value:
        statistics?.totalConferences ?? 0,
      change: "Total conferences",
      icon: CalendarDays,
    },

    {
      title: "Employees",
      value:
        statistics?.totalEmployees ?? 0,
      change: "Active employees",
      icon: Users,
    },

    {
      title: "Registrations",
      value:
        statistics?.totalRegistrations ?? 0,
      change: "Total registrations",
      icon: ClipboardList,
    },

    {
      title: "Revenue",
      value:
        statistics?.totalRevenue ?? 0,
      change: "Paid registrations",
      icon: CreditCard,
    },

    {
      title: "Speakers",
      value:
        statistics?.totalSpeakers ?? 0,
      change: "Total speakers",
      icon: Mic2,
    },
  ];


  // ==========================================================
  // FORMAT NUMBER
  // ==========================================================

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(
      Number(value || 0)
    );
  };


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };


  // ==========================================================
  // GET CONFERENCE TITLE
  // ==========================================================

  const getConferenceTitle = (
    conference
  ) => {
    return (
      conference?.basicInformation
        ?.conferenceTitle ||

      conference?.basicInformation
        ?.title ||

      conference?.conferenceTitle ||

      conference?.title ||

      conference?.name ||

      "Untitled Conference"
    );
  };


  // ==========================================================
  // GET CONFERENCE DATE
  // ==========================================================

  const getConferenceDate = (
    conference
  ) => {
    const dates =
      conference?.conferenceDates;

    if (!dates) {
      return formatDate(
        conference?.createdAt
      );
    }


    const startDate =
      dates?.startDate ||
      dates?.start ||
      dates?.from;


    const endDate =
      dates?.endDate ||
      dates?.end ||
      dates?.to;


    if (startDate && endDate) {
      return `${formatDate(
        startDate
      )} – ${formatDate(endDate)}`;
    }


    if (startDate) {
      return formatDate(startDate);
    }


    return formatDate(
      conference?.createdAt
    );
  };


  // ==========================================================
  // GET CONFERENCE STATUS
  // ==========================================================

  const getConferenceStatus = (
    conference
  ) => {
    return (
      conference?.status ||
      conference?.basicInformation
        ?.status ||
      "Upcoming"
    );
  };


  // ==========================================================
  // ACTIVITY ICON
  // ==========================================================

  const getActivityIcon = (
    type
  ) => {
    switch (type) {
      case "registration":
        return UserCheck;

      case "conference":
        return CalendarDays;

      case "speaker":
        return Mic2;

      case "payment":
        return CreditCard;

      case "abstract":
        return FileText;

      default:
        return CalendarDays;
    }
  };


  // ==========================================================
  // ACTIVITY TIME
  // ==========================================================

  const getActivityTime = (
    date
  ) => {
    if (!date) {
      return "";
    }

    const activityDate =
      new Date(date);

    if (
      Number.isNaN(
        activityDate.getTime()
      )
    ) {
      return "";
    }

    const now = new Date();

    const difference =
      now.getTime() -
      activityDate.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;
    }

    return formatDate(date);
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-[#f8f8fc]">

      <main className="w-full px-3 pt-2.5 pb-3 sm:px-4">


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-[10px] text-red-600">

            <AlertCircle size={14} />

            <span>
              {error}
            </span>

          </div>
        )}


        {/* ==================================================
            STATISTICS
        ================================================== */}

        <section className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-5">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-[0_1px_5px_rgba(0,0,0,0.025)] transition-all duration-200 hover:border-violet-200 hover:shadow-[0_3px_10px_rgba(124,58,237,0.06)]"
              >

                <div className="flex items-start justify-between gap-2">

                  <div className="min-w-0">

                    <p className="text-[11px] font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <p className="mt-1 text-[19px] font-semibold leading-none tracking-tight text-gray-900">
                      {formatNumber(
                        stat.value
                      )}
                    </p>

                  </div>


                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">

                    <Icon
                      size={16}
                      strokeWidth={1.8}
                    />

                  </div>

                </div>


                <div className="mt-2.5 flex items-center gap-1 text-[9px] font-medium text-emerald-600">

                  <TrendingUp
                    size={10}
                    strokeWidth={2}
                  />

                  <span>
                    {stat.change}
                  </span>

                </div>

              </div>
            );
          })}

        </section>


        {/* ==================================================
            CHART + RECENT CONFERENCES
        ================================================== */}

        <section className="mt-3 grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-3">


          {/* ==================================================
              REGISTRATION BAR CHART
          ================================================== */}

          <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-[0_1px_5px_rgba(0,0,0,0.025)] xl:col-span-2">

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">

                <h2 className="text-[13px] font-semibold text-gray-900">
                  Registrations Overview
                </h2>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Monthly registration performance
                </p>

              </div>


              <button
                type="button"
                className="shrink-0 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[9px] font-medium text-gray-600 transition hover:border-violet-200 hover:text-violet-600"
              >
                Last 12 Months
              </button>

            </div>


            <div className="mt-1.5 h-[220px] w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={
                    registrationOverview
                  }
                  margin={{
                    top: 8,
                    right: 3,
                    left: -24,
                    bottom: 0,
                  }}
                >

                  {/* ==================================================
                      BAR GRADIENT
                  ================================================== */}

                  <defs>

                    <linearGradient
                      id="registrationBarGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#a855f7"
                      />

                      <stop
                        offset="100%"
                        stopColor="#7c3aed"
                      />

                    </linearGradient>

                  </defs>


                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eeeeF4"
                  />


                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: "#9ca3af",
                    }}
                  />


                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 8,
                      fill: "#9ca3af",
                    }}
                    domain={[0, "auto"]}
                    allowDecimals={false}
                  />


                  <Bar
                    dataKey="registrations"
                    fill="url(#registrationBarGradient)"
                    radius={[
                      4,
                      4,
                      0,
                      0,
                    ]}
                    barSize={18}
                    activeBar={false}
                    isAnimationActive={true}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>


          <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-[0_1px_5px_rgba(0,0,0,0.025)]">

            <div className="flex items-center justify-between gap-2">

              <div className="min-w-0">

                <h2 className="text-[13px] font-semibold text-gray-900">
                  Recent Conferences
                </h2>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Latest conference activity
                </p>

              </div>


              <button
                type="button"
                className="shrink-0 text-[10px] font-medium text-violet-600 transition hover:text-violet-700"
              >
                View All
              </button>

            </div>


            <div className="mt-2">

              {recentConferences.map(
                (conference, index) => {

                  const title =
                    getConferenceTitle(
                      conference
                    );

                  const date =
                    getConferenceDate(
                      conference
                    );

                  const status =
                    getConferenceStatus(
                      conference
                    );

                  return (
                    <div
                      key={
                        conference?._id ||
                        conference?.id ||
                        title
                      }
                      className={`flex items-center justify-between gap-2 py-2.5 ${
                        index !==
                        recentConferences.length -
                          1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-[11px] font-medium text-gray-800">
                          {title}
                        </p>

                        <p className="mt-0.5 text-[9px] text-gray-400">
                          {date}
                        </p>

                      </div>


                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-medium ${
                          status ===
                          "Upcoming"
                            ? "bg-violet-50 text-violet-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {status}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </section>


        {/* ==================================================
            RECENT ACTIVITIES
        ================================================== */}

        <section className="mt-3 rounded-lg border border-gray-200 bg-white p-3 shadow-[0_1px_5px_rgba(0,0,0,0.025)]">

          <div>

            <h2 className="text-[13px] font-semibold text-gray-900">
              Recent Activities
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Latest updates from your conference system
            </p>

          </div>


          <div className="mt-1.5">

            {recentActivities.map(
              (activity, index) => {

                const Icon =
                  getActivityIcon(
                    activity?.type ||
                      activity?.icon
                  );

                return (
                  <div
                    key={
                      activity?._id ||
                      `${activity?.title}-${index}`
                    }
                    className={`flex items-center gap-2.5 py-2.5 ${
                      index !==
                      recentActivities.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >

                    {/* Icon */}

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">

                      <Icon
                        size={14}
                        strokeWidth={1.8}
                      />

                    </div>


                    {/* Details */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-[11px] font-medium text-gray-800">
                        {activity?.title ||
                          "Activity"}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-gray-400">
                        {activity?.description ||
                          ""}
                      </p>

                    </div>


                    {/* Time */}

                    <span className="shrink-0 text-[9px] text-gray-400">
                      {getActivityTime(
                        activity?.time ||
                          activity?.createdAt
                      )}
                    </span>

                  </div>
                );
              }
            )}

          </div>

        </section>

      </main>

    </div>
  );
};


export default Dashboard;