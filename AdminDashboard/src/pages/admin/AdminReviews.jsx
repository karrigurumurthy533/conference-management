import { useMemo, useState } from "react";
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
} from "lucide-react";

const AdminReviews = () => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const reviewsPerPage = 5;

  const reviews = [
    {
      id: "1",
      review:
        "Excellent conference experience. The sessions were informative and very well organized.",
      category: "Autism Research",
      rating: 5,
      date: "02 Oct 2026",
    },
    {
      id: "2",
      review:
        "Great event with excellent speakers and valuable insights. Looking forward to the next conference.",
      category: "Mental Health",
      rating: 4,
      date: "30 Sep 2026",
    },
    {
      id: "3",
      review:
        "Very professional organization and the conference topics were highly relevant.",
      category: "Healthcare Innovation",
      rating: 5,
      date: "28 Sep 2026",
    },
    {
      id: "4",
      review:
        "The sessions were engaging and the overall conference was a great learning experience.",
      category: "Food & Nutrition",
      rating: 4,
      date: "25 Sep 2026",
    },
    {
      id: "5",
      review:
        "Well organized conference with knowledgeable speakers and useful discussions.",
      category: "Oncology & AI",
      rating: 5,
      date: "22 Sep 2026",
    },
    {
      id: "6",
      review:
        "A valuable experience with excellent presentations and professional coordination.",
      category: "Heart & CVD",
      rating: 3,
      date: "20 Sep 2026",
    },
    {
      id: "7",
      review:
        "The conference provided great opportunities to learn and connect with professionals.",
      category: "AI & Digital Psychiatry",
      rating: 4,
      date: "18 Sep 2026",
    },
  ];

  const totalPages = Math.max(
    1,
    Math.ceil(reviews.length / reviewsPerPage),
  );

  const startIndex = (currentPage - 1) * reviewsPerPage;

  const paginatedReviews = useMemo(() => {
    return reviews.slice(
      startIndex,
      startIndex + reviewsPerPage,
    );
  }, [currentPage]);

  const totalReviews = reviews.length;

  const fiveStarReviews = reviews.filter(
    (review) => review.rating === 5,
  ).length;

  const fourStarReviews = reviews.filter(
    (review) => review.rating === 4,
  ).length;

  // =========================================================
  // ADD REVIEW
  // =========================================================

  const handleAddReview = () => {
    setOpenMenu(null);
    navigate("/admin/reviews/add");
  };

  // =========================================================
  // OPEN ACTION MENU
  // =========================================================

  const handleOpenMenu = (event, reviewId) => {
    event.stopPropagation();

    const buttonRect =
      event.currentTarget.getBoundingClientRect();

    const menuWidth = 140;
    const menuHeight = 132;
    const gap = 8;

    let left = buttonRect.right - menuWidth;

    // Prevent popup from going outside right side
    if (left < 8) {
      left = 8;
    }

    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }

    // Default: popup ABOVE the button
    let top = buttonRect.top - gap;

    // If there isn't enough space above,
    // show it below the button.
    if (buttonRect.top < menuHeight + gap) {
      top = buttonRect.bottom + gap;
    }

    setMenuPosition({
      top,
      left,
    });

    setOpenMenu((prev) =>
      prev === reviewId ? null : reviewId,
    );
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleView = (review) => {
    setOpenMenu(null);

    console.log("View review:", review);
  };

  // =========================================================
  // UPDATE
  // =========================================================

  const handleUpdate = (review) => {
    setOpenMenu(null);

    console.log("Update review:", review);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = (review) => {
    setOpenMenu(null);

    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmed) return;

    console.log("Delete review:", review.id);
  };

  // =========================================================
  // CLOSE MENU
  // =========================================================

  const closeMenu = () => {
    setOpenMenu(null);
  };

  // =========================================================
  // ACTION POPUP
  // PORTAL = NOT CLIPPED BY TABLE OVERFLOW
  // =========================================================

  const actionPopup =
    openMenu &&
    typeof document !== "undefined"
      ? createPortal(
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[9999] w-[140px] overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              transform:
                menuPosition.top >
                window.innerHeight - 160
                  ? "translateY(-100%)"
                  : "translateY(-100%)",
            }}
          >
            {/* VIEW */}

            <button
              type="button"
              onClick={() => {
                const review = reviews.find(
                  (item) => item.id === openMenu,
                );

                if (review) {
                  handleView(review);
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED]"
            >
              <Eye
                size={14}
                className="shrink-0"
              />

              <span>View</span>
            </button>

            {/* UPDATE */}

            <button
              type="button"
              onClick={() => {
                const review = reviews.find(
                  (item) => item.id === openMenu,
                );

                if (review) {
                  handleUpdate(review);
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED]"
            >
              <Pencil
                size={14}
                className="shrink-0"
              />

              <span>Update</span>
            </button>

            {/* DELETE */}

            <button
              type="button"
              onClick={() => {
                const review = reviews.find(
                  (item) => item.id === openMenu,
                );

                if (review) {
                  handleDelete(review);
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2
                size={14}
                className="shrink-0"
              />

              <span>Delete</span>
            </button>
          </div>,
          document.body,
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

            <span>Add Review</span>
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
              {paginatedReviews.length > 0 ? (
                paginatedReviews.map((review) => {
                  const reviewId = review?.id;

                  return (
                    <tr
                      key={reviewId}
                      className="border-b border-gray-50 transition hover:bg-purple-50/30"
                    >
                      {/* REVIEW */}

                      <td className="px-4 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#7C3AED]">
                            <MessageSquare size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="line-clamp-2 text-xs font-medium text-gray-700">
                              {review?.review || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-4 py-3.5">
                        <span className="block truncate text-xs font-semibold text-gray-800">
                          {review?.category || "-"}
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
                            {review?.rating || 0}
                          </span>
                        </div>
                      </td>

                      {/* DATE */}

                      <td className="px-4 py-3.5">
                        <span className="block truncate text-[11px] text-gray-600">
                          {review?.date || "-"}
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
                                reviewId,
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-purple-50 hover:text-[#7C3AED]"
                          >
                            <MoreVertical size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              {paginatedReviews.length === 0
                ? 0
                : startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-600">
              {Math.min(
                startIndex + reviewsPerPage,
                reviews.length,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-600">
              {reviews.length}
            </span>{" "}
            reviews
          </p>

          <div className="flex items-center gap-1">
            {/* PREVIOUS */}

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                setOpenMenu(null);

                setCurrentPage((prev) =>
                  Math.max(prev - 1, 1),
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
              { length: totalPages },
              (_, index) => index + 1,
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
              disabled={currentPage === totalPages}
              onClick={() => {
                setOpenMenu(null);

                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    totalPages,
                  ),
                );
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                currentPage === totalPages
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
    </div>
  );
};

export default AdminReviews;