
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  Building2,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

const ContactPage = () => {
  const colors = {
    pageBg: "#FFFFFF",
    sectionBg: "#FFFFFF",
    heading: "#7C3AED",
    primary: "#7C3AED",
    primaryLight: "#8B5CF6",
    bodyText: "#4B5563",
    mutedText: "#6B7280",
    cardBg: "#F5F3FF",
    cardBorder: "#DDD6FE",
    inputBg: "#FFFFFF",
    inputBorder: "#E5E7EB",
    inputText: "#111827",
    buttonBg: "#7C3AED",
    buttonHover: "#6D28D9",
    formShadow: "0 10px 30px rgba(124,58,237,0.08)",
  };

  const bannerImage = "/images/contact_banner.png";

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const inputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.primary;
    e.currentTarget.style.boxShadow = `0 0 0 1px ${colors.primary}`;
  };

  const inputBlur = (e) => {
    e.currentTarget.style.borderColor = colors.inputBorder;
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.pageBg,
      }}
    >
      {/* =====================================================
          CONTACT HERO BANNER
      ====================================================== */}

      <motion.section
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: colors.pageBg,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={bannerImage}
          alt="GlobalScion Contact"
          initial={{
            scale: 1.03,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            w-full
            h-[280px]
            sm:h-[330px]
            md:h-[380px]
            lg:h-[430px]
            object-cover
            object-center
          "
        />

        {/* Light Gradient Overlay */}

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(255,255,255,0.95) 0%,
                rgba(255,255,255,0.70) 45%,
                rgba(255,255,255,0) 100%
              )
            `,
          }}
        />

        {/* Banner Content */}

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <motion.div
              className="max-w-xl"
              initial={{
                opacity: 0,
                x: -50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }}
            >
              {/* Small Heading */}

              <motion.div
                className="mb-3 flex items-center gap-3"
                initial={{
                  opacity: 0,
                  y: -15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                }}
              >
                <span
                  className="w-10 h-[2px]"
                  style={{
                    backgroundColor: colors.primary,
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
                    color: colors.primary,
                  }}
                >
                  GET IN TOUCH
                </span>
              </motion.div>

              {/* Main Heading */}

              <motion.h1
                className="
                  text-4xl
                  sm:text-5xl
                  md:text-6xl
                  font-bold
                  leading-tight
                "
                style={{
                  color: colors.primary,
                }}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.4,
                }}
              >
                Let's Connect
              </motion.h1>

              {/* Description */}

              <motion.p
                className="
                  mt-4
                  max-w-lg
                  text-sm
                  sm:text-base
                  md:text-lg
                  leading-relaxed
                "
                style={{
                  color: colors.bodyText,
                }}
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
                  delay: 0.55,
                }}
              >
                Have questions about our conferences, registrations,
                or partnerships? Our team is here to help you.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* =====================================================
          MAIN CONTACT SECTION
      ====================================================== */}

      <section
        className="py-14 px-6"
        style={{
          backgroundColor: colors.sectionBg,
        }}
      >
        <div
          className="
            max-w-7xl
            mx-auto
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-8
          "
        >
          {/* =================================================
              LEFT SIDE - CONTACT INFORMATION
          ================================================= */}

          <motion.div
            className="lg:col-span-1"
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={fadeUp}
          >
            {/* Heading */}

            <h2
              className="text-2xl font-bold mb-3"
              style={{
                color: colors.primary,
              }}
            >
              Let's Connect
            </h2>

            {/* Description */}

            <p
              className="text-sm leading-6 mb-7"
              style={{
                color: colors.bodyText,
              }}
            >
              We would love to hear from you. Reach out to us for conference
              information, registration support, sponsorship opportunities,
              and general enquiries.
            </p>

            {/* Contact Cards */}

            <div className="space-y-4">
              {/* EMAIL */}

              <motion.div
                variants={cardAnimation}
                whileHover={{
                  x: 6,
                  scale: 1.02,
                  boxShadow: "0px 8px 20px rgba(124,58,237,0.10)",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-lg
                  border
                  cursor-pointer
                "
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                }}
              >
                <motion.div
                  whileHover={{
                    rotate: 10,
                    scale: 1.1,
                  }}
                  className="
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  <Mail
                    className="text-white"
                    size={18}
                  />
                </motion.div>

                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: colors.mutedText,
                    }}
                  >
                    Email Us
                  </p>

                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: colors.primaryLight,
                    }}
                  >
                    info@globalscion.com
                  </p>
                </div>
              </motion.div>

              {/* PHONE */}

              <motion.div
                variants={cardAnimation}
                whileHover={{
                  x: 6,
                  scale: 1.02,
                  boxShadow: "0px 8px 20px rgba(124,58,237,0.10)",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-lg
                  border
                  cursor-pointer
                "
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                }}
              >
                <motion.div
                  whileHover={{
                    rotate: -10,
                    scale: 1.1,
                  }}
                  className="
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  <Phone
                    className="text-white"
                    size={18}
                  />
                </motion.div>

                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: colors.mutedText,
                    }}
                  >
                    Call Us
                  </p>

                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: colors.primaryLight,
                    }}
                  >
                    +91 98765 43210
                  </p>
                </div>
              </motion.div>

              {/* LOCATION */}

              <motion.div
                variants={cardAnimation}
                whileHover={{
                  x: 6,
                  scale: 1.02,
                  boxShadow: "0px 8px 20px rgba(124,58,237,0.10)",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-lg
                  border
                  cursor-pointer
                "
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                }}
              >
                <motion.div
                  whileHover={{
                    y: -4,
                    scale: 1.1,
                  }}
                  className="
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  <MapPin
                    className="text-white"
                    size={18}
                  />
                </motion.div>

                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: colors.mutedText,
                    }}
                  >
                    Our Office
                  </p>

                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: colors.primaryLight,
                    }}
                  >
                    Hyderabad, Telangana, India
                  </p>
                </div>
              </motion.div>

              {/* WORKING HOURS */}

              <motion.div
                variants={cardAnimation}
                whileHover={{
                  x: 6,
                  scale: 1.02,
                  boxShadow: "0px 8px 20px rgba(124,58,237,0.10)",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-lg
                  border
                  cursor-pointer
                "
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                }}
              >
                <motion.div
                  whileHover={{
                    rotate: 10,
                    scale: 1.1,
                  }}
                  className="
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  <Clock
                    className="text-white"
                    size={18}
                  />
                </motion.div>

                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: colors.mutedText,
                    }}
                  >
                    Working Hours
                  </p>

                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: colors.primaryLight,
                    }}
                  >
                    Mon - Fri, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* =================================================
              RIGHT SIDE - CONTACT FORM
          ================================================= */}

          <motion.div
            className="lg:col-span-2"
            initial={{
              opacity: 0,
              x: 50,
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
              ease: "easeOut",
            }}
          >
            <motion.div
              className="
                border
                rounded-xl
                p-6
                md:p-8
              "
              style={{
                backgroundColor: colors.inputBg,
                borderColor: colors.cardBorder,
                boxShadow: colors.formShadow,
              }}
              whileHover={{
                boxShadow: "0px 15px 35px rgba(124,58,237,0.10)",
              }}
              transition={{
                duration: 0.3,
              }}
            >
              {/* Form Heading */}

              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  color: colors.primary,
                }}
              >
                Send Us a Message
              </h2>

              <p
                className="text-sm mb-7"
                style={{
                  color: colors.mutedText,
                }}
              >
                Fill out the form below and our team will get back to you.
              </p>

              <form className="space-y-5">
                {/* NAME + EMAIL */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.1,
                    }}
                  >
                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        mb-2
                      "
                      style={{
                        color: "#374151",
                      }}
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={17}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                        "
                        style={{
                          color: colors.primary,
                        }}
                      />

                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="
                          w-full
                          h-11
                          pl-10
                          pr-4
                          rounded-md
                          border
                          text-sm
                          outline-none
                          transition-all
                        "
                        style={{
                          backgroundColor: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>
                  </motion.div>

                  {/* Email */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                  >
                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        mb-2
                      "
                      style={{
                        color: "#374151",
                      }}
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                        "
                        style={{
                          color: colors.primary,
                        }}
                      />

                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="
                          w-full
                          h-11
                          pl-10
                          pr-4
                          rounded-md
                          border
                          text-sm
                          outline-none
                          transition-all
                        "
                        style={{
                          backgroundColor: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* ORGANIZATION + PHONE */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Organization */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.25,
                    }}
                  >
                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        mb-2
                      "
                      style={{
                        color: "#374151",
                      }}
                    >
                      Organization
                    </label>

                    <div className="relative">
                      <Building2
                        size={17}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                        "
                        style={{
                          color: colors.primary,
                        }}
                      />

                      <input
                        type="text"
                        placeholder="Organization name"
                        className="
                          w-full
                          h-11
                          pl-10
                          pr-4
                          rounded-md
                          border
                          text-sm
                          outline-none
                          transition-all
                        "
                        style={{
                          backgroundColor: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>
                  </motion.div>

                  {/* Phone */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                  >
                    <label
                      className="
                        block
                        text-sm
                        font-semibold
                        mb-2
                      "
                      style={{
                        color: "#374151",
                      }}
                    >
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                        "
                        style={{
                          color: colors.primary,
                        }}
                      />

                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        className="
                          w-full
                          h-11
                          pl-10
                          pr-4
                          rounded-md
                          border
                          text-sm
                          outline-none
                          transition-all
                        "
                        style={{
                          backgroundColor: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* SUBJECT */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.35,
                  }}
                >
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      mb-2
                    "
                    style={{
                      color: "#374151",
                    }}
                  >
                    Subject
                  </label>

                  <div className="relative">
                    <MessageSquare
                      size={17}
                      className="
                        absolute
                        left-3
                        top-3
                      "
                      style={{
                        color: colors.primary,
                      }}
                    />

                    <input
                      type="text"
                      placeholder="What would you like to know?"
                      className="
                        w-full
                        h-11
                        pl-10
                        pr-4
                        rounded-md
                        border
                        text-sm
                        outline-none
                        transition-all
                      "
                      style={{
                        backgroundColor: colors.inputBg,
                        borderColor: colors.inputBorder,
                        color: colors.inputText,
                      }}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                  </div>
                </motion.div>

                {/* MESSAGE */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.4,
                  }}
                >
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      mb-2
                    "
                    style={{
                      color: "#374151",
                    }}
                  >
                    Message
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Write your message..."
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-md
                      border
                      text-sm
                      outline-none
                      resize-none
                      transition-all
                    "
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.inputBorder,
                      color: colors.inputText,
                    }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                </motion.div>

                {/* SEND BUTTON */}

                <motion.button
                  type="submit"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.45,
                  }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 8px 20px rgba(124,58,237,0.20)",
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-7
                    h-11
                    rounded-md
                    text-white
                    text-sm
                    font-semibold
                    transition-all
                    duration-200
                  "
                  style={{
                    backgroundColor: colors.buttonBg,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.buttonHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.buttonBg;
                  }}
                >
                  Send Message

                  <motion.span
                    whileHover={{
                      x: 4,
                    }}
                  >
                    <Send size={16} />
                  </motion.span>
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <motion.section
        className="px-6 pb-14"
        initial={{
          opacity: 0,
          y: 40,
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
            max-w-7xl
            mx-auto
            rounded-xl
            border
            py-8
            px-6
            text-center
          "
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          }}
        >
          <motion.h3
            className="
              text-xl
              md:text-2xl
              font-bold
            "
            style={{
              color: colors.primary,
            }}
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            We Are Here to Help
          </motion.h3>

          <p
            className="text-sm mt-2"
            style={{
              color: colors.mutedText,
            }}
          >
            Connect with our team and discover how we can support your next
            conference.
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactPage;
