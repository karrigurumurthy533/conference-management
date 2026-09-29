import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const conferences = [
  {
    id: "autism-research",
    title: "2nd International Conference on Autism Research and Innovations",
    category: "Autism Research",
    subtitle:
      "Next-Generation Autism Research: AI, Neuroscience, Genetics & Personalized Intervention",
    date: "April 06-07, 2027",
    location: "Webinar",
    mode: "Webinar",
    participants: "Global",
    image:
      "https://globalscion.com/wp-content/uploads/2026/09/vitaly-gariev-QRK_LW8-cKM-unsplash-scaled.jpg",
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
  // NAVIGATE
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
            Explore Our Conference
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
            Join the 2nd International Conference on Autism Research
            and Innovations, bringing together researchers, clinicians,
            educators, advocates, families and professionals from around
            the world.
          </motion.p>
        </div>
      </section>

      {/* ======================================================
          SUBSCRIBE TO MAILING LIST
      ====================================================== */}

      <section
        className="border-y px-6 py-5"
        style={{
          backgroundColor: "#FAF7FF",
          borderColor: "#E9DDFB",
        }}
      >
        <div className="mx-auto max-w-7xl">

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.4,
            }}
            className="flex flex-col items-center gap-4 lg:flex-row"
          >

            {/* TITLE */}

            <div className="shrink-0 text-center lg:w-[220px] lg:text-left">

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                "
                style={{
                  color: "#7C3AED",
                }}
              >
                Stay Connected
              </p>

              <h2
                className="mt-0.5 text-base font-bold"
                style={{
                  color: "#4C1D95",
                }}
              >
                Subscribe to Our Mailing List
              </h2>

            </div>

            {/* NAME */}

            <div className="w-full lg:flex-1">

              <input
                type="text"
                placeholder="Name"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  bg-white
                  px-3
                  text-xs
                  outline-none
                  transition-all
                  focus:ring-2
                  focus:ring-purple-200
                "
                style={{
                  borderColor: "#E9DDFB",
                }}
              />

            </div>

            {/* EMAIL */}

            <div className="w-full lg:flex-1">

              <input
                type="email"
                placeholder="Email"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  bg-white
                  px-3
                  text-xs
                  outline-none
                  transition-all
                  focus:ring-2
                  focus:ring-purple-200
                "
                style={{
                  borderColor: "#E9DDFB",
                }}
              />

            </div>

            {/* PHONE */}

            <div className="w-full lg:flex-1">

              <input
                type="tel"
                placeholder="Phone Number"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  bg-white
                  px-3
                  text-xs
                  outline-none
                  transition-all
                  focus:ring-2
                  focus:ring-purple-200
                "
                style={{
                  borderColor: "#E9DDFB",
                }}
              />

            </div>

            {/* CONFERENCE */}

            <div className="w-full lg:flex-1">

              <select
                defaultValue=""
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  bg-white
                  px-3
                  text-xs
                  outline-none
                  transition-all
                  focus:ring-2
                  focus:ring-purple-200
                "
                style={{
                  borderColor: "#E9DDFB",
                  color: "#6B7280",
                }}
              >

                <option value="" disabled>
                  Select Conference
                </option>

                {conferences.map((conference) => (
                  <option
                    key={conference.id}
                    value={conference.id}
                  >
                    {conference.title}
                  </option>
                ))}

              </select>

            </div>

            {/* SUBSCRIBE BUTTON */}

            <button
              type="button"
              className="
                h-10
                shrink-0
                rounded-lg
                px-5
                text-xs
                font-semibold
                text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
              "
              style={{
                backgroundColor: "#7C3AED",
                boxShadow:
                  "0 5px 14px rgba(124,58,237,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#5B21B6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#7C3AED";
              }}
            >
              Subscribe
            </button>

          </motion.div>
        </div>
      </section>

      {/* ======================================================
          CONFERENCE
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

              onClick={() =>
                handleConferenceClick(conference.id)
              }

              onKeyDown={(e) => {

                if (
                  e.key === "Enter" ||
                  e.key === " "
                ) {
                  e.preventDefault();

                  handleConferenceClick(
                    conference.id
                  );
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
                    backgroundColor:
                      colors.badgeBg,
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

                {/* SUBTITLE */}

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                  "
                  style={{
                    color: colors.infoText,
                  }}
                >
                  {conference.subtitle}
                </p>

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

                    <span>
                      {conference.date}
                    </span>

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

                    <span>
                      {conference.location}
                    </span>

                  </div>

                </div>

                {/* VIEW CONFERENCE */}

                <button
                  type="button"

                  onClick={(e) => {

                    e.stopPropagation();

                    handleConferenceClick(
                      conference.id
                    );
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

                    e.currentTarget.style.color =
                      colors.buttonHover;

                    e.currentTarget.style.transform =
                      "translateX(3px)";
                  }}

                  onMouseLeave={(e) => {

                    e.currentTarget.style.color =
                      colors.button;

                    e.currentTarget.style.transform =
                      "translateX(0)";
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