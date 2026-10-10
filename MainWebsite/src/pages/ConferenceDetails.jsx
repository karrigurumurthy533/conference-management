import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Download,
  CheckCircle2,
  Brain,
  Globe2,
  HeartHandshake,
  FileText,
  UserPlus,
  BookOpen,
  Presentation,
  Award,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { getConferenceByIdApi } from "../api/api";

const C = {
  primary: "#7C3AED",
  primaryHover: "#6D28D9",
  deep: "#4C1D95",
  dark: "#12091F",
  title: "#2E1065",
  text: "#4B5563",
  soft: "#F8F7FF",
  softer: "#F0EAFE",
  border: "#E9E3FB",
};

const fmt = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

const pick = (item, keys) =>
  typeof item === "string"
    ? item
    : keys.map((key) => item?.[key]).find(Boolean) || "";

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const ConferenceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState({});
  const [showAllWelcome, setShowAllWelcome] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const toggleCard = (cardId) => {
    setFlipped((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  // ================= FETCH CONFERENCE =================
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

        const venue = api?.venueInformation || api?.venue || {};
        const welcome = api?.welcomeMessage || {};

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
          venue,

          location:
            venue?.city ||
            venue?.location ||
            venue?.venueName ||
            api?.location ||
            "",

          mode: venue?.mode || api?.mode || api?.conferenceMode || "",

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
            ? api.speakers.map((speaker) => ({
                ...speaker,
                name: speaker?.fullName || speaker?.name || "",
                image: speaker?.imageUrl || speaker?.image || "",
                organization: speaker?.organization || "",
                role: speaker?.designation || speaker?.role || "",
                specialty: speaker?.speakerType || speaker?.specialty || "",
                linkedin: speaker?.linkedin || "",
              }))
            : [],

          topics: Array.isArray(api?.topics)
            ? api.topics.map((topic) => pick(topic, ["title", "name", "topic"]))
            : [],

          tracks: Array.isArray(api?.tracks) ? api.tracks : [],

          sponsors: Array.isArray(api?.sponsors)
            ? api.sponsors.map((sponsor) =>
                pick(sponsor, ["logoUrl", "imageUrl", "logo"]),
              )
            : [],

          keyHighlights: Array.isArray(api?.keyHighlights)
            ? api.keyHighlights
            : [],

          whoShouldAttend: Array.isArray(api?.whoShouldAttend)
            ? api.whoShouldAttend.map((item) =>
                pick(item, ["title", "name", "text"]),
              )
            : [],

          whoShouldAttendDescription: api?.whoShouldAttendDescription || "",

          welcomeMessage: {
            paragraphs: Array.isArray(welcome?.paragraphs)
              ? welcome.paragraphs
              : welcome?.paragraph
                ? [welcome.paragraph]
                : [],
            signature: welcome?.signature || "",
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

    if (id) {
      fetchConference();
    } else {
      setLoading(false);
      setError("Conference ID is missing.");
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  // ================= COUNTDOWN =================
  useEffect(() => {
    if (!conference?.startDate) return;

    const calculateTime = () => {
      const diff = new Date(conference.startDate).getTime() - Date.now();

      if (Number.isNaN(diff) || diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTime());

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [conference?.startDate]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600"
          aria-label="Loading conference"
        />
      </div>
    );
  }

  // ================= ERROR =================
  if (!conference) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-6">
        <div className="text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: C.softer, color: C.primary }}
          >
            <Brain size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold" style={{ color: C.title }}>
            Conference Details
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Please select a conference from the conferences page."}
          </p>

          <Link
            to="/conferences"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: C.primary }}
          >
            <ArrowLeft size={17} />
            Back to Conferences
          </Link>
        </div>
      </div>
    );
  }

  // ================= SEO =================
  const conferenceUrl = `https://www.globalscion.com/conferences/${conference.id}`;

  const attendanceMode = {
    Webinar: "https://schema.org/OnlineEventAttendanceMode",
    Online: "https://schema.org/OnlineEventAttendanceMode",
    Physical: "https://schema.org/OfflineEventAttendanceMode",
    Hybrid: "https://schema.org/MixedEventAttendanceMode",
  }[conference.mode];

  const getEventLocation = () => {
    const venue = conference.venue || {};

    const physical = {
      "@type": "Place",
      name:
        venue.venueName ||
        conference.location ||
        "GlobalScion Conference Venue",
      address: {
        "@type": "PostalAddress",
        ...(venue.address ? { streetAddress: venue.address } : {}),
        ...(venue.city || conference.location
          ? { addressLocality: venue.city || conference.location }
          : {}),
        ...(venue.state ? { addressRegion: venue.state } : {}),
        ...(venue.country ? { addressCountry: venue.country } : {}),
      },
    };

    const virtual = {
      "@type": "VirtualLocation",
      url: venue.onlineLink || conferenceUrl,
    };

    if (conference.mode === "Webinar" || conference.mode === "Online") {
      return virtual;
    }

    if (conference.mode === "Hybrid") {
      return [physical, virtual];
    }

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

  // ================= OTHER DATA =================
  const otherData = conference.otherData || {};

  const sampleAgenda = otherData.sampleAgenda || [];
  const whyToAttend = otherData.whyToAttend || [];
  const benefits = otherData.benefitsOfAttending || [];
  const delegates = otherData.delegates || [];
  const posterLive = otherData.posterPresentersLive || [];
  const ePoster = otherData.ePosterPresenters || {};
  const market = otherData.marketAnalysis || {};

  const hasEPoster =
    (ePoster?.benefits?.length || 0) > 0 ||
    Object.keys(ePoster?.specifications || {}).length > 0;

  const hasWelcome =
    Boolean(conference.image) ||
    conference.welcomeMessage.paragraphs.length > 0 ||
    Boolean(conference.welcomeMessage.signature);

  const hasAttend =
    Boolean(conference.whoShouldAttendDescription) ||
    conference.whoShouldAttend.length > 0;

  const hasHighlights = conference.keyHighlights.length > 0;
  const hasTopics = conference.topics.length > 0;

  const welcomeParagraphs = conference.welcomeMessage.paragraphs;
  const shouldCollapseWelcome = welcomeParagraphs.length > 4;

  const visibleWelcomeParagraphs =
    showAllWelcome || !shouldCollapseWelcome
      ? welcomeParagraphs
      : welcomeParagraphs.slice(0, 4);

  // ================= EXPLORE CARD DATA =================
  // Exactly 8 cards are always created.
  // Cards without API data show a helpful fallback message.
  const flipCards = [
    {
      id: "tracks",
      label: "Sessions / Tracks",
      icon: <BookOpen size={22} />,
      description: "Explore conference sessions and research tracks.",
      content:
        conference.tracks.length > 0 ? (
          <div className="space-y-3">
            {conference.tracks.map((track, index) => (
              <div
                key={track?._id || track?.title || index}
                className="rounded-xl border border-violet-100 bg-violet-50/70 p-3"
              >
                <p className="text-sm font-bold text-violet-950">
                  {String(index + 1).padStart(2, "0")}.{" "}
                  {track?.title || track?.name || `Track ${index + 1}`}
                </p>
                {track?.description && (
                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    {track.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyCardContent text="Session and track information will be announced soon." />
        ),
    },

    {
      id: "why",
      label: "Why to Attend",
      icon: <HeartHandshake size={22} />,
      description: "Discover the value of attending this conference.",
      content:
        whyToAttend.length > 0 ? (
          <ItemList items={whyToAttend} />
        ) : (
          <EmptyCardContent text="More information about the conference experience will be available soon." />
        ),
    },

    {
      id: "agenda",
      label: "Sample Agenda",
      icon: <CalendarDays size={22} />,
      description: "View the planned sessions and schedule.",
      content:
        sampleAgenda.length > 0 ? (
          <div className="space-y-4">
            {sampleAgenda.map((day, index) => (
              <div
                key={day?.day || index}
                className="rounded-xl border border-violet-100 p-3"
              >
                <p className="rounded-lg bg-violet-100 px-3 py-2 text-sm font-bold text-violet-950">
                  {day?.day || `Day ${index + 1}`}
                </p>

                <div className="mt-3 space-y-3">
                  {(day?.schedule || []).map((item, scheduleIndex) => (
                    <div
                      key={`${item?.time || "session"}-${scheduleIndex}`}
                      className="flex gap-3 text-xs leading-5"
                    >
                      <span className="w-20 shrink-0 font-bold text-violet-700">
                        {item?.time || ""}
                      </span>
                      <span className="text-gray-600">
                        {item?.session || item?.title || ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyCardContent text="The conference agenda will be published soon." />
        ),
    },

    {
      id: "benefits",
      label: "Benefits of Attending",
      icon: <Award size={22} />,
      description: "Learn about the benefits of participation.",
      content:
        benefits.length > 0 ? (
          <ItemList items={benefits} />
        ) : (
          <EmptyCardContent text="Participant benefits will be announced soon." />
        ),
    },

    {
      id: "delegates",
      label: "Delegates",
      icon: <Users size={22} />,
      description: "Find out who can participate in the event.",
      content:
        delegates.length > 0 ? (
          <ItemList items={delegates} />
        ) : (
          <EmptyCardContent text="Delegate and participant information will be available soon." />
        ),
    },

    {
      id: "poster",
      label: "Live Poster Presentations",
      icon: <Presentation size={22} />,
      description: "Explore live poster presentation opportunities.",
      content:
        posterLive.length > 0 ? (
          <Bullets items={posterLive} />
        ) : (
          <EmptyCardContent text="Live poster presentation details will be announced soon." />
        ),
    },

    {
      id: "eposter",
      label: "E-Poster Presenters",
      icon: <FileText size={22} />,
      description: "Explore virtual poster presentation requirements.",
      content: hasEPoster ? (
        <div className="space-y-4">
          <Bullets items={ePoster.benefits || []} />

          {ePoster.guidelinesIntro && (
            <p className="text-xs leading-5 text-gray-600">
              {ePoster.guidelinesIntro}
            </p>
          )}

          {Object.keys(ePoster.specifications || {}).length > 0 && (
            <Sub title="Specifications">
              <div className="space-y-2">
                {Object.entries(ePoster.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between gap-3 border-b border-violet-100 pb-2 text-xs"
                  >
                    <span className="font-semibold text-gray-600">{key}</span>
                    <span className="text-right font-bold text-violet-700">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </Sub>
          )}

          {ePoster.posterContent?.length > 0 && (
            <Sub title="Poster Content">
              <Bullets items={ePoster.posterContent} />
            </Sub>
          )}

          {ePoster.designRequirements?.length > 0 && (
            <Sub title="Design Requirements">
              <Bullets items={ePoster.designRequirements} />
            </Sub>
          )}

          {ePoster.submissionGuidelines?.length > 0 && (
            <Sub title="Submission Guidelines">
              <Bullets items={ePoster.submissionGuidelines} />
            </Sub>
          )}

          {ePoster.reviewAndAcceptance?.length > 0 && (
            <Sub title="Review & Acceptance">
              <Bullets items={ePoster.reviewAndAcceptance} />
            </Sub>
          )}

          {(ePoster.presentation?.length > 0 ||
            ePoster.certificate?.length > 0) && (
            <Sub title="Presentation & Certificate">
              <Bullets
                items={[
                  ...(ePoster.presentation || []),
                  ...(ePoster.certificate || []),
                ]}
              />
            </Sub>
          )}
        </div>
      ) : (
        <EmptyCardContent text="E-poster submission guidelines will be available soon." />
      ),
    },

    {
      id: "market",
      label: "Market Analysis",
      icon: <Globe2 size={22} />,
      description: "Explore the conference's research and market context.",
      content:
        market?.paragraphs?.length > 0 ? (
          <div className="space-y-3">
            {market.heading && (
              <h4 className="text-sm font-bold text-violet-950">
                {market.heading}
              </h4>
            )}

            {market.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-xs leading-5 text-gray-600">
                {paragraph}
              </p>
            ))}

            {market.image && (
              <img
                src={market.image}
                alt="Market analysis"
                loading="lazy"
                className="h-40 w-full rounded-xl object-cover"
              />
            )}
          </div>
        ) : (
          <EmptyCardContent text="Conference market analysis will be available soon." />
        ),
    },
  ];

  return (
    <>
      <SEO
        title={conference.title}
        description={
          conference.description ||
          `${conference.title} - GlobalScion Conferences`
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

      <div className="min-h-screen overflow-hidden bg-white text-gray-900">
        {/* ================= HERO ================= */}
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: C.dark }}
        >
          {conference.image && (
            <img
              src={conference.image}
              alt={conference.title}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "brightness(0.4)" }}
            />
          )}

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(15,5,28,0.97) 0%, rgba(35,13,55,0.87) 55%, rgba(76,29,149,0.55) 100%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <Link
              to="/conferences"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-purple-200 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={15} />
              Back to Conferences
            </Link>

            <div className="mt-7 grid items-center gap-8 lg:grid-cols-[1fr_300px] lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {conference.category && (
                  <span className="inline-flex rounded-full border border-purple-300/30 bg-purple-500/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-100">
                    {conference.category}
                  </span>
                )}

                <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {conference.title}
                </h1>

                {conference.subtitle && (
                  <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-violet-100 sm:text-base sm:leading-8">
                    {conference.subtitle}
                  </p>
                )}

                {conference.description && (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-violet-200 sm:text-base">
                    {conference.description}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {conference.date && (
                    <Pill icon={<CalendarDays size={15} />}>
                      {conference.date}
                      {conference.time ? ` · ${conference.time}` : ""}
                    </Pill>
                  )}

                  {(conference.location || conference.mode) && (
                    <Pill icon={<MapPin size={15} />}>
                      {[conference.location, conference.mode]
                        .filter(Boolean)
                        .join(" · ")}
                    </Pill>
                  )}

                  {conference.participants && (
                    <Pill icon={<Users size={15} />}>
                      {conference.participants} Expected
                    </Pill>
                  )}
                </div>
              </motion.div>

              {/* COUNTDOWN */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-2xl border border-white/15 bg-black/30 p-4 shadow-2xl backdrop-blur-xl sm:p-5"
              >
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
                  Conference Starts In
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    ["Days", timeLeft.days],
                    ["Hours", timeLeft.hours],
                    ["Mins", timeLeft.minutes],
                    ["Secs", timeLeft.seconds],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/[0.07] px-1 py-3 text-center"
                    >
                      <span className="block text-xl font-extrabold leading-none text-white sm:text-2xl">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="mt-2 block text-[9px] font-bold uppercase tracking-wider text-purple-300">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <ActionBtn
                    primary
                    icon={<UserPlus size={15} />}
                    text="Register Now"
                    onClick={() =>
                      navigate(`/conferences/${conference.id}/register`)
                    }
                  />

                  <ActionBtn
                    icon={<FileText size={15} />}
                    text="Abstract"
                    onClick={() =>
                      navigate(
                        `/conferences/${conference.id}/abstract-submission`,
                      )
                    }
                  />

                  <ActionBtn
                    icon={<Download size={15} />}
                    text="Brochure"
                    onClick={() =>
                      navigate(`/conferences/${conference.id}/brochure`, {
                        state: { conference },
                      })
                    }
                  />

                  <ActionBtn
                    icon={<BookOpen size={15} />}
                    text="Program"
                    onClick={() =>
                      navigate(
                        `/conferences/${conference.id}/scientific-program`,
                      )
                    }
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= WELCOME MESSAGE ================= */}
        {hasWelcome && (
          <Section>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[0.85fr_1.25fr] lg:gap-10">
                {conference.image && (
                  <motion.div
                    variants={reveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="order-1 flex justify-center md:justify-start"
                  >
                    <div className="relative flex items-center justify-center">
                      <div
                        className="absolute h-[280px] w-[280px] rounded-full sm:h-[340px] sm:w-[340px] lg:h-[390px] lg:w-[390px]"
                        style={{ backgroundColor: C.softer }}
                      />

                      <div
                        className="relative h-[260px] w-[260px] overflow-hidden rounded-full border-[5px] shadow-lg sm:h-[320px] sm:w-[320px] lg:h-[370px] lg:w-[370px]"
                        style={{
                          borderColor: C.border,
                          backgroundColor: C.softer,
                        }}
                      >
                        <img
                          src={conference.image}
                          alt={`${conference.title} welcome`}
                          loading="lazy"
                          className="h-full w-full rounded-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </div>

                      <div
                        className="absolute bottom-3 right-3 h-9 w-9 rounded-full border-4 border-white shadow-sm sm:bottom-4 sm:right-4 sm:h-11 sm:w-11"
                        style={{ backgroundColor: C.primary }}
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  className="order-2 relative z-10 min-w-0"
                >
                  <h2
                    className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl"
                    style={{ color: C.title }}
                  >
                    Welcome Message
                  </h2>

                  <div className="mt-4 max-w-[680px]">
                    {visibleWelcomeParagraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="mb-2 text-[13px] leading-6 text-gray-600 sm:text-sm sm:leading-6"
                        style={{
                          textAlign: "left",
                          overflowWrap: "break-word",
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}

                    {shouldCollapseWelcome && (
                      <button
                        type="button"
                        onClick={() => setShowAllWelcome((prev) => !prev)}
                        className="inline-flex items-center gap-1 text-sm font-semibold transition hover:opacity-75"
                        style={{ color: C.primary }}
                        aria-expanded={showAllWelcome}
                      >
                        {showAllWelcome ? "Show Less" : "Show More"}
                        {showAllWelcome ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    )}

                    {conference.welcomeMessage?.signature && (
                      <div
                        className="mt-4 border-l-[3px] py-1 pl-3"
                        style={{ borderColor: C.primary }}
                      >
                        <p
                          className="text-sm font-bold sm:text-base"
                          style={{ color: C.title }}
                        >
                          {conference.welcomeMessage.signature}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/conferences/${conference.id}/register`)
                      }
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      style={{ backgroundColor: C.primary }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.backgroundColor =
                          C.primaryHover;
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.backgroundColor = C.primary;
                      }}
                    >
                      Register Now
                      <ArrowRight size={16} className="ml-2" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/conferences/${conference.id}/brochure`, {
                          state: { conference },
                        })
                      }
                      className="inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:bg-purple-50"
                      style={{
                        borderColor: C.primary,
                        color: C.primary,
                      }}
                    >
                      Download Brochure
                      <Download size={16} className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </Section>
        )}

        {/* ================= SPEAKERS ================= */}
        {conference.speakers?.length > 0 && (
          <Section bg="#FFFFFF">
            <div className="mx-auto w-full max-w-7xl">
              <Heading
                label="Renowned Speakers"
                eyebrow="MEET THE EXPERTS"
                description="Learn from distinguished researchers, professionals, and thought leaders."
              />

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                className="mx-auto mt-9 flex max-w-6xl flex-wrap items-start justify-center gap-x-8 gap-y-10 sm:gap-x-10 lg:gap-x-12"
              >
                {conference.speakers.map((speaker, index) => (
                  <motion.div
                    variants={reveal}
                    key={speaker._id || speaker.name || index}
                    className="group w-[145px] text-center sm:w-[175px]"
                  >
                    <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                      <div
                        className="absolute -inset-1 rounded-full border-2 transition duration-500 group-hover:scale-105"
                        style={{ borderColor: "#D8C7FF" }}
                      />

                      <div
                        className="h-full w-full overflow-hidden rounded-full shadow-md"
                        style={{ backgroundColor: C.softer }}
                      >
                        {speaker.image ? (
                          <img
                            src={speaker.image}
                            alt={speaker.name || "Conference speaker"}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Users size={34} style={{ color: C.primary }} />
                          </div>
                        )}
                      </div>

                      {speaker.linkedin && (
                        <a
                          href={speaker.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${speaker.name || "Speaker"} LinkedIn`}
                          className="absolute bottom-1 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md transition hover:scale-110"
                          style={{ backgroundColor: C.primary }}
                        >
                          <img
                            src="/svgs/linkedin.svg"
                            alt=""
                            className="h-4 w-4"
                          />
                        </a>
                      )}
                    </div>

                    <h3
                      className="mt-5 text-sm font-bold leading-6 sm:text-base"
                      style={{ color: C.title }}
                    >
                      {speaker.name}
                    </h3>

                    {(speaker.organization || speaker.role) && (
                      <p className="mx-auto mt-1 max-w-full text-xs leading-5 text-gray-500 sm:text-sm">
                        {speaker.organization || speaker.role}
                      </p>
                    )}

                    {speaker.specialty && (
                      <p
                        className="mt-2 text-xs font-semibold sm:text-sm"
                        style={{ color: C.primary }}
                      >
                        {speaker.specialty}
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Section>
        )}

        {/* ================= WHO SHOULD ATTEND ================= */}
        {hasAttend && (
          <Section>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p
                  className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: C.primary }}
                >
                  AUDIENCE
                </p>

                <h2
                  className="text-2xl font-bold sm:text-3xl"
                  style={{ color: C.title }}
                >
                  Who Should Attend
                </h2>

                <div
                  className="mx-auto mt-3 h-1 w-12 rounded-full"
                  style={{ backgroundColor: C.primary }}
                />
              </div>

              {conference.whoShouldAttendDescription && (
                <p className="mt-5 w-full text-left text-sm leading-7 text-gray-600 sm:text-[15px]">
                  {conference.whoShouldAttendDescription}
                </p>
              )}

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {(conference.whoShouldAttend.length > 0
                  ? conference.whoShouldAttend
                  : [
                      "Researchers and Scientists",
                      "Healthcare Professionals",
                      "Medical Practitioners",
                      "Academic Faculty",
                      "Students and Scholars",
                      "Industry Professionals",
                      "Policy Makers",
                      "Research Organizations",
                    ]
                ).map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex min-h-[42px] items-center gap-2 rounded-lg border bg-white px-3 py-2 transition-all duration-200 hover:border-violet-400 hover:shadow-sm"
                    style={{ borderColor: C.border }}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: C.primary }}
                    />
                    <span
                      className="text-xs font-medium sm:text-sm"
                      style={{ color: C.title }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* ================= KEY HIGHLIGHTS + TOPICS ================= */}
        {(hasHighlights || hasTopics) && (
          <Section bg={C.soft}>
            <Heading
              label="Conference Overview"
              eyebrow="WHAT TO EXPECT"
              description="Explore the key highlights and important topics covered during the conference."
            />

            <div
              className={`mt-9 grid items-stretch gap-6 lg:gap-8 ${
                hasHighlights && hasTopics ? "lg:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {hasHighlights && (
                <motion.div
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.12 }}
                  className="min-w-0"
                >
                  <Panel
                    title="Key Highlights"
                    subtitle="Discover what makes this conference valuable."
                    icon={<Award size={21} />}
                  >
                    {conference.keyHighlights.map((highlight, index) => (
                      <LineCard key={highlight?.title || index} index={index}>
                        <span
                          className="block text-sm font-bold leading-6 sm:text-base"
                          style={{ color: C.title }}
                        >
                          {highlight?.title ||
                            (typeof highlight === "string" ? highlight : "")}
                        </span>

                        {highlight?.description && (
                          <span
                            className="mt-1 block text-sm leading-6"
                            style={{ color: C.text }}
                          >
                            {highlight.description}
                          </span>
                        )}
                      </LineCard>
                    ))}
                  </Panel>
                </motion.div>
              )}

              {hasTopics && (
                <motion.div
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.12 }}
                  className="min-w-0"
                >
                  <Panel
                    title="Key Topics"
                    subtitle="Explore the major themes and research areas."
                    icon={<BookOpen size={21} />}
                  >
                    {conference.topics.map((topic, index) => (
                      <LineCard key={`${topic}-${index}`} index={index}>
                        <span
                          className="block text-sm font-semibold leading-6 sm:text-base"
                          style={{ color: C.title }}
                        >
                          {topic}
                        </span>
                      </LineCard>
                    ))}
                  </Panel>
                </motion.div>
              )}
            </div>
          </Section>
        )}

        {/* ================= EXPLORE CONFERENCE ================= */}
        <Section>
          <div className="mx-auto max-w-7xl">
            <Heading
              label="Explore the Conference"
              eyebrow="MORE TO DISCOVER"
              description="Discover sessions, benefits, participation details, and other conference information."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {flipCards.map((card, index) => {
                const isFlipped = Boolean(flipped[card.id]);

                return (
                  <motion.div
                    variants={reveal}
                    key={card.id}
                    className="h-[330px] min-w-0"
                    style={{ perspective: "1200px" }}
                  >
                    <motion.div
                      className="relative h-full w-full"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{
                        duration: 0.55,
                        ease: "easeInOut",
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* FRONT OF CARD */}
                      <button
                        type="button"
                        onClick={() => toggleCard(card.id)}
                        aria-expanded={isFlipped}
                        aria-label={`Explore ${card.label}`}
                        tabIndex={isFlipped ? -1 : 0}
                        className="group absolute inset-0 flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-violet-100 bg-white p-5 text-left text-violet-950 shadow-md shadow-violet-100/70 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-200/60 sm:p-6"
                        style={{
                          background: "#FFFFFF",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        {/* Decorative shapes */}
                        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border-[20px] border-violet-100/70 transition-colors duration-300 group-hover:border-violet-200/70" />

                        <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-violet-100/60 blur-2xl" />

                        {/* Number and icon */}
                        <div className="relative flex items-start justify-between gap-3">
                          <span className="text-4xl font-extrabold leading-none text-violet-200">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700 transition duration-300 group-hover:scale-105 group-hover:bg-violet-100">
                            {card.icon}
                          </span>
                        </div>

                        {/* Card content */}
                        <div className="relative">
                          <h3 className="text-base font-extrabold leading-6 text-violet-950 sm:text-lg">
                            {card.label}
                          </h3>

                          <p className="mt-2 text-xs leading-5 text-violet-700">
                            {card.description}
                          </p>

                          <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-violet-800">
                            Explore Details
                            <ArrowRight
                              size={15}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </span>
                        </div>
                      </button>

                      {/* BACK OF CARD */}
                      <div
                        aria-hidden={!isFlipped}
                        className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white p-4 shadow-xl shadow-violet-100/70 sm:p-5"
                        style={{
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        {/* Back card heading */}
                        <div className="flex items-start justify-between gap-3 border-b border-violet-100 pb-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-100 bg-violet-50 text-violet-700">
                              {card.icon}
                            </span>

                            <h3 className="text-sm font-extrabold leading-5 text-violet-950">
                              {card.label}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleCard(card.id)}
                            tabIndex={isFlipped ? 0 : -1}
                            aria-label={`Flip back: ${card.label}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-700 transition hover:bg-violet-50"
                          >
                            <RotateCcw size={15} />
                          </button>
                        </div>

                        {/* Back card details */}
                        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 text-sm leading-6 text-violet-800">
                          {card.content}
                        </div>

                        {/* Flip back button */}
                        <button
                          type="button"
                          onClick={() => toggleCard(card.id)}
                          tabIndex={isFlipped ? 0 : -1}
                          className="mt-3 inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-700 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-violet-800 hover:shadow-md"
                        >
                          <RotateCcw size={14} />
                          Flip Back
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </Section>

        {/* ================= SPONSORS ================= */}
        <Section bg={C.soft}>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Heading
              label="Partners & Sponsors"
              eyebrow="OUR PARTNERS"
              description="We appreciate the organizations supporting this conference."
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="mx-auto mt-9 grid max-w-6xl grid-cols-2 items-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            >
              {(conference.sponsors.length > 0
                ? conference.sponsors.map((logo, index) => ({
                    name: `Sponsor ${index + 1}`,
                    logo,
                  }))
                : [
                    { name: "Sponsor One", logo: "/sponsors/sponsor-1.png" },
                    { name: "Sponsor Two", logo: "/sponsors/sponsor-2.png" },
                    {
                      name: "Sponsor Three",
                      logo: "/sponsors/sponsor-3.png",
                    },
                    {
                      name: "Sponsor Four",
                      logo: "/sponsors/sponsor-4.png",
                    },
                    {
                      name: "Sponsor Five",
                      logo: "/sponsors/sponsor-5.png",
                    },
                    { name: "Sponsor Six", logo: "/sponsors/sponsor-6.png" },
                  ]
              ).map((sponsor, index) => (
                <motion.div
                  variants={reveal}
                  key={`${sponsor.name}-${index}`}
                  className="group flex h-[100px] items-center justify-center overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-[115px] sm:p-5"
                  style={{ borderColor: C.border }}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    loading="lazy"
                    className="max-h-[70px] max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>
      </div>
    </>
  );
};

// ================= SECTION =================
const Section = ({ bg = "#FFFFFF", children }) => (
  <motion.section
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.04 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
    style={{ backgroundColor: bg }}
  >
    <div className="mx-auto max-w-7xl">{children}</div>
  </motion.section>
);

// ================= HEADING =================
const Heading = ({ label, eyebrow, description, align = "center" }) => {
  if (align === "left") {
    return (
      <div>
        {eyebrow && (
          <p
            className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] sm:text-xs"
            style={{ color: C.primary }}
          >
            {eyebrow}
          </p>
        )}

        <h2
          className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
          style={{ color: C.title }}
        >
          {label}
        </h2>

        <span
          className="mt-3 block h-1 w-14 rounded-full"
          style={{ backgroundColor: C.primary }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p
          className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] sm:text-xs"
          style={{ color: C.primary }}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl"
        style={{ color: C.title }}
      >
        {label}
      </h2>

      <span
        className="mx-auto mt-3 block h-1 w-14 rounded-full"
        style={{ backgroundColor: C.primary }}
      />

      {description && (
        <p
          className="mx-auto mt-4 max-w-3xl text-sm leading-7 sm:text-base"
          style={{ color: C.text }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

// ================= HERO PILL =================
const Pill = ({ icon, children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm">
    <span className="text-purple-300">{icon}</span>
    {children}
  </span>
);

// ================= ACTION BUTTON =================
const ActionBtn = ({ icon, text, onClick, primary = false }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex min-w-0 items-center justify-between gap-1.5 rounded-xl border px-3 py-3 text-xs font-bold text-white transition duration-300 hover:-translate-y-0.5"
    style={{
      backgroundColor: primary ? C.primary : "rgba(255,255,255,0.07)",
      borderColor: primary ? C.primary : "rgba(255,255,255,0.15)",
    }}
    onMouseEnter={(event) => {
      event.currentTarget.style.backgroundColor = primary
        ? C.primaryHover
        : "rgba(255,255,255,0.15)";
    }}
    onMouseLeave={(event) => {
      event.currentTarget.style.backgroundColor = primary
        ? C.primary
        : "rgba(255,255,255,0.07)";
    }}
  >
    <span className="flex min-w-0 items-center gap-2">
      {icon}
      <span>{text}</span>
    </span>

    <ArrowRight
      size={14}
      className="shrink-0 transition-transform group-hover:translate-x-1"
    />
  </button>
);

// ================= PANEL =================
const Panel = ({ title, subtitle, icon, children }) => (
  <div
    className="h-full rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
    style={{ borderColor: C.border }}
  >
    <div className="mb-5 flex items-start gap-3">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: C.softer,
          color: C.primary,
        }}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <h3
          className="text-lg font-extrabold sm:text-xl"
          style={{ color: C.title }}
        >
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-3">{children}</div>
  </div>
);

// ================= LINE CARD =================
const LineCard = ({ index, children }) => (
  <div
    className="flex items-start gap-3 rounded-xl border px-3 py-3 transition duration-300 hover:border-purple-300 hover:bg-purple-50/50 sm:px-4 sm:py-3.5"
    style={{ borderColor: C.border }}
  >
    <span
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold"
      style={{
        color: C.primary,
        backgroundColor: C.softer,
      }}
    >
      {String(index + 1).padStart(2, "0")}
    </span>

    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

// ================= ITEM LIST =================
const ItemList = ({ items = [] }) => (
  <div className="space-y-3">
    {items.map((item, index) => {
      const title = pick(item, ["title", "name", "text"]);
      const description = typeof item === "string" ? "" : item?.description;

      return (
        <div key={`${title}-${index}`} className="flex items-start gap-2.5">
          <CheckCircle2
            size={16}
            className="mt-0.5 shrink-0"
            style={{ color: C.primary }}
          />

          <div className="min-w-0">
            <p
              className="text-sm font-bold leading-5"
              style={{ color: C.title }}
            >
              {title}
            </p>

            {description && (
              <p className="mt-1 text-xs leading-5" style={{ color: C.text }}>
                {description}
              </p>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

// ================= BULLETS =================
const Bullets = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <div
          key={`${typeof item === "string" ? item : item?.title || index}-${index}`}
          className="flex items-start gap-2"
        >
          <CheckCircle2
            size={15}
            className="mt-0.5 shrink-0"
            style={{ color: C.primary }}
          />

          <span className="text-xs leading-5" style={{ color: C.text }}>
            {typeof item === "string" ? item : item?.title || item?.text || ""}
          </span>
        </div>
      ))}
    </div>
  );
};

// ================= SUB SECTION =================
const Sub = ({ title, children }) => (
  <div>
    <h4 className="mb-2 text-sm font-extrabold" style={{ color: C.title }}>
      {title}
    </h4>

    {children}
  </div>
);

// ================= EMPTY CARD CONTENT =================
const EmptyCardContent = ({ text }) => (
  <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/70 px-4 py-5 text-center">
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-violet-700 shadow-sm">
      <BookOpen size={17} />
    </span>

    <p className="mt-3 text-xs leading-5 text-gray-600">{text}</p>
  </div>
);

export default ConferenceDetails;
