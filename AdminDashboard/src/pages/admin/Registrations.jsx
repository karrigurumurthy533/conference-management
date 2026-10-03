import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  Users,
  CalendarDays,
  TrendingUp,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Trash2,
} from "lucide-react";

import {
  getAllRegistrations,
  deleteRegistration,
} from "../../redux/registrationsSlice";

const Registrations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ============================================================
     REDUX
  ============================================================ */

  const {
    registrations: registrationData = [],
    loading,
    deleteLoading,
    error,
  } = useSelector(
    (state) => state.registrations || {}
  );

  /* ============================================================
     STATE
  ============================================================ */

  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);

  const itemsPerPage = 6;

  /* ============================================================
     NORMALIZE REGISTRATION DATA
  ============================================================ */

  const registrationsList = useMemo(() => {
    if (Array.isArray(registrationData)) {
      return registrationData;
    }

    if (
      Array.isArray(
        registrationData?.data
      )
    ) {
      return registrationData.data;
    }

    if (
      Array.isArray(
        registrationData?.registrations
      )
    ) {
      return registrationData.registrations;
    }

    return [];
  }, [registrationData]);

  /* ============================================================
     FETCH ALL REGISTRATIONS
  ============================================================ */

  useEffect(() => {
    dispatch(getAllRegistrations());
  }, [dispatch]);

  /* ============================================================
     EXTRACT ID
  ============================================================ */

  const extractId = (value) => {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (value?._id) {
      return String(value._id);
    }

    if (value?.id) {
      return String(value.id);
    }

    return "";
  };

  /* ============================================================
     GET CONFERENCE ID
  ============================================================ */

  const getConferenceId = (
    registration
  ) => {
    const possibleIds = [
      registration?.conference
        ?.conferenceId?._id,

      registration?.conference
        ?.conferenceId?.id,

      registration?.conference
        ?.conferenceId,

      registration?.conference?._id,

      registration?.conference?.id,

      registration?.conferenceId?._id,

      registration?.conferenceId?.id,

      registration?.conferenceId,

      registration?.conferenceID,

      registration?.conference_id,
    ];

    for (const value of possibleIds) {
      const id = extractId(value);

      if (id) {
        return id;
      }
    }

    return "";
  };

  /* ============================================================
     GET CONFERENCE TITLE
  ============================================================ */

  const getConferenceTitle = (
    registration
  ) => {
    return (
      registration?.conference
        ?.conferenceId?.title ||

      registration?.conference?.title ||

      registration?.conference?.name ||

      registration?.conference
        ?.conferenceTitle ||

      registration?.conferenceTitle ||

      "Unknown Conference"
    );
  };

  /* ============================================================
     FORMAT CONFERENCE DATE
  ============================================================ */

  const formatConferenceDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "";
    }

    /* ----------------------------------------------------------
       ARRAY DATE SUPPORT
    ---------------------------------------------------------- */

    if (Array.isArray(dateValue)) {
      if (dateValue.length === 0) {
        return "";
      }

      const formattedDates = dateValue
        .map((date) =>
          formatConferenceDate(date)
        )
        .filter(Boolean);

      return formattedDates.join(" – ");
    }

    /* ----------------------------------------------------------
       OBJECT DATE SUPPORT
    ---------------------------------------------------------- */

    if (
      typeof dateValue === "object"
    ) {
      const startDate =
        dateValue?.startDate ||
        dateValue?.start ||
        dateValue?.from;

      const endDate =
        dateValue?.endDate ||
        dateValue?.end ||
        dateValue?.to;

      if (
        startDate &&
        endDate
      ) {
        return formatConferenceDate(
          `${startDate} - ${endDate}`
        );
      }

      if (startDate) {
        return formatConferenceDate(
          startDate
        );
      }

      return "";
    }

    const value =
      String(dateValue).trim();

    if (!value) {
      return "";
    }

    /* ----------------------------------------------------------
       API FORMAT

       2027-04-06T00:00:00.000Z -
       2027-04-07T00:00:00.000Z
    ---------------------------------------------------------- */

    if (value.includes(" - ")) {
      const [
        startRaw,
        endRaw,
      ] = value.split(" - ");

      const start = new Date(
        startRaw
      );

      const end = new Date(
        endRaw
      );

      if (
        !Number.isNaN(
          start.getTime()
        ) &&
        !Number.isNaN(
          end.getTime()
        )
      ) {
        const startDay =
          String(
            start.getUTCDate()
          ).padStart(2, "0");

        const endDay =
          String(
            end.getUTCDate()
          ).padStart(2, "0");

        const startMonth =
          start.toLocaleString(
            "en-US",
            {
              month: "short",
              timeZone: "UTC",
            }
          );

        const endMonth =
          end.toLocaleString(
            "en-US",
            {
              month: "short",
              timeZone: "UTC",
            }
          );

        const startYear =
          start.getUTCFullYear();

        const endYear =
          end.getUTCFullYear();

        /* Same date */

        if (
          startDay === endDay &&
          startMonth === endMonth &&
          startYear === endYear
        ) {
          return `${startMonth} ${startDay}, ${startYear}`;
        }

        /* Same month + same year */

        if (
          startMonth === endMonth &&
          startYear === endYear
        ) {
          return `${startMonth} ${startDay}–${endDay}, ${startYear}`;
        }

        /* Different month + same year */

        if (
          startYear === endYear
        ) {
          return `${startMonth} ${startDay}–${endMonth} ${endDay}, ${startYear}`;
        }

        /* Different year */

        return `${startMonth} ${startDay}, ${startYear}–${endMonth} ${endDay}, ${endYear}`;
      }
    }

    /* ----------------------------------------------------------
       SINGLE ISO DATE
    ---------------------------------------------------------- */

    const date = new Date(
      value
    );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        }
      );
    }

    /* ----------------------------------------------------------
       FALLBACK
    ---------------------------------------------------------- */

    return value;
  };

  /* ============================================================
     GET CONFERENCE DATE
  ============================================================ */

  const getConferenceDate = (
    registration
  ) => {
    const dateValue =
      registration?.conference
        ?.conferenceId?.conferenceDates ||

      registration?.conference
        ?.conferenceId?.date ||

      registration?.conference?.date ||

      registration?.conference
        ?.conferenceDates ||

      registration?.conference?.dates ||

      registration?.conferenceDate ||

      "";

    return formatConferenceDate(
      dateValue
    );
  };

  /* ============================================================
     GET CONFERENCE LOCATION
  ============================================================ */

  const getConferenceLocation = (
    registration
  ) => {
    return (
      registration?.conference
        ?.conferenceId?.location ||

      registration?.conference
        ?.location ||

      ""
    );
  };

  /* ============================================================
     GET CONFERENCE STATUS
  ============================================================ */

  const getConferenceStatus = (
    registration
  ) => {
    return (
      registration?.conference
        ?.conferenceId?.status ||

      registration?.conference
        ?.status ||

      "Upcoming"
    );
  };

  /* ============================================================
     GROUP REGISTRATIONS BY CONFERENCE
  ============================================================ */

  const registrations = useMemo(() => {
    const grouped = {};

    registrationsList.forEach(
      (registration) => {
        const conferenceId =
          getConferenceId(
            registration
          );

        if (!conferenceId) {
          return;
        }

        const conferenceTitle =
          getConferenceTitle(
            registration
          );

        const conferenceDate =
          getConferenceDate(
            registration
          );

        const conferenceLocation =
          getConferenceLocation(
            registration
          );

        const status =
          getConferenceStatus(
            registration
          );

        if (
          !grouped[conferenceId]
        ) {
          grouped[conferenceId] = {
            id: conferenceId,

            conference:
              conferenceTitle,

            date:
              conferenceDate,

            location:
              conferenceLocation,

            registrations: 0,

            status,

            registrationIds: [],
          };
        }

        grouped[conferenceId]
          .registrations += 1;

        if (registration?._id) {
          grouped[conferenceId]
            .registrationIds
            .push(
              registration._id
            );
        }
      }
    );

    return Object.values(
      grouped
    );
  }, [registrationsList]);

  /* ============================================================
     TOTAL REGISTRATIONS
  ============================================================ */

  const totalRegistrations =
    registrationsList.length;

  /* ============================================================
     UPCOMING REGISTRATIONS
  ============================================================ */

  const upcomingRegistrations =
    registrations
      .filter(
        (item) =>
          String(item.status)
            .toLowerCase() ===
          "upcoming"
      )
      .reduce(
        (total, item) =>
          total +
          item.registrations,
        0
      );

  /* ============================================================
     PUBLISHED CONFERENCES
  ============================================================ */

  const publishedConferences =
    registrations.filter(
      (item) =>
        String(item.status)
          .toLowerCase() ===
        "published"
    ).length;

  /* ============================================================
     PAGINATION
  ============================================================ */

  const totalPages = Math.max(
    1,
    Math.ceil(
      registrations.length /
        itemsPerPage
    )
  );

  const currentRegistrations =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      return registrations.slice(
        start,
        start + itemsPerPage
      );
    }, [
      currentPage,
      registrations,
    ]);

  /* ============================================================
     RESET PAGE WHEN DATA CHANGES
  ============================================================ */

  useEffect(() => {
    setCurrentPage(1);
  }, [registrations.length]);

  /* ============================================================
     KEEP PAGE VALID
  ============================================================ */

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* ============================================================
     STATUS CLASS
  ============================================================ */

  const getStatusClass = (
    status
  ) => {
    const normalizedStatus =
      String(status)
        .toLowerCase();

    if (
      normalizedStatus ===
      "draft"
    ) {
      return "bg-gray-100 text-gray-500";
    }

    if (
      normalizedStatus ===
        "closed" ||
      normalizedStatus ===
        "cancelled"
    ) {
      return "bg-red-50 text-red-500";
    }

    if (
      normalizedStatus ===
      "published"
    ) {
      return "bg-green-50 text-green-600";
    }

    return "bg-violet-50 text-violet-600";
  };

  /* ============================================================
     VIEW
  ============================================================ */

  const handleView = (
    item
  ) => {
    setOpenMenu(null);

    navigate(
      `/admin/registrations/${item.id}`,
      {
        state: {
          conference: item,
        },
      }
    );
  };

  /* ============================================================
     DELETE
  ============================================================ */

  const handleDelete = async (
    item
  ) => {
    setOpenMenu(null);

    const confirmed =
      window.confirm(
        `Are you sure you want to delete registrations for "${item.conference}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      for (
        const registrationId of
        item.registrationIds
      ) {
        await dispatch(
          deleteRegistration(
            registrationId
          )
        ).unwrap();
      }

      await dispatch(
        getAllRegistrations()
      );
    } catch (
      deleteError
    ) {
      console.error(
        "Failed to delete registrations:",
        deleteError
      );
    }
  };

  /* ============================================================
     ROW CLICK
  ============================================================ */

  const handleRowClick = (
    item
  ) => {
    if (
      openMenu !== null
    ) {
      return;
    }

    handleView(item);
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (
    loading &&
    registrationsList.length === 0
  ) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />

          <p className="mt-3 text-[12px] text-gray-500">
            Loading registrations...
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div
      className="w-full"
      onClick={() =>
        setOpenMenu(null)
      }
    >
      {/* ERROR */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">
          {typeof error ===
          "string"
            ? error
            : "Failed to load registrations."}
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Registrations
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {totalRegistrations.toLocaleString()}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Users
                size={17}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* UPCOMING */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Upcoming Registrations
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {upcomingRegistrations.toLocaleString()}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <TrendingUp
                size={17}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* CONFERENCES */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Conferences
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {registrations.length}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CalendarDays
                size={17}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* PUBLISHED */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Published Conferences
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {publishedConferences}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <UserCheck
                size={17}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONFERENCE REGISTRATIONS */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h2 className="text-[14px] font-semibold text-gray-900">
              Conference-wise Registrations
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Registration count for each conference
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1.5">
            <Users
              size={13}
              className="text-violet-600"
            />

            <span className="text-[11px] font-semibold text-violet-600">
              {totalRegistrations.toLocaleString()}{" "}
              Total
            </span>
          </div>
        </div>

        {/* TABLE */}

        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">

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
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {currentRegistrations.length >
              0 ? (

                currentRegistrations.map(
                  (item) => (
                    <tr
                      key={item.id}
                      onClick={() =>
                        handleRowClick(
                          item
                        )
                      }
                      className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-violet-50/30"
                    >

                      {/* CONFERENCE */}

                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">

                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                            <CalendarDays
                              size={14}
                              className="text-violet-600"
                            />
                          </div>

                          <p className="truncate text-[12px] font-semibold text-gray-800">
                            {item.conference}
                          </p>

                        </div>
                      </td>

                      {/* DATE */}

                      <td className="px-3 py-3 text-[11px] text-gray-500">
                        {item.date ||
                          "—"}
                      </td>

                      {/* REGISTRATIONS */}

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">

                          <Users
                            size={13}
                            className="text-violet-600"
                          />

                          <span className="text-[12px] font-semibold text-gray-800">
                            {item.registrations}
                          </span>

                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td
                        className="relative px-3 py-3 text-center"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenu(
                              (prev) =>
                                prev ===
                                item.id
                                  ? null
                                  : item.id
                            );
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-violet-50 hover:text-violet-600"
                        >
                          <MoreVertical
                            size={16}
                          />
                        </button>

                        {openMenu ===
                          item.id && (

                          <div
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="absolute right-3 bottom-[calc(100%-2px)] z-50 w-32 overflow-hidden rounded-lg border border-gray-100 bg-white p-1.5 text-left shadow-xl"
                          >

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  item
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                            >
                              <Eye
                                size={14}
                              />

                              View
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              disabled={
                                deleteLoading
                              }
                              onClick={() =>
                                handleDelete(
                                  item
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2
                                size={14}
                              />

                              {deleteLoading
                                ? "Deleting..."
                                : "Delete"}
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
                    colSpan="5"
                    className="px-4 py-12 text-center"
                  >

                    <div className="flex flex-col items-center justify-center">

                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                        <Users
                          size={18}
                          className="text-violet-600"
                        />
                      </div>

                      <p className="text-sm font-semibold text-gray-700">
                        No registrations
                        found
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Registration data
                        will appear here
                        once users
                        register.
                      </p>

                    </div>

                  </td>

                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        {registrations.length >
          0 && (

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">

            <p className="text-[10px] text-gray-500">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {(currentPage -
                  1) *
                  itemsPerPage +
                  1}
              </span>

              {" - "}

              <span className="font-semibold text-gray-700">
                {Math.min(
                  currentPage *
                    itemsPerPage,
                  registrations.length
                )}
              </span>

              {" of "}

              <span className="font-semibold text-gray-700">
                {registrations.length}
              </span>

            </p>

            <div className="flex items-center gap-1">

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev - 1
                  )
                }
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={14}
                />
              </button>

              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                    className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[10px] font-semibold transition ${
                      currentPage ===
                      page
                        ? "bg-violet-600 text-white"
                        : "border border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:text-violet-600"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* NEXT */}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev + 1
                  )
                }
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={14}
                />
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registrations;