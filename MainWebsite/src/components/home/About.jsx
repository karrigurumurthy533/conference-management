
import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users } from "lucide-react";

const About = () => {
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 35,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const statAnimation = {
    hidden: {
      opacity: 0,
      y: 25,
      scale: 0.96,
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
    subHeading: "#7C3AED",
    paragraph: "#4B5563",
    statHeading: "#111827",
    statNumber: "#7C3AED",
    statDescription: "#6B7280",
    brand: "#7C3AED",
    iconBg: "#F5F3FF",
    border: "#DDD6FE",
    decorativeShape: "#EDE9FE",
    imageBackground: "#FFFFFF",
    imageShadow: "0 20px 50px rgba(124,58,237,0.15)",
    aboutImage: "/images/about.png",
  };

  return (
    <section
      id="about"
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
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">

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
            className="order-2 lg:order-1"
          >

            <motion.div
              variants={fadeUp}
              className="mb-5 flex items-center gap-3"
            >
              <span
                className="h-[3px] w-8 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: colors.brand,
                }}
              />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  transition-colors
                  duration-500
                "
                style={{
                  color: colors.brand,
                }}
              >
                About Us
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="
                text-3xl
                font-bold
                leading-[1.15]
                tracking-tight
                transition-colors
                duration-500
                sm:text-4xl
                lg:text-[46px]
              "
              style={{
                color: colors.heading,
              }}
            >
              GlobalScion Conferences
            </motion.h2>

            <motion.h3
              variants={fadeUp}
              className="
                mt-4
                text-xl
                font-semibold
                leading-snug
                transition-colors
                duration-500
                sm:text-2xl
              "
              style={{
                color: colors.subHeading,
              }}
            >
              Where Ideas Meet Action—Globally
            </motion.h3>

            <motion.p
              variants={fadeUp}
              className="
                mt-6
                text-sm
                leading-7
                transition-colors
                duration-500
                sm:text-base
              "
              style={{
                color: colors.paragraph,
              }}
            >
              Welcome to GlobalScion Conferences, the premier platform
              designed to empower academics, innovators, and professionals
              worldwide. As a trusted leader in international conference
              hosting, GlobalScion creates vibrant, meaningful spaces for
              knowledge exchange, cross-border collaboration, and innovative
              breakthroughs.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="
                mt-4
                text-sm
                leading-7
                transition-colors
                duration-500
                sm:text-base
              "
              style={{
                color: colors.paragraph,
              }}
            >
              From pioneering research to transformative industry trends,
              our conferences are engineered to connect diverse minds,
              disciplines, and cultures—fueling progress that knows no
              boundaries.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8"
            >
              <div className="mb-5 flex items-center gap-4">
                <h4
                  className="
                    text-xl
                    font-bold
                    transition-colors
                    duration-500
                  "
                  style={{
                    color: colors.statHeading,
                  }}
                >
                  We’re In Business
                </h4>

                <span
                  className="h-[2px] w-12 rounded-full transition-colors duration-500"
                  style={{
                    backgroundColor: colors.brand,
                  }}
                />
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
                className="
                  flex
                  flex-col
                  gap-6
                  sm:flex-row
                  sm:items-center
                  sm:gap-7
                "
              >

                <motion.div
                  variants={statAnimation}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: 3,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      transition-colors
                      duration-500
                    "
                    style={{
                      backgroundColor: colors.iconBg,
                      boxShadow: "0 8px 20px rgba(124,58,237,0.12)",
                    }}
                  >
                    <CalendarDays
                      size={27}
                      strokeWidth={1.8}
                      style={{
                        color: colors.brand,
                      }}
                    />
                  </motion.div>

                  <div>
                    <h5
                      className="
                        text-2xl
                        font-bold
                        leading-none
                        transition-colors
                        duration-500
                      "
                      style={{
                        color: colors.statNumber,
                      }}
                    >
                      10+ Years
                    </h5>

                    <p
                      className="
                        mt-2
                        text-sm
                        transition-colors
                        duration-500
                      "
                      style={{
                        color: colors.statDescription,
                      }}
                    >
                      Completed Successfully
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="
                    hidden
                    h-14
                    w-px
                    transition-colors
                    duration-500
                    sm:block
                  "
                  style={{
                    backgroundColor: colors.border,
                  }}
                />

                <motion.div
                  variants={statAnimation}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: -3,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      transition-colors
                      duration-500
                    "
                    style={{
                      backgroundColor: colors.iconBg,
                      boxShadow: "0 8px 20px rgba(124,58,237,0.12)",
                    }}
                  >
                    <Users
                      size={28}
                      strokeWidth={1.8}
                      style={{
                        color: colors.brand,
                      }}
                    />
                  </motion.div>

                  <div>
                    <h5
                      className="
                        text-2xl
                        font-bold
                        leading-none
                        transition-colors
                        duration-500
                      "
                      style={{
                        color: colors.statNumber,
                      }}
                    >
                      500+
                    </h5>

                    <p
                      className="
                        mt-2
                        text-sm
                        transition-colors
                        duration-500
                      "
                      style={{
                        color: colors.statDescription,
                      }}
                    >
                      Conferences
                    </p>
                  </div>
                </motion.div>

              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 70,
              scale: 0.95,
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
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-[620px]">

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  -right-4
                  top-8
                  h-[85%]
                  w-[82%]
                  rounded-[35%_10%_35%_10%]
                  transition-colors
                  duration-500
                "
                style={{
                  backgroundColor: colors.decorativeShape,
                }}
              />

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  relative
                  z-10
                  overflow-hidden
                  rounded-[28px_70px_28px_70px]
                  transition-all
                  duration-500
                "
                style={{
                  backgroundColor: colors.imageBackground,
                  boxShadow: colors.imageShadow,
                }}
              >
                <img
                  src={colors.aboutImage}
                  alt="GlobalScion Conferences"
                  className="
                    block
                    h-auto
                    w-full
                    object-cover
                  "
                />
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
