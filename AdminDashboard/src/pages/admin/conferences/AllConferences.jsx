
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  FileText,
  Lock,
  Layers3,
  X,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getConferences,
  deleteConference,
  publishConference,
  updateConference,
} from "../../../redux/conferenceSlice";

const AllConferences = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    conferences,
    loading,
    error,
    deleteLoading,
    publishLoading,
    updateLoading,
  } = useSelector((state) => state.conference);

  const [openAction, setOpenAction] = useState(null);
  const [actionPosition, setActionPosition] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmation, setConfirmation] = useState(null);

  const actionButtonRefs = useRef({});

  const itemsPerPage = 10;
  const maxVisiblePages = 20;

  useEffect(() => {
    dispatch(getConferences());
  }, [dispatch]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".conference-action-menu") &&
        !event.target.closest(".conference-action-button")
      ) {
        setOpenAction(null);
        setActionPosition(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const sortedConferences = useMemo(() => {
    if (!Array.isArray(conferences)) {
      return [];
    }

    return [...conferences].sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.updatedAt || a.startDate || 0,
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.updatedAt || b.startDate || 0,
      ).getTime();

      return dateB - dateA;
    });
  }, [conferences]);

  const conferenceStats = useMemo(() => {
    const total = sortedConferences.length;

    const published = sortedConferences.filter(
      (conference) => conference.status === "Published",
    ).length;

    const draft = sortedConferences.filter(
      (conference) => conference.status === "Draft",
    ).length;

    const closed = sortedConferences.filter(
      (conference) => conference.status === "Closed",
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = sortedConferences.filter((conference) => {
      if (!conference.startDate) {
        return false;
      }

      const startDate = new Date(conference.startDate);

      if (Number.isNaN(startDate.getTime())) {
        return false;
      }

      startDate.setHours(0, 0, 0, 0);

      return (
        startDate >= today &&
        conference.status !== "Closed" &&
        conference.status !== "Archived"
      );
    }).length;

    return {
      total,
      published,
      draft,
      closed,
      upcoming,
    };
  }, [sortedConferences]);

  const totalPages = Math.max(
    1,
    Math.min(
      maxVisiblePages,
      Math.ceil(sortedConferences.length / itemsPerPage),
    ),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentConferences = sortedConferences.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const formatDate = (conference) => {
    if (conference.startDate && conference.endDate) {
      const start = new Date(conference.startDate);
      const end = new Date(conference.endDate);

      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        const startMonth = start.toLocaleString("en-US", {
          month: "short",
        });

        const endMonth = end.toLocaleString("en-US", {
          month: "short",
        });

        const startDay = start.getDate();
        const endDay = end.getDate();

        const startYear = start.getFullYear();
        const endYear = end.getFullYear();

        if (startYear === endYear) {
          if (startMonth === endMonth) {
            return `${startMonth} ${startDay}–${endDay}, ${startYear}`;
          }

          return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
        }

        return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
      }
    }

    if (conference.date) {
      return conference.date;
    }

    return "Date not available";
  };

  const getRegistrationCount = (conference) => {
    if (typeof conference.registrations === "number") {
      return conference.registrations;
    }

    if (typeof conference.registrationCount === "number") {
      return conference.registrationCount;
    }

    if (typeof conference.totalRegistrations === "number") {
      return conference.totalRegistrations;
    }

    return 0;
  };

  const getConferenceId = (conference) => {
    return conference?._id;
  };

  const goToDetails = (conference) => {
    const conferenceId = getConferenceId(conference);

    if (!conferenceId) {
      console.error("MongoDB conference _id is missing:", conference);
      return;
    }

    setOpenAction(null);
    setActionPosition(null);

    navigate(`/admin/conferences/${conferenceId}`);
  };

 const goToEdit = (conference) => {
  const conferenceId = getConferenceId(conference);

  if (!conferenceId) {
    console.error("MongoDB conference _id is missing:", conference);
    return;
  }

  setOpenAction(null);
  setActionPosition(null);

  navigate(`/admin/conferences/create/${conferenceId}`);
};

  const openConfirmation = (conference, type) => {
    setOpenAction(null);
    setActionPosition(null);

    setConfirmation({
      conference,
      type,
    });
  };

  const closeConfirmation = () => {
    if (deleteLoading || publishLoading || updateLoading) {
      return;
    }

    setConfirmation(null);
  };

  const confirmAction = async () => {
    if (!confirmation?.conference) {
      return;
    }

    const conference = confirmation.conference;
    const type = confirmation.type;
    const conferenceId = getConferenceId(conference);

    if (!conferenceId) {
      console.error("MongoDB conference _id is missing:", conference);
      return;
    }

    try {
      if (type === "publish") {
        await dispatch(
          publishConference(conferenceId),
        ).unwrap();
      }

      if (type === "close") {
        await dispatch(
          updateConference({
            id: conferenceId,
            formData: {
              status: "Closed",
            },
          }),
        ).unwrap();
      }

      if (type === "delete") {
        await dispatch(
          deleteConference(conferenceId),
        ).unwrap();

        if (currentPage > 1 && currentConferences.length === 1) {
          setCurrentPage((previousPage) => previousPage - 1);
        }
      }

      setConfirmation(null);
    } catch (actionError) {
      console.error(`${type} conference failed:`, actionError);
    }
  };

  const toggleActionMenu = (event, conference) => {
    event.stopPropagation();

    const conferenceId = getConferenceId(conference);

    if (!conferenceId) {
      console.error("MongoDB conference _id is missing:", conference);
      return;
    }

    if (openAction === conferenceId) {
      setOpenAction(null);
      setActionPosition(null);
      return;
    }

    const button = actionButtonRefs.current[conferenceId];

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();

    const menuWidth = 180;
    const menuHeight = 220;
    const spacing = 8;

    let left = rect.right - menuWidth;
    let top = rect.bottom + spacing;

    if (left < 10) {
      left = 10;
    }

    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    if (top + menuHeight > window.innerHeight - 10) {
      top = rect.top - menuHeight - spacing;
    }

    if (top < 10) {
      top = 10;
    }

    setActionPosition({
      top,
      left,
    });

    setOpenAction(conferenceId);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Published":
        return "bg-emerald-50 text-emerald-600";

      case "Draft":
        return "bg-amber-50 text-amber-600";

      case "Closed":
        return "bg-slate-100 text-slate-500";

      case "Archived":
        return "bg-red-50 text-red-500";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const statCards = [
    {
      title: "Total Conferences",
      value: conferenceStats.total,
      icon: Layers3,
      description: "All conferences",
    },
    {
      title: "Published",
      value: conferenceStats.published,
      icon: CheckCircle2,
      description: "Live conferences",
    },
    {
      title: "Draft",
      value: conferenceStats.draft,
      icon: FileText,
      description: "Unpublished conferences",
    },
    {
      title: "Closed",
      value: conferenceStats.closed,
      icon: Lock,
      description: "Closed conferences",
    },
    {
      title: "Upcoming",
      value: conferenceStats.upcoming,
      icon: CalendarDays,
      description: "Upcoming events",
    },
  ];

  const isConfirmationLoading =
    deleteLoading || publishLoading || updateLoading;

  const confirmationTitle = {
    publish: "Publish Conference?",
    close: "Close Conference?",
    delete: "Delete Conference?",
  };

  const confirmationDescription = {
    publish:
      "Are you sure you want to publish this conference? It will become visible as a published conference.",
    close:
      "Are you sure you want to close this conference? This action will change the conference status to Closed.",
    delete:
      "Are you sure you want to delete this conference? This action cannot be undone.",
  };

  const confirmationButton = {
    publish: "Yes, Publish",
    close: "Yes, Close",
    delete: "Yes, Delete",
  };

  return (
    <div className="relative w-full min-w-0">
      <div className="animate-[fadeIn_0.35s_ease-out]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[23px] font-bold leading-tight text-gray-900">
              All Conferences
            </h1>

            <p className="mt-0.5 text-[13px] text-gray-500">
              Manage all GlobalScion conferences.
            </p>
          </div>

          <Link
            to="/admin/conferences/create"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[12px] font-semibold text-white transition duration-200 hover:bg-violet-700"
          >
            <Plus size={15} />
            New Conference
          </Link>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
                className="animate-[fadeUp_0.4s_ease-out_both] rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_5px_18px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-gray-500">
                      {card.title}
                    </p>

                    <p className="mt-1 text-[22px] font-bold leading-none text-gray-900">
                      {card.value}
                    </p>

                    <p className="mt-1.5 truncate text-[10px] text-gray-400">
                      {card.description}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className="text-violet-600"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-[800px] table-fixed">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="w-[38%] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Conference
                  </th>

                  <th className="w-[20%] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="w-[17%] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Registrations
                  </th>

                  <th className="w-[17%] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="w-[8%] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-14 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-violet-100 border-t-violet-600" />

                        <p className="mt-3 text-[13px] font-medium text-gray-500">
                          Loading conferences...
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          Please wait while we load the conference list.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <p className="text-[13px] font-medium text-red-500">
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={() => dispatch(getConferences())}
                        className="mt-3 rounded-lg bg-violet-600 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-violet-700"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : currentConferences.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <p className="text-[13px] font-medium text-gray-500">
                        No conferences found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentConferences.map((conference, index) => {
                    const conferenceId = getConferenceId(conference);

                    return (
                      <tr
                        key={conferenceId}
                        onClick={() => goToDetails(conference)}
                        style={{
                          animationDelay: `${index * 45}ms`,
                        }}
                        className="animate-[fadeUp_0.35s_ease-out_both] cursor-pointer border-b border-gray-100 last:border-0 transition duration-200 hover:bg-violet-50/30"
                      >
                        <td className="px-4 py-3">
                          <p
                            title={conference.title}
                            className="truncate text-[13px] font-semibold text-gray-800"
                          >
                            {conference.title}
                          </p>
                        </td>

                        <td className="px-3 py-3">
                          <span className="text-[12px] text-gray-500">
                            {formatDate(conference)}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <span className="text-[12px] font-semibold text-gray-700">
                            {getRegistrationCount(conference)}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                              conference.status,
                            )}`}
                          >
                            {conference.status || "Draft"}
                          </span>
                        </td>

                        <td
                          className="px-3 py-3"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          <div className="flex justify-center">
                            <button
                              ref={(element) => {
                                actionButtonRefs.current[conferenceId] =
                                  element;
                              }}
                              type="button"
                              onClick={(event) =>
                                toggleActionMenu(event, conference)
                              }
                              className="conference-action-button flex h-8 w-8 items-center justify-center rounded-md text-violet-500 transition duration-200 hover:bg-violet-50 hover:text-violet-700"
                            >
                              <MoreVertical size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-[11px] text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {sortedConferences.length === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-700">
                {Math.min(
                  startIndex + itemsPerPage,
                  sortedConferences.length,
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {sortedConferences.length}
              </span>
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setOpenAction(null);
                  setActionPosition(null);

                  setCurrentPage(
                    (previousPage) => previousPage - 1,
                  );
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => index + 1,
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    setOpenAction(null);
                    setActionPosition(null);
                    setCurrentPage(page);
                  }}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                    currentPage === page
                      ? "bg-violet-600 text-white"
                      : "border border-gray-200 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setOpenAction(null);
                  setActionPosition(null);

                  setCurrentPage(
                    (previousPage) => previousPage + 1,
                  );
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {openAction && actionPosition && (
        <div
          className="conference-action-menu fixed z-[99999] w-[180px] rounded-xl border border-gray-100 bg-white p-1.5 shadow-[0_14px_40px_rgba(15,23,42,0.18)] animate-[menuIn_0.16s_ease-out]"
          style={{
            top: `${actionPosition.top}px`,
            left: `${actionPosition.left}px`,
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {(() => {
            const conference = sortedConferences.find(
              (item) => getConferenceId(item) === openAction,
            );

            if (!conference) {
              return null;
            }

            const isPublishing =
              publishLoading &&
              confirmation?.conference &&
              getConferenceId(confirmation.conference) ===
                getConferenceId(conference);

            const isUpdating =
              updateLoading &&
              confirmation?.conference &&
              getConferenceId(confirmation.conference) ===
                getConferenceId(conference);

            return (
              <>
                <button
                  type="button"
                  onClick={() => goToDetails(conference)}
                  className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                >
                  <Eye size={14} className="text-violet-600" />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => goToEdit(conference)}
                  className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                >
                  <Pencil size={14} className="text-violet-600" />
                  Edit
                </button>

                <button
                  type="button"
                  disabled={
                    publishLoading ||
                    conference.status === "Published"
                  }
                  onClick={() =>
                    openConfirmation(conference, "publish")
                  }
                  className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCircle2
                    size={14}
                    className="text-violet-600"
                  />

                  {isPublishing ? "Publishing..." : "Publish"}
                </button>

                <button
                  type="button"
                  disabled={
                    updateLoading ||
                    conference.status === "Closed"
                  }
                  onClick={() =>
                    openConfirmation(conference, "close")
                  }
                  className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Lock size={14} className="text-violet-600" />

                  {isUpdating ? "Closing..." : "Close"}
                </button>

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() =>
                    openConfirmation(conference, "delete")
                  }
                  className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </>
            );
          })()}
        </div>
      )}

      {confirmation && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px] animate-[fadeIn_0.15s_ease-out]"
          onClick={closeConfirmation}
        >
          <div
            className="w-full max-w-[400px] rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.25)] animate-[modalIn_0.2s_ease-out]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  confirmation.type === "delete"
                    ? "bg-red-50"
                    : "bg-violet-50"
                }`}
              >
                <AlertTriangle
                  size={19}
                  className={
                    confirmation.type === "delete"
                      ? "text-red-500"
                      : "text-violet-600"
                  }
                />
              </div>

              <button
                type="button"
                onClick={closeConfirmation}
                disabled={isConfirmationLoading}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-[16px] font-bold text-gray-900">
                {confirmationTitle[confirmation.type]}
              </h2>

              <p className="mt-1.5 text-[12px] leading-5 text-gray-500">
                {confirmationDescription[confirmation.type]}
              </p>

              {confirmation.conference?.title && (
                <div className="mt-3 rounded-lg bg-violet-50 px-3 py-2.5">
                  <p className="truncate text-[12px] font-semibold text-violet-700">
                    {confirmation.conference.title}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={isConfirmationLoading}
                onClick={closeConfirmation}
                className="h-9 rounded-lg border border-gray-200 px-4 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isConfirmationLoading}
                onClick={confirmAction}
                className={`h-9 rounded-lg px-4 text-[12px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  confirmation.type === "delete"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-violet-600 hover:bg-violet-700"
                }`}
              >
                {isConfirmationLoading
                  ? confirmation.type === "delete"
                    ? "Deleting..."
                    : confirmation.type === "publish"
                      ? "Publishing..."
                      : "Closing..."
                  : confirmationButton[confirmation.type]}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes menuIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AllConferences;
