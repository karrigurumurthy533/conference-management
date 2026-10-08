import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  MoreVertical,
  Eye,
  Pencil,
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

const getEmail = (abstract) => {
  return abstract?.presenter?.email || abstract?.email || "-";
};

const getPhone = (abstract) => {
  return abstract?.presenter?.phone || abstract?.phone || "-";
};

const getCategory = (abstract) => {
  return (
    abstract?.abstractDetails?.category ||
    abstract?.category ||
    abstract?.presentationType ||
    "Oral"
  );
};

const getConference = (abstract) => {
  return (
    abstract?.abstractDetails?.conferenceId ||
    abstract?.conference ||
    abstract?.conferenceId ||
    null
  );
};

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

const getConferenceId = (abstract) => {
  const conference = getConference(abstract);

  if (typeof conference === "string") {
    return conference;
  }

  return conference?._id || null;
};

const getStatus = (abstract) => {
  return (
    abstract?.status ||
    abstract?.abstractStatus ||
    "Submitted"
  );
};

const getReviewStatus = (abstract) => {
  return abstract?.reviewStatus || "Pending";
};

const getSubmittedDate = (abstract) => {
  return (
    abstract?.submittedAt ||
    abstract?.createdAt ||
    abstract?.submissionDate ||
    abstract?.date
  );
};

const getCountry = (abstract) => {
  return abstract?.location?.country || "-";
};

const getAddress = (abstract) => {
  return abstract?.location?.fullPostalAddress || "-";
};

const getFileUrl = (abstract) => {
  return (
    abstract?.abstractFile?.fileUrl ||
    abstract?.abstractFile?.url ||
    abstract?.abstractFile?.secure_url ||
    abstract?.file?.url ||
    abstract?.file?.secure_url ||
    abstract?.fileUrl ||
    abstract?.abstractFileUrl ||
    null
  );
};

const getFileName = (abstract) => {
  return abstract?.abstractFile?.originalFileName || "Abstract File";
};

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

const getInitials = (name = "") => {
  return name
    .replace(/^Dr\.\s*/i, "")
    .replace(/^Prof\.\s*/i, "")
    .replace(/^Ms\.\s*/i, "")
    .replace(/^Mr\.\s*/i, "")
    .replace(/^Mrs\.\s*/i, "")
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .trim();

  if (
    normalized === "accepted" ||
    normalized === "approved" ||
    normalized === "published"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <CheckCircle2 size={12} />
        {status}
      </span>
    );
  }

  if (
    normalized === "rejected" ||
    normalized === "declined"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
        <XCircle size={12} />
        {status}
      </span>
    );
  }

  if (
    normalized === "under review" ||
    normalized === "review"
  ) {
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
   MAIN COMPONENT
========================================================= */

function Abstracts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* =======================================================
     REDUX
  ======================================================= */

  const {
    abstracts = [],
    loading = false,
    deleteLoading = false,
    error = "",
    deleteError = "",
  } = useSelector(
    (state) => state.abstracts || {}
  );

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [openMenu, setOpenMenu] = useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  /* =======================================================
     DELETE CONFIRMATION POPUP
  ======================================================= */

  const [deletePopup, setDeletePopup] = useState({
    open: false,
    abstract: null,
  });

  const itemsPerPage = 6;

  /* =======================================================
     FETCH ABSTRACTS
  ======================================================= */

  useEffect(() => {
    dispatch(fetchAbstracts());
  }, [dispatch]);

  /* =======================================================
     NORMALIZE API DATA
  ======================================================= */

  const normalizedAbstracts = useMemo(() => {
    if (Array.isArray(abstracts)) {
      return abstracts;
    }

    if (
      abstracts &&
      Array.isArray(abstracts.data)
    ) {
      return abstracts.data;
    }

    if (
      abstracts &&
      Array.isArray(abstracts.abstracts)
    ) {
      return abstracts.abstracts;
    }

    if (
      abstracts &&
      Array.isArray(abstracts.results)
    ) {
      return abstracts.results;
    }

    return [];
  }, [abstracts]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalAbstracts =
    normalizedAbstracts.length;

  const submittedAbstracts =
    normalizedAbstracts.filter(
      (item) =>
        String(getStatus(item))
          .toLowerCase()
          .trim() === "submitted"
    ).length;

  const acceptedAbstracts =
    normalizedAbstracts.filter((item) => {
      const status = String(
        getStatus(item)
      )
        .toLowerCase()
        .trim();

      return (
        status === "accepted" ||
        status === "approved"
      );
    }).length;

  const rejectedAbstracts =
    normalizedAbstracts.filter((item) => {
      const status = String(
        getStatus(item)
      )
        .toLowerCase()
        .trim();

      return (
        status === "rejected" ||
        status === "declined"
      );
    }).length;

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredAbstracts = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return normalizedAbstracts.filter(
      (abstract) => {
        const fullName =
          getFullName(abstract)
            .toLowerCase();

        const email =
          getEmail(abstract)
            .toLowerCase();

        const category =
          String(
            getCategory(abstract)
          ).toLowerCase();

        const conference =
          getConferenceName(abstract)
            .toLowerCase();

        const status =
          String(
            getStatus(abstract)
          ).toLowerCase();

        const reviewStatus =
          String(
            getReviewStatus(abstract)
          ).toLowerCase();

        const abstractId =
          String(
            abstract?._id || ""
          ).toLowerCase();

        const fileName =
          String(
            getFileName(abstract)
          ).toLowerCase();

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
          status ===
            statusFilter.toLowerCase();

        const matchesCategory =
          categoryFilter ===
            "All Categories" ||
          category ===
            categoryFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      }
    );
  }, [
    normalizedAbstracts,
    search,
    statusFilter,
    categoryFilter,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAbstracts.length /
        itemsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const currentAbstracts =
    filteredAbstracts.slice(
      (safeCurrentPage - 1) *
        itemsPerPage,
      safeCurrentPage *
        itemsPerPage
    );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    categoryFilter,
  ]);

  /* =======================================================
     ACTION MENU
  ======================================================= */

  const toggleMenu = (abstractId) => {
    setOpenMenu(
      (previous) =>
        previous === abstractId
          ? null
          : abstractId
    );
  };

  /* =======================================================
     GET MONGO ID
  ======================================================= */

  const getMongoId = (abstract) => {
    return abstract?._id;
  };

  /* =======================================================
     VIEW
  ======================================================= */

  const handleView = (abstract) => {
    setOpenMenu(null);

    const id = getMongoId(abstract);

    if (!id) {
      window.alert(
        "Invalid abstract ID."
      );
      return;
    }

    navigate(
      `/admin/abstracts/${id}`
    );
  };

  /* =======================================================
     DOWNLOAD
  ======================================================= */

  const handleDownload = (abstract) => {
    setOpenMenu(null);

    const fileUrl =
      getFileUrl(abstract);

    if (!fileUrl) {
      window.alert(
        "Abstract file is not available."
      );
      return;
    }

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =======================================================
     OPEN DELETE POPUP
  ======================================================= */

  const handleDelete = (abstract) => {
    setOpenMenu(null);

    const id = getMongoId(abstract);

    if (!id) {
      window.alert(
        "Invalid abstract ID."
      );
      return;
    }

    setDeletePopup({
      open: true,
      abstract,
    });
  };

  /* =======================================================
     CLOSE DELETE POPUP
  ======================================================= */

  const handleCloseDeletePopup = () => {
    if (deleteLoading) {
      return;
    }

    setDeletePopup({
      open: false,
      abstract: null,
    });
  };

  /* =======================================================
     CONFIRM DELETE
  ======================================================= */

  const handleConfirmDelete = async () => {
    const abstract =
      deletePopup?.abstract;

    if (!abstract) {
      return;
    }

    const id = getMongoId(abstract);

    if (!id) {
      setDeletePopup({
        open: false,
        abstract: null,
      });

      window.alert(
        "Invalid abstract ID."
      );

      return;
    }

    try {
      await dispatch(
        deleteAbstract(id)
      ).unwrap();

      setDeletePopup({
        open: false,
        abstract: null,
      });

      dispatch(fetchAbstracts());
    } catch (err) {
      console.error(
        "Delete abstract failed:",
        err
      );
    }
  };

  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry = () => {
    dispatch(fetchAbstracts());
  };

  /* =======================================================
     MOTION
  ======================================================= */

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
        staggerChildren: 0.05,
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

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
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
          variants={containerVariants}
          className="grid grid-cols-2 gap-1.5 xl:grid-cols-4"
        >
          {/* TOTAL */}

          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
              },
            }}
            className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-gray-500">
                  Total Abstracts
                </p>

                <p className="mt-1 text-[21px] font-bold text-gray-900">
                  {totalAbstracts}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                <FileText
                  size={18}
                  className="text-violet-600"
                />
              </div>
            </div>
          </motion.div>

          {/* SUBMITTED */}

          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
              },
            }}
            className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-gray-500">
                  Submitted
                </p>

                <p className="mt-1 text-[21px] font-bold text-gray-900">
                  {submittedAbstracts}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                <Clock3
                  size={18}
                  className="text-violet-600"
                />
              </div>
            </div>
          </motion.div>

          {/* ACCEPTED */}

          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
              },
            }}
            className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-gray-500">
                  Accepted
                </p>

                <p className="mt-1 text-[21px] font-bold text-gray-900">
                  {acceptedAbstracts}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                <CheckCircle2
                  size={18}
                  className="text-violet-600"
                />
              </div>
            </div>
          </motion.div>

          {/* REJECTED */}

          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
              },
            }}
            className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-gray-500">
                  Rejected
                </p>

                <p className="mt-1 text-[21px] font-bold text-gray-900">
                  {rejectedAbstracts}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                <XCircle
                  size={18}
                  className="text-violet-600"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        <AnimatePresence>
          {(error || deleteError) && (
            <motion.div
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-xs font-medium text-red-700">
                {error ||
                  deleteError ||
                  "Something went wrong."}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            MAIN TABLE CARD
        ===================================================== */}

        <motion.div
          variants={cardVariants}
          className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm"
        >
          {/* ===================================================
              FILTER BAR
          =================================================== */}

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
                onChange={(event) => {
                  setSearch(
                    event.target.value
                  );
                  setCurrentPage(1);
                }}
                placeholder="Search author, email or conference..."
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

            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(
                  event.target.value
                );
                setCurrentPage(1);
                setOpenMenu(null);
              }}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-40"
            >
              <option value="All Categories">
                All Categories
              </option>

              <option value="Oral">
                Oral
              </option>

              <option value="Poster">
                Poster
              </option>

              <option value="Workshop">
                Workshop
              </option>
            </select>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value
                );
                setCurrentPage(1);
                setOpenMenu(null);
              }}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-36"
            >
              <option value="All Status">
                All Status
              </option>

              <option value="Submitted">
                Submitted
              </option>

              <option value="Under Review">
                Under Review
              </option>

              <option value="Accepted">
                Accepted
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>
          </div>

          {/* ===================================================
              TABLE
          =================================================== */}

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
                  {/* LOADING */}

                  {loading ? (
                    <motion.tr
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                    >
                      <td
                        colSpan={5}
                        className="px-4 py-14 text-center"
                      >
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />

                          <p className="mt-3 text-xs font-medium text-gray-500">
                            Loading abstracts...
                          </p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : currentAbstracts.length ===
                    0 ? (
                    <motion.tr
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                    >
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <FileText
                            size={32}
                            className="mb-3 text-violet-300"
                          />

                          <p className="text-[13px] font-semibold text-gray-600">
                            No abstracts found
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            Try changing your
                            search or filters.
                          </p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    currentAbstracts.map(
                      (abstract) => {
                        const abstractId =
                          abstract?._id;

                        const authorName =
                          getFullName(
                            abstract
                          );

                        const conferenceName =
                          getConferenceName(
                            abstract
                          );

                        const category =
                          getCategory(
                            abstract
                          );

                        const status =
                          getStatus(
                            abstract
                          );

                        const fileUrl =
                          getFileUrl(
                            abstract
                          );

                        const isDeleting =
                          deleteLoading;

                        return (
                          <motion.tr
                            key={
                              abstractId
                            }
                            layout
                            variants={
                              rowVariants
                            }
                            initial="hidden"
                            animate="visible"
                            exit={{
                              opacity: 0,
                              x: -10,
                              transition: {
                                duration: 0.2,
                              },
                            }}
                            className="border-b border-gray-50 transition hover:bg-violet-50/30"
                          >
                            {/* AUTHOR */}

                            <td className="px-5 py-3.5">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
                                  {getInitials(
                                    authorName
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-[13px] font-semibold text-gray-800">
                                    {
                                      authorName
                                    }
                                  </p>

                                  <p className="truncate text-[10px] text-gray-400">
                                    {getEmail(
                                      abstract
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* CONFERENCE */}

                            <td className="px-4 py-3.5">
                              <p
                                title={
                                  conferenceName
                                }
                                className="truncate text-[13px] font-medium text-gray-700"
                              >
                                {
                                  conferenceName
                                }
                              </p>

                              <div className="mt-1">
                                <StatusBadge
                                  status={
                                    status
                                  }
                                />
                              </div>
                            </td>

                            {/* CATEGORY */}

                            <td className="px-4 py-3.5">
                              <span className="inline-flex rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
                                {
                                  category
                                }
                              </span>
                            </td>

                            {/* DATE */}

                            <td className="px-4 py-3.5">
                              <span className="text-[12px] font-medium text-gray-600">
                                {formatDate(
                                  getSubmittedDate(
                                    abstract
                                  )
                                )}
                              </span>
                            </td>

                            {/* ACTIONS */}

                            <td className="relative z-40 px-4 py-3.5 text-center">
                              <button
                                type="button"
                                disabled={
                                  isDeleting
                                }
                                onClick={() =>
                                  toggleMenu(
                                    abstractId
                                  )
                                }
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Abstract actions"
                              >
                                {isDeleting ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />
                                ) : (
                                  <MoreVertical
                                    size={17}
                                  />
                                )}
                              </button>

                              {/* ACTION MENU */}

                              <AnimatePresence>
                                {openMenu ===
                                  abstractId && (
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
                                    className="absolute bottom-11 right-4 z-50 w-40 rounded-lg border border-gray-100 bg-white p-1.5 text-left shadow-lg"
                                  >
                                    {/* VIEW */}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleView(
                                          abstract
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                                    >
                                      <Eye
                                        size={
                                          14
                                        }
                                      />
                                      View
                                    </button>

                                    {/* DOWNLOAD */}

                                    <button
                                      type="button"
                                      disabled={
                                        !fileUrl
                                      }
                                      onClick={() =>
                                        handleDownload(
                                          abstract
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                      <Download
                                        size={
                                          14
                                        }
                                      />
                                      Download
                                    </button>

                                    {/* DELETE */}

                                    <button
                                      type="button"
                                      disabled={
                                        deleteLoading
                                      }
                                      onClick={() =>
                                        handleDelete(
                                          abstract
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <Trash2
                                        size={
                                          14
                                        }
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
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ===================================================
              PAGINATION
          =================================================== */}

          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
            <p className="text-[11px] text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredAbstracts.length ===
                0
                  ? 0
                  : (safeCurrentPage - 1) *
                      itemsPerPage +
                    1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-700">
                {Math.min(
                  safeCurrentPage *
                    itemsPerPage,
                  filteredAbstracts.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {
                  filteredAbstracts.length
                }
              </span>{" "}
              abstracts
            </p>

            <div className="flex items-center gap-1.5">
              {/* PREVIOUS */}

              <motion.button
                type="button"
                disabled={
                  safeCurrentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        1,
                        page - 1
                      )
                  )
                }
                whileTap={{
                  scale: 0.92,
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={16}
                />
              </motion.button>

              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              )
                .slice(
                  Math.max(
                    0,
                    safeCurrentPage - 3
                  ),
                  Math.min(
                    totalPages,
                    safeCurrentPage + 2
                  )
                )
                .map((page) => (
                  <motion.button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                    whileTap={{
                      scale: 0.92,
                    }}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                      page ===
                      safeCurrentPage
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
                  safeCurrentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                  )
                }
                whileTap={{
                  scale: 0.92,
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={16}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* =====================================================
          DELETE CONFIRMATION POPUP
      ===================================================== */}

      <AnimatePresence>
        {deletePopup.open &&
          deletePopup.abstract && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
              onMouseDown={(event) => {
                if (
                  event.target ===
                  event.currentTarget
                ) {
                  handleCloseDeletePopup();
                }
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  y: 15,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
                onMouseDown={(event) =>
                  event.stopPropagation()
                }
              >
                {/* POPUP HEADER */}

                <div className="flex items-start gap-3.5 px-5 pb-3 pt-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle
                      size={21}
                      className="text-red-500"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-bold text-gray-900">
                      Delete Abstract?
                    </h3>

                    <p className="mt-1 text-[12px] leading-5 text-gray-500">
                      Are you sure you want to
                      delete this abstract?
                      This action cannot be
                      undone.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={
                      deleteLoading
                    }
                    onClick={
                      handleCloseDeletePopup
                    }
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* AUTHOR INFO */}

                <div className="mx-5 mb-4 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
                      {getInitials(
                        getFullName(
                          deletePopup.abstract
                        )
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-gray-800">
                        {getFullName(
                          deletePopup.abstract
                        )}
                      </p>

                      <p className="truncate text-[10px] text-gray-400">
                        {getEmail(
                          deletePopup.abstract
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* POPUP ACTIONS */}

                <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3.5">
                  <button
                    type="button"
                    disabled={
                      deleteLoading
                    }
                    onClick={
                      handleCloseDeletePopup
                    }
                    className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      deleteLoading
                    }
                    onClick={
                      handleConfirmDelete
                    }
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