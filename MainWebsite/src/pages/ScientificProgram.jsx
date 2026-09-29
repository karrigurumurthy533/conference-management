import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Coffee,
  Utensils,
  Mic2,
  Presentation,
  Sparkles,
  X,
} from "lucide-react";

// ============================================================
// SCIENTIFIC PROGRAM DATA
// ============================================================

const programData = [
  {
    id: 1,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "10:00",
    duration: "45 mins",
    type: "break",
    title: "Registration & Welcome Breakfast",
    description:
      "Registration, delegate welcome and networking breakfast before the scientific sessions begin.",
    room: "Main Conference Hall",
    speakers: [],
  },

  {
    id: 2,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "10:45",
    duration: "15 mins",
    type: "opening",
    title: "Opening Remarks & Conference Welcome",
    description:
      "Welcome address introducing the scientific vision, conference objectives and key themes.",
    room: "Main Conference Hall",
    speakers: [
      {
        name: "Dr. Sarah Mitchell",
        role: "Conference Chair",
        organization: "GlobalScion Scientific Committee",
        image:
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  {
    id: 3,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "11:00",
    duration: "60 mins",
    type: "keynote",
    title:
      "Precision Epidemiology: From Population Data to Personalized Care",
    description:
      "Exploring how population-level data, risk prediction and emerging analytical approaches are transforming precision medicine and personalized healthcare.",
    room: "Grand Ballroom",
    speakers: [
      {
        name: "Dr. Cathie Sudlow",
        role: "Professor of Neurology",
        organization: "University of Edinburgh",
        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  {
    id: 4,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "12:00",
    duration: "45 mins",
    type: "keynote",
    title:
      "Precision Cancer Vaccines: Advancing Personalized Immunotherapy",
    description:
      "Discover how precision medicine is transforming cancer vaccine development and supporting targeted strategies for individualized cancer care.",
    room: "Grand Ballroom",
    speakers: [
      {
        name: "Patrick Ott",
        role: "Clinical Director, Melanoma Center",
        organization: "Dana-Farber Cancer Institute",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  {
    id: 5,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "12:45",
    duration: "75 mins",
    type: "break",
    title: "Networking Lunch",
    description:
      "Connect with researchers, clinicians, industry experts and fellow delegates over lunch.",
    room: "Networking Lounge",
    speakers: [],
  },

  {
    id: 6,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "14:00",
    duration: "35 mins",
    type: "session",
    title:
      "Molecular Drivers, Basket Trials & the Future of Precision Oncology",
    description:
      "A focused scientific session examining molecular drivers, basket trials and emerging approaches in precision oncology.",
    room: "Scientific Hall A",
    speakers: [
      {
        name: "Dr. Vivek Subbiah",
        role: "Medical Oncologist",
        organization: "Sarah Cannon Research Institute",
        image:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  {
    id: 7,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "15:00",
    duration: "45 mins",
    type: "session",
    title:
      "AI-Driven Biomarker Discovery in Translational Medicine",
    description:
      "Understanding the role of artificial intelligence and machine learning in biomarker discovery and translational research.",
    room: "Scientific Hall A",
    speakers: [
      {
        name: "Dr. James Anderson",
        role: "Director of Computational Medicine",
        organization: "International Research Center",
        image:
          "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  {
    id: 8,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "16:00",
    duration: "30 mins",
    type: "poster",
    title: "Rapid Research Presentations",
    description:
      "A collection of short scientific presentations highlighting emerging research, preliminary findings and innovative methodologies.",
    room: "Poster & Innovation Zone",
    speakers: [],
  },

  {
    id: 9,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "17:00",
    duration: "45 mins",
    type: "panel",
    title: "Meet the Editors: Publishing Science for Global Impact",
    description:
      "An interactive discussion with scientific editors covering manuscript preparation, peer review and communicating impactful research.",
    room: "Main Conference Hall",
    speakers: [
      {
        name: "Alexia-Ileana Zaromytidou",
        role: "Chief Editor",
        organization: "Nature Cancer",
        image:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "Ben Johnson",
        role: "Chief Editor",
        organization: "Nature Health",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "Liam Messin",
        role: "Deputy Editor",
        organization: "Nature Medicine",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      },
      {
        name: "Lauren Figueroa",
        role: "Senior Editor",
        organization: "Communications Medicine",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  {
    id: 10,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "17:50",
    duration: "15 mins",
    type: "poster",
    title: "Flash Research Talks",
    description:
      "A selection of poster presenters deliver concise research highlights before the main poster networking session.",
    room: "Poster & Innovation Zone",
    speakers: [],
  },

  {
    id: 11,
    date: "13 Oct 2026",
    day: "Day 01",
    time: "18:05",
    duration: "105 mins",
    type: "poster",
    title: "Reception & Poster Networking",
    description:
      "Meet researchers and explore the latest scientific posters during an informal networking reception.",
    room: "Innovation Lounge",
    speakers: [],
  },

  // ============================================================
  // DAY 2
  // ============================================================

  {
    id: 12,
    date: "14 Oct 2026",
    day: "Day 02",
    time: "09:00",
    duration: "30 mins",
    type: "opening",
    title: "Morning Scientific Welcome",
    description:
      "A short scientific overview introducing the second day of the program.",
    room: "Main Conference Hall",
    speakers: [],
  },

  {
    id: 13,
    date: "14 Oct 2026",
    day: "Day 02",
    time: "09:30",
    duration: "60 mins",
    type: "keynote",
    title: "Next-Generation Healthcare Through Digital Innovation",
    description:
      "Exploring digital technologies, clinical intelligence and emerging healthcare models.",
    room: "Grand Ballroom",
    speakers: [
      {
        name: "Dr. Emily Carter",
        role: "Digital Health Researcher",
        organization: "Global Health Institute",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  {
    id: 14,
    date: "14 Oct 2026",
    day: "Day 02",
    time: "10:45",
    duration: "45 mins",
    type: "session",
    title: "Clinical AI: From Research to Real-World Implementation",
    description:
      "A practical scientific discussion on integrating artificial intelligence into modern clinical workflows.",
    room: "Scientific Hall B",
    speakers: [
      {
        name: "Dr. Michael Wilson",
        role: "Clinical AI Scientist",
        organization: "Precision Health Lab",
        image:
          "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  {
    id: 15,
    date: "14 Oct 2026",
    day: "Day 02",
    time: "12:00",
    duration: "75 mins",
    type: "break",
    title: "Lunch & Scientific Networking",
    description:
      "Lunch break with dedicated networking opportunities for delegates.",
    room: "Networking Lounge",
    speakers: [],
  },

  {
    id: 16,
    date: "14 Oct 2026",
    day: "Day 02",
    time: "13:30",
    duration: "60 mins",
    type: "panel",
    title: "The Future of Personalized Medicine",
    description:
      "Experts discuss genomics, digital biomarkers, AI and patient-centered precision care.",
    room: "Main Conference Hall",
    speakers: [],
  },

  {
    id: 17,
    date: "14 Oct 2026",
    day: "Day 02",
    time: "15:00",
    duration: "45 mins",
    type: "session",
    title: "Genomics & Multi-Omics in Precision Healthcare",
    description:
      "Understanding how multi-omics approaches are shaping disease prediction and individualized treatment.",
    room: "Scientific Hall B",
    speakers: [],
  },

  {
    id: 18,
    date: "14 Oct 2026",
    day: "Day 02",
    time: "17:00",
    duration: "60 mins",
    type: "poster",
    title: "Innovation Showcase & Poster Session",
    description:
      "Explore emerging technologies and research projects presented by global researchers.",
    room: "Innovation Lounge",
    speakers: [],
  },

  // ============================================================
  // DAY 3
  // ============================================================

  {
    id: 19,
    date: "15 Oct 2026",
    day: "Day 03",
    time: "09:00",
    duration: "60 mins",
    type: "keynote",
    title: "The Future of Global Scientific Collaboration",
    description:
      "A global perspective on collaboration, open science, research infrastructure and innovation.",
    room: "Grand Ballroom",
    speakers: [
      {
        name: "Dr. Robert Miller",
        role: "Global Research Director",
        organization: "International Science Council",
        image:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80",
      },
    ],
  },

  {
    id: 20,
    date: "15 Oct 2026",
    day: "Day 03",
    time: "10:15",
    duration: "45 mins",
    type: "session",
    title: "Emerging Therapeutics & Translational Research",
    description:
      "Examining innovative therapeutic approaches moving from laboratory research toward clinical application.",
    room: "Scientific Hall A",
    speakers: [],
  },

  {
    id: 21,
    date: "15 Oct 2026",
    day: "Day 03",
    time: "11:15",
    duration: "45 mins",
    type: "session",
    title: "Data Science for Modern Clinical Research",
    description:
      "How advanced analytics and data science are accelerating clinical discovery.",
    room: "Scientific Hall A",
    speakers: [],
  },

  {
    id: 22,
    date: "15 Oct 2026",
    day: "Day 03",
    time: "12:15",
    duration: "75 mins",
    type: "break",
    title: "Closing Lunch",
    description:
      "Final networking lunch with conference participants and scientific committee members.",
    room: "Networking Lounge",
    speakers: [],
  },

  {
    id: 23,
    date: "15 Oct 2026",
    day: "Day 03",
    time: "14:00",
    duration: "60 mins",
    type: "panel",
    title: "Closing Panel: Where Science Goes Next",
    description:
      "An expert panel reflecting on major scientific developments and future directions.",
    room: "Main Conference Hall",
    speakers: [],
  },

  {
    id: 24,
    date: "15 Oct 2026",
    day: "Day 03",
    time: "15:15",
    duration: "30 mins",
    type: "closing",
    title: "Closing Ceremony & Conference Highlights",
    description:
      "Final remarks, scientific highlights and acknowledgements.",
    room: "Main Conference Hall",
    speakers: [],
  },
];

// ============================================================
// CATEGORY CONFIG
// ============================================================

const categoryConfig = {
  keynote: {
    label: "Keynote",
    color: "#7C3AED",
    icon: Mic2,
  },

  session: {
    label: "Scientific Session",
    color: "#2563EB",
    icon: Presentation,
  },

  panel: {
    label: "Panel Discussion",
    color: "#0891B2",
    icon: Users,
  },

  poster: {
    label: "Poster & Innovation",
    color: "#059669",
    icon: Sparkles,
  },

  break: {
    label: "Break / Networking",
    color: "#9CA3AF",
    icon: Coffee,
  },

  opening: {
    label: "Opening",
    color: "#F59E0B",
    icon: Mic2,
  },

  closing: {
    label: "Closing",
    color: "#EC4899",
    icon: Sparkles,
  },
};

// ============================================================
// COMPONENT
// ============================================================

const ScientificProgram = () => {
  const [activeDate, setActiveDate] = useState("13 Oct 2026");

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [expandedSession, setExpandedSession] = useState(null);

  // ==========================================================
  // DATES
  // ==========================================================

  const dates = [...new Set(programData.map((item) => item.date))];

  // ==========================================================
  // FILTER PROGRAM
  // ==========================================================

  const filteredProgram = useMemo(() => {
    return programData.filter((item) => {
      const matchesDate = item.date === activeDate;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText) ||
        item.room.toLowerCase().includes(searchText) ||
        item.speakers.some((speaker) =>
          speaker.name.toLowerCase().includes(searchText)
        );

      const matchesFilter =
        activeFilter === "all" ||
        item.type === activeFilter;

      return matchesDate && matchesSearch && matchesFilter;
    });
  }, [activeDate, search, activeFilter]);

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearch("");
    setActiveFilter("all");
  };

  // ==========================================================
  // TOGGLE SESSION
  // ==========================================================

  const toggleSession = (id) => {
    setExpandedSession((prev) =>
      prev === id ? null : id
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#17122B]">

        {/* Background decoration */}

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-violet-400/10" />

        <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full border border-indigo-400/10" />

        <div className="absolute right-[25%] top-20 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-6 lg:py-2">

          <div className="max-w-3xl">

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-violet-300"
            >
              <Sparkles size={14} />
              Scientific Program
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
            >
              Explore the
              <span className="block text-violet-400">
                Scientific Program
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 max-w-2xl text-base leading-7 text-white/60 md:text-lg"
            >
              Discover keynote presentations, scientific sessions,
              expert panels, research showcases and networking
              opportunities across three days of scientific exchange.
            </motion.p>

            {/* Program stats */}

            <div className="mt-8 flex flex-wrap gap-3">

              <ProgramStat
                value="03"
                label="Conference Days"
              />

              <ProgramStat
                value="24+"
                label="Scientific Sessions"
              />

              <ProgramStat
                value="50+"
                label="Expert Speakers"
              />

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================
          PROGRAM CONTAINER
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">

        {/* ====================================================
            SEARCH + FILTER BAR
        ==================================================== */}

        <div
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          <div className="grid md:grid-cols-[1fr_auto]">

            {/* SEARCH */}

            <div className="relative flex items-center">

              <Search
                size={19}
                className="absolute left-5 text-violet-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search sessions, speakers, topics..."
                className="h-14 w-full bg-transparent pl-14 pr-12 text-sm outline-none placeholder:text-slate-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              )}

            </div>

            {/* FILTER BUTTON */}

            <button
              type="button"
              onClick={() =>
                setFiltersOpen(!filtersOpen)
              }
              className="flex h-14 items-center justify-center gap-2 border-t border-slate-200 px-8 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 md:border-l md:border-t-0"
            >
              <SlidersHorizontal
                size={17}
                className="text-violet-600"
              />

              Filters

              {activeFilter !== "all" && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                  1
                </span>
              )}

              <ChevronDown
                size={15}
                className={`transition ${
                  filtersOpen ? "rotate-180" : ""
                }`}
              />
            </button>

          </div>

          {/* FILTER PANEL */}

          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                className="overflow-hidden border-t border-slate-100"
              >
                <div className="flex flex-wrap items-center gap-2 p-4">

                  <FilterButton
                    active={activeFilter === "all"}
                    onClick={() =>
                      setActiveFilter("all")
                    }
                  >
                    All Sessions
                  </FilterButton>

                  {Object.entries(categoryConfig).map(
                    ([key, config]) => (
                      <FilterButton
                        key={key}
                        active={activeFilter === key}
                        color={config.color}
                        onClick={() =>
                          setActiveFilter(key)
                        }
                      >
                        {config.label}
                      </FilterButton>
                    )
                  )}

                  {(search || activeFilter !== "all") && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-auto text-xs font-semibold text-slate-500 underline underline-offset-4 hover:text-violet-600"
                    >
                      Clear filters
                    </button>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ====================================================
            DATE NAVIGATION
        ==================================================== */}

        <div className="mt-8">

          <div className="flex items-center gap-2">

            <CalendarDays
              size={18}
              className="text-violet-600"
            />

            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
              Program Schedule
            </h2>

          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">

            {dates.map((date, index) => {

              const active = activeDate === date;

              const dateNumber = date.split(" ")[0];

              const month = date.split(" ")[1];

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => {
                    setActiveDate(date);
                    setExpandedSession(null);
                  }}
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-violet-500 bg-[#17122B] shadow-lg shadow-violet-200"
                      : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          active
                            ? "text-violet-300"
                            : "text-slate-400"
                        }`}
                      >
                        Day {index + 1}
                      </p>

                      <p
                        className={`mt-1 text-lg font-bold ${
                          active
                            ? "text-white"
                            : "text-slate-800"
                        }`}
                      >
                        {dateNumber} {month}
                      </p>
                    </div>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        active
                          ? "bg-violet-500/20 text-violet-300"
                          : "bg-violet-50 text-violet-600"
                      }`}
                    >
                      <CalendarDays size={18} />
                    </div>

                  </div>

                  {active && (
                    <motion.div
                      layoutId="activeDay"
                      className="absolute bottom-0 left-0 h-1 w-full bg-violet-500"
                    />
                  )}

                </button>
              );
            })}

          </div>

        </div>

        {/* ====================================================
            CATEGORY LEGEND
        ==================================================== */}

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-slate-200 bg-white px-4 py-3">

          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Session Types
          </span>

          {Object.entries(categoryConfig).map(
            ([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setActiveFilter(
                    activeFilter === key ? "all" : key
                  )
                }
                className="flex items-center gap-2 text-xs font-medium text-slate-600 transition hover:text-violet-700"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: config.color,
                  }}
                />

                {config.label}
              </button>
            )
          )}

        </div>

        {/* ====================================================
            RESULTS INFO
        ==================================================== */}

        <div className="mt-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-600">
              {activeDate}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Scientific Sessions
            </h2>

          </div>

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredProgram.length}
            </span>{" "}
            sessions
          </p>

        </div>

        {/* ====================================================
            PROGRAM TIMELINE
        ==================================================== */}

        <div className="relative mt-6">

          {/* Timeline */}

          <div className="absolute bottom-0 left-[83px] top-0 hidden w-px bg-gradient-to-b from-violet-200 via-slate-200 to-transparent md:block" />

          <div className="space-y-4">

            {filteredProgram.length === 0 ? (
              <EmptyState
                onClear={clearFilters}
              />
            ) : (
              filteredProgram.map((session, index) => (
                <ProgramSession
                  key={session.id}
                  session={session}
                  index={index}
                  expanded={
                    expandedSession === session.id
                  }
                  onToggle={() =>
                    toggleSession(session.id)
                  }
                />
              ))
            )}

          </div>

        </div>

        {/* ====================================================
            FOOTER NOTE
        ==================================================== */}

        <div className="mt-10 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">

          <div className="flex gap-3">

            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
              <Sparkles size={17} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Program information
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Scientific program timings and session details may be
                updated by the conference scientific committee.
                Please check the latest schedule before attending.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

// ============================================================
// PROGRAM SESSION
// ============================================================

const ProgramSession = ({
  session,
  index,
  expanded,
  onToggle,
}) => {

  const config =
    categoryConfig[session.type] ||
    categoryConfig.session;

  const Icon = config.icon;

  const isBreak =
    session.type === "break";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.035,
      }}
      className="group grid gap-3 md:grid-cols-[168px_1fr]"
    >

      {/* ====================================================
          TIME
      ==================================================== */}

      <div className="relative hidden md:block">

        <div className="sticky top-24">

          <div className="flex items-center gap-3">

            <div
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#F8FAFC] shadow-sm"
              style={{
                backgroundColor: config.color,
              }}
            >
              <Icon
                size={16}
                className="text-white"
              />
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                {session.time}
              </p>

              <p className="text-[11px] font-medium text-slate-400">
                {session.duration}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ====================================================
          SESSION CARD
      ==================================================== */}

      <div
        className={`overflow-hidden rounded-2xl border bg-white transition-all ${
          expanded
            ? "border-violet-300 shadow-lg shadow-violet-100"
            : "border-slate-200 shadow-sm hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
        }`}
      >

        {/* Accent line */}

        <div
          className="h-1 w-full"
          style={{
            backgroundColor: config.color,
          }}
        />

        <div className="p-5 md:p-6">

          {/* Mobile time */}

          <div className="mb-4 flex items-center gap-2 md:hidden">

            <span
              className="rounded-lg px-2.5 py-1 text-xs font-bold text-white"
              style={{
                backgroundColor: config.color,
              }}
            >
              {session.time}
            </span>

            <span className="text-xs text-slate-400">
              {session.duration}
            </span>

          </div>

          {/* Category */}

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color: config.color,
                  backgroundColor: `${config.color}12`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: config.color,
                  }}
                />

                {config.label}
              </span>

              {isBreak && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Coffee size={12} />
                  Networking
                </span>
              )}

            </div>

            {!isBreak && (
              <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-violet-600"
              >
                {expanded
                  ? "Less details"
                  : "View details"}

                {expanded ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            )}

          </div>

          {/* Title */}

          <h3 className="mt-3 max-w-4xl text-lg font-bold leading-6 text-slate-900 md:text-xl">
            {session.title}
          </h3>

          {/* Duration + Room */}

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">

            <span className="flex items-center gap-1.5">
              <Clock3
                size={14}
                className="text-violet-500"
              />
              {session.duration}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin
                size={14}
                className="text-violet-500"
              />
              {session.room}
            </span>

          </div>

          {/* Description */}

          <p
            className={`mt-4 text-sm leading-6 text-slate-600 ${
              !expanded && session.description.length > 190
                ? "line-clamp-2"
                : ""
            }`}
          >
            {session.description}
          </p>

          {/* Speakers */}

          {session.speakers.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">

              <div className="flex items-center gap-2">

                <Users
                  size={14}
                  className="text-violet-600"
                />

                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Speakers
                </span>

              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">

                {session.speakers.map((speaker) => (
                  <div
                    key={speaker.name}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5"
                  >

                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    <div className="min-w-0">

                      <p className="truncate text-xs font-bold text-slate-800">
                        {speaker.name}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-500">
                        {speaker.role}
                      </p>

                      <p className="truncate text-[10px] font-medium text-violet-600">
                        {speaker.organization}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}

          {/* Expanded scientific information */}

          <AnimatePresence>

            {expanded && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                className="overflow-hidden"
              >

                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">

                  <InfoBox
                    label="Session Time"
                    value={session.time}
                  />

                  <InfoBox
                    label="Duration"
                    value={session.duration}
                  />

                  <InfoBox
                    label="Venue"
                    value={session.room}
                  />

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </motion.article>
  );
};

// ============================================================
// PROGRAM STAT
// ============================================================

const ProgramStat = ({ value, label }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">

      <span className="text-xl font-bold text-white">
        {value}
      </span>

      <span className="text-xs font-medium text-white/50">
        {label}
      </span>

    </div>
  );
};

// ============================================================
// FILTER BUTTON
// ============================================================

const FilterButton = ({
  children,
  active,
  color = "#7C3AED",
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-xs font-semibold transition"
      style={{
        borderColor: active ? color : "#E2E8F0",
        backgroundColor: active
          ? `${color}12`
          : "#FFFFFF",
        color: active ? color : "#64748B",
      }}
    >
      {children}
    </button>
  );
};

// ============================================================
// INFO BOX
// ============================================================

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
};

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({ onClear }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600">
        <Search size={22} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No sessions found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        We couldn't find any sessions matching your current
        search or filter selection.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700"
      >
        Clear Filters
      </button>

    </div>
  );
};

export default ScientificProgram;