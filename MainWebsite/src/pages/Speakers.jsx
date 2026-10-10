
import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mic2,
  Globe2,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getSpeakers } from "../redux/userSlice";

const FALLBACK_IMAGE =
  "https://ui-avatars.com/api/?name=GlobalScion+Speaker&background=ede9fe&color=7c3aed&size=400";

const Speakers = () => {
  const dispatch = useDispatch();

  const {
    speakers: apiSpeakers,
    speakerLoading,
    speakerError,
  } = useSelector((state) => state.user);

  // Fetch all speakers from API
  useEffect(() => {
    dispatch(getSpeakers());
  }, [dispatch]);

  // Normalize API response
  const speakers = useMemo(() => {
    const response = apiSpeakers;

    const list = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.speakers)
          ? response.speakers
          : [];

    return list
      .filter((speaker) => speaker && typeof speaker === "object")
      .map((speaker, index) => ({
        id: speaker._id || speaker.id || index + 1,

        name:
          speaker.name ||
          speaker.fullName ||
          speaker.speakerName ||
          speaker.firstName && speaker.lastName
            ? (
                speaker.name ||
                speaker.fullName ||
                speaker.speakerName ||
                `${speaker.firstName} ${speaker.lastName}`
              )
            : speaker.firstName || "GlobalScion Speaker",

        role:
          speaker.role ||
          speaker.designation ||
          speaker.title ||
          speaker.position ||
          speaker.profession ||
          "Speaker",

        organization:
          speaker.organization ||
          speaker.affiliation ||
          speaker.institution ||
          speaker.company ||
          speaker.university ||
          "",

        specialty:
          speaker.specialty ||
          speaker.expertise ||
          speaker.areaOfExpertise ||
          speaker.specialization ||
          speaker.researchArea ||
          "Research & Innovation",

        image:
          speaker.image?.url ||
          speaker.image?.secure_url ||
          speaker.imageUrl ||
          speaker.profileImage?.url ||
          speaker.profileImage ||
          speaker.photo?.url ||
          speaker.photo ||
          speaker.image ||
          speaker.avatar ||
          "",

        linkedin:
          speaker.linkedin ||
          speaker.linkedinUrl ||
          speaker.linkedIn ||
          speaker.socialLinks?.linkedin ||
          speaker.socialMedia?.linkedin ||
          "",
      }));
  }, [apiSpeakers]);

  /* =========================================================
     THEME COLORS (White + Violet Palette)
  ========================================================= */

  const colors = {
    pageBg: "#FFFFFF",
    heroBg: "#F5F3FF",
    heroCircleOne: "rgba(124,58,237,0.12)",
    heroCircleTwo: "rgba(168,85,247,0.10)",
    eyebrow: "#7C3AED",
    heroHeading: "#7C3AED",
    heroText: "#4B5563",
    sectionBg: "#FFFFFF",
    sectionIcon: "#7C3AED",
    sectionHeading: "#111827",
    sectionDescription: "#6B7280",
    globalExperts: "#7C3AED",
    cardBg: "#FFFFFF",
    cardBorder: "#E5E7EB",
    cardShadow: "0 4px 16px rgba(124,58,237,0.06)",
    cardHoverShadow: "0 18px 40px rgba(124,58,237,0.15)",
    imageBg: "#F5F3FF",
    numberBg: "rgba(255,255,255,0.95)",
    numberText: "#7C3AED",
    role: "#111827",
    organization: "#6B7280",
    divider: "#EDE9FE",
    specialtyLabel: "#9CA3AF",
    specialty: "#7C3AED",
    arrowBg: "#F5F3FF",
    arrowColor: "#7C3AED",
    linkedinBg: "#FFFFFF",
    ctaBg: "#F5F3FF",
    ctaBorder: "#DDD6FE",
    ctaCircleOne: "rgba(124,58,237,0.12)",
    ctaCircleTwo: "rgba(168,85,247,0.10)",
    ctaHeading: "#111827",
    ctaText: "#4B5563",
    button: "#7C3AED",
    buttonHover: "#6D28D9",
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: colors.pageBg,
        color: colors.heroHeading,
      }}
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="relative overflow-hidden transition-colors duration-500"
        style={{
          backgroundColor: colors.heroBg,
        }}
      >
        <div
          className="absolute -top-24 -right-16 h-72 w-72 rounded-full transition-all duration-500"
          style={{
            backgroundColor: colors.heroCircleOne,
          }}
        />

        <div
          className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full transition-all duration-500"
          style={{
            backgroundColor: colors.heroCircleTwo,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-10 text-center md:py-12 lg:px-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            {/* EYEBROW */}
            <div className="mb-3 flex items-center justify-center gap-2.5">
              <span
                className="h-[1.5px] w-7 sm:w-9"
                style={{
                  backgroundColor: colors.eyebrow,
                }}
              />

              <span
                className="text-[10px] font-semibold tracking-[0.2em] sm:text-xs"
                style={{
                  color: colors.eyebrow,
                }}
              >
                GLOBAL EXPERTS
              </span>

              <span
                className="h-[1.5px] w-7 sm:w-9"
                style={{
                  backgroundColor: colors.eyebrow,
                }}
              />
            </div>

            {/* HEADING */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.08,
              }}
              className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl"
              style={{
                color: colors.heroHeading,
              }}
            >
              Meet Our Speakers
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.15,
              }}
              className="mx-auto mt-3 max-w-xl text-xs leading-5 sm:text-sm sm:leading-6"
              style={{
                color: colors.heroText,
              }}
            >
              Connect with renowned researchers, healthcare professionals,
              innovators, academics, and industry leaders from around the world.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SPEAKERS
      ====================================================== */}

      <section
        className="px-6 py-16 transition-colors duration-500"
        style={{
          backgroundColor: colors.sectionBg,
        }}
      >
        <div className="mx-auto max-w-7xl">
          {/* SECTION HEADER */}
          <motion.div
            className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Mic2
                  size={18}
                  style={{
                    color: colors.sectionIcon,
                  }}
                />

                <span
                  className="text-sm font-semibold"
                  style={{
                    color: colors.sectionIcon,
                  }}
                >
                  OUR EXPERT SPEAKERS
                </span>
              </div>

              <h2
                className="text-2xl font-bold md:text-3xl"
                style={{
                  color: colors.sectionHeading,
                }}
              >
                Inspiring Minds. Sharing Knowledge.
              </h2>

              <p
                className="mt-2 text-sm"
                style={{
                  color: colors.sectionDescription,
                }}
              >
                Learn from experts shaping the future of healthcare, science,
                technology, and innovation.
              </p>
            </div>

            {/* GLOBAL EXPERTS */}
            <div
              className="flex items-center gap-2 text-sm font-semibold"
              style={{
                color: colors.globalExperts,
              }}
            >
              <Globe2 size={18} />
              Global Experts
            </div>
          </motion.div>

          {/* LOADING STATE */}
          {speakerLoading && speakers.length === 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border animate-pulse"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <div
                    className="h-64"
                    style={{
                      backgroundColor: colors.imageBg,
                    }}
                  />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 rounded bg-violet-100" />
                    <div className="h-4 w-1/2 rounded bg-slate-100" />
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                    <div className="my-4 h-px bg-violet-100" />
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                    <div className="h-4 w-4/5 rounded bg-violet-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* API ERROR */}
          {!speakerLoading && speakerError && speakers.length === 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
              <h3 className="text-lg font-bold text-red-700">
                Unable to load speakers
              </h3>

              <p className="mt-2 text-sm text-red-600">
                {typeof speakerError === "string"
                  ? speakerError
                  : "Something went wrong while fetching speakers."}
              </p>

              <button
                type="button"
                onClick={() => dispatch(getSpeakers())}
                className="mt-5 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!speakerLoading &&
            !speakerError &&
            speakers.length === 0 && (
              <div className="rounded-xl border border-violet-100 bg-violet-50/50 px-6 py-12 text-center">
                <UserRound
                  size={36}
                  className="mx-auto text-violet-400"
                />

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  No Speakers Available
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Speakers will appear here once they are added.
                </p>
              </div>
            )}

          {/* SPEAKER GRID */}
          {speakers.length > 0 && (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.08,
              }}
            >
              {speakers.map((speaker, index) => (
                <motion.article
                  key={speaker.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    boxShadow: colors.cardHoverShadow,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="group overflow-hidden rounded-xl border shadow-sm transition-all duration-500"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                    boxShadow: colors.cardShadow,
                  }}
                >
                  {/* IMAGE */}
                  <div
                    className="relative h-64 overflow-hidden"
                    style={{
                      backgroundColor: colors.imageBg,
                    }}
                  >
                    <img
                      src={speaker.image || FALLBACK_IMAGE}
                      alt={speaker.name}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_IMAGE.replace(
                          "GlobalScion+Speaker",
                          encodeURIComponent(speaker.name).replace(
                            /%20/g,
                            "+"
                          )
                        );
                      }}
                    />

                    {/* IMAGE OVERLAY */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* NUMBER */}
                    <div
                      className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shadow-sm"
                      style={{
                        backgroundColor: colors.numberBg,
                        color: colors.numberText,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* LINKEDIN */}
                    {speaker.linkedin && (
                      <motion.a
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn profile of ${speaker.name}`}
                        whileHover={{
                          scale: 1.1,
                        }}
                        whileTap={{
                          scale: 0.95,
                        }}
                        className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                        style={{
                          backgroundColor: colors.linkedinBg,
                        }}
                      >
                        <img
                          src="/svgs/linkedin.svg"
                          alt="LinkedIn"
                          className="h-[18px] w-[18px] object-contain"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </motion.a>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    {/* NAME */}
                    <h3
                      className="text-lg font-bold leading-tight"
                      style={{
                        color: colors.sectionHeading,
                      }}
                    >
                      {speaker.name}
                    </h3>

                    {/* ROLE */}
                    <p
                      className="mt-1 text-sm font-medium"
                      style={{
                        color: colors.role,
                      }}
                    >
                      {speaker.role}
                    </p>

                    {/* ORGANIZATION */}
                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: colors.organization,
                      }}
                    >
                      {speaker.organization || "GlobalScion Conferences"}
                    </p>

                    {/* DIVIDER */}
                    <div
                      className="my-4 h-px"
                      style={{
                        backgroundColor: colors.divider,
                      }}
                    />

                    {/* SPECIALTY */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{
                            color: colors.specialtyLabel,
                          }}
                        >
                          Specialty
                        </p>

                        <p
                          className="mt-1 text-xs font-semibold leading-5"
                          style={{
                            color: colors.specialty,
                          }}
                        >
                          {speaker.specialty}
                        </p>
                      </div>

                      {/* ARROW */}
                      <motion.div
                        whileHover={{
                          x: 4,
                        }}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: colors.arrowBg,
                        }}
                      >
                        <ArrowRight
                          size={15}
                          style={{
                            color: colors.arrowColor,
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <motion.section
        className="px-6 pb-16"
        style={{
          backgroundColor: colors.sectionBg,
        }}
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
          amount: 0.3,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <div
          className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border px-6 py-10 text-center transition-all duration-500 md:py-12"
          style={{
            backgroundColor: colors.ctaBg,
            borderColor: colors.ctaBorder,
            boxShadow: "0 10px 35px rgba(124,58,237,0.08)",
          }}
        >
          {/* DECORATIVE CIRCLES */}
          <div
            className="absolute -right-16 -top-24 h-56 w-56 rounded-full"
            style={{
              backgroundColor: colors.ctaCircleOne,
            }}
          />

          <div
            className="absolute -bottom-28 -left-16 h-56 w-56 rounded-full"
            style={{
              backgroundColor: colors.ctaCircleTwo,
            }}
          />

          <div className="relative">
            {/* CTA HEADING */}
            <h2
              className="text-2xl font-bold md:text-3xl"
              style={{
                color: colors.ctaHeading,
              }}
            >
              Want to Join Our Speaker Community?
            </h2>

            {/* CTA DESCRIPTION */}
            <p
              className="mx-auto mt-3 max-w-2xl text-sm leading-6"
              style={{
                color: colors.ctaText,
              }}
            >
              Share your expertise, research, and ideas with a global audience
              of professionals and innovators.
            </p>

            {/* CTA BUTTON */}
            <motion.button
              type="button"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-md px-7 text-sm font-semibold text-white transition-colors"
              style={{
                backgroundColor: colors.button,
                boxShadow: "0 8px 25px rgba(124,58,237,0.25)",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor =
                  colors.buttonHover;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = colors.button;
              }}
            >
              Become a Speaker
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Speakers;
