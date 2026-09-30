
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Users,
  UserCheck,
  UserPlus,
  CalendarDays,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  BriefcaseBusiness,
  X,
} from "lucide-react";

const Speakers = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [conferenceFilter, setConferenceFilter] =
    useState("All Conferences");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const speakers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Clinical Psychologist",
      organization: "Global Mental Health Institute",
      email: "sarah.johnson@example.com",
      conference: "Mental Health & Psychiatry",
      country: "United States",
      sessions: 3,
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "Endocrinologist",
      organization: "International Diabetes Center",
      email: "michael.chen@example.com",
      conference: "Endocrine & Metabolic Innovation",
      country: "Singapore",
      sessions: 2,
      status: "Confirmed",
    },
    {
      id: 3,
      name: "Dr. Priya Sharma",
      role: "Nutrition Scientist",
      organization: "National Nutrition Research Center",
      email: "priya.sharma@example.com",
      conference: "Food, Nutrition & Wellness",
      country: "India",
      sessions: 2,
      status: "Confirmed",
    },
    {
      id: 4,
      name: "Prof. James Wilson",
      role: "Cancer Researcher",
      organization: "Global Oncology Institute",
      email: "james.wilson@example.com",
      conference: "Oncology Research & AI Innovations",
      country: "United Kingdom",
      sessions: 4,
      status: "Pending",
    },
    {
      id: 5,
      name: "Dr. Ananya Rao",
      role: "Neuroscientist",
      organization: "Advanced Autism Research Center",
      email: "ananya.rao@example.com",
      conference: "Autism Research & Innovations",
      country: "India",
      sessions: 3,
      status: "Confirmed",
    },
    {
      id: 6,
      name: "Dr. Robert Anderson",
      role: "Cardiologist",
      organization: "Heart & Vascular Institute",
      email: "robert.anderson@example.com",
      conference: "Heart & Cardiovascular Diseases",
      country: "Canada",
      sessions: 2,
      status: "Confirmed",
    },
    {
      id: 7,
      name: "Dr. Emily Davis",
      role: "Digital Psychiatry Expert",
      organization: "AI Health Research Lab",
      email: "emily.davis@example.com",
      conference: "AI & Digital Psychiatry",
      country: "Australia",
      sessions: 3,
      status: "Pending",
    },
    {
      id: 8,
      name: "Dr. Vikram Reddy",
      role: "Healthcare Innovation Lead",
      organization: "Precision Medicine Alliance",
      email: "vikram.reddy@example.com",
      conference:
        "Healthcare Innovation & Precision Medicine",
      country: "India",
      sessions: 2,
      status: "Confirmed",
    },
    {
      id: 9,
      name: "Dr. Lisa Brown",
      role: "Public Health Specialist",
      organization: "Global Health Foundation",
      email: "lisa.brown@example.com",
      conference: "Mental Health & Psychiatry",
      country: "United States",
      sessions: 2,
      status: "Invited",
    },
    {
      id: 10,
      name: "Prof. Daniel Miller",
      role: "Medical AI Researcher",
      organization: "Institute of Medical Technology",
      email: "daniel.miller@example.com",
      conference:
        "Oncology Research & AI Innovations",
      country: "Germany",
      sessions: 3,
      status: "Confirmed",
    },
  ];

  const conferences = [
    "All Conferences",
    ...new Set(
      speakers.map(
        (speaker) => speaker.conference
      )
    ),
  ];

  const filteredSpeakers = useMemo(() => {
    return speakers.filter((speaker) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        speaker.name
          .toLowerCase()
          .includes(searchValue) ||
        speaker.role
          .toLowerCase()
          .includes(searchValue) ||
        speaker.organization
          .toLowerCase()
          .includes(searchValue) ||
        speaker.email
          .toLowerCase()
          .includes(searchValue);

      const matchesConference =
        conferenceFilter === "All Conferences" ||
        speaker.conference === conferenceFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        speaker.status === statusFilter;

      return (
        matchesSearch &&
        matchesConference &&
        matchesStatus
      );
    });
  }, [
    search,
    conferenceFilter,
    statusFilter,
  ]);

  const itemsPerPage = 6;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredSpeakers.length /
        itemsPerPage
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedSpeakers =
    filteredSpeakers.slice(
      (safePage - 1) * itemsPerPage,
      safePage * itemsPerPage
    );

  const totalSpeakers = speakers.length;

  const confirmedSpeakers =
    speakers.filter(
      (speaker) =>
        speaker.status === "Confirmed"
    ).length;

  const pendingSpeakers =
    speakers.filter(
      (speaker) =>
        speaker.status === "Pending"
    ).length;

  const totalSessions =
    speakers.reduce(
      (total, speaker) =>
        total + speaker.sessions,
      0
    );

  const getInitials = (name) => {
    return name
      .replace("Dr. ", "")
      .replace("Prof. ", "")
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-violet-50 text-violet-700 border-violet-100";

      case "Pending":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "Invited":
        return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const handleFilterChange = (
    setter,
    value
  ) => {
    setter(value);
    setCurrentPage(1);
    setOpenMenu(null);
  };

  // =====================================================
  // ADD SPEAKER NAVIGATION
  // =====================================================

  const handleAddSpeaker = () => {
    navigate("/admin/speakers/add");
  };

  return (
    <div className="min-w-0 w-full overflow-hidden space-y-3">

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

        {/* TOTAL SPEAKERS */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Total Speakers
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {totalSpeakers}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Users
                size={18}
                className="text-violet-600"
              />
            </div>

          </div>
        </div>

        {/* CONFIRMED */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Confirmed Speakers
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {confirmedSpeakers}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <UserCheck
                size={18}
                className="text-violet-600"
              />
            </div>

          </div>
        </div>

        {/* PENDING */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Pending Invitations
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {pendingSpeakers}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <UserPlus
                size={18}
                className="text-violet-600"
              />
            </div>

          </div>
        </div>

        {/* SESSIONS */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Total Sessions
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {totalSessions}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CalendarDays
                size={18}
                className="text-violet-600"
              />
            </div>

          </div>
        </div>

      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* FILTER BAR */}

        <div className="flex flex-col gap-2.5 border-b border-gray-100 p-3.5 lg:flex-row lg:items-center">

          {/* SEARCH */}

          <div className="relative min-w-0 flex-1">

            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search speakers..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600"
              >
                <X size={14} />
              </button>
            )}

          </div>

          {/* CONFERENCE FILTER */}

          <select
            value={conferenceFilter}
            onChange={(e) =>
              handleFilterChange(
                setConferenceFilter,
                e.target.value
              )
            }
            className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-52"
          >
            {conferences.map(
              (conference) => (
                <option
                  key={conference}
                  value={conference}
                >
                  {conference}
                </option>
              )
            )}
          </select>

          {/* STATUS FILTER */}

          <select
            value={statusFilter}
            onChange={(e) =>
              handleFilterChange(
                setStatusFilter,
                e.target.value
              )
            }
            className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-36"
          >
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Invited</option>
          </select>

          {/* ADD SPEAKER */}

          <button
            type="button"
            onClick={handleAddSpeaker}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[11px] font-semibold text-white transition hover:bg-violet-700"
          >
            <UserPlus size={14} />
            Add Speaker
          </button>

        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="w-full overflow-hidden">

          <table className="w-full table-fixed">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">

                <th className="w-[21%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Speaker
                </th>

                <th className="w-[20%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Conference
                </th>

                <th className="w-[19%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Organization
                </th>

                <th className="w-[14%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="w-[8%] px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Sessions
                </th>

                <th className="w-[11%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="w-[7%] px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {paginatedSpeakers.length > 0 ? (
                paginatedSpeakers.map(
                  (speaker) => (
                    <tr
                      key={speaker.id}
                      className="border-b border-gray-50 transition hover:bg-violet-50/30"
                    >

                      {/* SPEAKER */}

                      <td className="px-3 py-3">

                        <div className="flex min-w-0 items-center gap-2.5">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
                            {getInitials(
                              speaker.name
                            )}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-[12px] font-semibold text-gray-800">
                              {speaker.name}
                            </p>

                            <div className="mt-0.5 flex items-center gap-1">

                              <BriefcaseBusiness
                                size={11}
                                className="shrink-0 text-violet-500"
                              />

                              <p className="truncate text-[10px] text-gray-500">
                                {speaker.role}
                              </p>

                            </div>

                          </div>

                        </div>

                      </td>

                      {/* CONFERENCE */}

                      <td className="px-2 py-3">

                        <p
                          title={
                            speaker.conference
                          }
                          className="truncate text-[11px] font-medium text-gray-700"
                        >
                          {speaker.conference}
                        </p>

                      </td>

                      {/* ORGANIZATION */}

                      <td className="px-2 py-3">

                        <div className="flex min-w-0 items-center gap-1.5">

                          <BriefcaseBusiness
                            size={11}
                            className="shrink-0 text-violet-500"
                          />

                          <p
                            title={
                              speaker.organization
                            }
                            className="truncate text-[11px] text-gray-600"
                          >
                            {
                              speaker.organization
                            }
                          </p>

                        </div>

                      </td>

                      {/* LOCATION */}

                      <td className="px-2 py-3">

                        <div className="flex items-center gap-1.5">

                          <MapPin
                            size={11}
                            className="shrink-0 text-violet-500"
                          />

                          <span className="truncate text-[11px] text-gray-600">
                            {speaker.country}
                          </span>

                        </div>

                      </td>

                      {/* SESSIONS */}

                      <td className="px-2 py-3 text-center">

                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-violet-50 px-1.5 text-[11px] font-semibold text-violet-700">
                          {speaker.sessions}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-2 py-3">

                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                            speaker.status
                          )}`}
                        >
                          {speaker.status}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="relative px-2 py-3 text-center">

                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu ===
                                speaker.id
                                ? null
                                : speaker.id
                            )
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                        >
                          <MoreVertical
                            size={16}
                          />
                        </button>

                        {openMenu ===
                          speaker.id && (
                          <div className="absolute right-3 top-11 z-30 w-34 rounded-lg border border-gray-100 bg-white p-1 text-left shadow-lg">

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  null
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                            >
                              <Eye
                                size={13}
                              />
                              View
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  null
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                            >
                              <Pencil
                                size={13}
                              />
                              Edit
                            </button>

                            {/* CONTACT */}

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  null
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                            >
                              <Mail
                                size={13}
                              />
                              Contact
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  null
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                            >
                              <Trash2
                                size={13}
                              />
                              Delete
                            </button>

                          </div>
                        )}

                      </td>

                    </tr>
                  )
                )
              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center"
                  >

                    <div className="flex flex-col items-center justify-center">

                      <Users
                        size={30}
                        className="mb-2 text-violet-300"
                      />

                      <p className="text-[12px] font-semibold text-gray-600">
                        No speakers found
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        Try changing your
                        search or filters.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div className="flex items-center justify-between border-t border-gray-100 px-3.5 py-3">

          <p className="text-[11px] text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-700">
              {filteredSpeakers.length ===
              0
                ? 0
                : (safePage - 1) *
                    itemsPerPage +
                  1}
            </span>

            {" "}to{" "}

            <span className="font-semibold text-gray-700">
              {Math.min(
                safePage *
                  itemsPerPage,
                filteredSpeakers.length
              )}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-gray-700">
              {filteredSpeakers.length}
            </span>

            {" "}speakers

          </p>

          <div className="flex items-center gap-1">

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft
                size={15}
              />
            </button>

            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (

              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                  safePage === page
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                {page}
              </button>

            ))}

            {/* NEXT */}

            <button
              type="button"
              disabled={
                safePage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight
                size={15}
              />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Speakers;
