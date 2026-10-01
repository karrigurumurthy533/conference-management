
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getConferencesApi } from "../api/api";

const Conferences = () => {
  const navigate = useNavigate();

  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const colors = {
    pageBg: "#FFFFFF",
    headerBg: "#FAF7FF",

    eyebrow: "#7C3AED",
    heading: "#4C1D95",
    description: "#4B5563",

    sectionBg: "#FFFFFF",

    cardBg: "#FFFFFF",
    cardBorder: "#E9DDFB",

    cardShadow: "0 2px 10px rgba(124,58,237,0.04)",
    cardHoverShadow: "0 18px 40px rgba(124,58,237,0.12)",

    cardTitle: "#4C1D95",
    infoText: "#4B5563",

    icon: "#7C3AED",

    badgeBg: "rgba(255,255,255,0.95)",
    badgeText: "#7C3AED",

    button: "#7C3AED",
    buttonHover: "#5B21B6",
  };

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getConferencesApi();

        const data = response?.data?.data || response?.data || [];

        setConferences(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch Conferences Error:", error);

        setError(
          error?.response?.data?.message ||
            "Failed to load conferences"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  const handleConferenceClick = (id) => {
    navigate(`/conference/${id}`);
  };

  const getConferenceTitle = (conference) => {
    return (
      conference?.basicInformation?.title ||
      conference?.title ||
      conference?.name ||
      "Conference"
    );
  };

  const getConferenceSubtitle = (conference) => {
    return (
      conference?.basicInformation?.subtitle ||
      conference?.basicInformation?.description ||
      conference?.subtitle ||
      conference?.description ||
      ""
    );
  };

  const getConferenceCategory = (conference) => {
    return (
      conference?.basicInformation?.category ||
      conference?.category ||
      conference?.conferenceCategory ||
      "Conference"
    );
  };

  const getConferenceDate = (conference) => {
    const startDate =
      conference?.conferenceDates?.startDate ||
      conference?.dates?.startDate ||
      conference?.startDate;

    const endDate =
      conference?.conferenceDates?.endDate ||
      conference?.dates?.endDate ||
      conference?.endDate;

    if (!startDate) {
      return "Date to be announced";
    }

    const formatDate = (date) => {
      if (!date) {
        return "";
      }

      return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
    };

    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    return formatDate(startDate);
  };

  const getConferenceLocation = (conference) => {
    const venue =
      conference?.venueInformation ||
      conference?.venue ||
      {};

    if (conference?.mode === "Webinar") {
      return "Webinar";
    }

    if (conference?.conferenceMode === "Webinar") {
      return "Webinar";
    }

    return (
      venue?.city ||
      venue?.location ||
      venue?.venueName ||
      conference?.location ||
      conference?.country ||
      "Location to be announced"
    );
  };

  const getConferenceImage = (conference) => {
    return (
      conference?.media?.bannerImage ||
      conference?.media?.conferenceBanner ||
      conference?.bannerImage ||
      conference?.imageUrl ||
      conference?.image ||
      "https://globalscion.com/wp-content/uploads/2026/09/vitaly-gariev-QRK_LW8-cKM-unsplash-scaled.jpg"
    );
  };

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: colors.pageBg,
      }}
    >
      <section
        className="relative overflow-hidden px-6 py-10 md:py-12"
        style={{
          backgroundColor: colors.headerBg,
        }}
      >
        <div className="relative mx-auto max-w-7xl text-center">
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="text-[10px] font-semibold uppercase tracking-[0.18em] md:text-xs"
            style={{
              color: colors.eyebrow,
            }}
          >
            GlobalScion Conferences
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.08,
            }}
            className="mt-2 text-2xl font-bold leading-tight md:text-3xl"
            style={{
              color: colors.heading,
            }}
          >
            Explore Our Conferences
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.16,
            }}
            className="mx-auto mt-3 max-w-xl text-xs leading-5 md:text-sm md:leading-6"
            style={{
              color: colors.description,
            }}
          >
            Join leading researchers, clinicians, educators,
            advocates, families and professionals from around
            the world at our upcoming conferences.
          </motion.p>
        </div>
      </section>

      <section
        className="border-y px-6 py-5"
        style={{
          backgroundColor: "#FAF7FF",
          borderColor: "#E9DDFB",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.4,
            }}
            className="flex flex-col items-center gap-4 lg:flex-row"
          >
            <div className="shrink-0 text-center lg:w-[220px] lg:text-left">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.16em]"
                style={{
                  color: "#7C3AED",
                }}
              >
                Stay Connected
              </p>

              <h2
                className="mt-0.5 text-base font-bold"
                style={{
                  color: "#4C1D95",
                }}
              >
                Subscribe to Our Mailing List
              </h2>
            </div>

            <div className="w-full lg:flex-1">
              <input
                type="text"
                placeholder="Name"
                className="h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none transition-all focus:ring-2 focus:ring-purple-200"
                style={{
                  borderColor: "#E9DDFB",
                }}
              />
            </div>

            <div className="w-full lg:flex-1">
              <input
                type="email"
                placeholder="Email"
                className="h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none transition-all focus:ring-2 focus:ring-purple-200"
                style={{
                  borderColor: "#E9DDFB",
                }}
              />
            </div>

            <div className="w-full lg:flex-1">
              <input
                type="tel"
                placeholder="Phone Number"
                className="h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none transition-all focus:ring-2 focus:ring-purple-200"
                style={{
                  borderColor: "#E9DDFB",
                }}
              />
            </div>

            <div className="w-full lg:flex-1">
              <select
                defaultValue=""
                className="h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none transition-all focus:ring-2 focus:ring-purple-200"
                style={{
                  borderColor: "#E9DDFB",
                  color: "#6B7280",
                }}
              >
                <option value="" disabled>
                  Select Conference
                </option>

                {conferences.map((conference) => (
                  <option
                    key={conference._id || conference.id}
                    value={conference._id || conference.id}
                  >
                    {getConferenceTitle(conference)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="h-10 shrink-0 rounded-lg px-5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#7C3AED",
                boxShadow:
                  "0 5px 14px rgba(124,58,237,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#5B21B6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#7C3AED";
              }}
            >
              Subscribe
            </button>
          </motion.div>
        </div>
      </section>

      <section
        className="px-6 py-20"
        style={{
          backgroundColor: colors.sectionBg,
        }}
      >
        <div className="mx-auto max-w-7xl">
          {loading && (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="text-sm font-medium text-purple-700">
                Loading conferences...
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                {error}
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            conferences.length === 0 && (
              <div className="flex min-h-[250px] items-center justify-center">
                <div className="text-sm text-gray-500">
                  No conferences available.
                </div>
              </div>
            )}

          {!loading &&
            !error &&
            conferences.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {conferences.map((conference, index) => {
                  const conferenceId =
                    conference?._id || conference?.id;

                  const title =
                    getConferenceTitle(conference);

                  const subtitle =
                    getConferenceSubtitle(conference);

                  const category =
                    getConferenceCategory(conference);

                  const date =
                    getConferenceDate(conference);

                  const location =
                    getConferenceLocation(conference);

                  const image =
                    getConferenceImage(conference);

                  return (
                    <motion.article
                      key={conferenceId}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.1,
                      }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.55,
                      }}
                      whileHover={{
                        y: -7,
                        boxShadow:
                          colors.cardHoverShadow,
                      }}
                      onClick={() =>
                        handleConferenceClick(
                          conferenceId
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();

                          handleConferenceClick(
                            conferenceId
                          );
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className="group cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                      style={{
                        backgroundColor:
                          colors.cardBg,
                        borderColor:
                          colors.cardBorder,
                        boxShadow:
                          colors.cardShadow,
                      }}
                    >
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://globalscion.com/wp-content/uploads/2026/09/vitaly-gariev-QRK_LW8-cKM-unsplash-scaled.jpg";
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        <span
                          className="absolute bottom-4 left-4 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm"
                          style={{
                            backgroundColor:
                              colors.badgeBg,
                            color: colors.badgeText,
                          }}
                        >
                          {category}
                        </span>
                      </div>

                      <div className="p-6">
                        <h2
                          className="text-xl font-bold leading-snug"
                          style={{
                            color: colors.cardTitle,
                          }}
                        >
                          {title}
                        </h2>

                        {subtitle && (
                          <p
                            className="mt-3 text-sm leading-6"
                            style={{
                              color:
                                colors.infoText,
                            }}
                          >
                            {subtitle}
                          </p>
                        )}

                        <div className="mt-5 space-y-3">
                          <div
                            className="flex items-center gap-3 text-sm"
                            style={{
                              color:
                                colors.infoText,
                            }}
                          >
                            <CalendarDays
                              size={17}
                              strokeWidth={2}
                              style={{
                                color: colors.icon,
                              }}
                            />

                            <span>{date}</span>
                          </div>

                          <div
                            className="flex items-center gap-3 text-sm"
                            style={{
                              color:
                                colors.infoText,
                            }}
                          >
                            <MapPin
                              size={17}
                              strokeWidth={2}
                              style={{
                                color: colors.icon,
                              }}
                            />

                            <span>
                              {location}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            handleConferenceClick(
                              conferenceId
                            );
                          }}
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300"
                          style={{
                            color: colors.button,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color =
                              colors.buttonHover;

                            e.currentTarget.style.transform =
                              "translateX(3px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color =
                              colors.button;

                            e.currentTarget.style.transform =
                              "translateX(0)";
                          }}
                        >
                          View Conference

                          <ArrowRight
                            size={17}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
        </div>
      </section>
    </main>
  );
};

export default Conferences;
