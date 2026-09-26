import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Globe2,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";

import conferences from "../../data/conferences";

const RegisterPage = () => {
  const { id } = useParams();

  const conference = conferences.find(
    (item) => item.id === id
  );

  // =========================================================
  // THEME COLORS (White + Violet Palette)
  // =========================================================

  const colors = {
    pageBg: "#FFFFFF",
    text: "#111827",

    cardBg: "#FFFFFF",
    cardBgSecondary: "#F9FAFB",

    border: "#E5E7EB",
    borderStrong: "#DDD6FE",
    divider: "#F3F4F6",

    primary: "#7C3AED",
    primaryHover: "#6D28D9",

    primarySoft: "#F5F3FF",
    primarySoft2: "#EDE9FE",

    heading: "#7C3AED",
    body: "#4B5563",
    muted: "#6B7280",
    mutedLight: "#9CA3AF",

    inputBg: "#FFFFFF",
    inputBorder: "#E5E7EB",
    inputText: "#111827",

    heroBg: "#1E1B4B",
    heroSecondary: "#312E81",

    heroAccent: "#C084FC",
    heroSoft: "#A78BFA",

    selectedBg: "#F5F3FF",
    selectedBorder: "#7C3AED",

    shadow: "0 15px 45px rgba(124,58,237,0.08)",

    summaryShadow: "0 20px 55px rgba(124,58,237,0.12)",

    supportBg: "#F5F3FF",

    overlay: "rgba(15,7,32,0.75)",
  };

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    conference: id || "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    address: "",
    registrationType: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // =========================================================
  // REGISTRATION OPTIONS
  // =========================================================

  const registrationGroups = [
    {
      title: "Academic",
      description:
        "Choose the registration category that best matches your participation.",
      options: [
        {
          id: "academic-early",
          label: "Online Presentation Early Bird Offer",
          price: 299,
        },
        {
          id: "academic-speaker",
          label: "Speaker Registration",
          price: 399,
        },
        {
          id: "academic-delegate",
          label: "Delegate Registration",
          price: 450,
        },
        {
          id: "academic-poster",
          label: "Poster Presentation",
          price: 420,
        },
      ],
    },
    {
      title: "Others",
      description:
        "Professional and additional participation options.",
      options: [
        {
          id: "other-workshop",
          label: "Workshop Registration",
          price: 349,
        },
        {
          id: "other-accompany",
          label: "Accompany Person",
          price: 249,
        },
        {
          id: "other-video",
          label: "Video Presentation",
          price: 199,
        },
        {
          id: "other-eposter",
          label: "E-Poster",
          price: 199,
        },
      ],
    },
    {
      title: "Student",
      description:
        "Special registration options for students.",
      options: [
        {
          id: "student-speaker",
          label: "Speaker Registration",
          price: 320,
        },
        {
          id: "student-delegate",
          label: "Delegate Registration",
          price: 349,
        },
      ],
    },
  ];

  // =========================================================
  // SELECTED REGISTRATION
  // =========================================================

  const selectedRegistration = useMemo(() => {
    for (const group of registrationGroups) {
      const found = group.options.find(
        (option) =>
          option.id === formData.registrationType
      );

      if (found) return found;
    }

    return null;
  }, [formData.registrationType]);

  const total = selectedRegistration?.price || 0;

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

    console.log("Registration submitted:", {
      ...formData,
      total,
    });
  };

  // =========================================================
  // INVALID CONFERENCE
  // =========================================================

  if (!conference) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{
          backgroundColor: colors.pageBg,
        }}
      >
        <div
          className="max-w-md rounded-3xl p-10 text-center"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: colors.primarySoft,
              color: colors.primary,
            }}
          >
            <CalendarDays size={28} />
          </div>

          <h1
            className="mt-6 text-2xl font-bold"
            style={{ color: colors.heading }}
          >
            Conference Not Found
          </h1>

          <p
            className="mt-3 text-sm leading-6"
            style={{ color: colors.muted }}
          >
            Please select a valid conference before
            continuing with registration.
          </p>

          <Link
            to="/conferences"
            className="mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
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
  // MAIN
  // =========================================================

  return (
    <div
      className="min-h-screen transition-all duration-500"
      style={{
        backgroundColor: colors.pageBg,
        color: colors.text,
      }}
    >
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: colors.heroBg,
        }}
      >
        {/* Decorative circles */}

        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full"
          style={{
            border: "1px solid rgba(192,132,252,0.22)",
          }}
        />

        <div
          className="absolute -bottom-28 left-[8%] h-64 w-64 rounded-full"
          style={{
            border: "1px solid rgba(192,132,252,0.14)",
          }}
        />

        <div
          className="absolute right-[20%] top-10 h-5 w-5 rounded-full"
          style={{
            backgroundColor: "rgba(192,132,252,0.35)",
          }}
        />

        <div
          className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10"
        >
          <Link
            to={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold transition"
            style={{
              color: colors.heroSoft,
            }}
          >
            <ArrowLeft size={17} />
            Back to Conference
          </Link>

          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]"
                style={{
                  border: "1px solid rgba(192,132,252,0.25)",
                  backgroundColor: "rgba(168,85,247,0.12)",
                  color: colors.heroAccent,
                }}
              >
                <Users size={14} />
                Conference Registration
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Register for
                <span
                  className="block"
                  style={{
                    color: colors.heroAccent,
                  }}
                >
                  {conference.title}
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
                Complete your registration details below
                and select the participation category that
                suits you best.
              </p>
            </div>

            {/* Conference mini card */}

            <div
              className="hidden min-w-[270px] rounded-2xl p-5 backdrop-blur-md lg:block"
              style={{
                border: "1px solid rgba(192,132,252,0.20)",
                backgroundColor: "rgba(13,7,28,0.75)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Conference Date
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {conference.date}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "rgba(168,85,247,0.12)",
                    color: colors.heroAccent,
                  }}
                >
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {conference.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN FORM
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">
        <form onSubmit={handleSubmit}>
          <div className="grid items-start gap-7 lg:grid-cols-[1fr_350px]">
            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="space-y-7">
              {/* PERSONAL DETAILS */}

              <section
                className="overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <FormSectionHeader
                  number="01"
                  icon={<User size={19} />}
                  title="Personal Information"
                  description="Tell us a little about yourself."
                />

                <div className="p-6 md:p-8">
                  <div className="grid gap-5 md:grid-cols-[180px_1fr_1fr]">
                    <SelectField
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      options={[
                        "Mr.",
                        "Ms.",
                        "Mrs.",
                        "Dr.",
                        "Prof.",
                      ]}
                      placeholder="Select Title"
                    />

                    <InputField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                    />

                    <InputField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      icon={<Mail size={17} />}
                      required
                    />

                    <InputField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      icon={<Phone size={17} />}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* CONFERENCE */}

              <section
                className="overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <FormSectionHeader
                  number="02"
                  icon={<Globe2 size={19} />}
                  title="Conference Details"
                  description="Confirm the conference you want to attend."
                />

                <div className="p-6 md:p-8">
                  <div
                    className="rounded-2xl p-4"
                    style={{
                      border: `1px solid ${colors.borderStrong}`,
                      backgroundColor: colors.cardBgSecondary,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                        style={{
                          backgroundColor: colors.primary,
                        }}
                      >
                        <CalendarDays size={21} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: colors.primary }}
                        >
                          Selected Conference
                        </p>

                        <h3
                          className="mt-1 text-sm font-bold leading-6"
                          style={{ color: colors.heading }}
                        >
                          {conference.title}
                        </h3>

                        <p
                          className="mt-1 text-xs"
                          style={{ color: colors.muted }}
                        >
                          {conference.date} ·{" "}
                          {conference.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <input
                    type="hidden"
                    name="conference"
                    value={conference.id}
                  />
                </div>
              </section>

              {/* ADDRESS */}

              <section
                className="overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <FormSectionHeader
                  number="03"
                  icon={<MapPin size={19} />}
                  title="Location & Address"
                  description="Provide your current contact location."
                />

                <div className="p-6 md:p-8">
                  <div className="grid gap-5 md:grid-cols-2">
                    <InputField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                    />

                    <InputField
                      label="State / Province"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state / province"
                      required
                    />

                    <InputField
                      label="Postal Code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Enter postal code"
                      required
                    />

                    <InputField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Select country"
                      required
                    />
                  </div>

                  <div className="mt-5">
                    <label
                      className="mb-2 block text-xs font-bold"
                      style={{ color: colors.body }}
                    >
                      Address
                      <span
                        className="ml-1"
                        style={{ color: colors.primary }}
                      >
                        *
                      </span>
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Enter your complete address"
                      className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none transition"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.inputBorder}`,
                        color: colors.inputText,
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* REGISTRATION TYPE */}

              <section
                className="overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <FormSectionHeader
                  number="04"
                  icon={<CreditCard size={19} />}
                  title="Registration Category"
                  description="Select one registration option."
                />

                <div className="p-6 md:p-8">
                  <div className="space-y-7">
                    {registrationGroups.map((group) => (
                      <div key={group.title}>
                        <div className="mb-4">
                          <h3
                            className="text-base font-bold"
                            style={{ color: colors.heading }}
                          >
                            {group.title}
                          </h3>

                          <p
                            className="mt-1 text-xs"
                            style={{ color: colors.muted }}
                          >
                            {group.description}
                          </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          {group.options.map((option) => {
                            const selected =
                              formData.registrationType ===
                              option.id;

                            return (
                              <label
                                key={option.id}
                                className="group relative flex cursor-pointer items-center justify-between gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5"
                                style={{
                                  border: `1px solid ${
                                    selected
                                      ? colors.selectedBorder
                                      : colors.border
                                  }`,
                                  backgroundColor: selected
                                    ? colors.selectedBg
                                    : colors.cardBg,
                                  boxShadow: selected
                                    ? "0 8px 25px rgba(124,58,237,0.12)"
                                    : "none",
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                                    style={{
                                      borderColor: selected
                                        ? colors.primary
                                        : "#D1D5DB",
                                    }}
                                  >
                                    {selected && (
                                      <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                          backgroundColor:
                                            colors.primary,
                                        }}
                                      />
                                    )}
                                  </div>

                                  <input
                                    type="radio"
                                    name="registrationType"
                                    value={option.id}
                                    checked={selected}
                                    onChange={handleChange}
                                    className="sr-only"
                                  />

                                  <span
                                    className="text-sm font-medium"
                                    style={{
                                      color: colors.body,
                                    }}
                                  >
                                    {option.label}
                                  </span>
                                </div>

                                <span
                                  className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold"
                                  style={{
                                    backgroundColor: selected
                                      ? colors.primary
                                      : colors.primarySoft2,
                                    color: selected
                                      ? "#FFFFFF"
                                      : colors.primary,
                                  }}
                                >
                                  €{option.price}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT SUMMARY
            ================================================= */}

            <aside className="lg:sticky lg:top-6">
              <div
                className="overflow-hidden rounded-3xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.borderStrong}`,
                  boxShadow: colors.summaryShadow,
                }}
              >
                {/* Summary header */}

                <div
                  className="relative overflow-hidden p-6"
                  style={{
                    backgroundColor: colors.heroBg,
                  }}
                >
                  <div
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full"
                    style={{
                      border:
                        "1px solid rgba(192,132,252,0.22)",
                    }}
                  />

                  <div className="relative">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{
                        color: colors.heroAccent,
                      }}
                    >
                      Registration Summary
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-white">
                      Your Registration
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  {/* Conference */}

                  <div
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor:
                        colors.cardBgSecondary,
                    }}
                  >
                    <div className="flex gap-3">
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white"
                        style={{
                          backgroundColor: colors.primary,
                        }}
                      >
                        <CalendarDays size={18} />
                      </div>

                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            color: colors.primary,
                          }}
                        >
                          Conference
                        </p>

                        <p
                          className="mt-1 text-xs font-bold leading-5"
                          style={{
                            color: colors.body,
                          }}
                        >
                          {conference.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Selected option */}

                  <div className="mt-6">
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{
                        color: colors.mutedLight,
                      }}
                    >
                      Selected Category
                    </p>

                    {selectedRegistration ? (
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle2
                            size={17}
                            className="mt-0.5 flex-shrink-0"
                            style={{
                              color: colors.primary,
                            }}
                          />

                          <span
                            className="text-sm font-semibold leading-5"
                            style={{
                              color: colors.body,
                            }}
                          >
                            {selectedRegistration.label}
                          </span>
                        </div>

                        <span
                          className="text-sm font-bold"
                          style={{
                            color: colors.heading,
                          }}
                        >
                          €{total}
                        </span>
                      </div>
                    ) : (
                      <p
                        className="mt-3 rounded-xl p-4 text-xs leading-5"
                        style={{
                          border: `1px dashed ${colors.borderStrong}`,
                          color: colors.mutedLight,
                        }}
                      >
                        Select a registration category
                        to see the total.
                      </p>
                    )}
                  </div>

                  {/* Divider */}

                  <div
                    className="my-6 h-px"
                    style={{
                      backgroundColor: colors.divider,
                    }}
                  />

                  {/* Total */}

                  <div className="flex items-end justify-between">
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{
                          color: colors.mutedLight,
                        }}
                      >
                        Total
                      </p>

                      <p
                        className="mt-1 text-[11px]"
                        style={{
                          color: colors.mutedLight,
                        }}
                      >
                        Registration fee
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className="text-3xl font-bold"
                        style={{
                          color: colors.heading,
                        }}
                      >
                        €{total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-6 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                    style={{
                      backgroundColor: colors.primary,
                      boxShadow:
                        "0 12px 30px rgba(124,58,237,0.22)",
                    }}
                  >
                    Complete Registration
                    <ArrowRight size={18} />
                  </button>

                  <p
                    className="mt-4 text-center text-[10px] leading-5"
                    style={{
                      color: colors.mutedLight,
                    }}
                  >
                    By submitting this form, you confirm
                    that the information provided is accurate.
                  </p>
                </div>
              </div>

              {/* Support card */}

              <div
                className="mt-5 rounded-2xl p-5"
                style={{
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.supportBg,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
                    style={{
                      backgroundColor: colors.cardBg,
                      color: colors.primary,
                    }}
                  >
                    <Phone size={17} />
                  </div>

                  <div>
                    <p
                      className="text-xs font-bold"
                      style={{
                        color: colors.heading,
                      }}
                    >
                      Need assistance?
                    </p>

                    <p
                      className="mt-1 text-[11px]"
                      style={{
                        color: colors.muted,
                      }}
                    >
                      Contact the GlobalScion team.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </main>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {submitted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5 backdrop-blur-sm"
          style={{
            backgroundColor: colors.overlay,
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-8 text-center"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              boxShadow:
                "0 25px 80px rgba(0,0,0,0.25)",
            }}
          >
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.primarySoft,
                color: colors.primary,
              }}
            >
              <CheckCircle2 size={34} />
            </div>

            <h2
              className="mt-5 text-2xl font-bold"
              style={{
                color: colors.heading,
              }}
            >
              Registration Submitted
            </h2>

            <p
              className="mt-3 text-sm leading-6"
              style={{
                color: colors.muted,
              }}
            >
              Thank you for registering for{" "}
              <span
                className="font-semibold"
                style={{
                  color: colors.body,
                }}
              >
                {conference.title}
              </span>
              .
            </p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-7 rounded-xl px-7 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================
// FORM SECTION HEADER
// =========================================================

const FormSectionHeader = ({
  number,
  icon,
  title,
  description,
}) => {
  const colors = {
    border: "#E5E7EB",
    iconBg: "#F5F3FF",
    icon: "#7C3AED",
    step: "#7C3AED",
    dot: "#C4B5FD",
    required: "#9CA3AF",
    heading: "#7C3AED",
    description: "#6B7280",
  };

  return (
    <div
      className="flex items-center gap-4 px-6 py-5 md:px-8"
      style={{
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: colors.iconBg,
          color: colors.icon,
        }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: colors.step,
            }}
          >
            Step {number}
          </span>

          <span
            className="h-1 w-1 rounded-full"
            style={{
              backgroundColor: colors.dot,
            }}
          />

          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{
              color: colors.required,
            }}
          >
            Required Details
          </span>
        </div>

        <h2
          className="mt-1 text-lg font-bold"
          style={{
            color: colors.heading,
          }}
        >
          {title}
        </h2>

        <p
          className="mt-1 text-xs"
          style={{
            color: colors.description,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

// =========================================================
// INPUT FIELD
// =========================================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon,
}) => {
  const colors = {
    label: "#374151",
    required: "#7C3AED",
    icon: "#8B5CF6",
    bg: "#FFFFFF",
    border: "#E5E7EB",
    text: "#111827",
  };

  return (
    <div>
      <label
        className="mb-2 block text-xs font-bold"
        style={{
          color: colors.label,
        }}
      >
        {label}

        {required && (
          <span
            className="ml-1"
            style={{
              color: colors.required,
            }}
          >
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            style={{
              color: colors.icon,
            }}
          >
            {icon}
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`h-12 w-full rounded-2xl px-4 text-sm outline-none transition ${
            icon ? "pl-11 pr-4" : "px-4"
          }`}
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }}
        />
      </div>
    </div>
  );
};

// =========================================================
// SELECT FIELD
// =========================================================

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => {
  const colors = {
    label: "#374151",
    required: "#7C3AED",
    bg: "#FFFFFF",
    border: "#E5E7EB",
    text: "#111827",
    muted: "#8B5CF6",
  };

  return (
    <div>
      <label
        className="mb-2 block text-xs font-bold"
        style={{
          color: colors.label,
        }}
      >
        {label}

        {required && (
          <span
            className="ml-1"
            style={{
              color: colors.required,
            }}
          >
            *
          </span>
        )}
      </label>

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="h-12 w-full appearance-none rounded-2xl px-4 pr-10 text-sm outline-none transition"
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }}
        >
          <option
            value=""
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
            }}
          >
            {placeholder}
          </option>

          {options.map((option) => (
            <option
              key={option}
              value={option}
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
              }}
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          style={{
            color: colors.muted,
          }}
        />
      </div>
    </div>
  );
};

export default RegisterPage;