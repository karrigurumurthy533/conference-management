import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Download,
  Mail,
  Phone,
  User,
  MapPin,
  MessageSquare,
  Globe2,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from "lucide-react";

import conferences from "../../data/conferences";

const DownloadBrochure = () => {
  const { id } = useParams();

  const conference = conferences.find(
    (item) => item.id === id
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    requirements: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // =========================================================
  // THEME COLORS - WHITE + VIOLET
  // =========================================================

  const colors = {
    pageBg: "#FFFFFF",
    pageText: "#111827",

    cardBg: "#FFFFFF",
    secondaryBg: "#F9FAFB",

    primary: "#7C3AED",
    primaryHover: "#6D28D9",

    primarySoft: "#F5F3FF",
    primarySoft2: "#EDE9FE",

    heading: "#7C3AED",
    body: "#4B5563",
    muted: "#6B7280",
    subtle: "#9CA3AF",

    border: "#E5E7EB",
    borderLight: "#EDE9FE",

    inputBg: "#FFFFFF",
    inputBorder: "#E5E7EB",
    inputText: "#111827",

    heroBg: "#1E1B4B",
    heroSecondary: "#312E81",

    shadow: "0 20px 60px rgba(124,58,237,0.10)",

    successBg: "#F5F3FF",
  };

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    console.log("Brochure Request:", {
      conference: conference?.title,
      ...formData,
    });

    // API integration later:
    // await axios.post("/api/brochure-request", formData);
  };

  // =========================================================
  // INVALID CONFERENCE
  // =========================================================

  if (!conference) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6 transition-colors duration-500"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.pageText,
        }}
      >
        <div className="text-center">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.primarySoft,
            }}
          >
            <FileText
              size={34}
              style={{
                color: colors.primary,
              }}
            />
          </div>

          <h1
            className="mt-6 text-3xl font-bold"
            style={{
              color: colors.heading,
            }}
          >
            Conference Not Found
          </h1>

          <p
            className="mt-3 text-sm"
            style={{
              color: colors.muted,
            }}
          >
            The requested conference could not be found.
          </p>

          <Link
            to="/conferences"
            className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            style={{
              backgroundColor: colors.primary,
            }}
          >
            <ArrowLeft size={17} />
            Back to Conferences
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // SUCCESS SCREEN
  // =========================================================

  if (submitted) {
    return (
      <div
        className="min-h-screen px-5 py-12 transition-colors duration-500 md:px-8 lg:py-16"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.pageText,
        }}
      >
        <div className="mx-auto max-w-4xl">
          <Link
            to={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold transition"
            style={{
              color: colors.primary,
            }}
          >
            <ArrowLeft size={17} />
            Back to Conference
          </Link>

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-8 overflow-hidden rounded-[30px] border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.cardBg,
              boxShadow: colors.shadow,
            }}
          >
            {/* SUCCESS HEADER */}

            <div
              className="px-6 py-12 text-center text-white md:px-12"
              style={{
                background:
                  "linear-gradient(135deg, #1E1B4B 0%, #312E81 55%, #7C3AED 100%)",
              }}
            >
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                }}
              >
                <CheckCircle2 size={42} />
              </div>

              <h1 className="mt-6 text-3xl font-bold md:text-4xl">
                Request Submitted
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/80">
                Thank you for your interest in{" "}
                <span className="font-semibold text-white">
                  {conference.title}
                </span>
                .
              </p>
            </div>

            {/* SUCCESS BODY */}

            <div className="px-6 py-10 text-center md:px-12">
              <p
                className="text-sm leading-7"
                style={{
                  color: colors.body,
                }}
              >
                Your brochure request has been received successfully.
                Our team will contact you with the conference brochure
                and additional information.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to={`/conferences/${conference.id}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  View Conference
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/conferences"
                  className="inline-flex h-12 items-center gap-2 rounded-full border px-7 text-sm font-bold transition"
                  style={{
                    borderColor: colors.borderLight,
                    color: colors.heading,
                    backgroundColor: "transparent",
                  }}
                >
                  All Conferences
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: colors.pageBg,
        color: colors.pageText,
      }}
    >
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",
        }}
      >
        {/* Decorative circles */}

        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full"
          style={{
            backgroundColor: "rgba(168,85,247,0.08)",
            border: "1px solid rgba(192,132,252,0.18)",
          }}
        />

        <div
          className="absolute -bottom-32 left-10 h-64 w-64 rounded-full"
          style={{
            backgroundColor: "rgba(124,58,237,0.20)",
          }}
        />

        <div
          className="absolute right-[28%] top-10 h-8 w-8 rounded-full"
          style={{
            backgroundColor: "rgba(192,132,252,0.20)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-8 md:px-8 lg:px-10">
          <Link
            to={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Conference
          </Link>

          <div className="mt-8 max-w-4xl">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm"
              style={{
                borderColor: "rgba(192,132,252,0.25)",
                backgroundColor: "rgba(168,85,247,0.10)",
              }}
            >
              <FileText
                size={15}
                style={{
                  color: "#C084FC",
                }}
              />

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/90">
                Conference Brochure
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Get the Conference
              <br className="hidden sm:block" />

              <span
                style={{
                  color: "#C084FC",
                }}
              >
                Brochure
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              Complete the form below to receive detailed information
              about the conference, scientific program, speakers,
              registration and participation opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="px-5 py-10 md:px-8 lg:px-10 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          {/* =================================================
              LEFT INFORMATION CARD
          ================================================= */}

          <motion.aside
            initial={{
              opacity: 0,
              x: -25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="h-fit lg:sticky lg:top-8"
          >
            <div
              className="overflow-hidden rounded-[28px]"
              style={{
                background:
                  "linear-gradient(145deg, #1E1B4B 0%, #312E81 100%)",
                boxShadow:
                  "0 20px 60px rgba(124,58,237,0.18)",
              }}
            >
              {/* IMAGE */}

              <div className="relative h-56 overflow-hidden">
                <img
                  src={
                    conference.aboutImage ||
                    conference.image
                  }
                  alt={conference.title}
                  className="h-full w-full object-cover"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, #1E1B4B 0%, rgba(30,27,75,0.45) 45%, transparent 100%)",
                  }}
                />

                <div className="absolute bottom-5 left-5 right-5">
                  <span
                    className="inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{
                      backgroundColor: colors.primary,
                    }}
                  >
                    {conference.category}
                  </span>
                </div>
              </div>

              {/* INFORMATION */}

              <div className="p-6 md:p-7">
                <h2 className="text-xl font-bold leading-7 text-white">
                  {conference.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/65">
                  {conference.subtitle}
                </p>

                <div className="mt-7 space-y-4">
                  <InfoRow
                    icon={<Globe2 size={17} />}
                    text={conference.location}
                  />

                  <InfoRow
                    icon={<FileText size={17} />}
                    text={conference.date}
                  />

                  <InfoRow
                    icon={<ShieldCheck size={17} />}
                    text="Official Conference Information"
                  />
                </div>

                <div className="mt-7 h-px bg-white/10" />

                <p className="mt-6 text-xs leading-5 text-white/50">
                  Your information is used only to process your
                  brochure request and provide conference-related
                  information.
                </p>
              </div>
            </div>
          </motion.aside>

          {/* =================================================
              FORM
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
            }}
            className="rounded-[28px] border p-6 md:p-9 lg:p-10"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
              boxShadow: colors.shadow,
            }}
          >
            {/* FORM HEADER */}

            <div
              className="border-b pb-7"
              style={{
                borderColor: colors.borderLight,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: colors.primarySoft,
                    color: colors.primary,
                  }}
                >
                  <Download size={21} />
                </div>

                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-[0.15em]"
                    style={{
                      color: colors.primary,
                    }}
                  >
                    Request Brochure
                  </p>

                  <h2
                    className="mt-1 text-xl font-bold md:text-2xl"
                    style={{
                      color: colors.heading,
                    }}
                  >
                    Your Details
                  </h2>
                </div>
              </div>

              <p
                className="mt-4 text-sm leading-6"
                style={{
                  color: colors.muted,
                }}
              >
                Please provide your details below. Fields marked with
                <span className="ml-1 font-semibold text-red-500">
                  *
                </span>{" "}
                are required.
              </p>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >
              {/* FULL NAME */}

              <div>
                <FieldLabel
                  icon={<User size={15} />}
                  label="Full Name"
                  required
                />

                <div className="relative mt-2">
                  <User
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                    style={{
                      color: colors.subtle,
                    }}
                  />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="h-14 w-full rounded-2xl border pl-12 pr-4 text-sm outline-none transition"
                    style={{
                      borderColor: colors.inputBorder,
                      backgroundColor: colors.inputBg,
                      color: colors.inputText,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.primary;

                      e.currentTarget.style.boxShadow =
                        "0 0 0 4px rgba(124,58,237,0.10)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.inputBorder;

                      e.currentTarget.style.boxShadow =
                        "none";
                    }}
                  />
                </div>
              </div>

              {/* EMAIL + PHONE */}

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* EMAIL */}

                <div>
                  <FieldLabel
                    icon={<Mail size={15} />}
                    label="Your Email"
                    required
                  />

                  <div className="relative mt-2">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                      style={{
                        color: colors.subtle,
                      }}
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="h-14 w-full rounded-2xl border pl-12 pr-4 text-sm outline-none transition"
                      style={{
                        borderColor: colors.inputBorder,
                        backgroundColor: colors.inputBg,
                        color: colors.inputText,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          colors.primary;

                        e.currentTarget.style.boxShadow =
                          "0 0 0 4px rgba(124,58,237,0.10)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          colors.inputBorder;

                        e.currentTarget.style.boxShadow =
                          "none";
                      }}
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <FieldLabel
                    icon={<Phone size={15} />}
                    label="Your Phone"
                    required
                  />

                  <div className="relative mt-2">
                    <Phone
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                      style={{
                        color: colors.subtle,
                      }}
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                      className="h-14 w-full rounded-2xl border pl-12 pr-4 text-sm outline-none transition"
                      style={{
                        borderColor: colors.inputBorder,
                        backgroundColor: colors.inputBg,
                        color: colors.inputText,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          colors.primary;

                        e.currentTarget.style.boxShadow =
                          "0 0 0 4px rgba(124,58,237,0.10)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          colors.inputBorder;

                        e.currentTarget.style.boxShadow =
                          "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* COUNTRY */}

              <div className="mt-6">
                <FieldLabel
                  icon={<Globe2 size={15} />}
                  label="Country"
                  required
                />

                <div className="relative mt-2">
                  <Globe2
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                    style={{
                      color: colors.subtle,
                    }}
                  />

                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="h-14 w-full appearance-none rounded-2xl border pl-12 pr-12 text-sm outline-none transition"
                    style={{
                      borderColor: colors.inputBorder,
                      backgroundColor: colors.inputBg,
                      color: colors.inputText,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.primary;

                      e.currentTarget.style.boxShadow =
                        "0 0 0 4px rgba(124,58,237,0.10)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.inputBorder;

                      e.currentTarget.style.boxShadow =
                        "none";
                    }}
                  >
                    <option
                      value=""
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.inputText,
                      }}
                    >
                      Select your country
                    </option>

                    {[
                      "India",
                      "United States",
                      "United Kingdom",
                      "Australia",
                      "Canada",
                      "Germany",
                      "France",
                      "United Arab Emirates",
                      "Singapore",
                      "Other",
                    ].map((country) => (
                      <option
                        key={country}
                        value={country}
                        style={{
                          backgroundColor: colors.inputBg,
                          color: colors.inputText,
                        }}
                      >
                        {country}
                      </option>
                    ))}
                  </select>

                  <ArrowRight
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90"
                    style={{
                      color: colors.subtle,
                    }}
                  />
                </div>
              </div>

              {/* ADDRESS */}

              <div className="mt-6">
                <FieldLabel
                  icon={<MapPin size={15} />}
                  label="Address"
                  required
                />

                <div className="relative mt-2">
                  <MapPin
                    size={17}
                    className="pointer-events-none absolute left-4 top-5"
                    style={{
                      color: colors.subtle,
                    }}
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    required
                    rows={4}
                    className="w-full resize-none rounded-2xl border py-4 pl-12 pr-4 text-sm leading-6 outline-none transition"
                    style={{
                      borderColor: colors.inputBorder,
                      backgroundColor: colors.inputBg,
                      color: colors.inputText,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.primary;

                      e.currentTarget.style.boxShadow =
                        "0 0 0 4px rgba(124,58,237,0.10)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.inputBorder;

                      e.currentTarget.style.boxShadow =
                        "none";
                    }}
                  />
                </div>
              </div>

              {/* REQUIREMENTS */}

              <div className="mt-6">
                <FieldLabel
                  icon={<MessageSquare size={15} />}
                  label="Tell Us About Your Requirements"
                />

                <div className="relative mt-2">
                  <MessageSquare
                    size={17}
                    className="pointer-events-none absolute left-4 top-5"
                    style={{
                      color: colors.subtle,
                    }}
                  />

                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Tell us a little about your requirements..."
                    rows={5}
                    className="w-full resize-none rounded-2xl border py-4 pl-12 pr-4 text-sm leading-6 outline-none transition"
                    style={{
                      borderColor: colors.inputBorder,
                      backgroundColor: colors.inputBg,
                      color: colors.inputText,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.primary;

                      e.currentTarget.style.boxShadow =
                        "0 0 0 4px rgba(124,58,237,0.10)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.inputBorder;

                      e.currentTarget.style.boxShadow =
                        "none";
                    }}
                  />
                </div>
              </div>

              {/* PRIVACY */}

              <div
                className="mt-7 flex items-start gap-3 rounded-2xl p-4"
                style={{
                  backgroundColor: colors.primarySoft2,
                }}
              >
                <ShieldCheck
                  size={19}
                  className="mt-0.5 flex-shrink-0"
                  style={{
                    color: colors.primary,
                  }}
                />

                <p
                  className="text-xs leading-5"
                  style={{
                    color: colors.body,
                  }}
                >
                  Your information is securely handled and will only
                  be used for conference-related communication and
                  brochure delivery.
                </p>
              </div>

              {/* SUBMIT */}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p
                  className="text-xs"
                  style={{
                    color: colors.subtle,
                  }}
                >
                  * Required fields
                </p>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl px-8 text-sm font-bold text-white transition"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow:
                      "0 10px 25px rgba(124,58,237,0.22)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.primary;
                  }}
                >
                  <Download size={18} />

                  Request Brochure

                  <ArrowRight size={17} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM TRUST SECTION
      ===================================================== */}

      <section
        className="border-t px-5 py-8 md:px-8"
        style={{
          borderColor: colors.borderLight,
          backgroundColor: colors.cardBg,
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.primarySoft,
                color: colors.primary,
              }}
            >
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p
                className="text-xs font-bold"
                style={{
                  color: colors.heading,
                }}
              >
                Official Conference Information
              </p>

              <p
                className="mt-0.5 text-[11px]"
                style={{
                  color: colors.muted,
                }}
              >
                GlobalScion Conference Management
              </p>
            </div>
          </div>

          <Link
            to={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-2 text-xs font-bold transition"
            style={{
              color: colors.primary,
            }}
          >
            Return to Conference
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
};

// =========================================================
// FIELD LABEL
// =========================================================

const FieldLabel = ({
  icon,
  label,
  required = false,
}) => {
  return (
    <label
      className="flex items-center gap-2 text-sm font-bold"
      style={{
        color: "#374151",
      }}
    >
      <span
        style={{
          color: "#7C3AED",
        }}
      >
        {icon}
      </span>

      <span>{label}</span>

      {required && (
        <span className="text-xs font-medium text-red-500">
          *
        </span>
      )}
    </label>
  );
};

// =========================================================
// INFO ROW
// =========================================================

const InfoRow = ({
  icon,
  text,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: "rgba(192,132,252,0.13)",
          color: "#C084FC",
        }}
      >
        {icon}
      </div>

      <span
        className="text-xs font-medium leading-5"
        style={{
          color: "rgba(255,255,255,0.75)",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default DownloadBrochure;