
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Monitor } from "lucide-react";

const conferences = [
  {
    title:
      "International Conference on Autism Research and Innovations",
    date: "September 17–18, 2026",
    type: "Webinar",
    image: "/images/conference-hero.png",
  },
  {
    title:
      "International Conference on Mental Health & Psychiatry",
    date: "October 10–11, 2026",
    type: "Hybrid",
    image: "/images/conference-hero.png",
  },
  {
    title:
      "World Congress on Oncology Research & AI Innovations",
    date: "November 5–6, 2026",
    type: "In Person",
    image: "/images/conference-hero.png",
  },
  {
    title:
      "World Congress on Healthcare Innovation, Precision Medicine and Artificial Intelligence",
    date: "December 12–13, 2026",
    type: "Hybrid",
    image: "/images/conference-hero.png",
  },
];

const Conferences = () => {
  const colors = {
    sectionBg: "#FFFFFF",
    label: "#7C3AED",
    heading: "#111827",
    description: "#4B5563",
    cardBg: "#FFFFFF",
    cardBorder: "#E5E7EB",
    date: "#7C3AED",
    title: "#111827",
    type: "#6B7280",
    buttonBg: "#7C3AED",
    buttonHover: "#6D28D9",
    outlineBorder: "#7C3AED",
    outlineText: "#7C3AED",
    outlineHoverBg: "#F5F3FF",
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 25,
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
      id="conferences"
      className="
        relative
        overflow-hidden
        py-10
        sm:py-14
        transition-colors
        duration-500
      "
      style={{
        backgroundColor: colors.sectionBg,
      }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
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
          className="text-center"
        >
          <motion.p
            variants={fadeUp}
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wider
              transition-colors
              duration-500
            "
            style={{
              color: colors.label,
            }}
          >
            Our Events
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="
              mt-3
              text-4xl
              font-bold
              transition-colors
              duration-500
            "
            style={{
              color: colors.heading,
            }}
          >
            Upcoming Conferences
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="
              mx-auto
              mt-4
              max-w-2xl
              transition-colors
              duration-500
            "
            style={{
              color: colors.description,
            }}
          >
            Explore our upcoming international conferences and connect
            with researchers, professionals, and industry leaders.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
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
            mt-8
            grid
            gap-5
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {conferences.map((conference, index) => (
            <motion.div
              key={index}
              variants={cardAnimation}
              whileHover={{
                y: -4,
                transition: {
                  duration: 0.2,
                },
              }}
              className="
                group
                overflow-hidden
                rounded-xl
                border
                transition-all
                duration-300
              "
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
                boxShadow: "0 4px 16px rgba(124,58,237,0.06)",
              }}
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={conference.image}
                  alt={conference.title}
                  className="
                    h-36
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                  style={{
                    background:
                      "linear-gradient(to top, rgba(124,58,237,0.20), transparent)",
                  }}
                />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={13}
                    strokeWidth={2}
                    style={{
                      color: colors.date,
                    }}
                  />

                  <p
                    className="
                      text-xs
                      font-semibold
                      transition-colors
                      duration-500
                    "
                    style={{
                      color: colors.date,
                    }}
                  >
                    {conference.date}
                  </p>
                </div>

                <h3
                  className="
                    mt-2
                    min-h-[52px]
                    text-base
                    font-bold
                    leading-6
                    line-clamp-2
                    transition-colors
                    duration-500
                  "
                  style={{
                    color: colors.title,
                  }}
                >
                  {conference.title}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <Monitor
                    size={13}
                    strokeWidth={2}
                    style={{
                      color: colors.type,
                    }}
                  />

                  <p
                    className="
                      text-xs
                      transition-colors
                      duration-500
                    "
                    style={{
                      color: colors.type,
                    }}
                  >
                    {conference.type}
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    px-3
                    py-2.5
                    text-xs
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                  "
                  style={{
                    backgroundColor: colors.buttonBg,
                    boxShadow: "0 4px 14px rgba(124,58,237,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.buttonHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.buttonBg;
                  }}
                >
                  View Conference

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
            amount: 0.2,
          }}
          transition={{
            duration: 0.65,
            delay: 0.15,
          }}
          className="mt-10 text-center"
        >
          <button
            type="button"
            className="
              inline-flex
              items-center
              gap-2
              rounded-md
              border
              px-7
              py-3
              text-sm
              font-semibold
              transition-all
              duration-300
              hover:-translate-y-0.5
            "
            style={{
              borderColor: colors.outlineBorder,
              color: colors.outlineText,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                colors.outlineHoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "transparent";
            }}
          >
            View All Conferences

            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Conferences;
