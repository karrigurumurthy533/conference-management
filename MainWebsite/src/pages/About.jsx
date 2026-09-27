
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Target,
  Users,
} from "lucide-react";

const About = () => {
  const focusAreas = [
    "Autism Research & Innovations",
    "Mental Health & Psychiatry",
    "Endocrinology & Diabetes",
    "Oncology Research & AI Innovations",
    "Healthcare Innovation & Precision Medicine",
    "Food, Nutrition & Wellness",
    "Brain Health & Neurodiversity",
    "Cardiovascular Diseases",
  ];

  const colors = {
    pageBg: "#FFFFFF",
    secondaryBg: "#F9FAFB",
    cardBg: "#FFFFFF",

    primary: "#7C3AED",
    primaryHover: "#6D28D9",
    primaryLight: "#F5F3FF",

    heading: "#7C3AED",
    text: "#4B5563",
    textStrong: "#111827",
    muted: "#6B7280",

    border: "#E5E7EB",
    borderLight: "#EDE9FE",

    softBg: "#F5F3FF",
    softBgStrong: "#EDE9FE",

    heroBg: "#1E1B4B",

    heroGradient:
      "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",

    shadow: "0 20px 60px rgba(124,58,237,0.12)",
  };

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: colors.pageBg,
        color: colors.textStrong,
      }}
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          background: colors.heroGradient,
        }}
      >
        {/* Decorative circles */}

        <div
          className="absolute -right-24 -top-24 h-[280px] w-[280px] rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        />

        <div
          className="absolute -bottom-32 -left-24 h-[320px] w-[320px] rounded-full"
          style={{
            backgroundColor: "rgba(124,58,237,0.22)",
          }}
        />

        <div
          className="absolute right-[25%] top-14 h-16 w-16 rounded-full blur-3xl"
          style={{
            backgroundColor: "rgba(124,58,237,0.14)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex min-h-[220px] items-center py-8 md:py-9">
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              className="max-w-3xl"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span
                  className="h-[2px] w-7"
                  style={{
                    backgroundColor: colors.primaryLight,
                  }}
                />

                <span
                  className="text-[10px] font-semibold tracking-[0.2em] md:text-xs"
                  style={{
                    color: colors.primaryLight,
                  }}
                >
                  ABOUT GLOBALSCION
                </span>
              </div>

              <h1 className="text-2xl font-bold leading-[1.05] text-white sm:text-3xl md:text-4xl lg:text-[42px]">
                Connecting
                <br />

                <span
                  style={{
                    color: colors.primaryLight,
                  }}
                >
                  People, Ideas
                </span>

                <br />
                &amp; Innovation
              </h1>

              <p className="mt-3 max-w-xl text-xs leading-6 text-white/75 md:text-sm lg:text-base">
                GlobalScion creates professional platforms where
                researchers, healthcare professionals, academics,
                innovators, and industry leaders come together to
                exchange knowledge, build meaningful connections,
                and explore new possibilities.
              </p>

              <motion.a
                href="/conferences"
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-white px-5 text-xs font-semibold shadow-lg transition-colors"
                style={{
                  color: colors.primaryHover,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3E8FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                Explore Conferences
                <ArrowRight size={15} />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHO WE ARE
      ===================================================== */}

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-2 lg:gap-14">
            {/* IMAGE */}

            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
              }}
              className="relative"
            >
              <div
                className="absolute -left-3 -top-3 -z-10 h-16 w-16 rounded-xl"
                style={{
                  backgroundColor: colors.softBgStrong,
                }}
              />

              <div
                className="absolute -bottom-3 -right-3 -z-10 h-20 w-20 rounded-xl border-2"
                style={{
                  borderColor: colors.primaryLight,
                }}
              />

              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: colors.softBg,
                  boxShadow: "0 15px 35px rgba(124,58,237,0.12)",
                }}
              >
                <img
                  src="/images/dark_about.png"
                  alt="GlobalScion Global Community"
                  className="h-[270px] w-full object-cover sm:h-[310px] lg:h-[330px]"
                  style={{
                    filter: "none",
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

                <div
                  className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                  }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: colors.softBg,
                    }}
                  >
                    <Globe2
                      size={17}
                      style={{
                        color: colors.primary,
                      }}
                    />
                  </div>

                  <div>
                    <p
                      className="text-xs font-bold"
                      style={{
                        color: colors.heading,
                      }}
                    >
                      Global Community
                    </p>

                    <p
                      className="text-[10px]"
                      style={{
                        color: colors.muted,
                      }}
                    >
                      Connecting experts worldwide
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span
                  className="h-[2px] w-7"
                  style={{
                    backgroundColor: colors.primary,
                  }}
                />

                <span
                  className="text-[10px] font-semibold tracking-[0.16em] md:text-xs"
                  style={{
                    color: colors.primary,
                  }}
                >
                  WHO WE ARE
                </span>
              </div>

              <h2
                className="text-2xl font-bold leading-tight sm:text-3xl lg:text-[36px]"
                style={{
                  color: colors.heading,
                }}
              >
                A Global Platform for
                <span
                  style={{
                    color: colors.primary,
                  }}
                >
                  {" "}
                  Knowledge &amp; Collaboration
                </span>
              </h2>

              <p
                className="mt-4 text-xs leading-6 md:text-sm"
                style={{
                  color: colors.text,
                }}
              >
                GlobalScion is a professional conference platform
                focused on bringing together people who are shaping
                the future of science, healthcare, technology,
                research, and innovation.
              </p>

              <p
                className="mt-3 text-xs leading-6 md:text-sm"
                style={{
                  color: colors.text,
                }}
              >
                Through conferences, expert sessions, networking
                opportunities, and knowledge-sharing programs, we
                create an environment where professionals can learn,
                collaborate, exchange ideas, and discover new
                opportunities.
              </p>

              <div className="mt-5 space-y-2.5">
                {[
                  "Connect with international experts",
                  "Discover emerging research and technologies",
                  "Build meaningful professional collaborations",
                  "Share knowledge with a global audience",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{
                      x: 4,
                    }}
                    className="flex items-center gap-2.5"
                  >
                    <CheckCircle2
                      size={16}
                      className="flex-shrink-0"
                      style={{
                        color: colors.primary,
                      }}
                    />

                    <span
                      className="text-xs font-medium md:text-sm"
                      style={{
                        color: colors.textStrong,
                      }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="px-6 py-12"
        style={{
          backgroundColor: colors.secondaryBg,
        }}
      >
        <div className="mx-auto max-w-7xl">
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
            className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_0.65fr]"
          >
            {/* LEFT */}

            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <Target
                  size={17}
                  style={{
                    color: colors.primary,
                  }}
                />

                <span
                  className="text-[10px] font-semibold tracking-[0.16em] md:text-xs"
                  style={{
                    color: colors.primary,
                  }}
                >
                  OUR MISSION
                </span>
              </div>

              <h2
                className="text-2xl font-bold leading-tight sm:text-3xl lg:text-[36px]"
                style={{
                  color: colors.heading,
                }}
              >
                Empowering People Through
                <span
                  style={{
                    color: colors.primary,
                  }}
                >
                  {" "}
                  Knowledge &amp; Innovation
                </span>
              </h2>

              <p
                className="mt-4 max-w-xl text-xs leading-6 md:text-sm"
                style={{
                  color: colors.text,
                }}
              >
                Our mission is to create professional environments
                where knowledge can be exchanged, ideas can grow,
                partnerships can develop, and innovation can create
                meaningful impact.
              </p>
            </div>

            {/* RIGHT */}

            <div className="flex justify-center lg:justify-end">
              <motion.div
                whileHover={{
                  scale: 1.03,
                }}
                className="relative w-full max-w-xs overflow-hidden rounded-2xl p-6 md:p-7"
                style={{
                  background: colors.heroGradient,
                  boxShadow: "0 15px 40px rgba(124,58,237,0.18)",
                }}
              >
                <div
                  className="absolute -right-14 -top-14 h-36 w-36 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.10)",
                  }}
                />

                <div className="relative">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  >
                    <Users
                      size={22}
                      style={{
                        color: colors.primaryLight,
                      }}
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">
                    Meaningful Connections
                  </h3>

                  <p className="mt-3 text-xs leading-5 text-white/70">
                    Bringing professionals, researchers, academics
                    and innovators together through meaningful global
                    interaction.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FOCUS AREAS
      ===================================================== */}

      <section className="px-6 py-12 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
            {/* LEFT */}

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
              <p
                className="text-[10px] font-semibold tracking-[0.16em] md:text-xs"
                style={{
                  color: colors.primary,
                }}
              >
                OUR FOCUS
              </p>

              <h2
                className="mt-2 text-2xl font-bold leading-tight md:text-3xl lg:text-[36px]"
                style={{
                  color: colors.heading,
                }}
              >
                Exploring Ideas
                <br />
                Across
                <span
                  style={{
                    color: colors.primary,
                  }}
                >
                  {" "}
                  Disciplines
                </span>
              </h2>

              <p
                className="mt-4 max-w-sm text-xs leading-6 md:text-sm"
                style={{
                  color: colors.muted,
                }}
              >
                Our programs bring together professionals from
                diverse fields, creating opportunities for knowledge
                sharing, collaboration, research, and innovation.
              </p>
            </motion.div>

            {/* RIGHT */}

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
              transition={{
                duration: 0.6,
              }}
            >
              <div
                className="border-t"
                style={{
                  borderColor: colors.border,
                }}
              >
                {focusAreas.map((area, index) => (
                  <motion.div
                    key={index}
                    whileHover={{
                      x: 5,
                    }}
                    className="group flex items-center justify-between gap-4 border-b py-3.5"
                    style={{
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-5 text-[10px] font-semibold"
                        style={{
                          color: colors.primary,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className="text-xs font-medium transition-colors md:text-sm"
                        style={{
                          color: colors.textStrong,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color =
                            colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            colors.textStrong;
                        }}
                      >
                        {area}
                      </span>
                    </div>

                    <ArrowRight
                      size={15}
                      className="flex-shrink-0 transition-colors"
                      style={{
                        color: "#D1D5DB",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="px-6 pb-14">
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
          transition={{
            duration: 0.7,
          }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl px-6 py-9 text-center md:px-10 md:py-11"
          style={{
            background: colors.heroGradient,
            boxShadow: "0 20px 50px rgba(124,58,237,0.16)",
          }}
        >
          <div
            className="absolute -right-14 -top-20 h-48 w-48 rounded-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />

          <div
            className="absolute -bottom-24 -left-14 h-14 w-56 rounded-full"
            style={{
              backgroundColor: "rgba(124,58,237,0.24)",
            }}
          />

          <div className="relative">
            <p
              className="text-[10px] font-semibold tracking-[0.18em] md:text-xs"
              style={{
                color: colors.primaryLight,
              }}
            >
              BE PART OF THE COMMUNITY
            </p>

            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl lg:text-[36px]">
              Connect. Learn. Innovate.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-white/70 md:text-sm">
              Explore GlobalScion conferences and connect with
              professionals, researchers, academics, and innovators
              from around the world.
            </p>

            <motion.a
              href="/conferences"
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-6 text-xs font-semibold shadow-lg transition-colors"
              style={{
                color: colors.primaryHover,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F3E8FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}
            >
              View Conferences
              <ArrowRight size={15} />
            </motion.a>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default About;
