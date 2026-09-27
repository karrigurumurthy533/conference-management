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
    id: "acceptance",
    title: "Acceptance of Terms",
    content:
      "By accessing and using the GlobalScion website, you agree to comply with and be bound by these Terms and Conditions, as well as any additional terms and conditions that may apply to specific sections of the website or services.",
  },
  {
    id: "use-website",
    title: "Use of Our Website",
    content:
      "You agree to use our website only for lawful purposes and in accordance with these Terms. You must not use our website in any way that may damage, disable, overburden, or impair our services or interfere with any other party’s use and enjoyment of the website.",
  },
  {
    id: "account",
    title: "Account Registration",
    content:
      "Some features of our website may require you to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.",
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content:
      "All content on this website, including text, graphics, logos, images, and software, is the property of GlobalScion or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written permission.",
  },
  {
    id: "user-content",
    title: "User Content",
    content:
      "By submitting content to our website, you grant GlobalScion a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, and distribute your content for the purpose of operating and promoting our services.",
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content:
      "GlobalScion will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our website or services, even if we have been advised of the possibility of such damages.",
  },
  {
    id: "privacy",
    title: "Privacy",
    content:
      "Your use of our website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.",
  },
  {
    id: "changes",
    title: "Changes to Terms",
    content:
      "We reserve the right to modify or replace these Terms and Conditions at any time. Any changes will be posted on this page with the updated effective date. Your continued use of the website after such changes constitutes your acceptance of the new terms.",
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content:
      "These Terms and Conditions are governed by and construed in accordance with the laws of the UAE, without regard to its conflict of law provisions.",
  },
  {
    id: "contact",
    title: "Contact Us",
    content:
      "If you have any questions or concerns about these Terms and Conditions, please contact us at:",
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

const sectionAnimation = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const Terms = () => {
  const [activeSection, setActiveSection] = useState("acceptance");

  const scrollToSection = (id) => {
    setActiveSection(id);

    const element = document.getElementById(id);

    if (!element) return;

    const offset = 25;

    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#11134d]">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}

      <section className="relative min-h-[195px] overflow-hidden bg-[#130a3b]">

        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute -right-20 -top-24 h-[380px] w-[600px] rounded-full bg-[#5425d8]/20 blur-[80px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute right-[17%] top-[18px] h-[270px] w-[270px] rounded-full border border-[#744cff]/30"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="absolute right-[19%] top-[38px] h-[230px] w-[230px] rounded-full border border-[#744cff]/25"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute right-[22%] top-[60px] h-[185px] w-[185px] rounded-full border border-[#744cff]/20"
          />

          {/* Decorative Lines */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute right-[7%] top-[55px] h-px w-[500px] rotate-[20deg] bg-gradient-to-r from-transparent via-[#7957ff]/50 to-transparent"
          />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.3, delay: 0.15 }}
            className="absolute right-[2%] top-[140px] h-px w-[520px] -rotate-[17deg] bg-gradient-to-r from-transparent via-[#7957ff]/40 to-transparent"
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
            className="absolute right-[32%] top-[30px] h-2 w-2 rounded-full bg-[#8061ff] shadow-[0_0_14px_#8061ff]"
          />

          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: 0.5,
            }}
            className="absolute right-[23%] top-[76px] h-2 w-2 rounded-full bg-[#8061ff] shadow-[0_0_14px_#8061ff]"
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
            className="absolute right-[12%] top-[120px] h-2 w-2 rounded-full bg-[#8061ff] shadow-[0_0_14px_#8061ff]"
          />
        </div>

        {/* Hero Content */}

        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex min-h-[195px] max-w-[1040px] items-center px-5"
        >
          <div className="w-full max-w-[520px]">

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
                Terms and Conditions
              </span>
            </motion.div>

            {/* Heading */}

            <motion.h1
              variants={heroItem}
              className="text-[32px] font-bold leading-none tracking-[-1px] text-white"
            >
              Terms and Conditions
            </motion.h1>

            {/* Description */}

            <motion.p
              variants={heroItem}
              className="mt-4 max-w-[500px] text-[13px] leading-[1.5] text-white/85"
            >
              Please read these Terms and Conditions carefully
              before using our website and services. By accessing
              or using our platform, you agree to be bound by these
              terms.
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
            className="absolute right-[14%] top-1/2 hidden -translate-y-1/2 md:block"
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
              className="relative flex h-[135px] w-[135px] items-center justify-center rounded-full border border-[#7549ff]/40"
            >
              <div className="absolute inset-[13px] rounded-full border border-[#7549ff]/30" />

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
                  size={80}
                  strokeWidth={1.4}
                  className="text-[#926cff] drop-shadow-[0_0_18px_rgba(146,108,255,0.75)]"
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
                className="absolute left-[15px] top-[25px] h-2 w-2 rounded-full bg-[#926cff] shadow-[0_0_15px_#926cff]"
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
                className="absolute bottom-[20px] right-[10px] h-2 w-2 rounded-full bg-[#926cff] shadow-[0_0_15px_#926cff]"
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
              STICKY
          ===================================================== */}

          <motion.aside
            variants={sidebarAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="h-fit lg:sticky lg:top-6 lg:self-start"
          >
            <div className="rounded-xl bg-gradient-to-br from-[#faf9ff] to-[#f5f3fd] p-4">

              {/* Sidebar Header */}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
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
              RIGHT CONTENT
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
                  delay: index * 0.03,
                  ease: "easeOut",
                }}
                className="scroll-mt-6 border-b border-[#e7e7ef] py-[11px] first:pt-0"
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
                      delay: 0.08,
                    }}
                    whileHover={{
                      scale: 1.08,
                    }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5425d8] text-[11px] font-bold text-white shadow-[0_3px_8px_rgba(84,37,216,0.2)]"
                  >
                    {index + 1}
                  </motion.div>

                  {/* TEXT */}

                  <div className="min-w-0 flex-1">

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
                        delay: 0.12,
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
                        delay: 0.18,
                      }}
                      className="max-w-[720px] text-[11.5px] leading-[1.45] text-[#46617b]"
                    >
                      {section.content}
                    </motion.p>

                    {/* =================================================
                        CONTACT DETAILS
                    ================================================= */}

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
                          delay: 0.25,
                        }}
                        className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10.5px] text-[#46617b]"
                      >
                        {/* Email */}

                        <motion.a
                          href="mailto:info@globalscion.com"
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
                            info@globalscion.com
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

export default Terms;