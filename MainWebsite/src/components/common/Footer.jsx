
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const violetFilter =
  "brightness(0) saturate(100%) invert(35%) sepia(95%) saturate(4000%) hue-rotate(250deg) brightness(95%) contrast(95%)";

const Footer = () => {
  const violet = "#ad83f7";
  const lightViolet = "#442f74";
  const textColor = "#f2eef7";

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const statAnimation = {
    hidden: {
      opacity: 0,
      y: 15,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const linkHover = {
    whileHover: { x: 3 },
    transition: { duration: 0.15 },
  };

  const quickLinks = [
    ["Home", "/"],
    ["Conferences", "/conferences"],
    ["Speakers", "/speakers"],
    ["Reviews", "/reviews"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  const conferenceLinks = [
    ["Upcoming Events", "/conferences"],
    ["Past Conferences", "/conferences"],
    ["Conference Themes", "/conferences"],
    ["Submit Abstract", "/abstract"],
    ["Register Now", "/register"],
  ];

  const resourceLinks = [
    ["FAQ", "/faq"],
    ["Help Center", "/contact"],
    ["Terms & Conditions", "/terms"],
    ["Privacy Policy", "/privacy"],
    ["Sitemap", "/sitemap"],
  ];

  const socialLinks = [
    [
      "linkedin.svg",
      "LinkedIn",
      "https://www.linkedin.com/in/gedala-sonu-5bb823405",
    ],
    [
      "instagram.svg",
      "Instagram",
      "https://www.instagram.com/global_scion_conferences",
    ],
    [
      "youtube.svg",
      "YouTube",
      "https://www.youtube.com/@GLOBALSCIONPRIVATELIMITED",
    ],
    [
      "facebook.svg",
      "Facebook",
      "https://www.facebook.com/share/14KW4MrpefS/",
    ],
  ];

  const linkStyle = {
    color: textColor,
  };

  const hoverLinkProps = {
    onMouseEnter: (e) => {
      e.currentTarget.style.color = violet;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.color = textColor;
    },
  };

  const renderLinks = (links) =>
    links.map(([label, href]) => (
      <li key={label}>
        <motion.div {...linkHover}>
          <Link
            to={href}
            className="inline-block transition-colors"
            style={linkStyle}
            {...hoverLinkProps}
          >
            {label}
          </Link>
        </motion.div>
      </li>
    ));

  return (
    <footer
      className="w-full transition-colors duration-500"
      style={{
        backgroundColor: lightViolet,
        color: violet,
      }}
    >
      {/* STATS SECTION */}
      <div
        className="border-b"
        style={{
          backgroundColor: "#442f74",
          borderColor: "#9d8fdd",
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-4 px-4 py-4 sm:px-5 md:grid-cols-4 md:gap-5 md:px-6"
        >
          {[
            {
              image: "earth-globe.svg",
              alt: "Global Attendees",
              value: "4,800+",
              label: "Global Attendees",
            },
            {
              image: "countries.svg",
              alt: "Countries",
              value: "60+",
              label: "Countries",
            },
            {
              image: "conferences.svg",
              alt: "Conferences",
              value: "25+",
              label: "Conferences",
            },
            {
              image: "peoples.svg",
              alt: "Speakers",
              value: "300+",
              label: "Speakers",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={statAnimation}
              className="flex min-w-0 items-center gap-2.5 sm:gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ duration: 0.2 }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
                style={{ backgroundColor: "#DDD6FE" }}
              >
                <img
                  src={`/svgs/${stat.image}`}
                  alt={stat.alt}
                  className="h-5 w-5 object-contain sm:h-6 sm:w-6"
                  style={{ filter: violetFilter }}
                />
              </motion.div>

              <div className="min-w-0">
                <h3
                  className="text-[18px] font-bold leading-none sm:text-[21px]"
                  style={{ color: violet }}
                >
                  {stat.value}
                </h3>

                <p
                  className="mt-1 text-[11px] sm:text-[12px]"
                  style={{ color: textColor }}
                >
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 md:px-6 md:py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-2 sm:gap-6 lg:grid-cols-[1.45fr_1fr_1fr_1fr_1.25fr] lg:gap-7"
        >
          {/* BRAND — full width on mobile */}
          <motion.div
            variants={fadeUp}
            className="col-span-2 min-w-0 sm:col-span-1"
          >
            <motion.div {...linkHover} className="mb-3 inline-flex">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <motion.div
                  whileHover={{ scale: 1.06, rotate: 4 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#DDD6FE" }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: violet }}
                  >
                    G
                  </span>
                </motion.div>

                <div>
                  <h2
                    className="text-[16px] font-bold leading-tight"
                    style={{ color: violet }}
                  >
                    GlobalScion
                  </h2>
                  <p
                    className="text-[11px]"
                    style={{ color: textColor }}
                  >
                    Conferences
                  </p>
                </div>
              </Link>
            </motion.div>

            <p
              className="max-w-xs text-[12px] leading-5"
              style={{ color: textColor }}
            >
              Bringing people, ideas and innovation together for a better
              tomorrow.
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              {socialLinks.map(([icon, label, href]) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex h-8 w-8 items-center justify-center rounded-md border"
                  style={{
                    borderColor: "#C4B5FD",
                    backgroundColor: "#EDE9FE",
                  }}
                >
                  <img
                    src={`/svgs/${icon}`}
                    alt={label}
                    className="h-4 w-4 object-contain"
                    style={{ filter: violetFilter }}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div variants={fadeUp} className="min-w-0">
            <h3
              className="mb-3 text-[12px] font-semibold uppercase tracking-wide"
              style={{ color: violet }}
            >
              Quick Links
            </h3>

            <ul
              className="space-y-2 text-[12px]"
              style={{ color: textColor }}
            >
              {renderLinks(quickLinks)}
            </ul>
          </motion.div>

          {/* CONFERENCES */}
          <motion.div variants={fadeUp} className="min-w-0">
            <h3
              className="mb-3 text-[12px] font-semibold uppercase tracking-wide"
              style={{ color: violet }}
            >
              Conferences
            </h3>

            <ul
              className="space-y-2 text-[12px]"
              style={{ color: textColor }}
            >
              {renderLinks(conferenceLinks)}
            </ul>
          </motion.div>

          {/* RESOURCES */}
          <motion.div variants={fadeUp} className="min-w-0">
            <h3
              className="mb-3 text-[12px] font-semibold uppercase tracking-wide"
              style={{ color: violet }}
            >
              Resources
            </h3>

            <ul
              className="space-y-2 text-[12px]"
              style={{ color: textColor }}
            >
              {renderLinks(resourceLinks)}
            </ul>
          </motion.div>

          {/* CONTACT — full width on mobile */}
          <motion.div
            variants={fadeUp}
            className="col-span-2 min-w-0 sm:col-span-1"
          >
            <h3
              className="mb-3 text-[12px] font-semibold uppercase tracking-wide"
              style={{ color: violet }}
            >
              Contact Us
            </h3>

            <div
              className="space-y-2.5 text-[12px]"
              style={{ color: textColor }}
            >
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-start gap-2.5"
              >
                <MapPin
                  size={17}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                  style={{ color: violet }}
                />

                <div className="leading-5">
                  <p>United Kingdom</p>
                  <p>United States</p>
                  <p>India</p>
                  <p>Germany</p>
                  <p>UAE</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-start gap-2.5"
              >
                <Phone
                  size={17}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                  style={{ color: violet }}
                />

                <a
                  href="https://wa.me/443308088650"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={linkStyle}
                  {...hoverLinkProps}
                >
                  +44 330 808 8650
                </a>
              </motion.div>

              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-start gap-2.5"
              >
                <Mail
                  size={17}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                  style={{ color: violet }}
                />

                <a
                  href="mailto:info@globalscion.com"
                  className="break-all transition-colors"
                  style={linkStyle}
                  {...hoverLinkProps}
                >
                  info@globalscion.com
                </a>
              </motion.div>
            </div>

            {/* NEWSLETTER */}
            <motion.div variants={fadeUp} className="mt-4">
              <h4
                className="mb-2 text-[12px] font-semibold"
                style={{ color: violet }}
              >
                Subscribe to Our Newsletter
              </h4>

              <div
                className="flex h-9 overflow-hidden rounded-md"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DDD6FE",
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  className="min-w-0 flex-1 bg-transparent px-3 text-[11px] outline-none"
                  style={{ color: "#333333" }}
                />

                <motion.button
                  type="button"
                  aria-label="Subscribe"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex w-10 shrink-0 items-center justify-center text-white"
                  style={{ backgroundColor: violet }}
                >
                  <Send size={16} strokeWidth={1.8} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* COPYRIGHT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-t"
        style={{ borderColor: "#DDD6FE" }}
      >
        <div
          className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-[10px] sm:px-5 md:flex-row md:items-center md:justify-between md:px-6"
          style={{ color: textColor }}
        >
          <p>© GlobalScion Conferences. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              to="/terms"
              className="transition-colors"
              style={linkStyle}
              {...hoverLinkProps}
            >
              Terms &amp; Conditions
            </Link>

            <span
              className="h-3 w-px"
              style={{ backgroundColor: "#C4B5FD" }}
            />

            <Link
              to="/privacy"
              className="transition-colors"
              style={linkStyle}
              {...hoverLinkProps}
            >
              Privacy Policy
            </Link>

            <span
              className="h-3 w-px"
              style={{ backgroundColor: "#C4B5FD" }}
            />

            <Link
              to="/help-center"
              className="transition-colors"
              style={linkStyle}
              {...hoverLinkProps}
            >
              Help Center
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
