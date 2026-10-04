import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import {
  MoreVertical,
  Eye,
  Trash2,
  Star,
  MessageSquare,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  X,
  AlertTriangle,
} from "lucide-react";

import toast from "react-hot-toast";

import axiosInstance from "../../redux/axiosInstance";

const AdminReviews = () => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);

  // =========================================================
  // DELETE CONFIRMATION MODAL
  // =========================================================

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    review: null,
  });

  const reviewsPerPage = 5;

  // =========================================================
  // GET ALL REVIEWS
  // =========================================================

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "/admin/reviews"
      );

      console.log(
        "Get reviews response:",
        response.data
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
                  review.createdAt
                ).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "-",
          })
        );

        setReviews(normalizedReviews);
      } else {
        setReviews([]);

        toast.error(
          response.data?.message ||
            "Failed to fetch reviews"
        );
      }
    } catch (error) {
      console.error(
        "Get reviews error:",
        error
      );

      console.error(
        "Get reviews error response:",
        error?.response?.data
      );

      setReviews([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    fetchReviews();
  }, []);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      reviews.length / reviewsPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    reviewsPerPage;

  const paginatedReviews = useMemo(() => {
    return reviews.slice(
      startIndex,
      startIndex + reviewsPerPage
    );
  }, [
    reviews,
    currentPage,
    startIndex,
  ]);

  // =========================================================
  // RESET PAGE IF DATA CHANGES
  // =========================================================

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalReviews =
    reviews.length;

  const fiveStarReviews =
    reviews.filter(
      (review) =>
        Number(review.rating) === 5
    ).length;

  const fourStarReviews =
    reviews.filter(
      (review) =>
        Number(review.rating) === 4
    ).length;

  // =========================================================
  // ADD REVIEW
  // =========================================================

  const handleAddReview = () => {
    setOpenMenu(null);

    navigate(
      "/admin/reviews/add"
    );
  };

  // =========================================================
  // OPEN ACTION MENU
  // =========================================================

  const handleOpenMenu = (
    event,
    reviewId
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
      buttonRect.top - gap;

    if (
      buttonRect.top <
      menuHeight + gap
    ) {
      top =
        buttonRect.bottom + gap;
    }

    setMenuPosition({
      top,
      left,
    });

    setOpenMenu((prev) =>
      prev === reviewId
        ? null
        : reviewId
    );
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleView = (review) => {
    setOpenMenu(null);

    if (!review?.id) {
      toast.error(
        "Review ID is missing"
      );
      return;
    }

    navigate(
      `/admin/reviews/${review.id}`
    );
  };

  // =========================================================
  // UPDATE
  // =========================================================

  const handleUpdate = (review) => {
    setOpenMenu(null);

    const reviewId =
      review?._id ||
      review?.id;

    if (!reviewId) {
      toast.error(
        "Review ID is missing"
      );
      return;
    }

    console.log(
      "Navigating to update review:",
      reviewId
    );

    // IMPORTANT:
    // Pass review ID to AddReview page.
    navigate(
      `/admin/reviews/add/${reviewId}`
    );
  };

  // =========================================================
  // OPEN DELETE MODAL
  // =========================================================

  const handleDeleteClick = (
    review
  ) => {
    setOpenMenu(null);

    if (!review?.id) {
      toast.error(
        "Review ID is missing"
      );
      return;
    }

    setDeleteModal({
      open: true,
      review: review,
    });
  };

  // =========================================================
  // CLOSE DELETE MODAL
  // =========================================================

  const handleCancelDelete = () => {
    if (deleting) {
      return;
    }

    setDeleteModal({
      open: false,
      review: null,
    });
  };

  // =========================================================
  // DELETE API
  // =========================================================

  const handleConfirmDelete = async () => {
    const review =
      deleteModal.review;

    if (!review?.id) {
      toast.error(
        "Review ID is missing"
      );
      return;
    }

    try {
      setDeleting(true);

      console.log(
        "Deleting review ID:",
        review.id
      );

      const response =
        await axiosInstance.delete(
          `/admin/reviews/${review.id}`
        );

      console.log(
        "Delete review response:",
        response.data
      );

      if (
        response.data?.success
      ) {
        toast.success(
          response.data?.message ||
            "Review deleted successfully"
        );

        setReviews((prev) =>
          prev.filter(
            (item) =>
              item.id !== review.id
          )
        );

        const remainingReviews =
          reviews.length - 1;

        const newTotalPages =
          Math.max(
            1,
            Math.ceil(
              remainingReviews /
                reviewsPerPage
            )
          );

        setCurrentPage(
          (prevPage) =>
            Math.min(
              prevPage,
              newTotalPages
            )
        );

        setDeleteModal({
          open: false,
          review: null,
        });
      } else {
        toast.error(
          response.data?.message ||
            "Failed to delete review"
        );
      }
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      );

      console.error(
        "Delete error response:",
        error?.response?.data
      );

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to delete review"
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // CLOSE ACTION MENU
  // =========================================================

  const closeMenu = () => {
    setOpenMenu(null);
  };

  // =========================================================
  // ACTION POPUP
  // =========================================================

  const actionPopup =
    openMenu &&
    typeof document !==
      "undefined"
      ? createPortal(
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="fixed z-[9999] w-[140px] overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              transform:
                "translateY(-100%)",
            }}
          >
            {/* VIEW */}

            <button
              type="button"
              onClick={() => {
                const review =
                  reviews.find(
                    (item) =>
                      item.id ===
                      openMenu
                  );

                if (review) {
                  handleView(
                    review
                  );
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED]"
            >
              <Eye
                size={14}
                className="shrink-0"
              />

              <span>
                View
              </span>
            </button>

            {/* UPDATE */}

            <button
              type="button"
              onClick={() => {
                const review =
                  reviews.find(
                    (item) =>
                      item.id ===
                      openMenu
                  );

                if (review) {
                  handleUpdate(
                    review
                  );
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED]"
            >
              <Pencil
                size={14}
                className="shrink-0"
              />

              <span>
                Update
              </span>
            </button>

            {/* DELETE */}

            <button
              type="button"
              disabled={deleting}
              onClick={() => {
                const review =
                  reviews.find(
                    (item) =>
                      item.id ===
                      openMenu
                  );

                if (review) {
                  handleDeleteClick(
                    review
                  );
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2
                size={14}
                className="shrink-0"
              />

              <span>
                Delete
              </span>
            </button>
          </div>,
          document.body
        )
      : null;

  // =========================================================
  // DELETE CONFIRMATION MODAL
  // =========================================================

  const deleteConfirmationModal =
    deleteModal.open &&
    typeof document !==
      "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
            onClick={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                handleCancelDelete();
              }
            }}
          >
            <div
              className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              {/* MODAL HEADER */}

              <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle
                      size={20}
                      className="text-red-500"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-800">
                      Delete Review
                    </h3>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={
                    handleCancelDelete
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={17} />
                </button>
              </div>

              {/* MODAL BODY */}

              <div className="px-5 py-5">
                <p className="text-sm leading-6 text-gray-600">
                  Are you sure you want
                  to delete this review?
                </p>

                {deleteModal.review && (
                  <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="line-clamp-2 text-xs font-medium text-gray-700">
                      "
                      {deleteModal.review
                        .review || "-"}
                      "
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-medium text-gray-400">
                        Category:
                      </span>

                      <span className="text-[10px] font-semibold text-gray-600">
                        {
                          deleteModal
                            .review
                            .category
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={
                    handleCancelDelete
                  }
                  className="h-9 rounded-lg border border-gray-200 px-4 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={
                    handleConfirmDelete
                  }
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
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div
      className="min-h-screen bg-gray-50 px-4 pb-5 pt-2 sm:px-5 sm:pb-5 sm:pt-2 lg:px-6 lg:pb-6 lg:pt-2"
      onClick={closeMenu}
    >
      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* TOTAL REVIEWS */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Reviews
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-800">
                {totalReviews}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
              <MessageSquare
                size={18}
                className="text-[#7C3AED]"
              />
            </div>
          </div>
        </div>

        {/* FIVE STAR */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                5 Star Reviews
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-800">
                {fiveStarReviews}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
              <Star
                size={18}
                className="text-[#7C3AED]"
                fill="currentColor"
              />
            </div>
          </div>
        </div>

        {/* FOUR STAR */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                4 Star Reviews
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-800">
                {fourStarReviews}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
              <Users
                size={18}
                className="text-[#7C3AED]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* TABLE HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              All Reviews
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-400">
              View and manage conference reviews
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddReview();
            }}
            className="flex h-9 items-center gap-2 rounded-lg bg-[#7C3AED] px-3.5 text-xs font-semibold text-white transition hover:bg-[#6D28D9]"
          >
            <Plus size={15} />

            <span>
              Add Review
            </span>
          </button>
        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="w-[38%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Review
                </th>

                <th className="w-[20%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Category
                </th>

                <th className="w-[12%] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Rating
                </th>

                <th className="w-[18%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="w-[12%] px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#7C3AED]" />

                      <p className="text-sm font-semibold text-gray-600">
                        Loading reviews...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedReviews.length >
                0 ? (
                paginatedReviews.map(
                  (review) => {
                    const reviewId =
                      review?._id ||
                      review?.id;

                    return (
                      <tr
                        key={reviewId}
                        className="border-b border-gray-50 transition hover:bg-purple-50/30"
                      >
                        {/* REVIEW */}

                        <td className="px-4 py-3.5">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#7C3AED]">
                              <MessageSquare
                                size={16}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="line-clamp-2 text-xs font-medium text-gray-700">
                                {review?.review ||
                                  "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-4 py-3.5">
                          <span className="block truncate text-xs font-semibold text-gray-800">
                            {review?.category ||
                              "-"}
                          </span>
                        </td>

                        {/* RATING */}

                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star
                              size={14}
                              className="text-[#7C3AED]"
                              fill="currentColor"
                            />

                            <span className="text-xs font-semibold text-gray-700">
                              {review?.rating ||
                                0}
                            </span>
                          </div>
                        </td>

                        {/* DATE */}

                        <td className="px-4 py-3.5">
                          <span className="block truncate text-[11px] text-gray-600">
                            {review?.date ||
                              "-"}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td
                          className="relative px-2 py-3.5"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={(e) =>
                                handleOpenMenu(
                                  e,
                                  reviewId
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-purple-50 hover:text-[#7C3AED]"
                            >
                              <MoreVertical
                                size={17}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <MessageSquare
                        size={28}
                        className="mb-2 text-gray-300"
                      />

                      <p className="text-sm font-semibold text-gray-600">
                        No reviews available
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Reviews will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">
              {paginatedReviews.length ===
              0
                ? 0
                : startIndex + 1}
            </span>
            {" "}to{" "}
            <span className="font-semibold text-gray-600">
              {Math.min(
                startIndex +
                  reviewsPerPage,
                reviews.length
              )}
            </span>
            {" "}of{" "}
            <span className="font-semibold text-gray-600">
              {reviews.length}
            </span>
            {" "}reviews
          </p>

          <div className="flex items-center gap-1">
            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() => {
                setOpenMenu(null);

                setCurrentPage(
                  (prev) =>
                    Math.max(
                      prev - 1,
                      1
                    )
                );
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                currentPage === 1
                  ? "cursor-not-allowed border-gray-100 text-gray-300"
                  : "border-gray-200 text-gray-500 hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED]"
              }`}
            >
              <ChevronLeft size={15} />
            </button>

            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  setCurrentPage(page);
                }}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                  currentPage === page
                    ? "bg-[#7C3AED] text-white"
                    : "border border-gray-200 text-gray-500 hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED]"
                }`}
              >
                {page}
              </button>
            ))}

            {/* NEXT */}

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() => {
                setOpenMenu(null);

                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                );
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                currentPage ===
                totalPages
                  ? "cursor-not-allowed border-gray-100 text-gray-300"
                  : "border-gray-200 text-gray-500 hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED]"
              }`}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ACTION POPUP PORTAL
      ===================================================== */}

      {actionPopup}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteConfirmationModal}
    </div>
  );
};

export default AdminReviews;