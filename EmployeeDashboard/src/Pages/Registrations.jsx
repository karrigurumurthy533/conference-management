import React, { useEffect, useMemo, useState } from "react";
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
  Loader2,
  RefreshCw,
  Phone,
  Globe2,
} from "lucide-react";

import { getMyRegistrationsApi } from "../api/employeeApis";

// =========================================================
// PAGINATION
// =========================================================

const ITEMS_PER_PAGE = 8;

function Registrations() {
  // =========================================================
  // STATES
  // =========================================================

  const [registrations, setRegistrations] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH REGISTRATIONS API
  // =========================================================

  const fetchRegistrations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getMyRegistrationsApi();

      console.log(
        "Employee Registrations API Response:",
        response
      );

      if (response?.success) {
        const data = Array.isArray(response.data)
          ? response.data
          : [];

        setRegistrations(data);
      } else {
        setRegistrations([]);

        setError(
          response?.message ||
            "Failed to fetch registrations"
        );
      }
    } catch (err) {
      console.error(
        "Fetch registrations error:",
        err
      );

      setRegistrations([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch registrations"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL API CALL
  // =========================================================

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // =========================================================
  // NORMALIZE API DATA
  // =========================================================

  const normalizedRegistrations = useMemo(() => {
    return registrations.map((item, index) => {
      const conference =
        item?.conference || {};

      const conferenceId =
        conference?.conferenceId || {};

      const location =
        item?.location || {};

      const registration =
        item?.registration || {};

      const firstName =
        item?.firstName ||
        item?.personalInformation?.firstName ||
        "";

      const lastName =
        item?.lastName ||
        item?.personalInformation?.lastName ||
        "";

      const fullName =
        item?.fullName ||
        item?.name ||
        `${firstName} ${lastName}`.trim() ||
        "Unknown User";

      const email =
        item?.email ||
        item?.personalInformation?.email ||
        "—";

      const phone =
        item?.phone ||
        item?.personalInformation?.phone ||
        "—";

      const country =
        item?.country ||
        location?.country ||
        "—";

      const type =
        registration?.category ||
        registration?.type ||
        item?.registrationCategory ||
        item?.category ||
        "Delegate";

      const status =
        item?.status ||
        registration?.status ||
        "Pending";

      return {
        id:
          item?._id ||
          item?.id ||
          index,

        name: fullName,

        email,

        phone,

        country,

        type,

        status,

        conferenceId:
          conferenceId?._id ||
          conference?.conferenceId ||
          "",

        conferenceTitle:
          conference?.conferenceTitle ||
          conferenceId?.title ||
          conferenceId?.conferenceName ||
          "—",

        createdAt:
          item?.createdAt ||
          item?.updatedAt ||
          null,
      };
    });
  }, [registrations]);

  // =========================================================
  // GET INITIALS
  // =========================================================

  const getInitials = (name) => {
    if (!name || name === "Unknown User") {
      return "U";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalRegistrations =
    normalizedRegistrations.length;

  const confirmedRegistrations =
    normalizedRegistrations.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "confirmed"
    ).length;

  const pendingRegistrations =
    normalizedRegistrations.filter(
      (item) =>
        item.status?.toLowerCase() ===
          "pending" ||
        item.status?.toLowerCase() ===
          "processing"
    ).length;

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const registrationTypes = useMemo(() => {
    const types = normalizedRegistrations
      .map((item) => item.type)
      .filter(Boolean);

    return [
      "All",
      ...new Set(types),
    ];
  }, [normalizedRegistrations]);

  // =========================================================
  // FILTER DATA
  // =========================================================

  const filteredRegistrations = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    return normalizedRegistrations.filter(
      (registration) => {
        const matchesSearch =
          !query ||
          registration.name
            .toLowerCase()
            .includes(query) ||
          registration.email
            .toLowerCase()
            .includes(query) ||
          registration.phone
            .toLowerCase()
            .includes(query) ||
          registration.country
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          registration.status ===
            statusFilter;

        const matchesType =
          typeFilter === "All" ||
          registration.type === typeFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesType
        );
      }
    );
  }, [
    normalizedRegistrations,
    search,
    statusFilter,
    typeFilter,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    filteredRegistrations.length /
      ITEMS_PER_PAGE
  );

  const paginatedRegistrations = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return filteredRegistrations.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredRegistrations,
    currentPage,
  ]);

  // =========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    typeFilter,
  ]);

  // =========================================================
  // PAGE NUMBERS
  // =========================================================

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (
      currentPage >=
      totalPages - 2
    ) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }, [totalPages, currentPage]);

  // =========================================================
  // PAGE HANDLER
  // =========================================================

  const goToPage = (page) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
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
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_5px_rgba(15,23,42,0.025)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </p>

            <p className="mt-1 text-[23px] font-bold leading-none text-slate-900">
              {value}
            </p>
          </div>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
          >
            <Icon
              size={18}
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
    const normalizedStatus =
      status?.toLowerCase();

    const isConfirmed =
      normalizedStatus === "confirmed";

    const isCancelled =
      normalizedStatus === "cancelled" ||
      normalizedStatus === "rejected";

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
          isConfirmed
            ? "bg-emerald-50 text-emerald-600"
            : isCancelled
            ? "bg-red-50 text-red-600"
            : "bg-amber-50 text-amber-600"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isConfirmed
              ? "bg-emerald-500"
              : isCancelled
              ? "bg-red-500"
              : "bg-amber-500"
          }`}
        />

        {status || "Pending"}
      </span>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] px-4 py-5 sm:px-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2
              size={30}
              className="animate-spin text-violet-600"
            />

            <p className="mt-3 text-[12px] text-slate-500">
              Loading registrations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="rounded-xl border border-red-100 bg-white px-5 py-12 text-center">
            <Users
              size={32}
              className="mx-auto mb-3 text-red-300"
            />

            <h3 className="text-[14px] font-semibold text-slate-800">
              Failed to load registrations
            </h3>

            <p className="mt-1 text-[11px] text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                fetchRegistrations()
              }
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-4 text-[11px] font-semibold text-white transition hover:bg-violet-700"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-[1400px]">

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="mt-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

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

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_5px_rgba(15,23,42,0.025)]">

          <div className="flex flex-col gap-2.5 lg:flex-row">

            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search by name, email, phone or country..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}

            </div>

            {/* STATUS */}

            <div className="relative lg:w-[160px]">

              <SlidersHorizontal
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-[12px] font-medium text-slate-600 outline-none focus:border-violet-400 focus:bg-white"
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
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

            </div>

            {/* TYPE */}

            <div className="relative lg:w-[160px]">

              <UserRound
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-[12px] font-medium text-slate-600 outline-none focus:border-violet-400 focus:bg-white"
              >
                {registrationTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type === "All"
                        ? "All Types"
                        : type}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() =>
                fetchRegistrations(true)
              }
              disabled={refreshing}
              title="Refresh"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

            {/* CLEAR */}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-[11px] font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <X size={13} />
                Clear
              </button>
            )}

          </div>
        </div>

        {/* ===================================================
            REGISTRATIONS TABLE
        =================================================== */}

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_5px_rgba(15,23,42,0.025)]">

          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[1.4fr_1.5fr_1fr_0.9fr_0.8fr] gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-3 md:grid">

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Attendee
            </p>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Email
            </p>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Phone
            </p>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Type
            </p>

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </p>

          </div>

          {/* TABLE ROWS */}

          {paginatedRegistrations.length > 0 ? (

            paginatedRegistrations.map(
              (registration) => (

                <div
                  key={registration.id}
                  className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 md:grid-cols-[1.4fr_1.5fr_1fr_0.9fr_0.8fr] md:items-center md:gap-4"
                >

                  {/* ATTENDEE */}

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[10px] font-bold text-violet-600">
                      {getInitials(
                        registration.name
                      )}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-[12px] font-semibold text-slate-900">
                        {registration.name}
                      </p>

                      <div className="mt-1 flex items-center gap-1 md:hidden">

                        <Mail
                          size={11}
                          className="text-slate-400"
                        />

                        <p className="truncate text-[10px] text-slate-500">
                          {registration.email}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="hidden min-w-0 md:block">

                    <div className="flex items-center gap-2">

                      <Mail
                        size={14}
                        className="shrink-0 text-slate-400"
                      />

                      <p className="truncate text-[11px] text-slate-600">
                        {registration.email}
                      </p>

                    </div>

                  </div>

                  {/* PHONE */}

                  <div className="hidden min-w-0 md:block">

                    <div className="flex items-center gap-2">

                      <Phone
                        size={14}
                        className="shrink-0 text-slate-400"
                      />

                      <p className="truncate text-[11px] text-slate-600">
                        {registration.phone}
                      </p>

                    </div>

                  </div>

                  {/* TYPE */}

                  <div>

                    <span className="inline-flex rounded-md bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-600">
                      {registration.type}
                    </span>

                  </div>

                  {/* STATUS */}

                  <div>
                    <StatusBadge
                      status={
                        registration.status
                      }
                    />
                  </div>

                </div>
              )
            )

          ) : (

            /* EMPTY STATE */

            <div className="px-5 py-14 text-center">

              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">

                <Users
                  size={20}
                  className="text-slate-300"
                />

              </div>

              <h3 className="mt-3 text-[13px] font-bold text-slate-800">
                No registrations found
              </h3>

              <p className="mt-1 text-[11px] text-slate-500">
                Try changing your search or filter criteria.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-violet-700"
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

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-5 py-3">

                {/* LEFT INFO */}

                <p className="text-[10px] text-slate-400">

                  Page{" "}

                  <span className="font-semibold text-slate-600">
                    {currentPage}
                  </span>

                  {" "}of{" "}

                  <span className="font-semibold text-slate-600">
                    {totalPages}
                  </span>

                </p>

                {/* PAGINATION */}

                <div className="flex items-center gap-1">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    className={`flex h-8 w-8 items-center justify-center rounded-md border transition ${
                      currentPage === 1
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                        : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    <ChevronLeft
                      size={14}
                    />
                  </button>

                  {/* PAGE NUMBERS */}

                  {pageNumbers.map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          goToPage(page)
                        }
                        className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[10px] font-semibold transition ${
                          currentPage ===
                          page
                            ? "bg-violet-600 text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                    className={`flex h-8 w-8 items-center justify-center rounded-md border transition ${
                      currentPage ===
                      totalPages
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                        : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    <ChevronRight
                      size={14}
                    />
                  </button>

                </div>
              </div>
            )}
        </div>

        {/* ===================================================
            FOOTER SUMMARY
        =================================================== */}

        {filteredRegistrations.length > 0 && (

          <div className="mt-2 flex items-center justify-between px-1">

            <p className="text-[10px] text-slate-400">

              Showing{" "}

              <span className="font-semibold text-slate-600">
                {(currentPage - 1) *
                  ITEMS_PER_PAGE +
                  1}
              </span>

              {" - "}

              <span className="font-semibold text-slate-600">
                {Math.min(
                  currentPage *
                    ITEMS_PER_PAGE,
                  filteredRegistrations.length
                )}
              </span>

              {" of "}

              <span className="font-semibold text-slate-600">
                {filteredRegistrations.length}
              </span>

              {" "}registrations

            </p>

            <p className="text-[10px] text-slate-400">
              {ITEMS_PER_PAGE} per page
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default Registrations;