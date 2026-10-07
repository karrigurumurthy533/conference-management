
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
  TrendingUp,
  CalendarDays,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  getConferenceWiseRegisteredUsers,
} from "../../redux/registrationsSlice";

const Registrations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ============================================================
     REDUX
  ============================================================ */

  const {
    conferenceWiseRegisteredUsers = [],
    conferenceWiseRegisteredLoading,
    conferenceWiseRegisteredError,
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
     FETCH CONFERENCE-WISE REGISTERED USERS
     ONLY API USED IN THIS PAGE
  ============================================================ */

  useEffect(() => {
    dispatch(
      getConferenceWiseRegisteredUsers()
    );
  }, [dispatch]);

  /* ============================================================
     HELPERS
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

  const getConferenceId = (conference) => {
    const possibleIds = [
      conference?.conferenceId?._id,
      conference?.conferenceId?.id,
      conference?.conferenceId,
      conference?._id,
      conference?.id,
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

  const getConferenceTitle = (conference) => {
    return (
      conference?.conferenceName ||
      conference?.title ||
      conference?.name ||
      conference?.conferenceTitle ||
      "Unknown Conference"
    );
  };

  /* ============================================================
     FORMAT DATE
  ============================================================ */

  const formatConferenceDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    /* ARRAY DATE SUPPORT */

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

    /* OBJECT DATE SUPPORT */

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

    /* API RANGE FORMAT */

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

        /* SAME DATE */

        if (
          startDay === endDay &&
          startMonth === endMonth &&
          startYear === endYear
        ) {
          return `${startMonth} ${startDay}, ${startYear}`;
        }

        /* SAME MONTH + YEAR */

        if (
          startMonth === endMonth &&
          startYear === endYear
        ) {
          return `${startMonth} ${startDay}–${endDay}, ${startYear}`;
        }

        /* DIFFERENT MONTH + SAME YEAR */

        if (
          startYear === endYear
        ) {
          return `${startMonth} ${startDay}–${endMonth} ${endDay}, ${startYear}`;
        }

        /* DIFFERENT YEAR */

        return `${startMonth} ${startDay}, ${startYear}–${endMonth} ${endDay}, ${endYear}`;
      }
    }

    /* SINGLE ISO DATE */

    const date = new Date(value);

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

    return value;
  };

  /* ============================================================
     GET CONFERENCE DATE
  ============================================================ */

  const getConferenceDate = (
    conference
  ) => {
    const dateValue =
      conference?.conferenceDates ||
      conference?.date ||
      conference?.dates ||
      conference?.conferenceDate ||
      "";

    return formatConferenceDate(
      dateValue
    );
  };

  /* ============================================================
     GET LOCATION
  ============================================================ */

  const getConferenceLocation = (
    conference
  ) => {
    return (
      conference?.location ||
      conference?.venue ||
      conference?.mode ||
      ""
    );
  };

  /* ============================================================
     GET STATUS
  ============================================================ */

  const getConferenceStatus = (
    conference
  ) => {
    return (
      conference?.status ||
      "Upcoming"
    );
  };

  /* ============================================================
     NORMALIZE CONFERENCE-WISE API DATA
  ============================================================ */

  const registrations = useMemo(() => {
    if (
      !Array.isArray(
        conferenceWiseRegisteredUsers
      )
    ) {
      return [];
    }

    return conferenceWiseRegisteredUsers.map(
      (conference, index) => {
        const conferenceId =
          getConferenceId(
            conference
          ) ||
          `conference-${index}`;

        const conferenceName =
          getConferenceTitle(
            conference
          );

        const date =
          getConferenceDate(
            conference
          );

        const location =
          getConferenceLocation(
            conference
          );

        const status =
          getConferenceStatus(
            conference
          );

        const users =
          Array.isArray(
            conference?.users
          )
            ? conference.users
            : [];

        /*
         * Backend expected:
         *
         * {
         *   conferenceId,
         *   conferenceName,
         *   totalRegisteredUsers,
         *   users: [],
         *   date,
         *   location,
         *   status
         * }
         */

        const totalRegisteredUsers =
          Number(
            conference?.totalRegisteredUsers
          ) ||
          users.length;

        return {
          id: conferenceId,

          conference:
            conferenceName,

          date,

          location,

          registrations:
            totalRegisteredUsers,

          status,

          users,
        };
      }
    );
  }, [
    conferenceWiseRegisteredUsers,
  ]);

  /* ============================================================
     STATISTICS
  ============================================================ */

  const totalRegistrations =
    useMemo(() => {
      return registrations.reduce(
        (total, item) =>
          total +
          Number(
            item.registrations
          ),
        0
      );
    }, [registrations]);

  const upcomingRegistrations =
    useMemo(() => {
      return registrations
        .filter(
          (item) =>
            String(item.status)
              .toLowerCase() ===
            "upcoming"
        )
        .reduce(
          (total, item) =>
            total +
            Number(
              item.registrations
            ),
          0
        );
    }, [registrations]);

  const publishedConferences =
    useMemo(() => {
      return registrations.filter(
        (item) =>
          String(item.status)
            .toLowerCase() ===
          "published"
      ).length;
    }, [registrations]);

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
     RESET PAGE
  ============================================================ */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    registrations.length,
  ]);

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
     ACTION MENU
  ============================================================ */

  const handleMenuClick = (
    event,
    itemId
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const normalizedId =
      String(itemId);

    setOpenMenu(
      (previous) =>
        previous ===
        normalizedId
          ? null
          : normalizedId
    );
  };

  /* ============================================================
     OUTSIDE CLICK
  ============================================================ */

  useEffect(() => {
    if (
      openMenu === null
    ) {
      return;
    }

    const handleOutsideClick = (
      event
    ) => {
      const target =
        event.target;

      if (
        target?.closest?.(
          "[data-registration-action-menu]"
        )
      ) {
        return;
      }

      if (
        target?.closest?.(
          "[data-registration-action-button]"
        )
      ) {
        return;
      }

      setOpenMenu(null);
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [openMenu]);

  /* ============================================================
     CLOSE MENU ON SCROLL / RESIZE
  ============================================================ */

  useEffect(() => {
    if (
      openMenu === null
    ) {
      return;
    }

    const handleScroll = () => {
      setOpenMenu(null);
    };

    const handleResize = () => {
      setOpenMenu(null);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      true
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [openMenu]);

  /* ============================================================
     LOADING
  ============================================================ */

  if (
    conferenceWiseRegisteredLoading &&
    conferenceWiseRegisteredUsers.length ===
      0
  ) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <div className="text-center">

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="mx-auto h-8 w-8 rounded-full border-2 border-gray-200 border-t-violet-600"
          />

          <p className="mt-3 text-[12px] text-gray-500">
            Loading registrations...
          </p>

        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  const displayError =
    conferenceWiseRegisteredError;

  /* ============================================================
     UI
  ============================================================ */

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="w-full"
      onClick={() =>
        setOpenMenu(null)
      }
    >

      {/* ERROR */}

      {displayError && (
        <motion.div
          initial={{
            opacity: 0,
            y: -6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600"
        >
          {typeof displayError ===
          "string"
            ? displayError
            : "Failed to load registrations."}
        </motion.div>
      )}

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="mb-4 grid grid-cols-2 gap-2.5 xl:grid-cols-4">

        {/* TOTAL */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0,
          }}
          whileHover={{
            y: -2,
          }}
          className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Registrations
              </p>

              <h2 className="mt-1 text-[21px] font-bold text-gray-900">
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
        </motion.div>

        {/* UPCOMING */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.06,
          }}
          whileHover={{
            y: -2,
          }}
          className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Upcoming Registrations
              </p>

              <h2 className="mt-1 text-[21px] font-bold text-gray-900">
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
        </motion.div>

        {/* CONFERENCES */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.12,
          }}
          whileHover={{
            y: -2,
          }}
          className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Conferences
              </p>

              <h2 className="mt-1 text-[21px] font-bold text-gray-900">
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
        </motion.div>

        {/* PUBLISHED */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.18,
          }}
          whileHover={{
            y: -2,
          }}
          className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Published Conferences
              </p>

              <h2 className="mt-1 text-[21px] font-bold text-gray-900">
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
        </motion.div>

      </div>

      {/* ======================================================
          CONFERENCE REGISTRATIONS
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.12,
        }}
        className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm"
      >

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

          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1.5"
          >
            <Users
              size={13}
              className="text-violet-600"
            />

            <span className="text-[11px] font-semibold text-violet-600">
              {totalRegistrations.toLocaleString()}{" "}
              Total
            </span>
          </motion.div>

        </div>

        {/* TABLE */}

        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">

                <th className="w-[40%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Conference
                </th>

                <th className="w-[21%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="w-[17%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Registrations
                </th>

                <th className="w-[14%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
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
                  (item, index) => (

                    <motion.tr
                      key={item.id}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.28,
                        delay:
                          index * 0.04,
                      }}
                      whileHover={{
                        backgroundColor:
                          "rgba(139, 92, 246, 0.035)",
                      }}
                      onClick={() =>
                        handleRowClick(
                          item
                        )
                      }
                      className="cursor-pointer border-b border-gray-100 last:border-0"
                    >

                      {/* CONFERENCE */}

                      <td className="px-4 py-3">

                        <p className="truncate text-[12px] font-semibold text-gray-800">
                          {item.conference}
                        </p>

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

                        <motion.button
                          type="button"
                          whileTap={{
                            scale: 0.9,
                          }}
                          data-registration-action-button
                          onClick={(e) =>
                            handleMenuClick(
                              e,
                              item.id
                            )
                          }
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-violet-50 hover:text-violet-600"
                        >
                          <MoreVertical
                            size={16}
                          />
                        </motion.button>

                        {openMenu ===
                          String(
                            item.id
                          ) && (

                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.96,
                              y: 4,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              y: 0,
                            }}
                            transition={{
                              duration: 0.15,
                            }}
                            data-registration-action-menu
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="absolute bottom-[calc(100%-2px)] right-3 z-[9999] w-32 origin-bottom-right overflow-hidden rounded-lg border border-gray-100 bg-white p-1.5 text-left shadow-2xl"
                          >

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                handleView(
                                  item
                                );
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                            >
                              <Eye
                                size={14}
                              />

                              View
                            </button>

                          </motion.div>
                        )}

                      </td>

                    </motion.tr>
                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="px-4 py-12 text-center"
                  >

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="flex flex-col items-center justify-center"
                    >

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

                    </motion.div>

                  </td>

                </tr>
              )}

            </tbody>

          </table>
        </div>

        {/* ====================================================
            PAGINATION
        ==================================================== */}

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

              <motion.button
                type="button"
                whileTap={{
                  scale: 0.9,
                }}
                disabled={
                  currentPage ===
                  1
                }
                onClick={(e) => {
                  e.stopPropagation();

                  setCurrentPage(
                    (prev) =>
                      prev - 1
                  );
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={14}
                />
              </motion.button>

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

                  <motion.button
                    key={page}
                    type="button"
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();

                      setCurrentPage(
                        page
                      );
                    }}
                    className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[10px] font-semibold transition ${
                      currentPage ===
                      page
                        ? "bg-violet-600 text-white"
                        : "border border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:text-violet-600"
                    }`}
                  >
                    {page}
                  </motion.button>

                )
              )}

              {/* NEXT */}

              <motion.button
                type="button"
                whileTap={{
                  scale: 0.9,
                }}
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={(e) => {
                  e.stopPropagation();

                  setCurrentPage(
                    (prev) =>
                      prev + 1
                  );
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={14}
                />
              </motion.button>

            </div>

          </div>
        )}

      </motion.div>

    </motion.div>
  );
};

export default Registrations;
