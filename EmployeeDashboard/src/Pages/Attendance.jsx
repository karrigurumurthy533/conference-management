import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";

// ==========================================================
// ATTENDANCE DATA
// ==========================================================

const attendanceData = [
  {
    id: 1,
    name: "Dr. Michael Anderson",
    email: "michael.anderson@example.com",
    conference: "Mental Health & Psychiatry",
    date: "Sep 17, 2026",
    type: "Speaker",
    status: "Present",
    checkIn: "09:12 AM",
  },
  {
    id: 2,
    name: "Dr. Emily Carter",
    email: "emily.carter@example.com",
    conference: "Mental Health & Psychiatry",
    date: "Sep 17, 2026",
    type: "Speaker",
    status: "Present",
    checkIn: "09:18 AM",
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james.wilson@example.com",
    conference: "Mental Health & Psychiatry",
    date: "Sep 17, 2026",
    type: "Delegate",
    status: "Present",
    checkIn: "09:24 AM",
  },
  {
    id: 4,
    name: "Sophia Miller",
    email: "sophia.miller@example.com",
    conference: "Endocrine & Metabolic Innovation",
    date: "Oct 08, 2026",
    type: "Delegate",
    status: "Absent",
    checkIn: "-",
  },
  {
    id: 5,
    name: "Dr. David Brown",
    email: "david.brown@example.com",
    conference: "Food, Nutrition & Wellness",
    date: "Sep 17, 2026",
    type: "Speaker",
    status: "Present",
    checkIn: "09:35 AM",
  },
  {
    id: 6,
    name: "Olivia Johnson",
    email: "olivia.johnson@example.com",
    conference: "Food, Nutrition & Wellness",
    date: "Sep 17, 2026",
    type: "Delegate",
    status: "Late",
    checkIn: "10:08 AM",
  },
  {
    id: 7,
    name: "Dr. Robert Davis",
    email: "robert.davis@example.com",
    conference: "Oncology Research & AI Innovations",
    date: "Nov 12, 2026",
    type: "Speaker",
    status: "Present",
    checkIn: "09:05 AM",
  },
  {
    id: 8,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    conference: "Oncology Research & AI Innovations",
    date: "Nov 12, 2026",
    type: "Delegate",
    status: "Absent",
    checkIn: "-",
  },
  {
    id: 9,
    name: "Dr. Daniel Moore",
    email: "daniel.moore@example.com",
    conference: "Healthcare Innovation",
    date: "Dec 03, 2026",
    type: "Speaker",
    status: "Present",
    checkIn: "09:20 AM",
  },
  {
    id: 10,
    name: "Isabella Taylor",
    email: "isabella.taylor@example.com",
    conference: "Healthcare Innovation",
    date: "Dec 03, 2026",
    type: "Delegate",
    status: "Late",
    checkIn: "10:15 AM",
  },
  {
    id: 11,
    name: "Dr. William Thomas",
    email: "william.thomas@example.com",
    conference: "AI & Digital Psychiatry",
    date: "Jan 15, 2027",
    type: "Speaker",
    status: "Present",
    checkIn: "09:10 AM",
  },
  {
    id: 12,
    name: "Ava Martin",
    email: "ava.martin@example.com",
    conference: "AI & Digital Psychiatry",
    date: "Jan 15, 2027",
    type: "Delegate",
    status: "Absent",
    checkIn: "-",
  },
  {
    id: 13,
    name: "Dr. James Harris",
    email: "james.harris@example.com",
    conference: "Precision Medicine",
    date: "Feb 20, 2027",
    type: "Speaker",
    status: "Present",
    checkIn: "09:28 AM",
  },
  {
    id: 14,
    name: "Mia Thompson",
    email: "mia.thompson@example.com",
    conference: "Precision Medicine",
    date: "Feb 20, 2027",
    type: "Delegate",
    status: "Present",
    checkIn: "09:42 AM",
  },
  {
    id: 15,
    name: "Dr. Christopher Lee",
    email: "christopher.lee@example.com",
    conference: "Cardiovascular Diseases",
    date: "Mar 10, 2027",
    type: "Speaker",
    status: "Late",
    checkIn: "10:22 AM",
  },
  {
    id: 16,
    name: "Charlotte Garcia",
    email: "charlotte.garcia@example.com",
    conference: "Cardiovascular Diseases",
    date: "Mar 10, 2027",
    type: "Delegate",
    status: "Present",
    checkIn: "09:31 AM",
  },
];

// ==========================================================
// COMPONENT
// ==========================================================

function Attendance() {
  const [attendance, setAttendance] = useState(attendanceData);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // ========================================================
  // FILTER DATA
  // ========================================================

  const filteredAttendance = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return attendance.filter((item) => {
      const matchesSearch =
        !searchValue ||
        item.name.toLowerCase().includes(searchValue) ||
        item.email.toLowerCase().includes(searchValue) ||
        item.conference.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [attendance, search, statusFilter, typeFilter]);

  // ========================================================
  // PAGINATION
  // ========================================================

  const totalPages = Math.ceil(
    filteredAttendance.length / ITEMS_PER_PAGE
  );

  const paginatedAttendance = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredAttendance.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAttendance, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ========================================================
  // STATS
  // ========================================================

  const totalCount = attendance.length;

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status === "Late"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  // ========================================================
  // CLEAR FILTERS
  // ========================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setCurrentPage(1);
  };

  const hasFilters =
    search || statusFilter !== "All" || typeFilter !== "All";

  // ========================================================
  // STATUS STYLE
  // ========================================================

  const getStatusStyle = (status) => {
    if (status === "Present") {
      return {
        wrapper: "bg-emerald-50 text-emerald-600",
        icon: CheckCircle2,
      };
    }

    if (status === "Late") {
      return {
        wrapper: "bg-amber-50 text-amber-600",
        icon: Clock3,
      };
    }

    return {
      wrapper: "bg-red-50 text-red-500",
      icon: UserX,
    };
  };

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

          {/* TOTAL */}
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-500">
                  Total
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {totalCount}
                </p>
              </div>

              <Users className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* PRESENT */}
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-500">
                  Present
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {presentCount}
                </p>
              </div>

              <UserCheck className="h-5 w-5 text-emerald-500" />
            </div>
          </div>

          {/* LATE */}
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-500">
                  Late
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {lateCount}
                </p>
              </div>

              <Clock3 className="h-5 w-5 text-amber-500" />
            </div>
          </div>

          {/* ABSENT */}
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-500">
                  Absent
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {absentCount}
                </p>
              </div>

              <UserX className="h-5 w-5 text-red-500" />
            </div>
          </div>

        </div>

        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">

          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">

            {/* SEARCH */}

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or conference..."
                className="
                  h-9
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  pl-9
                  pr-3
                  text-xs
                  text-gray-700
                  outline-none
                  placeholder:text-gray-400
                  focus:border-[#8138A2]
                  focus:ring-1
                  focus:ring-[#8138A2]/20
                "
              />
            </div>

            {/* STATUS */}

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="
                  h-9
                  min-w-[135px]
                  appearance-none
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  pr-8
                  text-xs
                  text-gray-600
                  outline-none
                  focus:border-[#8138A2]
                "
              >
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>

            {/* TYPE */}

            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="
                  h-9
                  min-w-[130px]
                  appearance-none
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  pr-8
                  text-xs
                  text-gray-600
                  outline-none
                  focus:border-[#8138A2]
                "
              >
                <option value="All">All Types</option>
                <option value="Speaker">Speaker</option>
                <option value="Delegate">Delegate</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>

            {/* CLEAR */}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  flex
                  h-9
                  items-center
                  justify-center
                  gap-1.5
                  rounded-lg
                  px-3
                  text-xs
                  font-medium
                  text-gray-500
                  transition
                  hover:bg-red-50
                  hover:text-red-500
                "
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* FILTER INFO */}

          <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
            <SlidersHorizontal className="h-3 w-3" />
            <span>
              Showing {filteredAttendance.length} matching records
            </span>
          </div>
        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Participant
                  </th>

                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Conference
                  </th>

                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Type
                  </th>

                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Check-in
                  </th>

                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedAttendance.map((item) => {
                  const statusStyle = getStatusStyle(item.status);
                  const StatusIcon = statusStyle.icon;

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                    >
                      {/* PARTICIPANT */}

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[11px] font-semibold text-[#8138A2]">
                            {item.name
                              .split(" ")
                              .map((word) => word[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-semibold text-gray-900">
                              {item.name}
                            </p>

                            <p className="truncate text-[11px] text-gray-400">
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONFERENCE */}

                      <td className="max-w-[220px] px-4 py-3">
                        <p className="truncate text-[12px] font-medium text-gray-700">
                          {item.conference}
                        </p>
                      </td>

                      {/* DATE */}

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                          {item.date}
                        </div>
                      </td>

                      {/* TYPE */}

                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-gray-600">
                          {item.type}
                        </span>
                      </td>

                      {/* CHECK IN */}

                      <td className="px-4 py-3">
                        <span className="text-[11px] text-gray-500">
                          {item.checkIn}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium ${statusStyle.wrapper}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ==================================================
              MOBILE LIST
          ================================================== */}

          <div className="md:hidden">
            {paginatedAttendance.map((item, index) => {
              const statusStyle = getStatusStyle(item.status);
              const StatusIcon = statusStyle.icon;

              return (
                <div
                  key={item.id}
                  className={`p-4 ${
                    index !== paginatedAttendance.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[11px] font-semibold text-[#8138A2]">
                      {item.name
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-gray-900">
                            {item.name}
                          </p>

                          <p className="truncate text-[11px] text-gray-400">
                            {item.email}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium ${statusStyle.wrapper}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-2 text-[11px] font-medium text-gray-600">
                        {item.conference}
                      </p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-400">
                        <span>{item.date}</span>
                        <span>{item.type}</span>
                        <span>Check-in: {item.checkIn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {paginatedAttendance.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-12">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-4 w-4 text-gray-400" />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-gray-800">
                No attendance records found
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Try changing your search or filters.
              </p>
            </div>
          )}

          {/* ==================================================
              PAGINATION
          ================================================== */}

          {filteredAttendance.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

              {/* SUMMARY */}

              <p className="text-[11px] text-gray-400">
                Showing{" "}
                <span className="font-medium text-gray-600">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                -{" "}
                <span className="font-medium text-gray-600">
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredAttendance.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-600">
                  {filteredAttendance.length}
                </span>{" "}
                records
              </p>

              {/* PAGINATION */}

              <div className="flex items-center gap-1">

                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-slate-200
                    text-gray-500
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {/* PAGE NUMBERS */}

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-medium transition ${
                      currentPage === page
                        ? "bg-[#8138A2] text-white"
                        : "border border-slate-200 text-gray-500 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* NEXT */}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-slate-200
                    text-gray-500
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================
            BOTTOM INFO
        ================================================== */}

        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-[11px] text-gray-400">
            {ITEMS_PER_PAGE} records per page
          </p>

          <p className="text-[11px] text-gray-400">
            Attendance Management
          </p>
        </div>
      </div>
    </section>
  );
}

export default Attendance;