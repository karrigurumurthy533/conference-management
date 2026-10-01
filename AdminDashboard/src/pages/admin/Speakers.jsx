import React, { useEffect, useMemo, useState } from "react";
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
  Loader2,
} from "lucide-react";

import { getSpeakersApi, deleteSpeakerApi } from "../../api/speakerApis";

const Speakers = () => {
  const navigate = useNavigate();

  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [conferenceFilter, setConferenceFilter] = useState("All Conferences");

  const [statusFilter, setStatusFilter] = useState("All Status");

  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // =========================================================
  // GET ALL SPEAKERS
  // =========================================================

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSpeakersApi();

      const responseData = response?.data;

      const speakerData = responseData?.data || responseData?.speakers || [];

      setSpeakers(Array.isArray(speakerData) ? speakerData : []);
    } catch (error) {
      console.error("Get speakers error:", error);

      setError(error?.response?.data?.message || "Failed to load speakers");

      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  // =========================================================
  // CONFERENCE OPTIONS
  // =========================================================

  const conferences = useMemo(() => {
    const conferenceNames = speakers
      .map((speaker) => {
        if (speaker?.conferenceId && typeof speaker.conferenceId === "object") {
          return (
            speaker.conferenceId?.title || speaker.conferenceId?.name || ""
          );
        }

        return speaker?.conferenceName || "";
      })
      .filter(Boolean);

    return ["All Conferences", ...new Set(conferenceNames)];
  }, [speakers]);

  // =========================================================
  // GET CONFERENCE NAME
  // =========================================================

  const getConferenceName = (speaker) => {
    if (speaker?.conferenceId && typeof speaker.conferenceId === "object") {
      return (
        speaker.conferenceId?.title ||
        speaker.conferenceId?.name ||
        "Conference"
      );
    }

    return speaker?.conferenceName || "Conference";
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredSpeakers = useMemo(() => {
    return speakers.filter((speaker) => {
      const searchValue = search.toLowerCase().trim();

      const name = speaker?.fullName || "";

      const designation = speaker?.designation || "";

      const organization = speaker?.organization || "";

      const email = speaker?.email || "";

      const country = speaker?.country || "";

      const conference = getConferenceName(speaker);

      const matchesSearch =
        !searchValue ||
        name.toLowerCase().includes(searchValue) ||
        designation.toLowerCase().includes(searchValue) ||
        organization.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        country.toLowerCase().includes(searchValue);

      const matchesConference =
        conferenceFilter === "All Conferences" ||
        conference === conferenceFilter;

      const matchesStatus =
        statusFilter === "All Status" || speaker?.status === statusFilter;

      return matchesSearch && matchesConference && matchesStatus;
    });
  }, [speakers, search, conferenceFilter, statusFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSpeakers.length / itemsPerPage),
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedSpeakers = filteredSpeakers.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalSpeakers = speakers.length;

  const activeSpeakers = speakers.filter(
    (speaker) => speaker?.status === "Active",
  ).length;

  const inactiveSpeakers = speakers.filter(
    (speaker) => speaker?.status === "Inactive",
  ).length;

  const speakerTypes = new Set(
    speakers.map((speaker) => speaker?.speakerType).filter(Boolean),
  ).size;

  // =========================================================
  // INITIALS
  // =========================================================

  const getInitials = (name = "") => {
    return name
      .replace(/^Dr\.\s*/i, "")
      .replace(/^Prof\.\s*/i, "")
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-violet-50 text-violet-700 border-violet-100";

      case "Inactive":
        return "bg-gray-50 text-gray-600 border-gray-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  // =========================================================
  // FILTER CHANGE
  // =========================================================

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
    setOpenMenu(null);
  };

  // =========================================================
  // ADD SPEAKER
  // =========================================================

  const handleAddSpeaker = () => {
    navigate("/admin/speakers/add");
  };

  // =========================================================
  // VIEW SPEAKER
  // =========================================================

  const handleViewSpeaker = (id) => {
    setOpenMenu(null);

    navigate(`/admin/speakers/${id}`);
  };

  // =========================================================
  // EDIT SPEAKER
  // =========================================================

  const handleEditSpeaker = () => {
    setOpenMenu(null);

    navigate(`/admin/speakers/add`);
  };

  // =========================================================
  // CONTACT
  // =========================================================

  const handleContact = (email) => {
    setOpenMenu(null);

    if (!email) {
      return;
    }

    window.location.href = `mailto:${email}`;
  };

  // =========================================================
  // DELETE SPEAKER
  // =========================================================

  const handleDeleteSpeaker = async (speakerId) => {
    setOpenMenu(null);

    const confirmed = window.confirm(
      "Are you sure you want to delete this speaker?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(speakerId);
      setError("");

      await deleteSpeakerApi(speakerId);

      setSpeakers((previous) =>
        previous.filter((speaker) => speaker._id !== speakerId),
      );
    } catch (error) {
      console.error("Delete speaker error:", error);

      setError(error?.response?.data?.message || "Failed to delete speaker");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-w-0 w-full overflow-hidden space-y-3">
      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {/* TOTAL */}

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
              <Users size={18} className="text-violet-600" />
            </div>
          </div>
        </div>

        {/* ACTIVE */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Active Speakers
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {activeSpeakers}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <UserCheck size={18} className="text-violet-600" />
            </div>
          </div>
        </div>

        {/* INACTIVE */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Inactive Speakers
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {inactiveSpeakers}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <UserPlus size={18} className="text-violet-600" />
            </div>
          </div>
        </div>

        {/* SPEAKER TYPES */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Speaker Types
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {speakerTypes}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CalendarDays size={18} className="text-violet-600" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
          <p className="text-[11px] font-medium text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchSpeakers}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm">
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

          {/* CONFERENCE */}

          <select
            value={conferenceFilter}
            onChange={(e) =>
              handleFilterChange(setConferenceFilter, e.target.value)
            }
            className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-52"
          >
            {conferences.map((conference) => (
              <option key={conference} value={conference}>
                {conference}
              </option>
            ))}
          </select>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              handleFilterChange(setStatusFilter, e.target.value)
            }
            className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-36"
          >
            <option>All Status</option>

            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>
          </select>

          {/* ADD */}

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

        <div className="w-full overflow-visible">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="w-[23%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Speaker
                </th>

                <th className="w-[19%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Conference
                </th>

                <th className="w-[18%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Organization
                </th>

                <th className="w-[14%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="w-[12%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Speaker Type
                </th>

                <th className="w-[9%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="w-[5%] px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2
                        size={26}
                        className="animate-spin text-violet-600"
                      />

                      <p className="mt-2 text-[12px] font-medium text-gray-500">
                        Loading speakers...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedSpeakers.length > 0 ? (
                paginatedSpeakers.map((speaker) => {
                  const speakerId = speaker?._id;

                  const imageUrl = speaker?.imageUrl;

                  const conference = getConferenceName(speaker);

                  return (
                    <tr
                      key={speakerId}
                      className="border-b border-gray-50 transition hover:bg-violet-50/30"
                    >
                      {/* SPEAKER */}

                      <td className="px-3 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={speaker.fullName}
                              className="h-9 w-9 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
                              {getInitials(speaker.fullName)}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-semibold text-gray-800">
                              {speaker.fullName}
                            </p>

                            <div className="mt-0.5 flex items-center gap-1">
                              <BriefcaseBusiness
                                size={11}
                                className="shrink-0 text-violet-500"
                              />

                              <p className="truncate text-[10px] text-gray-500">
                                {speaker.designation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CONFERENCE */}

                      <td className="px-2 py-3">
                        <p
                          title={conference}
                          className="truncate text-[11px] font-medium text-gray-700"
                        >
                          {conference}
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
                            title={speaker.organization}
                            className="truncate text-[11px] text-gray-600"
                          >
                            {speaker.organization}
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

                      {/* SPEAKER TYPE */}

                      <td className="px-2 py-3">
                        <span className="inline-flex max-w-full truncate rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
                          {speaker.speakerType}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-2 py-3">
                        <span
                          className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                            speaker.status,
                          )}`}
                        >
                          {speaker.status}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td className="relative z-40 px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === speakerId ? null : speakerId,
                            )
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenu === speakerId && (
                          <div className="absolute bottom-11 right-3 z-50 w-32 rounded-lg border border-gray-100 bg-white p-1 text-left shadow-lg">
                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() => handleViewSpeaker(speakerId)}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                            >
                              <Eye size={13} />
                              View
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() => handleEditSpeaker(speakerId)}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                            >
                              <Pencil size={13} />
                              Edit
                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              disabled={deleteLoading === speakerId}
                              onClick={() => handleDeleteSpeaker(speakerId)}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deleteLoading === speakerId ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Trash2 size={13} />
                              )}
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={30} className="mb-2 text-violet-300" />

                      <p className="text-[12px] font-semibold text-gray-600">
                        No speakers found
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        Try changing your search or filters.
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
              {filteredSpeakers.length === 0
                ? 0
                : (safePage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(safePage * itemsPerPage, filteredSpeakers.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {filteredSpeakers.length}
            </span>{" "}
            speakers
          </p>

          <div className="flex items-center gap-1">
            {/* PREVIOUS */}

            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => index + 1,
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
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
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speakers;
