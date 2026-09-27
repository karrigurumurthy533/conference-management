import React from "react";
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
  Building2,
  CheckCircle2,
  Video,
  Presentation,
  BookOpen,
  UserRound,
  ExternalLink,
} from "lucide-react";

function MyConference() {
  // =========================================================
  // CONFERENCE DATA
  // Replace this object later with API data from admin-created
  // conference.
  // =========================================================

  const conference = {
    conferenceName:
      "International Conference on Healthcare Innovation 2027",

    shortName: "ICHI 2027",

    category: "Healthcare",

    type: "Hybrid",

    status: "Published",

    description:
      "An international platform bringing together healthcare professionals, researchers, technology experts, academics, and industry leaders to explore innovations in healthcare, medical technology, artificial intelligence, and future healthcare systems.",

    startDate: "March 15, 2027",

    endDate: "March 17, 2027",

    registrationStartDate: "October 01, 2026",

    registrationDeadline: "March 05, 2027",

    abstractDeadline: "January 15, 2027",

    paperDeadline: "February 15, 2027",

    timezone: "India Standard Time (IST)",

    venueName: "Grand Convention Center",

    address:
      "HITEC City, Madhapur, Hyderabad, Telangana, India",

    city: "Hyderabad",

    state: "Telangana",

    country: "India",

    mapUrl: "https://maps.google.com",

    onlineLink: "https://zoom.us",

    contactEmail: "conference@globalscion.com",

    phone: "+91 98765 43210",

    whatsapp: "+91 98765 43210",

    website: "https://globalscion.com",

    linkedin: "https://linkedin.com",

    instagram: "https://instagram.com",

    facebook: "https://facebook.com",

    expectedAttendees: "1,200+",

    abstractSubmission: true,

    paperSubmission: true,

    oralPresentation: true,

    posterPresentation: true,

    virtualPresentation: true,

    reviewType: "Single Blind",

    maxAbstractWords: "300",

    topics: [
      "Healthcare Innovation",
      "Artificial Intelligence",
      "Digital Health",
      "Medical Technology",
      "Precision Medicine",
      "Healthcare Analytics",
    ],

    registrationTypes: [
      {
        type: "Student",
        earlyBird: "99",
        regular: "149",
        currency: "USD",
      },
      {
        type: "Academic",
        earlyBird: "149",
        regular: "199",
        currency: "USD",
      },
      {
        type: "Industry",
        earlyBird: "199",
        regular: "249",
        currency: "USD",
      },
    ],

    speakers: [
      {
        name: "Dr. Sarah Williams",
        designation: "Professor of Healthcare Innovation",
        organization: "Global Health University",
        country: "USA",
      },
      {
        name: "Dr. Rajesh Kumar",
        designation: "Director of Digital Health",
        organization: "Global Medical Institute",
        country: "India",
      },
    ],

    committee: [
      {
        name: "Dr. Michael Anderson",
        role: "Conference Chair",
        organization: "Global Health University",
      },
      {
        name: "Dr. Priya Sharma",
        role: "Scientific Committee",
        organization: "Medical Research Institute",
      },
    ],

    sessions: [
      {
        title: "Opening Keynote: Future of Healthcare",
        date: "March 15, 2027",
        startTime: "09:30 AM",
        endTime: "10:30 AM",
        speaker: "Dr. Sarah Williams",
        room: "Main Hall",
        type: "Keynote",
      },
      {
        title: "AI in Modern Healthcare",
        date: "March 15, 2027",
        startTime: "11:00 AM",
        endTime: "12:00 PM",
        speaker: "Dr. Rajesh Kumar",
        room: "Hall A",
        type: "Plenary",
      },
      {
        title: "Digital Health Innovation Workshop",
        date: "March 16, 2027",
        startTime: "02:00 PM",
        endTime: "03:30 PM",
        speaker: "Healthcare Innovation Team",
        room: "Workshop Hall",
        type: "Workshop",
      },
    ],
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const statusColor =
    conference.status === "Published"
      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
      : conference.status === "Draft"
      ? "bg-amber-50 text-amber-600 border-amber-100"
      : "bg-slate-100 text-slate-600 border-slate-200";

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

  const DetailItem = ({ label, value }) => (
    <div>
      <p className="text-[10px] font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[12px] font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );

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

      <div className="p-4">{children}</div>
    </section>
  );

  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-[1400px]">

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          <div className="p-5">

            <div className="flex flex-col justify-between gap-4 lg:flex-row">

              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
                    {conference.category}
                  </span>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                    {conference.type}
                  </span>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                    Assigned Conference
                  </span>
                </div>

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

          {/* ===================================================
              BASIC INFORMATION
          =================================================== */}

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

              <DetailItem
                label="Status"
                value={conference.status}
              />
            </div>
          </Section>

          {/* ===================================================
              DATES & DEADLINES
          =================================================== */}

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

          {/* ===================================================
              VENUE
          =================================================== */}

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

              {(conference.type === "Virtual" ||
                conference.type === "Hybrid") && (
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

          {/* ===================================================
              REGISTRATION
          =================================================== */}

          <Section
            title="Registration"
            description="Registration categories and conference fees"
            icon={Users}
          >
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
                        key={index}
                        className="border-t border-slate-100"
                      >
                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-800">
                          {item.type}
                        </td>

                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {item.earlyBird}
                        </td>

                        <td className="px-4 py-3 text-[12px] font-semibold text-slate-700">
                          {item.regular}
                        </td>

                        <td className="px-4 py-3 text-[12px] text-slate-500">
                          {item.currency}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ===================================================
              SUBMISSIONS
          =================================================== */}

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
                    {enabled ? "Enabled" : "Disabled"}
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
                  {conference.maxAbstractWords} words
                </p>
              </div>
            </div>
          </Section>

          {/* ===================================================
              TOPICS
          =================================================== */}

          <Section
            title="Conference Topics"
            description="Scientific topics and tracks covered by this conference"
            icon={BookOpen}
          >
            <div className="flex flex-wrap gap-2">
              {conference.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          </Section>

          {/* ===================================================
              SPEAKERS + COMMITTEE
          =================================================== */}

          <div className="grid gap-4 lg:grid-cols-2">

            <Section
              title="Speakers"
              description="Keynote and invited speakers"
              icon={UserRound}
            >
              <div className="space-y-2">
                {conference.speakers.map(
                  (speaker, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                          <UserRound size={16} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-[12px] font-bold text-slate-800">
                            {speaker.name}
                          </h3>

                          <p className="mt-0.5 text-[10px] text-violet-600">
                            {speaker.designation}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {speaker.organization} •{" "}
                            {speaker.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Section>

            <Section
              title="Organizing Committee"
              description="Conference organizing and scientific committee"
              icon={Users}
            >
              <div className="space-y-2">
                {conference.committee.map(
                  (member, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <h3 className="text-[12px] font-bold text-slate-800">
                        {member.name}
                      </h3>

                      <p className="mt-0.5 text-[10px] font-medium text-violet-600">
                        {member.role}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {member.organization}
                      </p>
                    </div>
                  )
                )}
              </div>
            </Section>
          </div>

          {/* ===================================================
              PROGRAM
          =================================================== */}

          <Section
            title="Conference Program"
            description="Sessions and scheduled conference activities"
            icon={Clock3}
          >
            <div className="space-y-2">
              {conference.sessions.map(
                (session, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-bold text-violet-600">
                            {session.type}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            Session {index + 1}
                          </span>
                        </div>

                        <h3 className="mt-1.5 text-[12px] font-bold text-slate-800">
                          {session.title}
                        </h3>

                        <p className="mt-1 text-[10px] text-slate-500">
                          {session.speaker}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-right md:min-w-[250px]">
                        <div>
                          <p className="text-[9px] text-slate-400">
                            Date
                          </p>

                          <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                            {session.date}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] text-slate-400">
                            Time
                          </p>

                          <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                            {session.startTime} -{" "}
                            {session.endTime}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] text-slate-400">
                            Venue
                          </p>

                          <p className="mt-0.5 text-[10px] font-semibold text-slate-700">
                            {session.room}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </Section>

          {/* ===================================================
              CONTACT
          =================================================== */}

          <Section
            title="Contact & Online Presence"
            description="Conference contact and official online channels"
            icon={Globe2}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

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

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <Link2
                  size={16}
                  className="text-violet-600"
                />

                <p className="mt-2 text-[10px] text-slate-400">
                  Social Channels
                </p>

                <div className="mt-1 flex gap-2">
                  <a
                    href={conference.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-semibold text-slate-600 hover:text-violet-600"
                  >
                    LinkedIn
                  </a>

                  <a
                    href={conference.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-semibold text-slate-600 hover:text-violet-600"
                  >
                    Instagram
                  </a>
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