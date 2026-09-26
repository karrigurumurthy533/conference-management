
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const violetFilter =
  "brightness(0) saturate(100%) invert(35%) sepia(95%) saturate(4000%) hue-rotate(250deg) brightness(95%) contrast(95%)";

const Footer = () => {
  const violet = "#ad83f7";
  const lightViolet = "#442f74";
  const textColor = "#f2eef7";

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
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
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const linkHover = {
    whileHover: {
      x: 4,
    },
    transition: {
      duration: 0.2,
    },
  };

  return (
    <footer
      className="w-full transition-colors duration-500"
      style={{
        backgroundColor: lightViolet,
        color: violet,
      }}
    >
      <div
        className="border-b"
        style={{
          backgroundColor: "#442f74",
          borderColor: "#9d8fdd",
        }}
      >
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
          className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-6 px-6 py-6 md:grid-cols-4"
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
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#DDD6FE",
              }}
            >
              <img
                src="/svgs/earth-globe.svg"
                alt="Global Attendees"
                className="h-7 w-7 object-contain"
                style={{
                  filter: violetFilter,
                }}
              />
            </motion.div>

            <div>
              <h3
                className="text-[25px] font-bold leading-none"
                style={{
                  color: violet,
                }}
              >
                4,800+
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: textColor,
                }}
              >
                Global Attendees
              </p>
            </div>
          </motion.div>

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
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#DDD6FE",
              }}
            >
              <img
                src="/svgs/countries.svg"
                alt="Countries"
                className="h-7 w-7 object-contain"
                style={{
                  filter: violetFilter,
                }}
              />
            </motion.div>

            <div>
              <h3
                className="text-[25px] font-bold leading-none"
                style={{
                  color: violet,
                }}
              >
                60+
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: textColor,
                }}
              >
                Countries
              </p>
            </div>
          </motion.div>

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
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#DDD6FE",
              }}
            >
              <img
                src="/svgs/conferences.svg"
                alt="Conferences"
                className="h-7 w-7 object-contain"
                style={{
                  filter: violetFilter,
                }}
              />
            </motion.div>

            <div>
              <h3
                className="text-[25px] font-bold leading-none"
                style={{
                  color: violet,
                }}
              >
                25+
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: textColor,
                }}
              >
                Conferences
              </p>
            </div>
          </motion.div>

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
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#DDD6FE",
              }}
            >
              <img
                src="/svgs/peoples.svg"
                alt="Speakers"
                className="h-7 w-7 object-contain"
                style={{
                  filter: violetFilter,
                }}
              />
            </motion.div>

            <div>
              <h3
                className="text-[25px] font-bold leading-none"
                style={{
                  color: violet,
                }}
              >
                300+
              </h3>

              <p
                className="mt-1 text-sm"
                style={{
                  color: textColor,
                }}
              >
                Speakers
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="grid gap-9 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.35fr]"
        >
          <motion.div variants={fadeUp}>
            <motion.a
              href="/"
              whileHover={{
                x: 3,
              }}
              transition={{
                duration: 0.2,
              }}
              className="mb-4 inline-flex items-center gap-3"
            >
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: 4,
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#DDD6FE",
                }}
              >
                <span
                  className="text-xl font-bold"
                  style={{
                    color: violet,
                  }}
                >
                  G
                </span>
              </motion.div>

              <div>
                <h2
                  className="text-lg font-bold leading-tight"
                  style={{
                    color: violet,
                  }}
                >
                  GlobalScion
                </h2>

                <p
                  className="text-sm"
                  style={{
                    color: textColor,
                  }}
                >
                  Conferences
                </p>
              </div>
            </motion.a>

            <p
              className="max-w-xs text-sm leading-6"
              style={{
                color: textColor,
              }}
            >
              Bringing people, ideas and innovation together for a better
              tomorrow.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {[
                ["linkedin.svg", "LinkedIn"],
                ["instagram.svg", "Instagram"],
                ["youtube.svg", "YouTube"],
                ["facebook.svg", "Facebook"],
              ].map(([icon, label]) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  whileHover={{
                    y: -4,
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border"
                  style={{
                    borderColor: "#C4B5FD",
                    backgroundColor: "#EDE9FE",
                  }}
                >
                  <img
                    src={`/svgs/${icon}`}
                    alt={label}
                    className="h-5 w-5 object-contain"
                    style={{
                      filter: violetFilter,
                    }}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wide"
              style={{
                color: violet,
              }}
            >
              Quick Links
            </h3>

            <ul
              className="space-y-2.5 text-sm"
              style={{
                color: textColor,
              }}
            >
              {[
                ["Home", "/"],
                ["Conferences", "/conferences"],
                ["Speakers", "/speakers"],
                ["Program", "/program"],
                ["About", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    {...linkHover}
                    className="inline-block transition-colors"
                    style={{
                      color: textColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = violet;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textColor;
                    }}
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wide"
              style={{
                color: violet,
              }}
            >
              Conferences
            </h3>

            <ul
              className="space-y-2.5 text-sm"
              style={{
                color: textColor,
              }}
            >
              {[
                ["Upcoming Events", "/conferences"],
                ["Past Conferences", "/past-conferences"],
                ["Conference Themes", "/conference-themes"],
                ["Submit Abstract", "/submit-abstract"],
                ["Register Now", "/register"],
              ].map(([label, href]) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    {...linkHover}
                    className="inline-block transition-colors"
                    style={{
                      color: textColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = violet;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textColor;
                    }}
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wide"
              style={{
                color: violet,
              }}
            >
              Resources
            </h3>

            <ul
              className="space-y-2.5 text-sm"
              style={{
                color: textColor,
              }}
            >
              {[
                ["FAQ", "/faq"],
                ["Help Center", "/help-center"],
                ["Terms & Conditions", "/terms"],
                ["Privacy Policy", "/privacy"],
                ["Sitemap", "/sitemap"],
              ].map(([label, href]) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    {...linkHover}
                    className="inline-block transition-colors"
                    style={{
                      color: textColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = violet;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textColor;
                    }}
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wide"
              style={{
                color: violet,
              }}
            >
              Contact Us
            </h3>

            <div
              className="space-y-3.5 text-sm"
              style={{
                color: textColor,
              }}
            >
              <motion.div
                whileHover={{
                  x: 3,
                }}
                className="flex items-start gap-3"
              >
                <MapPin
                  size={19}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                  style={{
                    color: violet,
                  }}
                />

                <span>Bangalore, India</span>
              </motion.div>

              <motion.div
                whileHover={{
                  x: 3,
                }}
                className="flex items-start gap-3"
              >
                <Phone
                  size={19}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                  style={{
                    color: violet,
                  }}
                />

                <a
                  href="tel:+918045679710"
                  className="transition-colors"
                  style={{
                    color: textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = violet;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = textColor;
                  }}
                >
                  +91 8045 679 710
                </a>
              </motion.div>

              <motion.div
                whileHover={{
                  x: 3,
                }}
                className="flex items-start gap-3"
              >
                <Mail
                  size={19}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                  style={{
                    color: violet,
                  }}
                />

                <a
                  href="mailto:info@globalscion.com"
                  className="break-all transition-colors"
                  style={{
                    color: textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = violet;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = textColor;
                  }}
                >
                  info@globalscion.com
                </a>
              </motion.div>
            </div>

            <motion.div
              variants={fadeUp}
              className="mt-6"
            >
              <h4
                className="mb-3 text-sm font-semibold"
                style={{
                  color: violet,
                }}
              >
                Subscribe to Our Newsletter
              </h4>

              <div
                className="flex h-10 overflow-hidden rounded-lg"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DDD6FE",
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="min-w-0 flex-1 bg-transparent px-4 text-xs outline-none"
                  style={{
                    color: textColor,
                  }}
                />

                <motion.button
                  type="button"
                  aria-label="Subscribe"
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  className="flex w-12 shrink-0 items-center justify-center text-white"
                  style={{
                    backgroundColor: violet,
                  }}
                >
                  <Send
                    size={18}
                    strokeWidth={1.8}
                  />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
        className="border-t"
        style={{
          borderColor: "#DDD6FE",
        }}
      >
        <div
          className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 text-xs md:flex-row md:items-center md:justify-between"
          style={{
            color: textColor,
          }}
        >
          <p>
            © 2025 GlobalScion Conferences. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <motion.a
              href="/terms"
              whileHover={{
                y: -1,
              }}
              className="transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = violet;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = textColor;
              }}
            >
              Terms & Conditions
            </motion.a>

            <span
              className="h-3 w-px"
              style={{
                backgroundColor: "#C4B5FD",
              }}
            />

            <motion.a
              href="/privacy"
              whileHover={{
                y: -1,
              }}
              className="transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = violet;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = textColor;
              }}
            >
              Privacy Policy
            </motion.a>

            <span
              className="h-3 w-px"
              style={{
                backgroundColor: "#C4B5FD",
              }}
            />

            <motion.a
              href="/help-center"
              whileHover={{
                y: -1,
              }}
              className="transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = violet;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = textColor;
              }}
            >
              Help Center
            </motion.a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
