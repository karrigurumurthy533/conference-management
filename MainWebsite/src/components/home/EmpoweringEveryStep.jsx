
import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BriefcaseBusiness,
  Building2,
  UsersRound,
  ArrowRight,
} from "lucide-react";

const EmpoweringEveryStep = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "For Researchers & Academics",
      description:
        "Present original research to a global audience and gain international visibility and publication credits.",
      points: [
        "Present original research to a global audience.",
        "Gain international visibility and publication credits.",
      ],
      link: "Explore Opportunities",
    },
    {
      icon: BriefcaseBusiness,
      title: "For Industry Professionals",
      description:
        "Showcase practical solutions, share expertise, and discover new partnerships and market opportunities.",
      points: [
        "Showcase practical solutions and case studies.",
        "Discover partnerships and market opportunities.",
      ],
      link: "Explore Opportunities",
    },
    {
      icon: Building2,
      title: "For Institutions",
      description:
        "Build meaningful global connections and create opportunities that strengthen your institution's presence.",
      points: [
        "Co-host or sponsor events that align with your vision.",
        "Boost your institution's global presence.",
      ],
      link: "Partner With Us",
    },
    {
      icon: UsersRound,
      title: "For Attendees & Professionals",
      description:
        "Connect with like-minded professionals, learn from global experts, and build valuable relationships.",
      points: [
        "Connect with global experts and peers.",
        "Build meaningful professional relationships.",
      ],
      link: "Join Our Community",
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

  const colors = {
    sectionBg: "#FFFFFF",

    heading: "#111827",

    subtitle: "#4B5563",

    cardBg: "#FFFFFF",

    cardBorder: "#E5E7EB",

    cardBorderHover: "#DDD6FE",

    title: "#111827",

    description: "#4B5563",

    pointText: "#6B7280",

    brand: "#7C3AED",

    brandHover: "#6D28D9",

    iconBg: "#F5F3FF",

    iconShadow: "0 7px 20px rgba(124,58,237,0.10)",

    iconHoverShadow: "0 10px 25px rgba(124,58,237,0.22)",

    cardShadow: "0 4px 16px rgba(124,58,237,0.04)",

    cardHoverShadow: "0 14px 32px rgba(124,58,237,0.14)",
  };

  return (
    <section
      id="empowering-every-step"
      className="py-8 transition-colors duration-500 sm:py-12"
      style={{
        backgroundColor: colors.sectionBg,
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section Header */}
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
          className="max-w-3xl"
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
            className="text-2xl font-bold leading-tight tracking-tight transition-colors duration-500 sm:text-3xl lg:text-[34px]"
            style={{
              color: colors.heading,
            }}
          >
            Empowering You at Every Step
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-2 text-sm leading-6 transition-colors duration-500 sm:text-[15px]"
            style={{
              color: colors.subtitle,
            }}
          >
            From research and networking to partnerships and professional
            growth, we make your conference experience meaningful and rewarding.
          </motion.p>

        </motion.div>

        {/* 4 Cards */}
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
                staggerChildren: 0.13,
              },
            },
          }}
          className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.title}
                variants={cardAnimation}
                whileHover={{
                  y: -6,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="group rounded-xl border p-4 transition-all duration-500"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: colors.iconBg,
                    color: colors.brand,
                    boxShadow: colors.iconShadow,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.brand;

                    e.currentTarget.style.color =
                      "#FFFFFF";

                    e.currentTarget.style.boxShadow =
                      colors.iconHoverShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.iconBg;

                    e.currentTarget.style.color =
                      colors.brand;

                    e.currentTarget.style.boxShadow =
                      colors.iconShadow;
                  }}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.9}
                  />
                </motion.div>

                {/* Title */}
                <h3
                  className="mt-3 text-[13px] font-bold leading-5 transition-colors duration-500"
                  style={{
                    color: colors.title,
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-2 text-[10px] leading-[1.65] transition-colors duration-500"
                  style={{
                    color: colors.description,
                  }}
                >
                  {service.description}
                </p>

                {/* Points */}
                <ul className="mt-3 space-y-2">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-[10px] leading-[1.55] transition-colors duration-500"
                      style={{
                        color: colors.pointText,
                      }}
                    >
                      <motion.span
                        initial={{
                          scale: 0,
                        }}
                        whileInView={{
                          scale: 1,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500"
                        style={{
                          backgroundColor: colors.brand,
                        }}
                      />

                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Link */}
                <motion.a
                  href="/conferences"
                  whileHover={{
                    x: 3,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold transition-colors duration-300"
                  style={{
                    color: colors.brand,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      colors.brandHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      colors.brand;
                  }}
                >
                  {service.link}

                  <ArrowRight
                    size={11}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
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

export default EmpoweringEveryStep;
