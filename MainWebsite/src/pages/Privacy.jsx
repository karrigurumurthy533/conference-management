import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  List,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    id: "information",
    title: "Information We Collect",
    content:
      "We collect personal information that you voluntarily provide to us, such as your name, email address, phone number, organization, and details related to conference registration, abstract submission, or newsletter subscription. We may also collect information automatically through your use of our website, such as IP address, browser type, device information, and pages you visit.",
  },
  {
    id: "use-information",
    title: "How We Use Your Information",
    content:
      "We use your information to provide and improve our services, process registrations, communicate with you about upcoming conferences and events, send important updates, and personalize your experience. We may also use your information for internal analytics and website performance.",
  },
  {
    id: "sharing",
    title: "Sharing Your Information",
    content:
      "We do not sell, rent, or trade your personal information. We may share your information with trusted partners and service providers who help us operate our website, process registrations, and deliver our events. These partners are obligated to keep your information confidential.",
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    content:
      "We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand your preferences. You can control cookies through your browser settings.",
  },
  {
    id: "security",
    title: "Data Security",
    content:
      "We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    id: "rights",
    title: "Your Rights",
    content:
      "You have the right to access, update, or delete your personal information at any time. You can also opt-out of receiving promotional emails by following the unsubscribe instructions in our emails.",
  },
  {
    id: "third-party",
    title: "Third-Party Links",
    content:
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites. We encourage you to review their privacy policies before providing any personal information.",
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date. We encourage you to review this policy periodically.",
  },
  {
    id: "contact",
    title: "Contact Us",
    content:
      "If you have any questions or concerns about this Privacy Policy, please contact us at:",
  },
];

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const heroItem = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const sidebarAnimation = {
  hidden: {
    opacity: 0,
    x: -35,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const Privacy = () => {
  const [activeSection, setActiveSection] =
    useState("information");

  const scrollToSection = (id) => {
    setActiveSection(id);

    const element = document.getElementById(id);

    if (!element) return;

    const navbarOffset = 95;

    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - navbarOffset,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#11134d]">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative min-h-[195px] overflow-hidden bg-[#130a3b]">

        {/* Background glow */}

        <div className="absolute inset-0">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute -right-20 -top-24 h-[380px] w-[600px] rounded-full bg-[#5425d8]/20 blur-[80px]"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
            }}
            className="absolute right-[18%] top-[25px] h-[250px] w-[250px] rounded-full border border-[#744cff]/30"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.15,
            }}
            className="absolute right-[20%] top-[45px] h-[210px] w-[210px] rounded-full border border-[#744cff]/20"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.25,
            }}
            className="absolute right-[24%] top-[68px] h-[160px] w-[160px] rounded-full border border-[#744cff]/20"
          />

          {/* Decorative Lines */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="absolute right-[12%] top-[30px] h-px w-[430px] rotate-[20deg] bg-gradient-to-r from-transparent via-[#744cff]/50 to-transparent"
          />

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1.1,
              delay: 0.15,
            }}
            className="absolute right-[5%] top-[105px] h-px w-[500px] -rotate-[15deg] bg-gradient-to-r from-transparent via-[#744cff]/40 to-transparent"
          />

          {/* Glowing Dots */}

          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute right-[33%] top-[30px] h-2 w-2 rounded-full bg-[#7d5cff] shadow-[0_0_15px_#7d5cff]"
          />

          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: 0.4,
            }}
            className="absolute right-[22%] top-[80px] h-2 w-2 rounded-full bg-[#7d5cff] shadow-[0_0_15px_#7d5cff]"
          />

          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: 0.8,
            }}
            className="absolute right-[13%] top-[120px] h-2 w-2 rounded-full bg-[#7d5cff] shadow-[0_0_15px_#7d5cff]"
          />
        </div>

        {/* Hero Content */}

        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex min-h-[195px] max-w-[1040px] items-center px-5"
        >
          <div className="w-full max-w-[500px]">

            {/* Breadcrumb */}

            <motion.div
              variants={heroItem}
              className="mb-4 flex items-center gap-2 text-[11px] text-white/75"
            >
              <Link
                to="/"
                className="transition hover:text-white"
              >
                Home
              </Link>

              <ChevronRight size={12} />

              <span className="text-white/90">
                Privacy Policy
              </span>
            </motion.div>

            {/* Heading */}

            <motion.h1
              variants={heroItem}
              className="text-[32px] font-bold leading-none tracking-[-1px] text-white"
            >
              Privacy Policy
            </motion.h1>

            {/* Description */}

            <motion.p
              variants={heroItem}
              className="mt-4 max-w-[500px] text-[13px] leading-[1.45] text-white/85"
            >
              We value your privacy. This Privacy Policy explains
              how we collect, use, and protect your personal
              information when you visit our website and use our
              services.
            </motion.p>
          </div>

          {/* =====================================================
              HERO SHIELD
          ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
              rotate: -8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: "easeOut",
            }}
            className="absolute right-[13%] top-1/2 hidden -translate-y-1/2 md:block"
          >
            <motion.div
              animate={{
                y: [0, -7, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex h-[130px] w-[130px] items-center justify-center rounded-full border border-[#7549ff]/40"
            >
              <div className="absolute inset-[13px] rounded-full border border-[#7549ff]/35" />

              <div className="absolute inset-[25px] rounded-full border border-[#7549ff]/20" />

              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ShieldCheck
                  size={78}
                  strokeWidth={1.4}
                  className="text-[#8d68ff] drop-shadow-[0_0_18px_rgba(141,104,255,0.7)]"
                />
              </motion.div>

              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute left-[15px] top-[25px] h-2 w-2 rounded-full bg-[#8d68ff] shadow-[0_0_14px_#8d68ff]"
              />

              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 2.3,
                  repeat: Infinity,
                  delay: 0.5,
                }}
                className="absolute bottom-[20px] right-[10px] h-2 w-2 rounded-full bg-[#8d68ff] shadow-[0_0_14px_#8d68ff]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <main className="mx-auto max-w-[1040px] px-5 py-7">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[265px_1fr]">

          {/* =====================================================
              LEFT SIDEBAR
              STICKY CARD
          ===================================================== */}

          <motion.aside
            initial={{
              opacity: 0,
              x: -35,
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
            className="h-fit self-start lg:sticky lg:top-[95px]"
          >
            <div className="rounded-xl bg-gradient-to-br from-[#faf9ff] to-[#f5f3fd] p-4">

              {/* Sidebar Header */}

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
                className="mb-5 flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8e2ff]">
                  <List
                    size={13}
                    className="text-[#5425d8]"
                  />
                </div>

                <h2 className="text-[12px] font-bold text-[#11134d]">
                  On this page
                </h2>
              </motion.div>

              {/* Sidebar Items */}

              <div className="space-y-1">
                {sections.map((section, index) => {
                  const isActive =
                    activeSection === section.id;

                  return (
                    <motion.button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        scrollToSection(section.id)
                      }
                      whileHover={{
                        x: 4,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-1.5 py-2 text-left ${
                        isActive
                          ? "text-[#5425d8]"
                          : "text-[#51617b] hover:text-[#5425d8]"
                      }`}
                    >
                      {/* Number */}

                      <motion.span
                        animate={{
                          scale: isActive ? 1.05 : 1,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                          isActive
                            ? "bg-[#5425d8] text-white shadow-[0_3px_10px_rgba(84,37,216,0.25)]"
                            : "bg-[#e7e5f4] text-[#20205d]"
                        }`}
                      >
                        {index + 1}
                      </motion.span>

                      {/* Title */}

                      <span className="text-[11px] leading-4">
                        {section.title}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          {/* =====================================================
              POLICY CONTENT
          ===================================================== */}

          <div className="min-w-0">

            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
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
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.55,
                  delay: 0.03,
                  ease: "easeOut",
                }}
                className="scroll-mt-[95px] border-b border-[#e7e7ef] py-2.5 first:pt-0"
              >
                <div className="flex gap-4">

                  {/* NUMBER */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    whileHover={{
                      scale: 1.08,
                    }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5425d8] text-[11px] font-bold text-white shadow-[0_3px_8px_rgba(84,37,216,0.2)]"
                  >
                    {index + 1}
                  </motion.div>

                  {/* CONTENT */}

                  <div className="flex-1">

                    <motion.h2
                      initial={{
                        opacity: 0,
                        x: 10,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: 0.08,
                      }}
                      className="text-[13px] font-bold leading-6 text-[#11134d]"
                    >
                      {section.title}
                    </motion.h2>

                    <motion.p
                      initial={{
                        opacity: 0,
                        x: 10,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.45,
                        delay: 0.13,
                      }}
                      className="max-w-[710px] text-[11.5px] leading-[1.45] text-[#46617b]"
                    >
                      {section.content}
                    </motion.p>

                    {/* CONTACT DETAILS */}

                    {section.id === "contact" && (
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
                          duration: 0.45,
                          delay: 0.2,
                        }}
                        className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10.5px] text-[#46617b]"
                      >

                        {/* Email */}

                        <motion.a
                          href="mailto:privacy@globalscion.com"
                          whileHover={{
                            x: 3,
                          }}
                          className="flex items-center gap-2 transition hover:text-[#5425d8]"
                        >
                          <Mail
                            size={13}
                            className="text-[#11134d]"
                            strokeWidth={2}
                          />

                          <span>
                            privacy@globalscion.com
                          </span>
                        </motion.a>

                        <span className="hidden h-4 w-px bg-gray-300 sm:block" />

                        {/* Phone */}

                        <motion.a
                          href="tel:+15551234567"
                          whileHover={{
                            x: 3,
                          }}
                          className="flex items-center gap-2 transition hover:text-[#5425d8]"
                        >
                          <Phone
                            size={13}
                            className="text-[#11134d]"
                            strokeWidth={2}
                          />

                          <span>
                            +1 (555) 123-4567
                          </span>
                        </motion.a>

                        <span className="hidden h-4 w-px bg-gray-300 sm:block" />

                        {/* Address */}

                        <motion.div
                          whileHover={{
                            x: 3,
                          }}
                          className="flex items-center gap-2"
                        >
                          <MapPin
                            size={13}
                            className="text-[#11134d]"
                            strokeWidth={2}
                          />

                          <span>
                            123 Innovation Drive, Dubai, UAE
                          </span>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;