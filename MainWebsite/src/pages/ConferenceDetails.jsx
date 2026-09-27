import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Download,
  CheckCircle2,
  ChevronDown,
  Brain,
  Globe2,
  Lightbulb,
  HeartHandshake,
  FileText,
  UserPlus,
  BookOpen,
  Clock3,
} from "lucide-react";

import conferences from "../../data/conferences";

const ConferenceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const conference = conferences.find((item) => item.id === id);

  const [openTrack, setOpenTrack] = useState(0);

  const colors = {
    pageBg: "#FFFFFF",
    text: "#111827",

    heroBg: "#12091F",

    link: "#C084FC",
    linkHover: "#FFFFFF",

    categoryBg: "rgba(124,58,237,0.24)",
    categoryText: "#E9D5FF",

    heading: "#FFFFFF",
    headingAccent: "#C084FC",
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
    countdownDecor: "rgba(168,85,247,0.16)",

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
    actionDecor: "rgba(168,85,247,0.12)",
    actionDescription: "rgba(255,255,255,0.60)",

    featuredBg: "#FFFFFF",
    sectionBorder: "#EDE9FE",

    speakerRing: "#D8B4FE",
    speakerName: "#2E1065",
    speakerOrg: "#6B7280",
    speakerSpecialty: "#7C3AED",

    aboutBg: "#F8F7FF",
    aboutBody: "#5B6475",
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
    whyText: "#5B6475",
    benefitBorder: "#C4B5FD",

    sessionsBg: "#F8F7FF",
    accordionBg: "#FFFFFF",
    accordionBorder: "#DDD6FE",
    rowBorder: "#E8E5F2",
    rowHover: "#FAF8FF",
    closedNumberBg: "#F0EAFE",
    trackTitle: "#35205F",
    trackDesc: "#6B7280",

    finalBg: "#4C1D95",
    finalIconBg: "rgba(255,255,255,0.10)",
    finalIcon: "#DDD6FE",
  };

  /* =========================================================
     DYNAMIC COUNTDOWN
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
      console.error("Invalid conference startDate:", conference.startDate);

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
    if (!conference?.startDate) {
      return;
    }

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
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
            className="mt-2 text-sm"
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
        {/* HERO IMAGE */}

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

        {/* DECORATIVE ELEMENTS */}

        <div
          className="absolute right-[8%] top-10 h-14 w-14 rounded-full border"
          style={{
            borderColor: "rgba(216,180,254,0.16)",
          }}
        />

        <div
          className="absolute right-[15%] bottom-10 h-7 w-7 rounded-full"
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
          {/* BACK */}

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

            <motion.span
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
              }}
              className="inline-flex rounded-full border px-2.5 py-1 text-[8px] font-bold backdrop-blur-md"
              style={{
                backgroundColor: colors.categoryBg,
                borderColor: "rgba(216,180,254,0.25)",
                color: colors.categoryText,
              }}
            >
              {conference.category}
            </motion.span>

            {/* TITLE */}

            <motion.h1
              className="mt-2 max-w-3xl text-xl font-extrabold leading-[1.05] tracking-tight sm:text-2xl lg:text-3xl xl:text-4xl"
              style={{
                color: colors.heading,
                textShadow: "0 4px 20px rgba(0,0,0,0.45)",
              }}
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
                delay: 0.1,
              }}
            >
              {conference.title}
            </motion.h1>

            {/* SUBTITLE */}

            <motion.p
              className="mt-2 max-w-2xl text-[11px] font-semibold leading-4 sm:text-xs"
              style={{
                color: colors.subtitle,
              }}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
            >
              {conference.subtitle}
            </motion.p>

            {/* DESCRIPTION */}

            <motion.p
              className="mt-1 max-w-2xl text-[9px] leading-4 sm:text-[10px]"
              style={{
                color: colors.description,
              }}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
            >
              {conference.description}
            </motion.p>

            {/* INFO */}

            <motion.div
              className="mt-3 grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-3"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.3,
              }}
            >
              <InfoItem
                icon={<CalendarDays size={15} />}
                title={conference.date}
                subtitle={conference.time}
                colors={colors}
              />

              <InfoItem
                icon={<MapPin size={15} />}
                title={conference.location}
                subtitle={conference.mode}
                colors={colors}
              />

              <InfoItem
                icon={<Users size={15} />}
                title={conference.participants}
                subtitle="Expected Participants"
                colors={colors}
              />
            </motion.div>

            {/* =================================================
                COUNTDOWN
            ================================================= */}

            <motion.div
              className="mt-3 max-w-xl"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.35,
              }}
            >
              <div className="mb-1.5 flex items-center gap-1.5">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-md text-white"
                  style={{
                    backgroundColor: colors.countdownIconBg,
                  }}
                >
                  <Clock3 size={11} />
                </div>

                <p
                  className="text-[8px] font-bold uppercase tracking-[0.15em]"
                  style={{
                    color: colors.countdownHeading,
                  }}
                >
                  Conference Starts In
                </p>
              </div>

              <div
                className="relative overflow-hidden rounded-lg border p-1.5 backdrop-blur-xl"
                style={{
                  borderColor: colors.countdownCardBorder,
                  backgroundColor: colors.countdownCardBg,
                  boxShadow: colors.countdownCardShadow,
                }}
              >
                <div
                  className="absolute -right-6 -top-6 h-14 w-14 rounded-full"
                  style={{
                    backgroundColor: colors.countdownDecor,
                  }}
                />

                {/* 4 COUNTDOWN BOXES */}

                <div className="relative grid grid-cols-4 gap-1.5">
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

            <motion.div
              className="mt-3 max-w-2xl"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.4,
              }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <p
                  className="text-[8px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  Conference Actions
                </p>

                <span
                  className="hidden text-[8px] font-medium sm:block"
                  style={{
                    color: "rgba(255,255,255,0.60)",
                  }}
                >
                  Explore & participate
                </span>
              </div>

              <div className="grid max-w-lg grid-cols-1 gap-1.5 sm:grid-cols-2">
                <PremiumActionButton
                  icon={<Download size={14} />}
                  text="Download Brochure"
                  description="Conference details"
                  colors={colors}
                  primary={false}
                  onClick={() =>
                    navigate(`/conferences/${conference.id}/brochure`)
                  }
                />

                <PremiumActionButton
                  icon={<FileText size={14} />}
                  text="Abstract Submission"
                  description="Submit your research"
                  colors={colors}
                  primary={false}
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
                    navigate(`/conferences/${conference.id}/register`)
                  }
                />

                <PremiumActionButton
                  icon={<BookOpen size={14} />}
                  text="Scientific Program"
                  description="View full program"
                  colors={colors}
                  primary={false}
                  onClick={() =>
                    navigate(`/conferences/${conference.id}/scientific-program`)
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
        className="border-b px-6 py-10 lg:px-10 lg:py-12"
        style={{
          borderColor: colors.sectionBorder,
          backgroundColor: colors.featuredBg,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            label="Featured Speakers"
            action="View All Speakers"
            colors={colors}
          />

          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-8">
            {conference.speakers.map((speaker, index) => (
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
                <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
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
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-md"
                    style={{
                      borderColor: colors.featuredBg,
                      backgroundColor: colors.primary,
                    }}
                  >
                    <img
                      src="/svgs/linkedin.svg"
                      alt="LinkedIn"
                      className="h-3 w-3"
                    />
                  </a>
                </div>

                <h3
                  className="mt-3 text-[11px] font-bold leading-4 sm:text-xs"
                  style={{
                    color: colors.speakerName,
                  }}
                >
                  {speaker.name}
                </h3>

                <p
                  className="mt-1 text-[9px] leading-3.5 sm:text-[10px]"
                  style={{
                    color: colors.speakerOrg,
                  }}
                >
                  {speaker.organization}
                </p>

                <p
                  className="mt-1 text-[9px] font-medium leading-3.5"
                  style={{
                    color: colors.speakerSpecialty,
                  }}
                >
                  {speaker.specialty}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT CONFERENCE
      ===================================================== */}

      <section
        className="px-6 py-12 lg:px-10 lg:py-14"
        style={{
          backgroundColor: colors.aboutBg,
        }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[0.75fr_1.15fr_0.65fr]">
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
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
              src={conference.aboutImage}
              alt="Conference"
              className="h-[330px] w-full rounded-2xl object-cover shadow-xl"
            />
          </motion.div>

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
            <SectionLabel label="About the Conference" colors={colors} />

            <h2
              className="mt-3 text-2xl font-bold leading-tight md:text-3xl"
              style={{
                color: colors.headingAccent,
              }}
            >
              Building a More
              <br />
              Connected Future
            </h2>

            <p
              className="mt-4 text-xs leading-6 md:text-sm"
              style={{
                color: colors.aboutBody,
              }}
            >
              {conference.about}
            </p>

            <p
              className="mt-3 text-xs leading-6 md:text-sm"
              style={{
                color: colors.aboutBody,
              }}
            >
              {conference.aboutSecond}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <MiniFeature
                icon={<Lightbulb size={16} />}
                title="Expert Insights"
                text="Global leaders"
                colors={colors}
              />

              <MiniFeature
                icon={<Globe2 size={16} />}
                title="Networking"
                text="Build connections"
                colors={colors}
              />

              <MiniFeature
                icon={<HeartHandshake size={16} />}
                title="Real Impact"
                text="Better outcomes"
                colors={colors}
              />
            </div>
          </motion.div>

          <motion.div
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
            className="rounded-2xl p-6"
            style={{
              backgroundColor: colors.quoteBg,
            }}
          >
            <div
              className="text-4xl font-serif"
              style={{
                color: colors.quoteMark,
              }}
            >
              “
            </div>

            <p
              className="mt-1 text-base font-medium italic leading-7"
              style={{
                color: colors.quoteText,
              }}
            >
              {conference.quote}
            </p>

            <div
              className="mt-5 h-px"
              style={{
                backgroundColor: colors.quoteDivider,
              }}
            />

            <p
              className="mt-3 text-[10px] font-bold uppercase tracking-wider"
              style={{
                color: colors.primary,
              }}
            >
              GlobalScion
            </p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          KEY TOPICS
      ===================================================== */}

      <section
        className="px-6 py-12 lg:px-10 lg:py-14"
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

          <div className="mt-7 grid grid-cols-1 gap-x-14 md:grid-cols-2">
            {conference.topics.map((topic, index) => (
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
                className="flex items-start gap-3 border-b py-2.5"
                style={{
                  borderColor: colors.topicBorder,
                }}
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 flex-shrink-0"
                  style={{
                    color: colors.primary,
                  }}
                />

                <span
                  className="text-xs leading-5"
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
          WHY ATTEND
      ===================================================== */}

      <section
        className="px-6 pb-12 lg:px-10 lg:pb-14"
        style={{
          backgroundColor: colors.pageBg,
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl px-6 py-8 md:px-9 md:py-9"
          style={{
            backgroundColor: colors.whyBg,
          }}
        >
          <div
            className="absolute -right-14 -top-14 h-36 w-36 rounded-full"
            style={{
              backgroundColor: colors.whyDecor1,
            }}
          />

          <div
            className="absolute -bottom-16 -left-8 h-32 w-32 rounded-full"
            style={{
              backgroundColor: colors.whyDecor2,
            }}
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1fr_auto]">
            <div>
              <div className="flex items-center gap-2">
                <HeartHandshake
                  size={17}
                  style={{
                    color: colors.primary,
                  }}
                />

                <span
                  className="text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{
                    color: colors.primary,
                  }}
                >
                  Why Attend?
                </span>
              </div>

              <h2
                className="mt-2 text-xl font-bold leading-tight md:text-2xl"
                style={{
                  color: colors.headingAccent,
                }}
              >
                More than a Conference
                <br />— It's a Global Community
              </h2>

              <p
                className="mt-3 max-w-md text-xs leading-5"
                style={{
                  color: colors.whyText,
                }}
              >
                Join researchers, professionals, innovators and experts from
                around the world.
              </p>
            </div>

            <div
              className="space-y-3 lg:border-l lg:pl-8"
              style={{
                borderColor: colors.benefitBorder,
              }}
            >
              <Benefit
                text="Learn from world-renowned experts"
                colors={colors}
              />

              <Benefit text="Discover emerging research" colors={colors} />

              <Benefit
                text="Build professional collaborations"
                colors={colors}
              />

              <Benefit text="Be part of a global community" colors={colors} />
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  navigate(`/conferences/${conference.id}/register`)
                }
                className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold text-white shadow-lg transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: colors.primary,
                }}
              >
                Register Now
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          SESSIONS / TRACKS
      ===================================================== */}

      <section
        className="px-6 py-12 lg:px-10"
        style={{
          backgroundColor: colors.sessionsBg,
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="flex justify-center">
              <SectionLabel label="Conference Program" colors={colors} />
            </div>

            <h2
              className="mt-2 text-2xl font-bold md:text-3xl"
              style={{
                color: colors.headingAccent,
              }}
            >
              Sessions & Tracks
            </h2>

            <p
              className="mx-auto mt-3 max-w-2xl text-xs leading-5"
              style={{
                color: colors.trackDesc,
              }}
            >
              Explore the major scientific and professional themes covered
              during the conference.
            </p>
          </div>

          <div
            className="mt-7 overflow-hidden rounded-xl border"
            style={{
              borderColor: colors.accordionBorder,
              backgroundColor: colors.accordionBg,
            }}
          >
            {conference.tracks.map((track, index) => {
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
                    onClick={() => setOpenTrack(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors md:px-6"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.rowHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: isOpen
                            ? colors.primary
                            : colors.closedNumberBg,
                          color: isOpen ? "#FFFFFF" : colors.primary,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className="text-xs font-bold md:text-sm"
                        style={{
                          color: colors.trackTitle,
                        }}
                      >
                        {track.title}
                      </span>
                    </div>

                    <ChevronDown
                      size={17}
                      className={`flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      style={{
                        color: colors.primary,
                      }}
                    />
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="px-5 pb-5 pl-[60px] md:px-6 md:pl-[70px]"
                    >
                      <p
                        className="max-w-3xl text-xs leading-6"
                        style={{
                          color: colors.trackDesc,
                        }}
                      >
                        {track.description}
                      </p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

/* =========================================================
   PREMIUM COUNTDOWN BOX
========================================================= */

const PremiumCountdownBox = ({ value, label, colors }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-md border px-1.5 py-1.5 text-center transition-all duration-300"
      style={{
        borderColor: hovered
          ? colors.countdownBoxHoverBorder
          : colors.countdownBoxBorder,

        backgroundColor: hovered
          ? "rgba(255,255,255,0.11)"
          : colors.countdownBoxBg,

        boxShadow: hovered ? `0 5px 12px ${colors.primary}35` : "none",
      }}
    >
      <div
        className="absolute left-1/2 top-0 h-0.5 w-5 -translate-x-1/2 rounded-b-full"
        style={{
          backgroundColor: colors.primary,
        }}
      />

      <span
        className="block text-lg font-extrabold leading-none tracking-tight sm:text-xl"
        style={{
          color: colors.countdownNumber,
        }}
      >
        {String(value).padStart(2, "0")}
      </span>

      <span
        className="mt-1 block text-[7px] font-bold uppercase tracking-[0.08em] sm:text-[8px]"
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
      className="group relative flex min-h-[48px] max-w-[230px] items-center gap-2 overflow-hidden rounded-md border px-2.5 py-2 text-left backdrop-blur-md transition-all duration-300"
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
        className="absolute -right-4 -top-4 h-11 w-11 rounded-full transition-transform duration-300 group-hover:scale-150"
        style={{
          backgroundColor: primary
            ? "rgba(255,255,255,0.10)"
            : colors.actionDecor,
        }}
      />

      <div
        className="relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-all duration-300 group-hover:scale-105"
        style={{
          backgroundColor: primary
            ? "rgba(255,255,255,0.15)"
            : hovered
              ? colors.primary
              : colors.actionIconBg,

          color: primary ? "#FFFFFF" : hovered ? "#FFFFFF" : colors.actionIcon,
        }}
      >
        {icon}
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <p
          className="text-[9px] font-bold leading-3.5 sm:text-[14px]"
          style={{
            color: "#FFFFFF",
          }}
        >
          {text}
        </p>

        <p
          className="mt-0.5 text-[7px] leading-3 sm:text-[8px]"
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
        size={12}
        className="relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        style={{
          color: primary ? "#FFFFFF" : hovered ? "#FFFFFF" : colors.primary,
        }}
      />
    </motion.button>
  );
};

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({ icon, title, subtitle, colors }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: colors.infoIconBg,
          color: colors.infoIcon,
        }}
      >
        {icon}
      </div>

      <div>
        <p
          className="text-[10px] font-bold"
          style={{
            color: colors.infoTitle,
          }}
        >
          {title}
        </p>

        <p
          className="mt-0.5 text-[8px]"
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

const SectionLabel = ({ label, colors }) => {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-[2px] w-7"
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

const SectionHeading = ({ label, action, colors }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span
          className="h-[2px] w-7"
          style={{
            backgroundColor: colors.primary,
          }}
        />

        <h2
          className="text-lg font-bold md:text-xl"
          style={{
            color: colors.headingAccent,
          }}
        >
          {label}
        </h2>
      </div>

      {action && (
        <span
          className="hidden items-center gap-1 text-[10px] font-semibold sm:flex"
          style={{
            color: colors.primary,
          }}
        >
          {action}
          <ArrowRight size={13} />
        </span>
      )}
    </div>
  );
};

/* =========================================================
   MINI FEATURE
========================================================= */

const MiniFeature = ({ icon, title, text, colors }) => {
  return (
    <div
      className="flex items-start gap-1.5 border-r pr-2.5 last:border-r-0"
      style={{
        borderColor: colors.miniBorder,
      }}
    >
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white"
        style={{
          backgroundColor: colors.primary,
        }}
      >
        {icon}
      </div>

      <div>
        <p
          className="text-[9px] font-bold"
          style={{
            color: colors.miniTitle,
          }}
        >
          {title}
        </p>

        <p
          className="mt-0.5 text-[8px]"
          style={{
            color: "#6B7280",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   BENEFIT
========================================================= */

const Benefit = ({ text, colors }) => {
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg border p-2.5"
      style={{
        borderColor: colors.benefitBorder,
        backgroundColor: "#FFFFFF",
      }}
    >
      <CheckCircle2
        size={16}
        className="flex-shrink-0"
        style={{
          color: colors.primary,
        }}
      />

      <span
        className="text-xs font-medium"
        style={{
          color: colors.whyText,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default ConferenceDetails;
