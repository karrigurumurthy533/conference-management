import React, { useState } from "react";
import {
  Plus,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AllConferences = () => {
  const navigate = useNavigate();

  // =========================================================
  // CONFERENCES DATA
  // =========================================================

  const [conferences, setConferences] = useState([
    {
      id: 1,
      title: "Mental Health & Psychiatry",
      date: "Sep 17–18, 2026",
      status: "Published",
      registrations: 342,
    },
    {
      id: 2,
      title: "Endocrine & Metabolic Innovation",
      date: "Oct 08–09, 2026",
      status: "Draft",
      registrations: 268,
    },
    {
      id: 3,
      title: "Food, Nutrition & Wellness",
      date: "Sep 17–18, 2026",
      status: "Published",
      registrations: 223,
    },
    {
      id: 4,
      title: "Oncology Research & AI Innovations",
      date: "Nov 12–13, 2026",
      status: "Published",
      registrations: 187,
    },
    {
      id: 5,
      title: "Healthcare Innovation & Precision Medicine",
      date: "Dec 03–04, 2026",
      status: "Draft",
      registrations: 156,
    },
    {
      id: 6,
      title: "AI & Digital Psychiatry",
      date: "Jan 14–15, 2027",
      status: "Closed",
      registrations: 421,
    },
    {
      id: 7,
      title: "Autism Research & Innovations",
      date: "Apr 06–07, 2027",
      status: "Published",
      registrations: 298,
    },
    {
      id: 8,
      title: "Heart & Cardiovascular Diseases",
      date: "May 20–21, 2027",
      status: "Draft",
      registrations: 112,
    },
    {
      id: 9,
      title: "Food Science & Global Wellness",
      date: "Jun 10–11, 2027",
      status: "Published",
      registrations: 204,
    },
    {
      id: 10,
      title: "Global Medical Technology Summit",
      date: "Jul 22–23, 2027",
      status: "Draft",
      registrations: 98,
    },
  ]);

  // =========================================================
  // STATES
  // =========================================================

  const [openAction, setOpenAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    conferences.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentConferences = conferences.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // =========================================================
  // STATUS UPDATE
  // =========================================================

  const updateStatus = (id, status) => {
    setConferences((prev) =>
      prev.map((conference) =>
        conference.id === id
          ? {
              ...conference,
              status,
            }
          : conference
      )
    );

    setOpenAction(null);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const deleteConference = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conference?"
    );

    if (!confirmed) return;

    setConferences((prev) =>
      prev.filter(
        (conference) => conference.id !== id
      )
    );

    setOpenAction(null);

    // Keep pagination valid
    const remainingItems = conferences.length - 1;
    const newTotalPages = Math.max(
      1,
      Math.ceil(remainingItems / itemsPerPage)
    );

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Published":
        return "bg-emerald-50 text-emerald-600";

      case "Draft":
        return "bg-amber-50 text-amber-600";

      case "Closed":
        return "bg-slate-100 text-slate-500";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  // =========================================================
  // ACTION POPUP
  // =========================================================

  const ActionMenu = ({ conference }) => {
    return (
      <div className="absolute right-0 top-8 z-50 w-[145px] rounded-lg border border-gray-100 bg-white p-1 shadow-[0_8px_25px_rgba(15,23,42,0.12)]">
        {/* VIEW */}

        <button
          type="button"
          onClick={() => {
            setOpenAction(null);

            navigate(
              `/admin/conferences/${conference.id}`
            );
          }}
          className="flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-gray-50 hover:text-purple-600"
        >
          <Eye size={14} />
          View
        </button>

        {/* PUBLISH */}

        <button
          type="button"
          onClick={() =>
            updateStatus(
              conference.id,
              "Published"
            )
          }
          className="flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-600"
        >
          <CheckCircle2 size={14} />
          Publish
        </button>

        {/* CLOSE */}

        <button
          type="button"
          onClick={() =>
            updateStatus(
              conference.id,
              "Closed"
            )
          }
          className="flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-amber-50 hover:text-amber-600"
        >
          <XCircle size={14} />
          Close
        </button>

        {/* DELETE */}

        <button
          type="button"
          onClick={() =>
            deleteConference(conference.id)
          }
          className="flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-left text-[11px] font-medium text-red-500 transition hover:bg-red-50"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    );
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="w-full min-w-0">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] font-bold leading-tight text-gray-900">
            All Conferences
          </h1>

          <p className="mt-0.5 text-[12px] text-gray-500">
            Manage all GlobalScion conferences.
          </p>
        </div>

        <Link
          to="/admin/conferences/create"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-purple-600 px-3 text-[11px] font-semibold text-white transition hover:bg-purple-700"
        >
          <Plus size={15} />
          New Conference
        </Link>
      </div>

      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <table className="w-full table-fixed">
          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="w-[38%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Conference
              </th>

              <th className="w-[20%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Date
              </th>

              <th className="w-[17%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Registrations
              </th>

              <th className="w-[17%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="w-[8%] px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          {/* =================================================
              TABLE BODY
          ================================================= */}

          <tbody>
            {currentConferences.map(
              (conference) => (
                <tr
                  key={conference.id}
                  className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50/60"
                >
                  {/* CONFERENCE */}

                  <td className="px-4 py-3">
                    <p
                      title={conference.title}
                      className="truncate text-[12px] font-semibold text-gray-800"
                    >
                      {conference.title}
                    </p>
                  </td>

                  {/* DATE */}

                  <td className="px-3 py-3">
                    <span className="text-[11px] text-gray-500">
                      {conference.date}
                    </span>
                  </td>

                  {/* REGISTRATIONS */}

                  <td className="px-3 py-3">
                    <span className="text-[11px] font-semibold text-gray-700">
                      {conference.registrations}
                    </span>
                  </td>

                  {/* STATUS */}

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${getStatusStyle(
                        conference.status
                      )}`}
                    >
                      {conference.status}
                    </span>
                  </td>

                  {/* ACTION */}

                  <td className="px-3 py-3">
                    <div className="relative flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAction(
                            openAction ===
                              conference.id
                              ? null
                              : conference.id
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-purple-600"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openAction ===
                        conference.id && (
                        <ActionMenu
                          conference={
                            conference
                          }
                        />
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}

            {/* EMPTY STATE */}

            {currentConferences.length ===
              0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center"
                >
                  <p className="text-[12px] font-medium text-gray-500">
                    No conferences found.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
          {/* LEFT */}

          <p className="text-[10px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {conferences.length === 0
                ? 0
                : startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                startIndex + itemsPerPage,
                conferences.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {conferences.length}
            </span>
          </p>

          {/* RIGHT */}

          <div className="flex items-center gap-1">
            {/* PREVIOUS */}

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (prev) => prev - 1
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            {/* PAGE NUMBERS */}

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[10px] font-semibold transition ${
                  currentPage === page
                    ? "bg-purple-600 text-white"
                    : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* NEXT */}

            <button
              type="button"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (prev) => prev + 1
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllConferences;