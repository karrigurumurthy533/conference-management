
import React from "react";
import { motion } from "framer-motion";
import {
  FileCheck2,
  BookOpenCheck,
  CalendarCheck2,
  Megaphone,
  Handshake,
  ArrowRight,
} from "lucide-react";

const SupportServices = () => {
  const colors = {
    sectionBg: "#F9FAFB",
    headingBoxBg: "#1E1B4B",
    decorative: "#7C3AED",
    line: "#A855F7",
    heading: "#FFFFFF",
    headingDescription: "#DDD6FE",

    cardBg: "#FFFFFF",
    cardBorder: "#E5E7EB",
    cardBorderHover: "#DDD6FE",
    cardShadow: "0 5px 20px rgba(124,58,237,0.06)",
    cardHoverShadow: "0 16px 35px rgba(124,58,237,0.15)",

    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
    iconHoverBg: "#7C3AED",
    iconHoverColor: "#FFFFFF",
    iconShadow: "0 6px 16px rgba(124,58,237,0.15)",
    iconHoverShadow: "0 8px 20px rgba(124,58,237,0.25)",

    title: "#111827",
    description: "#4B5563",

    link: "#7C3AED",
    linkHover: "#6D28D9",
  };

  const services = [
    {
      icon: FileCheck2,
      title: "Abstract & Paper Management",
      description:
        "A streamlined submission and peer-review system.",
    },
    {
      icon: BookOpenCheck,
      title: "Publication Handling",
      description:
        "We manage everything from journal partnerships to conference proceedings.",
    },
    {
      icon: CalendarCheck2,
      title: "Event Planning & Execution",
      description:
        "From venue logistics to technical support for hybrid events.",
    },
    {
      icon: Megaphone,
      title: "Marketing & Promotion",
      description:
        "Targeted campaigns to maximize audience reach.",
    },
    {
      icon: Handshake,
      title: "Sponsorship & Exhibitor Opportunities",
      description:
        "Connect brands and companies with a global delegate base.",
    },
  ];

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
      id="support-services"
      className="py-8 transition-colors duration-500 sm:py-12"
      style={{
        backgroundColor: colors.sectionBg,
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Heading Area */}
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
          className="relative overflow-hidden rounded-2xl px-6 py-8 transition-colors duration-500 sm:px-8 sm:py-9 lg:px-10"
          style={{
            backgroundColor: colors.headingBoxBg,
          }}
        >
          {/* Decorative Background */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full blur-2xl"
            style={{
              backgroundColor: colors.decorative,
              opacity: 0.1,
            }}
          />

          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full blur-2xl"
            style={{
              backgroundColor: colors.decorative,
              opacity: 0.1,
            }}
          />

          <div className="relative max-w-4xl">

            {/* Line */}
            <motion.div
              variants={fadeUp}
              className="mb-4"
            >
              <span
                className="inline-block h-[3px] w-10 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: colors.line,
                }}
              />
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold leading-tight tracking-tight transition-colors duration-500 sm:text-4xl lg:text-[40px]"
              style={{
                color: colors.heading,
              }}
            >
              End-to-End Support Services
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="mt-3 max-w-3xl text-sm leading-7 transition-colors duration-500 sm:text-base"
              style={{
                color: colors.headingDescription,
              }}
            >
              We offer comprehensive services that ensure the success of each
              event, from planning and research submission to publication,
              promotion, and global networking.
            </motion.p>
          </div>
        </motion.div>

        {/* Service Cards */}
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
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.title}
                variants={cardAnimation}
                whileHover={{
                  y: -7,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="group min-h-[245px] rounded-2xl border p-5 transition-all duration-300"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                  boxShadow: colors.cardShadow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    colors.cardBorderHover;

                  e.currentTarget.style.boxShadow =
                    colors.cardHoverShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    colors.cardBorder;

                  e.currentTarget.style.boxShadow =
                    colors.cardShadow;
                }}
              >

                {/* Icon */}
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: 4,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: colors.iconBg,
                    color: colors.iconColor,
                    boxShadow: colors.iconShadow,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.iconHoverBg;

                    e.currentTarget.style.color =
                      colors.iconHoverColor;

                    e.currentTarget.style.boxShadow =
                      colors.iconHoverShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.iconBg;

                    e.currentTarget.style.color =
                      colors.iconColor;

                    e.currentTarget.style.boxShadow =
                      colors.iconShadow;
                  }}
                >
                  <Icon
                    size={23}
                    strokeWidth={1.8}
                  />
                </motion.div>

                {/* Title */}
                <h3
                  className="mt-5 min-h-[52px] text-[15px] font-bold leading-6 transition-colors duration-500"
                  style={{
                    color: colors.title,
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-3 text-[12px] leading-6 transition-colors duration-500"
                  style={{
                    color: colors.description,
                  }}
                >
                  {service.description}
                </p>

                {/* Learn More */}
                <motion.a
                  href="/contact"
                  whileHover={{
                    x: 4,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold transition-colors duration-300"
                  style={{
                    color: colors.link,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      colors.linkHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      colors.link;
                  }}
                >
                  Learn More

                  <ArrowRight
                    size={13}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </motion.a>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SupportServices;
