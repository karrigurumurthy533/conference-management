
import React from "react";
import { motion } from "framer-motion";
import {
  Globe2,
  BookOpen,
  UsersRound,
  GraduationCap,
  Handshake,
} from "lucide-react";

const WhyChooseGlobalScion = () => {
  const features = [
    {
      icon: Globe2,
      title: "Worldwide Reach",
      description:
        "Our events span continents—connecting Europe, Asia, North America, the Middle East, and beyond.",
    },
    {
      icon: BookOpen,
      title: "Publication Opportunities",
      description:
        "We are partnered with indexed journals (Scopus, Web of Science, and others) to offer extended publication options.",
    },
    {
      icon: UsersRound,
      title: "Robust Networking",
      description:
        "Meet peers, collaborate with top-tier experts, and engage with leading institutions and organizations.",
    },
    {
      icon: GraduationCap,
      title: "High-Impact Learning",
      description:
        "Each conference is enriched with keynotes, expert panels, workshops, and interactive sessions.",
    },
    {
      icon: Handshake,
      title: "Collaborative Partnerships",
      description:
        "We work with universities, research institutes, and professional bodies to co-host and co-brand world-class events.",
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

  const featureAnimation = {
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

  const colors = {
    sectionBg: "#FFFFFF",
    heading: "#111827",
    label: "#7C3AED",
    description: "#4B5563",
    featureTitle: "#111827",
    featureDescription: "#6B7280",
    iconBg: "#F5F3FF",
    icon: "#7C3AED",
    iconHoverBg: "#7C3AED",
    iconHoverShadow: "0 10px 24px rgba(124,58,237,0.25)",
  };

  const mapImage = "/images/dark_map.png";

  return (
    <section
      id="why-choose-globalscion"
      className="
        relative
        overflow-hidden
        py-8
        sm:py-12
        transition-colors
        duration-500
      "
      style={{
        backgroundColor: colors.sectionBg,
      }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

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
          >
            <motion.div
              variants={fadeUp}
              className="mb-3 flex items-center gap-3"
            >
              <span
                className="
                  h-[3px]
                  w-8
                  rounded-full
                  transition-colors
                  duration-500
                "
                style={{
                  backgroundColor: colors.label,
                }}
              />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  transition-colors
                  duration-500
                "
                style={{
                  color: colors.label,
                }}
              >
                Why Choose Us
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="
                text-3xl
                font-bold
                leading-tight
                tracking-tight
                transition-colors
                duration-500
                sm:text-4xl
              "
              style={{
                color: colors.heading,
              }}
            >
              Why Choose GlobalScion?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                transition-colors
                duration-500
                sm:text-base
              "
              style={{
                color: colors.description,
              }}
            >
              More than just conferences—we create opportunities
              for growth, collaboration, and global impact.
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.13,
                  },
                },
              }}
              className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    variants={featureAnimation}
                    className={`group flex gap-4 ${
                      index === 4
                        ? "sm:col-span-2 sm:max-w-[520px]"
                        : ""
                    }`}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                        rotate: 3,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300
                      "
                      style={{
                        backgroundColor: colors.iconBg,
                        boxShadow:
                          "0 8px 20px rgba(124,58,237,0.10)",
                      }}
                    >
                      <Icon
                        size={21}
                        strokeWidth={1.8}
                        className="transition-colors duration-300"
                        style={{
                          color: colors.icon,
                        }}
                      />
                    </motion.div>

                    <div className="min-w-0">
                      <h3
                        className="
                          text-sm
                          font-bold
                          transition-colors
                          duration-500
                          sm:text-[15px]
                        "
                        style={{
                          color: colors.featureTitle,
                        }}
                      >
                        {feature.title}
                      </h3>

                      <p
                        className="
                          mt-1.5
                          text-xs
                          leading-5
                          transition-colors
                          duration-500
                          sm:text-[13px]
                        "
                        style={{
                          color: colors.featureDescription,
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 70,
              scale: 0.94,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.95,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center justify-center"
          >
            <motion.div
              whileHover={{
                scale: 1.015,
                y: -4,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className="
                relative
                w-full
                max-w-[560px]
                overflow-visible
                transition-all
                duration-500
              "
            >
              <motion.div
                className="
                  relative
                  overflow-hidden
                  transition-all
                  duration-500
                "
              >
                <motion.img
                  src={mapImage}
                  alt="GlobalScion Worldwide Reach"
                  initial={{
                    scale: 0.96,
                  }}
                  whileInView={{
                    scale: 1,
                  }}
                  whileHover={{
                    scale: 1.025,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    block
                    h-auto
                    w-full
                    object-contain
                    transition-all
                    duration-500
                  "
                />
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseGlobalScion;
