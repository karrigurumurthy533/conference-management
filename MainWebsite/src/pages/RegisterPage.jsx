import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { getConferenceByIdApi } from "../api/api";

import {
  createDownloadBrochure,
  clearBrochure,
} from "../redux/userSlice";

const DownloadBrochure = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const [conference, setConference] = useState(null);

  const [conferenceLoading, setConferenceLoading] = useState(true);

  const [conferenceError, setConferenceError] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    requirements: "",
  });

  const { brochureLoading, brochureError } = useSelector(
    (state) => state.user,
  );

  const colors = {
    pageBg: "#FFFFFF",
    text: "#111827",
    cardBg: "#FFFFFF",
    cardBgSecondary: "#FAF8FF",

    border: "#E5E7EB",
    borderStrong: "#DDD6FE",
    divider: "#F1F0F5",

    primary: "#7C3AED",
    primaryHover: "#6D28D9",
    primarySoft: "#F5F3FF",
    primarySoft2: "#EDE9FE",

    heading: "#6D28D9",
    body: "#374151",
    muted: "#6B7280",
    mutedLight: "#9CA3AF",

    inputBg: "#FFFFFF",
    inputBorder: "#E5E7EB",
    inputText: "#111827",

    heroBg: "#1E1B4B",
    heroSecondary: "#312E81",
    heroAccent: "#C084FC",
    heroSoft: "#A78BFA",

    supportBg: "#F5F3FF",

    overlay: "rgba(15,7,32,0.75)",

    shadow: "0 10px 30px rgba(124,58,237,0.06)",
  };

  useEffect(() => {
    const fetchConference = async () => {
      try {
        setConferenceLoading(true);

        setConferenceError("");

        const response = await getConferenceByIdApi(id);

        const apiData =
          response?.data?.data ||
          response?.data ||
          null;

        if (!apiData) {
          setConference(null);

          setConferenceError("Conference not found");

          return;
        }

        const startDate =
          apiData?.conferenceDates?.startDate ||
          apiData?.conferenceDates?.fromDate ||
          apiData?.startDate ||
          "";

        const endDate =
          apiData?.conferenceDates?.endDate ||
          apiData?.conferenceDates?.toDate ||
          apiData?.endDate ||
          "";

        const rawDate =
          apiData?.date ||
          apiData?.conferenceDates?.date ||
          "";

        const formattedDate =
          startDate && endDate
            ? `${new Date(startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })} - ${new Date(endDate).toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}`
            : rawDate
              ? new Date(rawDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })
              : "";

        const normalizedConference = {
          ...apiData,

          id: apiData?._id || apiData?.id || id,

          title:
            apiData?.basicInformation?.title ||
            apiData?.title ||
            "",

          category:
            apiData?.basicInformation?.category ||
            apiData?.category ||
            "",

          subtitle:
            apiData?.basicInformation?.subtitle ||
            apiData?.subtitle ||
            "",

          description:
            apiData?.basicInformation?.description ||
            apiData?.description ||
            "",

          date: formattedDate,

          startDate,

          endDate,

          time:
            apiData?.conferenceDates?.time ||
            apiData?.time ||
            "",

          location:
            apiData?.venueInformation?.city ||
            apiData?.venueInformation?.location ||
            apiData?.venueInformation?.venueName ||
            apiData?.location ||
            "",

          mode:
            apiData?.venueInformation?.mode ||
            apiData?.mode ||
            apiData?.conferenceMode ||
            "",

          participants:
            apiData?.registrationInformation?.expectedParticipants ||
            apiData?.participants ||
            "",

          image:
            apiData?.media?.bannerImage ||
            apiData?.media?.conferenceBanner ||
            apiData?.bannerImage ||
            apiData?.imageUrl ||
            apiData?.image ||
            "",
        };

        setConference(normalizedConference);
      } catch (error) {
        console.error(
          "Fetch Conference Details Error:",
          error,
        );

        setConference(null);

        setConferenceError(
          error?.response?.data?.message ||
            "Failed to load conference details",
        );
      } finally {
        setConferenceLoading(false);
      }
    };

    if (id) {
      fetchConference();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      dispatch(clearBrochure());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!conference) {
      return;
    }

    const payload = {
      conferenceId: conference.id,

      conferenceTitle: conference.title,

      fullName: formData.fullName.trim(),

      email: formData.email.trim(),

      phone: formData.phone.trim(),

      country: formData.country.trim(),

      address: formData.address.trim(),

      requirements: formData.requirements.trim(),
    };

    console.log("Brochure Request Payload:", payload);

    try {
      const result = await dispatch(
        createDownloadBrochure(payload),
      ).unwrap();

      console.log(
        "Brochure Request Success:",
        result,
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Brochure Request Failed:",
        error,
      );
    }
  };

  if (conferenceLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: colors.pageBg,
        }}
      >
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600"
          />

          <p className="mt-4 text-sm font-semibold text-gray-600">
            Loading conference details...
          </p>
        </div>
      </div>
    );
  }

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
            <FileText size={25} />
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
            className="mt-2 text-sm leading-5"
            style={{
              color: colors.muted,
            }}
          >
            {conferenceError ||
              "The requested conference could not be found."}
          </p>

          <Link
            to="/conferences"
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
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
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: colors.heroBg,
        }}
      >
        <div
          className="absolute -right-16 -top-16 h-40 w-40 rounded-full"
          style={{
            border:
              "1px solid rgba(192,132,252,0.20)",
          }}
        />

        <div
          className="absolute -bottom-16 left-[8%] h-32 w-32 rounded-full"
          style={{
            border:
              "1px solid rgba(192,132,252,0.12)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-5 lg:px-8 lg:py-7">
          <Link
            to={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold transition hover:text-white"
            style={{
              color: colors.heroSoft,
            }}
          >
            <ArrowLeft size={14} />

            Back to Conference
          </Link>

          <div className="mt-5 grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{
                  border:
                    "1px solid rgba(192,132,252,0.22)",
                  backgroundColor:
                    "rgba(168,85,247,0.12)",
                  color: colors.heroAccent,
                }}
              >
                <Download size={12} />

                Conference Brochure
              </div>

              <h1 className="mt-3 max-w-4xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                Download Brochure
                <span
                  className="block"
                  style={{
                    color: colors.heroAccent,
                  }}
                >
                  {conference.title}
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Fill in your details below to request the
                conference brochure and receive complete
                event information.
              </p>
            </div>

            <div
              className="hidden min-w-[250px] rounded-xl p-4 backdrop-blur-md lg:block"
              style={{
                border:
                  "1px solid rgba(192,132,252,0.18)",
                backgroundColor:
                  "rgba(13,7,28,0.72)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  <CalendarDays size={16} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                    Conference Date
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-white">
                    {conference.date || "Date unavailable"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor:
                      "rgba(168,85,247,0.12)",
                    color: colors.heroAccent,
                  }}
                >
                  <MapPin size={15} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                    Location
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {conference.location ||
                      "Location unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-7 lg:px-8 lg:py-9">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadow,
              }}
            >
              {conference.image ? (
                <img
                  src={conference.image}
                  alt={conference.title}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-56 items-center justify-center"
                  style={{
                    backgroundColor: colors.primarySoft,
                  }}
                >
                  <FileText
                    size={55}
                    style={{
                      color: colors.primary,
                    }}
                  />
                </div>
              )}

              <div className="p-5">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{
                    color: colors.primary,
                  }}
                >
                  Conference
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {conference.title}
                </h2>

                {conference.subtitle && (
                  <p className="mt-2 text-sm leading-5 text-gray-500">
                    {conference.subtitle}
                  </p>
                )}

                <div className="mt-5 space-y-3">
                  <InfoItem
                    icon={<CalendarDays size={16} />}
                    label="Date"
                    value={
                      conference.date ||
                      "Not available"
                    }
                  />

                  <InfoItem
                    icon={<MapPin size={16} />}
                    label="Location"
                    value={
                      conference.location ||
                      "Not available"
                    }
                  />

                  {conference.mode && (
                    <InfoItem
                      icon={<Globe2 size={16} />}
                      label="Mode"
                      value={conference.mode}
                    />
                  )}

                  {conference.participants && (
                    <InfoItem
                      icon={<User size={16} />}
                      label="Expected Participants"
                      value={String(
                        conference.participants,
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-2xl"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
            }}
          >
            <div
              className="px-5 py-5 md:px-7"
              style={{
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      colors.primarySoft,
                    color: colors.primary,
                  }}
                >
                  <Download size={19} />
                </div>

                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{
                      color: colors.primary,
                    }}
                  >
                    Request Brochure
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    Enter Your Details
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-sm leading-5 text-gray-500">
                Please provide your contact information
                to receive the conference brochure.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-5 py-6 md:px-7"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  icon={<User size={15} />}
                  required
                />

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

                <InputField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                  icon={<Globe2 size={15} />}
                  required
                />
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Address
                  <span className="ml-1 text-violet-600">
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
                  className="w-full resize-none rounded-xl px-3.5 py-3 text-sm outline-none transition"
                  style={{
                    backgroundColor:
                      colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    color: colors.inputText,
                  }}
                />
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Requirements / Message
                </label>

                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any specific requirements or message..."
                  className="w-full resize-none rounded-xl px-3.5 py-3 text-sm outline-none transition"
                  style={{
                    backgroundColor:
                      colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    color: colors.inputText,
                  }}
                />
              </div>

              {brochureError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-red-600">
                    {brochureError}
                  </p>
                </div>
              )}

              <div
                className="mt-5 rounded-xl p-4"
                style={{
                  backgroundColor:
                    colors.primarySoft,
                  border:
                    `1px solid ${colors.borderStrong}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 flex-shrink-0"
                    style={{
                      color: colors.primary,
                    }}
                  />

                  <p className="text-xs leading-5 text-gray-600">
                    Your information will be used to process
                    your brochure request and provide
                    conference-related information.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={brochureLoading}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: colors.primary,
                  boxShadow:
                    "0 8px 20px rgba(124,58,237,0.18)",
                }}
              >
                {brochureLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                    SUBMITTING...
                  </>
                ) : (
                  <>
                    <Download size={17} />

                    REQUEST BROCHURE
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div
          className="mt-5 rounded-xl px-4 py-4"
          style={{
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.supportBg,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm"
              style={{
                color: colors.primary,
              }}
            >
              <Phone size={15} />
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

              <p className="mt-0.5 text-[11px] text-gray-500">
                Contact the GlobalScion team for brochure
                and conference information.
              </p>
            </div>
          </div>
        </div>
      </main>

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
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  colors.primarySoft,
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
              Request Submitted
            </h2>

            <p className="mt-2 text-sm leading-5 text-gray-500">
              Your brochure request for{" "}
              <span className="font-semibold text-gray-900">
                {conference.title}
              </span>{" "}
              has been submitted successfully.
            </p>

            <div
              className="mt-4 rounded-xl p-3 text-left"
              style={{
                backgroundColor:
                  colors.primarySoft,
              }}
            >
              <p className="text-xs text-gray-500">
                Email
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {formData.email}
              </p>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                The GlobalScion team will contact you with
                the brochure and conference information.
              </p>
            </div>

            <Link
              to={`/conferences/${conference.id}`}
              className="mt-5 inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              Back to Conference
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: "#F5F3FF",
          color: "#7C3AED",
        }}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
          {value}
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
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-violet-600">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-500">
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
          className={`h-11 w-full rounded-xl text-sm outline-none transition ${
            icon ? "pl-9 pr-3" : "px-3"
          }`}
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            color: "#111827",
          }}
        />
      </div>
    </div>
  );
};

export default DownloadBrochure;