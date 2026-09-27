import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserRound,
  SlidersHorizontal,
} from "lucide-react";

// =========================================================
// ABSTRACT DATA
// =========================================================

const abstracts = [
  {
    id: 1,
    title: "Advances in Cardiovascular Medicine",
    author: "Dr. James Wilson",
    email: "james.wilson@example.com",
    status: "Approved",
    category: "Cardiology",
  },
  {
    id: 2,
    title: "Modern Approaches to Heart Disease",
    author: "Dr. Emily Carter",
    email: "emily.carter@example.com",
    status: "Pending",
    category: "Cardiology",
  },
  {
    id: 3,
    title: "Digital Transformation in Cardiology",
    author: "Dr. David Miller",
    email: "david.miller@example.com",
    status: "Rejected",
    category: "Digital Health",
  },
  {
    id: 4,
    title: "AI Applications in Medical Diagnosis",
    author: "Dr. Sarah Anderson",
    email: "sarah.anderson@example.com",
    status: "Approved",
    category: "Artificial Intelligence",
  },
  {
    id: 5,
    title: "Personalized Medicine and Genomics",
    author: "Dr. Michael Brown",
    email: "michael.brown@example.com",
    status: "Pending",
    category: "Genomics",
  },
  {
    id: 6,
    title: "Telemedicine in Modern Healthcare",
    author: "Dr. Olivia Taylor",
    email: "olivia.taylor@example.com",
    status: "Approved",
    category: "Healthcare Technology",
  },
  {
    id: 7,
    title: "Early Detection of Cardiovascular Risk",
    author: "Dr. Daniel Wilson",
    email: "daniel.wilson@example.com",
    status: "Pending",
    category: "Cardiology",
  },
  {
    id: 8,
    title: "Machine Learning for Clinical Research",
    author: "Dr. Sophia Davis",
    email: "sophia.davis@example.com",
    status: "Rejected",
    category: "Artificial Intelligence",
  },
  {
    id: 9,
    title: "Innovations in Preventive Cardiology",
    author: "Dr. Robert Thomas",
    email: "robert.thomas@example.com",
    status: "Approved",
    category: "Cardiology",
  },
  {
    id: 10,
    title: "Remote Patient Monitoring Systems",
    author: "Dr. Emma Johnson",
    email: "emma.johnson@example.com",
    status: "Pending",
    category: "Digital Health",
  },
  {
    id: 11,
    title: "Advances in Cardiovascular Imaging",
    author: "Dr. William Harris",
    email: "william.harris@example.com",
    status: "Approved",
    category: "Medical Imaging",
  },
  {
    id: 12,
    title: "Next Generation Healthcare Platforms",
    author: "Dr. Isabella Martin",
    email: "isabella.martin@example.com",
    status: "Pending",
    category: "Healthcare Technology",
  },
];

// =========================================================
// PAGINATION
// =========================================================

const ITEMS_PER_PAGE = 5;

// =========================================================
// ABSTRACTS COMPONENT
// =========================================================

function Abstracts() {
  // =========================================================
  // STATES
  // =========================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalAbstracts = abstracts.length;

  const approvedAbstracts = abstracts.filter(
    (item) => item.status === "Approved"
  ).length;

  const pendingAbstracts = abstracts.filter(
    (item) => item.status === "Pending"
  ).length;

  const rejectedAbstracts = abstracts.filter(
    (item) => item.status === "Rejected"
  ).length;

  // =========================================================
  // FILTER DATA
  // =========================================================

  const filteredAbstracts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return abstracts.filter((abstract) => {
      const matchesSearch =
        !query ||
        abstract.title.toLowerCase().includes(query) ||
        abstract.author.toLowerCase().includes(query) ||
        abstract.email.toLowerCase().includes(query) ||
        abstract.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        abstract.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  // =========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    filteredAbstracts.length / ITEMS_PER_PAGE
  );

  const paginatedAbstracts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredAbstracts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAbstracts, currentPage]);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // =========================================================
  // PAGINATION HANDLER
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
    setCurrentPage(1);
  };

  const hasFilters =
    search || statusFilter !== "All";

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
    const statusConfig = {
      Approved: {
        icon: CheckCircle2,
        wrapper:
          "bg-emerald-50 text-emerald-600",
        dot: "bg-emerald-500",
      },

      Pending: {
        icon: Clock3,
        wrapper:
          "bg-amber-50 text-amber-600",
        dot: "bg-amber-500",
      },

      Rejected: {
        icon: XCircle,
        wrapper:
          "bg-red-50 text-red-500",
        dot: "bg-red-500",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.wrapper}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
        />

        <Icon size={11} />

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

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Total Abstracts"
            value={totalAbstracts}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />

          <StatCard
            icon={CheckCircle2}
            label="Approved"
            value={approvedAbstracts}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            icon={Clock3}
            label="Pending"
            value={pendingAbstracts}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

          <StatCard
            icon={XCircle}
            label="Rejected"
            value={rejectedAbstracts}
            iconBg="bg-red-50"
            iconColor="text-red-500"
          />
        </div>

        {/* ===================================================
            SEARCH + FILTERS
        =================================================== */}

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_1px_5px_rgba(15,23,42,0.025)]">
          <div className="flex flex-col gap-2 sm:flex-row">

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
                placeholder="Search by title, author or category..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* STATUS FILTER */}

            <div className="relative sm:w-[160px]">
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

                <option value="Approved">
                  Approved
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Rejected">
                  Rejected
                </option>
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
            ABSTRACTS LIST
        =================================================== */}

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_5px_rgba(15,23,42,0.025)]">

          {/* DESKTOP HEADER */}

          <div className="hidden grid-cols-[1.8fr_1.1fr_0.8fr] gap-4 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 md:grid">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Abstract
            </p>

            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Category
            </p>

            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </p>
          </div>

          {/* ABSTRACT ROWS */}

          {paginatedAbstracts.length > 0 ? (
            paginatedAbstracts.map((abstract) => (
              <div
                key={abstract.id}
                className="grid gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 md:grid-cols-[1.8fr_1.1fr_0.8fr] md:items-center md:gap-4"
              >

                {/* ABSTRACT */}

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                    <FileText
                      size={15}
                      className="text-violet-600"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-slate-900">
                      {abstract.title}
                    </p>

                    <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                      <UserRound
                        size={10}
                        className="shrink-0 text-slate-400"
                      />

                      <p className="truncate text-[9px] text-slate-500">
                        {abstract.author}
                      </p>

                      <span className="hidden text-slate-300 sm:inline">
                        •
                      </span>

                      <p className="hidden truncate text-[9px] text-slate-400 sm:block">
                        {abstract.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CATEGORY */}

                <div>
                  <span className="inline-flex rounded-md bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-600">
                    {abstract.category}
                  </span>
                </div>

                {/* STATUS */}

                <div>
                  <StatusBadge
                    status={abstract.status}
                  />
                </div>
              </div>
            ))
          ) : (
            /* EMPTY STATE */

            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                <FileText
                  size={18}
                  className="text-slate-300"
                />
              </div>

              <h3 className="mt-2.5 text-[12px] font-bold text-slate-800">
                No abstracts found
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

          {filteredAbstracts.length > 0 &&
            totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-4 py-2.5">

                {/* PAGE INFO */}

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

                {/* PAGINATION */}

                <div className="flex items-center gap-1">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    className={`flex h-7 w-7 items-center justify-center rounded-md border transition ${
                      currentPage === 1
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                        : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
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
                    className={`flex h-7 w-7 items-center justify-center rounded-md border transition ${
                      currentPage === totalPages
                        ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                        : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
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
            FOOTER SUMMARY
        =================================================== */}

        {filteredAbstracts.length > 0 && (
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
                  filteredAbstracts.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {filteredAbstracts.length}
              </span>{" "}
              abstracts
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

export default Abstracts;