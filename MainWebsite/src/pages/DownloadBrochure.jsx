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

  const conference = conferences.find((item) => item.id === id);

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
  // THEME
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

    shadow: "0 12px 35px rgba(124,58,237,0.08)",
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
  };

  // =========================================================
  // INVALID CONFERENCE
  // =========================================================

  if (!conference) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-5"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.pageText,
        }}
      >
        <div className="text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.primarySoft,
            }}
          >
            <FileText
              size={28}
              style={{
                color: colors.primary,
              }}
            />
          </div>

          <h1
            className="mt-4 text-2xl font-bold"
            style={{
              color: colors.heading,
            }}
          >
            Conference Not Found
          </h1>

          <p
            className="mt-2 text-xs"
            style={{
              color: colors.muted,
            }}
          >
            The requested conference could not be found.
          </p>

          <Link
            to="/conferences"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5"
            style={{
              backgroundColor: colors.primary,
            }}
          >
            <ArrowLeft size={15} />
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
        className="min-h-screen px-4 py-8 md:px-6 lg:py-10"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.pageText,
        }}
      >
        <div className="mx-auto max-w-3xl">
          <Link
            to={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold"
            style={{
              color: colors.primary,
            }}
          >
            <ArrowLeft size={15} />
            Back to Conference
          </Link>

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-5 overflow-hidden rounded-2xl border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.cardBg,
              boxShadow: colors.shadow,
            }}
          >
            {/* SUCCESS HEADER */}

            <div
              className="px-5 py-9 text-center text-white md:px-8"
              style={{
                background:
                  "linear-gradient(135deg, #1E1B4B 0%, #312E81 55%, #7C3AED 100%)",
              }}
            >
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                }}
              >
                <CheckCircle2 size={30} />
              </div>

              <h1 className="mt-4 text-2xl font-bold md:text-3xl">
                Request Submitted
              </h1>

              <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-white/75">
                Thank you for your interest in{" "}
                <span className="font-semibold text-white">
                  {conference.title}
                </span>
                .
              </p>
            </div>

            {/* SUCCESS BODY */}

            <div className="px-5 py-7 text-center md:px-8">
              <p
                className="text-xs leading-6"
                style={{
                  color: colors.body,
                }}
              >
                Your brochure request has been received successfully. Our
                team will contact you with the conference brochure and
                additional information.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Link
                  to={`/conferences/${conference.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold text-white shadow-md"
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  View Conference
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to="/conferences"
                  className="inline-flex h-10 items-center gap-2 rounded-full border px-5 text-xs font-bold"
                  style={{
                    borderColor: colors.borderLight,
                    color: colors.heading,
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
      className="min-h-screen"
      style={{
        backgroundColor: colors.pageBg,
        color: colors.pageText,
      }}
    >
      {/* =====================================================
          COMPACT HERO
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",
        }}
      >
        <div
          className="absolute -right-16 -top-20 h-52 w-52 rounded-full"
          style={{
            backgroundColor: "rgba(168,85,247,0.08)",
            border: "1px solid rgba(192,132,252,0.15)",
          }}
        />

        <div
          className="absolute -bottom-24 left-10 h-44 w-44 rounded-full"
          style={{
            backgroundColor: "rgba(124,58,237,0.15)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-5 md:px-7 lg:px-8">
          <Link
            to={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/75 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Conference
          </Link>

          <div className="mt-5 max-w-3xl">
            <div
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5"
              style={{
                borderColor: "rgba(192,132,252,0.25)",
                backgroundColor: "rgba(168,85,247,0.10)",
              }}
            >
              <FileText
                size={13}
                style={{
                  color: "#C084FC",
                }}
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/90">
                Conference Brochure
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
              Get the Conference{" "}
              <span
                style={{
                  color: "#C084FC",
                }}
              >
                Brochure
              </span>
            </h1>

            <p className="mt-2 max-w-xl text-xs leading-5 text-white/65 sm:text-sm">
              Complete the form below to receive detailed information about
              the conference, scientific program, speakers and registration.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="px-4 py-6 sm:px-5 md:px-7 lg:px-8 lg:py-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          {/* =================================================
              LEFT COMPACT INFORMATION CARD
          ================================================= */}

          <motion.aside
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="h-fit lg:sticky lg:top-5"
          >
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                background:
                  "linear-gradient(145deg, #1E1B4B 0%, #312E81 100%)",
                boxShadow: "0 12px 35px rgba(124,58,237,0.13)",
              }}
            >
              {/* IMAGE */}

              <div className="relative h-36 overflow-hidden sm:h-40">
                <img
                  src={conference.aboutImage || conference.image}
                  alt={conference.title}
                  className="h-full w-full object-cover"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, #1E1B4B 0%, rgba(30,27,75,0.35) 55%, transparent 100%)",
                  }}
                />

                <div className="absolute bottom-3 left-4 right-4">
                  <span
                    className="inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
                    style={{
                      backgroundColor: colors.primary,
                    }}
                  >
                    {conference.category}
                  </span>
                </div>
              </div>

              {/* INFORMATION */}

              <div className="p-4">
                <h2 className="text-base font-bold leading-5 text-white">
                  {conference.title}
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/60">
                  {conference.subtitle}
                </p>

                <div className="mt-4 space-y-2.5">
                  <InfoRow
                    icon={<Globe2 size={14} />}
                    text={conference.location}
                  />

                  <InfoRow
                    icon={<FileText size={14} />}
                    text={conference.date}
                  />

                  <InfoRow
                    icon={<ShieldCheck size={14} />}
                    text="Official Conference Information"
                  />
                </div>

                <div className="mt-4 h-px bg-white/10" />

                <p className="mt-3 text-[10px] leading-4 text-white/45">
                  Your information is used only to process your brochure
                  request and provide conference-related information.
                </p>
              </div>
            </div>
          </motion.aside>

          {/* =================================================
              COMPACT FORM CARD
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="rounded-2xl border p-4 sm:p-5"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
              boxShadow: colors.shadow,
            }}
          >
            {/* FORM HEADER */}

            <div
              className="border-b pb-4"
              style={{
                borderColor: colors.borderLight,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: colors.primarySoft,
                    color: colors.primary,
                  }}
                >
                  <Download size={17} />
                </div>

                <div>
                  <p
                    className="text-[9px] font-bold uppercase tracking-[0.13em]"
                    style={{
                      color: colors.primary,
                    }}
                  >
                    Request Brochure
                  </p>

                  <h2
                    className="mt-0.5 text-base font-bold"
                    style={{
                      color: colors.pageText,
                    }}
                  >
                    Your Details
                  </h2>
                </div>
              </div>

              <p
                className="mt-2 text-[11px] leading-5"
                style={{
                  color: colors.muted,
                }}
              >
                Please provide your details below. Fields marked with{" "}
                <span className="font-semibold text-red-500">*</span> are
                required.
              </p>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-5"
            >
              {/* FULL NAME */}

              <div>
                <FieldLabel
                  icon={<User size={13} />}
                  label="Full Name"
                  required
                />

                <div className="relative mt-1.5">
                  <User
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
                    className="h-11 w-full rounded-xl border pl-10 pr-3 text-xs outline-none transition"
                    style={{
                      borderColor: colors.inputBorder,
                      backgroundColor: colors.inputBg,
                      color: colors.inputText,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(124,58,237,0.08)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.inputBorder;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* EMAIL + PHONE */}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {/* EMAIL */}

                <div>
                  <FieldLabel
                    icon={<Mail size={13} />}
                    label="Your Email"
                    required
                  />

                  <div className="relative mt-1.5">
                    <Mail
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
                      className="h-11 w-full rounded-xl border pl-10 pr-3 text-xs outline-none transition"
                      style={{
                        borderColor: colors.inputBorder,
                        backgroundColor: colors.inputBg,
                        color: colors.inputText,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(124,58,237,0.08)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          colors.inputBorder;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <FieldLabel
                    icon={<Phone size={13} />}
                    label="Your Phone"
                    required
                  />

                  <div className="relative mt-1.5">
                    <Phone
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
                      className="h-11 w-full rounded-xl border pl-10 pr-3 text-xs outline-none transition"
                      style={{
                        borderColor: colors.inputBorder,
                        backgroundColor: colors.inputBg,
                        color: colors.inputText,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(124,58,237,0.08)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          colors.inputBorder;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* COUNTRY */}

              <div className="mt-4">
                <FieldLabel
                  icon={<Globe2 size={13} />}
                  label="Country"
                  required
                />

                <div className="relative mt-1.5">
                  <Globe2
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                    style={{
                      color: colors.subtle,
                    }}
                  />

                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="h-11 w-full appearance-none rounded-xl border pl-10 pr-10 text-xs outline-none transition"
                    style={{
                      borderColor: colors.inputBorder,
                      backgroundColor: colors.inputBg,
                      color: colors.inputText,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(124,58,237,0.08)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.inputBorder;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <option value="">Select your country</option>

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
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>

                  <ArrowRight
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90"
                    style={{
                      color: colors.subtle,
                    }}
                  />
                </div>
              </div>

              {/* ADDRESS */}

              <div className="mt-4">
                <FieldLabel
                  icon={<MapPin size={13} />}
                  label="Address"
                  required
                />

                <div className="relative mt-1.5">
                  <MapPin
                    size={15}
                    className="pointer-events-none absolute left-3 top-3"
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
                    rows={2}
                    className="w-full resize-none rounded-xl border py-3 pl-10 pr-3 text-xs leading-5 outline-none transition"
                    style={{
                      borderColor: colors.inputBorder,
                      backgroundColor: colors.inputBg,
                      color: colors.inputText,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(124,58,237,0.08)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.inputBorder;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* REQUIREMENTS */}

              <div className="mt-4">
                <FieldLabel
                  icon={<MessageSquare size={13} />}
                  label="Tell Us About Your Requirements"
                />

                <div className="relative mt-1.5">
                  <MessageSquare
                    size={15}
                    className="pointer-events-none absolute left-3 top-3"
                    style={{
                      color: colors.subtle,
                    }}
                  />

                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Tell us a little about your requirements..."
                    rows={2}
                    className="w-full resize-none rounded-xl border py-3 pl-10 pr-3 text-xs leading-5 outline-none transition"
                    style={{
                      borderColor: colors.inputBorder,
                      backgroundColor: colors.inputBg,
                      color: colors.inputText,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(124,58,237,0.08)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        colors.inputBorder;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* PRIVACY */}

              <div
                className="mt-4 flex items-start gap-2.5 rounded-xl p-3"
                style={{
                  backgroundColor: colors.primarySoft2,
                }}
              >
                <ShieldCheck
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{
                    color: colors.primary,
                  }}
                />

                <p
                  className="text-[10px] leading-4"
                  style={{
                    color: colors.body,
                  }}
                >
                  Your information is securely handled and will only be used
                  for conference-related communication and brochure delivery.
                </p>
              </div>

              {/* SUBMIT */}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p
                  className="text-[10px]"
                  style={{
                    color: colors.subtle,
                  }}
                >
                  * Required fields
                </p>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-xs font-bold text-white transition"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow:
                      "0 7px 18px rgba(124,58,237,0.18)",
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
                  <Download size={15} />

                  Request Brochure

                  <ArrowRight size={14} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          COMPACT TRUST SECTION
      ===================================================== */}

      <section
        className="border-t px-4 py-5 sm:px-5 md:px-7 lg:px-8"
        style={{
          borderColor: colors.borderLight,
          backgroundColor: colors.cardBg,
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row sm:text-left">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.primarySoft,
                color: colors.primary,
              }}
            >
              <CheckCircle2 size={15} />
            </div>

            <div>
              <p
                className="text-[10px] font-bold"
                style={{
                  color: colors.heading,
                }}
              >
                Official Conference Information
              </p>

              <p
                className="mt-0.5 text-[9px]"
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
            className="inline-flex items-center gap-1.5 text-[10px] font-bold transition"
            style={{
              color: colors.primary,
            }}
          >
            Return to Conference
            <ArrowRight size={12} />
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
      className="flex items-center gap-1.5 text-[11px] font-bold"
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
        <span className="text-[10px] font-medium text-red-500">
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
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: "rgba(192,132,252,0.13)",
          color: "#C084FC",
        }}
      >
        {icon}
      </div>

      <span
        className="text-[10px] font-medium leading-4"
        style={{
          color: "rgba(255,255,255,0.72)",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default DownloadBrochure;