
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
    title:
      "International Conference on Oncology Research & AI Innovations",
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

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: colors.pageBg,
      }}
    >
      <section
        className="
          relative
          overflow-hidden
          py-20
          px-6
        "
        style={{
          backgroundColor: colors.headerBg,
        }}
      >
        <div className="relative max-w-7xl mx-auto text-center">
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
            }}
            className="
              text-sm
              font-semibold
              tracking-[0.2em]
              uppercase
            "
            style={{
              color: colors.eyebrow,
            }}
          >
            GlobalScion Conferences
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="
              mt-3
              text-4xl
              md:text-5xl
              font-bold
            "
            style={{
              color: colors.heading,
            }}
          >
            Explore Our Conferences
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="
              max-w-2xl
              mx-auto
              mt-5
              leading-7
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

      <section
        className="
          py-20
          px-6
        "
        style={{
          backgroundColor: colors.sectionBg,
        }}
      >
        <div
          className="
            max-w-7xl
            mx-auto
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
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
              }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -7,
                boxShadow: colors.cardHoverShadow,
              }}
              className="
                group
                overflow-hidden
                rounded-2xl
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
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-105
                    transition-transform
                    duration-700
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

                <span
                  className="
                    absolute
                    bottom-4
                    left-4
                    px-3
                    py-1.5
                    rounded-full
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

              <div className="p-6">
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

                <div className="mt-5 space-y-3">
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
                      style={{
                        color: colors.icon,
                      }}
                    />
                    {conference.date}
                  </div>

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
                      style={{
                        color: colors.icon,
                      }}
                    />
                    {conference.location}
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/conference/${conference.id}`)
                  }
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
                  <ArrowRight size={17} />
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
