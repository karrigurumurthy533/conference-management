
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowLeft,
  ArrowRight,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "../redux/userSlice";

const FALLBACK_IMAGE =
  "https://ui-avatars.com/api/?name=GlobalScion+Speaker&background=ede9fe&color=7c3aed&size=200";

const Reviews = () => {
  const dispatch = useDispatch();

  const {
    reviews: apiReviews,
    reviewsLoading,
    reviewsError,
  } = useSelector((state) => state.user);

  const [currentPage, setCurrentPage] = useState(0);

  const reviewsPerPage = 8;

  // Fetch reviews from API
  useEffect(() => {
    dispatch(
      getAllReviews({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  // Normalize API response into a single array
  const reviews = useMemo(() => {
    const response = apiReviews;

    const list = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.reviews)
          ? response.reviews
          : [];

    return list
      .filter((review) => review && typeof review === "object")
      .map((review, index) => ({
        id: review._id || review.id || index,
        name:
          review.fullName ||
          review.name ||
          review.reviewerName ||
          "GlobalScion Delegate",
        role:
          review.category ||
          review.role ||
          "Delegate",
        image:
          review.reviewerImage ||
          review.image ||
          review.profileImage ||
          "",
        comment:
          review.description ||
          review.comment ||
          review.review ||
          review.message ||
          "",
        rating: Math.min(
          5,
          Math.max(0, Number(review.rating) || 5)
        ),
      }))
      .filter((review) => review.comment.trim().length > 0);
  }, [apiReviews]);

  // Pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const visibleReviews = reviews.slice(
    currentPage * reviewsPerPage,
    currentPage * reviewsPerPage + reviewsPerPage
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const previousReviews = () => {
    if (totalPages <= 1) return;

    setCurrentPage((previous) =>
      previous === 0 ? totalPages - 1 : previous - 1
    );
  };

  const nextReviews = () => {
    if (totalPages <= 1) return;

    setCurrentPage((previous) =>
      previous === totalPages - 1 ? 0 : previous + 1
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* DECORATIVE TOP LEFT */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full border-[45px] border-violet-100 opacity-80" />

      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full border border-violet-300/60" />

      {/* DECORATIVE BOTTOM RIGHT */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full border-[55px] border-violet-50" />

      <div className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full border border-violet-300/50" />

      {/* MAIN CONTENT */}
      <section className="relative mx-auto max-w-[1450px] px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
        {/* HEADER */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* LEFT CONTENT */}
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-700">
                <Star size={14} fill="currentColor" />
                Delegate Feedback
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#11133F] sm:text-5xl lg:text-[52px]"
            >
              What Delegates & Speakers{" "}
              <span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
                Say
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base"
            >
              Read testimonials from researchers, keynote speakers,
              and industry pioneers who attended GlobalScion Conferences.
            </motion.p>
          </div>

          {/* NAVIGATION ARROWS */}
          <div className="flex items-center gap-5 lg:pb-2">
            <button
              type="button"
              onClick={previousReviews}
              disabled={totalPages <= 1}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-violet-300 bg-white text-violet-600 transition-all duration-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous reviews"
            >
              <ArrowLeft
                size={20}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            </button>

            {/* SLIDER INDICATORS */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index)}
                  aria-label={`Go to review page ${index + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentPage === index
                      ? "w-10 bg-violet-600"
                      : "w-10 bg-violet-200 hover:bg-violet-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextReviews}
              disabled={totalPages <= 1}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-violet-300 bg-white text-violet-600 transition-all duration-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next reviews"
            >
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {reviewsLoading && reviews.length === 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="min-h-[290px] animate-pulse rounded-xl border border-violet-100 bg-white p-5"
              >
                <div className="flex justify-between">
                  <div className="h-8 w-8 rounded bg-violet-100" />
                  <div className="h-[94px] w-[94px] rounded-2xl bg-violet-100" />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-3 rounded bg-slate-100" />
                  <div className="h-3 rounded bg-slate-100" />
                  <div className="h-3 w-3/4 rounded bg-slate-100" />
                </div>

                <div className="mt-6 h-3 w-24 rounded bg-violet-100" />
                <div className="mt-5 h-9 w-36 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* API ERROR */}
        {!reviewsLoading && reviewsError && reviews.length === 0 && (
          <div className="mt-10 rounded-xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-600">
              Unable to load reviews. Please try again.
            </p>

            <button
              type="button"
              onClick={() =>
                dispatch(
                  getAllReviews({
                    page: 1,
                    limit: 100,
                  })
                )
              }
              className="mt-4 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* REVIEWS GRID */}
        {!reviewsLoading && reviews.length === 0 && !reviewsError && (
          <div className="mt-10 rounded-xl border border-violet-100 bg-violet-50/50 px-5 py-12 text-center">
            <Star
              size={34}
              className="mx-auto text-violet-300"
            />

            <h2 className="mt-4 text-lg font-bold text-[#11133F]">
              No Reviews Available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Reviews will appear here once they are available from the API.
            </p>
          </div>
        )}

        {reviews.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {visibleReviews.map((review, index) => (
                <motion.article
                  key={review.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                  }}
                  whileHover={{ y: -5 }}
                  className="group relative flex min-h-[290px] flex-col overflow-hidden rounded-xl border border-violet-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/60"
                >
                  {/* TOP ACCENT */}
                  <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-violet-400 via-purple-600 to-violet-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* QUOTE + IMAGE */}
                  <div className="flex items-start justify-between">
                    <div className="text-5xl font-black leading-none text-violet-300">
                      “
                    </div>

                    <div className="h-[94px] w-[94px] shrink-0 overflow-hidden rounded-2xl border border-violet-100 bg-violet-50">
                      <img
                        src={review.image || FALLBACK_IMAGE}
                        alt={review.name}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_IMAGE.replace(
                            "GlobalScion+Speaker",
                            encodeURIComponent(review.name).replace(
                              /%20/g,
                              "+"
                            )
                          );
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* COMMENT */}
                  <p className="mt-2 min-h-[105px] text-[13px] leading-[1.65] text-slate-600">
                    {review.comment}
                  </p>

                  {/* API RATING */}
                  <div
                    className="mt-4 flex items-center gap-1"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        fill={
                          star <= review.rating
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          star <= review.rating
                            ? "text-violet-500"
                            : "text-violet-200"
                        }
                      />
                    ))}
                  </div>

                  {/* REVIEWER DETAILS */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                      <UserRound size={17} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-violet-600">
                        {review.name}
                      </h3>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* REVIEW COUNT */}
        {reviews.length > 0 && (
          <div className="mt-6 text-center text-xs text-slate-400">
            Showing {currentPage * reviewsPerPage + 1}–
            {Math.min(
              currentPage * reviewsPerPage + reviewsPerPage,
              reviews.length
            )}{" "}
            of {reviews.length} reviews
          </div>
        )}
      </section>
    </div>
  );
};

export default Reviews;
