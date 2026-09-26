import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mic2,
  Globe2,
} from "lucide-react";

const Speakers = () => {
  const speakers = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      role: "Professor of Neuroscience",
      organization: "Harvard Medical School",
      specialty: "Neuroscience & Brain Health",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: 2,
      name: "Dr. Michael Anderson",
      role: "Clinical Psychiatrist",
      organization: "Mayo Clinic",
      specialty: "Mental Health & Psychiatry",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=85",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: 3,
      name: "Dr. Emily Carter",
      role: "Oncology Researcher",
      organization: "Johns Hopkins Medicine",
      specialty: "Oncology & Cancer Research",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      role: "Endocrinology Specialist",
      organization: "Cleveland Clinic",
      specialty: "Diabetes & Endocrinology",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=85",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: 5,
      name: "Dr. Olivia Brown",
      role: "Healthcare Innovation Expert",
      organization: "Stanford Medicine",
      specialty: "AI & Precision Medicine",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=85",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: 6,
      name: "Dr. Daniel Thompson",
      role: "Cardiologist",
      organization: "Mount Sinai Health",
      specialty: "Cardiovascular Diseases",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=85",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: 7,
      name: "Dr. Sophia Williams",
      role: "Nutrition Scientist",
      organization: "Global Wellness Institute",
      specialty: "Food, Nutrition & Wellness",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=85",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: 8,
      name: "Dr. Robert Davis",
      role: "Digital Psychiatry Researcher",
      organization: "University of California",
      specialty: "AI & Digital Psychiatry",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
      linkedin: "https://www.linkedin.com/",
    },
  ];

  /* =========================================================
     THEME COLORS (White + Violet Palette)
  ========================================================= */

  const colors = {
    pageBg: "#FFFFFF",

    heroBg: "#F5F3FF",

    heroCircleOne: "rgba(124,58,237,0.12)",

    heroCircleTwo: "rgba(168,85,247,0.10)",

    eyebrow: "#7C3AED",

    heroHeading: "#7C3AED",

    heroText: "#4B5563",

    sectionBg: "#FFFFFF",

    sectionIcon: "#7C3AED",

    sectionHeading: "#111827",

    sectionDescription: "#6B7280",

    globalExperts: "#7C3AED",

    cardBg: "#FFFFFF",

    cardBorder: "#E5E7EB",

    cardShadow: "0 4px 16px rgba(124,58,237,0.06)",

    cardHoverShadow: "0 18px 40px rgba(124,58,237,0.15)",

    imageBg: "#F5F3FF",

    numberBg: "rgba(255,255,255,0.95)",

    numberText: "#7C3AED",

    role: "#111827",

    organization: "#6B7280",

    divider: "#EDE9FE",

    specialtyLabel: "#9CA3AF",

    specialty: "#7C3AED",

    arrowBg: "#F5F3FF",

    arrowColor: "#7C3AED",

    linkedinBg: "#FFFFFF",

    ctaBg: "#F5F3FF",

    ctaBorder: "#DDD6FE",

    ctaCircleOne: "rgba(124,58,237,0.12)",

    ctaCircleTwo: "rgba(168,85,247,0.10)",

    ctaHeading: "#111827",

    ctaText: "#4B5563",

    button: "#7C3AED",

    buttonHover: "#6D28D9",
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: colors.pageBg,
        color: colors.heroHeading,
      }}
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="relative overflow-hidden transition-colors duration-500"
        style={{
          backgroundColor: colors.heroBg,
        }}
      >
        {/* Decorative Circle */}

        <div
          className="
            absolute
            -top-32
            -right-20
            w-96
            h-96
            rounded-full
            transition-all
            duration-500
          "
          style={{
            backgroundColor: colors.heroCircleOne,
          }}
        />

        {/* Decorative Circle */}

        <div
          className="
            absolute
            -bottom-40
            -left-20
            w-80
            h-80
            rounded-full
            transition-all
            duration-500
          "
          style={{
            backgroundColor: colors.heroCircleTwo,
          }}
        />

        <div
          className="
            relative
            max-w-7xl
            mx-auto
            px-6
            lg:px-10
            py-16
            md:py-20
            text-center
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            {/* EYEBROW */}

            <div className="flex items-center justify-center gap-3 mb-4">
              <span
                className="w-10 h-[2px]"
                style={{
                  backgroundColor: colors.eyebrow,
                }}
              />

              <span
                className="
                  text-xs
                  sm:text-sm
                  font-semibold
                  tracking-[0.25em]
                "
                style={{
                  color: colors.eyebrow,
                }}
              >
                GLOBAL EXPERTS
              </span>

              <span
                className="w-10 h-[2px]"
                style={{
                  backgroundColor: colors.eyebrow,
                }}
              />
            </div>

            {/* HEADING */}

            <h1
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                font-bold
              "
              style={{
                color: colors.heroHeading,
              }}
            >
              Meet Our Speakers
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                max-w-2xl
                mx-auto
                mt-5
                text-sm
                sm:text-base
                md:text-lg
                leading-relaxed
              "
              style={{
                color: colors.heroText,
              }}
            >
              Connect with renowned researchers, healthcare professionals,
              innovators, academics, and industry leaders from around the
              world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SPEAKERS
      ====================================================== */}

      <section
        className="py-16 px-6 transition-colors duration-500"
        style={{
          backgroundColor: colors.sectionBg,
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* SECTION HEADER */}

          <motion.div
            className="
              flex
              flex-col
              md:flex-row
              md:items-end
              md:justify-between
              gap-5
              mb-10
            "
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mic2
                  size={18}
                  style={{
                    color: colors.sectionIcon,
                  }}
                />

                <span
                  className="
                    text-sm
                    font-semibold
                  "
                  style={{
                    color: colors.sectionIcon,
                  }}
                >
                  OUR EXPERT SPEAKERS
                </span>
              </div>

              <h2
                className="
                  text-2xl
                  md:text-3xl
                  font-bold
                "
                style={{
                  color: colors.sectionHeading,
                }}
              >
                Inspiring Minds. Sharing Knowledge.
              </h2>

              <p
                className="mt-2 text-sm"
                style={{
                  color: colors.sectionDescription,
                }}
              >
                Learn from experts shaping the future of healthcare,
                science, technology, and innovation.
              </p>
            </div>

            {/* GLOBAL EXPERTS */}

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
              "
              style={{
                color: colors.globalExperts,
              }}
            >
              <Globe2 size={18} />
              Global Experts
            </div>
          </motion.div>

          {/* =====================================================
              SPEAKER GRID
          ====================================================== */}

          <motion.div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-6
            "
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.08,
            }}
          >
            {speakers.map((speaker) => (
              <motion.article
                key={speaker.id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  boxShadow: colors.cardHoverShadow,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  group
                  rounded-xl
                  overflow-hidden
                  border
                  shadow-sm
                  transition-all
                  duration-500
                "
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                  boxShadow: colors.cardShadow,
                }}
              >
                {/* =================================================
                    IMAGE
                ================================================== */}

                <div
                  className="
                    relative
                    h-64
                    overflow-hidden
                  "
                  style={{
                    backgroundColor: colors.imageBg,
                  }}
                >
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  {/* IMAGE OVERLAY */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/50
                      via-transparent
                      to-transparent
                      pointer-events-none
                    "
                  />

                  {/* NUMBER */}

                  <div
                    className="
                      absolute
                      top-4
                      left-4
                      w-9
                      h-9
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-bold
                      shadow-sm
                    "
                    style={{
                      backgroundColor: colors.numberBg,
                      color: colors.numberText,
                    }}
                  >
                    {String(speaker.id).padStart(2, "0")}
                  </div>

                  {/* =================================================
                      LINKEDIN
                  ================================================== */}

                  <motion.a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn profile of ${speaker.name}`}
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    className="
                      absolute
                      bottom-4
                      right-4
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      shadow-md
                      opacity-0
                      translate-y-3
                      group-hover:opacity-100
                      group-hover:translate-y-0
                      transition-all
                      duration-300
                    "
                    style={{
                      backgroundColor: colors.linkedinBg,
                    }}
                  >
                    <img
                      src="/svgs/linkedin.svg"
                      alt="LinkedIn"
                      className="
                        w-[18px]
                        h-[18px]
                        object-contain
                      "
                    />
                  </motion.a>
                </div>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="p-5">
                  {/* NAME */}

                  <h3
                    className="
                      text-lg
                      font-bold
                      leading-tight
                    "
                    style={{
                      color: colors.sectionHeading,
                    }}
                  >
                    {speaker.name}
                  </h3>

                  {/* ROLE */}

                  <p
                    className="
                      mt-1
                      text-sm
                      font-medium
                    "
                    style={{
                      color: colors.role,
                    }}
                  >
                    {speaker.role}
                  </p>

                  {/* ORGANIZATION */}

                  <p
                    className="
                      mt-1
                      text-xs
                    "
                    style={{
                      color: colors.organization,
                    }}
                  >
                    {speaker.organization}
                  </p>

                  {/* DIVIDER */}

                  <div
                    className="my-4 h-px"
                    style={{
                      backgroundColor: colors.divider,
                    }}
                  />

                  {/* SPECIALTY */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-wider
                          font-semibold
                        "
                        style={{
                          color: colors.specialtyLabel,
                        }}
                      >
                        Specialty
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          font-semibold
                          leading-5
                        "
                        style={{
                          color: colors.specialty,
                        }}
                      >
                        {speaker.specialty}
                      </p>
                    </div>

                    {/* ARROW */}

                    <motion.div
                      whileHover={{
                        x: 4,
                      }}
                      className="
                        w-8
                        h-8
                        rounded-full
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                      style={{
                        backgroundColor: colors.arrowBg,
                      }}
                    >
                      <ArrowRight
                        size={15}
                        style={{
                          color: colors.arrowColor,
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <motion.section
        className="px-6 pb-16"
        style={{
          backgroundColor: colors.sectionBg,
        }}
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
          amount: 0.3,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <div
          className="
            relative
            overflow-hidden
            max-w-7xl
            mx-auto
            rounded-2xl
            border
            px-6
            py-10
            md:py-12
            text-center
            transition-all
            duration-500
          "
          style={{
            backgroundColor: colors.ctaBg,
            borderColor: colors.ctaBorder,
            boxShadow: "0 10px 35px rgba(124,58,237,0.08)",
          }}
        >
          {/* DECORATIVE CIRCLES */}

          <div
            className="
              absolute
              -top-24
              -right-16
              w-56
              h-56
              rounded-full
            "
            style={{
              backgroundColor: colors.ctaCircleOne,
            }}
          />

          <div
            className="
              absolute
              -bottom-28
              -left-16
              w-56
              h-56
              rounded-full
            "
            style={{
              backgroundColor: colors.ctaCircleTwo,
            }}
          />

          <div className="relative">
            {/* CTA HEADING */}

            <h2
              className="
                text-2xl
                md:text-3xl
                font-bold
              "
              style={{
                color: colors.ctaHeading,
              }}
            >
              Want to Join Our Speaker Community?
            </h2>

            {/* CTA DESCRIPTION */}

            <p
              className="
                max-w-2xl
                mx-auto
                mt-3
                text-sm
                leading-6
              "
              style={{
                color: colors.ctaText,
              }}
            >
              Share your expertise, research, and ideas with a global
              audience of professionals and innovators.
            </p>

            {/* BUTTON */}

            <motion.button
              type="button"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                px-7
                h-11
                rounded-md
                text-white
                text-sm
                font-semibold
                transition-colors
              "
              style={{
                backgroundColor: colors.button,
                boxShadow:
                  "0 8px 25px rgba(124,58,237,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.buttonHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.button;
              }}
            >
              Become a Speaker

              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Speakers;