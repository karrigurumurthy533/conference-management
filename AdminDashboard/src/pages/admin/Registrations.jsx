import React, { useMemo, useState } from "react";
import {
  Users,
  CalendarDays,
  TrendingUp,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Registrations = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const registrations = [
    {
      id: 1,
      conference: "Mental Health & Psychiatry",
      date: "Sep 17–18, 2026",
      registrations: 342,
      status: "Upcoming",
    },
    {
      id: 2,
      conference: "Endocrine & Metabolic Innovation",
      date: "Oct 08–09, 2026",
      registrations: 268,
      status: "Upcoming",
    },
    {
      id: 3,
      conference: "Food, Nutrition & Wellness",
      date: "Sep 17–18, 2026",
      registrations: 223,
      status: "Upcoming",
    },
    {
      id: 4,
      conference: "Oncology Research & AI Innovations",
      date: "Nov 12–13, 2026",
      registrations: 187,
      status: "Published",
    },
    {
      id: 5,
      conference: "Healthcare Innovation & Precision Medicine",
      date: "Dec 03–04, 2026",
      registrations: 156,
      status: "Upcoming",
    },
    {
      id: 6,
      conference: "Autism Research & Innovations",
      date: "Apr 06–07, 2027",
      registrations: 134,
      status: "Upcoming",
    },
    {
      id: 7,
      conference: "Heart & Cardiovascular Diseases",
      date: "Jan 15–16, 2027",
      registrations: 118,
      status: "Upcoming",
    },
    {
      id: 8,
      conference: "AI & Digital Psychiatry",
      date: "Feb 20–21, 2027",
      registrations: 96,
      status: "Draft",
    },
    {
      id: 9,
      conference: "Nutrition & Wellness Summit",
      date: "Mar 10–11, 2027",
      registrations: 84,
      status: "Upcoming",
    },
  ];

  const itemsPerPage = 6;

  const totalRegistrations = registrations.reduce(
    (total, item) => total + item.registrations,
    0
  );

  const upcomingRegistrations = registrations
    .filter((item) => item.status === "Upcoming")
    .reduce((total, item) => total + item.registrations, 0);

  const publishedConferences = registrations.filter(
    (item) => item.status === "Published"
  ).length;

  const totalPages = Math.ceil(registrations.length / itemsPerPage);

  const currentRegistrations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return registrations.slice(start, start + itemsPerPage);
  }, [currentPage]);

  const getStatusClass = (status) => {
    if (status === "Published") {
      return "bg-violet-50 text-violet-600";
    }

    if (status === "Draft") {
      return "bg-gray-100 text-gray-500";
    }

    return "bg-violet-50 text-violet-600";
  };

  return (
    <div className="w-full">
    

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Registrations
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {totalRegistrations.toLocaleString()}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Users size={17} className="text-violet-600" />
            </div>
          </div>
        </div>

        {/* UPCOMING */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Upcoming Registrations
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {upcomingRegistrations.toLocaleString()}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <TrendingUp size={17} className="text-violet-600" />
            </div>
          </div>
        </div>

        {/* CONFERENCES */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Conferences
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {registrations.length}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CalendarDays size={17} className="text-violet-600" />
            </div>
          </div>
        </div>

        {/* PUBLISHED */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Published Conferences
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {publishedConferences}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <UserCheck size={17} className="text-violet-600" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONFERENCE REGISTRATIONS
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h2 className="text-[14px] font-semibold text-gray-900">
              Conference-wise Registrations
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Registration count for each conference
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1.5">
            <Users size={13} className="text-violet-600" />

            <span className="text-[11px] font-semibold text-violet-600">
              {totalRegistrations.toLocaleString()} Total
            </span>
          </div>
        </div>

        {/* TABLE */}

        <div className="w-full">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="w-[42%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Conference
                </th>

                <th className="w-[22%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="w-[18%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Registrations
                </th>

                <th className="w-[18%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {currentRegistrations.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                >
                  {/* CONFERENCE */}

                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                        <CalendarDays
                          size={14}
                          className="text-violet-600"
                        />
                      </div>

                      <p className="truncate text-[12px] font-semibold text-gray-800">
                        {item.conference}
                      </p>
                    </div>
                  </td>

                  {/* DATE */}

                  <td className="px-3 py-3 text-[11px] text-gray-500">
                    {item.date}
                  </td>

                  {/* REGISTRATIONS */}

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <Users
                        size={13}
                        className="text-violet-600"
                      />

                      <span className="text-[12px] font-semibold text-gray-800">
                        {item.registrations}
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
          <p className="text-[10px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                currentPage * itemsPerPage,
                registrations.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {registrations.length}
            </span>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[10px] font-semibold transition ${
                  currentPage === page
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:text-violet-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registrations;