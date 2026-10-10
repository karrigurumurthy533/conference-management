import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/common/SEO";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Download,
  CheckCircle2,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Brain,
  Globe2,
  HeartHandshake,
  FileText,
  UserPlus,
  BookOpen,
  Presentation,
  Award,
} from "lucide-react";

import { getConferenceByIdApi } from "../api/api";

const C = {
  primary: "#7C3AED",
  primaryHover: "#6D28D9",
  dark: "#12091F",
  title: "#2E1065",
  text: "#4B5563",
  soft: "#F8F7FF",
  softer: "#F0EAFE",
  border: "#E9E3FB",
};

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

const pick = (item, keys) =>
  typeof item === "string"
    ? item
    : keys.map((k) => item?.[k]).find(Boolean) || "";

const ConferenceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openTrack, setOpenTrack] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // ---------------- FETCH ----------------
  useEffect(() => {
    let mounted = true;

    const fetchConference = async () => {
      try {
        setLoading(true);
        setError("");
        setConference(null);

        const response = await getConferenceByIdApi(id);
        if (!mounted) return;

        const api = response?.data?.data || response?.data || null;
        if (!api) {
          setError("Conference not found.");
          return;
        }

        const startDate =
          api?.conferenceDates?.startDate || api?.startDate || "";
        const endDate = api?.conferenceDates?.endDate || api?.endDate || "";

        setConference({
          ...api,
          id: api?._id || api?.id || id,
          title: api?.basicInformation?.title || api?.title || "",
          category: api?.basicInformation?.category || api?.category || "",
          subtitle: api?.basicInformation?.subtitle || api?.subtitle || "",
          description:
            api?.basicInformation?.description || api?.description || "",
          date:
            startDate && endDate
              ? `${fmt(startDate)} - ${fmt(endDate)}`
              : api?.date || "",
          startDate,
          endDate,
          time: api?.conferenceDates?.time || api?.time || "",
          venue: api?.venueInformation || api?.venue || {},
          location:
            api?.venueInformation?.city ||
            api?.venueInformation?.location ||
            api?.venueInformation?.venueName ||
            api?.location ||
            "",
          mode:
            api?.venueInformation?.mode ||
            api?.mode ||
            api?.conferenceMode ||
            "",
          participants:
            api?.registrationInformation?.expectedParticipants ||
            api?.participants ||
            "",
          image:
            api?.media?.bannerImage ||
            api?.media?.conferenceBanner ||
            api?.bannerImage ||
            api?.imageUrl ||
            api?.image ||
            "",
          speakers: Array.isArray(api?.speakers)
            ? api.speakers.map((s) => ({
                ...s,
                name: s?.fullName || s?.name || "",
                image: s?.imageUrl || s?.image || "",
                organization: s?.organization || "",
                role: s?.designation || s?.role || "",
                specialty: s?.speakerType || s?.specialty || "",
                linkedin: s?.linkedin || "",
              }))
            : [],
          topics: Array.isArray(api?.topics)
            ? api.topics.map((t) => pick(t, ["title", "name", "topic"]))
            : [],
          tracks: Array.isArray(api?.tracks) ? api.tracks : [],
          sponsors: Array.isArray(api?.sponsors)
            ? api.sponsors.map((s) =>
                pick(s, ["logoUrl", "imageUrl", "logo"]),
              )
            : [],
          keyHighlights: Array.isArray(api?.keyHighlights)
            ? api.keyHighlights
            : [],
          whoShouldAttend: Array.isArray(api?.whoShouldAttend)
            ? api.whoShouldAttend.map((i) => pick(i, ["title", "name", "text"]))
            : [],
          whoShouldAttendDescription: api?.whoShouldAttendDescription || "",
          welcomeMessage: {
            paragraphs: Array.isArray(api?.welcomeMessage?.paragraphs)
              ? api.welcomeMessage.paragraphs
              : api?.welcomeMessage?.paragraph
                ? [api.welcomeMessage.paragraph]
                : [],
            signature: api?.welcomeMessage?.signature || "",
          },
          otherData: api?.otherData || {},
        });
      } catch (err) {
        console.error("Fetch Conference Details Error:", err);
        if (!mounted) return;
        setConference(null);
        setError(
          err?.response?.data?.message || "Failed to load conference details",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchConference();
    else {
      setLoading(false);
      setError("Conference ID is missing.");
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  // ---------------- COUNTDOWN ----------------
  useEffect(() => {
    if (!conference?.startDate) return;

    const calc = () => {
      const diff = new Date(conference.startDate).getTime() - Date.now();
      if (Number.isNaN(diff) || diff <= 0)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [conference?.startDate]);

  if (loading) return <div className="min-h-screen bg-white" />;

  if (!conference) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-6">
        <div className="text-center">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: C.softer, color: C.primary }}
          >
            <Brain size={26} />
          </div>
          <h1 className="mt-4 text-xl font-bold" style={{ color: C.title }}>
            Conference Details
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {error || "Please select a conference from the conferences page."}
          </p>
          <Link
            to="/conferences"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white"
            style={{ backgroundColor: C.primary }}
          >
            <ArrowLeft size={16} />
            Back to Conferences
          </Link>
        </div>
      </div>
    );
  }

  // ---------------- SEO ----------------
  const conferenceUrl = `https://www.globalscion.com/conferences/${conference.id}`;

  const attendanceMode = {
    Webinar: "https://schema.org/OnlineEventAttendanceMode",
    Online: "https://schema.org/OnlineEventAttendanceMode",
    Physical: "https://schema.org/OfflineEventAttendanceMode",
    Hybrid: "https://schema.org/MixedEventAttendanceMode",
  }[conference.mode];

  const getEventLocation = () => {
    const v = conference.venue || {};
    const physical = {
      "@type": "Place",
      name: v.venueName || conference.location || "GlobalScion Conference Venue",
      address: {
        "@type": "PostalAddress",
        ...(v.address ? { streetAddress: v.address } : {}),
        ...(v.city || conference.location
          ? { addressLocality: v.city || conference.location }
          : {}),
        ...(v.state ? { addressRegion: v.state } : {}),
        ...(v.country ? { addressCountry: v.country } : {}),
      },
    };
    const virtual = {
      "@type": "VirtualLocation",
      url: v.onlineLink || conferenceUrl,
    };
    if (conference.mode === "Webinar" || conference.mode === "Online")
      return virtual;
    if (conference.mode === "Hybrid") return [physical, virtual];
    return physical;
  };

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: conference.title,
    description:
      conference.description || `${conference.title} - GlobalScion Conferences`,
    url: conferenceUrl,
    ...(conference.image
      ? {
          image: [
            conference.image.startsWith("http")
              ? conference.image
              : `https://www.globalscion.com${conference.image}`,
          ],
        }
      : {}),
    ...(conference.startDate
      ? { startDate: new Date(conference.startDate).toISOString() }
      : {}),
    ...(conference.endDate
      ? { endDate: new Date(conference.endDate).toISOString() }
      : {}),
    eventStatus: "https://schema.org/EventScheduled",
    ...(attendanceMode ? { eventAttendanceMode: attendanceMode } : {}),
    location: getEventLocation(),
    organizer: {
      "@type": "Organization",
      name: "GlobalScion Conferences",
      url: "https://www.globalscion.com",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.globalscion.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Conferences",
        item: "https://www.globalscion.com/conferences",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: conference.title,
        item: conferenceUrl,
      },
    ],
  };

  // ---------------- TAB DATA ----------------
  const o = conference.otherData;
  const sampleAgenda = o?.sampleAgenda || [];
  const whyToAttend = o?.whyToAttend || [];
  const benefits = o?.benefitsOfAttending || [];
  const delegates = o?.delegates || [];
  const posterLive = o?.posterPresentersLive || [];
  const ePoster = o?.ePosterPresenters || {};
  const market = o?.marketAnalysis || {};

  const tabs = [
    sampleAgenda.length > 0 && {
      id: "agenda",
      label: "Agenda",
      icon: <CalendarDays size={13} />,
      content: (
        <div className="grid gap-2 md:grid-cols-2">
          {sampleAgenda.map((day, i) => (
            <div
              key={day?.day || i}
              className="overflow-hidden rounded-md border bg-white"
              style={{ borderColor: C.border }}
            >
              <div
                className="px-3 py-1.5 text-xs font-bold"
                style={{ backgroundColor: C.softer, color: C.title }}
              >
                {day?.day}
              </div>
              <div className="divide-y" style={{ borderColor: C.border }}>
                {day?.schedule?.map((it, j) => (
                  <div
                    key={`${it?.time}-${j}`}
                    className="flex gap-3 px-3 py-1.5 text-xs"
                    style={{ borderColor: C.border }}
                  >
                    <span
                      className="w-20 flex-shrink-0 text-[11px] font-bold"
                      style={{ color: C.primary }}
                    >
                      {it?.time}
                    </span>
                    <span style={{ color: C.text }}>{it?.session}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    whyToAttend.length > 0 && {
      id: "why",
      label: "Why Attend",
      icon: <HeartHandshake size={13} />,
      content: <MiniGrid items={whyToAttend} />,
    },
    benefits.length > 0 && {
      id: "benefits",
      label: "Benefits",
      icon: <Award size={13} />,
      content: <MiniGrid items={benefits} />,
    },
    delegates.length > 0 && {
      id: "delegates",
      label: "Delegates",
      icon: <Users size={13} />,
      content: <MiniGrid items={delegates} />,
    },
    posterLive.length > 0 && {
      id: "poster",
      label: "Posters",
      icon: <Presentation size={13} />,
      content: (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="mb-1.5 text-xs font-bold" style={{ color: C.title }}>
              Live Poster Presenters
            </h3>
            <Bullets items={posterLive} />
          </div>
          <div>
            <h3 className="mb-1.5 text-xs font-bold" style={{ color: C.title }}>
              E-Poster Presenters
            </h3>
            <Bullets items={ePoster.benefits} />
          </div>
        </div>
      ),
    },
    ePoster.specifications && {
      id: "guidelines",
      label: "E-Poster Guidelines",
      icon: <FileText size={13} />,
      content: (
        <div>
          {ePoster.guidelinesIntro && (
            <p className="mb-2 text-xs leading-5" style={{ color: C.text }}>
              {ePoster.guidelinesIntro}
            </p>
          )}
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            <Box title="Specifications">
              <div className="space-y-1">
                {Object.entries(ePoster.specifications).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-3 border-b pb-1 text-xs"
                    style={{ borderColor: C.border }}
                  >
                    <span className="font-semibold" style={{ color: C.text }}>
                      {k}
                    </span>
                    <span
                      className="text-right font-bold"
                      style={{ color: C.primary }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </Box>
            <Box title="Poster Content">
              <Bullets items={ePoster.posterContent} />
            </Box>
            <Box title="Design Requirements">
              <Bullets items={ePoster.designRequirements} />
            </Box>
            <Box title="Submission Guidelines">
              <Bullets items={ePoster.submissionGuidelines} />
            </Box>
            <Box title="Review & Acceptance">
              <Bullets items={ePoster.reviewAndAcceptance} />
            </Box>
            <Box title="Presentation & Certificate">
              <Bullets
                items={[
                  ...(ePoster.presentation || []),
                  ...(ePoster.certificate || []),
                ]}
              />
            </Box>
          </div>
        </div>
      ),
    },
    market?.paragraphs?.length > 0 && {
      id: "market",
      label: "Market Analysis",
      icon: <Globe2 size={13} />,
      content: (
        <div
          className={`grid gap-4 ${market.image ? "lg:grid-cols-[1fr_300px]" : ""}`}
        >
          <div className="space-y-2">
            {market.heading && (
              <h3 className="text-sm font-bold" style={{ color: C.title }}>
                {market.heading}
              </h3>
            )}
            {market.paragraphs.map((p, i) => (
              <p key={i} className="text-xs leading-5" style={{ color: C.text }}>
                {p}
              </p>
            ))}
          </div>
          {market.image && (
            <img
              src={market.image}
              alt="Market Analysis"
              className="h-52 w-full rounded-lg object-cover"
            />
          )}
        </div>
      ),
    },
  ].filter(Boolean);

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <>
      <SEO
        title={conference.title}
        description={
          conference.description || `${conference.title} - GlobalScion Conferences`
        }
        keywords={[
          conference.title,
          conference.category,
          "GlobalScion",
          "International Conference",
          "Conference",
          "Research Conference",
        ]
          .filter(Boolean)
          .join(", ")}
        canonical={conferenceUrl}
        image={conference.image}
        type="event"
        structuredData={[eventSchema, breadcrumbSchema]}
      />

      <div className="min-h-screen bg-white text-gray-900">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden" style={{ backgroundColor: C.dark }}>
          {conference.image && (
            <img
              src={conference.image}
              alt={conference.title}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "brightness(0.5)" }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(15,5,28,0.95) 0%, rgba(35,13,55,0.8) 50%, rgba(76,29,149,0.45) 100%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-7xl px-5 py-3 lg:px-10">
            <Link
              to="/conferences"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white"
            >
              <ArrowLeft size={12} />
              Back to Conferences
            </Link>

            <div className="mt-2 grid gap-3 lg:grid-cols-[1fr_280px] lg:items-center">
              {/* LEFT */}
              <div>
                <span className="inline-flex rounded-full border border-purple-300/25 bg-purple-600/25 px-2.5 py-0.5 text-[10px] font-bold text-purple-100">
                  {conference.category}
                </span>

                <h1 className="mt-1.5 text-xl font-extrabold leading-tight text-white sm:text-2xl lg:text-3xl">
                  {conference.title}
                </h1>

                {conference.subtitle && (
                  <p className="mt-1 text-xs font-semibold text-violet-100 sm:text-sm">
                    {conference.subtitle}
                  </p>
                )}

                {conference.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-violet-200">
                    {conference.description}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Pill icon={<CalendarDays size={13} />}>
                    {conference.date}
                    {conference.time ? ` · ${conference.time}` : ""}
                  </Pill>
                  <Pill icon={<MapPin size={13} />}>
                    {conference.location}
                    {conference.mode ? ` · ${conference.mode}` : ""}
                  </Pill>
                  {conference.participants && (
                    <Pill icon={<Users size={13} />}>
                      {conference.participants} Expected
                    </Pill>
                  )}
                </div>
              </div>

              {/* RIGHT: COUNTDOWN + ACTIONS */}
              <div className="rounded-lg border border-white/15 bg-black/30 p-2 backdrop-blur-md">
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-white">
                  Conference Starts In
                </p>

                <div className="grid grid-cols-4 gap-1">
                  {[
                    ["Days", timeLeft.days],
                    ["Hrs", timeLeft.hours],
                    ["Min", timeLeft.minutes],
                    ["Sec", timeLeft.seconds],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded border border-white/15 bg-white/5 py-1 text-center"
                    >
                      <span className="block text-base font-extrabold leading-none text-white">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="block text-[8px] font-bold uppercase text-purple-300">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-1">
                  <ActionBtn
                    primary
                    icon={<UserPlus size={13} />}
                    text="Register Now"
                    onClick={() => navigate(`/conferences/${conference.id}/register`)}
                  />
                  <ActionBtn
                    icon={<FileText size={13} />}
                    text="Abstract"
                    onClick={() =>
                      navigate(`/conferences/${conference.id}/abstract-submission`)
                    }
                  />
                  <ActionBtn
                    icon={<Download size={13} />}
                    text="Brochure"
                    onClick={() =>
                      navigate(`/conferences/${conference.id}/brochure`, {
                        state: { conference },
                      })
                    }
                  />
                  <ActionBtn
                    icon={<BookOpen size={13} />}
                    text="Program"
                    onClick={() =>
                      navigate(`/conferences/${conference.id}/scientific-program`)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SPEAKERS ================= */}
        {conference.speakers.length > 0 && (
          <Section>
            <Heading label="Renowned Speakers" />
            <div className="mt-3 grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {conference.speakers.map((s, i) => (
                <div key={s.name || i} className="text-center">
                  <div className="relative mx-auto h-11 w-11 sm:h-12 sm:w-12">
                    <div className="absolute -inset-0.5 rounded-full border-[1.5px] border-purple-300" />
                    {s.image && (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    )}
                    <a
                      href={s.linkedin || "https://www.linkedin.com/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.name || "Speaker"} LinkedIn`}
                      className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white"
                      style={{ backgroundColor: C.primary }}
                    >
                      <img src="/svgs/linkedin.svg" alt="LinkedIn" className="h-2 w-2" />
                    </a>
                  </div>
                  <h3
                    className="mt-1.5 text-[10px] font-bold leading-3.5"
                    style={{ color: C.title }}
                  >
                    {s.name}
                  </h3>
                  <p className="line-clamp-2 text-[9px] leading-3 text-gray-500">
                    {s.organization || s.role}
                  </p>
                  {s.specialty && (
                    <p className="text-[9px] font-medium leading-3" style={{ color: C.primary }}>
                      {s.specialty}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ================= WELCOME (2-col, 4 lines + arrow) ================= */}
        {conference.welcomeMessage.paragraphs.length > 0 && (
          <Section bg={C.soft}>
            <div className="grid gap-2 lg:grid-cols-[200px_1fr]">
              <div>
                <Heading label="Welcome Message" />
              </div>

              <div>
                {showWelcome ? (
                  <div>
                    {conference.welcomeMessage.paragraphs.map((p, i) => (
                      <p key={i} className="mb-2 text-sm leading-6 text-gray-700">
                        {p}
                      </p>
                    ))}
                    {conference.welcomeMessage.signature && (
                      <p className="text-sm font-semibold" style={{ color: C.primary }}>
                        {conference.welcomeMessage.signature}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="line-clamp-4 text-sm leading-6 text-gray-700">
                    {conference.welcomeMessage.paragraphs.join(" ")}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowWelcome((v) => !v)}
                  aria-label={showWelcome ? "Show less" : "Show more"}
                  aria-expanded={showWelcome}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold"
                  style={{ color: C.primary }}
                >
                  {showWelcome ? "Show less" : "Show more"}
                  {showWelcome ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>
            </div>
          </Section>
        )}

        {/* ================= WHO SHOULD ATTEND (paragraph + buttons) ================= */}
        {conference.whoShouldAttendDescription && (
          <Section>
            <Heading label="Who Should Attend" />
            <p className="mt-2 text-xs leading-6 sm:text-sm" style={{ color: C.text }}>
              {conference.whoShouldAttendDescription}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {conference.whoShouldAttend.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold"
                  style={{ borderColor: C.border, backgroundColor: C.soft, color: C.title }}
                >
                  <CheckCircle2 size={12} style={{ color: C.primary }} />
                  {item}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* ================= KEY HIGHLIGHTS ================= */}
        {conference.keyHighlights.length > 0 && (
          <Section bg={C.soft}>
            <Heading label="Key Highlights" />
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {conference.keyHighlights.map((h, i) => (
                <div
                  key={h?.title || i}
                  className="rounded-md border bg-white p-2"
                  style={{ borderColor: C.border }}
                >
                  <span
                    className="text-sm font-extrabold leading-none"
                    style={{ color: C.primary }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-xs font-bold" style={{ color: C.title }}>
                    {h?.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-4" style={{ color: C.text }}>
                    {h?.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ================= KEY TOPICS ================= */}
        {conference.topics.length > 0 && (
          <Section>
            <Heading label="Key Topics" />
            <div className="mt-2 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {conference.topics.map((topic, i) => (
                <div
                  key={`${topic}-${i}`}
                  className="flex items-start gap-1.5 border-b py-1.5"
                  style={{ borderColor: C.border }}
                >
                  <CheckCircle2
                    size={13}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: C.primary }}
                  />
                  <span className="text-xs leading-5 text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ================= SESSIONS & TRACKS ================= */}
        {conference.tracks.length > 0 && (
          <Section bg={C.soft}>
            <Heading label="Sessions & Tracks" />
            <div className="mt-3 grid items-start gap-1.5 md:grid-cols-2">
              {conference.tracks.map((track, i) => {
                const isOpen = openTrack === i;
                return (
                  <div
                    key={track?.title || i}
                    className="overflow-hidden rounded-lg border bg-white"
                    style={{ borderColor: isOpen ? C.primary : C.border }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenTrack(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{
                            backgroundColor: isOpen ? C.primary : C.softer,
                            color: isOpen ? "#fff" : C.primary,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="text-xs font-semibold leading-4"
                          style={{ color: C.title }}
                        >
                          {track?.title}
                        </span>
                      </span>
                      {isOpen ? (
                        <Minus size={14} style={{ color: C.primary }} />
                      ) : (
                        <Plus size={14} style={{ color: C.primary }} />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p
                            className="border-t px-2.5 py-2 text-[11px] leading-5"
                            style={{ borderColor: C.border, color: C.text }}
                          >
                            {track?.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* ================= TABS ================= */}
        {tabs.length > 0 && (
          <Section>
            <div
              className="flex flex-wrap gap-1.5 border-b pb-2"
              style={{ borderColor: C.border }}
            >
              {tabs.map((t) => {
                const active = currentTab?.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold transition-colors"
                    style={{
                      backgroundColor: active ? C.primary : C.softer,
                      color: active ? "#fff" : C.primary,
                    }}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-3">{currentTab?.content}</div>
          </Section>
        )}

        {/* ================= SPONSORS (circles) ================= */}
        {conference.sponsors.length > 0 && (
          <Section bg={C.soft}>
            <Heading label="Partners & Sponsors" />
            <div className="mt-3 flex flex-wrap gap-3">
              {conference.sponsors.map((logo, i) => (
                <div
                  key={`${logo}-${i}`}
                  className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-white p-2.5 transition-transform hover:scale-105"
                  style={{ borderColor: C.border }}
                >
                  {logo && (
                    <img
                      src={logo}
                      alt={`Sponsor ${i + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </>
  );
};

// ================= SMALL HELPERS =================

const Section = ({ bg = "#FFFFFF", children }) => (
  <section className="px-5 py-5 lg:px-10" style={{ backgroundColor: bg }}>
    <div className="mx-auto max-w-7xl">{children}</div>
  </section>
);

const Heading = ({ label }) => (
  <div className="flex items-center gap-2.5">
    <span className="h-[2px] w-7" style={{ backgroundColor: C.primary }} />
    <h2 className="text-base font-bold md:text-lg" style={{ color: C.primary }}>
      {label}
    </h2>
  </div>
);

const Pill = ({ icon, children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white">
    <span className="text-purple-300">{icon}</span>
    {children}
  </span>
);

const ActionBtn = ({ icon, text, onClick, primary = false }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center justify-between gap-1 rounded border px-2 py-1.5 text-[11px] font-bold text-white transition-colors"
    style={{
      backgroundColor: primary ? C.primary : "rgba(255,255,255,0.08)",
      borderColor: primary ? C.primary : "rgba(255,255,255,0.18)",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.backgroundColor = primary
        ? C.primaryHover
        : "rgba(255,255,255,0.16)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.backgroundColor = primary
        ? C.primary
        : "rgba(255,255,255,0.08)")
    }
  >
    <span className="flex items-center gap-1">
      {icon}
      {text}
    </span>
    <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
  </button>
);

const MiniGrid = ({ items }) => (
  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
    {items.map((item, i) => (
      <div
        key={item?.title || i}
        className="rounded-md border bg-white p-2"
        style={{ borderColor: C.border }}
      >
        <div className="flex items-start gap-1.5">
          <CheckCircle2
            size={14}
            className="mt-0.5 flex-shrink-0"
            style={{ color: C.primary }}
          />
          <div>
            <h3 className="text-xs font-bold" style={{ color: C.title }}>
              {item?.title}
            </h3>
            <p className="mt-0.5 text-[11px] leading-4" style={{ color: C.text }}>
              {item?.description}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Bullets = ({ items }) => {
  if (!items?.length) return null;
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={`${item}-${i}`} className="flex items-start gap-1.5">
          <CheckCircle2
            size={13}
            className="mt-0.5 flex-shrink-0"
            style={{ color: C.primary }}
          />
          <span className="text-xs leading-5" style={{ color: C.text }}>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
};

const Box = ({ title, children }) => (
  <div
    className="rounded-md border bg-white p-2.5"
    style={{ borderColor: C.border }}
  >
    <h3 className="mb-1.5 text-xs font-bold" style={{ color: C.title }}>
      {title}
    </h3>
    {children}
  </div>
);

export default ConferenceDetails;
