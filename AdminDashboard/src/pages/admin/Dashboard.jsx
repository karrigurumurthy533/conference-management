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

const Dashboard = () => {
  return (
    <div className="w-full bg-[#f8f8fc]">
      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="w-full px-5 pt-3 pb-5">
        {/* ===================================================
            STATISTICS
        =================================================== */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.025)] transition hover:border-violet-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12px] font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <p className="mt-1 text-[20px] font-semibold leading-none text-gray-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                  <span>↗</span>
                  <span>{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===================================================
            CHART + RECENT CONFERENCES
        =================================================== */}
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* ================= REGISTRATION CHART ================= */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.025)] xl:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[14px] font-semibold text-gray-900">
                  Registrations Overview
                </h2>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  Monthly registration performance
                </p>
              </div>

              <button
                type="button"
                className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-gray-600 hover:border-violet-200 hover:text-violet-600"
              >
                Last 9 Months
              </button>
            </div>

            <div className="mt-2 h-[245px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={registrationData}
                  margin={{
                    top: 8,
                    right: 4,
                    left: -22,
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

                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
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
                      fontSize: 10,
                      fill: "#9ca3af",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: "#9ca3af",
                    }}
                    domain={[0, 180]}
                    ticks={[0, 50, 100, 150]}
                  />

                  <Tooltip
                    contentStyle={{
                      border: "1px solid #eee",
                      borderRadius: "8px",
                      fontSize: "11px",
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
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.025)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[14px] font-semibold text-gray-900">
                  Recent Conferences
                </h2>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  Latest conference activity
                </p>
              </div>

              <button
                type="button"
                className="text-[11px] font-medium text-violet-600 hover:text-violet-700"
              >
                View All
              </button>
            </div>

            <div className="mt-3">
              {conferences.map((conference, index) => (
                <div
                  key={conference.title}
                  className={`flex items-center justify-between gap-3 py-3 ${
                    index !== conferences.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-gray-800">
                      {conference.title}
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {conference.date}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-medium ${
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
        </div>

        {/* ===================================================
    RECENT ACTIVITIES
=================================================== */}
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.025)]">
          {/* Header */}
          <div>
            <h2 className="text-[14px] font-semibold text-gray-900">
              Recent Activities
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-400">
              Latest updates from your conference system
            </p>
          </div>

          {/* Activities */}
          <div className="mt-2">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.title}
                  className={`flex items-center gap-3 py-3 ${
                    index !== activities.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Icon size={15} strokeWidth={1.8} />
                  </div>

                  {/* Activity Details */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-medium text-gray-800">
                      {activity.title}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                      {activity.description}
                    </p>
                  </div>

                  {/* Time */}
                  <span className="shrink-0 text-[9px] text-gray-400">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
