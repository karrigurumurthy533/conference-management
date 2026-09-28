
import React, { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  Download,
  Search,
  TrendingUp,
} from "lucide-react";

const brochureData = [
  {
    id: 1,
    conferenceName: "International Conference on Autism Research",
    shortName: "Autism Research",
    date: "18 - 19 November 2026",
    totalDownloads: 1248,
    thisMonth: 342,
    lastMonth: 286,
    lastDownloaded: "28 Sep 2026",
  },
  {
    id: 2,
    conferenceName: "International Conference on Mental Health",
    shortName: "Mental Health",
    date: "25 - 26 November 2026",
    totalDownloads: 986,
    thisMonth: 278,
    lastMonth: 241,
    lastDownloaded: "28 Sep 2026",
  },
  {
    id: 3,
    conferenceName: "International Conference on Endocrinology & Diabetes",
    shortName: "Endocrinology & Diabetes",
    date: "02 - 03 December 2026",
    totalDownloads: 756,
    thisMonth: 194,
    lastMonth: 167,
    lastDownloaded: "27 Sep 2026",
  },
  {
    id: 4,
    conferenceName: "International Conference on Oncology & AI",
    shortName: "Oncology & AI",
    date: "10 - 11 December 2026",
    totalDownloads: 642,
    thisMonth: 156,
    lastMonth: 139,
    lastDownloaded: "27 Sep 2026",
  },
  {
    id: 5,
    conferenceName: "International Conference on Healthcare Innovation",
    shortName: "Healthcare Innovation",
    date: "15 - 16 December 2026",
    totalDownloads: 534,
    thisMonth: 128,
    lastMonth: 112,
    lastDownloaded: "26 Sep 2026",
  },
];

function Brochures() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("downloads");

  const totalDownloads = brochureData.reduce(
    (total, conference) => total + conference.totalDownloads,
    0
  );

  const monthlyDownloads = brochureData.reduce(
    (total, conference) => total + conference.thisMonth,
    0
  );

  const filteredData = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const data = brochureData.filter(
      (conference) =>
        conference.conferenceName.toLowerCase().includes(searchValue) ||
        conference.shortName.toLowerCase().includes(searchValue)
    );

    if (sortBy === "downloads") {
      data.sort((a, b) => b.totalDownloads - a.totalDownloads);
    }

    if (sortBy === "monthly") {
      data.sort((a, b) => b.thisMonth - a.thisMonth);
    }

    if (sortBy === "recent") {
      data.sort(
        (a, b) =>
          new Date(b.lastDownloaded) - new Date(a.lastDownloaded)
      );
    }

    return data;
  }, [search, sortBy]);

  return (
    <div className="min-h-screen bg-[#fafafa] px-5 py-5 lg:px-6">

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Downloads */}
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-50">
              <Download size={16} className="text-[#7C3AED]" />
            </div>

            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-medium text-green-600">
              All Time
            </span>
          </div>

          <div className="mt-2">
            <p className="text-[11px] font-medium text-gray-500">
              Total Downloads
            </p>

            <h2 className="mt-0.5 text-[20px] font-semibold leading-tight text-gray-900">
              {totalDownloads.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Monthly Downloads */}
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-50">
              <TrendingUp size={16} className="text-[#7C3AED]" />
            </div>

            <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[9px] font-medium text-[#7C3AED]">
              This Month
            </span>
          </div>

          <div className="mt-2">
            <p className="text-[11px] font-medium text-gray-500">
              Monthly Downloads
            </p>

            <h2 className="mt-0.5 text-[20px] font-semibold leading-tight text-gray-900">
              {monthlyDownloads.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Conferences */}
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-50">
              <CalendarDays size={16} className="text-[#7C3AED]" />
            </div>

            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-medium text-blue-600">
              Active
            </span>
          </div>

          <div className="mt-2">
            <p className="text-[11px] font-medium text-gray-500">
              Conferences
            </p>

            <h2 className="mt-0.5 text-[20px] font-semibold leading-tight text-gray-900">
              {brochureData.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Statistics Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Table Header */}
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-gray-900">
                Conference Brochure Statistics
              </h2>

              <p className="mt-0.5 text-[10px] text-gray-500">
                Download performance for each conference brochure.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-[200px]">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search conference..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    h-8
                    w-full
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    pl-8
                    pr-2.5
                    text-[11px]
                    text-gray-700
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-purple-300
                    focus:ring-1
                    focus:ring-purple-100
                  "
                />
              </div>

              {/* Sort */}
              <div className="relative w-full sm:w-[165px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="
                    h-8
                    w-full
                    appearance-none
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-2.5
                    pr-7
                    text-[11px]
                    font-medium
                    text-gray-600
                    outline-none
                    focus:border-purple-300
                    focus:ring-1
                    focus:ring-purple-100
                  "
                >
                  <option value="downloads">Most Downloads</option>
                  <option value="monthly">This Month</option>
                  <option value="recent">Recently Downloaded</option>
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Conference
                </th>

                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Conference Date
                </th>

                <th className="px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Total Downloads
                </th>

                <th className="px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  This Month
                </th>

                <th className="px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Growth
                </th>

                <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Last Download
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((conference) => {
                  const growth =
                    conference.lastMonth > 0
                      ? ((conference.thisMonth -
                          conference.lastMonth) /
                          conference.lastMonth) *
                        100
                      : 0;

                  return (
                    <tr
                      key={conference.id}
                      className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/50"
                    >
                      {/* Conference */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-50">
                            <BookOpen
                              size={15}
                              className="text-[#7C3AED]"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[300px] truncate text-[11px] font-semibold text-gray-800">
                              {conference.conferenceName}
                            </p>

                            <p className="mt-0.5 text-[10px] text-gray-400">
                              {conference.shortName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                          <CalendarDays
                            size={12}
                            className="shrink-0 text-gray-400"
                          />

                          {conference.date}
                        </div>
                      </td>

                      {/* Total Downloads */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-[12px] font-semibold text-gray-900">
                          {conference.totalDownloads.toLocaleString()}
                        </span>
                      </td>

                      {/* This Month */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-[11px] font-medium text-gray-700">
                          {conference.thisMonth.toLocaleString()}
                        </span>
                      </td>

                      {/* Growth */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                            growth >= 0
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {growth >= 0 ? "+" : ""}
                          {growth.toFixed(1)}%
                        </span>
                      </td>

                      {/* Last Download */}
                      <td className="px-4 py-3 text-right">
                        <span className="text-[10px] text-gray-500">
                          {conference.lastDownloaded}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-10 text-center"
                  >
                    <BookOpen
                      size={26}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p className="text-[11px] font-medium text-gray-600">
                      No conferences found
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Try searching with a different conference name.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredData.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2">
            <p className="text-[10px] text-gray-400">
              Showing {filteredData.length} of {brochureData.length} conferences
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Brochures;
