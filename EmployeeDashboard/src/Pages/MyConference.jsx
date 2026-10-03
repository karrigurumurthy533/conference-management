
import React, { useEffect } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  FileText,
  Globe2,
  Mail,
  Phone,
  Link2,
  Clock3,
  Video,
  BookOpen,
  UserRound,
  ExternalLink,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  getEmployeeConference,
  selectEmployeeConference,
  selectEmployeeConferenceLoading,
  selectEmployeeConferenceError,
} from "../redux/employeeSlice";

function MyConference() {
  const dispatch = useDispatch();

  const conferences = useSelector(selectEmployeeConference);
  const loading = useSelector(selectEmployeeConferenceLoading);
  const error = useSelector(selectEmployeeConferenceError);

  useEffect(() => {
    dispatch(getEmployeeConference());
  }, [dispatch]);

  // =========================================================
  // GET ASSIGNED CONFERENCE
  // =========================================================

  const conferenceData = conferences || null;

  // =========================================================
  // HELPERS
  // =========================================================

  const getValue = (...values) => {
    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        return value;
      }
    }

    return "—";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  // =========================================================
  // NORMALIZE API DATA
  // =========================================================

  const basicInformation =
    conferenceData?.basicInformation || {};

  const conferenceDates =
    conferenceData?.conferenceDates || {};

  const venueInformation =
    conferenceData?.venueInformation || {};

  const registrationInformation =
    conferenceData?.registrationInformation || {};

  const submissionInformation =
    conferenceData?.submissionInformation || {};

  const media =
    conferenceData?.media || {};

  const contactInformation =
    conferenceData?.contactInformation ||
    conferenceData?.contact ||
    {};

  const speakers =
    conferenceData?.speakers || [];

  const committee =
    conferenceData?.committee || [];

  const sessions =
    conferenceData?.sessions ||
    conferenceData?.scientificProgram ||
    [];

  const topics =
    conferenceData?.topics || [];

  const registrationTypes =
    conferenceData?.registrationTypes ||
    registrationInformation?.registrationTypes ||
    [];

  // =========================================================
  // CONFERENCE BANNER IMAGE
  // =========================================================

  const getImageUrl = (...values) => {
    for (const value of values) {
      if (!value) continue;

      if (typeof value === "string" && value.trim() !== "") {
        return value;
      }

      if (typeof value === "object") {
        if (value?.url) return value.url;
        if (value?.secure_url) return value.secure_url;
        if (value?.imageUrl) return value.imageUrl;
        if (value?.path) return value.path;
      }
    }

    return "";
  };

  const bannerImage = getImageUrl(
    media?.heroImage,
    media?.bannerImage,
    media?.conferenceImage,
    media?.coverImage,
    media?.hero,
    media?.banner,
    media?.image,
    conferenceData?.conferenceImage,
    conferenceData?.heroImage,
    conferenceData?.bannerImage,
    conferenceData?.image
  );

  // =========================================================
  // NORMALIZED CONFERENCE
  // =========================================================

  const conference = {
    conferenceName: getValue(
      basicInformation?.conferenceName,
      basicInformation?.title,
      conferenceData?.title,
      conferenceData?.conferenceName
    ),

    shortName: getValue(
      basicInformation?.shortName,
      basicInformation?.acronym,
      conferenceData?.shortName
    ),

    category: getValue(
      basicInformation?.category,
      conferenceData?.category
    ),

    type: getValue(
      basicInformation?.type,
      conferenceData?.type,
      venueInformation?.type
    ),

    status: getValue(
      conferenceData?.status,
      basicInformation?.status
    ),

    description: getValue(
      basicInformation?.description,
      conferenceData?.description
    ),

    startDate: formatDate(
      conferenceDates?.startDate ||
        conferenceDates?.start ||
        conferenceData?.startDate
    ),

    endDate: formatDate(
      conferenceDates?.endDate ||
        conferenceDates?.end ||
        conferenceData?.endDate
    ),

    registrationStartDate: formatDate(
      registrationInformation?.registrationStartDate ||
        registrationInformation?.startDate ||
        conferenceData?.registrationStartDate
    ),

    registrationDeadline: formatDate(
      registrationInformation?.registrationDeadline ||
        registrationInformation?.deadline ||
        conferenceData?.registrationDeadline
    ),

    abstractDeadline: formatDate(
      submissionInformation?.abstractDeadline ||
        conferenceData?.abstractDeadline
    ),

    paperDeadline: formatDate(
      submissionInformation?.paperDeadline ||
        conferenceData?.paperDeadline
    ),

    timezone: getValue(
      venueInformation?.timezone,
      conferenceData?.timezone
    ),

    venueName: getValue(
      venueInformation?.venueName,
      venueInformation?.venue,
      conferenceData?.venueName
    ),

    address: getValue(
      venueInformation?.address,
      conferenceData?.address
    ),

    city: getValue(
      venueInformation?.city,
      conferenceData?.city
    ),

    state: getValue(
      venueInformation?.state,
      conferenceData?.state
    ),

    country: getValue(
      venueInformation?.country,
      conferenceData?.country
    ),

    mapUrl: getValue(
      venueInformation?.mapUrl,
      conferenceData?.mapUrl
    ),

    onlineLink: getValue(
      venueInformation?.onlineLink,
      venueInformation?.meetingLink,
      conferenceData?.onlineLink
    ),

    contactEmail: getValue(
      contactInformation?.email,
      conferenceData?.contactEmail,
      conferenceData?.email
    ),

    phone: getValue(
      contactInformation?.phone,
      conferenceData?.phone,
      conferenceData?.phoneNumber
    ),

    website: getValue(
      contactInformation?.website,
      conferenceData?.website
    ),

    linkedin: getValue(
      contactInformation?.linkedin,
      conferenceData?.linkedin
    ),

    instagram: getValue(
      contactInformation?.instagram,
      conferenceData?.instagram
    ),

    facebook: getValue(
      contactInformation?.facebook,
      conferenceData?.facebook
    ),

    expectedAttendees: getValue(
      basicInformation?.expectedAttendees,
      conferenceData?.expectedAttendees
    ),

    abstractSubmission:
      submissionInformation?.abstractSubmission ??
      conferenceData?.abstractSubmission ??
      false,

    paperSubmission:
      submissionInformation?.paperSubmission ??
      conferenceData?.paperSubmission ??
      false,

    oralPresentation:
      submissionInformation?.oralPresentation ??
      conferenceData?.oralPresentation ??
      false,

    posterPresentation:
      submissionInformation?.posterPresentation ??
      conferenceData?.posterPresentation ??
      false,

    virtualPresentation:
      submissionInformation?.virtualPresentation ??
      conferenceData?.virtualPresentation ??
      false,

    reviewType: getValue(
      submissionInformation?.reviewType,
      conferenceData?.reviewType
    ),

    maxAbstractWords: getValue(
      submissionInformation?.maxAbstractWords,
      conferenceData?.maxAbstractWords
    ),

    topics: Array.isArray(topics)
      ? topics.map((topic) =>
          typeof topic === "string"
            ? topic
            : topic?.name || topic?.title || "—"
        )
      : [],

    registrationTypes: Array.isArray(registrationTypes)
      ? registrationTypes
      : [],

    speakers: Array.isArray(speakers)
      ? speakers
      : [],

    committee: Array.isArray(committee)
      ? committee
      : [],

    sessions: Array.isArray(sessions)
      ? sessions
      : [],
  };

  // =========================================================
  // STATUS COLOR
  // =========================================================

  const statusColor =
    conference.status === "Published"
      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
      : conference.status === "Draft"
      ? "bg-amber-50 text-amber-600 border-amber-100"
      : "bg-slate-100 text-slate-600 border-slate-200";

  // =========================================================
  // INFO CARD
  // =========================================================

  const InfoCard = ({
    icon: Icon,
    label,
    value,
  }) => (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
        <Icon
          size={17}
          strokeWidth={1.8}
          className="text-violet-600"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[12px] font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );

  // =========================================================
  // DETAIL ITEM
  // =========================================================

  const DetailItem = ({
    label,
    value,
  }) => (
    <div>
      <p className="text-[10px] font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[12px] font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );

  // =========================================================
  // SECTION
  // =========================================================

  const Section = ({
    title,
    description,
    icon: Icon,
    children,
  }) => (
    <section className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_5px_rgba(15,23,42,0.025)]">
      <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3.5">
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
            <Icon
              size={16}
              className="text-violet-600"
            />
          </div>
        )}

        <div>
          <h2 className="text-[14px] font-bold text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-[11px] text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="p-4">
        {children}
      </div>
    </section>
  );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-100 border-t-violet-600" />

              <p className="mt-3 text-[12px] font-medium text-slate-500">
                Loading conference details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR / NO CONFERENCE
  // =========================================================

  if (error || !conferenceData) {
    return (
      <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="rounded-xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                <CalendarDays
                  size={22}
                  className="text-violet-600"
                />
              </div>

              <h2 className="mt-4 text-[15px] font-bold text-slate-800">
                No Conference Assigned
              </h2>

              <p className="mt-1 max-w-sm text-[11px] leading-5 text-slate-500">
                {error ||
                  "There is no conference assigned to your employee account."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-[1400px]">

        {/* ===================================================
            HEADER + IMAGE BANNER
        =================================================== */}

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">

          {/* IMAGE BANNER */}

          {bannerImage && (
            <div className="relative h-[180px] w-full overflow-hidden sm:h-[220px] lg:h-[250px]">
              <img
                src={bannerImage}
                alt={conference.conferenceName}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              {/* OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              {/* IMAGE TITLE */}

              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-violet-600 backdrop-blur-sm">
                    {conference.category}
                  </span>

                  <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-700 backdrop-blur-sm">
                    {conference.type}
                  </span>
                </div>

                <h1 className="mt-2 max-w-4xl text-[20px] font-bold leading-7 text-white sm:text-[24px]">
                  {conference.conferenceName}
                </h1>
              </div>
            </div>
          )}

          <div className="p-5">

            <div className="flex flex-col justify-between gap-4 lg:flex-row">

              <div className="max-w-3xl">

                {/* SHOW BADGES ONLY WHEN IMAGE EXISTS */}

                {!bannerImage && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
                      {conference.category}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                      {conference.type}
                    </span>
                  </div>
                )}

                <h2 className="mt-3 text-[20px] font-bold leading-7 tracking-tight text-slate-900">
                  {conference.conferenceName}
                </h2>

                <p className="mt-2 max-w-3xl text-[12px] leading-5 text-slate-500">
                  {conference.description}
                </p>

              </div>

              <div className="flex shrink-0 items-start">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-medium text-slate-400">
                    Conference Code
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-slate-800">
                    {conference.shortName}
                  </p>
                </div>
              </div>

            </div>

            {/* QUICK INFO */}

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">

              <InfoCard
                icon={CalendarDays}
                label="Conference Dates"
                value={`${conference.startDate} - ${conference.endDate}`}
              />

              <InfoCard
                icon={MapPin}
                label="Location"
                value={`${conference.city}, ${conference.country}`}
              />

              <InfoCard
                icon={Users}
                label="Expected Attendees"
                value={conference.expectedAttendees}
              />

              <InfoCard
                icon={Globe2}
                label="Conference Type"
                value={conference.type}
              />

            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="mt-4 space-y-4">

          {/* BASIC INFORMATION */}

          <Section
            title="Conference Information"
            description="Primary information configured by the administrator"
            icon={FileText}
          >
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">

              <DetailItem
                label="Conference Name"
                value={conference.conferenceName}
              />

              <DetailItem
                label="Short Name"
                value={conference.shortName}
              />

              <DetailItem
                label="Category"
                value={conference.category}
              />

              <DetailItem
                label="Conference Type"
                value={conference.type}
              />

              <div>
                <p className="text-[10px] font-medium text-slate-400">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full border px-2 py-1 text-[9px] font-bold ${statusColor}`}
                >
                  {conference.status}
                </span>
              </div>

            </div>
          </Section>

          {/* DATES & DEADLINES */}

          <Section
            title="Dates & Deadlines"
            description="Conference schedule and important submission dates"
            icon={CalendarDays}
          >
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">

              <DetailItem
                label="Start Date"
                value={conference.startDate}
              />

              <DetailItem
                label="End Date"
                value={conference.endDate}
              />

              <DetailItem
                label="Registration Opens"
                value={conference.registrationStartDate}
              />

              <DetailItem
                label="Registration Deadline"
                value={conference.registrationDeadline}
              />

              <DetailItem
                label="Abstract Deadline"
                value={conference.abstractDeadline}
              />

              <DetailItem
                label="Paper Deadline"
                value={conference.paperDeadline}
              />

              <DetailItem
                label="Time Zone"
                value={conference.timezone}
              />

            </div>
          </Section>

          {/* VENUE */}

          <Section
            title="Venue & Location"
            description="Physical and online conference location"
            icon={MapPin}
          >
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">

              <DetailItem
                label="Venue"
                value={conference.venueName}
              />

              <DetailItem
                label="City"
                value={conference.city}
              />

              <DetailItem
                label="State"
                value={conference.state}
              />

              <DetailItem
                label="Country"
                value={conference.country}
              />

              <div className="col-span-2 sm:col-span-3 lg:col-span-4">
                <DetailItem
                  label="Address"
                  value={conference.address}
                />
              </div>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {conference.mapUrl !== "—" && (
                <a
                  href={conference.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                >
                  <MapPin size={13} />
                  View Map
                  <ExternalLink size={11} />
                </a>
              )}

              {(conference.type === "Virtual" ||
                conference.type === "Hybrid") &&
                conference.onlineLink !== "—" && (
                  <a
                    href={conference.onlineLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[11px] font-semibold text-white transition hover:bg-violet-700"
                  >
                    <Video size={13} />
                    Online Meeting
                    <ExternalLink size={11} />
                  </a>
                )}

            </div>
          </Section>

          {/* REGISTRATION */}

          <Section
            title="Registration"
            description="Registration categories and conference fees"
            icon={Users}
          >
            {conference.registrationTypes.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[600px] text-left">

                  <thead className="bg-slate-50">
                    <tr>

                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Registration Type
                      </th>

                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Early Bird
                      </th>

                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Regular Fee
                      </th>

                      <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Currency
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {conference.registrationTypes.map(
                      (item, index) => (
                        <tr
                          key={item?._id || index}
                          className="border-t border-slate-100"
                        >

                          <td className="px-4 py-3 text-[12px] font-semibold text-slate-800">
                            {item?.type ||
                              item?.name ||
                              "—"}
                          </td>

                          <td className="px-4 py-3 text-[12px] text-slate-600">
                            {item?.earlyBird ||
                              item?.earlyBirdPrice ||
                              "—"}
                          </td>

                          <td className="px-4 py-3 text-[12px] font-semibold text-slate-700">
                            {item?.regular ||
                              item?.regularPrice ||
                              item?.price ||
                              "—"}
                          </td>

                          <td className="px-4 py-3 text-[12px] text-slate-500">
                            {item?.currency || "—"}
                          </td>

                        </tr>
                      )
                    )}
                  </tbody>

                </table>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                No registration information available.
              </p>
            )}
          </Section>

          {/* SUBMISSIONS */}

          <Section
            title="Submission & Presentation"
            description="Abstract, paper and presentation configuration"
            icon={FileText}
          >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

              {[
                [
                  conference.abstractSubmission,
                  "Abstract Submission",
                ],
                [
                  conference.paperSubmission,
                  "Full Paper Submission",
                ],
                [
                  conference.oralPresentation,
                  "Oral Presentation",
                ],
                [
                  conference.posterPresentation,
                  "Poster Presentation",
                ],
                [
                  conference.virtualPresentation,
                  "Virtual Presentation",
                ],
              ].map(([enabled, label]) => (

                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
                >
                  <span className="text-[11px] font-semibold text-slate-700">
                    {label}
                  </span>

                  <span
                    className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                      enabled
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {enabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>

              ))}

            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">

              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-[10px] text-slate-400">
                  Review Type
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-800">
                  {conference.reviewType}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-[10px] text-slate-400">
                  Maximum Abstract Words
                </p>

                <p className="mt-1 text-[12px] font-semibold text-slate-800">
                  {conference.maxAbstractWords !== "—"
                    ? `${conference.maxAbstractWords} words`
                    : "—"}
                </p>
              </div>

            </div>
          </Section>

          {/* TOPICS */}

          <Section
            title="Conference Topics"
            description="Scientific topics and tracks covered by this conference"
            icon={BookOpen}
          >
            {conference.topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {conference.topics.map(
                  (topic, index) => (
                    <span
                      key={`${topic}-${index}`}
                      className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700"
                    >
                      {topic}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                No topics available.
              </p>
            )}
          </Section>

          {/* SPEAKERS + COMMITTEE */}

          <div className="grid gap-4 lg:grid-cols-2">

            <Section
              title="Speakers"
              description="Keynote and invited speakers"
              icon={UserRound}
            >
              <div className="space-y-2">

                {conference.speakers.length > 0 ? (
                  conference.speakers.map(
                    (speaker, index) => (
                      <div
                        key={speaker?._id || index}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-start gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                            <UserRound size={16} />
                          </div>

                          <div className="min-w-0">

                            <h3 className="text-[12px] font-bold text-slate-800">
                              {speaker?.name || "—"}
                            </h3>

                            <p className="mt-0.5 text-[10px] text-violet-600">
                              {speaker?.designation ||
                                speaker?.role ||
                                "—"}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-500">
                              {speaker?.organization ||
                                speaker?.affiliation ||
                                "—"}
                              {speaker?.country
                                ? ` • ${speaker.country}`
                                : ""}
                            </p>

                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-[11px] text-slate-400">
                    No speakers available.
                  </p>
                )}

              </div>
            </Section>

            <Section
              title="Organizing Committee"
              description="Conference organizing and scientific committee"
              icon={Users}
            >
              <div className="space-y-2">

                {conference.committee.length > 0 ? (
                  conference.committee.map(
                    (member, index) => (
                      <div
                        key={member?._id || index}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >

                        <h3 className="text-[12px] font-bold text-slate-800">
                          {member?.name || "—"}
                        </h3>

                        <p className="mt-0.5 text-[10px] font-medium text-violet-600">
                          {member?.role ||
                            member?.designation ||
                            "—"}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500">
                          {member?.organization ||
                            member?.affiliation ||
                            "—"}
                        </p>

                      </div>
                    )
                  )
                ) : (
                  <p className="text-[11px] text-slate-400">
                    No committee information available.
                  </p>
                )}

              </div>
            </Section>

          </div>

          {/* PROGRAM */}

          <Section
            title="Conference Program"
            description="Sessions and scheduled conference activities"
            icon={Clock3}
          >
            <div className="space-y-2">

              {conference.sessions.length > 0 ? (
                conference.sessions.map(
                  (session, index) => (
                    <div
                      key={session?._id || index}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >

                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-bold text-violet-600">
                              {session?.type ||
                                session?.sessionType ||
                                "Session"}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              Session {index + 1}
                            </span>

                          </div>

                          <h3 className="mt-1.5 text-[12px] font-bold text-slate-800">
                            {session?.title ||
                              session?.sessionTitle ||
                              "—"}
                          </h3>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {session?.speaker ||
                              session?.speakerName ||
                              "—"}
                          </p>

                        </div>

                        <div className="grid grid-cols-2 gap-3 text-right md:min-w-[250px]">

                          <div>
                            <p className="text-[9px] text-slate-400">
                              Date
                            </p>

                            <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                              {session?.date
                                ? formatDate(session.date)
                                : "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] text-slate-400">
                              Time
                            </p>

                            <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                              {session?.startTime || "—"}
                              {" - "}
                              {session?.endTime || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] text-slate-400">
                              Venue
                            </p>

                            <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                              {session?.room ||
                                session?.venue ||
                                "—"}
                            </p>
                          </div>

                        </div>

                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-[11px] text-slate-400">
                  No conference program available.
                </p>
              )}

            </div>
          </Section>

          {/* CONTACT */}

          <Section
            title="Contact & Online Presence"
            description="Conference contact and official online channels"
            icon={Globe2}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {conference.contactEmail !== "—" && (
                <a
                  href={`mailto:${conference.contactEmail}`}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-violet-200"
                >
                  <Mail
                    size={16}
                    className="text-violet-600"
                  />

                  <p className="mt-2 text-[10px] text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 truncate text-[11px] font-semibold text-slate-700">
                    {conference.contactEmail}
                  </p>
                </a>
              )}

              {conference.phone !== "—" && (
                <a
                  href={`tel:${conference.phone}`}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-violet-200"
                >
                  <Phone
                    size={16}
                    className="text-violet-600"
                  />

                  <p className="mt-2 text-[10px] text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-slate-700">
                    {conference.phone}
                  </p>
                </a>
              )}

              {conference.website !== "—" && (
                <a
                  href={conference.website}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-violet-200"
                >
                  <Globe2
                    size={16}
                    className="text-violet-600"
                  />

                  <p className="mt-2 text-[10px] text-slate-400">
                    Website
                  </p>

                  <p className="mt-1 truncate text-[11px] font-semibold text-slate-700">
                    Official Website
                  </p>
                </a>
              )}

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">

                <Link2
                  size={16}
                  className="text-violet-600"
                />

                <p className="mt-2 text-[10px] text-slate-400">
                  Social Channels
                </p>

                <div className="mt-1 flex gap-2">

                  {conference.linkedin !== "—" && (
                    <a
                      href={conference.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-semibold text-slate-600 hover:text-violet-600"
                    >
                      LinkedIn
                    </a>
                  )}

                  {conference.instagram !== "—" && (
                    <a
                      href={conference.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-semibold text-slate-600 hover:text-violet-600"
                    >
                      Instagram
                    </a>
                  )}

                  {conference.facebook !== "—" && (
                    <a
                      href={conference.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-semibold text-slate-600 hover:text-violet-600"
                    >
                      Facebook
                    </a>
                  )}

                </div>
              </div>

            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

export default MyConference;
