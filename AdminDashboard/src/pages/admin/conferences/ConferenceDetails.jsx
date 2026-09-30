import { useEffect, useMemo } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Globe2,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Pencil,
  Building2,
  Mail,
  Phone,
  UserRound,
  ExternalLink,
  Layers3,
  BookOpen,
  Presentation,
  CreditCard,
  Download,
  Image as ImageIcon,
  HeartHandshake,
  ListChecks,
  MessageSquare,
  Send,
  Award,
  CalendarRange,
  Link as LinkIcon,
  
  Smartphone,
  Map,
  Eye,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getConferenceById } from "../../../redux/conferenceSlice";

/*
  ============================================================
  ConferenceDetails.jsx
  ============================================================
  This component renders the complete Conference schema:

  category
  title
  subtitle
  description
  image
  aboutImage
  date
  time
  startDate
  endDate
  location
  mode
  participants
  status
  venue
  registrationDates
  registrationCategories
  welcomeMessage
  speakers
  committee
  whoShouldAttend
  whoShouldAttendDescription
  keyHighlights
  topics
  tracks
  otherData
    - whyToAttend
    - sampleAgenda
    - benefitsOfAttending
    - delegates
    - posterPresentersLive
    - ePosterPresenters
    - marketAnalysis
  submission
  contact
  sponsors
  createdBy
  updatedBy
  createdAt
  updatedAt

  Redux/API integration remains:
  dispatch(getConferenceById(id))
*/

const ConferenceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    selectedConference,
    conference,
    loading,
    error,
  } = useSelector((state) => state.conference);

  const conferenceData = selectedConference || conference;

  useEffect(() => {
    if (id) {
      dispatch(getConferenceById(id));
    }
  }, [dispatch, id]);

  const data = useMemo(() => {
    if (!conferenceData) return null;

    return (
      conferenceData.data ||
      conferenceData.conference ||
      conferenceData
    );
  }, [conferenceData]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatDate = (date, fallback = "Not available") => {
    if (!date) return fallback;

    if (date instanceof Date) {
      if (Number.isNaN(date.getTime())) return fallback;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date, fallback = "Not available") => {
    if (!date) return fallback;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateRange = () => {
    if (!data) return "Not available";

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (
        !Number.isNaN(start.getTime()) &&
        !Number.isNaN(end.getTime())
      ) {
        const startMonth = start.toLocaleString("en-US", {
          month: "short",
        });

        const endMonth = end.toLocaleString("en-US", {
          month: "short",
        });

        const startDay = start.getDate();
        const endDay = end.getDate();

        const startYear = start.getFullYear();
        const endYear = end.getFullYear();

        if (startYear === endYear) {
          if (startMonth === endMonth) {
            return `${startMonth} ${startDay}–${endDay}, ${startYear}`;
          }

          return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
        }

        return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
      }
    }

    if (typeof data.date === "string" && data.date.trim()) {
      return data.date;
    }

    return "Date not available";
  };

  const getDisplayValue = (
    value,
    fallback = "Not specified",
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return fallback;
    }

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return String(value);
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
      return value.length
        ? value
            .map((item) => getDisplayValue(item, ""))
            .filter(Boolean)
            .join(", ")
        : fallback;
    }

    if (typeof value === "object") {
      if (value.name) return String(value.name);
      if (value.title) return String(value.title);
      if (value.label) return String(value.label);
      if (value.value) return String(value.value);
      return fallback;
    }

    return fallback;
  };

  const formatSafeValue = (
    value,
    fallback = "Not specified",
  ) => getDisplayValue(value, fallback);

  const getArrayLength = (value) =>
    Array.isArray(value) ? value.length : 0;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Published":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Draft":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Archived":
        return "bg-red-50 text-red-500 border-red-100";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const isImageUrl = (value) => {
    if (typeof value !== "string" || !value.trim()) {
      return false;
    }

    const url = value.trim();

    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/") ||
      url.startsWith("data:image/")
    );
  };

  const getImageUrl = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "object") {
      return (
        value.url ||
        value.image ||
        value.imageUrl ||
        value.secure_url ||
        value.src ||
        ""
      );
    }

    return "";
  };

  const safeArray = (value) =>
    Array.isArray(value) ? value : [];

  const safeObject = (value) =>
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? value
      : {};

  const getRegistrationCount = () => {
    if (!data) return 0;

    if (typeof data.registrations === "number") {
      return data.registrations;
    }

    if (typeof data.registrationCount === "number") {
      return data.registrationCount;
    }

    if (typeof data.totalRegistrations === "number") {
      return data.totalRegistrations;
    }

    if (Array.isArray(data.registrations)) {
      return data.registrations.length;
    }

    return 0;
  };

  const openExternal = (url) => {
    if (!url) return;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer",
    );
  };

  /* =========================================================
     SCHEMA DATA
  ========================================================= */

  const venue = safeObject(data?.venue);
  const registrationDates = safeObject(
    data?.registrationDates,
  );
  const welcomeMessage = safeObject(
    data?.welcomeMessage,
  );
  const submission = safeObject(data?.submission);
  const contact = safeObject(data?.contact);
  const otherData = safeObject(data?.otherData);

  const ePoster = safeObject(
    otherData.ePosterPresenters,
  );

  const marketAnalysis = safeObject(
    otherData.marketAnalysis,
  );

  const speakers = safeArray(data?.speakers);
  const committee = safeArray(data?.committee);
  const registrationCategories = safeArray(
    data?.registrationCategories,
  );
  const whoShouldAttend = safeArray(
    data?.whoShouldAttend,
  );
  const keyHighlights = safeArray(
    data?.keyHighlights,
  );
  const topics = safeArray(data?.topics);
  const tracks = safeArray(data?.tracks);
  const whyToAttend = safeArray(
    otherData.whyToAttend,
  );
  const sampleAgenda = safeArray(
    otherData.sampleAgenda,
  );
  const benefitsOfAttending = safeArray(
    otherData.benefitsOfAttending,
  );
  const delegates = safeArray(
    otherData.delegates,
  );
  const posterPresentersLive = safeArray(
    otherData.posterPresentersLive,
  );
  const sponsors = safeArray(data?.sponsors);

  const locationDisplay = [
    venue.city,
    venue.state,
    venue.country,
  ]
    .filter(Boolean)
    .join(", ");

  const description = getDisplayValue(
    data?.description,
    "No conference description available.",
  );

  const venueAddress = [
    venue.address,
    venue.city,
    venue.state,
    venue.country,
  ]
    .filter(Boolean)
    .join(", ");

  const heroImage = getImageUrl(data?.image);
  const aboutImage = getImageUrl(data?.aboutImage);
  const marketImage = getImageUrl(
    marketAnalysis?.image,
  );

  const website =
    contact.website ||
    data?.website ||
    data?.conferenceWebsite ||
    "";

  const registrationLimit = getDisplayValue(
    data?.registrationLimit ||
      data?.maxRegistrations ||
      data?.maximumRegistrations,
    "Not specified",
  );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="w-full animate-[fadeIn_0.3s_ease-out]">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-100" />

          <div>
            <div className="h-5 w-52 animate-pulse rounded bg-gray-100" />
            <div className="mt-2 h-3 w-36 animate-pulse rounded bg-gray-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <div className="space-y-4 xl:col-span-3">
            <div className="h-52 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
          </div>

          <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <XCircle
              size={22}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-4 text-[16px] font-bold text-gray-900">
            Unable to load conference
          </h2>

          <p className="mt-1 text-[12px] text-gray-500">
            {getDisplayValue(
              error,
              "Unable to load conference",
            )}
          </p>

          <button
            type="button"
            onClick={() =>
              dispatch(getConferenceById(id))
            }
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-violet-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!data) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
            <Layers3
              size={22}
              className="text-violet-600"
            />
          </div>

          <h2 className="mt-4 text-[16px] font-bold text-gray-900">
            Conference not found
          </h2>

          <p className="mt-1 text-[12px] text-gray-500">
            The requested conference could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/conferences")
            }
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-violet-700"
          >
            Back to Conferences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 animate-[fadeIn_0.35s_ease-out]">
      {/* =====================================================
          TOP BAR
      ===================================================== */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/conferences")
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-[22px] font-bold leading-tight text-gray-900">
                {getDisplayValue(
                  data.title,
                  "Conference Details",
                )}
              </h1>

              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                  data.status,
                )}`}
              >
                {getDisplayValue(
                  data.status,
                  "Draft",
                )}
              </span>
            </div>

            <p className="mt-0.5 text-[12px] text-gray-500">
              Conference details and configuration
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/conferences/create`,
            )
          }
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[12px] font-semibold text-white transition hover:bg-violet-700"
        >
          <Pencil size={14} />
          Edit Conference
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {/* ===================================================
            MAIN COLUMN
        =================================================== */}
        <div className="min-w-0 space-y-4 xl:col-span-3">
          {/* =================================================
              HERO
          ================================================= */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50">
              {heroImage && (
                <div className="relative h-56 w-full overflow-hidden md:h-72">
                  <img
                    src={heroImage}
                    alt={getDisplayValue(
                      data.title,
                      "Conference",
                    )}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 md:left-7 md:right-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                        {getDisplayValue(
                          data.category,
                          "Conference",
                        )}
                      </span>

                      {data.mode && (
                        <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
                          {getDisplayValue(
                            data.mode,
                          )}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 max-w-4xl text-[24px] font-bold leading-tight text-white md:text-[30px]">
                      {getDisplayValue(
                        data.title,
                        "Untitled Conference",
                      )}
                    </h2>
                  </div>
                </div>
              )}

              <div className="relative px-5 py-6 md:px-7">
                {!heroImage && (
                  <>
                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-100/50 blur-2xl" />

                    <div className="relative">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
                          {getDisplayValue(
                            data.category,
                            "Conference",
                          )}
                        </span>

                        {data.mode && (
                          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-500 shadow-sm">
                            {getDisplayValue(
                              data.mode,
                            )}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 max-w-4xl text-[24px] font-bold leading-tight text-gray-900 md:text-[28px]">
                        {getDisplayValue(
                          data.title,
                          "Untitled Conference",
                        )}
                      </h2>
                    </div>
                  </>
                )}

                {data.subtitle && (
                  <p className="relative mt-2 max-w-4xl text-[13px] font-semibold text-violet-700">
                    {data.subtitle}
                  </p>
                )}

                <p className="relative mt-3 max-w-4xl text-[12px] leading-6 text-gray-500">
                  {description}
                </p>

                <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoItem
                    icon={CalendarDays}
                    label="Conference Date"
                    value={formatDateRange()}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="Location"
                    value={
                      locationDisplay ||
                      venue.venueName ||
                      data.location
                    }
                  />

                  <InfoItem
                    icon={Clock3}
                    label="Timezone"
                    value={
                      venue.timezone ||
                      "Asia/Kolkata"
                    }
                  />

                  <InfoItem
                    icon={Users}
                    label="Participants"
                    value={getDisplayValue(
                      data.participants,
                      "Global",
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              ABOUT / ABOUT IMAGE
          ================================================= */}
          {(aboutImage ||
            data.description ||
            data.subtitle) && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
              <SectionHeader
                icon={BookOpen}
                title="About Conference"
                description="Conference overview and supporting image"
              />

              <div
                className={`mt-5 grid gap-5 ${
                  aboutImage
                    ? "lg:grid-cols-[1.2fr_0.8fr]"
                    : "grid-cols-1"
                }`}
              >
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  {data.subtitle && (
                    <p className="text-[13px] font-semibold text-violet-700">
                      {data.subtitle}
                    </p>
                  )}

                  <p className="mt-3 whitespace-pre-line text-[12px] leading-6 text-gray-600">
                    {description}
                  </p>
                </div>

                {aboutImage && (
                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <img
                      src={aboutImage}
                      alt="About conference"
                      className="h-full min-h-[180px] w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* =================================================
              SCHEDULE + VENUE
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={CalendarDays}
              title="Conference Schedule & Venue"
              description="Dates, mode, location and venue information"
            />

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailCard
                icon={CalendarDays}
                label="Start Date"
                value={formatDate(
                  data.startDate,
                )}
              />

              <DetailCard
                icon={CalendarDays}
                label="End Date"
                value={formatDate(
                  data.endDate,
                )}
              />

              <DetailCard
                icon={Clock3}
                label="Time"
                value={getDisplayValue(
                  data.time,
                  "Webinar",
                )}
              />

              <DetailCard
                icon={Globe2}
                label="Mode"
                value={getDisplayValue(
                  data.mode,
                  "Webinar",
                )}
              />

              <DetailCard
                icon={MapPin}
                label="Venue"
                value={getDisplayValue(
                  venue.venueName,
                  "Not specified",
                )}
              />

              <DetailCard
                icon={Map}
                label="City"
                value={getDisplayValue(
                  venue.city,
                  "Not specified",
                )}
              />

              <DetailCard
                icon={Globe2}
                label="Country"
                value={getDisplayValue(
                  venue.country,
                  "Not specified",
                )}
              />

              <DetailCard
                icon={Clock3}
                label="Timezone"
                value={getDisplayValue(
                  venue.timezone,
                  "Asia/Kolkata",
                )}
              />
            </div>

            {venueAddress && (
              <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                    <MapPin
                      size={14}
                      className="text-violet-600"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-400">
                      Full Address
                    </p>

                    <p className="mt-1 text-[12px] font-semibold leading-5 text-gray-700">
                      {venueAddress}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3">
                      {venue.mapUrl && (
                        <a
                          href={venue.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-violet-600 hover:text-violet-700"
                        >
                          <ExternalLink size={12} />
                          View on Map
                        </a>
                      )}

                      {venue.onlineLink && (
                        <a
                          href={venue.onlineLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-violet-600 hover:text-violet-700"
                        >
                          <Globe2 size={12} />
                          Online Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* =================================================
              REGISTRATION DATES
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={CalendarRange}
              title="Registration Dates"
              description="All registration and submission deadlines"
            />

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailCard
                icon={CalendarDays}
                label="Registration Start"
                value={formatDate(
                  registrationDates.registrationStartDate,
                )}
              />

              <DetailCard
                icon={CalendarDays}
                label="Registration Deadline"
                value={formatDate(
                  registrationDates.registrationDeadline,
                )}
              />

              <DetailCard
                icon={FileText}
                label="Abstract Deadline"
                value={formatDate(
                  registrationDates.abstractDeadline,
                )}
              />

              <DetailCard
                icon={BookOpen}
                label="Paper Deadline"
                value={formatDate(
                  registrationDates.paperDeadline,
                )}
              />
            </div>
          </section>

          {/* =================================================
              REGISTRATION CATEGORIES
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={CreditCard}
              title="Registration Categories"
              description="Pricing, early bird rates and category benefits"
            />

            {registrationCategories.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {registrationCategories.map(
                  (item, index) => (
                    <div
                      key={item?._id || index}
                      className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-800">
                            {getDisplayValue(
                              item?.name,
                              `Category ${index + 1}`,
                            )}
                          </h4>

                          <p className="mt-1 text-[11px] leading-5 text-gray-500">
                            {getDisplayValue(
                              item?.description,
                              "No description",
                            )}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                            item?.active
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item?.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <PriceItem
                          label="Price"
                          value={`${getDisplayValue(
                            item?.currency,
                            "USD",
                          )} ${getDisplayValue(
                            item?.price,
                            "0",
                          )}`}
                        />

                        <PriceItem
                          label="Early Bird"
                          value={`${getDisplayValue(
                            item?.currency,
                            "USD",
                          )} ${getDisplayValue(
                            item?.earlyBirdPrice,
                            "0",
                          )}`}
                        />

                        <PriceItem
                          label="Regular"
                          value={`${getDisplayValue(
                            item?.currency,
                            "USD",
                          )} ${getDisplayValue(
                            item?.regularPrice,
                            "0",
                          )}`}
                        />

                        <PriceItem
                          label="Onsite"
                          value={`${getDisplayValue(
                            item?.currency,
                            "USD",
                          )} ${getDisplayValue(
                            item?.onsitePrice,
                            "0",
                          )}`}
                        />
                      </div>

                      <div className="mt-3 rounded-lg bg-white p-3">
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                          Early Bird Deadline
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-gray-700">
                          {formatDate(
                            item?.earlyBirdDeadline,
                          )}
                        </p>
                      </div>

                      {safeArray(item?.benefits)
                        .length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] font-semibold text-gray-500">
                            Benefits
                          </p>

                          <ul className="mt-2 space-y-1.5">
                            {safeArray(
                              item.benefits,
                            ).map(
                              (
                                benefit,
                                benefitIndex,
                              ) => (
                                <li
                                  key={
                                    benefitIndex
                                  }
                                  className="flex items-start gap-2 text-[11px] leading-5 text-gray-600"
                                >
                                  <CheckCircle2
                                    size={13}
                                    className="mt-0.5 shrink-0 text-emerald-500"
                                  />
                                  <span>
                                    {getDisplayValue(
                                      benefit,
                                    )}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptySection text="No registration categories added yet." />
            )}
          </section>

          {/* =================================================
              WELCOME MESSAGE
          ================================================= */}
          {(welcomeMessage.heading ||
            safeArray(
              welcomeMessage.paragraphs,
            ).length > 0 ||
            welcomeMessage.signature) && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
              <SectionHeader
                icon={MessageSquare}
                title="Welcome Message"
                description="Official conference welcome message"
              />

              <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50/40 p-5">
                <h3 className="text-[16px] font-bold text-gray-800">
                  {getDisplayValue(
                    welcomeMessage.heading,
                    "Welcome Message",
                  )}
                </h3>

                <div className="mt-4 space-y-3">
                  {safeArray(
                    welcomeMessage.paragraphs,
                  ).map((paragraph, index) => (
                    <p
                      key={index}
                      className="whitespace-pre-line text-[12px] leading-6 text-gray-600"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {welcomeMessage.signature && (
                  <p className="mt-5 text-[12px] font-semibold text-violet-700">
                    {welcomeMessage.signature}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* =================================================
              WHO SHOULD ATTEND
          ================================================= */}
          {(whoShouldAttend.length > 0 ||
            data.whoShouldAttendDescription) && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
              <SectionHeader
                icon={Users}
                title="Who Should Attend"
                description="Target participants and attendee profile"
              />

              {data.whoShouldAttendDescription && (
                <p className="mt-5 text-[12px] leading-6 text-gray-600">
                  {data.whoShouldAttendDescription}
                </p>
              )}

              {whoShouldAttend.length > 0 && (
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {whoShouldAttend.map(
                    (item, index) => (
                      <BulletItem
                        key={index}
                        value={item}
                      />
                    ),
                  )}
                </div>
              )}
            </section>
          )}

          {/* =================================================
              KEY HIGHLIGHTS
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={Award}
              title="Key Highlights"
              description="Important conference highlights"
            />

            {keyHighlights.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {keyHighlights.map(
                  (item, index) => (
                    <ContentCard
                      key={index}
                      icon={Award}
                      title={item?.title}
                      description={
                        item?.description
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptySection text="No key highlights added yet." />
            )}
          </section>

          {/* =================================================
              TOPICS
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={ListChecks}
              title="Topics"
              description="Conference topics and research areas"
            />

            {topics.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {topics.map((item, index) => (
                  <ContentCard
                    key={index}
                    icon={ListChecks}
                    title={item?.title}
                    description={
                      item?.description
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptySection text="No topics added yet." />
            )}
          </section>

          {/* =================================================
              TRACKS
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={Layers3}
              title="Tracks"
              description="Conference tracks and session themes"
            />

            {tracks.length > 0 ? (
              <div className="mt-5 space-y-3">
                {tracks.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                        <Layers3
                          size={14}
                          className="text-violet-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-[12px] font-bold text-gray-800">
                          {getDisplayValue(
                            item?.title,
                            `Track ${index + 1}`,
                          )}
                        </h4>

                        <p className="mt-1 text-[11px] leading-5 text-gray-500">
                          {getDisplayValue(
                            item?.description,
                            "No description",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptySection text="No tracks added yet." />
            )}
          </section>

          {/* =================================================
              SPEAKERS WITH IMAGES
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={Users}
              title="Speakers"
              description="Conference speakers, organizations, specialties and biographies"
            />

            {speakers.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {speakers.map(
                  (speaker, index) => {
                    const speakerImage =
                      getImageUrl(
                        speaker?.image,
                      );

                    return (
                      <div
                        key={
                          speaker?._id ||
                          speaker?.id ||
                          index
                        }
                        className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50/60 transition hover:border-violet-100 hover:bg-violet-50/30"
                      >
                        {speakerImage ? (
                          <img
                            src={speakerImage}
                            alt={getDisplayValue(
                              speaker?.name,
                              `Speaker ${
                                index + 1
                              }`,
                            )}
                            className="h-44 w-full object-cover"
                            onError={(
                              event,
                            ) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-44 w-full items-center justify-center bg-violet-50">
                            <UserRound
                              size={42}
                              className="text-violet-300"
                            />
                          </div>
                        )}

                        <div className="p-4">
                          <h4 className="text-[13px] font-bold text-gray-800">
                            {getDisplayValue(
                              speaker?.name,
                              `Speaker ${
                                index + 1
                              }`,
                            )}
                          </h4>

                          <p className="mt-1 text-[10px] font-semibold text-violet-600">
                            {getDisplayValue(
                              speaker?.role,
                              "Role not specified",
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-500">
                            {getDisplayValue(
                              speaker?.organization,
                              "Organization not specified",
                            )}
                          </p>

                          {speaker?.specialty && (
                            <p className="mt-2 text-[10px] text-gray-500">
                              <strong>
                                Specialty:
                              </strong>{" "}
                              {
                                speaker.specialty
                              }
                            </p>
                          )}

                          {speaker?.country && (
                            <p className="mt-1 text-[10px] text-gray-500">
                              <strong>
                                Country:
                              </strong>{" "}
                              {speaker.country}
                            </p>
                          )}

                          {speaker?.bio && (
                            <p className="mt-3 whitespace-pre-line text-[10px] leading-5 text-gray-500">
                              {speaker.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <EmptySection text="No speakers added yet." />
            )}
          </section>

          {/* =================================================
              COMMITTEE WITH IMAGES
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={HeartHandshake}
              title="Committee"
              description="Scientific and organizing committee"
            />

            {committee.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {committee.map(
                  (member, index) => {
                    const memberImage =
                      getImageUrl(
                        member?.image,
                      );

                    return (
                      <div
                        key={
                          member?._id ||
                          member?.id ||
                          index
                        }
                        className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3"
                      >
                        {memberImage ? (
                          <img
                            src={memberImage}
                            alt={getDisplayValue(
                              member?.name,
                              "Committee member",
                            )}
                            className="h-14 w-14 shrink-0 rounded-xl object-cover"
                            onError={(
                              event,
                            ) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                            <UserRound
                              size={20}
                              className="text-violet-500"
                            />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h4 className="text-[12px] font-bold text-gray-800">
                            {getDisplayValue(
                              member?.name,
                              `Member ${
                                index + 1
                              }`,
                            )}
                          </h4>

                          <p className="mt-1 text-[10px] font-semibold text-violet-600">
                            {getDisplayValue(
                              member?.role,
                              "Role not specified",
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-500">
                            {getDisplayValue(
                              member?.organization,
                              "Organization not specified",
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <EmptySection text="No committee members added yet." />
            )}
          </section>

          {/* =================================================
              OTHER DATA - WHY ATTEND
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={HeartHandshake}
              title="Why To Attend"
              description="Reasons and value for conference attendees"
            />

            {whyToAttend.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {whyToAttend.map(
                  (item, index) => (
                    <ContentCard
                      key={index}
                      icon={HeartHandshake}
                      title={item?.title}
                      description={
                        item?.description
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptySection text="No why-to-attend items added yet." />
            )}
          </section>

          {/* =================================================
              BENEFITS
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={Award}
              title="Benefits Of Attending"
              description="Benefits available to participants"
            />

            {benefitsOfAttending.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {benefitsOfAttending.map(
                  (item, index) => (
                    <ContentCard
                      key={index}
                      icon={Award}
                      title={item?.title}
                      description={
                        item?.description
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptySection text="No attendee benefits added yet." />
            )}
          </section>

          {/* =================================================
              DELEGATES
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={Users}
              title="Delegates"
              description="Delegate categories and descriptions"
            />

            {delegates.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {delegates.map(
                  (item, index) => (
                    <ContentCard
                      key={index}
                      icon={Users}
                      title={item?.title}
                      description={
                        item?.description
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptySection text="No delegate categories added yet." />
            )}
          </section>

          {/* =================================================
              SAMPLE AGENDA
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={Presentation}
              title="Sample Agenda"
              description="Daily agenda and session schedule"
            />

            {sampleAgenda.length > 0 ? (
              <div className="mt-5 space-y-4">
                {sampleAgenda.map(
                  (day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                    >
                      <h4 className="text-[13px] font-bold text-gray-800">
                        {getDisplayValue(
                          day?.day,
                          `Day ${
                            dayIndex + 1
                          }`,
                        )}
                      </h4>

                      {safeArray(
                        day?.schedule,
                      ).length > 0 ? (
                        <div className="mt-3 overflow-x-auto">
                          <table className="w-full min-w-[420px] border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="px-2 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                                  Time
                                </th>
                                <th className="px-2 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                                  Session
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {safeArray(
                                day.schedule,
                              ).map(
                                (
                                  session,
                                  sessionIndex,
                                ) => (
                                  <tr
                                    key={
                                      sessionIndex
                                    }
                                    className="border-b border-gray-100 last:border-0"
                                  >
                                    <td className="px-2 py-2 text-[10px] font-semibold text-violet-600">
                                      {getDisplayValue(
                                        session?.time,
                                        "—",
                                      )}
                                    </td>

                                    <td className="px-2 py-2 text-[11px] text-gray-600">
                                      {getDisplayValue(
                                        session?.session,
                                        "—",
                                      )}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="mt-3 text-[10px] text-gray-400">
                          No sessions for this day.
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptySection text="No sample agenda added yet." />
            )}
          </section>

          {/* =================================================
              POSTER PRESENTERS LIVE
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={Presentation}
              title="Poster Presenters Live"
              description="Live poster presenter list"
            />

            {posterPresentersLive.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {posterPresentersLive.map(
                  (item, index) => (
                    <BulletItem
                      key={index}
                      value={item}
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptySection text="No live poster presenters added yet." />
            )}
          </section>

          {/* =================================================
              E-POSTER
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={FileText}
              title="E-Poster Information"
              description="E-poster benefits, specifications and submission guidelines"
            />

            <div className="mt-5 space-y-5">
              {ePoster.guidelinesIntro && (
                <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
                  <p className="text-[12px] leading-6 text-gray-600">
                    {
                      ePoster.guidelinesIntro
                    }
                  </p>
                </div>
              )}

              <StringListSection
                title="Benefits"
                items={ePoster.benefits}
                icon={Award}
              />

              <StringListSection
                title="Poster Content"
                items={ePoster.posterContent}
                icon={FileText}
              />

              <StringListSection
                title="Design Requirements"
                items={
                  ePoster.designRequirements
                }
                icon={ImageIcon}
              />

              <StringListSection
                title="Submission Guidelines"
                items={
                  ePoster.submissionGuidelines
                }
                icon={Send}
              />

              <StringListSection
                title="Review & Acceptance"
                items={
                  ePoster.reviewAndAcceptance
                }
                icon={CheckCircle2}
              />

              <StringListSection
                title="Presentation"
                items={ePoster.presentation}
                icon={Presentation}
              />

              <StringListSection
                title="Certificate"
                items={ePoster.certificate}
                icon={Award}
              />

              <StringListSection
                title="Closing Notes"
                items={ePoster.closingNotes}
                icon={MessageSquare}
              />

              {ePoster.specifications &&
                Object.keys(
                  ePoster.specifications,
                ).length > 0 && (
                  <div>
                    <h4 className="text-[12px] font-bold text-gray-800">
                      Specifications
                    </h4>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {Object.entries(
                        ePoster.specifications,
                      ).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="rounded-lg border border-gray-100 bg-gray-50/60 p-3"
                          >
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                              {key}
                            </p>

                            <p className="mt-1 text-[11px] font-semibold text-gray-700">
                              {getDisplayValue(
                                value,
                              )}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          </section>

          {/* =================================================
              MARKET ANALYSIS
          ================================================= */}
          {(marketAnalysis.heading ||
            safeArray(
              marketAnalysis.paragraphs,
            ).length > 0 ||
            marketImage) && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
              <SectionHeader
                icon={Presentation}
                title="Market Analysis"
                description="Market analysis content and image"
              />

              <div
                className={`mt-5 grid gap-5 ${
                  marketImage
                    ? "lg:grid-cols-[1fr_0.8fr]"
                    : "grid-cols-1"
                }`}
              >
                <div>
                  <h4 className="text-[15px] font-bold text-gray-800">
                    {getDisplayValue(
                      marketAnalysis.heading,
                      "Market Analysis",
                    )}
                  </h4>

                  <div className="mt-3 space-y-3">
                    {safeArray(
                      marketAnalysis.paragraphs,
                    ).map(
                      (
                        paragraph,
                        index,
                      ) => (
                        <p
                          key={index}
                          className="whitespace-pre-line text-[12px] leading-6 text-gray-600"
                        >
                          {paragraph}
                        </p>
                      ),
                    )}
                  </div>
                </div>

                {marketImage && (
                  <img
                    src={marketImage}
                    alt="Market analysis"
                    className="h-full min-h-[200px] w-full rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                )}
              </div>
            </section>
          )}

          {/* =================================================
              SUBMISSION & REVIEW
          ================================================= */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-6">
            <SectionHeader
              icon={FileText}
              title="Submission & Review"
              description="Abstract, paper, presentation and review configuration"
            />

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={FileText}
                label="Abstract Submission"
                enabled={
                  submission.abstractSubmission
                }
              />

              <FeatureCard
                icon={BookOpen}
                label="Paper Submission"
                enabled={
                  submission.paperSubmission
                }
              />

              <FeatureCard
                icon={Presentation}
                label="Oral Presentation"
                enabled={
                  submission.oralPresentation
                }
              />

              <FeatureCard
                icon={ImageIcon}
                label="Poster Presentation"
                enabled={
                  submission.posterPresentation
                }
              />

              <FeatureCard
                icon={Globe2}
                label="Virtual Presentation"
                enabled={
                  submission.virtualPresentation
                }
              />

              <DetailCard
                icon={Layers3}
                label="Review Type"
                value={getDisplayValue(
                  submission.reviewType,
                  "Single Blind",
                )}
              />

              <DetailCard
                icon={FileText}
                label="Max Abstract Words"
                value={getDisplayValue(
                  submission.maxAbstractWords,
                  "300",
                )}
              />
            </div>
          </section>
        </div>

        {/* ===================================================
            SIDEBAR
        =================================================== */}
        <div className="min-w-0 space-y-4">
          {/* OVERVIEW */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-[14px] font-bold text-gray-900">
              Conference Overview
            </h3>

            <div className="mt-4 space-y-3">
              <OverviewItem
                icon={Layers3}
                label="Category"
                value={data.category}
              />

              <OverviewItem
                icon={CheckCircle2}
                label="Status"
                value={data.status}
              />

              <OverviewItem
                icon={Globe2}
                label="Country"
                value={venue.country}
              />

              <OverviewItem
                icon={Users}
                label="Participants"
                value={data.participants}
              />

              <OverviewItem
                icon={Users}
                label="Registrations"
                value={getRegistrationCount()}
              />

              <OverviewItem
                icon={Users}
                label="Registration Limit"
                value={registrationLimit}
              />
            </div>
          </section>

          {/* REGISTRATION */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-[14px] font-bold text-gray-900">
              Registration
            </h3>

            <div className="mt-4 space-y-3">
              <OverviewItem
                icon={CreditCard}
                label="Categories"
                value={registrationCategories.length}
              />

              <OverviewItem
                icon={Users}
                label="Registered"
                value={getRegistrationCount()}
              />

              <OverviewItem
                icon={Users}
                label="Maximum"
                value={registrationLimit}
              />
            </div>
          </section>

          {/* CONTACT */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-[14px] font-bold text-gray-900">
              Contact
            </h3>

            <div className="mt-4 space-y-3">
              {contact.email && (
                <ContactItem
                  icon={Mail}
                  label="Email"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />
              )}

              {contact.phone && (
                <ContactItem
                  icon={Phone}
                  label="Phone"
                  value={contact.phone}
                  href={`tel:${contact.phone}`}
                />
              )}

              {contact.whatsapp && (
                <ContactItem
                  icon={Smartphone}
                  label="WhatsApp"
                  value={contact.whatsapp}
                  href={`https://wa.me/${String(
                    contact.whatsapp,
                  ).replace(
                    /[^0-9]/g,
                    "",
                  )}`}
                />
              )}

              {contact.website && (
                <ContactItem
                  icon={Globe2}
                  label="Website"
                  value={contact.website}
                  href={contact.website}
                />
              )}

              {contact.linkedin && (
                <ContactItem
                 
                  label="LinkedIn"
                  value={contact.linkedin}
                  href={contact.linkedin}
                />
              )}

              {contact.instagram && (
                <ContactItem
                
                  label="Instagram"
                  value={contact.instagram}
                  href={contact.instagram}
                />
              )}

              {contact.facebook && (
                <ContactItem
                  label="Facebook"
                  value={contact.facebook}
                  href={contact.facebook}
                />
              )}

              {!contact.email &&
                !contact.phone &&
                !contact.whatsapp &&
                !contact.website &&
                !contact.linkedin &&
                !contact.instagram &&
                !contact.facebook && (
                  <EmptySection text="No contact information added yet." />
                )}
            </div>
          </section>

          {/* WEBSITE */}
          {website && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="text-[14px] font-bold text-gray-900">
                Website
              </h3>

              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2.5 text-[11px] font-semibold text-violet-600 transition hover:bg-violet-100"
              >
                <Globe2 size={14} />

                <span className="min-w-0 flex-1 truncate">
                  Visit Conference Website
                </span>

                <ExternalLink size={13} />
              </a>
            </section>
          )}

          {/* SPONSORS */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-[14px] font-bold text-gray-900">
              Sponsors
            </h3>

            {sponsors.length > 0 ? (
              <div className="mt-4 space-y-3">
                {sponsors.map(
                  (sponsor, index) => {
                    const sponsorImage =
                      getImageUrl(sponsor);

                    const sponsorName =
                      typeof sponsor ===
                      "string"
                        ? sponsor
                        : getDisplayValue(
                            sponsor?.name ||
                              sponsor?.title,
                            `Sponsor ${
                              index + 1
                            }`,
                          );

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3"
                      >
                        {sponsorImage &&
                        isImageUrl(
                          sponsorImage,
                        ) ? (
                          <img
                            src={sponsorImage}
                            alt={sponsorName}
                            className="h-10 w-10 shrink-0 rounded-lg object-contain bg-white"
                            onError={(
                              event,
                            ) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                            <Building2
                              size={16}
                              className="text-violet-600"
                            />
                          </div>
                        )}

                        <p className="min-w-0 truncate text-[11px] font-semibold text-gray-700">
                          {sponsorName}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <EmptySection text="No sponsors added yet." />
            )}
          </section>

          {/* RECORD INFORMATION */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-[14px] font-bold text-gray-900">
              Record Information
            </h3>

            <div className="mt-4 space-y-3">
              <RecordItem
                label="Created"
                value={formatDateTime(
                  data.createdAt,
                )}
              />

              <RecordItem
                label="Last Updated"
                value={formatDateTime(
                  data.updatedAt,
                )}
              />

              <RecordItem
                label="Speakers"
                value={getArrayLength(
                  speakers,
                )}
              />

              <RecordItem
                label="Committee"
                value={getArrayLength(
                  committee,
                )}
              />

              <RecordItem
                label="Topics"
                value={getArrayLength(
                  topics,
                )}
              />

              <RecordItem
                label="Tracks"
                value={getArrayLength(
                  tracks,
                )}
              />

              <RecordItem
                label="Registration Categories"
                value={getArrayLength(
                  registrationCategories,
                )}
              />

              <RecordItem
                label="Created By"
                value={getDisplayValue(
                  data.createdBy,
                  "Not available",
                )}
              />

              <RecordItem
                label="Updated By"
                value={getDisplayValue(
                  data.updatedBy,
                  "Not available",
                )}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* =============================================================
   REUSABLE UI COMPONENTS
============================================================= */

const InfoItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-white/80 bg-white/75 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          className="shrink-0 text-violet-600"
        />

        <p className="truncate text-[10px] font-medium text-gray-400">
          {label}
        </p>
      </div>

      <p className="mt-1.5 truncate text-[12px] font-semibold text-gray-800">
        {formatSafeValue(value)}
      </p>
    </div>
  );
};

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
        <Icon
          size={16}
          className="text-violet-600"
        />
      </div>

      <div>
        <h3 className="text-[14px] font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

const DetailCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          className="text-violet-600"
        />

        <span className="text-[10px] font-medium text-gray-400">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-[12px] font-semibold text-gray-700">
        {formatSafeValue(value)}
      </p>
    </div>
  );
};

const FeatureCard = ({
  icon: Icon,
  label,
  enabled,
}) => {
  const isEnabled =
    enabled === true ||
    enabled === "true" ||
    enabled === "Yes";

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          className="text-violet-600"
        />

        <span className="text-[10px] font-medium text-gray-400">
          {label}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        {isEnabled ? (
          <>
            <CheckCircle2
              size={14}
              className="text-emerald-500"
            />

            <span className="text-[12px] font-semibold text-emerald-600">
              Enabled
            </span>
          </>
        ) : (
          <>
            <XCircle
              size={14}
              className="text-gray-400"
            />

            <span className="text-[12px] font-semibold text-gray-500">
              Disabled
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const OverviewItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
        <Icon
          size={14}
          className="text-violet-600"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-[11px] font-semibold text-gray-700">
          {formatSafeValue(value)}
        </p>
      </div>
    </div>
  );
};

const ContactItem = ({
  icon: Icon,
  label,
  value,
  href,
}) => {
  const safeValue = formatSafeValue(value);

  const content = (
    <>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
        <Icon
          size={14}
          className="text-violet-600"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 break-all text-[11px] font-semibold text-gray-700">
          {safeValue}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
            ? undefined
            : "_blank"
        }
        rel={
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
            ? undefined
            : "noreferrer"
        }
        className="flex items-center gap-3 rounded-lg p-1 transition hover:bg-violet-50/50"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {content}
    </div>
  );
};

const RecordItem = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
      <span className="shrink-0 text-[10px] text-gray-400">
        {label}
      </span>

      <span className="max-w-[60%] break-words text-right text-[11px] font-semibold text-gray-700">
        {formatSafeValue(
          value,
          "Not available",
        )}
      </span>
    </div>
  );
};

const PriceItem = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2.5">
      <p className="text-[8px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-[10px] font-bold text-gray-700">
        {value}
      </p>
    </div>
  );
};

const ContentCard = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
          <Icon
            size={14}
            className="text-violet-600"
          />
        </div>

        <div className="min-w-0">
          <h4 className="text-[12px] font-bold text-gray-800">
            {formatSafeValue(
              title,
              "Untitled",
            )}
          </h4>

          <p className="mt-1 text-[11px] leading-5 text-gray-500">
            {formatSafeValue(
              description,
              "No description",
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const BulletItem = ({ value }) => {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50/60 p-3">
      <CheckCircle2
        size={13}
        className="mt-0.5 shrink-0 text-emerald-500"
      />

      <span className="text-[11px] leading-5 text-gray-600">
        {formatSafeValue(value)}
      </span>
    </div>
  );
};

const StringListSection = ({
  title,
  items,
  icon: Icon = ListChecks,
}) => {
  const list = Array.isArray(items)
    ? items
    : [];

  if (list.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-[12px] font-bold text-gray-800">
        <Icon
          size={14}
          className="text-violet-600"
        />
        {title}
      </h4>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {list.map((item, index) => (
          <BulletItem
            key={index}
            value={item}
          />
        ))}
      </div>
    </div>
  );
};

const EmptySection = ({ text }) => {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-8 text-center">
      <p className="text-[11px] text-gray-400">
        {text}
      </p>
    </div>
  );
};

const formatSafeValue = (
  value,
  fallback = "Not specified",
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.length
      ? value
          .map((item) =>
            formatSafeValue(item, ""),
          )
          .filter(Boolean)
          .join(", ")
      : fallback;
  }

  if (typeof value === "object") {
    if (value.name) {
      return String(value.name);
    }

    if (value.title) {
      return String(value.title);
    }

    if (value.label) {
      return String(value.label);
    }

    if (value.value) {
      return String(value.value);
    }

    if (value._id) {
      return String(value._id);
    }

    return fallback;
  }

  return fallback;
};

export default ConferenceDetails;
