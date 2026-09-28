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

  const conference = conferences.find((item) => item.id === id);

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
    shadow: "0 10px 30px rgba(124,58,237,0.06)",
    summaryShadow: "0 12px 35px rgba(124,58,237,0.09)",
    supportBg: "#F5F3FF",
    overlay: "rgba(15,7,32,0.75)",
  };

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
      description: "Professional and additional participation options.",
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
      description: "Special registration options for students.",
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

  const selectedRegistration = useMemo(() => {
    for (const group of registrationGroups) {
      const found = group.options.find(
        (option) => option.id === formData.registrationType,
      );

      if (found) return found;
    }

    return null;
  }, [formData.registrationType]);

  const total = selectedRegistration?.price || 0;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    console.log("Registration submitted:", {
      ...formData,
      total,
    });
  };

  if (!conference) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-5"
        style={{
          backgroundColor: colors.pageBg,
        }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-7 text-center"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl"
            style={{
              backgroundColor: colors.primarySoft,
              color: colors.primary,
            }}
          >
            <CalendarDays size={25} />
          </div>

          <h1
            className="mt-4 text-xl font-bold"
            style={{
              color: colors.heading,
            }}
          >
            Conference Not Found
          </h1>

          <p
            className="mt-2 text-base leading-5"
            style={{
              color: colors.muted,
            }}
          >
            Please select a valid conference before continuing with
            registration.
          </p>

          <Link
            to="/conferences"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-base font-bold text-white transition hover:-translate-y-0.5"
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

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.pageBg,
        color: colors.text,
      }}
    >
      {/* HERO */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: colors.heroBg,
        }}
      >
        <div
          className="absolute -right-16 -top-16 h-40 w-40 rounded-full"
          style={{
            border: "1px solid rgba(192,132,252,0.20)",
          }}
        />

        <div
          className="absolute -bottom-16 left-[8%] h-32 w-32 rounded-full"
          style={{
            border: "1px solid rgba(192,132,252,0.12)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-3 lg:px-8 lg:py-4">
          <Link
            to={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold transition"
            style={{
              color: colors.heroSoft,
            }}
          >
            <ArrowLeft size={13} />
            Back to Conference
          </Link>

          <div className="mt-3 grid items-center gap-4 lg:grid-cols-[1fr_auto]">
            <div>
              <div
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em]"
                style={{
                  border: "1px solid rgba(192,132,252,0.22)",
                  backgroundColor: "rgba(168,85,247,0.12)",
                  color: colors.heroAccent,
                }}
              >
                <Users size={11} />
                Conference Registration
              </div>

              <h1 className="mt-2 max-w-4xl text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
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

              <p className="mt-1 max-w-2xl text-sm leading-5 text-white/65">
                Complete your registration details below and select the
                participation category that suits you best.
              </p>
            </div>

            <div
              className="hidden min-w-[210px] rounded-lg p-3 backdrop-blur-md lg:block"
              style={{
                border: "1px solid rgba(192,132,252,0.18)",
                backgroundColor: "rgba(13,7,28,0.72)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md text-white"
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  <CalendarDays size={15} />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-white/45">
                    Conference Date
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-white">
                    {conference.date}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md"
                  style={{
                    backgroundColor: "rgba(168,85,247,0.12)",
                    color: colors.heroAccent,
                  }}
                >
                  <MapPin size={14} />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-white/45">
                    Location
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {conference.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
            {/* LEFT */}

            <div className="space-y-5">
              {/* PERSONAL */}

              <section
                className="overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <FormSectionHeader
                  number="01"
                  icon={<User size={17} />}
                  title="Personal Information"
                  description="Tell us a little about yourself."
                />

                <div className="p-4 md:p-5">
                  <div className="grid gap-3.5 md:grid-cols-[150px_1fr_1fr]">
                    <SelectField
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      options={["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."]}
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

                  <div className="mt-3.5 grid gap-3.5 md:grid-cols-2">
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      icon={<Mail size={15} />}
                      required
                    />

                    <InputField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      icon={<Phone size={15} />}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* CONFERENCE */}

              <section
                className="overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <FormSectionHeader
                  number="02"
                  icon={<Globe2 size={17} />}
                  title="Conference Details"
                  description="Confirm the conference you want to attend."
                />

                <div className="p-4 md:p-5">
                  <div
                    className="rounded-xl p-3"
                    style={{
                      border: `1px solid ${colors.borderStrong}`,
                      backgroundColor: colors.cardBgSecondary,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                        style={{
                          backgroundColor: colors.primary,
                        }}
                      >
                        <CalendarDays size={18} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="text-[11px] font-bold uppercase tracking-wider"
                          style={{
                            color: colors.primary,
                          }}
                        >
                          Selected Conference
                        </p>

                        <h3
                          className="mt-0.5 text-base font-bold leading-5"
                          style={{
                            color: colors.heading,
                          }}
                        >
                          {conference.title}
                        </h3>

                        <p
                          className="mt-0.5 text-xs"
                          style={{
                            color: colors.muted,
                          }}
                        >
                          {conference.date} · {conference.location}
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
                className="overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <FormSectionHeader
                  number="03"
                  icon={<MapPin size={17} />}
                  title="Location & Address"
                  description="Provide your current contact location."
                />

                <div className="p-4 md:p-5">
                  <div className="grid gap-3.5 md:grid-cols-2">
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

                  <div className="mt-3.5">
                    <label
                      className="mb-1.5 block text-sm font-bold"
                      style={{
                        color: "#374151",
                      }}
                    >
                      Address
                      <span
                        className="ml-1"
                        style={{
                          color: colors.primary,
                        }}
                      >
                        *
                      </span>
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Enter your complete address"
                      className="w-full resize-none rounded-xl px-3.5 py-2.5 text-base outline-none transition"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.inputBorder}`,
                        color: colors.inputText,
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* REGISTRATION */}

              <section
                className="overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <FormSectionHeader
                  number="04"
                  icon={<CreditCard size={17} />}
                  title="Registration Category"
                  description="Select one registration option."
                />

                <div className="p-4 md:p-5">
                  <div className="space-y-5">
                    {registrationGroups.map((group) => (
                      <div key={group.title}>
                        <div className="mb-2.5">
                          <h3
                            className="text-base font-bold"
                            style={{
                              color: colors.heading,
                            }}
                          >
                            {group.title}
                          </h3>

                          <p
                            className="mt-0.5 text-xs"
                            style={{
                              color: colors.muted,
                            }}
                          >
                            {group.description}
                          </p>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                          {group.options.map((option) => {
                            const selected =
                              formData.registrationType === option.id;

                            return (
                              <label
                                key={option.id}
                                className="group relative flex cursor-pointer items-center justify-between gap-3 rounded-xl p-3 transition-all hover:-translate-y-0.5"
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
                                    ? "0 5px 16px rgba(124,58,237,0.10)"
                                    : "none",
                                }}
                              >
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <div
                                    className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2"
                                    style={{
                                      borderColor: selected
                                        ? colors.primary
                                        : "#D1D5DB",
                                    }}
                                  >
                                    {selected && (
                                      <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                          backgroundColor: colors.primary,
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
                                    className="text-sm font-medium leading-4"
                                    style={{
                                      color: colors.body,
                                    }}
                                  >
                                    {option.label}
                                  </span>
                                </div>

                                <span
                                  className="whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold"
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

            {/* RIGHT SUMMARY */}

            <aside className="lg:sticky lg:top-5">
              <div
                className="overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.borderStrong}`,
                  boxShadow: colors.summaryShadow,
                }}
              >
                {/* SUMMARY HEADER */}

                <div
                  className="relative overflow-hidden p-4"
                  style={{
                    backgroundColor: colors.heroBg,
                  }}
                >
                  <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full"
                    style={{
                      border: "1px solid rgba(192,132,252,0.20)",
                    }}
                  />

                  <div className="relative">
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.16em]"
                      style={{
                        color: colors.heroAccent,
                      }}
                    >
                      Registration Summary
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-white">
                      Your Registration
                    </h2>
                  </div>
                </div>

                <div className="p-4">
                  {/* CONFERENCE */}

                  <div
                    className="rounded-xl p-3"
                    style={{
                      backgroundColor: colors.cardBgSecondary,
                    }}
                  >
                    <div className="flex gap-2.5">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white"
                        style={{
                          backgroundColor: colors.primary,
                        }}
                      >
                        <CalendarDays size={16} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="text-[11px] font-bold uppercase tracking-wider"
                          style={{
                            color: colors.primary,
                          }}
                        >
                          Conference
                        </p>

                        <p
                          className="mt-0.5 text-sm font-bold leading-4"
                          style={{
                            color: colors.body,
                          }}
                        >
                          {conference.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SELECTED */}

                  <div className="mt-4">
                    <p
                      className="text-[11px] font-bold uppercase tracking-wider"
                      style={{
                        color: colors.mutedLight,
                      }}
                    >
                      Selected Category
                    </p>

                    {selectedRegistration ? (
                      <div className="mt-2 flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-1.5">
                          <CheckCircle2
                            size={15}
                            className="mt-0.5 flex-shrink-0"
                            style={{
                              color: colors.primary,
                            }}
                          />

                          <span
                            className="text-sm font-semibold leading-4"
                            style={{
                              color: colors.body,
                            }}
                          >
                            {selectedRegistration.label}
                          </span>
                        </div>

                        <span
                          className="text-base font-bold"
                          style={{
                            color: colors.heading,
                          }}
                        >
                          €{total}
                        </span>
                      </div>
                    ) : (
                      <p
                        className="mt-2 rounded-lg p-3 text-xs leading-4"
                        style={{
                          border: `1px dashed ${colors.borderStrong}`,
                          color: colors.mutedLight,
                        }}
                      >
                        Select a registration category to see the total.
                      </p>
                    )}
                  </div>

                  {/* DIVIDER */}

                  <div
                    className="my-4 h-px"
                    style={{
                      backgroundColor: colors.divider,
                    }}
                  />

                  {/* TOTAL */}

                  <div className="flex items-end justify-between">
                    <div>
                      <p
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{
                          color: colors.mutedLight,
                        }}
                      >
                        Total
                      </p>

                      <p
                        className="mt-0.5 text-[11px]"
                        style={{
                          color: colors.mutedLight,
                        }}
                      >
                        Registration fee
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className="text-2xl font-bold"
                        style={{
                          color: colors.heading,
                        }}
                      >
                        €{total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      backgroundColor: colors.primary,
                      boxShadow: "0 8px 22px rgba(124,58,237,0.18)",
                    }}
                  >
                    Complete Registration
                    <ArrowRight size={15} />
                  </button>

                  <p
                    className="mt-3 text-center text-[11px] leading-4"
                    style={{
                      color: colors.mutedLight,
                    }}
                  >
                    By submitting this form, you confirm that the information
                    provided is accurate.
                  </p>
                </div>
              </div>

              {/* SUPPORT */}

              <div
                className="mt-3 rounded-xl p-3.5"
                style={{
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.supportBg,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm"
                    style={{
                      backgroundColor: colors.cardBg,
                      color: colors.primary,
                    }}
                  >
                    <Phone size={14} />
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
                      className="mt-0.5 text-[11px]"
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

      {/* SUCCESS MODAL */}

      {submitted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
          style={{
            backgroundColor: colors.overlay,
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 text-center"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.primarySoft,
                color: colors.primary,
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <h2
              className="mt-4 text-xl font-bold"
              style={{
                color: colors.heading,
              }}
            >
              Registration Submitted
            </h2>

            <p
              className="mt-2 text-base leading-5"
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
              className="mt-5 rounded-lg px-6 py-2.5 text-base font-bold text-white transition hover:-translate-y-0.5"
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

const FormSectionHeader = ({ number, icon, title, description }) => {
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
      className="flex items-center gap-3 px-4 py-3.5 md:px-5"
      style={{
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: colors.iconBg,
          color: colors.icon,
        }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[11px] font-bold uppercase tracking-wider"
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
            className="text-[11px] font-medium uppercase tracking-wider"
            style={{
              color: colors.required,
            }}
          >
            Required Details
          </span>
        </div>

        <h2
          className="mt-0.5 text-base font-bold"
          style={{
            color: colors.heading,
          }}
        >
          {title}
        </h2>

        <p
          className="mt-0.5 text-xs"
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
        className="mb-1.5 block text-sm font-bold"
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
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
          className={`h-10 w-full rounded-xl px-3 text-base outline-none transition ${
            icon ? "pl-9 pr-3" : "px-3"
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
        className="mb-1.5 block text-sm font-bold"
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
          className="h-10 w-full appearance-none rounded-xl px-3 pr-8 text-base outline-none transition"
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
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{
            color: colors.muted,
          }}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
