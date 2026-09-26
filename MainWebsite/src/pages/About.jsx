
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

    heroGradient: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",

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
          className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        />

        <div
          className="absolute -bottom-48 -left-32 h-[500px] w-[500px] rounded-full"
          style={{
            backgroundColor: "rgba(124,58,237,0.22)",
          }}
        />

        <div
          className="absolute right-[25%] top-20 h-24 w-24 rounded-full blur-3xl"
          style={{
            backgroundColor: "rgba(124,58,237,0.14)",
          }}
        />

        <div
          className="relative mx-auto max-w-7xl px-6 lg:px-10"
        >
          <div className="flex min-h-[500px] items-center py-20 md:py-24">
            <motion.div
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              className="max-w-4xl"
            >
              <div className="mb-6 flex items-center gap-3">
                <span
                  className="h-[2px] w-10"
                  style={{
                    backgroundColor: colors.primaryLight,
                  }}
                />

                <span
                  className="text-xs font-semibold tracking-[0.25em] md:text-sm"
                  style={{
                    color: colors.primaryLight,
                  }}
                >
                  ABOUT GLOBALSCION
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
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

              <p className="mt-7 max-w-2xl text-sm leading-8 text-white/75 md:text-base lg:text-lg">
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
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-7 text-sm font-semibold shadow-lg transition-colors"
                style={{
                  color: colors.primaryHover,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "#F3E8FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "#FFFFFF";
                }}
              >
                Explore Conferences
                <ArrowRight size={17} />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHO WE ARE
      ===================================================== */}

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            {/* IMAGE */}

            <motion.div
              initial={{
                opacity: 0,
                x: -40,
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
                className="absolute -left-5 -top-5 -z-10 h-24 w-24 rounded-2xl"
                style={{
                  backgroundColor: colors.softBgStrong,
                }}
              />

              <div
                className="absolute -bottom-5 -right-5 -z-10 h-28 w-28 rounded-2xl border-2"
                style={{
                  borderColor: colors.primaryLight,
                }}
              />

              <div
                className="relative overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: colors.softBg,
                  boxShadow: "0 20px 50px rgba(124,58,237,0.12)",
                }}
              >
                <img
                  src="/images/dark_about.png"
                  alt="GlobalScion Global Community"
                  className="h-[380px] w-full object-cover sm:h-[440px] lg:h-[500px]"
                  style={{
                    filter: "none",
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />

                <div
                  className="absolute bottom-6 left-6 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: colors.softBg,
                    }}
                  >
                    <Globe2
                      size={20}
                      style={{
                        color: colors.primary,
                      }}
                    />
                  </div>

                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: colors.heading,
                      }}
                    >
                      Global Community
                    </p>

                    <p
                      className="text-xs"
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

            {/* CONTENT */}

            <motion.div
              initial={{
                opacity: 0,
                x: 40,
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
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="h-[2px] w-9"
                  style={{
                    backgroundColor: colors.primary,
                  }}
                />

                <span
                  className="text-xs font-semibold tracking-[0.18em] md:text-sm"
                  style={{
                    color: colors.primary,
                  }}
                >
                  WHO WE ARE
                </span>
              </div>

              <h2
                className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
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
                className="mt-6 text-sm leading-7 md:text-base"
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
                className="mt-4 text-sm leading-7 md:text-base"
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

              <div className="mt-8 space-y-4">
                {[
                  "Connect with international experts",
                  "Discover emerging research and technologies",
                  "Build meaningful professional collaborations",
                  "Share knowledge with a global audience",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{
                      x: 5,
                    }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={19}
                      className="flex-shrink-0"
                      style={{
                        color: colors.primary,
                      }}
                    />

                    <span
                      className="text-sm font-medium md:text-base"
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

      {/* =====================================================
          MISSION
      ===================================================== */}

      <section
        className="px-6 py-20"
        style={{
          backgroundColor: colors.secondaryBg,
        }}
      >
        <div className="mx-auto max-w-7xl">
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
            className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_0.65fr]"
          >
            {/* LEFT */}

            <div>
              <div className="mb-5 flex items-center gap-3">
                <Target
                  size={20}
                  style={{
                    color: colors.primary,
                  }}
                />

                <span
                  className="text-xs font-semibold tracking-[0.18em] md:text-sm"
                  style={{
                    color: colors.primary,
                  }}
                >
                  OUR MISSION
                </span>
              </div>

              <h2
                className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
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
                className="mt-6 max-w-2xl text-sm leading-7 md:text-base"
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
                className="relative w-full max-w-sm overflow-hidden rounded-3xl p-8 md:p-10"
                style={{
                  background: colors.heroGradient,
                  boxShadow: "0 20px 55px rgba(124,58,237,0.18)",
                }}
              >
                <div
                  className="absolute -right-20 -top-20 h-52 w-52 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.10)",
                  }}
                />

                <div className="relative">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                    }}
                  >
                    <Users
                      size={27}
                      style={{
                        color: colors.primaryLight,
                      }}
                    />
                  </div>

                  <h3 className="mt-7 text-2xl font-bold text-white">
                    Meaningful Connections
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-white/70">
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

      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            {/* LEFT */}

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
              }}
            >
              <p
                className="text-xs font-semibold tracking-[0.18em] md:text-sm"
                style={{
                  color: colors.primary,
                }}
              >
                OUR FOCUS
              </p>

              <h2
                className="mt-3 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
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
                className="mt-5 max-w-md text-sm leading-7 md:text-base"
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
                      x: 6,
                    }}
                    className="group flex items-center justify-between gap-5 border-b py-5"
                    style={{
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="w-6 text-xs font-semibold"
                        style={{
                          color: colors.primary,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className="text-sm font-medium transition-colors md:text-base"
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
                      size={17}
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

      <section className="px-6 pb-24">
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
          className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl px-7 py-14 text-center md:px-14 md:py-16"
          style={{
            background: colors.heroGradient,
            boxShadow: "0 25px 70px rgba(124,58,237,0.16)",
          }}
        >
          <div
            className="absolute -right-20 -top-28 h-72 w-72 rounded-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />

          <div
            className="absolute -bottom-36 -left-20 h-20 w-80 rounded-full"
            style={{
              backgroundColor: "rgba(124,58,237,0.24)",
            }}
          />

          <div className="relative">
            <p
              className="text-xs font-semibold tracking-[0.2em] md:text-sm"
              style={{
                color: colors.primaryLight,
              }}
            >
              BE PART OF THE COMMUNITY
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Connect. Learn. Innovate.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
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
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-7 text-sm font-semibold shadow-lg transition-colors"
              style={{
                color: colors.primaryHover,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#F3E8FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#FFFFFF";
              }}
            >
              View Conferences
              <ArrowRight size={17} />
            </motion.a>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default About;