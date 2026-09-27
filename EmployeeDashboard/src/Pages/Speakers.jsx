import React, { useMemo, useState } from "react";
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
} from "lucide-react";

const Speakers = () => {
  // =========================================================
  // SPEAKERS DATA
  // Later replace this with API data from admin-created
  // conference.
  // =========================================================

  const speakersData = [
    {
      id: 1,
      name: "Dr. Sarah Williams",
      designation: "Professor of Healthcare Innovation",
      organization: "Global Health University",
      country: "USA",
      category: "Keynote Speaker",
      email: "sarah.williams@example.com",
      website: "https://example.com",
      linkedin: "https://linkedin.com",
      bio:
        "Dr. Sarah Williams is a healthcare innovation researcher specializing in digital health, AI-driven healthcare systems, and future medical technologies.",
      initials: "SW",
    },

    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      designation: "Director of Digital Health",
      organization: "Global Medical Institute",
      country: "India",
      category: "Invited Speaker",
      email: "rajesh.kumar@example.com",
      website: "https://example.com",
      linkedin: "https://linkedin.com",
      bio:
        "Dr. Rajesh Kumar focuses on digital transformation, healthcare analytics, telemedicine, and intelligent clinical systems.",
      initials: "RK",
    },

    {
      id: 3,
      name: "Dr. Emily Carter",
      designation: "Clinical Research Scientist",
      organization: "International Medical Research Center",
      country: "UK",
      category: "Invited Speaker",
      email: "emily.carter@example.com",
      website: "https://example.com",
      linkedin: "https://linkedin.com",
      bio:
        "Dr. Emily Carter works in clinical research, precision medicine, and evidence-based healthcare innovation.",
      initials: "EC",
    },

    {
      id: 4,
      name: "Prof. Michael Anderson",
      designation: "Professor of Medical Technology",
      organization: "Stanford Health Institute",
      country: "USA",
      category: "Keynote Speaker",
      email: "michael.anderson@example.com",
      website: "https://example.com",
      linkedin: "https://linkedin.com",
      bio:
        "Prof. Michael Anderson specializes in medical technology, healthcare engineering, and next-generation clinical solutions.",
      initials: "MA",
    },

    {
      id: 5,
      name: "Dr. Priya Sharma",
      designation: "Senior Healthcare Researcher",
      organization: "National Medical Research Institute",
      country: "India",
      category: "Panelist",
      email: "priya.sharma@example.com",
      website: "https://example.com",
      linkedin: "https://linkedin.com",
      bio:
        "Dr. Priya Sharma has extensive experience in healthcare research, medical innovation, and patient-centered technology.",
      initials: "PS",
    },

    {
      id: 6,
      name: "Dr. Daniel Thompson",
      designation: "Director of Medical AI",
      organization: "Future Health Technologies",
      country: "Canada",
      category: "Invited Speaker",
      email: "daniel.thompson@example.com",
      website: "https://example.com",
      linkedin: "https://linkedin.com",
      bio:
        "Dr. Daniel Thompson researches artificial intelligence applications in clinical decision support and medical diagnostics.",
      initials: "DT",
    },
  ];

  // =========================================================
  // STATES
  // =========================================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [country, setCountry] = useState("All");
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const categories = [
    "All",
    ...new Set(speakersData.map((speaker) => speaker.category)),
  ];

  const countries = [
    "All",
    ...new Set(speakersData.map((speaker) => speaker.country)),
  ];

  // =========================================================
  // FILTER SPEAKERS
  // =========================================================

  const filteredSpeakers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return speakersData.filter((speaker) => {
      const matchesSearch =
        !query ||
        speaker.name.toLowerCase().includes(query) ||
        speaker.designation.toLowerCase().includes(query) ||
        speaker.organization.toLowerCase().includes(query) ||
        speaker.country.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || speaker.category === category;

      const matchesCountry =
        country === "All" || speaker.country === country;

      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [search, category, country]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setCountry("All");
  };

  const hasFilters =
    search || category !== "All" || country !== "All";

  // =========================================================
  // SPEAKER CARD
  // =========================================================

  const SpeakerCard = ({ speaker }) => {
    return (
      <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_5px_rgba(15,23,42,0.025)] transition duration-200 hover:-translate-y-[1px] hover:border-violet-200 hover:shadow-[0_5px_18px_rgba(15,23,42,0.06)]">
        {/* TOP */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* AVATAR */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[12px] font-bold text-violet-600 ring-4 ring-violet-50/60">
              {speaker.initials}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-bold text-slate-900">
                {speaker.name}
              </h3>

              <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-violet-600">
                {speaker.designation}
              </p>
            </div>
          </div>

          {/* CATEGORY */}
          <span className="shrink-0 rounded-full bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-500">
            {speaker.category}
          </span>
        </div>

        {/* ORGANIZATION */}
        <div className="mt-4 flex items-center gap-2">
          <Building2
            size={14}
            className="shrink-0 text-slate-400"
          />

          <p className="truncate text-[11px] font-medium text-slate-600">
            {speaker.organization}
          </p>
        </div>

        {/* COUNTRY */}
        <div className="mt-2 flex items-center gap-2">
          <MapPin
            size={14}
            className="shrink-0 text-slate-400"
          />

          <p className="text-[11px] text-slate-500">
            {speaker.country}
          </p>
        </div>

        {/* BIO */}
        <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-slate-500">
          {speaker.bio}
        </p>

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            {/* EMAIL */}
            <a
              href={`mailto:${speaker.email}`}
              title="Email"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
            >
              <Mail size={13} />
            </a>

            {/* LINKEDIN SVG */}
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 transition hover:border-violet-200 hover:bg-violet-50"
            >
              <img
                src="/linkedin.svg"
                alt="LinkedIn"
                className="h-[13px] w-[13px] object-contain"
              />
            </a>

            {/* WEBSITE */}
            <a
              href={speaker.website}
              target="_blank"
              rel="noreferrer"
              title="Website"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
            >
              <Globe2 size={13} />
            </a>
          </div>

          {/* VIEW PROFILE */}
          <button
            type="button"
            onClick={() => setSelectedSpeaker(speaker)}
            className="text-[10px] font-semibold text-violet-600 transition hover:text-violet-700"
          >
            View Profile →
          </button>
        </div>
      </div>
    );
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-[1400px]">
      
        {/* ===================================================
            SEARCH + FILTERS
        =================================================== */}

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_5px_rgba(15,23,42,0.025)]">
          <div className="flex flex-col gap-2.5 lg:flex-row">
            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search speaker, organization or country..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* CATEGORY */}

            <div className="relative lg:w-[190px]">
              <SlidersHorizontal
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-[12px] font-medium text-slate-600 outline-none transition focus:border-violet-400 focus:bg-white"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* COUNTRY */}

            <div className="relative lg:w-[160px]">
              <MapPin
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-[12px] font-medium text-slate-600 outline-none transition focus:border-violet-400 focus:bg-white"
              >
                {countries.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Countries" : item}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* CLEAR */}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <X size={13} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ===================================================
            RESULTS
        =================================================== */}

        {filteredSpeakers.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSpeakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <UserRound
                size={22}
                className="text-slate-300"
              />
            </div>

            <h3 className="mt-3 text-[14px] font-bold text-slate-800">
              No speakers found
            </h3>

            <p className="mt-1 text-[11px] text-slate-500">
              Try changing your search or filter criteria.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-violet-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-violet-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          SPEAKER PROFILE MODAL
      ===================================================== */}

      {selectedSpeaker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-[2px]"
          onClick={() => setSelectedSpeaker(null)}
        >
          <div
            className="w-full max-w-[520px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="relative bg-slate-50 px-5 py-5">
              <button
                type="button"
                onClick={() => setSelectedSpeaker(null)}
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-400 shadow-sm transition hover:text-slate-700"
              >
                <X size={15} />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-[14px] font-bold text-violet-600">
                  {selectedSpeaker.initials}
                </div>

                <div className="min-w-0 pr-8">
                  <h2 className="text-[17px] font-bold text-slate-900">
                    {selectedSpeaker.name}
                  </h2>

                  <p className="mt-1 text-[11px] font-medium text-violet-600">
                    {selectedSpeaker.designation}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    {selectedSpeaker.organization}
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL BODY */}

            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
                  {selectedSpeaker.category}
                </span>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  {selectedSpeaker.country}
                </span>
              </div>

              {/* ABOUT */}

              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  About Speaker
                </p>

                <p className="mt-2 text-[12px] leading-5 text-slate-600">
                  {selectedSpeaker.bio}
                </p>
              </div>

              {/* CONTACT */}

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {/* EMAIL */}

                <a
                  href={`mailto:${selectedSpeaker.email}`}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-medium text-slate-600 transition hover:border-violet-200 hover:text-violet-600"
                >
                  <Mail size={14} />
                  <span className="truncate">
                    {selectedSpeaker.email}
                  </span>
                </a>

                {/* LINKEDIN SVG */}

                <a
                  href={selectedSpeaker.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-medium text-slate-600 transition hover:border-violet-200 hover:text-violet-600"
                >
                  <img
                    src="/linkedin.svg"
                    alt="LinkedIn"
                    className="h-[14px] w-[14px] object-contain"
                  />

                  LinkedIn Profile
                </a>
              </div>

              {/* WEBSITE */}

              <a
                href={selectedSpeaker.website}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-medium text-slate-600 transition hover:border-violet-200 hover:text-violet-600"
              >
                <Globe2 size={14} />

                <span className="truncate">
                  {selectedSpeaker.website}
                </span>
              </a>

              {/* ACTION */}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSpeaker(null)}
                  className="h-9 rounded-lg bg-violet-600 px-4 text-[11px] font-semibold text-white transition hover:bg-violet-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Speakers;