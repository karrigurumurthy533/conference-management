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
  Building2,
  ChevronsRight,
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
  const image =
    speaker?.image ||
    speaker?.photo ||
    speaker?.profileImage ||
    speaker?.imageUrl;
  if (typeof image === "string" && image.trim()) return image.trim();
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
  <span className="mb-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
    {children}
  </span>
);

const SectionHeading = ({ label, title, description }) => (
  <div className="mb-6">
    {label && <SectionLabel>{label}</SectionLabel>}
    <h2 className="text-2xl text-[#171447] sm:text-3xl font-bold">{title}</h2>
    {description && (
      <p className="mt-1.5 max-w-3xl text-base font-semibold leading-6 text-slate-600 sm:text-lg">
        {description}
      </p>
    )}
  </div>
);

const EmptyState = ({ children = "Information will be announced soon." }) => (
  <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/40 px-4 py-6 text-center text-sm leading-5 text-slate-500">
    {children}
  </div>
);

const IconTile = ({ icon: Icon, size = 22 }) => (
  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-[0_10px_24px_-10px_rgba(109,40,217,0.8)]">
    <Icon size={size} />
  </span>
);

const FeatureCard = ({ icon, title, description, children }) => (
  <div className={`${PREMIUM_CARD} flex h-full flex-col p-6 sm:p-7`}>
    {/* HEADER */}
    <div className="flex shrink-0 items-start gap-4">
      <IconTile icon={icon} />

      <div className="min-w-0 flex-1">
        <h3 className="text-2xl font-bold text-[#171447]">{title}</h3>

        <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>

    {/* CONTENT — NO SCROLL */}
    <div className="mt-5 flex flex-1 flex-col border-t border-violet-100 pt-4">
      {children}
    </div>
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
            className="flex items-start gap-3 py-4 first:pt-1 last:pb-1 font-semibold"
          >
            <CheckCircle2 className="mt-1 shrink-0 text-violet-600" size={16} />
            <div className="min-w-0">
              <p className="text-base font-bold leading-6 text-[#171447]">
                {title}
              </p>
              {description && description !== title && (
                <p className="mt-1 whitespace-pre-line text-base font-semibold leading-6 text-slate-600">
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
              <span className="text-base font-semibold leading-6 text-[#171447] group-open:text-violet-700">
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
            <p className="pb-4 pl-7 pr-6 text-base font-semibold leading-6 text-slate-600">
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
            <h3 className="text-base leading-6 text-violet-600  sm:text-lg font-bold">
              {item.title || item.name || item.trackName || "Session"}
            </h3>
          </div>
          <p className="mt-2 pl-10 text-base font-semibold leading-6 text-slate-700">
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
        className="flex items-start gap-2.5 text-base font-semibold leading-6 text-slate-600"
      >
        <CheckCircle2 className="mt-1 shrink-0 text-violet-600" size={14} />
        <span className="whitespace-pre-line">{line}</span>
      </li>
    ))}
  </ul>
);

// ============================================================
// INNER SCROLL AREA (wheel scroll stays inside the card)
// ============================================================

const InnerScroll = ({ className = "", children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (event) => {
      // If the content doesn't overflow, let the page scroll normally
      if (el.scrollHeight <= el.clientHeight + 1) return;

      // Normalize line-based wheel deltas (Firefox)
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;

      const atTop = el.scrollTop <= 0 && delta < 0;
      const atBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && delta > 0;

      // At the very top/bottom of the card, let the page continue scrolling
      if (atTop || atBottom) return;

      // Otherwise scroll the card and stop the page from scrolling
      event.preventDefault();
      el.scrollTop += delta;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
    >
      {children}
    </div>
  );
};

// ============================================================
// WHATSAPP FLOATING BUTTON
// ============================================================

const WHATSAPP_NUMBER = "443308088650";
const WHATSAPP_MESSAGE =
  "Hello, I would like to know more about the conference.";

const WhatsAppIcon = ({ size = 30 }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.003 3C9.375 3 4 8.373 4 15c0 2.386.7 4.61 1.9 6.48L4 29l7.7-1.86A11.94 11.94 0 0 0 16.003 27C22.63 27 28 21.627 28 15S22.63 3 16.003 3zm0 21.8c-1.93 0-3.73-.56-5.25-1.52l-.38-.23-4.57 1.1 1.14-4.45-.25-.4A9.77 9.77 0 0 1 6.2 15c0-5.42 4.4-9.8 9.8-9.8 5.4 0 9.8 4.38 9.8 9.8 0 5.4-4.4 9.8-9.8 9.8zm5.4-7.33c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
  </svg>
);

const WHATSAPP_DISPLAY_NUMBER = "+44 3308 088650";

const WhatsAppButton = () => {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-5 left-5 z-[90] flex items-center gap-2 sm:bottom-7 sm:left-7">
      {/* ICON */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.8)] transition hover:-translate-y-1 hover:bg-[#1ebe5b] sm:h-16 sm:w-16"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
        <span className="relative">
          <WhatsAppIcon size={30} />
        </span>
      </a>

      {/* NUMBER */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 items-center rounded-full bg-[#25D366] px-4 text-sm font-bold text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.8)] transition hover:-translate-y-1 hover:bg-[#1ebe5b] sm:h-12 sm:px-5 sm:text-base"
      >
        {WHATSAPP_DISPLAY_NUMBER}
      </a>
    </div>
  );
};

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
  const [showVideo, setShowVideo] = useState(false);
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

  // Conference video (Cloudinary URL string from API: data.video)
  const videoUrl = getMediaUrl(data.video || data.videoUrl);

  const speakers = asArray(data.speakers);

  const tracks = asArray(data.tracks);
  const sessions = asArray(data.sessions);
  const sessionItems = [...tracks, ...sessions];

  const keyHighlights = asArray(data.keyHighlights).filter(
    (item) =>
      item && (item.title || item.description || typeof item === "string"),
  );
  const topics = asArray(data.topics);

  const galleryImages = asArray(data.galleryImages)
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : getText(item, ["imageUrl", "image", "url", "src"], ""),
    )
    .filter(Boolean);

  // Key points from API (string[]). Falls back to defaults only when empty.
  const apiKeyPoints = asArray(data.keyPoints)
    .map((point) =>
      typeof point === "string"
        ? point.trim()
        : getText(point, ["title", "text", "name", "description"]),
    )
    .filter(Boolean);
  const keyPoints = apiKeyPoints.length ? apiKeyPoints : FALLBACK_KEY_POINTS;

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

  const latestUpdates = asArray(data.latestUpdates)
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : getText(item, ["title", "text", "message", "content", "name"], ""),
    )
    .filter(Boolean);

  const recentPostUpdates = asArray(data.recentpostUpdates)
    .filter(
      (post) => post && (typeof post === "object" || typeof post === "string"),
    )
    .map((post, index) =>
      typeof post === "string"
        ? {
            _id: `recent-post-${index}`,
            title: post.trim(),
            description: post.trim(),
          }
        : post,
    );

  const socialPosts = asArray(data.recentPosts || data.posts).filter(
    (post) => post && (typeof post === "object" || typeof post === "string"),
  );

  const posts = socialPosts.length ? socialPosts : recentPostUpdates;

  const countdownStart = data.startDate || null;
  const countdownEnd = data.endDate || data.startDate || null;
  const hasSponsors = sponsors.length > 0;

  // Titles used in the scrolling "Latest" ticker
  const tickerItems = posts
    .map((post, index) =>
      getText(post, ["title", "name"], `Conference Update ${index + 1}`),
    )
    .filter(Boolean);

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

  // AUTOMATIC RECENT POSTS SCROLL
  useEffect(() => {
    const container = postRef.current;

    if (!container || posts.length <= 1) return;

    const interval = setInterval(() => {
      const firstCard = container.querySelector("article");

      if (!firstCard) return;

      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = 12; // gap-3 = 12px
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollBy({
          left: cardWidth + gap,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [posts.length]);

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
                <h4 className="mb-3 inline-flex rounded-full bg-violet-600 px-3.5 py-1 text-sm text-white font-extrabold">
                  {asText(day.day, `Day ${dayIndex + 1}`)}
                </h4>
                {getAgendaSessions(day).length ? (
                  <ul className="divide-y divide-violet-100 border-l-2 border-violet-200 pl-4">
                    {getAgendaSessions(day).map((session, sessionIndex) => (
                      <li
                        key={session._id || `${session.time}-${sessionIndex}`}
                        className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4 font-semibold"
                      >
                        <span className="min-w-[110px] text-sm font-bold text-violet-700">
                          {asText(session.time, "Time TBA")}
                        </span>
                        <span className="text-base font-semibold leading-6 text-slate-700">
                          {asText(
                            session.session || session.title || session.name,
                            "Session details to be announced",
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 font-semibold">
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
                <h4 className="mb-3 text-base text-[#171447] font-extrabold">
                  E-Poster Overview
                </h4>
                <BulletLines lines={posterIntroLines} />
              </div>
            )}
            {isObject(ePoster.specifications) && (
              <div>
                <h4 className="mb-3 text-base text-[#171447] font-extrabold">
                  Specifications
                </h4>
                <dl className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(ePoster.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="border-b border-violet-100 py-3"
                      >
                        <dt className="text-[13px] font-semibold text-slate-500">
                          {key}
                        </dt>
                        <dd className="mt-1 text-[15px] font-semibold text-[#171447]">
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
                    <h4 className="mb-3 text-base text-[#171447] font-extrabold">
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
                <h4 className="text-lg text-[#171447] font-extrabold">
                  {asText(marketAnalysis.heading)}
                </h4>
              )}
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="mt-3 whitespace-pre-line text-base font-semibold leading-7 text-slate-600"
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
          <p className="mt-4 text-base font-semibold text-[#171447]">
            Loading conference details...
          </p>
          <p className="mt-1 text-sm text-slate-500 font-semibold">
            Please wait while we fetch the latest conference information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-white font-sans text-slate-800">
      {/* Scrolling ticker animation for Recent Posts */}
      <style>{`
        @keyframes gsMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .gs-marquee-track {
          animation: gsMarquee 22s linear infinite;
        }
        .gs-marquee-wrap:hover .gs-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .gs-marquee-track { animation: none; }
        }
      `}</style>

      {apiError && (
        <div className="border-b border-amber-100 bg-amber-50 px-5 py-2 text-center text-sm text-amber-800">
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
              <CalendarDays size={12} /> {category}
            </span>
            <h1 className="mt-4 text-4xl leading-tight tracking-tight sm:text-5xl lg:text-[42px] font-bold">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-6 text-white/90 sm:text-lg">
              {subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="shrink-0 text-violet-300" size={23} />
                <div>
                  <p className="text-sm font-semibold">{dateRange}</p>
                  <p className="mt-1 text-xs text-white/70 font-semibold">
                    {time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border-white/20 sm:border-l sm:pl-5">
                <MapPin className="shrink-0 text-violet-300" size={24} />
                <div>
                  <p className="text-sm font-semibold">{venueName}</p>
                  <p className="mt-1 text-xs text-white/70 font-semibold">
                    {mode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border-white/20 sm:border-l sm:pl-5">
                <Globe2 className="shrink-0 text-violet-300" size={23} />
                <div>
                  <p className="text-sm font-semibold">{participants}</p>
                  <p className="mt-1 text-xs text-white/70 font-semibold">
                    {mode}
                  </p>
                </div>
              </div>
            </div>

            {/* HERO BUTTONS - reduced gap */}
            <div className="mt-6 grid grid-cols-1 justify-start gap-x-1 gap-y-2 sm:grid-cols-[280px_280px] sm:gap-x-2">
              <button
                onClick={goToRegistration}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Register Now <ArrowRight size={19} />
              </button>

              <button
                onClick={goToBrochure}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-white/50 bg-white/5 px-5 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                <Download size={18} /> Download Brochure
              </button>

              <button
                onClick={goToScientificProgram}
                className="inline-flex w-full items-center justify-center rounded-xl border border-violet-300/80 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-violet-600/30"
              >
                View Scientific Program
              </button>

              <button
                onClick={goToAbstracts}
                className="inline-flex w-full items-center justify-center rounded-xl border border-violet-300/80 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-violet-600/30"
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
                <h2 className="text-xl text-white font-bold">
                  {countdown.phase === "upcoming"
                    ? "Conference Countdown"
                    : countdown.phase === "live"
                      ? "Conference Is Live"
                      : countdown.phase === "ended"
                        ? "Conference Completed"
                        : "Conference Schedule"}
                </h2>
                <p className="mt-1 text-[13px] leading-4 text-white/65 font-semibold">
                  {title}
                </p>
              </div>
            </div>

            {countdown.phase === "upcoming" && (
              <>
                <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-violet-200 sm:text-sm">
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
                      <span className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
                        {String(item.value).padStart(2, "0")}
                      </span>
                      <span className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-violet-200 sm:text-xs">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/80">
                  <CalendarDays size={15} className="text-violet-300" />
                  {dateRange}
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 text-[13px] text-white/65">
                  <Globe2 size={14} className="text-violet-300" />
                  {venueName} · {mode}
                </div>
                <button
                  onClick={goToRegistration}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                >
                  Secure Your Registration <ArrowRight size={15} />
                </button>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-xs text-white/60">
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
                <h3 className="text-xl text-white font-extrabold">
                  The Conference Is Live!
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70 font-semibold">
                  The conference is in progress. Explore the scientific program
                  and available sessions.
                </p>
                <button
                  onClick={goToScientificProgram}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-violet-800 transition hover:bg-violet-50"
                >
                  View Conference Program <ArrowRight size={14} />
                </button>
              </div>
            )}
            {countdown.phase === "ended" && (
              <div className="rounded-xl border border-violet-300/20 bg-violet-400/10 px-4 py-7 text-center">
                <Award size={38} className="mx-auto mb-3 text-violet-200" />
                <h3 className="text-xl text-white font-extrabold">
                  Thank You for Your Interest!
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70 font-semibold">
                  Explore the conference details, speakers, scientific topics
                  and other available resources.
                </p>
                <button
                  onClick={() => scrollTo("explore")}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-violet-800 transition hover:bg-violet-50"
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
                <h3 className="text-xl text-white font-extrabold">
                  Schedule Coming Soon
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70 font-semibold">
                  Conference dates will be published when the schedule is
                  confirmed.
                </p>
                <button
                  onClick={goToRegistration}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-violet-800 transition hover:bg-violet-50"
                >
                  Registration Details <ArrowRight size={14} />
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      </section>

      {/* LATEST UPDATES TICKER — FULL WIDTH */}
      <section className="w-full bg-white">
        <div className="flex w-full items-stretch overflow-hidden border-y border-red-100 bg-white">
          {/* LABEL */}
          <div className="z-10 flex shrink-0 items-center gap-2 bg-red-600 px-4 py-3 text-white sm:px-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            <span className="text-sm font-extrabold uppercase tracking-wide">
              Latest Updates
            </span>
          </div>

          {/* SCROLLING AREA */}
          <div className="group relative min-w-0 flex-1 overflow-hidden bg-white">
            <div className="flex w-max animate-ticker items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
              {[...latestUpdates, ...latestUpdates].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 whitespace-nowrap px-6 py-3 text-sm font-bold text-violet-700"
                >
                  <ChevronsRight
                    size={18}
                    strokeWidth={3}
                    className="shrink-0 text-red-500"
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>
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
            <h2 className="text-3xl leading-tight text-[#171447] font-bold">
              Welcome to GlobalScion
            </h2>
            <h3 className="mt-1 text-base leading-6 text-[#24205c] font-extrabold">
              {title}
            </h3>
            <p className="mt-3 whitespace-pre-line text-[17px] leading-[1.7] text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:10] overflow-hidden font-semibold">
              {welcomeText}
            </p>
            {welcomeSignature && (
              <p className="mt-4 whitespace-pre-line text-base font-semibold leading-6 text-violet-800">
                {welcomeSignature}
              </p>
            )}
            <p className="mt-4 font-serif text-2xl italic text-violet-800">
              Together for a Brighter Future
            </p>
            <div className="ml-10 mt-1 h-0.5 w-32 rotate-[-5deg] rounded-full bg-violet-500" />
          </div>

          <div className="relative">
            {showVideo && videoUrl ? (
              <video
                key={videoUrl}
                src={videoUrl}
                poster={aboutImage}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="aspect-video w-full rounded-2xl bg-black"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg"
                aria-label="Play conference introduction"
              >
                <img
                  src={aboutImage}
                  alt={`${title} introduction`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full bg-black/60 p-4 text-white">
                    ▶
                  </span>
                </span>
              </button>
            )}
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
                  <p className="text-2xl font-extrabold leading-tight text-violet-800">
                    {value}
                  </p>
                  <p className="mt-1 text-[17px] font-semibold text-slate-600">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="speakers"
        className="scroll-mt-24 bg-white px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-[1300px]">
          <SectionHeading
            label="Featured Speakers"
            title="Renowned Speakers"
            description="Meet the speakers and professionals participating in this conference."
          />

          {speakers.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {speakers.map((speaker, index) => (
                <motion.article
                  key={speaker._id || speaker.name || index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  className="group relative isolate h-[190px] w-full min-w-0 overflow-hidden rounded-xl border border-violet-100 bg-[#171447] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-[205px]"
                >
                  <img
                    src={getSpeakerImage(speaker)}
                    alt={asText(speaker.name, "Conference speaker")}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_SPEAKER_IMAGE;
                    }}
                    className="absolute inset-0 -z-20 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#100b38] via-[#171447]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 text-white sm:p-3">
                    <h3 className="line-clamp-2 text-xs font-extrabold leading-4 text-white sm:text-sm sm:leading-5">
                      {asText(speaker.name, "Speaker")}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[10px] font-semibold leading-3.5 text-violet-200 sm:text-[11px]">
                      {asText(speaker.role, "Conference Speaker")}
                    </p>
                    {getSpeakerOrganization(speaker) && (
                      <div className="mt-1 flex items-start gap-1">
                        <Building2 size={11} className="mt-0.5 shrink-0 text-violet-300" />
                        <p className="line-clamp-2 text-[9px] font-medium leading-3 text-white/90 sm:text-[10px] sm:leading-3.5">
                          {getSpeakerOrganization(speaker)}
                        </p>
                      </div>
                    )}
                    {(speaker.country || speaker.location) && (
                      <div className="mt-1 flex items-center gap-1 text-[9px] text-white/80">
                        <MapPin size={10} className="shrink-0 text-violet-300" />
                        <span className="line-clamp-1">
                          {speaker.country || speaker.location}
                        </span>
                      </div>
                    )}
                    {speaker.specialty && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <Award size={10} className="shrink-0 text-violet-300" />
                        <span className="line-clamp-1 text-[9px] font-medium text-violet-100">
                          {speaker.specialty}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 h-0.5 w-7 rounded-full bg-violet-400 transition-all duration-300 group-hover:w-12" />
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
      {/* WHO SHOULD ATTEND */}
      <div
        className={`${PREMIUM_CARD} relative mb-10 overflow-hidden p-6 sm:p-8`}
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="relative flex flex-col items-start gap-5">
          {/* HEADING + PARAGRAPH */}
          <div className="flex w-full items-start gap-4 sm:gap-5">
            <IconTile icon={Users} size={24} />

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-[#171447] sm:text-3xl">
                Who Should Attend?
              </h2>

              {whoShouldAttend ? (
                <p className="mt-3 w-full whitespace-pre-line text-base font-semibold leading-[1.85] text-slate-600">
                  {whoShouldAttend}
                </p>
              ) : asArray(data.whoShouldAttend).length ? (
                <div className="mt-3 w-full">
                  <FlatList items={data.whoShouldAttend} />
                </div>
              ) : (
                <p className="mt-3 w-full text-base font-semibold leading-[1.85] text-slate-600">
                  This conference welcomes researchers, clinicians, educators,
                  students, professionals and others interested in the
                  conference subject. Please check the program for details.
                </p>
              )}
            </div>
          </div>

          {/* BUTTON BELOW THE PARAGRAPH, LEFT ALIGNED */}
          <button
            type="button"
            onClick={() => scrollTo("explore")}
            className="ml-12 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(109,40,217,0.9)] transition hover:-translate-y-0.5"
          >
            View Conference Details
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
<section id="gallery" className="scroll-mt-24 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1300px] rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_18px_50px_-24px_rgba(76,29,149,0.25)] sm:p-8">
          <SectionLabel>Moments &amp; Memories</SectionLabel>
          <h2 className="mt-2 text-2xl font-bold text-[#171447] sm:text-3xl">Our Conference Gallery</h2>
          <p className="mt-2 mb-6 max-w-2xl text-base font-semibold leading-6 text-slate-600">Explore conference experiences, research presentations, expert discussions and opportunities to connect with the global community.</p>
          {galleryImages.length ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3">
              {galleryImages.map((image, index) => (
                <div key={`${image}-${index}`} className={`group relative overflow-hidden rounded-xl ${index === 0 ? "h-[150px] sm:col-span-2 sm:row-span-2 sm:h-[240px]" : "h-[120px]"}`}>
                  <img src={image} alt={`Conference gallery image ${index + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100d35]/85 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200">Conference Moments</p><h3 className="mt-1 text-sm font-extrabold text-white">{index === 0 ? "Global Conference Experience" : `Conference Moment ${index + 1}`}</h3></div>
                </div>
              ))}
            </div>
          ) : <EmptyState>Conference gallery images will be added soon.</EmptyState>}
        </div>
      </section>

      <section id="explore" className="scroll-mt-20 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1300px]">
          <div className={`${PREMIUM_CARD} overflow-hidden`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch">
              <div className="flex min-w-0 flex-col bg-white">
                <div className="border-b border-violet-100 px-5 py-5 sm:px-6"><h2 className="text-2xl font-bold text-[#171447] sm:text-3xl">Conference Information</h2><p className="mt-1 text-sm font-semibold text-slate-600">Explore conference details and opportunities.</p></div>
                <InnerScroll className="h-[560px] min-h-0 overflow-x-hidden overflow-y-auto [scrollbar-color:#a78bfa_#f5f3ff] [scrollbar-width:thin]">
                  {DETAIL_ROWS.map((row) => { const Icon = row.icon; const open = activeRow === row.key; return (
                    <div key={row.key} className="border-b border-violet-100 last:border-b-0">
                      <button type="button" onClick={() => handleRowClick(row.key)} aria-expanded={open} className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left ${open ? "bg-violet-50" : "bg-white hover:bg-violet-50/60"}`}>
                        <span className="flex min-w-0 items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${open ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-700"}`}><Icon size={17} /></span><span className={`text-base font-semibold ${open ? "text-violet-700" : "text-black"}`}>{row.title}</span></span><ChevronDown size={15} />
                      </button>
                      {open && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-white px-4 pb-5 pt-3"><div className="text-base font-semibold leading-6 text-black/80">{renderRowContent(row.key)}</div></motion.div>}
                    </div>
                  ); })}
                </InnerScroll>
              </div>
              <div className="flex min-w-0 flex-col border-t border-violet-100 bg-white lg:border-l lg:border-t-0">
                <div className="border-b border-violet-100 px-5 py-5 sm:px-6"><h2 className="text-2xl font-bold text-[#171447] sm:text-3xl">Sessions and Tracks</h2><p className="mt-1 text-sm font-semibold text-slate-600">Explore the scientific sessions and research topics planned for this conference.</p></div>
                <InnerScroll className="h-[560px] min-h-0 overflow-x-hidden overflow-y-auto px-5 py-3 sm:px-6 [scrollbar-color:#a78bfa_#f5f3ff] [scrollbar-width:thin]"><SessionsPanel items={sessionItems} /></InnerScroll>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SUBSCRIPTION SECTION - NAVY BLUE (compact, heading on top) */}
      <section className="mb-8 border-y border-[#252B55] bg-[#11143A] px-6 py-4 sm:px-10 sm:py-5">
        <div className="mx-auto max-w-7xl">
          {/* HEADING (top) */}
          <div className="mb-3 flex flex-col items-center gap-1 text-center lg:flex-row lg:items-baseline lg:gap-3 lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
              Stay Connected
            </p>
            <h2 className="text-lg leading-6 text-white font-extrabold">
              Subscribe to Our Mailing List
            </h2>
            <p className="text-sm font-semibold leading-5 text-slate-300">
              Get conference updates and announcements.
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubscribe}
            className="flex flex-col items-center gap-3 lg:flex-row"
          >
            <div className="w-full lg:flex-1">
              <input
                type="text"
                name="name"
                value={subscriberForm.name}
                onChange={handleSubscriberChange}
                placeholder="Full Name"
                autoComplete="name"
                disabled={subscribeLoading}
                className="h-11 w-full rounded-lg border border-white/15 bg-white/10 px-3.5 text-sm font-semibold text-white outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="h-11 w-full rounded-lg border border-white/15 bg-white/10 px-3.5 text-sm font-semibold text-white outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="h-11 w-full rounded-lg border border-white/15 bg-white/10 px-3.5 text-sm font-semibold text-white outline-none transition placeholder:text-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div className="w-full lg:flex-1">
              <select
                name="conferenceId"
                value={subscriberForm.conferenceId}
                onChange={handleSubscriberChange}
                disabled={subscribeLoading}
                className={`h-11 w-full rounded-lg border border-white/15 bg-[#20244D] px-3.5 text-sm font-semibold outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60 ${subscriberForm.conferenceId ? "text-white" : "text-slate-300"}`}
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
              className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-red-300 lg:justify-end"
            >
              <AlertCircle size={14} />
              <span>{formError}</span>
            </motion.div>
          )}
          {subscribeError && !formError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-red-300 lg:justify-end"
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
              className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-300 lg:justify-end"
            >
              <CheckCircle2 size={14} />
              <span>Successfully subscribed to the conference.</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* KEY HIGHLIGHTS + KEY TOPICS + KEY POINTS */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        {/* KEY HIGHLIGHTS */}
        <div className="h-full min-w-0">
          <FeatureCard
            icon={Sparkles}
            title="Key Highlights"
            description="Important sessions and opportunities featured in the conference."
            className="h-full"
          >
            <AccordionList
              rows={highlightRows}
              icon={CheckCircle2}
              emptyText="Highlights will be announced soon."
            />
          </FeatureCard>
        </div>

        {/* KEY TOPICS */}
        <div className="h-full min-w-0">
          <FeatureCard
            icon={Hash}
            title="Key Topics"
            description="Research areas and topics published for this conference."
            className="h-full"
          >
            <div id="topics" className="h-full scroll-mt-24">
              <AccordionList
                rows={topicRows}
                icon={CheckCircle2}
                emptyText="Topics will be announced soon."
              />
            </div>
          </FeatureCard>
        </div>

        {/* KEY POINTS */}
        <div className="h-full min-w-0">
          <FeatureCard
            icon={Lightbulb}
            title="Key Points"
            description="Explore information, expert sessions and professional collaboration."
            className="h-full"
          >
            <ul className="divide-y divide-violet-100">
              {keyPoints.map((point, index) => (
                <li
                  key={`${point}-${index}`}
                  className="flex items-start gap-3 py-3.5 text-base font-semibold leading-6 text-slate-700"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-1 shrink-0 text-violet-600"
                  />
                  <span className="min-w-0 break-words">{point}</span>
                </li>
              ))}
            </ul>
          </FeatureCard>
        </div>
      </div>

      {/* SPONSORS + RECENT POSTS */}

      <section className="w-full bg-white px-0 py-6">
        <div
          className={`grid w-full grid-cols-1 items-start gap-0 ${
            hasSponsors ? "lg:grid-cols-[0.9fr_1.1fr]" : "grid-cols-1"
          }`}
        >
          {/* SPONSORS */}
          {hasSponsors && (
            <div
              className={`${PREMIUM_CARD} min-w-0 rounded-none border-x-0 p-4 shadow-none sm:p-5`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <SectionLabel>Our Sponsors</SectionLabel>
                  <h2 className="mt-1 text-xl font-bold leading-tight text-[#171447] sm:text-2xl">
                    Media Partners &amp; Sponsors
                  </h2>
                </div>

                <Handshake className="shrink-0 text-violet-600" size={25} />
              </div>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                We appreciate the organizations supporting this conference and
                its research community.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {sponsors.map((sponsor, index) => {
                  const logo =
                    typeof sponsor === "string"
                      ? getMediaUrl(sponsor)
                      : getMediaUrl(
                          sponsor?.logo ||
                            sponsor?.logoUrl ||
                            sponsor?.image ||
                            sponsor?.imageUrl ||
                            sponsor?.fileUrl ||
                            sponsor?.url,
                        );

                  const sponsorName =
                    typeof sponsor === "string"
                      ? `Sponsor ${index + 1}`
                      : getText(
                          sponsor,
                          ["name", "title", "companyName"],
                          `Sponsor ${index + 1}`,
                        );

                  return (
                    <div
                      key={`${logo || sponsorName}-${index}`}
                      className="flex h-24 min-w-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white p-3 transition duration-300 hover:border-violet-300 hover:shadow-sm"
                    >
                      {logo ? (
                        <img
                          src={logo}
                          alt={sponsorName}
                          loading="lazy"
                          className="block h-full w-full object-contain"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
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

          {/* RECENT POSTS */}
          <div className="min-w-0 overflow-hidden rounded-none border-x-0 border-y border-violet-100 bg-gradient-to-br from-[#f6f3ff] to-white p-4 shadow-none sm:p-5">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <SectionLabel>Follow Us</SectionLabel>
                <h2 className="mt-1 text-xl font-bold leading-tight text-[#171447] sm:text-2xl">
                  Recent Posts
                </h2>
              </div>

              {/* SCROLL CONTROLS */}
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => scroll(postRef, -1)}
                  aria-label="Previous posts"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-700 transition hover:bg-violet-700 hover:text-white"
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => scroll(postRef, 1)}
                  aria-label="Next posts"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-700 transition hover:bg-violet-700 hover:text-white"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>

            {/* LATEST POSTS TICKER */}
            <div className="gs-marquee-wrap mt-3 flex items-center gap-2 overflow-hidden rounded-full border border-violet-100 bg-white px-2.5 py-1.5">
              <span className="shrink-0 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white sm:text-xs">
                Latest Posts
              </span>

              <div className="relative min-w-0 flex-1 overflow-hidden">
                <div className="gs-marquee-track flex w-max whitespace-nowrap">
                  {[0, 1].map((copy) => (
                    <span
                      key={copy}
                      aria-hidden={copy === 1}
                      className="flex shrink-0 items-center gap-5 pr-5 text-xs font-semibold text-slate-600 sm:text-sm"
                    >
                      {tickerItems.map((text, index) => (
                        <span
                          key={`${copy}-${index}`}
                          className="flex items-center gap-5"
                        >
                          <span>{text}</span>
                          <span className="h-1 w-1 rounded-full bg-violet-400" />
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SOCIAL MEDIA */}
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {[
                {
                  label: "Facebook",
                  url:
                    contact.facebook ||
                    "https://www.facebook.com/share/14KW4MrpefS/",
                  className: "bg-[#1877F2]",
                  svg: (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M13.5 21v-8.18h2.75l.41-3.19H13.5V7.6c0-.92.26-1.55 1.58-1.55h1.69V3.2c-.29-.04-1.3-.13-2.48-.13-2.45 0-4.12 1.5-4.12 4.25v2.31H7.4v3.19h2.77V21h3.33Z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  url:
                    contact.linkedin ||
                    "https://www.linkedin.com/in/gedala-sonu-5bb823405",
                  className: "bg-[#0A66C2]",
                  svg: (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM3.55 8.75h3.3v11.7h-3.3V8.75Zm5.35 0h3.16v1.6h.05c.44-.83 1.52-1.95 3.14-1.95 3.36 0 3.98 2.21 3.98 5.08v6.97h-3.3v-6.18c0-1.47-.03-3.36-2.05-3.36-2.05 0-2.36 1.6-2.36 3.25v6.29H8.9V8.75Z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  url:
                    contact.instagram ||
                    "https://www.instagram.com/global_scion_conferences",
                  className:
                    "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
                  svg: (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  ),
                },
                {
                  label: "YouTube",
                  url:
                    contact.youtube ||
                    "https://www.youtube.com/@GLOBALSCIONPRIVATELIMITED",
                  className: "bg-[#FF0033]",
                  svg: (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M23.2 7a3 3 0 0 0-2.1-2.1C19.25 4.4 12 4.4 12 4.4s-7.25 0-9.1.5A3 3 0 0 0 .8 7 31 31 0 0 0 .3 12a31 31 0 0 0 .5 5 3 3 0 0 0 2.1 2.1c1.85.5 9.1.5 9.1.5s7.25 0 9.1-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-5 31 31 0 0 0-.5-5ZM9.6 15.5v-7l6.1 3.5-6.1 3.5Z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit GlobalScion on ${social.label}`}
                  title={social.label}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${social.className}`}
                >
                  {social.svg}
                </a>
              ))}
            </div>

            {/* COMPACT SCROLLING POSTS */}
            <div
              ref={postRef}
              className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {posts.length > 0 ? (
                posts.map((rawPost, index) => {
                  const post =
                    typeof rawPost === "string"
                      ? { url: rawPost }
                      : rawPost || {};

                  const postTitle = getText(
                    post,
                    ["title", "name"],
                    `Conference Update ${index + 1}`,
                  );

                  const postImage = getMediaUrl(
                    post.image || post.imageUrl || post.thumbnail,
                  );

                  return (
                    <article
                      key={post._id || `${postTitle}-${index}`}
                      className="group flex w-[175px] min-w-[175px] snap-start flex-col overflow-hidden rounded-xl border border-slate-100 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md sm:w-[195px] sm:min-w-[195px] xl:w-[210px] xl:min-w-[210px]"
                    >
                      {postImage && (
                        <div className="h-24 overflow-hidden sm:h-28">
                          <img
                            src={postImage}
                            alt={postTitle}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(event) =>
                              event.currentTarget.parentElement?.remove()
                            }
                          />
                        </div>
                      )}

                      {/* REDUCED CONTENT HEIGHT */}
                      <div className="flex flex-1 flex-col p-3">
                        <h3 className="line-clamp-2 text-xs font-extrabold leading-4 text-[#171447] sm:text-sm sm:leading-5">
                          {postTitle}
                        </h3>

                        <p className="mt-1.5 line-clamp-2 text-[11px] font-medium leading-4 text-slate-600 sm:text-xs">
                          {getText(
                            post,
                            ["description", "content", "caption"],
                            "Follow GlobalScion for more updates.",
                          )}
                        </p>

                        <p className="mt-2 text-[10px] font-semibold text-slate-400">
                          {formatDate(
                            post.date || post.createdAt,
                            "Latest Updates",
                          )}
                        </p>

                        {post.url && (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-flex items-center gap-1 pt-2 text-[11px] font-extrabold text-violet-700 hover:text-violet-900"
                          >
                            Read more
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="flex min-h-28 w-full items-center justify-center rounded-xl border border-dashed border-violet-200 bg-white px-4 text-center">
                  <p className="text-xs font-semibold text-slate-500">
                    New conference updates will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER LINK */}
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold text-slate-400 sm:text-xs">
                Scroll to explore updates
              </p>

              <a
                href="https://globalscion.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-violet-700 transition hover:text-violet-900 sm:text-xs"
              >
                Visit GlobalScion
                <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP FLOATING BUTTON */}
      <WhatsAppButton />
    </div>
  );
};

export default ConferenceDetails;
