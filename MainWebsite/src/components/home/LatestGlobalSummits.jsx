
import React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
} from "lucide-react";

const LatestGlobalSummits = () => {
  const conferences = [
    {
      title: "Mental Health & Psychiatry",
      date: "September 17–18, 2026",
      type: "Webinar",
      location: "Online",
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Endocrine & Metabolic Innovation",
      date: "October 08–09, 2026",
      type: "Webinar",
      location: "Online",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Food, Nutrition & Wellness",
      date: "September 17–18, 2026",
      type: "Webinar",
      location: "Online",
      image:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Autism Research",
      date: "September 17–18, 2026",
      type: "Webinar",
      location: "Online",
      image:
        "https://images.unsplash.com/photo-1608493830924-ec843d9c98c6?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const colors = {
    sectionBg: "#F9FAFB",

    heading: "#111827",
    bodyText: "#4B5563",
    secondaryText: "#6B7280",

    brand: "#7C3AED",
    brandDark: "#6D28D9",

    cardBg: "#FFFFFF",
    cardBorder: "#E5E7EB",
    cardTitle: "#111827",
    cardMeta: "#6B7280",

    badgeBg: "#7C3AED",

    typeBg: "#F5F3FF",
    typeText: "#7C3AED",

    cardShadow: "0 4px 16px rgba(124,58,237,0.05)",
    cardHoverShadow: "0 14px 30px rgba(124,58,237,0.15)",
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 30,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 35,
      scale: 0.97,
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="latest-global-summits"
      className="
        relative
        overflow-hidden
        py-14
        transition-colors
        duration-500
        sm:py-16
        lg:py-20
      "
      style={{
        backgroundColor: colors.sectionBg,
      }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Introduction */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={{
            hidden: {},

            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="max-w-6xl"
        >
          {/* Violet Line */}
          <motion.div
            variants={fadeUp}
            className="mb-3"
          >
            <span
              className="inline-block h-[3px] w-9 rounded-full transition-colors duration-500"
              style={{
                backgroundColor: colors.brand,
              }}
            />
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="
              text-2xl
              font-bold
              leading-tight
              tracking-tight
              transition-colors
              duration-500
              sm:text-3xl
              lg:text-[36px]
            "
            style={{
              color: colors.heading,
            }}
          >
            Conferences & Scientific Summits 2026 – At a Glance
          </motion.h2>

          {/* Paragraphs */}
          <motion.div
            variants={{
              hidden: {},

              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="mt-5 max-w-5xl space-y-3"
          >
            <motion.p
              variants={fadeUp}
              className="
                text-sm
                leading-7
                transition-colors
                duration-500
                sm:text-[15px]
              "
              style={{
                color: colors.bodyText,
              }}
            >
              Our conferences offer a direct gateway to connect with global
              leaders, present cutting-edge research, and engage in high-level
              academic dialogue.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="
                text-sm
                leading-7
                transition-colors
                duration-500
                sm:text-[15px]
              "
              style={{
                color: colors.bodyText,
              }}
            >
              Gain insights from distinguished speakers, explore the latest
              research trends, and expand your professional network in a truly
              international setting.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="
                text-sm
                leading-7
                transition-colors
                duration-500
                sm:text-[15px]
              "
              style={{
                color: colors.bodyText,
              }}
            >
              Each GlobalScion event is carefully curated to spark meaningful
              discussions—bringing together experts, early-career researchers,
              and practitioners for vibrant, idea-driven exchanges that push
              the boundaries of science and innovation.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Cards Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={{
            hidden: {},

            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="mt-10 flex items-end justify-between gap-5"
        >
          <div>

            {/* Violet Line */}
            <motion.div
              variants={fadeUp}
              className="mb-2"
            >
              <span
                className="inline-block h-[3px] w-8 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: colors.brand,
                }}
              />
            </motion.div>

            {/* Heading */}
            <motion.h3
              variants={fadeUp}
              className="
                text-2xl
                font-bold
                tracking-tight
                transition-colors
                duration-500
                sm:text-[28px]
              "
              style={{
                color: colors.heading,
              }}
            >
              Latest Global Summits
            </motion.h3>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="
                mt-1.5
                text-sm
                transition-colors
                duration-500
              "
              style={{
                color: colors.secondaryText,
              }}
            >
              Explore our upcoming conferences and scientific events.
            </motion.p>
          </div>

          {/* Desktop View All */}
          <motion.a
            variants={fadeUp}
            href="/conferences"
            whileHover={{
              x: 4,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              hidden
              shrink-0
              items-center
              gap-1.5
              text-sm
              font-semibold
              transition-colors
              duration-300
              sm:flex
            "
            style={{
              color: colors.brand,
            }}
          >
            View All Conferences

            <ArrowRight size={15} />
          </motion.a>
        </motion.div>

        {/* Conference Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          variants={{
            hidden: {},

            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {conferences.map((conference) => (
            <motion.article
              key={conference.title}
              variants={cardAnimation}
              whileHover={{
                y: -6,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="
                group
                overflow-hidden
                rounded-xl
                border
                transition-all
                duration-500
              "
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
                boxShadow: colors.cardShadow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  colors.cardHoverShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  colors.cardShadow;
              }}
            >

              {/* Image */}
              <div className="relative h-[135px] overflow-hidden">
                <motion.img
                  src={conference.image}
                  alt={conference.title}
                  whileHover={{
                    scale: 1.07,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full w-full object-cover"
                />

                {/* Upcoming Badge */}
                <motion.span
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                  }}
                  className="
                    absolute
                    left-2.5
                    top-2.5
                    rounded-full
                    px-2.5
                    py-1
                    text-[9px]
                    font-semibold
                    text-white
                    shadow-sm
                    transition-colors
                    duration-500
                  "
                  style={{
                    backgroundColor: colors.badgeBg,
                  }}
                >
                  Upcoming
                </motion.span>
              </div>

              {/* Card Content */}
              <div className="p-3.5">

                {/* Title */}
                <h4
                  className="
                    min-h-[42px]
                    text-[12px]
                    font-bold
                    leading-[1.45]
                    transition-colors
                    duration-500
                  "
                  style={{
                    color: colors.cardTitle,
                  }}
                >
                  {conference.title}
                </h4>

                {/* Date */}
                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-1.5
                    text-[10px]
                    transition-colors
                    duration-500
                  "
                  style={{
                    color: colors.cardMeta,
                  }}
                >
                  <CalendarDays
                    size={12}
                    strokeWidth={2}
                    className="shrink-0"
                    style={{
                      color: colors.brand,
                    }}
                  />

                  <span>{conference.date}</span>
                </div>

                {/* Location */}
                <div
                  className="
                    mt-1.5
                    flex
                    items-center
                    gap-1.5
                    text-[10px]
                    transition-colors
                    duration-500
                  "
                  style={{
                    color: colors.cardMeta,
                  }}
                >
                  <MapPin
                    size={12}
                    strokeWidth={2}
                    className="shrink-0"
                    style={{
                      color: colors.brand,
                    }}
                  />

                  <span>{conference.location}</span>
                </div>

                {/* Type */}
                <div className="mt-2.5">
                  <span
                    className="
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-[9px]
                      font-medium
                      transition-all
                      duration-500
                    "
                    style={{
                      backgroundColor: colors.typeBg,
                      color: colors.typeText,
                    }}
                  >
                    {conference.type}
                  </span>
                </div>

                {/* View Details */}
                <a
                  href="/conferences"
                  className="
                    mt-3
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-full
                    px-3
                    py-2
                    text-[10px]
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                  "
                  style={{
                    backgroundColor: colors.brand,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.brandDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.brand;
                  }}
                >
                  View Details

                  <ArrowRight
                    size={12}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                    "
                  />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Mobile View All */}
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
            amount: 0.2,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mt-6 sm:hidden"
        >
          <a
            href="/conferences"
            className="
              flex
              items-center
              gap-1.5
              text-sm
              font-semibold
              transition-colors
              duration-500
            "
            style={{
              color: colors.brand,
            }}
          >
            View All Conferences

            <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestGlobalSummits;
