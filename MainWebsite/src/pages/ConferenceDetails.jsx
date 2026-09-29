import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Download,
  CheckCircle2,
  Plus,
  Minus,
  Brain,
  Globe2,
  Lightbulb,
  HeartHandshake,
  FileText,
  UserPlus,
  BookOpen,
  Clock3,
  Presentation,
  Award,
} from "lucide-react";

import conferences from "../../data/conferences";

const ConferenceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const conference = conferences.find((item) => item.id === id);

  const [openTrack, setOpenTrack] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  /* =========================================================
     COLORS
  ========================================================= */

  const colors = {
    pageBg: "#FFFFFF",
    text: "#111827",

    heroBg: "#12091F",

    link: "#C084FC",
    linkHover: "#FFFFFF",

    categoryBg: "rgba(124,58,237,0.24)",
    categoryText: "#E9D5FF",

    heading: "#FFFFFF",
    headingAccent: "#7C3AED",
    subtitle: "#F5F3FF",
    description: "#DDD6FE",

    infoIconBg: "rgba(255,255,255,0.14)",
    infoIcon: "#D8B4FE",
    infoTitle: "#FFFFFF",
    muted: "rgba(255,255,255,0.68)",

    countdownIconBg: "#7C3AED",
    countdownHeading: "#FFFFFF",
    countdownCardBg: "rgba(20,10,35,0.78)",
    countdownCardBorder: "rgba(216,180,254,0.30)",
    countdownCardShadow: "0 10px 28px rgba(0,0,0,0.20)",

    countdownBoxBg: "rgba(255,255,255,0.07)",
    countdownBoxBorder: "rgba(255,255,255,0.14)",
    countdownBoxHoverBorder: "#A855F7",
    countdownNumber: "#FFFFFF",
    countdownLabel: "#D8B4FE",

    primary: "#7C3AED",
    primaryHover: "#6D28D9",

    actionBorder: "rgba(255,255,255,0.18)",
    actionBg: "rgba(255,255,255,0.08)",
    actionText: "#FFFFFF",
    actionIconBg: "rgba(168,85,247,0.22)",
    actionIcon: "#D8B4FE",
    actionDescription: "rgba(255,255,255,0.60)",

    featuredBg: "#FFFFFF",
    sectionBorder: "#EDE9FE",

    speakerRing: "#D8B4FE",
    speakerName: "#2E1065",
    speakerOrg: "#6B7280",
    speakerSpecialty: "#7C3AED",

    aboutBg: "#F8F7FF",
    aboutBody: "#4B5563",
    miniBorder: "#DDD6FE",
    miniTitle: "#4C1D95",

    quoteBg: "#F0EAFE",
    quoteMark: "#7C3AED",
    quoteText: "#4C1D95",
    quoteDivider: "#C4B5FD",

    topicsBg: "#FFFFFF",
    topicBorder: "#EDE9FE",
    topicText: "#405E58",

    whyBg: "#F0EAFE",
    whyDecor1: "#DDD6FE",
    whyDecor2: "#E9D5FF",
    whyText: "#4B5563",
    benefitBorder: "#C4B5FD",

    sessionsBg: "#F8F7FF",
    accordionBg: "#FFFFFF",
    accordionBorder: "#DDD6FE",
    rowBorder: "#E8E5F2",
    rowHover: "#FAF8FF",
    closedNumberBg: "#F0EAFE",
    trackTitle: "#8352df",
    trackDesc: "#4B5563",

    finalBg: "#4C1D95",
    finalIcon: "#DDD6FE",
  };

  /* =========================================================
     COUNTDOWN
  ========================================================= */

  const calculateTimeLeft = () => {
    if (!conference?.startDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const targetTime = new Date(conference.startDate).getTime();

    if (Number.isNaN(targetTime)) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const difference = targetTime - Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!conference?.startDate) return;

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [conference?.startDate]);

  /* =========================================================
     INVALID CONFERENCE
  ========================================================= */

  if (!conference) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center px-6"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.text,
        }}
      >
        <div className="text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor: "#F0EAFE",
              color: colors.primary,
            }}
          >
            <Brain size={30} />
          </div>

          <h1
            className="mt-5 text-2xl font-bold"
            style={{
              color: "#2E1065",
            }}
          >
            Conference Details
          </h1>

          <p
            className="mt-3 text-sm md:text-base"
            style={{
              color: "#6B7280",
            }}
          >
            Please select a conference from the conferences page.
          </p>

          <Link
            to="/conferences"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: colors.primary,
            }}
          >
            <ArrowLeft size={16} />
            Back to Conferences
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     SOURCE CONTENT
  ========================================================= */

  const whyToAttend = conference.otherData?.whyToAttend || [];

  const sampleAgenda = conference.otherData?.sampleAgenda || [];

  const benefitsOfAttending =
    conference.otherData?.benefitsOfAttending || [];

  const delegates = conference.otherData?.delegates || [];

  const posterPresentersLive =
    conference.otherData?.posterPresentersLive || [];

  const ePosterPresenters =
    conference.otherData?.ePosterPresenters || {};

  const marketAnalysis =
    conference.otherData?.marketAnalysis || {};

  /* =========================================================
     TOGGLE SECTION
  ========================================================= */

  const toggleSection = (section) => {
    setOpenSection((current) =>
      current === section ? null : section,
    );
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: colors.pageBg,
        color: colors.text,
      }}
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: colors.heroBg,
        }}
      >
        <div className="absolute inset-0">
          <img
            src={conference.image}
            alt={conference.title}
            className="h-full w-full object-cover object-center"
            style={{
              filter: "brightness(0.52) saturate(1.05)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(15,5,28,0.95) 0%, rgba(35,13,55,0.82) 42%, rgba(76,29,149,0.45) 100%)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(7,2,15,0.72) 0%, rgba(7,2,15,0.05) 55%, rgba(7,2,15,0.18) 100%)",
            }}
          />
        </div>

        {/* DECORATION */}

        <div
          className="absolute right-[8%] top-10 h-14 w-14 rounded-full border"
          style={{
            borderColor: "rgba(216,180,254,0.16)",
          }}
        />

        <div
          className="absolute bottom-10 right-[15%] h-7 w-7 rounded-full"
          style={{
            backgroundColor: "rgba(168,85,247,0.12)",
          }}
        />

        <div
          className="absolute left-[48%] top-12 h-5 w-5 rounded-full"
          style={{
            backgroundColor: "rgba(216,180,254,0.10)",
          }}
        />

        <div
          className="absolute left-[54%] top-[18%] h-3 w-3 rounded-full"
          style={{
            backgroundColor: "rgba(216,180,254,0.10)",
          }}
        />

        {/* HERO CONTENT */}

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-4 lg:px-10 lg:py-5">
          <Link
            to="/conferences"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold transition-all hover:translate-x-0.5"
            style={{
              color: colors.link,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.linkHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.link;
            }}
          >
            <ArrowLeft size={13} />
            Back to Conferences
          </Link>

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mt-3 max-w-4xl"
          >
            {/* CATEGORY */}

            <span
              className="inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold backdrop-blur-md"
              style={{
                backgroundColor: colors.categoryBg,
                borderColor: "rgba(216,180,254,0.25)",
                color: colors.categoryText,
              }}
            >
              {conference.category}
            </span>

            {/* TITLE */}

            <motion.h1
              className="mt-3 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl"
              style={{
                color: colors.heading,
                textShadow: "0 4px 20px rgba(0,0,0,0.45)",
              }}
            >
              {conference.title}
            </motion.h1>

            {/* SUBTITLE */}

            <motion.p
              className="mt-3 max-w-3xl text-sm font-semibold leading-6 sm:text-base"
              style={{
                color: colors.subtitle,
              }}
            >
              {conference.subtitle}
            </motion.p>

            {/* DESCRIPTION */}

            <motion.p
              className="mt-2 max-w-3xl text-sm leading-6 sm:text-base"
              style={{
                color: colors.description,
              }}
            >
              {conference.description}
            </motion.p>

            {/* INFO */}

            <motion.div className="mt-4 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoItem
                icon={<CalendarDays size={16} />}
                title={conference.date}
                subtitle={conference.time}
                colors={colors}
              />

              <InfoItem
                icon={<MapPin size={16} />}
                title={conference.location}
                subtitle={conference.mode}
                colors={colors}
              />

              <InfoItem
                icon={<Users size={16} />}
                title={conference.participants}
                subtitle="Expected Participants"
                colors={colors}
              />
            </motion.div>

            {/* COUNTDOWN */}

            <motion.div className="mt-4 max-w-xl">
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md text-white"
                  style={{
                    backgroundColor: colors.countdownIconBg,
                  }}
                >
                  <Clock3 size={13} />
                </div>

                <p
                  className="text-[9px] font-bold uppercase tracking-[0.15em]"
                  style={{
                    color: colors.countdownHeading,
                  }}
                >
                  Conference Starts In
                </p>
              </div>

              <div
                className="relative overflow-hidden rounded-lg border p-2 backdrop-blur-xl"
                style={{
                  borderColor: colors.countdownCardBorder,
                  backgroundColor: colors.countdownCardBg,
                  boxShadow: colors.countdownCardShadow,
                }}
              >
                <div className="relative grid grid-cols-4 gap-2">
                  <PremiumCountdownBox
                    value={timeLeft.days}
                    label="Days"
                    colors={colors}
                  />

                  <PremiumCountdownBox
                    value={timeLeft.hours}
                    label="Hours"
                    colors={colors}
                  />

                  <PremiumCountdownBox
                    value={timeLeft.minutes}
                    label="Minutes"
                    colors={colors}
                  />

                  <PremiumCountdownBox
                    value={timeLeft.seconds}
                    label="Seconds"
                    colors={colors}
                  />
                </div>
              </div>
            </motion.div>

            {/* ACTIONS */}

            <motion.div className="mt-4 max-w-2xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                  Conference Actions
                </p>

              </div>

              <div className="grid max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                <PremiumActionButton
                  icon={<Download size={14} />}
                  text="Download Brochure"
                  description="Conference details"
                  colors={colors}
                  onClick={() =>
                    navigate(
                      `/conferences/${conference.id}/brochure`,
                    )
                  }
                />

                <PremiumActionButton
                  icon={<FileText size={14} />}
                  text="Abstract Submission"
                  description="Submit your research"
                  colors={colors}
                  onClick={() =>
                    navigate(
                      `/conferences/${conference.id}/abstract-submission`,
                    )
                  }
                />

                <PremiumActionButton
                  icon={<UserPlus size={14} />}
                  text="Register Now"
                  description="Reserve your seat"
                  colors={colors}
                  primary
                  onClick={() =>
                    navigate(
                      `/conferences/${conference.id}/register`,
                    )
                  }
                />

                <PremiumActionButton
                  icon={<BookOpen size={14} />}
                  text="Scientific Program"
                  description="View full program"
                  colors={colors}
                  onClick={() =>
                    navigate(
                      `/conferences/${conference.id}/scientific-program`,
                    )
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FEATURED SPEAKERS
      ===================================================== */}

      <section
        className="border-b px-6 py-12 lg:px-10 lg:py-14"
        style={{
          borderColor: colors.sectionBorder,
          backgroundColor: colors.featuredBg,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="Renowned Speakers"
            action="View All Speakers"
            colors={colors}
          />

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {conference.speakers?.map((speaker, index) => (
              <motion.div
                key={speaker.name}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="group text-center"
              >
                <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28">
                  <div
                    className="absolute -inset-1 rounded-full border-2 transition-all duration-300 group-hover:scale-105"
                    style={{
                      borderColor: colors.speakerRing,
                    }}
                  />

                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="h-full w-full rounded-full object-cover"
                  />

                  <a
                    href={
                      speaker.linkedin ||
                      "https://www.linkedin.com/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-md"
                    style={{
                      borderColor: colors.featuredBg,
                      backgroundColor: colors.primary,
                    }}
                  >
                    <img
                      src="/svgs/linkedin.svg"
                      alt="LinkedIn"
                      className="h-3.5 w-3.5"
                    />
                  </a>
                </div>

                <h3
                  className="mt-3 text-xs font-bold leading-5 sm:text-sm"
                  style={{
                    color: colors.speakerName,
                  }}
                >
                  {speaker.name}
                </h3>

                <p
                  className="mt-1 text-[10px] leading-4 sm:text-xs"
                  style={{
                    color: colors.speakerOrg,
                  }}
                >
                  {speaker.organization || speaker.role}
                </p>

                <p
                  className="mt-1 text-[10px] font-medium leading-4"
                  style={{
                    color: colors.speakerSpecialty,
                  }}
                >
                  {speaker.specialty || ""}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WELCOME MESSAGE
          NO CARD
      ===================================================== */}

      <section
        className="relative bg-white px-6 py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl lg:px-10">
          {/* HEADER */}

          <motion.div
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
            }}
            transition={{
              duration: 0.7,
            }}
            className="mb-10"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-12 bg-violet-600" />

              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
                Welcome Message
              </span>
            </div>

            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              Welcome to the{" "}
              <span className="text-violet-600">
                Autism Research Conference
              </span>
            </h2>
          </motion.div>

          {/* NORMAL CONTENT - NO CARD */}

          <motion.div
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
            }}
            transition={{
              duration: 0.8,
            }}
            className="w-full"
          >
            <div className="max-w-6xl">
              {conference?.welcomeMessage?.paragraphs?.map(
                (paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                    }}
                    className="mb-6 text-base leading-8 text-gray-700 md:text-lg lg:text-[18px]"
                  >
                    {paragraph}
                  </motion.p>
                ),
              )}

              {/* SIGNATURE */}

              {conference?.welcomeMessage?.signature && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3,
                  }}
                  className="mt-8 pt-3"
                >
                  <p className="text-lg font-semibold text-violet-700 md:text-xl">
                    {conference.welcomeMessage.signature}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          WHO SHOULD ATTEND
      ===================================================== */}

      {conference.whoShouldAttendDescription && (
        <section
          className="px-6 py-14 lg:px-10 lg:py-16"
          style={{
            backgroundColor: colors.featuredBg,
          }}
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              label="Who Should Attend"
              colors={colors}
            />

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className="mt-7 rounded-2xl border p-7"
              style={{
                borderColor: colors.sectionBorder,
                backgroundColor: "#FAF8FF",
              }}
            >
              <p
                className="max-w-5xl text-sm leading-7 md:text-base md:leading-8"
                style={{
                  color: colors.aboutBody,
                }}
              >
                {conference.whoShouldAttendDescription}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {conference.whoShouldAttend?.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-lg border bg-white p-4"
                    style={{
                      borderColor: colors.topicBorder,
                    }}
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 flex-shrink-0"
                      style={{
                        color: colors.primary,
                      }}
                    />

                    <span
                      className="text-xs font-semibold leading-5"
                      style={{
                        color: colors.topicText,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* =====================================================
          KEY HIGHLIGHTS
      ===================================================== */}

      {conference.keyHighlights?.length > 0 && (
        <section
          className="px-6 py-14 lg:px-10 lg:py-16"
          style={{
            backgroundColor: colors.aboutBg,
          }}
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              label="Key Highlights"
              colors={colors}
            />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {conference.keyHighlights.map(
                (highlight, index) => (
                  <motion.div
                    key={highlight.title}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className="rounded-xl border bg-white p-6"
                    style={{
                      borderColor: colors.sectionBorder,
                    }}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: colors.quoteBg,
                        color: colors.primary,
                      }}
                    >
                      <Lightbulb size={19} />
                    </div>

                    <h3
                      className="mt-4 text-sm font-bold"
                      style={{
                        color: colors.miniTitle,
                      }}
                    >
                      {highlight.title}
                    </h3>

                    <p
                      className="mt-3 text-sm leading-6"
                      style={{
                        color: colors.aboutBody,
                      }}
                    >
                      {highlight.description}
                    </p>
                  </motion.div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          KEY TOPICS
      ===================================================== */}

      <section
        className="px-6 py-14 lg:px-10 lg:py-16"
        style={{
          backgroundColor: colors.topicsBg,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="Key Topics"
            action="Explore All Topics"
            colors={colors}
          />

          <div className="mt-8 grid grid-cols-1 gap-x-14 md:grid-cols-2">
            {conference.topics?.map((topic, index) => (
              <motion.div
                key={topic}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -12 : 12,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.03,
                }}
                className="flex items-start gap-3 border-b py-3"
                style={{
                  borderColor: colors.topicBorder,
                }}
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 flex-shrink-0"
                  style={{
                    color: colors.primary,
                  }}
                />

                <span
                  className="text-sm leading-6 md:text-base"
                  style={{
                    color: colors.topicText,
                  }}
                >
                  {topic}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SESSIONS & TRACKS
      ===================================================== */}

      <section
        className="px-6 py-16 lg:px-10 lg:py-20"
        style={{
          backgroundColor: colors.sessionsBg,
        }}
      >
        <div className="mx-auto max-w-5xl">
          {/* SECTION HEADER */}

          <div className="text-center">
            <div className="flex justify-center">
              <SectionLabel
                label="Conference Program"
                colors={colors}
              />
            </div>

            <h2
              className="mt-4 text-4xl font-bold tracking-tight md:text-4xl"
              style={{
                color: colors.headingAccent,
              }}
            >
              Sessions & Tracks
            </h2>

            <p
              className="mx-auto mt-4 max-w-3xl text-sm leading-7 md:text-base md:leading-8"
              style={{
                color: colors.trackDesc,
              }}
            >
              Explore the major scientific and professional themes
              covered during the conference. Click any track to
              expand the detailed content.
            </p>
          </div>

          {/* TRACKS */}

          <div
            className="mt-10 overflow-hidden rounded-2xl border bg-white shadow-sm"
            style={{
              borderColor: colors.accordionBorder,
            }}
          >
            {conference.tracks?.map((track, index) => {
              const isOpen = openTrack === index;

              return (
                <div
                  key={track.title}
                  className="border-b last:border-b-0"
                  style={{
                    borderColor: colors.rowBorder,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenTrack(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-5 px-5 py-6 text-left transition-all duration-300 md:px-7 md:py-7"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.rowHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <div className="flex min-w-0 items-center gap-5">
                      {/* NUMBER */}

                      <span
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300"
                        style={{
                          backgroundColor: isOpen
                            ? colors.primary
                            : colors.closedNumberBg,
                          color: isOpen
                            ? "#FFFFFF"
                            : colors.primary,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* TRACK TITLE */}

                      <span
                        className="text-base font-semibold leading-7 tracking-tight md:text-sm lg:text-xl"
                        style={{
                          color: colors.trackTitle,
                        }}
                      >
                        {track.title}
                      </span>
                    </div>

                    {/* PLUS / MINUS */}

                    <span
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: isOpen
                          ? colors.primary
                          : colors.closedNumberBg,
                        color: isOpen
                          ? "#FFFFFF"
                          : colors.primary,
                      }}
                    >
                      {isOpen ? (
                        <Minus size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                    </span>
                  </button>

                  {/* EXPANDED CONTENT */}

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.35,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t bg-[#FCFAFF] px-5 pb-7 pt-6 pl-[84px] md:px-7 md:pl-[100px]">
                          <p
                            className="max-w-2xl text-sm leading-7 md:text-base md:leading-8"
                            style={{
                              color: colors.trackDesc,
                            }}
                          >
                            {track.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          SAMPLE AGENDA
      ===================================================== */}

      {sampleAgenda.length > 0 && (
        <AccordionSection
          id="agenda"
          title="Sample Agenda"
          label="Conference Schedule"
          icon={<CalendarDays size={18} />}
          open={openSection === "agenda"}
          onToggle={() => toggleSection("agenda")}
          colors={colors}
        >
          <div className="grid gap-5 md:grid-cols-2">
            {sampleAgenda.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="overflow-hidden rounded-xl border"
                style={{
                  borderColor: colors.accordionBorder,
                }}
              >
                <div
                  className="px-5 py-4"
                  style={{
                    backgroundColor: colors.quoteBg,
                  }}
                >
                  <h3
                    className="text-sm font-bold md:text-base"
                    style={{
                      color: colors.miniTitle,
                    }}
                  >
                    {day.day}
                  </h3>
                </div>

                <div className="divide-y">
                  {day.schedule?.map((item) => (
                    <div
                      key={`${item.time}-${item.session}`}
                      className="flex gap-4 px-5 py-4"
                      style={{
                        borderColor: colors.rowBorder,
                      }}
                    >
                      <span
                        className="w-20 flex-shrink-0 text-xs font-bold"
                        style={{
                          color: colors.primary,
                        }}
                      >
                        {item.time}
                      </span>

                      <span
                        className="text-sm leading-6"
                        style={{
                          color: colors.trackDesc,
                        }}
                      >
                        {item.session}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </AccordionSection>
      )}

      {/* =====================================================
          WHY ATTEND
      ===================================================== */}

      {whyToAttend.length > 0 && (
        <AccordionSection
          id="why-attend"
          title="Why Attend This Conference?"
          label="Why Attend?"
          icon={<HeartHandshake size={18} />}
          open={openSection === "why-attend"}
          onToggle={() => toggleSection("why-attend")}
          colors={colors}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyToAttend.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.04,
                }}
                className="rounded-xl border p-6"
                style={{
                  borderColor: colors.benefitBorder,
                  backgroundColor: colors.whyBg,
                }}
              >
                <CheckCircle2
                  size={20}
                  style={{
                    color: colors.primary,
                  }}
                />

                <h3
                  className="mt-4 text-sm font-bold md:text-base"
                  style={{
                    color: colors.miniTitle,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="mt-3 text-sm leading-6"
                  style={{
                    color: colors.whyText,
                  }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </AccordionSection>
      )}

      {/* =====================================================
          BENEFITS OF ATTENDING
      ===================================================== */}

      {benefitsOfAttending.length > 0 && (
        <AccordionSection
          id="benefits"
          title="Benefits of Attending"
          label="Participant Benefits"
          icon={<Award size={18} />}
          open={openSection === "benefits"}
          onToggle={() => toggleSection("benefits")}
          colors={colors}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefitsOfAttending.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: index * 0.04,
                }}
                className="rounded-xl border bg-white p-6"
                style={{
                  borderColor: colors.sectionBorder,
                }}
              >
                <Award
                  size={21}
                  style={{
                    color: colors.primary,
                  }}
                />

                <h3
                  className="mt-4 text-sm font-bold md:text-base"
                  style={{
                    color: colors.miniTitle,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="mt-3 text-sm leading-6"
                  style={{
                    color: colors.aboutBody,
                  }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </AccordionSection>
      )}

      {/* =====================================================
          DELEGATES
      ===================================================== */}

      {delegates.length > 0 && (
        <AccordionSection
          id="delegates"
          title="Delegate Benefits"
          label="For Delegates"
          icon={<Users size={18} />}
          open={openSection === "delegates"}
          onToggle={() => toggleSection("delegates")}
          colors={colors}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {delegates.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border p-5"
                style={{
                  borderColor: colors.topicBorder,
                }}
              >
                <div className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 flex-shrink-0"
                    style={{
                      color: colors.primary,
                    }}
                  />

                  <div>
                    <h3
                      className="text-sm font-bold md:text-base"
                      style={{
                        color: colors.miniTitle,
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="mt-2 text-sm leading-6"
                      style={{
                        color: colors.aboutBody,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>
      )}

      {/* =====================================================
          POSTER PRESENTERS
      ===================================================== */}

      {posterPresentersLive.length > 0 && (
        <AccordionSection
          id="poster"
          title="Poster Presenters"
          label="Poster Presentation"
          icon={<Presentation size={18} />}
          open={openSection === "poster"}
          onToggle={() => toggleSection("poster")}
          colors={colors}
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3
                className="text-xl font-bold"
                style={{
                  color: colors.miniTitle,
                }}
              >
                Live Poster Presenters
              </h3>

              <div className="mt-5 space-y-3">
                {posterPresentersLive.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border bg-white p-4"
                    style={{
                      borderColor: colors.topicBorder,
                    }}
                  >
                    <Presentation
                      size={18}
                      className="mt-0.5 flex-shrink-0"
                      style={{
                        color: colors.primary,
                      }}
                    />

                    <p
                      className="text-sm leading-6 md:text-base"
                      style={{
                        color: colors.aboutBody,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3
                className="text-xl font-bold"
                style={{
                  color: colors.miniTitle,
                }}
              >
                E-Poster Presenters
              </h3>

              <div className="mt-5 space-y-4">
                {ePosterPresenters.benefits?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-1 flex-shrink-0"
                        style={{
                          color: colors.primary,
                        }}
                      />

                      <p
                        className="text-sm leading-6 md:text-base"
                        style={{
                          color: colors.aboutBody,
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </AccordionSection>
      )}

      {/* =====================================================
          E-POSTER GUIDELINES
      ===================================================== */}

      {ePosterPresenters.specifications && (
        <AccordionSection
          id="eposter-guidelines"
          title="E-Poster Guidelines"
          label="Submission Guidelines"
          icon={<FileText size={18} />}
          open={openSection === "eposter-guidelines"}
          onToggle={() =>
            toggleSection("eposter-guidelines")
          }
          colors={colors}
        >
          <p
            className="max-w-5xl text-sm leading-7 md:text-base md:leading-8"
            style={{
              color: colors.aboutBody,
            }}
          >
            {ePosterPresenters.guidelinesIntro}
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {/* SPECIFICATIONS */}

            <div
              className="rounded-xl border p-6"
              style={{
                borderColor: colors.sectionBorder,
              }}
            >
              <h3
                className="text-base font-bold"
                style={{
                  color: colors.miniTitle,
                }}
              >
                Specifications
              </h3>

              <div className="mt-5 space-y-3">
                {Object.entries(
                  ePosterPresenters.specifications,
                ).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-4 border-b pb-3"
                    style={{
                      borderColor: colors.rowBorder,
                    }}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: colors.aboutBody,
                      }}
                    >
                      {key}
                    </span>

                    <span
                      className="text-right text-sm font-bold"
                      style={{
                        color: colors.primary,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* POSTER CONTENT */}

            <div
              className="rounded-xl border p-6"
              style={{
                borderColor: colors.sectionBorder,
              }}
            >
              <h3
                className="text-base font-bold"
                style={{
                  color: colors.miniTitle,
                }}
              >
                Poster Content
              </h3>

              <div className="mt-5 space-y-3">
                {ePosterPresenters.posterContent?.map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-1 flex-shrink-0"
                        style={{
                          color: colors.primary,
                        }}
                      />

                      <span
                        className="text-sm leading-6"
                        style={{
                          color: colors.aboutBody,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* DESIGN */}

            <div
              className="rounded-xl border p-6"
              style={{
                borderColor: colors.sectionBorder,
              }}
            >
              <h3
                className="text-base font-bold"
                style={{
                  color: colors.miniTitle,
                }}
              >
                Design Requirements
              </h3>

              <div className="mt-5 space-y-3">
                {ePosterPresenters.designRequirements?.map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-1 flex-shrink-0"
                        style={{
                          color: colors.primary,
                        }}
                      />

                      <span
                        className="text-sm leading-6"
                        style={{
                          color: colors.aboutBody,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* ADDITIONAL GUIDELINES */}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <GuidelineList
              title="Submission Guidelines"
              items={ePosterPresenters.submissionGuidelines}
              colors={colors}
            />

            <GuidelineList
              title="Review & Acceptance"
              items={ePosterPresenters.reviewAndAcceptance}
              colors={colors}
            />

            <GuidelineList
              title="Presentation"
              items={ePosterPresenters.presentation}
              colors={colors}
            />

            <GuidelineList
              title="Certificate"
              items={ePosterPresenters.certificate}
              colors={colors}
            />
          </div>
        </AccordionSection>
      )}

      {/* =====================================================
          MARKET ANALYSIS
      ===================================================== */}

      {marketAnalysis?.paragraphs?.length > 0 && (
        <AccordionSection
          id="market-analysis"
          title={marketAnalysis.heading || "Market Analysis"}
          label="Market Analysis"
          icon={<Globe2 size={18} />}
          open={openSection === "market-analysis"}
          onToggle={() => toggleSection("market-analysis")}
          colors={colors}
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <div className="space-y-5">
                {marketAnalysis.paragraphs.map(
                  (paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-7 md:text-base md:leading-8"
                      style={{
                        color: colors.aboutBody,
                      }}
                    >
                      {paragraph}
                    </p>
                  ),
                )}
              </div>
            </div>

            {marketAnalysis.image && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: 25,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
              >
                <img
                  src={marketAnalysis.image}
                  alt="Market Analysis"
                  className="h-[360px] w-full rounded-2xl object-cover shadow-xl"
                />
              </motion.div>
            )}
          </div>
        </AccordionSection>
      )}

      {/* =====================================================
          SPONSORS - SEPARATE SECTION
          NOT AN ACCORDION
      ===================================================== */}

      {conference.sponsors?.length > 0 && (
        <section
          className="border-t bg-white px-6 pb-24 pt-20 lg:px-10 lg:pb-28 lg:pt-24"
          style={{
            borderColor: "#E5E7EB",
          }}
        >
          <div className="mx-auto max-w-7xl">
            {/* CENTER HEADING */}

            <motion.div
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
              }}
              transition={{
                duration: 0.7,
              }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="h-[2px] w-10 bg-violet-600" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                  Partners & Sponsors
                </span>

                <span className="h-[2px] w-10 bg-violet-600" />
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
                Media Partners, Collaborators & Sponsors
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
                We gratefully acknowledge our media partners,
                collaborators, and sponsors supporting this
                conference.
              </p>
            </motion.div>

            {/* SPONSOR LOGOS */}

            <motion.div
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
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
              }}
              className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            >
              {conference.sponsors.map((logo, index) => (
                <motion.div
                  key={`${logo}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="group flex h-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-md"
                >
                  <img
                    src={logo}
                    alt={`Sponsor ${index + 1}`}
                    className="max-h-20 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* =====================================================
          EXTRA SPACE BEFORE FOOTER
      ===================================================== */}

      <div className="h-10 bg-white md:h-14" />
    </div>
  );
};

/* =========================================================
   ACCORDION SECTION
========================================================= */

const AccordionSection = ({
  id,
  title,
  label,
  icon,
  open,
  onToggle,
  colors,
  dark = false,
  children,
}) => {
  return (
    <section
      className="border-t px-6 py-4 lg:px-10"
      style={{
        backgroundColor: dark
          ? colors.finalBg
          : colors.sessionsBg,
        borderColor: dark
          ? "rgba(255,255,255,0.12)"
          : colors.sectionBorder,
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADING BUTTON */}

        <button
          type="button"
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-5 rounded-xl px-3 py-5 text-left transition-all duration-300"
          style={{
            backgroundColor: open
              ? dark
                ? "rgba(255,255,255,0.08)"
                : "#F3EEFF"
              : "transparent",
          }}
        >
          <div className="flex min-w-0 items-center gap-4">
            {/* ICON */}

            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: dark
                  ? "rgba(255,255,255,0.10)"
                  : colors.quoteBg,
                color: dark
                  ? colors.finalIcon
                  : colors.primary,
              }}
            >
              {icon}
            </div>

            {/* TITLE */}

            <div className="min-w-0">
              <p
                className="text-[9px] font-bold uppercase tracking-[0.16em]"
                style={{
                  color: dark
                    ? "#D8B4FE"
                    : colors.primary,
                }}
              >
                {label}
              </p>

              <h2
                className="mt-1 text-lg font-bold md:text-xl lg:text-2xl"
                style={{
                  color: dark
                    ? "#FFFFFF"
                    : colors.headingAccent,
                }}
              >
                {title}
              </h2>
            </div>
          </div>

          {/* PLUS / MINUS */}

          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
            style={{
              backgroundColor: open
                ? colors.primary
                : dark
                  ? "rgba(255,255,255,0.10)"
                  : colors.quoteBg,
              color: open
                ? "#FFFFFF"
                : dark
                  ? "#D8B4FE"
                  : colors.primary,
            }}
          >
            {open ? <Minus size={18} /> : <Plus size={18} />}
          </div>
        </button>

        {/* CONTENT */}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key={id}
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
                ease: "easeInOut",
              }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-8 pt-3">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

/* =========================================================
   PREMIUM COUNTDOWN BOX
========================================================= */

const PremiumCountdownBox = ({
  value,
  label,
  colors,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-md border px-2 py-2 text-center transition-all duration-300"
      style={{
        borderColor: hovered
          ? colors.countdownBoxHoverBorder
          : colors.countdownBoxBorder,

        backgroundColor: hovered
          ? "rgba(255,255,255,0.11)"
          : colors.countdownBoxBg,

        boxShadow: hovered
          ? `0 5px 12px ${colors.primary}35`
          : "none",
      }}
    >
      <div
        className="absolute left-1/2 top-0 h-0.5 w-6 -translate-x-1/2 rounded-b-full"
        style={{
          backgroundColor: colors.primary,
        }}
      />

      <span
        className="block text-xl font-extrabold leading-none tracking-tight"
        style={{
          color: colors.countdownNumber,
        }}
      >
        {String(value).padStart(2, "0")}
      </span>

      <span
        className="mt-1 block text-[8px] font-bold uppercase tracking-[0.08em]"
        style={{
          color: colors.countdownLabel,
        }}
      >
        {label}
      </span>
    </motion.div>
  );
};

/* =========================================================
   PREMIUM ACTION BUTTON
========================================================= */

const PremiumActionButton = ({
  icon,
  text,
  description,
  onClick,
  primary = false,
  colors,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      whileHover={{
        y: -1,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex min-h-[50px] max-w-[240px] items-center gap-2 overflow-hidden rounded-md border px-3 py-2.5 text-left backdrop-blur-md transition-all duration-300"
      style={{
        borderColor: primary
          ? hovered
            ? colors.primaryHover
            : colors.primary
          : hovered
            ? colors.primary
            : colors.actionBorder,

        backgroundColor: primary
          ? hovered
            ? colors.primaryHover
            : colors.primary
          : hovered
            ? "rgba(255,255,255,0.13)"
            : colors.actionBg,

        boxShadow: primary
          ? `0 6px 16px ${colors.primary}35`
          : hovered
            ? `0 5px 12px ${colors.primary}20`
            : "0 2px 5px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md"
        style={{
          backgroundColor: primary
            ? "rgba(255,255,255,0.15)"
            : hovered
              ? colors.primary
              : colors.actionIconBg,

          color: primary
            ? "#FFFFFF"
            : hovered
              ? "#FFFFFF"
              : colors.actionIcon,
        }}
      >
        {icon}
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <p
          className="text-xs font-bold leading-4"
          style={{
            color: "#FFFFFF",
          }}
        >
          {text}
        </p>

        <p
          className="mt-0.5 text-[8px] leading-3"
          style={{
            color: primary
              ? "rgba(255,255,255,0.72)"
              : colors.actionDescription,
          }}
        >
          {description}
        </p>
      </div>

      <ArrowRight
        size={13}
        className="relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        style={{
          color: primary
            ? "#FFFFFF"
            : hovered
              ? "#FFFFFF"
              : colors.primary,
        }}
      />
    </motion.button>
  );
};

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  icon,
  title,
  subtitle,
  colors,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: colors.infoIconBg,
          color: colors.infoIcon,
        }}
      >
        {icon}
      </div>

      <div>
        <p
          className="text-xs font-bold"
          style={{
            color: colors.infoTitle,
          }}
        >
          {title}
        </p>

        <p
          className="mt-0.5 text-[9px]"
          style={{
            color: colors.muted,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION LABEL
========================================================= */

const SectionLabel = ({
  label,
  colors,
}) => {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-[2px] w-8"
        style={{
          backgroundColor: colors.primary,
        }}
      />

      <span
        className="text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{
          color: colors.primary,
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* =========================================================
   SECTION HEADING
========================================================= */

const SectionHeading = ({
  label,
  action,
  colors,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <span
          className="h-[2px] w-8"
          style={{
            backgroundColor: colors.primary,
          }}
        />

        <h2
          className="text-xl font-bold md:text-2xl"
          style={{
            color: colors.headingAccent,
          }}
        >
          {label}
        </h2>
      </div>

      {action && (
        <span
          className="hidden items-center gap-1 text-xs font-semibold sm:flex"
          style={{
            color: colors.primary,
          }}
        >
          {action}
          <ArrowRight size={14} />
        </span>
      )}
    </div>
  );
};

/* =========================================================
   GUIDELINE LIST
========================================================= */

const GuidelineList = ({
  title,
  items,
  colors,
}) => {
  if (!items?.length) return null;

  return (
    <div
      className="rounded-xl border bg-white p-6"
      style={{
        borderColor: colors.sectionBorder,
      }}
    >
      <h3
        className="text-base font-bold"
        style={{
          color: colors.miniTitle,
        }}
      >
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            <CheckCircle2
              size={17}
              className="mt-1 flex-shrink-0"
              style={{
                color: colors.primary,
              }}
            />

            <p
              className="text-sm leading-6"
              style={{
                color: colors.aboutBody,
              }}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConferenceDetails;