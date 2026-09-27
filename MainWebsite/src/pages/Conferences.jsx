import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const conferences = [
  {
    id: "autism-research",
    title: "International Conference on Autism Research & Innovations",
    category: "Autism & Neurodiversity",
    date: "March 18–19, 2027",
    location: "Dubai, UAE",
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "mental-health",
    title: "International Conference on Mental Health & Psychiatry",
    category: "Mental Health",
    date: "April 22–23, 2027",
    location: "London, UK",
    image:
      "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "endocrinology-diabetes",
    title: "International Conference on Endocrinology & Diabetes",
    category: "Endocrinology",
    date: "May 15–16, 2027",
    location: "Singapore",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "oncology-research",
    title: "International Conference on Oncology Research & AI Innovations",
    category: "Oncology",
    date: "June 12–13, 2027",
    location: "Amsterdam, Netherlands",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "healthcare-innovation",
    title: "Healthcare Innovation, Precision Medicine & AI",
    category: "Healthcare Innovation",
    date: "July 20–21, 2027",
    location: "Barcelona, Spain",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "nutrition-wellness",
    title: "International Conference on Food, Nutrition & Wellness",
    category: "Nutrition & Wellness",
    date: "August 10–11, 2027",
    location: "Paris, France",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85",
  },
];

const Conferences = () => {
  const navigate = useNavigate();

  // ==========================================================
  // COLORS
  // ==========================================================

  const colors = {
    pageBg: "#FFFFFF",
    headerBg: "#FAF7FF",

    eyebrow: "#7C3AED",
    heading: "#4C1D95",
    description: "#4B5563",

    sectionBg: "#FFFFFF",

    cardBg: "#FFFFFF",
    cardBorder: "#E9DDFB",

    cardShadow: "0 2px 10px rgba(124,58,237,0.04)",
    cardHoverShadow: "0 18px 40px rgba(124,58,237,0.12)",

    cardTitle: "#4C1D95",
    infoText: "#4B5563",

    icon: "#7C3AED",

    badgeBg: "rgba(255,255,255,0.95)",
    badgeText: "#7C3AED",

    button: "#7C3AED",
    buttonHover: "#5B21B6",
  };

  // ==========================================================
  // NAVIGATE TO CONFERENCE DETAILS
  // ==========================================================

  const handleConferenceClick = (id) => {
    navigate(`/conference/${id}`);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: colors.pageBg,
      }}
    >
      {/* ======================================================
    HEADER
====================================================== */}

      <section
        className="
    relative
    overflow-hidden
    px-6
    py-10
    md:py-12
  "
        style={{
          backgroundColor: colors.headerBg,
        }}
      >
        <div className="relative mx-auto max-w-7xl text-center">
          {/* EYEBROW */}

          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.18em]
        md:text-xs
      "
            style={{
              color: colors.eyebrow,
            }}
          >
            GlobalScion Conferences
          </motion.p>

          {/* HEADING */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.08,
            }}
            className="
        mt-2
        text-2xl
        font-bold
        leading-tight
        md:text-3xl
      "
            style={{
              color: colors.heading,
            }}
          >
            Explore Our Conferences
          </motion.h1>

          {/* DESCRIPTION */}

          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.16,
            }}
            className="
        mx-auto
        mt-3
        max-w-xl
        text-xs
        leading-5
        md:text-sm
        md:leading-6
      "
            style={{
              color: colors.description,
            }}
          >
            Discover global conferences bringing together researchers,
            healthcare professionals, academics and industry leaders.
          </motion.p>
        </div>
      </section>
      {/* ======================================================
          CONFERENCES
      ====================================================== */}

      <section
        className="
          px-6
          py-20
        "
        style={{
          backgroundColor: colors.sectionBg,
        }}
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {conferences.map((conference, index) => (
            <motion.article
              key={conference.id}
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
                amount: 0.1,
              }}
              transition={{
                delay: index * 0.08,
                duration: 0.55,
              }}
              whileHover={{
                y: -7,
                boxShadow: colors.cardHoverShadow,
              }}
              onClick={() => handleConferenceClick(conference.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleConferenceClick(conference.id);
                }
              }}
              role="button"
              tabIndex={0}
              className="
                group
                cursor-pointer
                overflow-hidden
                rounded-2xl
                border
                shadow-sm
                transition-all
                duration-500
                focus:outline-none
                focus:ring-2
                focus:ring-[#7C3AED]/30
              "
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
                boxShadow: colors.cardShadow,
              }}
            >
              {/* ==================================================
                  IMAGE
              ================================================== */}

              <div
                className="
                  relative
                  h-60
                  overflow-hidden
                "
              >
                <img
                  src={conference.image}
                  alt={conference.title}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/60
                    via-transparent
                    to-transparent
                  "
                />

                {/* CATEGORY */}

                <span
                  className="
                    absolute
                    bottom-4
                    left-4
                    rounded-full
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    shadow-sm
                  "
                  style={{
                    backgroundColor: colors.badgeBg,
                    color: colors.badgeText,
                  }}
                >
                  {conference.category}
                </span>
              </div>

              {/* ==================================================
                  CONTENT
              ================================================== */}

              <div className="p-6">
                {/* TITLE */}

                <h2
                  className="
                    text-xl
                    font-bold
                    leading-snug
                  "
                  style={{
                    color: colors.cardTitle,
                  }}
                >
                  {conference.title}
                </h2>

                {/* INFORMATION */}

                <div className="mt-5 space-y-3">
                  {/* DATE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-sm
                    "
                    style={{
                      color: colors.infoText,
                    }}
                  >
                    <CalendarDays
                      size={17}
                      strokeWidth={2}
                      style={{
                        color: colors.icon,
                      }}
                    />

                    <span>{conference.date}</span>
                  </div>

                  {/* LOCATION */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-sm
                    "
                    style={{
                      color: colors.infoText,
                    }}
                  >
                    <MapPin
                      size={17}
                      strokeWidth={2}
                      style={{
                        color: colors.icon,
                      }}
                    />

                    <span>{conference.location}</span>
                  </div>
                </div>

                {/* ==================================================
                    VIEW CONFERENCE
                ================================================== */}

                <button
                  type="button"
                  onClick={(e) => {
                    // Prevent the parent card click
                    // from firing twice.
                    e.stopPropagation();

                    // SAME navigation as card click.
                    handleConferenceClick(conference.id);
                  }}
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                  "
                  style={{
                    color: colors.button,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.buttonHover;

                    e.currentTarget.style.transform = "translateX(3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.button;

                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  View Conference
                  <ArrowRight
                    size={17}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Conferences;
