import React from "react";
import {
  CalendarDays,
  Users,
  ClipboardList,
  IndianRupee,
  Mic2,
  UserCheck,
  FileText,
  CreditCard,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ============================================================
// REGISTRATION DATA
// ============================================================

const registrationData = [
  { month: "Jan", registrations: 62 },
  { month: "Feb", registrations: 78 },
  { month: "Mar", registrations: 72 },
  { month: "Apr", registrations: 96 },
  { month: "May", registrations: 108 },
  { month: "Jun", registrations: 102 },
  { month: "Jul", registrations: 128 },
  { month: "Aug", registrations: 138 },
  { month: "Sep", registrations: 168 },
];

// ============================================================
// STATISTICS
// ============================================================

const stats = [
  {
    title: "Conferences",
    value: "12",
    change: "+2 this month",
    icon: CalendarDays,
  },
  {
    title: "Employees",
    value: "28",
    change: "+3 this month",
    icon: Users,
  },
  {
    title: "Registrations",
    value: "1,248",
    change: "+12% this month",
    icon: ClipboardList,
  },
  {
    title: "Revenue",
    value: "₹8.45L",
    change: "+15% this month",
    icon: IndianRupee,
  },
  {
    title: "Speakers",
    value: "86",
    change: "+8 this month",
    icon: Mic2,
  },
];

// ============================================================
// RECENT CONFERENCES
// ============================================================

const conferences = [
  {
    title: "Mental Health & Psychiatry",
    date: "Sep 17 – 18, 2026",
    status: "Upcoming",
  },
  {
    title: "Endocrine & Metabolic Innovation",
    date: "Oct 08 – 09, 2026",
    status: "Upcoming",
  },
  {
    title: "Food, Nutrition & Wellness",
    date: "Sep 17 – 18, 2026",
    status: "Upcoming",
  },
  {
    title: "Global Health Summit",
    date: "Aug 21 – 22, 2026",
    status: "Completed",
  },
];

// ============================================================
// RECENT ACTIVITIES
// ============================================================

const activities = [
  {
    title: "New registration received",
    description: "Mental Health & Psychiatry",
    time: "10 min ago",
    icon: UserCheck,
  },
  {
    title: "New conference created",
    description: "AI & Digital Psychiatry",
    time: "35 min ago",
    icon: CalendarDays,
  },
  {
    title: "Speaker profile added",
    description: "Dr. Sarah Williams",
    time: "1 hour ago",
    icon: Mic2,
  },
  {
    title: "Payment received",
    description: "Registration #GS-10482",
    time: "2 hours ago",
    icon: CreditCard,
  },
  {
    title: "Abstract submitted",
    description: "Global Health Summit",
    time: "3 hours ago",
    icon: FileText,
  },
];

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-[#f8f8fc]">
      <main className="w-full px-3 pt-2.5 pb-3 sm:px-4">

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
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Icon size={16} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1 text-[9px] font-medium text-emerald-600">
                  <TrendingUp size={10} strokeWidth={2} />
                  <span>{stat.change}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* ==================================================
            CHART + RECENT CONFERENCES
        ================================================== */}

        <section className="mt-3 grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-3">

          {/* ================= REGISTRATION CHART ================= */}

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
                Last 9 Months
              </button>
            </div>

            <div className="mt-1.5 h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={registrationData}
                  margin={{
                    top: 8,
                    right: 3,
                    left: -24,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="registrationGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7c3aed"
                        stopOpacity={0.16}
                      />

                      <stop
                        offset="100%"
                        stopColor="#7c3aed"
                        stopOpacity={0}
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
                    domain={[0, 180]}
                    ticks={[0, 50, 100, 150]}
                  />

                  <Tooltip
                    contentStyle={{
                      border: "1px solid #eeeeee",
                      borderRadius: "7px",
                      fontSize: "10px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    }}
                    cursor={{
                      stroke: "#ddd",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fill="url(#registrationGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#7c3aed",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ================= RECENT CONFERENCES ================= */}

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
              {conferences.map((conference, index) => (
                <div
                  key={conference.title}
                  className={`flex items-center justify-between gap-2 py-2.5 ${
                    index !== conferences.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-gray-800">
                      {conference.title}
                    </p>

                    <p className="mt-0.5 text-[9px] text-gray-400">
                      {conference.date}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-medium ${
                      conference.status === "Upcoming"
                        ? "bg-violet-50 text-violet-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {conference.status}
                  </span>
                </div>
              ))}
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
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.title}
                  className={`flex items-center gap-2.5 py-2.5 ${
                    index !== activities.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {/* Icon */}

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Icon size={14} strokeWidth={1.8} />
                  </div>

                  {/* Details */}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-medium text-gray-800">
                      {activity.title}
                    </p>

                    <p className="mt-0.5 truncate text-[9px] text-gray-400">
                      {activity.description}
                    </p>
                  </div>

                  {/* Time */}

                  <span className="shrink-0 text-[8px] text-gray-400">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;