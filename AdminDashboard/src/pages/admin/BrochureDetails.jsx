
import React, { useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  FileText,
  Download,
  Users,
  Clock3,
  CalendarDays,
  MoreVertical,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const DownloadBrochures = () => {
  const navigate = useNavigate();

  const [brochures, setBrochures] = useState([
    {
      _id: "1",
      fullName: "Gurumurthy Karri",
      conference:
        "2nd International Conference on Autism Research and Innovations",
      status: "Downloaded",
      downloadedAt: "2026-10-01",
    },
    {
      _id: "2",
      fullName: "John Smith",
      conference: "International Conference on Mental Health",
      status: "Downloaded",
      downloadedAt: "2026-09-28",
    },
    {
      _id: "3",
      fullName: "Sarah Johnson",
      conference: "Global Conference on Healthcare Innovation",
      status: "Pending",
      downloadedAt: "2026-09-25",
    },
    {
      _id: "4",
      fullName: "David Wilson",
      conference:
        "International Conference on Food and Nutrition",
      status: "Downloaded",
      downloadedAt: "2026-09-22",
    },
    {
      _id: "5",
      fullName: "Priya Sharma",
      conference:
        "International Conference on Endocrinology and Diabetes",
      status: "Downloaded",
      downloadedAt: "2026-09-20",
    },
    {
      _id: "6",
      fullName: "Michael Brown",
      conference: "Global Oncology and AI Conference",
      status: "Downloaded",
      downloadedAt: "2026-09-18",
    },
    {
      _id: "7",
      fullName: "Emma Davis",
      conference:
        "International Conference on Heart and Cardiovascular Diseases",
      status: "Pending",
      downloadedAt: "2026-09-15",
    },
    {
      _id: "8",
      fullName: "Robert Miller",
      conference: "AI and Digital Psychiatry Conference",
      status: "Downloaded",
      downloadedAt: "2026-09-12",
    },
    {
      _id: "9",
      fullName: "Ananya Reddy",
      conference:
        "2nd International Conference on Autism Research and Innovations",
      status: "Downloaded",
      downloadedAt: "2026-09-10",
    },
    {
      _id: "10",
      fullName: "Daniel Anderson",
      conference: "Global Conference on Healthcare Innovation",
      status: "Downloaded",
      downloadedAt: "2026-09-08",
    },
    {
      _id: "11",
      fullName: "Olivia Thomas",
      conference: "International Conference on Mental Health",
      status: "Pending",
      downloadedAt: "2026-09-05",
    },
    {
      _id: "12",
      fullName: "James Taylor",
      conference: "Global Oncology and AI Conference",
      status: "Downloaded",
      downloadedAt: "2026-09-03",
    },
  ]);

  const [search, setSearch] = useState("");

  const [conferenceFilter, setConferenceFilter] =
    useState("All Conferences");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [openMenu, setOpenMenu] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // =========================================================
  // CONFERENCE OPTIONS
  // =========================================================

  const conferences = useMemo(() => {
    const conferenceNames = brochures
      .map((item) => item.conference)
      .filter(Boolean);

    return [
      "All Conferences",
      ...new Set(conferenceNames),
    ];
  }, [brochures]);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredBrochures = useMemo(() => {
    return brochures.filter((brochure) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const name = brochure?.fullName || "";

      const conference =
        brochure?.conference || "";

      const matchesSearch =
        !searchValue ||
        name.toLowerCase().includes(searchValue) ||
        conference.toLowerCase().includes(searchValue);

      const matchesConference =
        conferenceFilter === "All Conferences" ||
        conference === conferenceFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        brochure?.status === statusFilter;

      return (
        matchesSearch &&
        matchesConference &&
        matchesStatus
      );
    });
  }, [
    brochures,
    search,
    conferenceFilter,
    statusFilter,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBrochures.length / itemsPerPage
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedBrochures =
    filteredBrochures.slice(
      (safePage - 1) * itemsPerPage,
      safePage * itemsPerPage
    );

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalDownloads = brochures.length;

  const downloadedCount = brochures.filter(
    (item) => item.status === "Downloaded"
  ).length;

  const pendingCount = brochures.filter(
    (item) => item.status === "Pending"
  ).length;

  const conferenceCount = new Set(
    brochures.map((item) => item.conference)
  ).size;

  // =========================================================
  // INITIALS
  // =========================================================

  const getInitials = (name = "") => {
    return name
      .replace(/^Dr\.\s*/i, "")
      .replace(/^Prof\.\s*/i, "")
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // =========================================================
  // NAVIGATE TO DETAILS PAGE
  // =========================================================

  const handleNavigateToDetails = (brochure) => {
    setOpenMenu(null);

    navigate(
      `/admin/download-brochures/${brochure._id}/details`,
      {
        state: {
          brochure,
        },
      }
    );
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleView = (e, brochure) => {
    e.stopPropagation();

    handleNavigateToDetails(brochure);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = (e, id) => {
    e.stopPropagation();

    setOpenMenu(null);

    const confirmed = window.confirm(
      "Are you sure you want to delete this brochure download?"
    );

    if (!confirmed) return;

    setBrochures((previous) =>
      previous.filter(
        (item) => item._id !== id
      )
    );
  };

  // =========================================================
  // MOTION
  // =========================================================

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.35,
        ease: "easeOut",
        staggerChildren: 0.06,
      },
    },
  };

  const cardVariants = {
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

  const rowVariants = {
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

  return (
    <motion.div
      className="min-w-0 w-full overflow-hidden space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <motion.div
        className="grid grid-cols-2 gap-1.5 xl:grid-cols-4"
        variants={containerVariants}
      >
        {/* TOTAL */}

        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -2,
            transition: { duration: 0.2 },
          }}
          className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Total Downloads
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {totalDownloads}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Download
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>

        {/* DOWNLOADED */}

        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -2,
            transition: { duration: 0.2 },
          }}
          className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Downloaded
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {downloadedCount}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Users
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>

        {/* PENDING */}

        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -2,
            transition: { duration: 0.2 },
          }}
          className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Pending
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {pendingCount}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Clock3
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>

        {/* CONFERENCES */}

        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -2,
            transition: { duration: 0.2 },
          }}
          className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Conferences
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {conferenceCount}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CalendarDays
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <motion.div
        variants={cardVariants}
        className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm"
      >
        {/* =====================================================
            FILTER BAR
        ===================================================== */}

        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center">
          {/* SEARCH */}

          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search name or conference..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-9 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* CONFERENCE FILTER */}

          <select
            value={conferenceFilter}
            onChange={(e) => {
              setConferenceFilter(e.target.value);
              setCurrentPage(1);
              setOpenMenu(null);
            }}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-56"
          >
            {conferences.map((conference) => (
              <option
                key={conference}
                value={conference}
              >
                {conference}
              </option>
            ))}
          </select>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
              setOpenMenu(null);
            }}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-40"
          >
            <option value="All Status">
              All Status
            </option>

            <option value="Downloaded">
              Downloaded
            </option>

            <option value="Pending">
              Pending
            </option>
          </select>
        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="w-full overflow-visible">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="w-[27%] px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  Name
                </th>

                <th className="w-[43%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  Conference Name
                </th>

                <th className="w-[20%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  Date
                </th>

                <th className="w-[10%] px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedBrochures.length > 0 ? (
                  paginatedBrochures.map(
                    (brochure) => {
                      const id = brochure._id;

                      return (
                        <motion.tr
                          key={id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{
                            opacity: 0,
                            x: -10,
                            transition: {
                              duration: 0.2,
                            },
                          }}
                          layout
                          onClick={() =>
                            handleNavigateToDetails(
                              brochure
                            )
                          }
                          className="cursor-pointer border-b border-gray-50 transition hover:bg-violet-50/40"
                        >
                          {/* =================================================
                              NAME
                          ================================================= */}

                          <td className="px-5 py-3.5">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
                                {getInitials(
                                  brochure.fullName
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-semibold text-gray-800">
                                  {
                                    brochure.fullName
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* =================================================
                              CONFERENCE
                          ================================================= */}

                          <td className="px-4 py-3.5">
                            <p
                              title={
                                brochure.conference
                              }
                              className="truncate text-[13px] font-medium text-gray-700"
                            >
                              {
                                brochure.conference
                              }
                            </p>
                          </td>

                          {/* =================================================
                              DATE
                          ================================================= */}

                          <td className="px-4 py-3.5">
                            <span className="text-[12px] font-medium text-gray-600">
                              {new Date(
                                brochure.downloadedAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </td>

                          {/* =================================================
                              ACTIONS
                          ================================================= */}

                          <td
                            className="relative z-40 px-4 py-3.5 text-center"
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === id
                                    ? null
                                    : id
                                )
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                            >
                              <MoreVertical
                                size={17}
                              />
                            </button>

                            <AnimatePresence>
                              {openMenu === id && (
                                <motion.div
                                  initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: 5,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                  }}
                                  exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: 5,
                                  }}
                                  transition={{
                                    duration: 0.15,
                                  }}
                                  className="absolute bottom-11 right-4 z-50 w-36 rounded-lg border border-gray-100 bg-white p-1.5 text-left shadow-lg"
                                >
                                  {/* VIEW */}

                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      handleView(
                                        e,
                                        brochure
                                      )
                                    }
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                                  >
                                    <Eye
                                      size={14}
                                    />

                                    View
                                  </button>

                                  {/* DELETE */}

                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      handleDelete(
                                        e,
                                        id
                                      )
                                    }
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium text-red-500 hover:bg-red-50"
                                  >
                                    <Trash2
                                      size={14}
                                    />

                                    Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </motion.tr>
                      );
                    }
                  )
                ) : (
                  <motion.tr
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                  >
                    <td
                      colSpan="4"
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FileText
                          size={32}
                          className="mb-3 text-violet-300"
                        />

                        <p className="text-[13px] font-semibold text-gray-600">
                          No brochure downloads
                          found
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          Try changing your
                          search or filters.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
          <p className="text-[11px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredBrochures.length === 0
                ? 0
                : (safePage - 1) *
                    itemsPerPage +
                  1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                safePage * itemsPerPage,
                filteredBrochures.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {filteredBrochures.length}
            </span>{" "}
            downloads
          </p>

          <div className="flex items-center gap-1.5">
            {/* PREVIOUS */}

            <motion.button
              type="button"
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(page - 1, 1)
                )
              }
              whileTap={{
                scale: 0.92,
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </motion.button>

            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => index + 1
            ).map((page) => (
              <motion.button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                whileTap={{
                  scale: 0.92,
                }}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                  safePage === page
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                {page}
              </motion.button>
            ))}
            
            {/* NEXT */}

            <motion.button
              type="button"
              disabled={
                safePage === totalPages
              }
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    page + 1,
                    totalPages
                  )
                )
              }
              whileTap={{
                scale: 0.92,
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DownloadBrochures;
