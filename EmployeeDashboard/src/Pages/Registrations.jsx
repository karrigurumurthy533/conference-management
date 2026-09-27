import React, { useMemo, useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock3,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserRound,
  Mail,
  SlidersHorizontal,
} from "lucide-react";

// =========================================================
// REGISTRATION DATA
// =========================================================

const registrations = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    type: "Delegate",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily@example.com",
    type: "Speaker",
    status: "Confirmed",
  },
  {
    id: 3,
    name: "Robert Brown",
    email: "robert@example.com",
    type: "Delegate",
    status: "Pending",
  },
  {
    id: 4,
    name: "Sophia Wilson",
    email: "sophia@example.com",
    type: "Student",
    status: "Confirmed",
  },
  {
    id: 5,
    name: "Michael Davis",
    email: "michael@example.com",
    type: "Delegate",
    status: "Pending",
  },
  {
    id: 6,
    name: "Olivia Taylor",
    email: "olivia@example.com",
    type: "Speaker",
    status: "Confirmed",
  },
  {
    id: 7,
    name: "Daniel Anderson",
    email: "daniel@example.com",
    type: "Delegate",
    status: "Confirmed",
  },
  {
    id: 8,
    name: "Emma Thomas",
    email: "emma@example.com",
    type: "Student",
    status: "Pending",
  },
  {
    id: 9,
    name: "James Martinez",
    email: "james@example.com",
    type: "Speaker",
    status: "Confirmed",
  },
  {
    id: 10,
    name: "Ava Jackson",
    email: "ava@example.com",
    type: "Delegate",
    status: "Confirmed",
  },
  {
    id: 11,
    name: "William White",
    email: "william@example.com",
    type: "Student",
    status: "Pending",
  },
  {
    id: 12,
    name: "Isabella Harris",
    email: "isabella@example.com",
    type: "Speaker",
    status: "Confirmed",
  },
];

// =========================================================
// PAGINATION
// =========================================================

const ITEMS_PER_PAGE = 4;

function Registrations() {
  // =========================================================
  // STATES
  // =========================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // =========================================================
  // HELPERS
  // =========================================================

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalRegistrations = registrations.length;

  const confirmedRegistrations = registrations.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const pendingRegistrations = registrations.filter(
    (item) => item.status === "Pending"
  ).length;

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const registrationTypes = [
    "All",
    ...new Set(registrations.map((item) => item.type)),
  ];

  // =========================================================
  // FILTER DATA
  // =========================================================

  const filteredRegistrations = useMemo(() => {
    const query = search.toLowerCase().trim();

    return registrations.filter((registration) => {
      const matchesSearch =
        !query ||
        registration.name.toLowerCase().includes(query) ||
        registration.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        registration.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        registration.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================

  const totalPages = Math.ceil(
    filteredRegistrations.length / ITEMS_PER_PAGE
  );

  const paginatedRegistrations = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return filteredRegistrations.slice(
      startIndex,
      endIndex
    );
  }, [filteredRegistrations, currentPage]);

  // =========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================================

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter]);

  // =========================================================
  // PAGE NUMBERS
  // =========================================================

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // =========================================================
  // PAGINATION HANDLERS
  // =========================================================

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setCurrentPage(1);
  };

  const hasFilters =
    search ||
    statusFilter !== "All" ||
    typeFilter !== "All";

  // =========================================================
  // STAT CARD
  // =========================================================

  const StatCard = ({
    icon: Icon,
    label,
    value,
    iconBg,
    iconColor,
  }) => {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_1px_5px_rgba(15,23,42,0.025)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </p>

            <p className="mt-1 text-[21px] font-bold leading-none text-slate-900">
              {value}
            </p>
          </div>

          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}
          >
            <Icon
              size={16}
              className={iconColor}
            />
          </div>
        </div>
      </div>
    );
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const StatusBadge = ({ status }) => {
    const isConfirmed = status === "Confirmed";

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
          isConfirmed
            ? "bg-emerald-50 text-emerald-600"
            : "bg-amber-50 text-amber-600"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isConfirmed
              ? "bg-emerald-500"
              : "bg-amber-500"
          }`}
        />

        {status}
      </span>
    );
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-[1400px]">

      
        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Users}
            label="Total Registrations"
            value={totalRegistrations}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />

          <StatCard
            icon={CheckCircle2}
            label="Confirmed"
            value={confirmedRegistrations}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            icon={Clock3}
            label="Pending"
            value={pendingRegistrations}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>

        {/* ===================================================
            SEARCH + FILTERS
        =================================================== */}

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_1px_5px_rgba(15,23,42,0.025)]">
          <div className="flex flex-col gap-2 lg:flex-row">

            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name or email..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* STATUS */}

            <div className="relative lg:w-[155px]">
              <SlidersHorizontal
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-[11px] font-medium text-slate-600 outline-none focus:border-violet-400 focus:bg-white"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Pending">
                  Pending
                </option>
              </select>

              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* TYPE */}

            <div className="relative lg:w-[155px]">
              <UserRound
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
                className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-[11px] font-medium text-slate-600 outline-none focus:border-violet-400 focus:bg-white"
              >
                {registrationTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type === "All"
                      ? "All Types"
                      : type}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* CLEAR */}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ===================================================
            REGISTRATIONS TABLE
        =================================================== */}

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_5px_rgba(15,23,42,0.025)]">

          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[1.6fr_1.4fr_0.8fr_0.7fr] gap-4 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 md:grid">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Attendee
            </p>

            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Email
            </p>

            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Type
            </p>

            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </p>
          </div>

          {/* TABLE ROWS */}

          {paginatedRegistrations.length > 0 ? (
            paginatedRegistrations.map(
              (registration) => (
                <div
                  key={registration.id}
                  className="grid gap-2.5 border-b border-slate-100 px-4 py-3 last:border-b-0 md:grid-cols-[1.6fr_1.4fr_0.8fr_0.7fr] md:items-center md:gap-4"
                >

                  {/* ATTENDEE */}

                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[9px] font-bold text-violet-600">
                      {getInitials(
                        registration.name
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-slate-900">
                        {registration.name}
                      </p>

                      <div className="mt-0.5 flex items-center gap-1 md:hidden">
                        <Mail
                          size={10}
                          className="text-slate-400"
                        />

                        <p className="truncate text-[9px] text-slate-500">
                          {registration.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div className="hidden min-w-0 md:block">
                    <p className="truncate text-[10px] text-slate-500">
                      {registration.email}
                    </p>
                  </div>

                  {/* TYPE */}

                  <div>
                    <span className="inline-flex rounded-md bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-600">
                      {registration.type}
                    </span>
                  </div>

                  {/* STATUS */}

                  <div>
                    <StatusBadge
                      status={registration.status}
                    />
                  </div>
                </div>
              )
            )
          ) : (
            /* EMPTY STATE */

            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                <Users
                  size={18}
                  className="text-slate-300"
                />
              </div>

              <h3 className="mt-2.5 text-[12px] font-bold text-slate-800">
                No registrations found
              </h3>

              <p className="mt-1 text-[10px] text-slate-500">
                Try changing your search or filter criteria.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 rounded-lg bg-violet-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-violet-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* =================================================
              PAGINATION
          ================================================= */}

          {filteredRegistrations.length > 0 &&
            totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-4 py-2.5">

                {/* LEFT INFO */}

                <p className="text-[9px] text-slate-400">
                  Page{" "}
                  <span className="font-semibold text-slate-600">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-600">
                    {totalPages}
                  </span>
                </p>

                {/* PAGINATION BUTTONS */}

                <div className="flex items-center gap-1">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    className={`flex h-7 w-7 items-center justify-center rounded-md border text-slate-500 transition ${
                      currentPage === 1
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                        : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={13} />
                  </button>

                  {/* PAGE NUMBERS */}

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        goToPage(page)
                      }
                      className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[9px] font-semibold transition ${
                        currentPage === page
                          ? "bg-violet-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    className={`flex h-7 w-7 items-center justify-center rounded-md border text-slate-500 transition ${
                      currentPage === totalPages
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                        : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* ===================================================
            SMALL FOOTER SUMMARY
        =================================================== */}

        {filteredRegistrations.length > 0 && (
          <div className="mt-2 flex items-center justify-between px-1">
            <p className="text-[9px] text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {(currentPage - 1) *
                  ITEMS_PER_PAGE +
                  1}
              </span>{" "}
              -{" "}
              <span className="font-semibold text-slate-600">
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredRegistrations.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {filteredRegistrations.length}
              </span>{" "}
              registrations
            </p>

            <p className="text-[9px] text-slate-400">
              {ITEMS_PER_PAGE} per page
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Registrations;