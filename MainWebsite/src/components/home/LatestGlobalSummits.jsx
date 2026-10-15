
import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
  Globe2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getConferences } from "../../redux/userSlice";

const colors = {
  brand: "#7C3AED",
  brandDark: "#6D28D9",
  accent: "#A855F7",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#EDE9FE",
  soft: "#F5F3FF",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const containerAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const getConferenceDate = (conference) => {
  const startDate =
    conference?.conferenceDates?.startDate ||
    conference?.dates?.startDate ||
    conference?.startDate ||
    conference?.date ||
    conference?.eventDate;

  if (!startDate) return "Date to be announced";

  const parsedDate = new Date(startDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date to be announced";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getConferenceLocation = (conference) => {
  if (typeof conference?.location === "string") {
    return conference.location;
  }

  if (
    conference?.location &&
    typeof conference.location === "object"
  ) {
    const locationParts = [
      conference.location.city,
      conference.location.state,
      conference.location.country,
    ].filter(Boolean);

    if (locationParts.length) {
      return locationParts.join(", ");
    }
  }

  return (
    [
      conference?.city,
      conference?.state,
      conference?.country,
    ]
      .filter(Boolean)
      .join(", ") || "Location to be announced"
  );
};

const getConferenceImage = (conference) =>
  conference?.image ||
  conference?.conferenceImage ||
  conference?.bannerImage ||
  conference?.heroImage ||
  conference?.thumbnail ||
  conference?.aboutImage ||
  "";

const getConferenceId = (conference) =>
  conference?._id || conference?.id;

const LatestGlobalSummits = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    conferences: allConferences = [],
    conferenceLoading: loading,
    conferenceError: error,
  } = useSelector((state) => state.user);

  // Fetch conferences using the existing Redux slice
  useEffect(() => {
    dispatch(getConferences());
  }, [dispatch]);

  // Display the first 8 conferences ordered by upcoming start date
  const conferences = useMemo(() => {
    if (!Array.isArray(allConferences)) return [];

    return [...allConferences]
      .sort((a, b) => {
        const dateA = new Date(
          a?.conferenceDates?.startDate ||
            a?.dates?.startDate ||
            a?.startDate ||
            a?.createdAt ||
            0
        ).getTime();

        const dateB = new Date(
          b?.conferenceDates?.startDate ||
            b?.dates?.startDate ||
            b?.startDate ||
            b?.createdAt ||
            0
        ).getTime();

        return dateA - dateB;
      })
      .slice(0, 8);
  }, [allConferences]);

  // Navigate to the selected conference details page
  const handleConferenceClick = (conference) => {
    const id = getConferenceId(conference);

    if (id) {
      navigate(`/conferences/${id}`);
    }
  };

  // Navigate to all conferences
  const handleViewAll = () => {
    navigate("/conferences");
  };

  return (
    <section
      id="conferences"
      className="relative overflow-hidden bg-white pt-12 pb-6 sm:pt-14 sm:pb-8 lg:pt-16 lg:pb-8"
    >
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ backgroundColor: "#EDE9FE" }}
      />

      <div
        className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: "#F3E8FF" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-9 max-w-3xl text-center sm:mb-11"
        >
          <span
            className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] sm:text-sm"
            style={{
              backgroundColor: colors.soft,
              color: colors.brand,
            }}
          >
            <Globe2 size={15} />
            Global Events
          </span>

          <h2
            className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: colors.text }}
          >
            Explore Our Latest{" "}
            <span style={{ color: colors.brand }}>
              Conferences
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Discover upcoming international conferences, connect
            with experts, share knowledge, and be part of global
            scientific and academic communities.
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && conferences.length === 0 && (
          <div className="flex min-h-52 flex-col items-center justify-center gap-3">
            <Loader2
              className="animate-spin"
              size={34}
              style={{ color: colors.brand }}
            />
            <p className="text-sm font-medium text-gray-500">
              Loading conferences...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && conferences.length === 0 && (
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center">
            <AlertCircle
              size={32}
              className="mb-3 text-red-500"
            />

            <h3 className="text-base font-bold text-gray-800">
              Unable to load conferences
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              {typeof error === "string"
                ? error
                : "Something went wrong while loading conferences."}
            </p>

            <button
              type="button"
              onClick={() => dispatch(getConferences())}
              className="mt-4 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: colors.brand }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          !error &&
          conferences.length === 0 && (
            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 px-5 py-12 text-center">
              <Globe2
                size={36}
                className="mx-auto mb-3"
                style={{ color: colors.brand }}
              />

              <h3 className="text-lg font-bold text-gray-800">
                No conferences available
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Please check back soon for upcoming conferences.
              </p>
            </div>
          )}

        {/* Conference cards */}
        {conferences.length > 0 && (
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {conferences.map((conference, index) => {
              const id = getConferenceId(conference);
              const image = getConferenceImage(conference);

              const title =
                conference?.title ||
                conference?.name ||
                "International Conference";

              const location =
                getConferenceLocation(conference);

              const date = getConferenceDate(conference);

              const mode =
                conference?.mode ||
                conference?.conferenceMode ||
                conference?.eventMode ||
                "International Event";

              return (
                <motion.article
                  key={id || `${title}-${index}`}
                  variants={cardAnimation}
                  whileHover={{ y: -5 }}
                  className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-white p-3.5 transition-shadow duration-300 hover:shadow-xl"
                  style={{ borderColor: colors.border }}
                  onClick={() =>
                    handleConferenceClick(conference)
                  }
                >
                  {/* Conference image */}
                  <div className="relative h-[135px] w-full overflow-hidden rounded-lg bg-violet-50">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Globe2
                          size={42}
                          strokeWidth={1.4}
                          style={{ color: colors.accent }}
                        />
                      </div>
                    )}

                    <div className="absolute left-2.5 top-2.5">
                      <span
                        className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-sm"
                        style={{
                          backgroundColor: colors.brand,
                        }}
                      >
                        {mode}
                      </span>
                    </div>
                  </div>

                  {/* Conference information */}
                  <div className="flex flex-1 flex-col pt-3">
                    <div
                      className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold"
                      style={{ color: colors.brand }}
                    >
                      <CalendarDays size={13} />
                      <span>{date}</span>
                    </div>

                    <h3 className="mb-3 line-clamp-2 text-sm font-bold leading-5 text-gray-800 transition-colors group-hover:text-violet-700">
                      {title}
                    </h3>

                    <div className="mb-3 flex items-start gap-1.5 text-xs leading-5 text-gray-500">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0"
                        style={{ color: colors.brand }}
                      />

                      <span className="line-clamp-2">
                        {location}
                      </span>
                    </div>

                    {/* View Details button */}
                    <div className="mt-auto border-t border-violet-100 pt-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleConferenceClick(conference);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          backgroundColor: colors.brand,
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.backgroundColor =
                            colors.brandDark;
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.backgroundColor =
                            colors.brand;
                        }}
                      >
                        View Details
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* View All Conferences button */}
        {conferences.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-5 text-center sm:mt-6"
          >
            <button
              type="button"
              onClick={handleViewAll}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
              style={{
                borderColor: colors.brand,
                color: colors.brand,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor =
                  colors.brand;
                event.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor =
                  "transparent";
                event.currentTarget.style.color = colors.brand;
              }}
            >
              View All Conferences
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestGlobalSummits;
