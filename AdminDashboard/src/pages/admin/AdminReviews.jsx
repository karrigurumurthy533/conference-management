import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  MoreVertical,
  Eye,
  Trash2,
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  X,
  AlertTriangle,
} from "lucide-react";

import toast from "react-hot-toast";

import axiosInstance from "../../redux/axiosInstance";

/* =========================================================
   MAIN COMPONENT
========================================================= */

const AdminReviews = () => {
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [openMenu, setOpenMenu] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    review: null,
  });

  const reviewsPerPage = 5;

  /* =========================================================
     FRAMER MOTION
  ========================================================= */

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

  /* =========================================================
     GET ALL REVIEWS
  ========================================================= */

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/admin/reviews",
      );

      console.log(
        "Get reviews response:",
        response.data,
      );

      if (response.data?.success) {
        const apiData = response.data?.data;

        const apiReviews = Array.isArray(apiData)
          ? apiData
          : Array.isArray(apiData?.reviews)
            ? apiData.reviews
            : [];

        const normalizedReviews = apiReviews.map(
          (review) => ({
            ...review,

            id:
              review?._id ||
              review?.id,

            review:
              review?.description ||
              review?.review ||
              "-",

            category:
              review?.category ||
              "-",

            rating:
              Number(review?.rating) || 0,

            date: review?.createdAt
              ? new Date(
                  review.createdAt,
                ).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                )
              : "-",
          }),
        );

        setReviews(normalizedReviews);
      } else {
        setReviews([]);

        toast.error(
          response.data?.message ||
            "Failed to fetch reviews",
        );
      }
    } catch (error) {
      console.error(
        "Get reviews error:",
        error,
      );

      console.error(
        "Get reviews error response:",
        error?.response?.data,
      );

      setReviews([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch reviews",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH ON PAGE LOAD
  ========================================================= */

  useEffect(() => {
    fetchReviews();
  }, []);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      reviews.length /
        reviewsPerPage,
    ),
  );

  const startIndex =
    (currentPage - 1) *
    reviewsPerPage;

  const paginatedReviews = useMemo(() => {
    return reviews.slice(
      startIndex,
      startIndex +
        reviewsPerPage,
    );
  }, [
    reviews,
    currentPage,
    startIndex,
  ]);

  /* =========================================================
     RESET PAGE
  ========================================================= */

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages,
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalReviews =
    reviews.length;

  const fiveStarReviews =
    reviews.filter(
      (review) =>
        Number(
          review.rating,
        ) === 5,
    ).length;

  const fourStarReviews =
    reviews.filter(
      (review) =>
        Number(
          review.rating,
        ) === 4,
    ).length;

  const noStarReviews =
    reviews.filter(
      (review) =>
        Number(
          review.rating,
        ) >= 1 &&
        Number(
          review.rating,
        ) <= 3,
    ).length;

  /* =========================================================
     ADD REVIEW
  ========================================================= */

  const handleAddReview = () => {
    setOpenMenu(null);

    navigate(
      "/admin/reviews/add",
    );
  };

  /* =========================================================
     OPEN ACTION MENU
  ========================================================= */

  const handleOpenMenu = (
    event,
    reviewId,
  ) => {
    event.stopPropagation();

    const buttonRect =
      event.currentTarget.getBoundingClientRect();

    const menuWidth = 140;
    const menuHeight = 132;
    const gap = 8;

    let left =
      buttonRect.right -
      menuWidth;

    if (left < 8) {
      left = 8;
    }

    if (
      left + menuWidth >
      window.innerWidth - 8
    ) {
      left =
        window.innerWidth -
        menuWidth -
        8;
    }

    let top =
      buttonRect.top -
      gap;

    if (
      buttonRect.top <
      menuHeight + gap
    ) {
      top =
        buttonRect.bottom +
        gap;
    }

    setMenuPosition({
      top,
      left,
    });

    setOpenMenu(
      (previous) =>
        previous === reviewId
          ? null
          : reviewId,
    );
  };

  /* =========================================================
     VIEW
  ========================================================= */

  const handleView = (
    review,
  ) => {
    setOpenMenu(null);

    if (!review?.id) {
      toast.error(
        "Review ID is missing",
      );

      return;
    }

    navigate(
      `/admin/reviews/${review.id}`,
    );
  };

  /* =========================================================
     UPDATE
  ========================================================= */

  const handleUpdate = (
    review,
  ) => {
    setOpenMenu(null);

    const reviewId =
      review?._id ||
      review?.id;

    if (!reviewId) {
      toast.error(
        "Review ID is missing",
      );

      return;
    }

    navigate(
      `/admin/reviews/add/${reviewId}`,
    );
  };

  /* =========================================================
     OPEN DELETE MODAL
  ========================================================= */

  const handleDeleteClick = (
    review,
  ) => {
    setOpenMenu(null);

    if (!review?.id) {
      toast.error(
        "Review ID is missing",
      );

      return;
    }

    setDeleteModal({
      open: true,
      review,
    });
  };

  /* =========================================================
     CLOSE DELETE MODAL
  ========================================================= */

  const handleCancelDelete =
    () => {
      if (deleting) {
        return;
      }

      setDeleteModal({
        open: false,
        review: null,
      });
    };

  /* =========================================================
     DELETE API
  ========================================================= */

  const handleConfirmDelete =
    async () => {
      const review =
        deleteModal.review;

      if (!review?.id) {
        toast.error(
          "Review ID is missing",
        );

        return;
      }

      try {
        setDeleting(true);

        const response =
          await axiosInstance.delete(
            `/admin/reviews/${review.id}`,
          );

        if (
          response.data?.success
        ) {
          toast.success(
            response.data
              ?.message ||
              "Review deleted successfully",
          );

          setReviews(
            (previous) =>
              previous.filter(
                (item) =>
                  item.id !==
                  review.id,
              ),
          );

          const remainingReviews =
            reviews.length - 1;

          const newTotalPages =
            Math.max(
              1,
              Math.ceil(
                remainingReviews /
                  reviewsPerPage,
              ),
            );

          setCurrentPage(
            (previousPage) =>
              Math.min(
                previousPage,
                newTotalPages,
              ),
          );

          setDeleteModal({
            open: false,
            review: null,
          });
        } else {
          toast.error(
            response.data
              ?.message ||
              "Failed to delete review",
          );
        }
      } catch (error) {
        console.error(
          "Delete review error:",
          error,
        );

        toast.error(
          error?.response
            ?.data?.message ||
            "Failed to delete review",
        );
      } finally {
        setDeleting(false);
      }
    };

  /* =========================================================
     CLOSE ACTION MENU
  ========================================================= */

  const closeMenu = () => {
    setOpenMenu(null);
  };

  /* =========================================================
     ACTION POPUP
  ========================================================= */

  const actionPopup =
    openMenu &&
    typeof document !==
      "undefined"
      ? createPortal(
          <AnimatePresence>
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
              onClick={(event) =>
                event.stopPropagation()
              }
              className="fixed z-[9999] w-40 overflow-hidden rounded-lg border border-gray-100 bg-white p-1.5 shadow-lg"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                transform:
                  "translateY(-100%)",
              }}
            >
              {/* VIEW */}

              <motion.button
                type="button"
                onClick={() => {
                  const review =
                    reviews.find(
                      (item) =>
                        item.id ===
                        openMenu,
                    );

                  if (review) {
                    handleView(
                      review,
                    );
                  }
                }}
                whileHover={{
                  x: 2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
              >
                <Eye size={14} />

                <span>
                  View
                </span>
              </motion.button>

              {/* UPDATE */}

              <motion.button
                type="button"
                onClick={() => {
                  const review =
                    reviews.find(
                      (item) =>
                        item.id ===
                        openMenu,
                    );

                  if (review) {
                    handleUpdate(
                      review,
                    );
                  }
                }}
                whileHover={{
                  x: 2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
              >
                <Pencil
                  size={14}
                />

                <span>
                  Update
                </span>
              </motion.button>

              {/* DELETE */}

              <motion.button
                type="button"
                disabled={
                  deleting
                }
                onClick={() => {
                  const review =
                    reviews.find(
                      (item) =>
                        item.id ===
                        openMenu,
                    );

                  if (review) {
                    handleDeleteClick(
                      review,
                    );
                  }
                }}
                whileHover={{
                  x: 2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2
                  size={14}
                />

                <span>
                  Delete
                </span>
              </motion.button>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  /* =========================================================
     DELETE CONFIRMATION MODAL
  ========================================================= */

  const deleteConfirmationModal =
    deleteModal.open &&
    typeof document !==
      "undefined"
      ? createPortal(
          <AnimatePresence>
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
              transition={{
                duration: 0.2,
              }}
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
              onClick={(event) => {
                if (
                  event.target ===
                  event.currentTarget
                ) {
                  handleCancelDelete();
                }
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  y: 8,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="w-full max-w-[420px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {/* MODAL HEADER */}

                <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{
                        scale: 0.8,
                        opacity: 0,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      transition={{
                        delay: 0.08,
                        duration: 0.2,
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50"
                    >
                      <AlertTriangle
                        size={18}
                        className="text-red-500"
                      />
                    </motion.div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-800">
                        Delete Review
                      </h3>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        This action cannot
                        be undone
                      </p>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    disabled={
                      deleting
                    }
                    onClick={
                      handleCancelDelete
                    }
                    whileHover={{
                      rotate: 4,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={17} />
                  </motion.button>
                </div>

                {/* MODAL BODY */}

                <div className="px-5 py-5">
                  <p className="text-sm leading-6 text-gray-600">
                    Are you sure you
                    want to delete
                    this review?
                  </p>

                  {deleteModal.review && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.1,
                        duration: 0.2,
                      }}
                      className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <p className="line-clamp-2 text-xs font-medium text-gray-700">
                        "
                        {deleteModal
                          .review
                          .review ||
                          "-"}
                        "
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] font-medium text-gray-400">
                          Category:
                        </span>

                        <span className="text-[10px] font-semibold text-gray-600">
                          {deleteModal
                            .review
                            .category}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* MODAL FOOTER */}

                <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4">
                  <motion.button
                    type="button"
                    disabled={
                      deleting
                    }
                    onClick={
                      handleCancelDelete
                    }
                    whileTap={{
                      scale: 0.96,
                    }}
                    className="h-9 rounded-lg border border-gray-200 px-4 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={
                      deleting
                    }
                    onClick={
                      handleConfirmDelete
                    }
                    whileHover={{
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    className="flex h-9 items-center gap-2 rounded-lg bg-red-500 px-4 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2
                          size={14}
                        />

                        Delete
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <motion.div
      className="min-w-0 w-full overflow-hidden space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onClick={closeMenu}
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
                Total Reviews
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">
                {totalReviews}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <MessageSquare
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>

        {/* FIVE STAR */}

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
                5 Star Reviews
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">
                {fiveStarReviews}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Star
                size={18}
                className="text-violet-600"
                fill="currentColor"
              />
            </div>
          </div>
        </motion.div>

        {/* FOUR STAR */}

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
                4 Star Reviews
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">
                {fourStarReviews}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Star
                size={18}
                className="text-violet-600"
                fill="currentColor"
              />
            </div>
          </div>
        </motion.div>

        {/* LOW RATING */}

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
                No Star Reviews
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">
                {noStarReviews}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Star
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* =====================================================
          MAIN TABLE CARD
      ===================================================== */}

      <motion.div
        variants={cardVariants}
        className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm"
      >
        {/* ===================================================
            TABLE HEADER
        =================================================== */}

        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              All Reviews
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-400">
              View and manage conference reviews
            </p>
          </div>

          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              handleAddReview();
            }}
            whileHover={{
              y: -1,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-violet-600 px-3.5 text-xs font-semibold text-white transition hover:bg-violet-700"
          >
            <Plus size={15} />

            <span>
              Add Review
            </span>
          </motion.button>
        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {/* REVIEW */}

                <th className="w-[38%] px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  Review
                </th>

                {/* CATEGORY */}

                <th className="w-[20%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  Category
                </th>

                {/* RATING */}

                <th className="w-[12%] px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  Rating
                </th>

                {/* DATE */}

                <th className="w-[18%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  Date
                </th>

                {/* ACTIONS */}

                <th className="w-[12%] px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-gray-600">
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
                          Loading reviews...
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                ) : paginatedReviews.length ===
                  0 ? (
                  /* EMPTY */

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
                        <MessageSquare
                          size={32}
                          className="mb-3 text-violet-300"
                        />

                        <p className="text-[13px] font-semibold text-gray-600">
                          No reviews
                          found
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          Reviews will
                          appear here.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  /* DATA */

                  paginatedReviews.map(
                    (review) => {
                      const reviewId =
                        review?._id ||
                        review?.id;

                      return (
                        <motion.tr
                          key={
                            reviewId
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
                          {/* REVIEW */}

                          <td className="px-5 py-3.5">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                                <MessageSquare
                                  size={
                                    16
                                  }
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="line-clamp-2 text-[13px] font-medium text-gray-700">
                                  {review?.review ||
                                    "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}

                          <td className="px-4 py-3.5">
                            <span className="inline-flex rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
                              {review?.category ||
                                "-"}
                            </span>
                          </td>

                          {/* RATING */}

                          <td className="px-4 py-3.5 text-center">
                            <div className="inline-flex items-center gap-1">
                              <Star
                                size={
                                  14
                                }
                                className="text-violet-600"
                                fill="currentColor"
                              />

                              <span className="text-[12px] font-semibold text-gray-700">
                                {review?.rating ||
                                  0}
                              </span>
                            </div>
                          </td>

                          {/* DATE */}

                          <td className="px-4 py-3.5">
                            <span className="text-[12px] font-medium text-gray-600">
                              {review?.date ||
                                "-"}
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td
                            className="relative z-40 px-4 py-3.5 text-center"
                            onClick={(
                              event,
                            ) =>
                              event.stopPropagation()
                            }
                          >
                            <button
                              type="button"
                              onClick={(
                                event,
                              ) =>
                                handleOpenMenu(
                                  event,
                                  reviewId,
                                )
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                              aria-label="Review actions"
                            >
                              <MoreVertical
                                size={
                                  17
                                }
                              />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    },
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
              {paginatedReviews.length ===
              0
                ? 0
                : startIndex +
                  1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                startIndex +
                  reviewsPerPage,
                reviews.length,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {reviews.length}
            </span>{" "}
            reviews
          </p>

          <div className="flex items-center gap-1.5">
            {/* PREVIOUS */}

            <motion.button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() => {
                setOpenMenu(null);

                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1,
                    ),
                );
              }}
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
                length:
                  totalPages,
              },
              (_, index) =>
                index + 1,
            )
              .slice(
                Math.max(
                  0,
                  currentPage - 3,
                ),
                Math.min(
                  totalPages,
                  currentPage + 2,
                ),
              )
              .map((page) => (
                <motion.button
                  key={page}
                  type="button"
                  onClick={() => {
                    setOpenMenu(
                      null,
                    );

                    setCurrentPage(
                      page,
                    );
                  }}
                  whileTap={{
                    scale: 0.92,
                  }}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                    page ===
                    currentPage
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
                currentPage ===
                totalPages
              }
              onClick={() => {
                setOpenMenu(null);

                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1,
                    ),
                );
              }}
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

      {/* ACTION POPUP */}

      {actionPopup}

      {/* DELETE MODAL */}

      {deleteConfirmationModal}
    </motion.div>
  );
};

export default AdminReviews;