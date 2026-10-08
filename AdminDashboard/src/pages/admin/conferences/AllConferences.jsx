import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  Loader2,
  Globe2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getConferenceWiseRegisteredUsers,
} from "../../../redux/registrationsSlice";

import {
  getConferences,
  deleteConference,
  publishConference,
  clearConferenceError,
} from "../../../redux/conferenceSlice";


const AllConferences = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /*
  |--------------------------------------------------------------------------
  | REDUX - CONFERENCES
  |--------------------------------------------------------------------------
  */

  const conferenceState = useSelector(
    (state) => state.conference
  );

  const conferencesFromRedux =
    conferenceState?.conferences || [];

  const conferenceLoading =
    conferenceState?.loading || false;

  const conferenceError =
    conferenceState?.error || null;

  const deletingConferenceId =
    conferenceState?.deletingId || null;

  const publishingConferenceId =
    conferenceState?.publishingId || null;

  /*
  |--------------------------------------------------------------------------
  | REDUX - REGISTRATIONS
  |--------------------------------------------------------------------------
  */

  const registrationState = useSelector(
    (state) => state.registrations
  );

  const conferenceWiseRegisteredUsers =
    registrationState
      ?.conferenceWiseRegisteredUsers ||
    registrationState?.data ||
    [];

  const registrationLoading =
    registrationState?.loading || false;

  const registrationError =
    registrationState?.error || null;

  /*
  |--------------------------------------------------------------------------
  | LOCAL UI STATE
  |--------------------------------------------------------------------------
  */

  const [
    openAction,
    setOpenAction,
  ] = useState(null);

  const [
    actionPosition,
    setActionPosition,
  ] = useState(null);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | CONFIRMATION
  |--------------------------------------------------------------------------
  */

  const [
    confirmation,
    setConfirmation,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LOCAL ERROR
  |--------------------------------------------------------------------------
  */

  const [
    actionError,
    setActionError,
  ] = useState("");

  const actionButtonRefs =
    useRef({});

  const itemsPerPage = 10;

  /*
  |--------------------------------------------------------------------------
  | FETCH DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(getConferences());

    dispatch(
      getConferenceWiseRegisteredUsers()
    );
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | CLEAR REDUX ERROR
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      dispatch(clearConferenceError());
    };
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | CLOSE MENU OUTSIDE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        !event.target.closest(
          ".conference-action-menu"
        ) &&
        !event.target.closest(
          ".conference-action-button"
        )
      ) {
        setOpenAction(null);
        setActionPosition(null);
      }
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
  }, []);

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE REGISTRATION COUNTS
  |--------------------------------------------------------------------------
  */

  const registrationMap = useMemo(() => {
    const map = {};

    if (
      !Array.isArray(
        conferenceWiseRegisteredUsers
      )
    ) {
      return map;
    }

    conferenceWiseRegisteredUsers.forEach(
      (item) => {
        const id =
          item?.conferenceId;

        if (!id) {
          return;
        }

        map[String(id)] = {
          registrationCount:
            Number(
              item?.totalRegisteredUsers ||
                0
            ),

          users:
            Array.isArray(item?.users)
              ? item.users
              : [],
        };
      }
    );

    return map;
  }, [
    conferenceWiseRegisteredUsers,
  ]);

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE CONFERENCES
  |--------------------------------------------------------------------------
  */

  const conferences = useMemo(() => {
    if (
      !Array.isArray(
        conferencesFromRedux
      )
    ) {
      return [];
    }

    return conferencesFromRedux.map(
      (conference) => {
        const id =
          conference?._id;

        const registration =
          registrationMap[
            String(id)
          ];

        return {
          ...conference,

          _id: id,

          title:
            conference?.title ||
            conference?.basicInformation
              ?.title ||
            conference?.conferenceTitle ||
            "Untitled Conference",

          status:
            conference?.status ||
            "Draft",

          startDate:
            conference
              ?.conferenceDates
              ?.startDate ||
            conference?.startDate ||
            null,

          endDate:
            conference
              ?.conferenceDates
              ?.endDate ||
            conference?.endDate ||
            null,

          registrationCount:
            registration
              ?.registrationCount ||
            0,

          users:
            registration?.users ||
            [],
        };
      }
    );
  }, [
    conferencesFromRedux,
    registrationMap,
  ]);

  /*
  |--------------------------------------------------------------------------
  | SORT
  |--------------------------------------------------------------------------
  */

  const sortedConferences =
    useMemo(() => {
      return [...conferences].sort(
        (a, b) => {
          const dateA =
            new Date(
              a.startDate ||
                a.createdAt ||
                0
            ).getTime();

          const dateB =
            new Date(
              b.startDate ||
                b.createdAt ||
                0
            ).getTime();

          return dateB - dateA;
        }
      );
    }, [conferences]);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const conferenceStats =
    useMemo(() => {
      const total =
        sortedConferences.length;

      const published =
        sortedConferences.filter(
          (conference) =>
            conference.status ===
            "Published"
        ).length;

      const draft =
        sortedConferences.filter(
          (conference) =>
            conference.status ===
            "Draft"
        ).length;

      const closed =
        sortedConferences.filter(
          (conference) =>
            conference.status ===
            "Closed"
        ).length;

      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const upcoming =
        sortedConferences.filter(
          (conference) => {
            if (
              !conference.startDate
            ) {
              return false;
            }

            const startDate =
              new Date(
                conference.startDate
              );

            if (
              Number.isNaN(
                startDate.getTime()
              )
            ) {
              return false;
            }

            startDate.setHours(
              0,
              0,
              0,
              0
            );

            return (
              startDate >= today &&
              conference.status !==
                "Closed" &&
              conference.status !==
                "Archived"
            );
          }
        ).length;

      const totalRegisteredUsers =
        sortedConferences.reduce(
          (
            total,
            conference
          ) => {
            return (
              total +
              Number(
                conference.registrationCount ||
                  0
              )
            );
          },
          0
        );

      return {
        total,
        published,
        draft,
        closed,
        upcoming,
        totalRegisteredUsers,
      };
    }, [
      sortedConferences,
    ]);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        sortedConferences.length /
          itemsPerPage
      )
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const currentConferences =
    sortedConferences.slice(
      startIndex,
      startIndex +
        itemsPerPage
    );

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

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (
    conference
  ) => {
    if (
      conference.startDate &&
      conference.endDate
    ) {
      const start =
        new Date(
          conference.startDate
        );

      const end =
        new Date(
          conference.endDate
        );

      if (
        !Number.isNaN(
          start.getTime()
        ) &&
        !Number.isNaN(
          end.getTime()
        )
      ) {
        const startMonth =
          start.toLocaleString(
            "en-US",
            {
              month: "short",
            }
          );

        const endMonth =
          end.toLocaleString(
            "en-US",
            {
              month: "short",
            }
          );

        const startDay =
          start.getDate();

        const endDay =
          end.getDate();

        const startYear =
          start.getFullYear();

        const endYear =
          end.getFullYear();

        if (
          startYear ===
          endYear
        ) {
          if (
            startMonth ===
            endMonth
          ) {
            return `${startMonth} ${startDay}–${endDay}, ${startYear}`;
          }

          return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
        }

        return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
      }
    }

    return "Date not available";
  };

  /*
  |--------------------------------------------------------------------------
  | CONFERENCE ID
  |--------------------------------------------------------------------------
  */

  const getConferenceId = (
    conference
  ) => {
    return conference?._id;
  };

  /*
  |--------------------------------------------------------------------------
  | VIEW
  |--------------------------------------------------------------------------
  */

  const goToDetails = (
    conference
  ) => {
    const conferenceId =
      getConferenceId(
        conference
      );

    if (!conferenceId) {
      return;
    }

    setOpenAction(null);
    setActionPosition(null);

    navigate(
      `/admin/conferences/${conferenceId}`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  const goToEdit = (
    conference
  ) => {
    const conferenceId =
      getConferenceId(
        conference
      );

    if (!conferenceId) {
      return;
    }

    setOpenAction(null);
    setActionPosition(null);

    navigate(
      `/admin/conferences/create/${conferenceId}`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN DELETE
  |--------------------------------------------------------------------------
  */

  const openDeleteConfirmation = (
    conference
  ) => {
    const conferenceId =
      getConferenceId(
        conference
      );

    if (!conferenceId) {
      return;
    }

    setOpenAction(null);
    setActionPosition(null);

    setActionError("");

    setConfirmation({
      type: "delete",
      conferenceId,
      conferenceTitle:
        conference.title ||
        "Untitled Conference",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN PUBLISH
  |--------------------------------------------------------------------------
  */

  const openPublishConfirmation = (
    conference
  ) => {
    const conferenceId =
      getConferenceId(
        conference
      );

    if (!conferenceId) {
      return;
    }

    setOpenAction(null);
    setActionPosition(null);

    setActionError("");

    setConfirmation({
      type: "publish",
      conferenceId,
      conferenceTitle:
        conference.title ||
        "Untitled Conference",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE CONFIRMATION
  |--------------------------------------------------------------------------
  */

  const closeConfirmation = () => {
    if (
      deletingConferenceId ||
      publishingConferenceId
    ) {
      return;
    }

    setConfirmation(null);
    setActionError("");
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDeleteConference =
    async () => {
      if (
        !confirmation?.conferenceId
      ) {
        return;
      }

      const conferenceId =
        confirmation.conferenceId;

      try {
        setActionError("");

        await dispatch(
          deleteConference(
            conferenceId
          )
        ).unwrap();

        setConfirmation(null);
        setOpenAction(null);
        setActionPosition(null);

        /*
        | Registration data may also have changed
        */

        await dispatch(
          getConferenceWiseRegisteredUsers()
        );
      } catch (error) {
        setActionError(
          error ||
            "Failed to delete conference."
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | PUBLISH
  |--------------------------------------------------------------------------
  */

  const handlePublishConference =
    async () => {
      if (
        !confirmation?.conferenceId
      ) {
        return;
      }

      const conferenceId =
        confirmation.conferenceId;

      try {
        setActionError("");

        await dispatch(
          publishConference(
            conferenceId
          )
        ).unwrap();

        setConfirmation(null);
        setOpenAction(null);
        setActionPosition(null);
      } catch (error) {
        setActionError(
          error ||
            "Failed to publish conference."
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | ACTION MENU
  |--------------------------------------------------------------------------
  */

  const toggleActionMenu = (
    event,
    conference
  ) => {
    event.stopPropagation();

    const conferenceId =
      getConferenceId(
        conference
      );

    if (!conferenceId) {
      return;
    }

    if (
      String(openAction) ===
      String(conferenceId)
    ) {
      setOpenAction(null);
      setActionPosition(null);
      return;
    }

    const button =
      actionButtonRefs.current[
        conferenceId
      ];

    if (!button) {
      return;
    }

    const rect =
      button.getBoundingClientRect();

    const menuWidth = 190;
    const menuHeight = 230;
    const spacing = 8;

    let left =
      rect.right -
      menuWidth;

    let top =
      rect.bottom +
      spacing;

    if (left < 10) {
      left = 10;
    }

    if (
      left +
        menuWidth >
      window.innerWidth -
        10
    ) {
      left =
        window.innerWidth -
        menuWidth -
        10;
    }

    if (
      top +
        menuHeight >
      window.innerHeight -
        10
    ) {
      top =
        rect.top -
        menuHeight -
        spacing;
    }

    if (top < 10) {
      top = 10;
    }

    setActionPosition({
      top,
      left,
    });

    setOpenAction(
      conferenceId
    );
  };

  /*
  |--------------------------------------------------------------------------
  | STATUS STYLE
  |--------------------------------------------------------------------------
  */

  const getStatusStyle = (
    status
  ) => {
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

  /*
  |--------------------------------------------------------------------------
  | STAT CARDS
  |--------------------------------------------------------------------------
  */

  const statCards = [
    {
      title:
        "Total Conferences",
      value:
        conferenceStats.total,
      icon:
        Layers3,
      description:
        "All conferences",
    },
    {
      title:
        "Published",
      value:
        conferenceStats.published,
      icon:
        CheckCircle2,
      description:
        "Live conferences",
    },
    {
      title:
        "Draft",
      value:
        conferenceStats.draft,
      icon:
        FileText,
      description:
        "Unpublished conferences",
    },
    {
      title:
        "Closed",
      value:
        conferenceStats.closed,
      icon:
        Lock,
      description:
        "Closed conferences",
    },
    {
      title:
        "Upcoming",
      value:
        conferenceStats.upcoming,
      icon:
        CalendarDays,
      description:
        "Upcoming events",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  const isLoading =
    conferenceLoading ||
    registrationLoading;

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="relative w-full min-w-0">

      <div className="animate-[fadeIn_0.35s_ease-out]">

        {/* HEADER */}

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

        {/* STAT CARDS */}

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

          {statCards.map(
            (
              card,
              index
            ) => {

              const Icon =
                card.icon;

              return (
                <div
                  key={
                    card.title
                  }
                  style={{
                    animationDelay:
                      `${index * 60}ms`,
                  }}
                  className="animate-[fadeUp_0.4s_ease-out_both] rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_5px_18px_rgba(15,23,42,0.06)]"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <p className="text-[11px] font-medium text-gray-500">
                        {
                          card.title
                        }
                      </p>

                      <p className="mt-1 text-[22px] font-bold leading-none text-gray-900">
                        {
                          card.value
                        }
                      </p>

                      <p className="mt-1.5 truncate text-[10px] text-gray-400">
                        {
                          card.description
                        }
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
            }
          )}

        </div>

        {/* TABLE */}

        <div className="w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

          <div className="overflow-x-auto rounded-xl">

            <table className="w-full min-w-[850px] table-fixed">

              <thead>

                <tr className="border-b border-gray-100 bg-gray-50/80">

                  <th className="w-[38%] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Conference
                  </th>

                  <th className="w-[20%] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="w-[15%] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Registrations
                  </th>

                  <th className="w-[17%] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="w-[10%] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {isLoading ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-4 py-14 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-violet-100 border-t-violet-600" />

                        <p className="mt-3 text-[13px] font-medium text-gray-500">
                          Loading conferences...
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          Please wait while we load the conference data.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : conferenceError ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center"
                    >

                      <p className="text-[13px] font-medium text-red-500">
                        {
                          conferenceError
                        }
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          dispatch(
                            getConferences()
                          );

                          dispatch(
                            getConferenceWiseRegisteredUsers()
                          );
                        }}
                        className="mt-3 rounded-lg bg-violet-600 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-violet-700"
                      >
                        Retry
                      </button>

                    </td>

                  </tr>

                ) : currentConferences.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-50">

                          <Globe2
                            size={20}
                            className="text-violet-500"
                          />

                        </div>

                        <p className="mt-3 text-[13px] font-medium text-gray-500">
                          No conferences found.
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          Create your first conference to get started.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  currentConferences.map(
                    (
                      conference,
                      index
                    ) => {

                      const conferenceId =
                        getConferenceId(
                          conference
                        );

                      const isPublishing =
                        String(
                          publishingConferenceId
                        ) ===
                        String(
                          conferenceId
                        );

                      const isDeleting =
                        String(
                          deletingConferenceId
                        ) ===
                        String(
                          conferenceId
                        );

                      return (

                        <tr
                          key={
                            conferenceId ||
                            index
                          }
                          onClick={() =>
                            goToDetails(
                              conference
                            )
                          }
                          style={{
                            animationDelay:
                              `${index * 45}ms`,
                          }}
                          className="animate-[fadeUp_0.35s_ease-out_both] cursor-pointer border-b border-gray-100 last:border-0 transition duration-200 hover:bg-violet-50/30"
                        >

                          {/* CONFERENCE */}

                          <td className="px-4 py-3">

                            <p
                              title={
                                conference.title
                              }
                              className="truncate text-[13px] font-semibold text-gray-800"
                            >
                              {
                                conference.title
                              }
                            </p>

                          </td>

                          {/* DATE */}

                          <td className="px-3 py-3">

                            <span className="text-[12px] text-gray-500">
                              {
                                formatDate(
                                  conference
                                )
                              }
                            </span>

                          </td>

                          {/* REGISTRATIONS */}

                          <td className="px-3 py-3">

                            <span className="text-[12px] font-semibold text-gray-700">
                              {
                                conference.registrationCount
                              }
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-3 py-3">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                                conference.status
                              )}`}
                            >
                              {
                                conference.status
                              }
                            </span>

                          </td>

                          {/* ACTION */}

                          <td
                            className="px-3 py-3"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();
                            }}
                          >

                            <div className="flex justify-center">

                              <button
                                ref={(
                                  element
                                ) => {
                                  actionButtonRefs.current[
                                    conferenceId
                                  ] =
                                    element;
                                }}
                                type="button"
                                disabled={
                                  isPublishing ||
                                  isDeleting
                                }
                                onClick={(
                                  event
                                ) =>
                                  toggleActionMenu(
                                    event,
                                    conference
                                  )
                                }
                                className="conference-action-button flex h-8 w-8 items-center justify-center rounded-md text-violet-500 transition duration-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >

                                {isPublishing ||
                                isDeleting ? (

                                  <Loader2
                                    size={16}
                                    className="animate-spin"
                                  />

                                ) : (

                                  <MoreVertical
                                    size={17}
                                  />

                                )}

                              </button>

                            </div>

                          </td>

                        </tr>

                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">

            <p className="text-[11px] text-gray-500">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {
                  sortedConferences.length ===
                  0
                    ? 0
                    : startIndex + 1
                }
              </span>{" "}

              to{" "}

              <span className="font-semibold text-gray-700">
                {
                  Math.min(
                    startIndex +
                      itemsPerPage,
                    sortedConferences.length
                  )
                }
              </span>{" "}

              of{" "}

              <span className="font-semibold text-gray-700">
                {
                  sortedConferences.length
                }
              </span>

            </p>

            <div className="flex items-center gap-1">

              <button
                type="button"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() => {
                  setOpenAction(null);
                  setActionPosition(null);

                  setCurrentPage(
                    (previousPage) =>
                      previousPage - 1
                  );
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <ChevronLeft
                  size={15}
                />

              </button>

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (
                  _,
                  index
                ) =>
                  index + 1
              ).map(
                (page) => (

                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setOpenAction(null);
                      setActionPosition(null);

                      setCurrentPage(
                        page
                      );
                    }}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                      currentPage ===
                      page
                        ? "bg-violet-600 text-white"
                        : "border border-gray-200 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    {
                      page
                    }
                  </button>

                )
              )}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() => {
                  setOpenAction(null);
                  setActionPosition(null);

                  setCurrentPage(
                    (previousPage) =>
                      previousPage + 1
                  );
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <ChevronRight
                  size={15}
                />

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ==========================================================
          ACTION MENU
      ========================================================== */}

      {openAction &&
        actionPosition && (

          <div
            className="conference-action-menu fixed z-[99999] w-[190px] rounded-xl border border-gray-100 bg-white p-1.5 shadow-[0_14px_40px_rgba(15,23,42,0.18)] animate-[menuIn_0.16s_ease-out]"
            style={{
              top:
                `${actionPosition.top}px`,
              left:
                `${actionPosition.left}px`,
            }}
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {(() => {

              const conference =
                sortedConferences.find(
                  (item) =>
                    String(
                      getConferenceId(
                        item
                      )
                    ) ===
                    String(
                      openAction
                    )
                );

              if (!conference) {
                return null;
              }

              const isPublished =
                conference.status ===
                "Published";

              return (
                <>

                  {/* VIEW */}

                  <button
                    type="button"
                    onClick={() =>
                      goToDetails(
                        conference
                      )
                    }
                    className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                  >

                    <Eye
                      size={14}
                      className="text-violet-600"
                    />

                    View

                  </button>


                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() =>
                      goToEdit(
                        conference
                      )
                    }
                    className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                  >

                    <Pencil
                      size={14}
                      className="text-violet-600"
                    />

                    Edit

                  </button>


                  {/* PUBLISH */}

                  {!isPublished && (

                    <button
                      type="button"
                      onClick={() =>
                        openPublishConfirmation(
                          conference
                        )
                      }
                      className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] font-medium text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                    >

                      <CheckCircle2
                        size={14}
                      />

                      Publish

                    </button>

                  )}


                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      openDeleteConfirmation(
                        conference
                      )
                    }
                    className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[11px] font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
                  >

                    <Trash2
                      size={14}
                    />

                    Delete

                  </button>

                </>
              );

            })()}

          </div>

        )}


      {/* ==========================================================
          CONFIRMATION MODAL
      ========================================================== */}

      {confirmation && (

        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeConfirmation();
            }
          }}
        >

          <div
            className="w-full max-w-[430px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.22)] animate-[modalIn_0.18s_ease-out]"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    confirmation.type ===
                    "publish"
                      ? "bg-emerald-50"
                      : "bg-red-50"
                  }`}
                >

                  {confirmation.type ===
                  "publish" ? (

                    <CheckCircle2
                      size={20}
                      className="text-emerald-500"
                    />

                  ) : (

                    <AlertTriangle
                      size={20}
                      className="text-red-500"
                    />

                  )}

                </div>

                <div>

                  <h2 className="text-[15px] font-bold text-gray-900">

                    {confirmation.type ===
                    "publish"
                      ? "Publish Conference"
                      : "Delete Conference"}

                  </h2>

                  <p className="mt-0.5 text-[11px] text-gray-500">

                    {confirmation.type ===
                    "publish"
                      ? "Make this conference live."
                      : "This action cannot be undone."}

                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={
                  closeConfirmation
                }
                disabled={
                  Boolean(
                    deletingConferenceId ||
                    publishingConferenceId
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <X
                  size={17}
                />

              </button>

            </div>


            {/* BODY */}

            <div className="px-5 py-5">

              <p className="text-[13px] leading-6 text-gray-600">

                {confirmation.type ===
                "publish"
                  ? "Are you sure you want to publish"
                  : "Are you sure you want to delete"}

                <span className="mx-1 font-semibold text-gray-900">
                  "{confirmation.conferenceTitle}"
                </span>

                ?

              </p>


              {confirmation.type ===
                "publish" ? (

                <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3">

                  <div className="flex gap-2.5">

                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />

                    <p className="text-[11px] leading-5 text-emerald-700">

                      Publishing will make this conference available as a live conference.

                    </p>

                  </div>

                </div>

              ) : (

                <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3.5 py-3">

                  <div className="flex gap-2.5">

                    <AlertTriangle
                      size={15}
                      className="mt-0.5 shrink-0 text-red-500"
                    />

                    <p className="text-[11px] leading-5 text-red-600">

                      Deleting this conference may also remove its associated conference data. Please make sure you really want to continue.

                    </p>

                  </div>

                </div>

              )}


              {actionError && (

                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">

                  <p className="text-[11px] font-medium text-red-600">
                    {
                      actionError
                    }
                  </p>

                </div>

              )}

            </div>


            {/* FOOTER */}

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-3.5">

              <button
                type="button"
                onClick={
                  closeConfirmation
                }
                disabled={
                  Boolean(
                    deletingConferenceId ||
                    publishingConferenceId
                  )
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-3.5 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>


              {confirmation.type ===
              "publish" ? (

                <button
                  type="button"
                  onClick={
                    handlePublishConference
                  }
                  disabled={
                    Boolean(
                      publishingConferenceId
                    )
                  }
                  className="inline-flex h-9 min-w-[105px] items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 text-[12px] font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {publishingConferenceId ? (

                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />

                      Publishing...
                    </>

                  ) : (

                    <>
                      <CheckCircle2
                        size={14}
                      />

                      Publish
                    </>

                  )}

                </button>

              ) : (

                <button
                  type="button"
                  onClick={
                    handleDeleteConference
                  }
                  disabled={
                    Boolean(
                      deletingConferenceId
                    )
                  }
                  className="inline-flex h-9 min-w-[100px] items-center justify-center gap-1.5 rounded-lg bg-red-500 px-3.5 text-[12px] font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {deletingConferenceId ? (

                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />

                      Deleting...
                    </>

                  ) : (

                    <>
                      <Trash2
                        size={14}
                      />

                      Delete
                    </>

                  )}

                </button>

              )}

            </div>

          </div>

        </div>

      )}


      {/* ==========================================================
          STYLES
      ========================================================== */}

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
            transform:
              translateY(6px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }

        @keyframes menuIn {

          from {
            opacity: 0;
            transform:
              translateY(-4px)
              scale(0.98);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }

        }

        @keyframes modalIn {

          from {
            opacity: 0;
            transform:
              translateY(8px)
              scale(0.98);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }

        }

      `}</style>

    </div>
  );
};

export default AllConferences;