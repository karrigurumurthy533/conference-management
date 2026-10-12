import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarDays,
  MapPin,
  Globe2,
  Users,
  Mic,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Gift,
  BarChart3,
  Image as ImageIcon,
  Play,
  Lightbulb,
  Clock,
  CheckCircle2,
  Presentation,
  X,
  Award,
  ExternalLink,
  Handshake,
  CalendarCheck,
  Layers,
  Sparkles,
  Hash,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { getConferenceByIdApi, getConferencesApi } from "../api/api";
import { subscribe, clearSubscribe } from "../redux/userSlice";

// ============================================================
// FALLBACK CONFIGURATION
// ============================================================

const FALLBACK_CONFERENCE_ID = "6abe6282115ac55e02fcf168";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=2000&q=90";

const FALLBACK_ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=85";

const FALLBACK_SPEAKER_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=85";

const FALLBACK_KEY_POINTS = [
  "Latest research findings and clinical advancements",
  "Real-world case studies and success stories",
  "Global networking and collaboration opportunities",
  "Access to expert-led sessions and workshops",
  "Continuing education and professional development",
];

const PREMIUM_CARD =
  "rounded-3xl border border-violet-100/80 bg-white shadow-[0_18px_50px_-24px_rgba(76,29,149,0.28)]";

const DETAIL_ROWS = [
  { key: "why", title: "Why to Attend", icon: Star },
  { key: "agenda", title: "Sample Agenda", icon: CalendarCheck },
  { key: "benefits", title: "Benefits of Attending", icon: Gift },
  { key: "delegates", title: "Delegates", icon: Users },
  {
    key: "posterLive",
    title: "Poster Presenters (Live Presentation)",
    icon: Presentation,
  },
  {
    key: "ePoster",
    title: "E-Poster Presenters (Virtual Display Only)",
    icon: ImageIcon,
  },
  { key: "market", title: "Market Analysis", icon: BarChart3 },
];

const FALLBACK_POSTS = [
  {
    title: "Conference Updates",
    description: "Follow the latest conference announcements and updates.",
    date: "Latest Updates",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Research & Innovation",
    description: "Discover new ideas and developments in research.",
    date: "Conference News",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Global Collaboration",
    description: "Connecting professionals and researchers worldwide.",
    date: "Community News",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================
// HELPERS
// ============================================================

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const asArray = (value) => (Array.isArray(value) ? value : []);

const asText = (value, fallback = "") => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
};

const getText = (item, keys, fallback = "") => {
  if (typeof item === "string") return item.trim() || fallback;
  if (!isObject(item)) return fallback;

  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return fallback;
};

const formatDate = (value, fallback = "Date to be announced") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return asText(value, fallback);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

const getDateRange = (conference) => {
  if (conference?.date) return conference.date;
  const start = conference?.startDate;
  const end = conference?.endDate;
  if (!start && !end) return "Dates to be announced";

  if (start && end) {
    const startDate = formatDate(start);
    const endDate = formatDate(end);
    return startDate === endDate ? startDate : `${startDate} – ${endDate}`;
  }

  return formatDate(start || end);
};

const getCountdownPhase = (startDate, endDate) => {
  const now = Date.now();
  const start = startDate ? new Date(startDate).getTime() : NaN;
  const end = endDate ? new Date(endDate).getTime() : NaN;

  if (!Number.isFinite(start)) return "unknown";
  if (now < start) return "upcoming";
  const effectiveEnd = Number.isFinite(end) ? end : start;
  if (now <= effectiveEnd + 24 * 60 * 60 * 1000) return "live";
  return "ended";
};

const getCountdown = (startDate, endDate) => {
  const phase = getCountdownPhase(startDate, endDate);
  if (phase === "unknown" || phase === "ended") {
    return { phase, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = endDate ? new Date(endDate).getTime() : start;
  const difference = Math.max(0, (phase === "upcoming" ? start : end) - now);

  return {
    phase,
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const getConferenceImage = (conference, fallback = FALLBACK_IMAGE) => {
  const image =
    conference?.image || conference?.bannerImage || conference?.conferenceImage;
  if (typeof image === "string" && image.trim()) return image;
  if (isObject(image))
    return image.url || image.secure_url || image.fileUrl || fallback;
  return fallback;
};

const getMediaUrl = (value) => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (isObject(value))
    return value.secure_url || value.url || value.fileUrl || value.path || "";
  return "";
};

const getSpeakerImage = (speaker) => {
  const image = speaker?.image || speaker?.photo || speaker?.profileImage;
  if (typeof image === "string" && image.trim()) return image;
  if (isObject(image)) {
    return (
      image.url || image.secure_url || image.fileUrl || FALLBACK_SPEAKER_IMAGE
    );
  }
  return FALLBACK_SPEAKER_IMAGE;
};

const getAgenda = (otherData) => asArray(otherData?.sampleAgenda);
const getAgendaSessions = (agendaDay) =>
  asArray(agendaDay?.schedule || agendaDay?.sessions);

const getSpeakerOrganization = (speaker) =>
  asText(speaker?.organization) ||
  asText(speaker?.institution) ||
  asText(speaker?.affiliation) ||
  asText(speaker?.country);

const getVenueName = (conference) =>
  asText(conference?.venue?.venueName) ||
  asText(conference?.venue?.name) ||
  asText(conference?.location) ||
  "Venue to be announced";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "")
    return "To be announced";
  if (typeof value === "boolean") return value ? "Available" : "Not available";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getConferenceTitle = (conference) =>
  conference?.basicInformation?.title ||
  conference?.title ||
  conference?.name ||
  "Conference";

// ============================================================
// SMALL UI PIECES
// ============================================================

const SectionLabel = ({ children }) => (
  <span className="mb-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-[10px] font-semibold text-violet-700">
    {children}
  </span>
);

const SectionHeading = ({ label, title, description }) => (
  <div className="mb-6">
    {label && <SectionLabel>{label}</SectionLabel>}
    <h2 className="text-xl font-bold text-[#171447] sm:text-2xl">{title}</h2>
    {description && (
      <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-600 sm:text-base">
        {description}
      </p>
    )}
  </div>
);

const EmptyState = ({ children = "Information will be announced soon." }) => (
  <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/40 px-4 py-6 text-center text-xs leading-5 text-slate-500">
    {children}
  </div>
);

const IconTile = ({ icon: Icon, size = 22 }) => (
  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-[0_10px_24px_-10px_rgba(109,40,217,0.8)]">
    <Icon size={size} />
  </span>
);

const FeatureCard = ({ icon, title, description, children }) => (
  <div className={`${PREMIUM_CARD} flex flex-col p-6 sm:p-7`}>
    <div className="flex items-start gap-4">
      <IconTile icon={icon} />
      <div className="min-w-0">
        <h3 className="text-xl font-bold text-[#171447] sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
    <div className="mt-5 border-t border-violet-100 pt-2">{children}</div>
  </div>
);

const FlatList = ({
  items,
  titleKey = "title",
  descriptionKey = "description",
  emptyText = "Information will be announced soon.",
}) => {
  const validItems = asArray(items).filter((item) => {
    if (typeof item === "string") return item.trim().length > 0;
    if (!isObject(item)) return false;
    return Boolean(
      item[titleKey] ||
      item[descriptionKey] ||
      item.name ||
      item.text ||
      item.session ||
      item.time,
    );
  });

  if (!validItems.length) return <EmptyState>{emptyText}</EmptyState>;

  return (
    <ul className="divide-y divide-violet-100">
      {validItems.map((item, index) => {
        const title =
          getText(item, [
            titleKey,
            "name",
            "heading",
            "title",
            "session",
            "text",
          ]) || `Item ${index + 1}`;
        const description = getText(item, [
          descriptionKey,
          "details",
          "content",
          "description",
          "bio",
        ]);

        return (
          <li
            key={item?._id || `${title}-${index}`}
            className="flex items-start gap-3 py-4 first:pt-1 last:pb-1"
          >
            <CheckCircle2 className="mt-1 shrink-0 text-violet-600" size={16} />
            <div className="min-w-0">
              <p className="text-sm font-bold leading-6 text-[#171447]">
                {title}
              </p>
              {description && description !== title && (
                <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-6 text-slate-600">
                  {description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const AccordionList = ({ rows, icon: Icon, emptyText }) => {
  if (!rows.length) return <EmptyState>{emptyText}</EmptyState>;

  return (
    <div className="divide-y divide-violet-100">
      {rows.map((row) => (
        <details key={row.key} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 transition-colors hover:text-violet-700 [&::-webkit-details-marker]:hidden">
            <span className="flex min-w-0 items-center gap-3">
              <Icon size={16} className="shrink-0 text-violet-600" />
              <span className="text-sm font-semibold leading-6 text-[#171447] group-open:text-violet-700">
                {row.title}
              </span>
            </span>
            {row.description ? (
              <ChevronDown
                size={17}
                className="shrink-0 text-violet-500 transition-transform duration-300 group-open:rotate-180"
              />
            ) : null}
          </summary>
          {row.description && (
            <p className="pb-4 pl-7 pr-6 text-sm font-semibold leading-6 text-slate-600">
              {row.description}
            </p>
          )}
        </details>
      ))}
    </div>
  );
};

function SessionsPanel({ items = [] }) {
  if (!items.length) {
    return (
      <EmptyState>No sessions or tracks have been published yet.</EmptyState>
    );
  }

  return (
    <div className="w-full divide-y divide-violet-100">
      {items.map((item, index) => (
        <div
          key={item._id || item.id || index}
          className="w-full py-5 first:pt-4 last:pb-5"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <CheckCircle2 size={16} />
            </span>
            <h3 className="text-sm font-semibold leading-6 text-[#171447] sm:text-base">
              {item.title || item.name || item.trackName || "Session"}
            </h3>
          </div>
          <p className="mt-2 pl-10 text-sm font-medium leading-6 text-slate-700">
            {item.description || item.details || ""}
          </p>
        </div>
      ))}
    </div>
  );
}

const BulletLines = ({ lines }) => (
  <ul className="space-y-2.5">
    {lines.map((line, index) => (
      <li
        key={index}
        className="flex items-start gap-2.5 text-sm font-semibold leading-6 text-slate-600"
      >
        <CheckCircle2 className="mt-1 shrink-0 text-violet-600" size={14} />
        <span className="whitespace-pre-line">{line}</span>
      </li>
    ))}
  </ul>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const ConferenceDetails = () => {
  const { id, conferenceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postRef = useRef(null);

  const currentId = id || conferenceId || FALLBACK_CONFERENCE_ID;

  const {
    subscribeLoading = false,
    subscribeSuccess = false,
    subscribeError = "",
  } = useSelector((state) => state.user || {});

  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [activeRow, setActiveRow] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [subscriberForm, setSubscriberForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    conferenceId: "",
  });
  const [formError, setFormError] = useState("");
  const [conferences, setConferences] = useState([]);
  const [countdown, setCountdown] = useState({
    phase: "unknown",
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch current conference details
  useEffect(() => {
    let active = true;

    const fetchConference = async () => {
      setLoading(true);
      setApiError("");

      try {
        const response = await getConferenceByIdApi(currentId);
        const body = response?.data ?? response;
        const apiData =
          body?.data?.conference ||
          body?.data?.data ||
          body?.data ||
          body?.conference ||
          body;

        if (!active) return;

        if (
          !apiData ||
          typeof apiData !== "object" ||
          (!apiData._id && !apiData.title && !apiData.name)
        ) {
          setConference(null);
          setApiError("Conference details are not available.");
          return;
        }

        setConference(apiData);
      } catch (error) {
        if (!active) return;
        console.error("Failed to fetch conference details:", error);
        setConference(null);
        setApiError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load conference details.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchConference();
    return () => {
      active = false;
    };
  }, [currentId]);

  // Fetch conference list for subscription dropdown
  useEffect(() => {
    let active = true;

    const fetchConferences = async () => {
      try {
        const response = await getConferencesApi();
        const body = response?.data?.data ?? response?.data ?? [];
        const conferenceList = Array.isArray(body)
          ? body
          : Array.isArray(body?.conferences)
            ? body.conferences
            : Array.isArray(body?.items)
              ? body.items
              : [];

        if (active) setConferences(conferenceList);
      } catch (error) {
        console.error("Failed to fetch conferences:", error);
        if (active) setConferences([]);
      }
    };

    fetchConferences();
    return () => {
      active = false;
    };
  }, []);

  // Normalized conference data
  const data = conference || {};
  const title = asText(data.title || data.name, "International Conference");
  const subtitle = asText(
    data.subtitle,
    "Research, innovation, collaboration and global knowledge sharing.",
  );
  const description = asText(
    data.description,
    "Explore the conference program, research topics, speakers and participation opportunities.",
  );
  const category = asText(data.category, "International Conference");
  const dateRange = getDateRange(data);
  const time = asText(data.time, "Schedule to be announced");
  const mode = asText(data.mode || data.time, "To be announced");
  const participants = asText(data.participants, "Global");
  const venueName = getVenueName(data);
  const heroImage = getConferenceImage(data);

  const aboutImage = getMediaUrl(data.aboutImage) || FALLBACK_ABOUT_IMAGE;

  const speakers = asArray(data.speakers);

  const tracks = asArray(data.tracks);
  const sessions = asArray(data.sessions);
  const sessionItems = [...tracks, ...sessions];

  const keyHighlights = asArray(data.keyHighlights).filter(
    (item) =>
      item && (item.title || item.description || typeof item === "string"),
  );
  const topics = asArray(data.topics);
  const sponsors = asArray(data.sponsors).filter(Boolean);
  const welcome = isObject(data.welcomeMessage) ? data.welcomeMessage : {};

  const welcomeParagraphs = asArray(welcome.paragraphs)
    .map((paragraph) =>
      typeof paragraph === "string"
        ? paragraph.trim()
        : getText(paragraph, ["text", "content", "description"]),
    )
    .filter(Boolean);

  const welcomeText =
    welcomeParagraphs.join("\n\n") ||
    asText(
      data.welcomeMessageText,
      "Welcome to our international conference. Explore the conference program, research topics and opportunities to connect with professionals from around the world.",
    );

  const welcomeSignature = asText(welcome.signature);
  const whoShouldAttend = asText(data.whoShouldAttendDescription, "");
  const otherData = isObject(data.otherData) ? data.otherData : {};
  const agenda = getAgenda(otherData);
  const whyToAttend = asArray(otherData.whyToAttend);
  const benefits = asArray(otherData.benefitsOfAttending);
  const delegates = asArray(otherData.delegates);
  const posterPresentersLive = asArray(otherData.posterPresentersLive);
  const marketAnalysis = isObject(otherData.marketAnalysis)
    ? otherData.marketAnalysis
    : {};
  const ePoster = isObject(otherData.ePosterPresenters)
    ? otherData.ePosterPresenters
    : {};
  const contact = isObject(data.contact) ? data.contact : {};
  const registrationCategories = asArray(data.registrationCategories);
  const socialPosts = asArray(data.recentPosts || data.posts);
  const posts = socialPosts.length ? socialPosts : FALLBACK_POSTS;
  const countdownStart = data.startDate || null;
  const countdownEnd = data.endDate || data.startDate || null;
  const hasSponsors = sponsors.length > 0;

  const highlightRows = keyHighlights.map((highlight, index) => ({
    key: highlight?._id || `highlight-${index}`,
    title: getText(highlight, ["title", "name"], "Conference Highlight"),
    description: getText(highlight, ["description", "content", "text"], ""),
  }));

  const topicRows = topics
    .map((topic, index) => ({
      key: topic?._id || `topic-${index}`,
      title: getText(
        topic,
        ["title", "name", "topic", "label"],
        `Research Topic ${index + 1}`,
      ),
      description:
        typeof topic === "object" && topic !== null
          ? getText(topic, ["description", "content", "details"], "")
          : "",
    }))
    .filter((row) => row.title);

  // Countdown
  useEffect(() => {
    const updateCountdown = () =>
      setCountdown(getCountdown(countdownStart, countdownEnd));
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [countdownStart, countdownEnd]);

  // SEO metadata and Event structured data
  useEffect(() => {
    const originalTitle = document.title;
    const pageTitle = `${title} | GlobalScion Conferences`;
    const pageDescription = (
      description ||
      subtitle ||
      `Explore ${title}, including speakers, scientific sessions, research topics and registration details.`
    )
      .replace(/\s+/g, " ")
      .slice(0, 300);

    document.title = pageTitle;

    const setMeta = (attribute, key, content) => {
      if (!content) return;
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("name", "description", pageDescription);
    setMeta(
      "name",
      "keywords",
      [
        title,
        category,
        "GlobalScion Conferences",
        "international conference",
        "scientific program",
        "conference speakers",
        "conference registration",
        "research and innovation",
      ].join(", "),
    );
    setMeta("property", "og:type", "event");
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", pageDescription);
    setMeta("property", "og:image", heroImage);
    setMeta("property", "og:site_name", "GlobalScion Conferences");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", pageDescription);
    setMeta("name", "twitter:image", heroImage);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${window.location.pathname}`;

    const isOnline = /webinar|online|virtual/i.test(mode);
    const eventSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: title,
      description: pageDescription,
      image: heroImage ? [heroImage] : undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: isOnline
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/MixedEventAttendanceMode",
      location: isOnline
        ? {
            "@type": "VirtualLocation",
            url: data.venue?.onlineLink || window.location.href,
          }
        : {
            "@type": "Place",
            name: venueName,
            address: {
              "@type": "PostalAddress",
              streetAddress: data.venue?.address || "",
              addressLocality: data.venue?.city || data.location || "",
              addressRegion: data.venue?.state || "",
              addressCountry: data.venue?.country || "",
            },
          },
      organizer: {
        "@type": "Organization",
        name: "GlobalScion Conferences",
        url: "https://globalscion.com/",
      },
    };

    let jsonLd = document.getElementById("conference-event-jsonld");
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.id = "conference-event-jsonld";
      jsonLd.type = "application/ld+json";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(eventSchema);

    return () => {
      document.title = originalTitle;
      document.getElementById("conference-event-jsonld")?.remove();
    };
  }, [
    title,
    description,
    subtitle,
    category,
    heroImage,
    data.startDate,
    data.endDate,
    data.location,
    data.venue,
    mode,
    venueName,
  ]);

  // Navigation
  const goToRegistration = () => navigate(`/conferences/${currentId}/register`);
  const goToScientificProgram = () =>
    navigate(`/conferences/${currentId}/scientific-program`);
  const goToAbstracts = () =>
    navigate(`/conferences/${currentId}/abstract-submission`);

  const goToBrochure = () => {
    const brochureUrl =
      data.brochureUrl ||
      data.brochure?.fileUrl ||
      data.brochure?.url ||
      data.brochure;

    if (typeof brochureUrl === "string" && /^https?:\/\//i.test(brochureUrl)) {
      window.open(brochureUrl, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(`/conferences/${currentId}/brochure`);
  };

  const scrollTo = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scroll = (ref, direction) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  const handleRowClick = (key) => {
    setActiveRow((previous) => (previous === key ? null : key));
  };

  // Subscription form handlers
  useEffect(() => {
    return () => {
      dispatch(clearSubscribe());
    };
  }, [dispatch]);

  const handleSubscriberChange = (event) => {
    const { name, value } = event.target;
    setSubscriberForm((previous) => ({ ...previous, [name]: value }));
    setFormError("");

    if (subscribeSuccess || subscribeError) {
      dispatch(clearSubscribe());
    }
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    setFormError("");

    const name = subscriberForm.name.trim();
    const email = subscriberForm.email.trim();
    const phoneNumber = subscriberForm.phoneNumber.trim();
    const selectedConferenceId = subscriberForm.conferenceId;

    if (!name) return setFormError("Please enter your name.");
    if (!email) return setFormError("Please enter your email.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setFormError("Please enter a valid email address.");
    }
    if (!phoneNumber) return setFormError("Please enter your phone number.");
    if (!selectedConferenceId)
      return setFormError("Please select a conference.");

    dispatch(
      subscribe({
        name,
        email,
        phoneNumber,
        conferenceId: selectedConferenceId,
      }),
    );
  };

  useEffect(() => {
    if (subscribeSuccess) {
      setSubscriberForm({
        name: "",
        email: "",
        phoneNumber: "",
        conferenceId: "",
      });
      setFormError("");
    }
  }, [subscribeSuccess]);

  const posterGroups = [
    ["Poster Content", ePoster.posterContent],
    ["Design Requirements", ePoster.designRequirements],
    ["Submission Guidelines", ePoster.submissionGuidelines],
    ["Review & Acceptance", ePoster.reviewAndAcceptance],
    ["Presentation", ePoster.presentation],
    ["Certificate", ePoster.certificate],
    ["Closing Notes", ePoster.closingNotes],
  ]
    .map(([heading, items]) => [
      heading,
      asArray(items).filter((item) => typeof item === "string" && item.trim()),
    ])
    .filter(([, items]) => items.length > 0);

  const posterIntroLines = asText(ePoster.guidelinesIntro)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const renderRowContent = (key) => {
    switch (key) {
      case "why":
        return (
          <FlatList
            items={whyToAttend}
            emptyText="Reasons to attend will be announced soon."
          />
        );
      case "benefits":
        return (
          <FlatList
            items={benefits}
            emptyText="Benefits will be announced soon."
          />
        );
      case "delegates":
        return (
          <FlatList
            items={delegates}
            emptyText="Delegate information will be announced soon."
          />
        );
      case "posterLive":
        return (
          <FlatList
            items={posterPresentersLive}
            emptyText="Live poster presentation details will be announced soon."
          />
        );
      case "agenda":
        return agenda.length ? (
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
            {agenda.map((day, dayIndex) => (
              <div key={day._id || day.day || dayIndex}>
                <h4 className="mb-3 inline-flex rounded-full bg-violet-600 px-3.5 py-1 text-xs font-bold text-white">
                  {asText(day.day, `Day ${dayIndex + 1}`)}
                </h4>
                {getAgendaSessions(day).length ? (
                  <ul className="divide-y divide-violet-100 border-l-2 border-violet-200 pl-4">
                    {getAgendaSessions(day).map((session, sessionIndex) => (
                      <li
                        key={session._id || `${session.time}-${sessionIndex}`}
                        className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4"
                      >
                        <span className="min-w-[110px] text-xs font-bold text-violet-700">
                          {asText(session.time, "Time TBA")}
                        </span>
                        <span className="text-sm font-semibold leading-6 text-slate-700">
                          {asText(
                            session.session || session.title || session.name,
                            "Session details to be announced",
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">
                    No sessions have been added for this day.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>No agenda sessions have been published yet.</EmptyState>
        );
      case "ePoster":
        return (
          <div className="space-y-8">
            {posterIntroLines.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-bold text-[#171447]">
                  E-Poster Overview
                </h4>
                <BulletLines lines={posterIntroLines} />
              </div>
            )}
            {isObject(ePoster.specifications) && (
              <div>
                <h4 className="mb-3 text-sm font-bold text-[#171447]">
                  Specifications
                </h4>
                <dl className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(ePoster.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="border-b border-violet-100 py-3"
                      >
                        <dt className="text-[11px] font-semibold text-slate-500">
                          {key}
                        </dt>
                        <dd className="mt-1 text-[13px] font-semibold text-[#171447]">
                          {formatValue(value)}
                        </dd>
                      </div>
                    ),
                  )}
                </dl>
              </div>
            )}
            {posterGroups.length > 0 && (
              <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
                {posterGroups.map(([heading, items]) => (
                  <div key={heading}>
                    <h4 className="mb-3 text-sm font-bold text-[#171447]">
                      {heading}
                    </h4>
                    <BulletLines lines={items} />
                  </div>
                ))}
              </div>
            )}
            {!posterIntroLines.length &&
              !posterGroups.length &&
              !isObject(ePoster.specifications) && (
                <EmptyState>
                  E-Poster guidelines will be announced soon.
                </EmptyState>
              )}
          </div>
        );
      case "market": {
        const paragraphs = asArray(marketAnalysis.paragraphs);
        if (!paragraphs.length && !marketAnalysis.image) return <EmptyState />;
        return (
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              {asText(marketAnalysis.heading) && (
                <h4 className="text-base font-bold text-[#171447]">
                  {asText(marketAnalysis.heading)}
                </h4>
              )}
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="mt-3 whitespace-pre-line text-sm font-semibold leading-7 text-slate-600"
                >
                  {typeof paragraph === "string"
                    ? paragraph
                    : getText(paragraph, ["text", "content", "description"])}
                </p>
              ))}
            </div>
            {marketAnalysis.image && (
              <img
                src={getMediaUrl(marketAnalysis.image)}
                alt={asText(marketAnalysis.heading, "Market analysis")}
                loading="lazy"
                className="max-h-[360px] w-full rounded-2xl object-cover"
              />
            )}
          </div>
        );
      }
      default:
        return <EmptyState />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-5">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
          <p className="mt-4 text-sm font-semibold text-[#171447]">
            Loading conference details...
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Please wait while we fetch the latest conference information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-white font-sans text-slate-800">
      {apiError && (
        <div className="border-b border-amber-100 bg-amber-50 px-5 py-2 text-center text-xs text-amber-800">
          {apiError} Showing available fallback content where appropriate.
        </div>
      )}
      {/* HERO BANNER */}
      <section
        id="home"
        className="relative isolate scroll-mt-20 overflow-hidden"
      >
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071b38]/95 via-[#17123c]/85 to-[#26124b]/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#08162c]/50 via-transparent to-[#08162c]/20" />

        <div className="mx-auto flex min-h-[390px] max-w-[1400px] flex-col items-center justify-between gap-8 px-5 py-10 sm:px-8 lg:min-h-[440px] lg:flex-row lg:gap-10 lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-[760px] flex-1 text-white"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold backdrop-blur-md">
              <CalendarDays size={12} /> {category}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/90 sm:text-base">
              {subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="shrink-0 text-violet-300" size={23} />
                <div>
                  <p className="text-xs font-semibold">{dateRange}</p>
                  <p className="mt-1 text-[10px] text-white/70">{time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border-white/20 sm:border-l sm:pl-5">
                <MapPin className="shrink-0 text-violet-300" size={24} />
                <div>
                  <p className="text-xs font-semibold">{venueName}</p>
                  <p className="mt-1 text-[10px] text-white/70">{mode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border-white/20 sm:border-l sm:pl-5">
                <Globe2 className="shrink-0 text-violet-300" size={23} />
                <div>
                  <p className="text-xs font-semibold">{participants}</p>
                  <p className="mt-1 text-[10px] text-white/70">{mode}</p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={goToRegistration}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5"
              >
                Register Now <ArrowRight size={15} />
              </button>
              <button
                onClick={goToBrochure}
                className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/5 px-4 py-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                <Download size={14} /> Download Brochure
              </button>
              <button
                onClick={goToScientificProgram}
                className="rounded-lg border border-violet-300/80 px-4 py-3 text-xs font-semibold text-white transition hover:bg-violet-600/30"
              >
                View Scientific Program
              </button>
              <button
                onClick={goToAbstracts}
                className="rounded-lg border border-violet-300/80 px-4 py-3 text-xs font-semibold text-white transition hover:bg-violet-600/30"
              >
                Abstract Submission
              </button>
            </div>
          </motion.div>

          {/* COUNTDOWN */}
          <motion.aside
            initial={{ opacity: 0, x: 25, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-[420px] shrink-0 rounded-2xl border border-white/20 bg-[#100d35]/80 p-5 backdrop-blur-xl sm:p-6 lg:w-[370px]"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-500/20 text-violet-200">
                <Clock size={23} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {countdown.phase === "upcoming"
                    ? "Conference Countdown"
                    : countdown.phase === "live"
                      ? "Conference Is Live"
                      : countdown.phase === "ended"
                        ? "Conference Completed"
                        : "Conference Schedule"}
                </h2>
                <p className="mt-1 text-[11px] leading-4 text-white/65">
                  {title}
                </p>
              </div>
            </div>

            {countdown.phase === "upcoming" && (
              <>
                <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-200 sm:text-xs">
                  Time Remaining Until Conference
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Days", value: countdown.days },
                    { label: "Hours", value: countdown.hours },
                    { label: "Minutes", value: countdown.minutes },
                    { label: "Seconds", value: countdown.seconds },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.13] to-white/[0.06] px-1 py-4"
                    >
                      <span className="text-2xl font-extrabold tabular-nums text-white sm:text-3xl">
                        {String(item.value).padStart(2, "0")}
                      </span>
                      <span className="mt-2 text-[9px] font-semibold uppercase tracking-wide text-violet-200 sm:text-[10px]">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/80">
                  <CalendarDays size={15} className="text-violet-300" />
                  {dateRange}
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-white/65">
                  <Globe2 size={14} className="text-violet-300" />
                  {venueName} · {mode}
                </div>
                <button
                  onClick={goToRegistration}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3.5 text-xs font-bold text-white transition hover:-translate-y-0.5"
                >
                  Secure Your Registration <ArrowRight size={15} />
                </button>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[10px] text-white/60">
                    Live countdown · Updates every second
                  </span>
                </div>
              </>
            )}
            {countdown.phase === "live" && (
              <div className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-6 text-center">
                <CheckCircle2
                  size={38}
                  className="mx-auto mb-3 text-emerald-300"
                />
                <h3 className="text-lg font-bold text-white">
                  The Conference Is Live!
                </h3>
                <p className="mt-2 text-xs leading-6 text-white/70">
                  The conference is in progress. Explore the scientific program
                  and available sessions.
                </p>
                <button
                  onClick={goToScientificProgram}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-xs font-bold text-violet-800 transition hover:bg-violet-50"
                >
                  View Conference Program <ArrowRight size={14} />
                </button>
              </div>
            )}
            {countdown.phase === "ended" && (
              <div className="rounded-xl border border-violet-300/20 bg-violet-400/10 px-4 py-7 text-center">
                <Award size={38} className="mx-auto mb-3 text-violet-200" />
                <h3 className="text-lg font-bold text-white">
                  Thank You for Your Interest!
                </h3>
                <p className="mt-2 text-xs leading-6 text-white/70">
                  Explore the conference details, speakers, scientific topics
                  and other available resources.
                </p>
                <button
                  onClick={() => scrollTo("explore")}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-xs font-bold text-violet-800 transition hover:bg-violet-50"
                >
                  Explore Conference <ArrowRight size={14} />
                </button>
              </div>
            )}
            {countdown.phase === "unknown" && (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-7 text-center">
                <CalendarDays
                  size={34}
                  className="mx-auto mb-3 text-violet-200"
                />
                <h3 className="text-lg font-bold text-white">
                  Schedule Coming Soon
                </h3>
                <p className="mt-2 text-xs leading-6 text-white/70">
                  Conference dates will be published when the schedule is
                  confirmed.
                </p>
                <button
                  onClick={goToRegistration}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-xs font-bold text-violet-800 transition hover:bg-violet-50"
                >
                  Registration Details <ArrowRight size={14} />
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      </section>
      {/* WELCOME MESSAGE */}
      <section
        id="welcome"
        className="scroll-mt-24 bg-white px-5 py-10 sm:px-10 lg:py-12"
      >
        <div className="mx-auto grid max-w-[1300px] items-center gap-8 lg:grid-cols-[1.15fr_0.95fr_0.38fr]">
          <div>
            <SectionLabel>
              {asText(welcome.heading, "Welcome Message")}
            </SectionLabel>
            <h2 className="text-2xl font-bold leading-tight text-[#171447]">
              Welcome to GlobalScion
            </h2>
            <h3 className="mt-1 text-sm font-bold leading-6 text-[#24205c]">
              {title}
            </h3>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-[1.7] text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:10] overflow-hidden">
              {welcomeText}
            </p>
            {welcomeSignature && (
              <p className="mt-4 whitespace-pre-line text-sm font-semibold leading-6 text-violet-800">
                {welcomeSignature}
              </p>
            )}
            <p className="mt-4 font-serif text-xl italic text-violet-800">
              Together for a Brighter Future
            </p>
            <div className="ml-10 mt-1 h-0.5 w-32 rotate-[-5deg] rounded-full bg-violet-500" />
          </div>

          <div className="relative">
            <button
              onClick={() => setVideoOpen(true)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_18px_50px_-24px_rgba(76,29,149,0.4)]"
              aria-label="Open conference introduction"
            >
              <img
                src={aboutImage}
                alt={`${title} introduction`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-violet-700 transition group-hover:scale-110">
                <Play size={25} fill="currentColor" />
              </span>
              <span className="absolute bottom-8 left-0 w-full text-center text-sm font-bold text-white">
                About the Conference
              </span>
              <span className="absolute bottom-3 left-0 w-full text-center text-[11px] text-white/80">
                Discover our vision
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-violet-50 p-4 sm:grid-cols-4 lg:grid-cols-1 lg:gap-1">
            {[
              { icon: Users, value: "4800+", label: "Attendees" },
              { icon: Globe2, value: "60+", label: "Countries" },
              { icon: CalendarDays, value: "25+", label: "Conferences" },
              { icon: Mic, value: "300+", label: "Speakers" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg p-2 lg:py-3"
              >
                <Icon className="shrink-0 text-violet-600" size={28} />
                <div>
                  <p className="text-xl font-extrabold leading-tight text-violet-800">
                    {value}
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-slate-600">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* SPEAKERS */}
      <section
        id="speakers"
        className="scroll-mt-24 bg-white px-5 py-12 sm:px-10"
      >
        <div className="mx-auto max-w-[1300px]">
          <SectionHeading
            label="Featured Speakers"
            title="Renowned Speakers"
            description="Meet the speakers and professionals participating in this conference."
          />

          {speakers.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {speakers.map((speaker, index) => (
                <motion.article
                  key={speaker._id || speaker.name || index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_8px_25px_-15px_rgba(109,40,217,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_18px_35px_-15px_rgba(109,40,217,0.3)]"
                >
                  {/* SQUARE / RECTANGULAR SPEAKER IMAGE */}
                  <div className="relative aspect-square w-full overflow-hidden bg-violet-50">
                    <img
                      src={getSpeakerImage(speaker)}
                      alt={asText(speaker.name, "Conference speaker")}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_SPEAKER_IMAGE;
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#171447]/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* SPEAKER DETAILS */}
                  <div className="flex flex-1 flex-col p-4 text-center">
                    <h3 className="text-base font-bold leading-6 text-[#171447]">
                      {asText(speaker.name, "Speaker")}
                    </h3>

                    <p className="mt-1 text-xs font-semibold leading-5 text-violet-600">
                      {asText(speaker.role, "Conference Speaker")}
                    </p>

                    {getSpeakerOrganization(speaker) && (
                      <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
                        {getSpeakerOrganization(speaker)}
                      </p>
                    )}

                    {speaker.specialty && (
                      <div className="mt-3">
                        <span className="inline-flex max-w-full items-center justify-center rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-semibold text-violet-700">
                          {speaker.specialty}
                        </span>
                      </div>
                    )}

                    {speaker.bio && (
                      <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-500">
                        {speaker.bio}
                      </p>
                    )}

                    <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300 group-hover:w-16" />
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <EmptyState>
              No speakers have been added to this conference yet.
            </EmptyState>
          )}
        </div>
      </section>
      
      {/* WHO SHOULD ATTEND + CONFERENCE GALLERY + HIGHLIGHTS / TOPICS / KEY POINTS */}
      <section className="relative bg-gradient-to-b from-white via-violet-50/50 to-white px-5 py-14 sm:px-10">
        <div className="mx-auto max-w-[1300px] space-y-8">
          {/* WHO SHOULD ATTEND */}
          <div
            className={`${PREMIUM_CARD} relative overflow-hidden p-6 sm:p-8`}
          >
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-4 sm:gap-5">
                <IconTile icon={Users} size={24} />

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-[#171447] sm:text-2xl">
                    Who Should Attend?
                  </h2>

                  {whoShouldAttend ? (
                    <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-[1.85] text-slate-600">
                      {whoShouldAttend}
                    </p>
                  ) : asArray(data.whoShouldAttend).length ? (
                    <div className="mt-3 max-w-3xl">
                      <FlatList items={data.whoShouldAttend} />
                    </div>
                  ) : (
                    <p className="mt-2 max-w-3xl text-sm leading-[1.85] text-slate-600">
                      This conference welcomes researchers, clinicians,
                      educators, students, professionals and others interested
                      in the conference subject. Please check the program for
                      details.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => scrollTo("explore")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-3 text-xs font-semibold text-white shadow-[0_12px_28px_-12px_rgba(109,40,217,0.9)] transition hover:-translate-y-0.5"
              >
                View Conference Details
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* OUR CONFERENCE GALLERY */}
          <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_18px_50px_-24px_rgba(76,29,149,0.25)] sm:p-8">
            {/* GALLERY HEADING */}
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>Moments & Memories</SectionLabel>

                <h2 className="text-xl font-bold text-[#171447] sm:text-2xl">
                  Our Conference Gallery
                </h2>

                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                  Explore conference experiences, research presentations, expert
                  discussions and opportunities to connect with the global
                  community.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-violet-100 bg-violet-50 px-4 py-2 sm:self-auto">
                <ImageIcon size={16} className="text-violet-600" />
                <span className="text-xs font-semibold text-violet-700">
                  Conference Moments
                </span>
              </div>
            </div>

            {/* RESPONSIVE MASONRY-STYLE GALLERY */}
            {/* RESPONSIVE CONFERENCE GALLERY */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {/* LARGE FEATURED IMAGE */}
              <div className="group relative min-h-[260px] overflow-hidden rounded-2xl sm:col-span-2 sm:row-span-2 sm:min-h-[420px]">
                <img
                  src="/images/one.jpeg"
                  alt="International conference experience"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#100d35]/90 via-[#100d35]/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                    Featured Moment
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                    Global Conference Experience
                  </h3>
                  <p className="mt-2 max-w-md text-xs font-medium leading-5 text-white/80 sm:text-sm">
                    Bringing researchers, professionals and innovators together.
                  </p>
                </div>
              </div>

              {/* WIDE LANDSCAPE IMAGE */}
              <div className="group relative h-[220px] overflow-hidden rounded-2xl lg:col-span-2">
                <img
                  src="/images/second.jpeg"
                  alt="Expert conference presentation"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100d35]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200">
                    Knowledge Sharing
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    Expert Presentations
                  </h3>
                </div>
              </div>

              {/* COLLABORATION IMAGE */}
              <div className="group relative h-[230px] overflow-hidden rounded-2xl">
                <img
                  src="/images/three.jpeg"
                  alt="Professional collaboration"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100d35]/85 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-[10px] font-semibold text-violet-200">
                    COLLABORATION
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-white">
                    Networking & Ideas
                  </h3>
                </div>
              </div>

              {/* RESEARCH IMAGE */}
              <div className="group relative h-[230px] overflow-hidden rounded-2xl">
                <img
                  src="/images/four.jpeg"
                  alt="Research and technology"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100d35]/85 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-[10px] font-semibold text-violet-200">
                    INNOVATION
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-white">
                    Research & Technology
                  </h3>
                </div>
              </div>

              {/* WIDE COMMUNITY IMAGE */}
              <div className="group relative h-[230px] overflow-hidden rounded-2xl sm:col-span-2">
                <img
                  src="/images/five.jpeg"
                  alt="Conference community"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100d35]/85 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200">
                    Global Community
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    Connecting People, Inspiring Change
                  </h3>
                </div>
              </div>

              {/* TEAMWORK IMAGE */}
              <div className="group relative h-[230px] overflow-hidden rounded-2xl">
                <img
                  src="/images/six.jpeg"
                  alt="Conference teamwork"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100d35]/85 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-[10px] font-semibold text-violet-200">
                    TEAMWORK
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-white">
                    Working Together
                  </h3>
                </div>
              </div>
            </div>

            {/* GALLERY FOOTER */}
            <div className="mt-6 flex flex-col gap-3 border-t border-violet-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold leading-5 text-slate-500">
                Inspiring conversations. Meaningful connections. Shared
                discoveries.
              </p>

              <button
                type="button"
                onClick={() => scrollTo("explore")}
                className="inline-flex items-center gap-2 self-start rounded-full border border-violet-200 bg-violet-50 px-5 py-2.5 text-xs font-semibold text-violet-700 transition hover:border-violet-500 hover:bg-violet-600 hover:text-white sm:self-auto"
              >
                Explore Conference
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* KEY HIGHLIGHTS + KEY TOPICS + KEY POINTS */}
          <div className="grid items-start gap-6 lg:grid-cols-3">
            {/* KEY HIGHLIGHTS */}
            <FeatureCard
              icon={Sparkles}
              title="Key Highlights"
              description="Important sessions and opportunities featured in the conference."
            >
              <AccordionList
                rows={highlightRows}
                icon={CheckCircle2}
                emptyText="Highlights will be announced soon."
              />
            </FeatureCard>

            {/* KEY TOPICS */}
            <FeatureCard
              icon={Hash}
              title="Key Topics"
              description="Research areas and topics published for this conference."
            >
              <div id="topics" className="scroll-mt-24">
                <AccordionList
                  rows={topicRows}
                  icon={CheckCircle2}
                  emptyText="Topics will be announced soon."
                />
              </div>
            </FeatureCard>

            {/* KEY POINTS */}
            <FeatureCard
              icon={Lightbulb}
              title="Key Points"
              description="Explore information, expert sessions and professional collaboration."
            >
              <ul className="divide-y divide-violet-100">
                {FALLBACK_KEY_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 py-3.5 text-sm leading-6 text-slate-700"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-1 shrink-0 text-violet-600"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </FeatureCard>
          </div>
        </div>
      </section>
      {/* SUBSCRIPTION SECTION - NAVY BLUE */}
      <section className="border-y border-[#252B55] bg-[#11143A] px-6 py-7 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubscribe}
            className="flex flex-col items-center gap-4 lg:flex-row"
          >
            <div className="shrink-0 text-center lg:w-[220px] lg:text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                Stay Connected
              </p>
              <h2 className="mt-1 text-base font-semibold leading-6 text-white">
                Subscribe to Our Mailing List
              </h2>
              <p className="mt-1 text-xs font-medium leading-5 text-slate-300">
                Get conference updates and announcements.
              </p>
            </div>

            <div className="w-full lg:flex-1">
              <input
                type="text"
                name="name"
                value={subscriberForm.name}
                onChange={handleSubscriberChange}
                placeholder="Full Name"
                autoComplete="name"
                disabled={subscribeLoading}
                className="h-11 w-full rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div className="w-full lg:flex-1">
              <input
                type="email"
                name="email"
                value={subscriberForm.email}
                onChange={handleSubscriberChange}
                placeholder="Email Address"
                autoComplete="email"
                disabled={subscribeLoading}
                className="h-11 w-full rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div className="w-full lg:flex-1">
              <input
                type="tel"
                name="phoneNumber"
                value={subscriberForm.phoneNumber}
                onChange={handleSubscriberChange}
                placeholder="Phone Number"
                autoComplete="tel"
                disabled={subscribeLoading}
                className="h-11 w-full rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div className="w-full lg:flex-1">
              <select
                name="conferenceId"
                value={subscriberForm.conferenceId}
                onChange={handleSubscriberChange}
                disabled={subscribeLoading}
                className={`h-11 w-full rounded-lg border border-white/15 bg-[#20244D] px-3 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60 ${subscriberForm.conferenceId ? "text-white" : "text-slate-300"}`}
              >
                <option value="" disabled>
                  Select Conference
                </option>
                {conferences.map((item) => {
                  const optionId = item?._id || item?.id;
                  return (
                    <option
                      key={optionId}
                      value={optionId}
                      className="bg-[#11143A] text-white"
                    >
                      {getConferenceTitle(item)}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              type="submit"
              disabled={subscribeLoading}
              className="flex h-11 w-full shrink-0 items-center justify-center rounded-lg bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-[#11143A] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
            >
              {subscribeLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  Subscribing...
                </span>
              ) : (
                "Subscribe"
              )}
            </button>
          </motion.form>

          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-red-300 lg:justify-end"
            >
              <AlertCircle size={14} />
              <span>{formError}</span>
            </motion.div>
          )}
          {subscribeError && !formError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-red-300 lg:justify-end"
            >
              <AlertCircle size={14} />
              <span>
                {typeof subscribeError === "string"
                  ? subscribeError
                  : "Unable to subscribe. Please try again."}
              </span>
            </motion.div>
          )}
          {subscribeSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-emerald-300 lg:justify-end"
            >
              <CheckCircle2 size={14} />
              <span>Successfully subscribed to the conference.</span>
            </motion.div>
          )}
        </div>
      </section>
      {/* SESSIONS AND TRACKS + CONFERENCE INFORMATION */}
      <section
        id="explore"
        className="scroll-mt-20 bg-white px-5 py-12 sm:px-10"
      >
        <div className="mx-auto max-w-[1300px]">
          <div className={`${PREMIUM_CARD} overflow-hidden`}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex min-h-0 flex-col bg-white">
                <div className="shrink-0 border-b border-violet-100 px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <Layers size={19} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-[#171447] sm:text-2xl">
                        Conference Information
                      </h2>
                      <p className="mt-1 text-xs font-medium leading-5 text-black/70 sm:text-sm">
                        Explore conference details and opportunities.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-[560px] overflow-y-auto overscroll-contain [scrollbar-color:#a78bfa_#f5f3ff] [scrollbar-width:thin]">
                  {DETAIL_ROWS.map((row) => {
                    const Icon = row.icon;
                    const open = activeRow === row.key;
                    return (
                      <div
                        key={row.key}
                        className="border-b border-violet-100 last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() => handleRowClick(row.key)}
                          aria-expanded={open}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition sm:px-5 ${open ? "bg-violet-50" : "bg-white hover:bg-violet-50/50"}`}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${open ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-700"}`}
                            >
                              <Icon size={17} />
                            </span>
                            <span
                              className={`text-sm font-semibold leading-5 ${open ? "text-violet-700" : "text-black"}`}
                            >
                              {row.title}
                            </span>
                          </span>
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${open ? "rotate-180 border-violet-300 bg-white text-violet-700" : "border-violet-100 text-violet-600"}`}
                          >
                            <ChevronDown size={15} />
                          </span>
                        </button>
                        {open && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.22 }}
                            className="bg-white px-4 pb-5 pt-3 sm:px-5"
                          >
                            <div className="text-sm font-medium leading-6 text-black/80 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-violet-700 [&_p]:mb-3 [&_p]:text-sm [&_p]:font-medium [&_p]:leading-6 [&_p]:text-black/80 [&_li]:mb-2 [&_li]:text-sm [&_li]:font-medium [&_li]:leading-6 [&_li]:text-black/80">
                              {renderRowContent(row.key)}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex min-h-0 flex-col border-t border-violet-100 bg-white lg:border-l lg:border-t-0">
                <div className="shrink-0 border-b border-violet-100 px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <Layers size={19} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-[#171447] sm:text-2xl">
                        Sessions and Tracks
                      </h2>
                      <p className="mt-1 text-xs font-medium leading-5 text-black/70 sm:text-sm">
                        Explore the scientific sessions and research topics
                        planned for this conference.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-[560px] overflow-y-auto overscroll-contain px-5 py-2 sm:px-6 [scrollbar-color:#a78bfa_#f5f3ff] [scrollbar-width:thin]">
                  <SessionsPanel items={sessionItems} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* REGISTRATION CATEGORIES */}
      {registrationCategories.length > 0 && (
        <section className="bg-white px-5 py-10 sm:px-10">
          <div className="mx-auto max-w-[1300px]">
            <SectionHeading
              label="Join Us"
              title="Registration Categories"
              description="Registration categories available for this conference."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {registrationCategories.map((categoryItem, index) => (
                <div
                  key={categoryItem._id || categoryItem.name || index}
                  className={`${PREMIUM_CARD} p-5`}
                >
                  <h3 className="text-sm font-bold text-[#171447]">
                    {getText(
                      categoryItem,
                      ["name", "title", "category", "label"],
                      `Category ${index + 1}`,
                    )}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    {getText(
                      categoryItem,
                      ["description", "details"],
                      "Registration details are available through the registration page.",
                    )}
                  </p>
                  {categoryItem.price !== undefined && (
                    <p className="mt-3 text-sm font-bold text-violet-700">
                      {categoryItem.currency || ""} {categoryItem.price}
                    </p>
                  )}
                  <button
                    onClick={goToRegistration}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-violet-700"
                  >
                    Register <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* SPONSORS + RECENT POSTS */}
      <section className="bg-white px-5 py-10 sm:px-10">
        <div
          className={`mx-auto grid max-w-[1300px] gap-5 ${hasSponsors ? "lg:grid-cols-[0.9fr_1.1fr]" : "grid-cols-1"}`}
        >
          {hasSponsors && (
            <div className={`${PREMIUM_CARD} p-5 sm:p-6`}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <SectionLabel>Our Sponsors</SectionLabel>
                  <h2 className="text-xl font-bold text-[#171447] sm:text-2xl">
                    Our Valued Sponsors
                  </h2>
                </div>
                <Handshake className="text-violet-600" size={25} />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                We appreciate the organizations supporting this conference and
                its research community.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {sponsors.map((sponsor, index) => {
                  const sponsorName = getText(
                    sponsor,
                    ["name", "title", "companyName"],
                    typeof sponsor === "string"
                      ? sponsor
                      : `Sponsor ${index + 1}`,
                  );
                  const logo = isObject(sponsor)
                    ? getMediaUrl(
                        sponsor.logo ||
                          sponsor.logoUrl ||
                          sponsor.image ||
                          sponsor.imageUrl ||
                          sponsor.fileUrl,
                      )
                    : "";
                  const website =
                    typeof sponsor === "object"
                      ? sponsor.website || sponsor.url || ""
                      : "";
                  return (
                    <div
                      key={sponsor._id || sponsorName || index}
                      className="flex h-28 min-w-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-4 text-center transition hover:border-violet-200"
                    >
                      {logo ? (
                        <img
                          src={logo}
                          alt={sponsorName}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                          className="block max-h-20 w-full max-w-full object-contain"
                        />
                      ) : website ? (
                        <a
                          href={website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-bold text-violet-700 hover:underline"
                        >
                          {sponsorName}
                        </a>
                      ) : (
                        <span className="text-sm font-bold text-slate-700">
                          {sponsorName}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-[#f6f3ff] to-white p-5 shadow-[0_18px_50px_-24px_rgba(76,29,149,0.25)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SectionLabel>Follow Us</SectionLabel>
                <h2 className="text-xl font-bold text-[#171447] sm:text-2xl">
                  Recent Posts
                </h2>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => scroll(postRef, -1)}
                  aria-label="Previous posts"
                  className="rounded-full border border-violet-100 bg-white p-2 text-violet-700"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => scroll(postRef, 1)}
                  aria-label="Next posts"
                  className="rounded-full border border-violet-100 bg-white p-2 text-violet-700"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Follow conference announcements, research news and community
              updates.
            </p>
            <div className="mt-3 flex gap-2.5">
              {[
                {
                  label: "Facebook",
                  url: contact.facebook || "https://www.facebook.com/",
                  className: "bg-[#4267B2]",
                },
                {
                  label: "LinkedIn",
                  url: contact.linkedin || "https://www.linkedin.com/",
                  className: "bg-[#0A66C2]",
                },
                {
                  label: "Instagram",
                  url: contact.instagram || "https://www.instagram.com/",
                  className: "bg-gradient-to-br from-pink-500 to-orange-400",
                },
                {
                  label: "Website",
                  url: contact.website || "https://globalscion.com/",
                  className: "bg-violet-700",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:-translate-y-1 ${social.className}`}
                >
                  {social.label === "Website" ? (
                    <Globe2 size={14} />
                  ) : (
                    <ExternalLink size={14} />
                  )}
                </a>
              ))}
            </div>
            <div
              ref={postRef}
              className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {posts.map((post, index) => {
                const postTitle = getText(
                  post,
                  ["title", "name"],
                  `Conference Update ${index + 1}`,
                );
                const postImage =
                  getMediaUrl(post.image || post.imageUrl || post.thumbnail) ||
                  FALLBACK_IMAGE;
                return (
                  <article
                    key={post._id || postTitle || index}
                    className="min-w-[155px] max-w-[190px] flex-1 snap-start overflow-hidden rounded-xl border border-slate-100 bg-white"
                  >
                    <img
                      src={postImage}
                      alt={postTitle}
                      loading="lazy"
                      className="h-24 w-full object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-[#171447]">
                        {postTitle}
                      </h3>
                      <p className="mt-1.5 line-clamp-3 text-[10px] leading-4 text-slate-500">
                        {getText(
                          post,
                          ["description", "content", "caption"],
                          "Follow GlobalScion for more updates.",
                        )}
                      </p>
                      <p className="mt-2 text-[9px] text-slate-400">
                        {formatDate(
                          post.date || post.createdAt,
                          "Latest Updates",
                        )}
                      </p>
                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700"
                        >
                          Read more <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-3 text-right">
              <a
                href="https://globalscion.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700"
              >
                Visit GlobalScion <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* CONFERENCE INTRODUCTION MODAL */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-sm"
          onClick={() => setVideoOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="About the conference"
            className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-violet-100"
            >
              <X size={19} />
            </button>
            <SectionLabel>About GlobalScion</SectionLabel>
            <h2 className="mt-2 text-2xl font-bold text-[#171447]">{title}</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:10] overflow-hidden">
              {welcomeText}
            </p>
            <button
              onClick={() => {
                setVideoOpen(false);
                scrollTo("explore");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-xs font-semibold text-white hover:bg-violet-700"
            >
              Explore Conference <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenceDetails;
