import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserRound,
  MapPin,
  Building2,
  Mail,
  Globe2,
  SlidersHorizontal,
  X,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getMySpeakersApi } from "../api/employeeApis";

// ======================================================
// HELPERS
// ======================================================

const getValue = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return "";
};

const getInitials = (name = "") => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "SP";

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const getImageUrl = (image) => {
  if (!image) return "";

  if (typeof image === "string") {
    return image;
  }

  if (typeof image === "object") {
    return (
      image.url ||
      image.secure_url ||
      image.path ||
      image.location ||
      image.src ||
      ""
    );
  }

  return "";
};

// ======================================================
// NORMALIZE SPEAKER
// ======================================================

const normalizeSpeaker = (speaker, index = 0) => {
  const firstName = getValue(
    speaker?.firstName,
    speaker?.personalInformation?.firstName,
    speaker?.personalInfo?.firstName,
    speaker?.presenter?.firstName
  );

  const lastName = getValue(
    speaker?.lastName,
    speaker?.personalInformation?.lastName,
    speaker?.personalInfo?.lastName,
    speaker?.presenter?.lastName
  );

  const fullName = getValue(
    speaker?.name,
    speaker?.fullName,
    speaker?.speakerName,
    speaker?.personalInformation?.name,
    speaker?.personalInfo?.name,
    speaker?.presenter?.name,
    `${firstName} ${lastName}`.trim(),
    `Speaker ${index + 1}`
  );

  const designation = getValue(
    speaker?.designation,
    speaker?.jobTitle,
    speaker?.position,
    speaker?.professionalInformation?.designation,
    speaker?.professionalInfo?.designation,
    speaker?.personalInformation?.designation,
    speaker?.presenter?.designation
  );

  const organization = getValue(
    speaker?.organization,
    speaker?.institution,
    speaker?.company,
    speaker?.affiliation,
    speaker?.professionalInformation?.organization,
    speaker?.professionalInformation?.institution,
    speaker?.professionalInfo?.organization,
    speaker?.personalInformation?.organization,
    speaker?.presenter?.organization
  );

  const country = getValue(
    speaker?.country,
    speaker?.location?.country,
    speaker?.address?.country,
    speaker?.personalInformation?.country,
    speaker?.personalInfo?.country,
    speaker?.presenter?.country
  );

  const city = getValue(
    speaker?.city,
    speaker?.location?.city,
    speaker?.address?.city,
    speaker?.personalInformation?.city,
    speaker?.personalInfo?.city
  );

  const email = getValue(
    speaker?.email,
    speaker?.contact?.email,
    speaker?.personalInformation?.email,
    speaker?.personalInfo?.email,
    speaker?.presenter?.email
  );

  const bio = getValue(
    speaker?.bio,
    speaker?.biography,
    speaker?.description,
    speaker?.about,
    speaker?.profile?.bio
  );

  const category = getValue(
    speaker?.category,
    speaker?.speakerCategory,
    speaker?.type,
    speaker?.specialization,
    speaker?.professionalInformation?.category
  );

  const image = getImageUrl(
    speaker?.image ||
      speaker?.photo ||
      speaker?.profileImage ||
      speaker?.speakerImage ||
      speaker?.imageUrl ||
      speaker?.personalInformation?.image ||
      speaker?.personalInfo?.image ||
      speaker?.profile?.image
  );

  const linkedin = getValue(
    speaker?.linkedin,
    speaker?.linkedIn,
    speaker?.linkedinUrl,
    speaker?.socialLinks?.linkedin,
    speaker?.socialMedia?.linkedin
  );

  const website = getValue(
    speaker?.website,
    speaker?.websiteUrl,
    speaker?.personalWebsite,
    speaker?.socialLinks?.website
  );

  return {
    ...speaker,

    id:
      speaker?._id ||
      speaker?.id ||
      speaker?.speakerId ||
      `speaker-${index}`,

    name: fullName,
    firstName,
    lastName,
    designation,
    organization,
    country,
    city,
    email,
    bio,
    category,
    image,
    linkedin,
    website,
  };
};

// ======================================================
// EXTRACT SPEAKERS
// ======================================================

const extractSpeakers = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.speakers)) {
    return response.speakers;
  }

  if (Array.isArray(response?.data?.speakers)) {
    return response.data.speakers;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.data?.results)) {
    return response.data.results;
  }

  return [];
};

// ======================================================
// ANIMATION
// ======================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ======================================================
// SPEAKER CARD
// ======================================================

function SpeakerCard({ speaker, onViewProfile }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: {
          duration: 0.25,
        },
      }}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      {/* IMAGE */}

      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-violet-100 via-purple-50 to-white">
        {speaker.image ? (
          <img
            src={speaker.image}
            alt={speaker.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";

              const fallback =
                event.currentTarget.parentElement.querySelector(
                  ".speaker-fallback"
                );

              if (fallback) {
                fallback.classList.remove("hidden");
              }
            }}
          />
        ) : null}

        <div
          className={`speaker-fallback flex h-full w-full items-center justify-center ${
            speaker.image ? "hidden" : ""
          }`}
        >
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-violet-600 text-3xl font-bold text-white shadow-lg">
            {getInitials(speaker.name)}
          </div>
        </div>

        {/* CATEGORY */}

        {speaker.category && (
          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur">
            {speaker.category}
          </div>
        )}
      </div>

      {/* CONTENT */}

      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
          {speaker.name}
        </h3>

        {speaker.designation && (
          <p className="mt-1 line-clamp-2 text-sm font-medium text-violet-600">
            {speaker.designation}
          </p>
        )}

        {speaker.organization && (
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />

            <span className="line-clamp-2">
              {speaker.organization}
            </span>
          </div>
        )}

        {(speaker.city || speaker.country) && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4 shrink-0 text-violet-500" />

            <span className="line-clamp-1">
              {[speaker.city, speaker.country]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProfile(speaker)}
            className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            View Profile
          </button>

          {speaker.email && (
            <a
              href={`mailto:${speaker.email}`}
              title="Email speaker"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}

          {speaker.linkedin && (
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:border-violet-200 hover:bg-violet-50"
            >
              <img
                src="/linkedin.svg"
                alt="LinkedIn"
                className="h-5 w-5 object-contain"
              />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ======================================================
// PROFILE MODAL
// ======================================================

function SpeakerModal({ speaker, onClose }) {
  if (!speaker) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.96,
          }}
          transition={{
            duration: 0.3,
          }}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        >
          {/* HEADER */}

          <div className="relative bg-gradient-to-br from-violet-700 via-purple-600 to-violet-500 px-6 pb-8 pt-6 text-white">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-white/40 bg-white/20 shadow-lg">
                {speaker.image ? (
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";

                      const parent =
                        event.currentTarget.parentElement;

                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex h-full w-full items-center justify-center bg-violet-500 text-2xl font-bold text-white">
                            ${getInitials(speaker.name)}
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-violet-500 text-2xl font-bold text-white">
                    {getInitials(speaker.name)}
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold">
                {speaker.name}
              </h2>

              {speaker.designation && (
                <p className="mt-1 text-sm text-violet-100">
                  {speaker.designation}
                </p>
              )}

              {speaker.organization && (
                <p className="mt-1 text-sm text-white/80">
                  {speaker.organization}
                </p>
              )}
            </div>
          </div>

          {/* BODY */}

          <div className="space-y-6 p-6">
            {(speaker.city || speaker.country) && (
              <div className="flex gap-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {[speaker.city, speaker.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}

            {speaker.email && (
              <div className="flex gap-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Email
                  </p>

                  <a
                    href={`mailto:${speaker.email}`}
                    className="mt-1 block truncate text-sm font-medium text-violet-600 hover:underline"
                  >
                    {speaker.email}
                  </a>
                </div>
              </div>
            )}

            {speaker.bio && (
              <div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  About Speaker
                </h3>

                <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                  {speaker.bio}
                </p>
              </div>
            )}

            {(speaker.linkedin || speaker.website) && (
              <div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  Links
                </h3>

                <div className="flex flex-wrap gap-3">
                  {speaker.linkedin && (
                    <a
                      href={speaker.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                    >
                      <img
                        src="/linkedin.svg"
                        alt="LinkedIn"
                        className="h-4 w-4 object-contain"
                      />

                      LinkedIn
                    </a>
                  )}

                  {speaker.website && (
                    <a
                      href={speaker.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                    >
                      <Globe2 className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function Speakers() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [countryFilter, setCountryFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedSpeaker, setSelectedSpeaker] =
    useState(null);

  // ====================================================
  // FETCH EMPLOYEE SPEAKERS
  // ====================================================

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching employee speakers...");

      const response = await getMySpeakersApi();

      console.log(
        "My Speakers API Response:",
        response
      );

      const speakerList = extractSpeakers(response);

      const normalizedSpeakers =
        speakerList.map((speaker, index) =>
          normalizeSpeaker(speaker, index)
        );

      console.log(
        "Normalized Employee Speakers:",
        normalizedSpeakers
      );

      setSpeakers(normalizedSpeakers);
    } catch (err) {
      console.error(
        "Get my speakers error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load speakers. Please try again."
      );

      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL FETCH
  // ====================================================

  useEffect(() => {
    fetchSpeakers();
  }, []);

  // ====================================================
  // CATEGORIES
  // ====================================================

  const categories = useMemo(() => {
    const values = speakers
      .map((speaker) => speaker.category)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)),
    ];
  }, [speakers]);

  // ====================================================
  // COUNTRIES
  // ====================================================

  const countries = useMemo(() => {
    const values = speakers
      .map((speaker) => speaker.country)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)),
    ];
  }, [speakers]);

  // ====================================================
  // FILTER SPEAKERS
  // ====================================================

  const filteredSpeakers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return speakers.filter((speaker) => {
      const searchableText = [
        speaker.name,
        speaker.designation,
        speaker.organization,
        speaker.country,
        speaker.city,
        speaker.category,
        speaker.email,
        speaker.bio,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        speaker.category === categoryFilter;

      const matchesCountry =
        countryFilter === "All" ||
        speaker.country === countryFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCountry
      );
    });
  }, [
    speakers,
    search,
    categoryFilter,
    countryFilter,
  ]);

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setCountryFilter("All");
  };

  const hasFilters =
    search.trim() !== "" ||
    categoryFilter !== "All" ||
    countryFilter !== "All";

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      {/* ==================================================
          SEARCH / FILTER
      ================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* SEARCH */}

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search speakers by name, organization, country..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* FILTER BUTTON */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (previous) => !previous
                )
              }
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition ${
                showFilters
                  ? "border-violet-200 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />

              Filters

              {(categoryFilter !== "All" ||
                countryFilter !== "All") && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10px] font-bold text-white">
                  {
                    [
                      categoryFilter !== "All",
                      countryFilter !== "All",
                    ].filter(Boolean).length
                  }
                </span>
              )}

              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showFilters
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchSpeakers}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>
          </div>

          {/* FILTERS */}

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 md:grid-cols-2">
                  {/* CATEGORY */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </label>

                    <select
                      value={categoryFilter}
                      onChange={(event) =>
                        setCategoryFilter(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    >
                      {categories.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* COUNTRY */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Country
                    </label>

                    <select
                      value={countryFilter}
                      onChange={(event) =>
                        setCountryFilter(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    >
                      {countries.map(
                        (country) => (
                          <option
                            key={country}
                            value={country}
                          >
                            {country}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {hasFilters && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700"
                    >
                      <X className="h-4 w-4" />
                      Clear filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="mx-auto max-w-[1400px] px-6 py-6">
        {/* RESULT INFO */}

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {filteredSpeakers.length}{" "}
              {filteredSpeakers.length === 1
                ? "Speaker"
                : "Speakers"}
            </p>

            {hasFilters && (
              <p className="mt-1 text-xs text-gray-500">
                Showing filtered results
              </p>
            )}
          </div>

          {speakers.length > 0 && (
            <p className="text-xs text-gray-500">
              Total assigned speakers:{" "}
              {speakers.length}
            </p>
          )}
        </div>

        {/* ERROR */}

        {error && !loading && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-red-800">
                  Unable to load speakers
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchSpeakers}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-9 w-9 animate-spin text-violet-600" />

              <p className="mt-4 text-sm font-medium text-gray-500">
                Loading speakers...
              </p>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}

        {!loading &&
          !error &&
          filteredSpeakers.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                <UserRound className="h-8 w-8 text-violet-500" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                No speakers found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                {hasFilters
                  ? "No speakers match your current search or filters."
                  : "There are no speakers assigned to your conference yet."}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}

        {/* SPEAKER GRID */}

        {!loading &&
          !error &&
          filteredSpeakers.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredSpeakers.map(
                (speaker) => (
                  <SpeakerCard
                    key={speaker.id}
                    speaker={speaker}
                    onViewProfile={
                      setSelectedSpeaker
                    }
                  />
                )
              )}
            </motion.div>
          )}
      </div>

      {/* PROFILE MODAL */}

      {selectedSpeaker && (
        <SpeakerModal
          speaker={selectedSpeaker}
          onClose={() =>
            setSelectedSpeaker(null)
          }
        />
      )}
    </div>
  );
}

export default Speakers;