
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  List,
  ShieldCheck,
  CreditCard,
  CalendarX,
  RefreshCcw,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

/* =========================================================
   TERMS & CONDITIONS CONTENT
========================================================= */

const sections = [
  {
    id: "cancellation",
    title: "Cancellation Policy",
    icon: CalendarX,
    content: [
      "If a participant’s visa application is rejected or cancelled by the respective embassy or consulate, the conference organizers will provide a refund of the registration fee.",
      "To process the refund, participants must submit an official visa rejection letter or supporting document issued by the embassy or consulate as proof of the visa denial.",
      "Once the valid documentation is received and verified, the refund will be processed within 7–14 business days. Any applicable bank transaction or administrative charges may be deducted from the refund amount.",
      "We encourage all participants to apply for their visa well in advance and to ensure that all required documentation is submitted accurately to avoid delays.",
      "The organizing committee remains committed to supporting participants and will assist with any required conference invitation letters or documentation for the visa application process.",
    ],
  },

  {
    id: "visa-refusal",
    title: "Visa Refusal & Registration Amount",
    icon: CreditCard,
    content: [
      "In the case of VISA refusal, the paid amount can be transferred to another conference as per the participant’s choice.",
      "Participants who availed discounts on the registration fee are not eligible for refunds.",
      "An exception may apply if the event itself is cancelled, in which case the applicable cancellation policy will be followed.",
    ],
  },

  {
    id: "conference-cancellation",
    title: "Cancellation / Postponement of Conference",
    icon: CalendarX,
    content: [
      "In the event that the congress cannot be held or is postponed due to situations beyond the control of the Conference/Summit organizers, or due to events which are not attributable to wrongful intent or gross negligence of the congress organizers, the congress organizers will refund 100% of the registration fee.",
      "The congress organizers cannot be held liable by participants for any damages, costs, or losses incurred, such as transportation costs, flight booking cancellation charges, accommodation costs, financial losses, or other related expenses.",
    ],
  },

  {
    id: "transfer-policy",
    title: "Transfer Policy",
    icon: RefreshCcw,
    content: [
      "A fully paid registration can be transferred to another related conference within the Organization, only if the participant has a valid reason for their absence.",
      "Transfers are only initiated through requests submitted by email.",
      "If there is a replacement of the registered person, the following details must be provided to the respective conference secretary:",
    ],
    list: [
      "Full name of the replacement participant",
      "Contact number",
      "Email address",
      "Presenting abstract",
      "Title of the abstract",
    ],
  },

  {
    id: "participant-support",
    title: "Participant Support",
    icon: ShieldCheck,
    content: [
      "Our goal is to ensure a smooth and transparent experience for all attendees.",
      "We remain committed to supporting participants throughout the registration and travel preparation process.",
      "Participants may contact the organizing committee for assistance regarding registration, visa documentation, conference invitation letters, cancellations, postponements, or transfer requests.",
    ],
  },

  {
    id: "contact",
    title: "Contact Us",
    icon: Mail,
    content: [
      "If you have any questions regarding these Terms and Conditions, Cancellation Policy, Visa Refusal Policy, Conference Cancellation/Postponement, or Transfer Policy, please contact our organizing team.",
    ],
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
    x: -45,
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

/* =========================================================
   TERMS COMPONENT
========================================================= */

const Terms = () => {
  const [activeSection, setActiveSection] = useState("cancellation");

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

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative min-h-[225px] overflow-hidden bg-[#130a3b]">

        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute -right-20 -top-24 h-[420px] w-[650px] rounded-full bg-[#5425d8]/20 blur-[85px]"
          />

          {/* Circle 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute right-[17%] top-[18px] h-[290px] w-[290px] rounded-full border border-[#744cff]/30"
          />

          {/* Circle 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="absolute right-[19%] top-[38px] h-[245px] w-[245px] rounded-full border border-[#744cff]/25"
          />

          {/* Circle 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute right-[22%] top-[60px] h-[195px] w-[195px] rounded-full border border-[#744cff]/20"
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

        </div>

        {/* Hero Content */}
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex min-h-[225px] max-w-[1180px] items-center px-5"
        >

          <div className="w-full max-w-[650px]">

            {/* Breadcrumb */}
            <motion.div
              variants={heroItem}
              className="mb-5 flex items-center gap-2 text-[13px] text-white/75"
            >
              <Link
                to="/"
                className="transition hover:text-white"
              >
                Home
              </Link>

              <ChevronRight size={14} />

              <span className="text-white/90">
                Terms & Conditions
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={heroItem}
              className="text-[34px] font-bold leading-tight tracking-[-1px] text-white sm:text-[38px]"
            >
              Terms & Conditions
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={heroItem}
              className="mt-4 max-w-[600px] text-[15px] leading-[1.65] text-white/80"
            >
              Please review our cancellation, visa refusal,
              conference postponement, and registration transfer
              policies before completing your registration.
            </motion.p>

          </div>

          {/* Hero Icon */}
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
            className="absolute right-[12%] top-1/2 hidden -translate-y-1/2 md:block"
          >

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex h-[155px] w-[155px] items-center justify-center rounded-full border border-[#7549ff]/40"
            >

              <div className="absolute inset-[14px] rounded-full border border-[#7549ff]/30" />

              <div className="absolute inset-[28px] rounded-full border border-[#7549ff]/20" />

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
                  size={86}
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
                className="absolute left-[15px] top-[28px] h-2 w-2 rounded-full bg-[#926cff] shadow-[0_0_15px_#926cff]"
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

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-[1180px] px-5 py-10">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr]">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <motion.aside
            variants={sidebarAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="h-fit lg:sticky lg:top-6 lg:self-start lg:-ml-10"
          >

            <div className="w-full rounded-2xl border border-[#ebe8f7] bg-gradient-to-br from-[#faf9ff] to-[#f3f0fc] p-5 shadow-[0_8px_30px_rgba(48,35,100,0.06)]">

              {/* Header */}
              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e2ff]">
                  <List
                    size={17}
                    className="text-[#5425d8]"
                  />
                </div>

                <h2 className="text-[15px] font-bold text-[#11134d]">
                  On this page
                </h2>

              </div>

              {/* Menu */}
              <div className="space-y-2">

                {sections.map((section, index) => {

                  const isActive =
                    activeSection === section.id;

                  const Icon = section.icon;

                  return (
                    <motion.button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        scrollToSection(section.id)
                      }
                      whileHover={{ x: 6 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition ${
                        isActive
                          ? "bg-white text-[#5425d8] shadow-[0_3px_12px_rgba(84,37,216,0.08)]"
                          : "text-[#51617b] hover:bg-white/70 hover:text-[#5425d8]"
                      }`}
                    >

                      {/* Number */}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                          isActive
                            ? "bg-[#5425d8] text-white shadow-[0_4px_12px_rgba(84,37,216,0.25)]"
                            : "bg-[#e7e5f4] text-[#20205d]"
                        }`}
                      >
                        {index + 1}
                      </span>

                      {/* Icon */}
                      <Icon
                        size={16}
                        className={
                          isActive
                            ? "text-[#5425d8]"
                            : "text-slate-400"
                        }
                      />

                      {/* Title */}
                      <span className="text-[13px] font-medium leading-5">
                        {section.title}
                      </span>

                    </motion.button>
                  );
                })}

              </div>

            </div>
          </motion.aside>

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <div className="min-w-0">

            {sections.map((section, index) => {

              const Icon = section.icon;

              return (
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
                    amount: 0.12,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.03,
                    ease: "easeOut",
                  }}
                  className="scroll-mt-6 border-b border-[#e7e7ef] py-8 first:pt-0"
                >

                  <div className="flex gap-5">

                    {/* Number */}
                    <motion.div
                      whileHover={{
                        scale: 1.08,
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5425d8] text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(84,37,216,0.2)]"
                    >
                      {index + 1}
                    </motion.div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">

                      {/* Heading */}
                      <div className="flex items-center gap-3">

                        <Icon
                          size={20}
                          className="text-[#5425d8]"
                          strokeWidth={1.8}
                        />

                        <h2 className="text-[19px] font-bold leading-7 text-[#11134d]">
                          {section.title}
                        </h2>

                      </div>

                      {/* Paragraphs */}
                      <div className="mt-4 space-y-4">

                        {section.content.map(
                          (paragraph, paragraphIndex) => (
                            <p
                              key={paragraphIndex}
                              className="text-[14px] leading-[1.8] text-[#46617b]"
                            >
                              {paragraph}
                            </p>
                          )
                        )}

                      </div>

                      {/* Transfer List */}
                      {section.list && (
                        <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50/50 p-5">

                          <p className="mb-4 text-[13px] font-semibold text-[#5425d8]">
                            Replacement participant details required:
                          </p>

                          <ul className="space-y-3">

                            {section.list.map(
                              (item, listIndex) => (
                                <li
                                  key={listIndex}
                                  className="flex items-start gap-3 text-[13px] leading-6 text-[#46617b]"
                                >

                                  <span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-[#5425d8]" />

                                  <span>
                                    {item}
                                  </span>

                                </li>
                              )
                            )}

                          </ul>

                        </div>
                      )}

                      {/* Contact Section */}
                      {section.id === "contact" && (
                        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-4">

                          {/* Email */}
                          <motion.a
                            href="mailto:info@globalscion.com"
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-2.5 text-[13px] text-[#46617b] transition hover:text-[#5425d8]"
                          >
                            <Mail
                              size={17}
                              className="text-[#5425d8]"
                            />

                            info@globalscion.com
                          </motion.a>

                          {/* Phone */}
                          <motion.a
                            href="tel:+443308088650"
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-2.5 text-[13px] text-[#46617b] transition hover:text-[#5425d8]"
                          >
                            <Phone
                              size={17}
                              className="text-[#5425d8]"
                            />

                            +44 330 808 8650
                          </motion.a>

                          {/* Location */}
                          <div className="flex items-center gap-2.5 text-[13px] text-[#46617b]">

                            <MapPin
                              size={17}
                              className="text-[#5425d8]"
                            />

                            GlobalScion Conferences

                          </div>

                        </div>
                      )}

                    </div>
                  </div>

                </motion.section>
              );
            })}

          </div>
        </div>

        {/* =================================================
            FINAL NOTE
        ================================================= */}

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
          className="mt-10 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 p-6"
        >

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
              <ShieldCheck size={19} />
            </div>

            <div>

              <h3 className="text-[15px] font-bold text-[#11134d]">
                Our Commitment
              </h3>

              <p className="mt-2 text-[13px] leading-6 text-[#46617b]">
                Our goal is to ensure a smooth and transparent
                experience for all attendees, and we remain committed
                to supporting participants throughout the registration
                and travel preparation process.
              </p>

            </div>

          </div>

        </motion.div>

      </main>
    </div>
  );
};

export default Terms;
