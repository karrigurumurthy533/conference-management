
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  MoreVertical,
  Eye,
  Trash2,
  FileText,
  CheckCircle2,
  Clock3,
  XCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAbstracts,
  deleteAbstract,
  downloadAbstract,
} from "../../redux/abstractsSlice";

/* =========================================================
   HELPERS
========================================================= */

const getFullName = (abstract) => {
  const presenter = abstract?.presenter || {};

  const name = [
    presenter?.title,
    presenter?.firstName,
    presenter?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    name ||
    presenter?.fullName ||
    presenter?.name ||
    abstract?.fullName ||
    "Unknown Author"
  );
};

const getEmail = (abstract) =>
  abstract?.presenter?.email || abstract?.email || "-";

const getCategory = (abstract) =>
  abstract?.abstractDetails?.category ||
  abstract?.category ||
  abstract?.presentationType ||
  "Oral";

const getConference = (abstract) =>
  abstract?.abstractDetails?.conferenceId ||
  abstract?.conference ||
  abstract?.conferenceId ||
  null;

const getConferenceName = (abstract) => {
  const conference = getConference(abstract);

  if (typeof conference === "string") {
    return conference;
  }

  if (conference && typeof conference === "object") {
    return (
      conference?.title ||
      conference?.conferenceTitle ||
      conference?.name ||
      conference?.basicInformation?.title ||
      "Conference"
    );
  }

  return (
    abstract?.conferenceName ||
    abstract?.conferenceTitle ||
    "Conference"
  );
};

const getStatus = (abstract) =>
  abstract?.status || abstract?.abstractStatus || "Submitted";

const getSubmittedDate = (abstract) =>
  abstract?.submittedAt ||
  abstract?.createdAt ||
  abstract?.submissionDate ||
  abstract?.date;

const getFileName = (abstract) => {
  const name =
    abstract?.abstractFile?.originalFileName ||
    abstract?.file?.originalFileName ||
    abstract?.fileName ||
    "abstract.pdf";

  return name === "Abstract File" ? "abstract.pdf" : name;
};

const getFileUrl = (abstract) =>
  abstract?.abstractFile?.fileUrl ||
  abstract?.abstractFile?.url ||
  abstract?.file?.fileUrl ||
  abstract?.file?.url ||
  abstract?.fileUrl ||
  "";

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  name
    .replace(/^(Dr\.|Prof\.|Ms\.|Mr\.|Mrs\.)\s*/i, "")
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .trim();

  if (["accepted", "approved", "published"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <CheckCircle2 size={12} />
        {status}
      </span>
    );
  }

  if (["rejected", "declined"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
        <XCircle size={12} />
        {status}
      </span>
    );
  }

  if (["under review", "review"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
        <Clock3 size={12} />
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
      <Clock3 size={12} />
      {status || "Submitted"}
    </span>
  );
};

/* =========================================================
   INLINE ERROR
========================================================= */

const InlineError = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
      role="alert"
    >
      <div className="flex min-w-0 items-center gap-2">
        <AlertTriangle size={16} className="shrink-0 text-red-500" />
        <p className="break-words text-xs font-medium text-red-700">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-md p-1 text-red-500 transition hover:bg-red-100"
        aria-label="Close error message"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function Abstracts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    abstracts = [],
    loading = false,
    deleteLoading = false,
    error = "",
    deleteError = "",
  } = useSelector((state) => state.abstracts || {});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState("");
  const [actionError, setActionError] = useState("");

  const [deletePopup, setDeletePopup] = useState({
    open: false,
    abstract: null,
  });

  const itemsPerPage = 6;

  /* FETCH */

  useEffect(() => {
    dispatch(fetchAbstracts());
  }, [dispatch]);

  /* NORMALIZE DATA */

  const normalizedAbstracts = useMemo(() => {
    if (Array.isArray(abstracts)) return abstracts;

    if (Array.isArray(abstracts?.data)) {
      return abstracts.data;
    }

    if (Array.isArray(abstracts?.abstracts)) {
      return abstracts.abstracts;
    }

    if (Array.isArray(abstracts?.results)) {
      return abstracts.results;
    }

    return [];
  }, [abstracts]);

  /* SUMMARY */

  const totalAbstracts = normalizedAbstracts.length;

  const submittedAbstracts = normalizedAbstracts.filter(
    (item) =>
      String(getStatus(item)).toLowerCase().trim() === "submitted"
  ).length;

  const acceptedAbstracts = normalizedAbstracts.filter((item) =>
    ["accepted", "approved"].includes(
      String(getStatus(item)).toLowerCase().trim()
    )
  ).length;

  const rejectedAbstracts = normalizedAbstracts.filter((item) =>
    ["rejected", "declined"].includes(
      String(getStatus(item)).toLowerCase().trim()
    )
  ).length;

  /* FILTER */

  const filteredAbstracts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return normalizedAbstracts.filter((abstract) => {
      const fullName = getFullName(abstract).toLowerCase();
      const email = getEmail(abstract).toLowerCase();
      const category = String(getCategory(abstract)).toLowerCase();
      const conference = getConferenceName(abstract).toLowerCase();
      const status = String(getStatus(abstract)).toLowerCase();

      const reviewStatus = String(
        abstract?.reviewStatus || "Pending"
      ).toLowerCase();

      const abstractId = String(abstract?._id || "").toLowerCase();
      const fileName = getFileName(abstract).toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        category.includes(searchValue) ||
        conference.includes(searchValue) ||
        status.includes(searchValue) ||
        reviewStatus.includes(searchValue) ||
        abstractId.includes(searchValue) ||
        fileName.includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" ||
        status === statusFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === "All Categories" ||
        category === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [
    normalizedAbstracts,
    search,
    statusFilter,
    categoryFilter,
  ]);

  /* PAGINATION */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAbstracts.length / itemsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const currentAbstracts = filteredAbstracts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter]);

  /* ID */

  const getMongoId = (abstract) => abstract?._id;

  /* MENU */

  const toggleMenu = (abstractId) => {
    setOpenMenu((previous) =>
      previous === abstractId ? null : abstractId
    );
  };

  /* VIEW */

  const handleView = (abstract) => {
    setOpenMenu(null);
    setActionError("");

    const id = getMongoId(abstract);

    if (!id) {
      setActionError("Unable to open abstract. Invalid abstract ID.");
      return;
    }

    navigate(`/admin/abstracts/${id}`);
  };

  /* DOWNLOAD */

  const handleDownload = async (abstract) => {
    setOpenMenu(null);
    setDownloadError("");

    const id = getMongoId(abstract);

    if (!id) {
      setDownloadError("Unable to download abstract. Invalid abstract ID.");
      return;
    }

    if (downloadingId) return;

    try {
      setDownloadingId(id);

      const result = await dispatch(downloadAbstract(id)).unwrap();

      // Supports both a direct Blob and an object containing a Blob.
      let blob = null;

      if (result instanceof Blob) {
        blob = result;
      } else if (result?.blob instanceof Blob) {
        blob = result.blob;
      } else if (result?.file instanceof Blob) {
        blob = result.file;
      } else if (result?.data instanceof Blob) {
        blob = result.data;
      }

      if (!blob || blob.size === 0) {
        throw new Error(
          "Downloaded file is empty. Check the downloadAbstract thunk in abstractsSlice.js."
        );
      }

      // If the backend returned an error JSON as a Blob, show its message.
      if (blob.type.includes("application/json")) {
        const text = await blob.text();
        let message = "Server returned an error instead of the PDF.";

        try {
          const parsed = JSON.parse(text);
          message = parsed.message || message;
        } catch {
          // Keep fallback message.
        }

        throw new Error(message);
      }

      // Validate actual PDF signature.
      const signature = await blob.slice(0, 5).text();

      if (signature !== "%PDF-") {
        throw new Error(
          "Downloaded content is not a valid PDF. Check the backend download endpoint."
        );
      }

      let fileName = getFileName(abstract);

      if (!fileName.toLowerCase().endsWith(".pdf")) {
        fileName += ".pdf";
      }

      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1500);
    } catch (err) {
      console.error("Abstract download failed:", err);

      setDownloadError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to download abstract. Please try again."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  /* OPEN DELETE POPUP */

  const handleDelete = (abstract) => {
    setOpenMenu(null);
    setActionError("");

    if (!getMongoId(abstract)) {
      setActionError("Unable to delete abstract. Invalid abstract ID.");
      return;
    }

    setDeletePopup({
      open: true,
      abstract,
    });
  };

  const handleCloseDeletePopup = () => {
    if (deleteLoading) return;

    setDeletePopup({
      open: false,
      abstract: null,
    });
  };

  /* CONFIRM DELETE */

  const handleConfirmDelete = async () => {
    const abstract = deletePopup.abstract;
    const id = getMongoId(abstract);

    if (!id || deleteLoading) return;

    try {
      setActionError("");

      await dispatch(deleteAbstract(id)).unwrap();

      setDeletePopup({
        open: false,
        abstract: null,
      });

      dispatch(fetchAbstracts());
    } catch (err) {
      setActionError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete abstract. Please try again."
      );
    }
  };

  /* MOTION */

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  /* RENDER */

  return (
    <>
      <motion.div
        className="min-w-0 w-full space-y-4 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* SUMMARY CARDS */}

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 gap-1.5 xl:grid-cols-4"
        >
          {[
            {
              title: "Total Abstracts",
              value: totalAbstracts,
              icon: FileText,
            },
            {
              title: "Submitted",
              value: submittedAbstracts,
              icon: Clock3,
            },
            {
              title: "Accepted",
              value: acceptedAbstracts,
              icon: CheckCircle2,
            },
            {
              title: "Rejected",
              value: rejectedAbstracts,
              icon: XCircle,
            },
          ].map((card) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[12px] font-medium text-gray-500">
                      {card.title}
                    </p>

                    <p className="mt-1 text-[21px] font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                    <Icon size={18} className="text-violet-600" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* API ERRORS */}

        <AnimatePresence>
          {(error || deleteError) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-xs font-medium text-red-700">
                {error || deleteError}
              </p>

              <button
                type="button"
                onClick={() => dispatch(fetchAbstracts())}
                className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {actionError && (
            <InlineError
              message={actionError}
              onClose={() => setActionError("")}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {downloadError && (
            <InlineError
              message={downloadError}
              onClose={() => setDownloadError("")}
            />
          )}
        </AnimatePresence>

        {/* MAIN TABLE */}

        <motion.div
          variants={cardVariants}
          className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm"
        >
          {/* FILTERS */}

          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search author, email or conference..."
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-9 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-40"
            >
              <option value="All Categories">All Categories</option>
              <option value="Oral">Oral</option>
              <option value="Poster">Poster</option>
              <option value="Workshop">Workshop</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-36"
            >
              <option value="All Status">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* TABLE */}

          <div className="w-full overflow-visible">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="w-[27%] px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                    Author
                  </th>

                  <th className="w-[39%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                    Conference Name
                  </th>

                  <th className="w-[14%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                    Category
                  </th>

                  <th className="w-[12%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                    Date
                  </th>

                  <th className="w-[8%] px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <motion.tr key="loading">
                      <td colSpan={5} className="px-4 py-14 text-center">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />

                          <p className="mt-3 text-xs font-medium text-gray-500">
                            Loading abstracts...
                          </p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : currentAbstracts.length === 0 ? (
                    <motion.tr key="empty">
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FileText
                            size={32}
                            className="mb-3 text-violet-300"
                          />

                          <p className="text-[13px] font-semibold text-gray-600">
                            No abstracts found
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            Try changing your search or filters.
                          </p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    currentAbstracts.map((abstract) => {
                      const abstractId = abstract?._id;
                      const authorName = getFullName(abstract);
                      const conferenceName = getConferenceName(abstract);

                      return (
                        <motion.tr
                          key={abstractId}
                          layout
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{
                            opacity: 0,
                            x: -10,
                            transition: { duration: 0.2 },
                          }}
                          className="border-b border-gray-50 transition hover:bg-violet-50/30"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
                                {getInitials(authorName)}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-semibold text-gray-800">
                                  {authorName}
                                </p>

                                <p className="truncate text-[10px] text-gray-400">
                                  {getEmail(abstract)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <p
                              title={conferenceName}
                              className="truncate text-[13px] font-medium text-gray-700"
                            >
                              {conferenceName}
                            </p>

                            <div className="mt-1">
                              <StatusBadge status={getStatus(abstract)} />
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="inline-flex rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
                              {getCategory(abstract)}
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="text-[12px] font-medium text-gray-600">
                              {formatDate(getSubmittedDate(abstract))}
                            </span>
                          </td>

                          <td className="relative z-40 px-4 py-3.5 text-center">
                            <button
                              type="button"
                              disabled={deleteLoading}
                              onClick={() => toggleMenu(abstractId)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Abstract actions"
                            >
                              <MoreVertical size={17} />
                            </button>

                            <AnimatePresence>
                              {openMenu === abstractId && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute bottom-11 right-4 z-50 w-40 rounded-lg border border-gray-100 bg-white p-1.5 text-left shadow-lg"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleView(abstract)}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                                  >
                                    <Eye size={14} />
                                    View
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      !abstractId ||
                                      downloadingId === abstractId
                                    }
                                    onClick={() => handleDownload(abstract)}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    {downloadingId === abstractId ? (
                                      <>
                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
                                        Downloading...
                                      </>
                                    ) : (
                                      <>
                                        <Download size={14} />
                                        Download
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    disabled={deleteLoading}
                                    onClick={() => handleDelete(abstract)}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
            <p className="text-[11px] text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredAbstracts.length === 0
                  ? 0
                  : (safeCurrentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-700">
                {Math.min(
                  safeCurrentPage * itemsPerPage,
                  filteredAbstracts.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {filteredAbstracts.length}
              </span>{" "}
              abstracts
            </p>

            <div className="flex items-center gap-1.5">
              <motion.button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                whileTap={{ scale: 0.92 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </motion.button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .slice(
                  Math.max(0, safeCurrentPage - 3),
                  Math.min(totalPages, safeCurrentPage + 2)
                )
                .map((page) => (
                  <motion.button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    whileTap={{ scale: 0.92 }}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                      page === safeCurrentPage
                        ? "bg-violet-600 text-white"
                        : "border border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}

              <motion.button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                whileTap={{ scale: 0.92 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* DELETE CONFIRMATION POPUP */}

      <AnimatePresence>
        {deletePopup.open && deletePopup.abstract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                handleCloseDeletePopup();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex items-start gap-3.5 px-5 pb-3 pt-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <AlertTriangle size={21} className="text-red-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-bold text-gray-900">
                    Delete Abstract?
                  </h3>

                  <p className="mt-1 text-[12px] leading-5 text-gray-500">
                    Are you sure you want to delete this abstract? This
                    action cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleCloseDeletePopup}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mx-5 mb-4 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
                    {getInitials(getFullName(deletePopup.abstract))}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-gray-800">
                      {getFullName(deletePopup.abstract)}
                    </p>

                    <p className="truncate text-[10px] text-gray-400">
                      {getEmail(deletePopup.abstract)}
                    </p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {actionError && (
                  <div className="mx-5 mb-3">
                    <InlineError
                      message={actionError}
                      onClose={() => setActionError("")}
                    />
                  </div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleCloseDeletePopup}
                  className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleConfirmDelete}
                  className="inline-flex h-9 min-w-[105px] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-[11px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Abstracts;