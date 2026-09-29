
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  List,
  Mail,
  ShieldCheck,
  Database,
  Eye,
  Share2,
  Cookie,
  UserCheck,
  FileText,
  Lock,
  CalendarDays,
} from "lucide-react";

/* =========================================================
   GLOBAL PRIVACY POLICY CONTENT
========================================================= */

const sections = [
  {
    id: "introduction",
    title: "Global Privacy Policy",
    icon: ShieldCheck,
    content: [
      "To be at the forefront of innovation and provide a unique platform for the global scientific community to share their diverse perspectives which empower latest research outcomes in science and technology.",
      "This Global Privacy Policy describes the types of Personal Data we collect through our services and via our online presence, which include our main website at scientificsummits.org, as well as services that we enable internet users to access, such as our conferences Scientific Summits and their sub–Scientific Summits (collectively Account Sites).",
      "This policy also describes how we use Personal Data, with whom we share it, your rights and choices, and how you can contact us about our privacy practices.",
      "This policy does not apply to third-party websites, products, or services, even if they link to our Services or Sites, and you should consider the privacy practices of those third-parties carefully.",
    ],
  },

  {
    id: "personal-data",
    title: "Personal Data We Collect",
    icon: Database,
    content: [
      "Personal Data is any information that relates to an identified or identifiable individual. The Personal Data that you provide directly to us through our Sites will be apparent from the context in which you provide the data.",
      "When you are interested towards our services, we will collect your Full Name, E-mail, Phone Number, Address, Photograph and Biography.",
      "When you fill-in our online form to contact our customer support team, we collect your full name, E-mail, Phone Number and anything else you tell us about your needs and timeline.",
      "When you submit your research paper, abstract, presentation, or poster, we will collect your research interest name, your name, your contact details and copy of the research paper, abstract, presentation, or poster.",
      "When you register for our services, we will collect your full name, E-mail, Phone number, Address and Register amount. We will not collect or store any Credit/Debit card details when you register through online.",
      "When you subscribe for our newsletters, we will collect your name and E-mail.",
      "When you respond to our emails or surveys, we collect your email address, name and any other information you choose to include in the body of your email or response.",
      "We may also collect information relating to opportunities to deliver a presentation at our conferences and events.",
      "If you contact us by phone, we will collect your name and phone number.",
    ],
  },

  {
    id: "cookies",
    title: "Cookies & Website Technologies",
    icon: Cookie,
    content: [
      "Our sites use cookies and other technologies to function effectively. These technologies record information about your use of our Sites.",
      "Browser and device data may include IP address, device type, operating system and Internet browser type, screen resolution, operating system name and version, device manufacturer and model, language, plug-ins, add-ons and the language version of the Sites you are visiting.",
      "Usage data may include time spent on the Sites, Scientific Summits visited, links clicked, language preferences, and the Scientific Summits that led or referred you to our Sites.",
    ],
  },

  {
    id: "use-information",
    title: "How We Use Personal Data",
    icon: Eye,
    content: [
      "We may send you email marketing communications about our services, invite you to participate in our events or surveys, or otherwise communicate with you for marketing purposes, provided that we do so in accordance with the consent requirements that are imposed by applicable law.",
      "When we collect your business contact details through our participation at trade shows or other events, we may use the information to follow-up with you regarding an event, send you information that you have requested on our products and services and, with your permission, include you on our marketing information campaigns.",
      "When you visit our Sites or online services, both we and certain third parties collect information about your online activities over time and across different sites to provide you with advertising about products and services tailored to your individual interests. This type of advertising is called interest-based advertising.",
      "These third parties may place or recognize a unique cookie or other technology on your browser, including the use of pixel tags. Where required by applicable law, we will obtain your consent prior to processing of your information for the purpose of interest-based advertising.",
      "You may see our ads on other websites or mobile apps because we participate in advertising networks. Ad networks allow us to target our messaging to users based on a range of factors, including demographic data, users' inferred interests and browsing context.",
      "This technology also helps us track the effectiveness of our marketing efforts and understand if you have seen one of our advertisements.",
    ],
  },

  {
    id: "disclosure",
    title: "How We Disclose Personal Data",
    icon: Share2,
    content: [
      "Scientific Summits does not sell personal data to marketers or unaffiliated third parties. We share your personal data with trusted entities as outlined below.",
      "We share Personal Data with other Scientific Summits entities in order to provide our Services and for internal administration purposes.",
      "We share Personal Data with a limited number of our service providers. We have service providers that provide services on our behalf, such as Hotels, Banks, Payment Gateways, Logistics, Website design & hosting, Customer Service, Email Delivery Services and Auditing Services.",
      "These service providers may need to access Personal Data to perform their services. We authorize such service providers to use or disclose the Personal Data only as necessary to perform services on our behalf or comply with legal requirements.",
      "We require such service providers to contractually commit to protect the security and confidentiality of Personal Data they process on our behalf.",
      "In the event that we enter into, or intend to enter into, a situation that alters the structure of our business, such as a reorganization, merger, sale, joint venture, assignment, transfer, change of control, or other disposition of all or any portion of our business, we may share Personal Data with third parties for the purpose of facilitating and completing the transaction.",
      "We share Personal Data as we believe necessary to comply with applicable law, enforce our contractual rights, protect the rights, privacy, safety and property of Scientific Summits, you or others, and respond to requests from courts, law enforcement agencies, regulatory agencies, and other public and government authorities, which may include authorities outside your country of residence.",
    ],
  },

  {
    id: "rights",
    title: "Your Rights & Choices",
    icon: UserCheck,
    content: [
      "You have choices regarding our use and disclosure of your Personal Data.",
      "If you no longer want to receive marketing-related emails from us, you may opt-out via the unsubscribe link included in such emails. We will try to comply with your request as soon as reasonably practicable.",
      "If you would like to review, correct, or update Personal Data that you have previously disclosed to us, you may do so by contacting us.",
      "Depending on your location and subject to applicable law, you may have the following rights with regard to the Personal Data we control about you.",
    ],
    list: [
      "The right to request confirmation of whether Scientific Summits processes Personal Data relating to you, and if so, to request a copy of that Personal Data.",
      "The right to request that Scientific Summits rectifies or updates your Personal Data that is inaccurate, incomplete or outdated.",
      "The right to request that Scientific Summits erase your Personal Data in certain circumstances provided by law.",
      "The right to request that Scientific Summits restrict the use of your Personal Data in certain circumstances.",
      "The right to request that we export to another company, where technically feasible, your Personal Data that we hold in order to provide Services to you.",
      "Where the processing of your Personal Data is based on your previously given consent, you have the right to withdraw your consent at any time.",
      "You may also have the right to object to the processing of your Personal Data on grounds relating to your particular situation.",
    ],
  },

  {
    id: "data-requests",
    title: "Data Protection Requests",
    icon: FileText,
    content: [
      "In order to exercise your data protection rights, you may contact Scientific Summits as described in the Contact Us section below.",
      "We take each request seriously. We will comply with your request to the extent required by applicable law.",
      "We will not be able to respond to a request if we no longer hold your Personal Data.",
      "If you feel that you have not received a satisfactory response from us, you may consult with the data protection authority in your country.",
      "For your protection, we may need to verify your identity before responding to your request, such as verifying that the email address from which you send the request matches your email address that we have on file.",
      "If we no longer need to process Personal Data about you in order to provide our Services or our Sites, we will not maintain, acquire or process additional information in order to identify you for the purpose of responding to your request.",
    ],
  },

  {
    id: "security",
    title: "Data Security & Retention",
    icon: Lock,
    content: [
      "We make reasonable efforts to ensure a level of security appropriate to the risk associated with the processing of Personal Data.",
      "We maintain organizational, technical and administrative measures designed to protect Personal Data within our organization against unauthorized access, destruction, loss, alteration or misuse.",
      "Your Personal Data is only accessible to a limited number of personnel who need access to the information to perform their duties.",
      "Unfortunately, no data transmission or storage system can be guaranteed to be 100% secure.",
      "If you have reason to believe that your interaction with us is no longer secure, for example, if you feel that the security of your account has been compromised, please contact us immediately.",
    ],
  },

  {
    id: "contact",
    title: "Contact Us",
    icon: Mail,
    content: [
      "If you have any questions or complaints about this Privacy Policy, please contact us electronically using the contact details below.",
    ],
  },

  {
    id: "updated",
    title: "Policy Update",
    icon: CalendarDays,
    content: [
      "This Privacy Policy was updated on May 05, 2025.",
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
   PRIVACY COMPONENT
========================================================= */

const Privacy = () => {
  const [activeSection, setActiveSection] =
    useState("introduction");

  const scrollToSection = (id) => {
    setActiveSection(id);

    const element = document.getElementById(id);

    if (!element) return;

    const navbarOffset = 95;

    const elementPosition =
      element.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: elementPosition - navbarOffset,
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
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.2,
            }}
            className="absolute right-[17%] top-[18px] h-[290px] w-[290px] rounded-full border border-[#744cff]/30"
          />

          {/* Circle 2 */}

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
              duration: 1.1,
              delay: 0.15,
            }}
            className="absolute right-[19%] top-[38px] h-[245px] w-[245px] rounded-full border border-[#744cff]/25"
          />

          {/* Circle 3 */}

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
              delay: 0.3,
            }}
            className="absolute right-[22%] top-[60px] h-[195px] w-[195px] rounded-full border border-[#744cff]/20"
          />

          {/* Decorative Line 1 */}

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
              duration: 1.2,
            }}
            className="absolute right-[7%] top-[55px] h-px w-[500px] rotate-[20deg] bg-gradient-to-r from-transparent via-[#7957ff]/50 to-transparent"
          />

          {/* Decorative Line 2 */}

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
              duration: 1.3,
              delay: 0.15,
            }}
            className="absolute right-[2%] top-[140px] h-px w-[520px] -rotate-[17deg] bg-gradient-to-r from-transparent via-[#7957ff]/40 to-transparent"
          />

          {/* Glowing Dot 1 */}

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

          {/* Glowing Dot 2 */}

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

          <div className="w-full max-w-[680px]">

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
                Privacy Policy
              </span>

            </motion.div>

            {/* Heading */}

            <motion.h1
              variants={heroItem}
              className="text-[34px] font-bold leading-tight tracking-[-1px] text-white sm:text-[38px]"
            >
              Global Privacy Policy
            </motion.h1>

            {/* Description */}

            <motion.p
              variants={heroItem}
              className="mt-4 max-w-[620px] text-[15px] leading-[1.65] text-white/80"
            >
              We respect your privacy and are committed to
              protecting your personal information across our
              websites, conferences, events, and online services.
            </motion.p>

          </div>

          {/* =================================================
              HERO ICON
          ================================================= */}

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
                  size={88}
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
              LEFT SIDEBAR
          ================================================= */}

          <motion.aside
            variants={sidebarAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="h-fit self-start lg:sticky lg:top-[95px] lg:-ml-10"
          >

            <div className="w-full rounded-2xl border border-[#ebe8f7] bg-gradient-to-br from-[#faf9ff] to-[#f3f0fc] p-5 shadow-[0_8px_30px_rgba(48,35,100,0.06)]">

              {/* Sidebar Header */}

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

              {/* Sidebar Menu */}

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
                      whileHover={{
                        x: 6,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
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
                  className="scroll-mt-[95px] border-b border-[#e7e7ef] py-8 first:pt-0"
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

                    {/* Section Content */}

                    <div className="min-w-0 flex-1">

                      {/* Heading */}

                      <div className="flex items-center gap-3">

                        <Icon
                          size={21}
                          className="text-[#5425d8]"
                          strokeWidth={1.8}
                        />

                        <h2 className="text-[20px] font-bold leading-7 text-[#11134d]">
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

                      {/* =================================================
                          RIGHTS LIST
                      ================================================= */}

                      {section.list && (
                        <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50/50 p-5">

                          <p className="mb-4 text-[14px] font-semibold text-[#5425d8]">
                            Your data protection rights may include:
                          </p>

                          <ul className="space-y-3">

                            {section.list.map(
                              (item, listIndex) => (
                                <li
                                  key={listIndex}
                                  className="flex items-start gap-3 text-[13.5px] leading-6 text-[#46617b]"
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
                          }}
                          className="mt-5"
                        >

                          <motion.a
                            href="mailto:support@globalscion.org"
                            whileHover={{
                              x: 4,
                            }}
                            className="inline-flex items-center gap-3 rounded-lg border border-violet-100 bg-violet-50/60 px-4 py-3 text-[14px] font-medium text-[#46617b] transition hover:border-violet-200 hover:text-[#5425d8]"
                          >

                            <Mail
                              size={18}
                              className="text-[#5425d8]"
                            />

                            support@globalscion.org

                          </motion.a>

                        </motion.div>
                      )}

                    </div>

                  </div>

                </motion.section>
              );
            })}

          </div>
        </div>

        {/* =====================================================
            FINAL COMMITMENT
        ===================================================== */}

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

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_4px_12px_rgba(124,58,237,0.2)]">

              <ShieldCheck size={21} />

            </div>

            <div>

              <h3 className="text-[16px] font-bold text-[#11134d]">
                Your Privacy Matters
              </h3>

              <p className="mt-2 text-[13.5px] leading-6 text-[#46617b]">
                We are committed to handling Personal Data
                responsibly and maintaining appropriate measures
                designed to protect the information entrusted to us.
              </p>

            </div>

          </div>

        </motion.div>

      </main>
    </div>
  );
};

export default Privacy;
