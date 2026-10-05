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

import { motion } from "framer-motion";

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
// MOTION VARIANTS
// ============================================================

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const statsContainerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const statCardVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const listContainerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const listItemVariants = {
  hidden: {
    opacity: 0,
    y: 6,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
  const dispatch = useDispatch();

  // ==========================================================
  // REDUX STATE
  // ==========================================================

  const statistics = useSelector(
    selectAdminStatistics,
  );

  const error = useSelector(
    selectAdminError,
  );

  const registrationOverview = useSelector(
    selectRegistrationOverview,
  );

  const recentConferences = useSelector(
    selectRecentConferences,
  );

  const recentActivities = useSelector(
    selectRecentActivities,
  );

  // ==========================================================
  // FETCH DASHBOARD DATA
  // ==========================================================

  useEffect(() => {
    dispatch(getAdminStatistics());

    dispatch(
      getAdminDashboardOverview(),
    );
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
    return new Intl.NumberFormat(
      "en-IN",
    ).format(Number(value || 0));
  };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      },
    );
  };

  // ==========================================================
  // GET CONFERENCE TITLE
  // ==========================================================

  const getConferenceTitle = (
    conference,
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
    conference,
  ) => {
    const dates =
      conference?.conferenceDates;

    if (!dates) {
      return formatDate(
        conference?.createdAt,
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
        startDate,
      )} – ${formatDate(endDate)}`;
    }

    if (startDate) {
      return formatDate(startDate);
    }

    return formatDate(
      conference?.createdAt,
    );
  };

  // ==========================================================
  // GET CONFERENCE STATUS
  // ==========================================================

  const getConferenceStatus = (
    conference,
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
    type,
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
    date,
  ) => {
    if (!date) {
      return "";
    }

    const activityDate =
      new Date(date);

    if (
      Number.isNaN(
        activityDate.getTime(),
      )
    ) {
      return "";
    }

    const now = new Date();

    const difference =
      now.getTime() -
      activityDate.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60),
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60,
    );

    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(
      hours / 24,
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
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-w-0 w-full overflow-hidden space-y-4"
    >
      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-[11px] text-red-600"
        >
          <AlertCircle size={14} />

          <span>{error}</span>
        </motion.div>
      )}

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <motion.section
        variants={
          statsContainerVariants
        }
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-1.5 xl:grid-cols-5"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              variants={
                statCardVariants
              }
              whileHover={{
                y: -2,

                transition: {
                  duration: 0.2,
                },
              }}
              className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-1 text-[21px] font-bold leading-none text-gray-900">
                    {formatNumber(
                      stat.value,
                    )}
                  </p>
                </div>

                <motion.div
                  whileHover={{
                    rotate: 4,
                    scale: 1.05,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                  />
                </motion.div>
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
            </motion.div>
          );
        })}
      </motion.section>

      {/* ======================================================
          CHART + RECENT CONFERENCES
      ====================================================== */}

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: 0.15,
        }}
        className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3"
      >
        {/* ====================================================
            REGISTRATION CHART
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: -8,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm xl:col-span-2"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-800">
                Registrations Overview
              </h2>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Monthly registration
                performance
              </p>
            </div>

            <motion.button
              type="button"
              whileTap={{
                scale: 0.95,
              }}
              whileHover={{
                y: -1,
              }}
              className="shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
            >
              Last 12 Months
            </motion.button>
          </div>

          <div className="mt-3 h-[220px] w-full">
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
                  domain={[
                    0,
                    "auto",
                  ]}
                  allowDecimals={
                    false
                  }
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
                  isAnimationActive={
                    true
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ====================================================
            RECENT CONFERENCES
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 8,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.25,
            ease: "easeOut",
          }}
          className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-800">
                Recent Conferences
              </h2>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Latest conference
                activity
              </p>
            </div>

            <motion.button
              type="button"
              whileTap={{
                scale: 0.95,
              }}
              whileHover={{
                x: 2,
              }}
              className="shrink-0 text-[10px] font-medium text-violet-600 transition hover:text-violet-700"
            >
              View All
            </motion.button>
          </div>

          <motion.div
            variants={
              listContainerVariants
            }
            initial="hidden"
            animate="visible"
            className="mt-2"
          >
            {recentConferences?.map(
              (
                conference,
                index,
              ) => {
                const title =
                  getConferenceTitle(
                    conference,
                  );

                const date =
                  getConferenceDate(
                    conference,
                  );

                const status =
                  getConferenceStatus(
                    conference,
                  );

                return (
                  <motion.div
                    key={
                      conference?._id ||
                      conference?.id ||
                      title
                    }
                    variants={
                      listItemVariants
                    }
                    whileHover={{
                      x: 2,
                    }}
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

                    <motion.span
                      whileHover={{
                        scale: 1.03,
                      }}
                      className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-medium ${
                        status ===
                        "Upcoming"
                          ? "bg-violet-50 text-violet-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {status}
                    </motion.span>
                  </motion.div>
                );
              },
            )}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ======================================================
          RECENT ACTIVITIES
      ====================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          delay: 0.35,
          ease: "easeOut",
        }}
        className="overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
      >
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            Recent Activities
          </h2>

          <p className="mt-0.5 text-[10px] text-gray-400">
            Latest updates from
            your conference system
          </p>
        </div>

        <motion.div
          variants={
            listContainerVariants
          }
          initial="hidden"
          animate="visible"
          className="mt-2"
        >
          {recentActivities?.map(
            (
              activity,
              index,
            ) => {
              const Icon =
                getActivityIcon(
                  activity?.type ||
                    activity?.icon,
                );

              return (
                <motion.div
                  key={
                    activity?._id ||
                    `${activity?.title}-${index}`
                  }
                  variants={
                    listItemVariants
                  }
                  whileHover={{
                    x: 2,
                  }}
                  className={`flex items-center gap-2.5 py-2.5 ${
                    index !==
                    recentActivities.length -
                      1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {/* ICON */}

                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      rotate: 2,
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.8}
                    />
                  </motion.div>

                  {/* DETAILS */}

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

                  {/* TIME */}

                  <span className="shrink-0 text-[9px] text-gray-400">
                    {getActivityTime(
                      activity?.time ||
                        activity?.createdAt,
                    )}
                  </span>
                </motion.div>
              );
            },
          )}
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default Dashboard;