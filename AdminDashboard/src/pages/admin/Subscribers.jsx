import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Search,
  Users,
  CalendarDays,
  MoreVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  getSubscribers,
  getSubscriberById,
  clearSubscriberError,
} from "../../redux/subscribeSlice";


// =========================================================
// MOTION VARIANTS
// =========================================================

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const statsContainerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const statCardVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const listContainerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const listItemVariants = {
  hidden: {
    opacity: 0,
    y: 6,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};


// =========================================================
// COMPONENT
// =========================================================

const Subscribers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =======================================================
  // REDUX
  // =======================================================

  const {
    subscribers = [],
    loading,
    error,
  } = useSelector(
    (state) => state.subscriber
  );

  // =======================================================
  // STATE
  // =======================================================

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [openMenu, setOpenMenu] =
    useState(null);

  const itemsPerPage = 6;


  // =======================================================
  // FETCH SUBSCRIBERS
  // =======================================================

  const fetchSubscribers = async () => {
    try {
      await dispatch(
        getSubscribers()
      ).unwrap();
    } catch (error) {
      console.error(
        "Get subscribers error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);


  // =======================================================
  // CLEAR ERROR
  // =======================================================

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      dispatch(
        clearSubscriberError()
      );
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [error, dispatch]);


  // =======================================================
  // CLOSE ACTION MENU
  // =======================================================

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);


  // =======================================================
  // HELPERS
  // =======================================================

  const getSubscriberName = (
    subscriber
  ) => {
    if (!subscriber) {
      return "Unknown";
    }

    if (subscriber.name) {
      return subscriber.name;
    }

    if (
      subscriber.firstName ||
      subscriber.lastName
    ) {
      return [
        subscriber.firstName,
        subscriber.lastName,
      ]
        .filter(Boolean)
        .join(" ");
    }

    return "Unknown";
  };


  const getConferenceName = (
    subscriber
  ) => {
    const conference =
      subscriber?.conferenceId;

    if (!conference) {
      return "N/A";
    }

    if (
      typeof conference ===
      "string"
    ) {
      return conference;
    }

    return (
      conference
        ?.basicInformation
        ?.title ||
      conference
        ?.basicInformation
        ?.conferenceTitle ||
      conference?.title ||
      conference?.name ||
      "N/A"
    );
  };


  const getSubscribedDate = (
    subscriber
  ) => {
    const date =
      subscriber?.subscribedAt ||
      subscriber?.createdAt;

    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =======================================================
  // INITIALS
  // =======================================================

  const getInitials = (
    name = ""
  ) => {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      return "U";
    }

    return trimmedName
      .split(/\s+/)
      .map(
        (word) => word[0]
      )
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };


  // =======================================================
  // FILTERED SUBSCRIBERS
  // =======================================================

  const filteredSubscribers =
    useMemo(() => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      return subscribers.filter(
        (subscriber) => {
          const name =
            getSubscriberName(
              subscriber
            ).toLowerCase();

          const conference =
            getConferenceName(
              subscriber
            ).toLowerCase();

          return (
            !searchValue ||
            name.includes(
              searchValue
            ) ||
            conference.includes(
              searchValue
            )
          );
        }
      );
    }, [
      subscribers,
      search,
    ]);


  // =======================================================
  // PAGINATION
  // =======================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredSubscribers.length /
          itemsPerPage
      )
    );

  const safePage =
    Math.min(
      currentPage,
      totalPages
    );

  const paginatedSubscribers =
    filteredSubscribers.slice(
      (safePage - 1) *
        itemsPerPage,

      safePage *
        itemsPerPage
    );


  // =======================================================
  // SUMMARY
  // =======================================================

  const totalSubscribers =
    subscribers.length;


  const conferenceCount =
    new Set(
      subscribers
        .map(
          (subscriber) =>
            getConferenceName(
              subscriber
            )
        )
        .filter(
          (name) =>
            name &&
            name !== "N/A"
        )
    ).size;


  // =======================================================
  // CARD CLICK
  // =======================================================

  const handleCardClick = (
    type
  ) => {
    setCurrentPage(1);

    if (type === "all") {
      setSearch("");
    }

    if (type === "conference") {
      setSearch("");
    }
  };


  // =======================================================
  // VIEW SUBSCRIBER
  // =======================================================

  const handleViewSubscriber =
    async (
      subscriberId
    ) => {
      try {
        setOpenMenu(null);

        if (!subscriberId) {
          return;
        }

        await dispatch(
          getSubscriberById(
            subscriberId
          )
        ).unwrap();

        navigate(
          `/admin/subscribers/${subscriberId}`
        );
      } catch (error) {
        console.error(
          "Get subscriber details error:",
          error
        );
      }
    };


  // =======================================================
  // CLEAR SEARCH
  // =======================================================

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };


  // =======================================================
  // PAGE
  // =======================================================

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-w-0 w-full overflow-hidden space-y-3"
    >

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <motion.div
        variants={
          statsContainerVariants
        }
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 xl:grid-cols-2"
      >

        {/* TOTAL SUBSCRIBERS */}

        <motion.button
          type="button"
          variants={
            statCardVariants
          }
          whileHover={{
            y: -2,
            transition: {
              duration: 0.2,
            },
          }}
          whileTap={{
            scale: 0.99,
          }}
          onClick={() =>
            handleCardClick(
              "all"
            )
          }
          className="rounded-xl border border-violet-200 bg-white px-4 py-3.5 text-left shadow-sm ring-1 ring-violet-100 transition hover:border-violet-300"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Total Subscribers
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {totalSubscribers}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Users
                size={18}
                className="text-violet-600"
              />
            </div>

          </div>
        </motion.button>


        {/* CONFERENCES */}

        <motion.button
          type="button"
          variants={
            statCardVariants
          }
          whileHover={{
            y: -2,
            transition: {
              duration: 0.2,
            },
          }}
          whileTap={{
            scale: 0.99,
          }}
          onClick={() =>
            handleCardClick(
              "conference"
            )
          }
          className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-violet-200 hover:ring-1 hover:ring-violet-100"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Conferences
              </p>

              <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                {conferenceCount}
              </h3>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CalendarDays
                size={18}
                className="text-violet-600"
              />
            </div>

          </div>
        </motion.button>

      </motion.div>


      {/* =================================================
          ERROR
      ================================================= */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -6,
            }}
            transition={{
              duration: 0.25,
            }}
            className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-3 py-2.5"
          >
            <p className="text-[11px] font-medium text-red-600">
              {error}
            </p>

            <motion.button
              type="button"
              onClick={
                fetchSubscribers
              }
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="rounded-md px-2.5 py-1.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-100"
            >
              Retry
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <motion.div
        variants={
          sectionVariants
        }
        initial="hidden"
        animate="visible"
        transition={{
          delay: 0.12,
        }}
        className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm"
      >

        {/* =================================================
            FILTER BAR
        ================================================= */}

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
                setSearch(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              placeholder="Search subscribers or conferences..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100"
            />

            <AnimatePresence>
              {search && (
                <motion.button
                  type="button"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={
                    clearSearch
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="w-full overflow-visible">

          <table className="w-full table-fixed">

            <thead>

              <tr className="border-b border-gray-100 bg-gray-50/70">

                <th className="w-[30%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Subscriber
                </th>

                <th className="w-[40%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Conference
                </th>

                <th className="w-[20%] px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Subscribed On
                </th>

                <th className="w-[10%] px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>

            </thead>


            <motion.tbody
              variants={
                listContainerVariants
              }
              initial="hidden"
              animate="visible"
            >

              {/* =================================================
                  LOADING
              ================================================= */}

              {loading ? (

                <motion.tr
                  variants={
                    listItemVariants
                  }
                >

                  <td
                    colSpan="4"
                    className="px-4 py-12 text-center"
                  >

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="flex flex-col items-center justify-center"
                    >

                      <Loader2
                        size={26}
                        className="animate-spin text-violet-600"
                      />

                      <p className="mt-2 text-[12px] font-medium text-gray-500">
                        Loading subscribers...
                      </p>

                    </motion.div>

                  </td>

                </motion.tr>

              ) : paginatedSubscribers.length >
                0 ? (

                /* =================================================
                   SUBSCRIBER ROWS
                ================================================= */

                paginatedSubscribers.map(
                  (subscriber) => {

                    const subscriberId =
                      subscriber?._id ||
                      subscriber?.id;

                    const name =
                      getSubscriberName(
                        subscriber
                      );

                    const conference =
                      getConferenceName(
                        subscriber
                      );

                    return (
                      <motion.tr
                        key={
                          subscriberId
                        }
                        variants={
                          listItemVariants
                        }
                        whileHover={{
                          x: 2,
                          transition: {
                            duration: 0.15,
                          },
                        }}
                        className="border-b border-gray-50 transition hover:bg-violet-50/30"
                      >

                        {/* SUBSCRIBER */}

                        <td className="px-3 py-3">

                          <div className="flex min-w-0 items-center gap-2.5">

                            <motion.div
                              whileHover={{
                                scale: 1.05,
                              }}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700"
                            >
                              {getInitials(
                                name
                              )}
                            </motion.div>

                            <div className="min-w-0">

                              <p className="truncate text-[12px] font-semibold text-gray-800">
                                {name}
                              </p>

                              <div className="mt-0.5 flex items-center gap-1">

                                <Users
                                  size={11}
                                  className="shrink-0 text-violet-500"
                                />

                                <p className="truncate text-[10px] text-gray-500">
                                  Subscriber
                                </p>

                              </div>

                            </div>

                          </div>

                        </td>


                        {/* CONFERENCE */}

                        <td className="px-2 py-3">

                          <p
                            title={
                              conference
                            }
                            className="truncate text-[11px] font-medium text-gray-700"
                          >
                            {conference}
                          </p>

                        </td>


                        {/* DATE */}

                        <td className="px-2 py-3">

                          <div className="flex items-center gap-1.5">

                            <CalendarDays
                              size={11}
                              className="shrink-0 text-violet-500"
                            />

                            <span className="truncate text-[11px] text-gray-600">
                              {getSubscribedDate(
                                subscriber
                              )}
                            </span>

                          </div>

                        </td>


                        {/* ACTION */}

                        <td className="relative z-40 px-2 py-3 text-center">

                          <motion.button
                            type="button"
                            whileHover={{
                              scale: 1.05,
                            }}
                            whileTap={{
                              scale: 0.9,
                            }}
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              setOpenMenu(
                                openMenu ===
                                  subscriberId
                                  ? null
                                  : subscriberId
                              );
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                          >

                            <MoreVertical
                              size={16}
                            />

                          </motion.button>


                          {/* ACTION MENU */}

                          <AnimatePresence>

                            {openMenu ===
                              subscriberId && (

                              <motion.div
                                onClick={(
                                  event
                                ) =>
                                  event.stopPropagation()
                                }
                                initial={{
                                  opacity: 0,
                                  scale: 0.95,
                                  y: -4,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                  y: 0,
                                }}
                                exit={{
                                  opacity: 0,
                                  scale: 0.95,
                                  y: -4,
                                }}
                                transition={{
                                  duration: 0.15,
                                }}
                                className="absolute bottom-11 right-3 z-50 w-32 origin-bottom-right rounded-lg border border-gray-100 bg-white p-1 text-left shadow-lg"
                              >

                                {/* VIEW ONLY */}

                                <motion.button
                                  type="button"
                                  whileHover={{
                                    x: 2,
                                  }}
                                  whileTap={{
                                    scale: 0.98,
                                  }}
                                  onClick={() =>
                                    handleViewSubscriber(
                                      subscriberId
                                    )
                                  }
                                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                                >

                                  <Eye
                                    size={13}
                                  />

                                  View

                                </motion.button>

                              </motion.div>

                            )}

                          </AnimatePresence>

                        </td>

                      </motion.tr>
                    );
                  }
                )

              ) : (

                /* =================================================
                   EMPTY
                ================================================= */

                <motion.tr
                  variants={
                    listItemVariants
                  }
                >

                  <td
                    colSpan="4"
                    className="px-4 py-10 text-center"
                  >

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="flex flex-col items-center justify-center"
                    >

                      <Users
                        size={30}
                        className="mb-2 text-violet-300"
                      />

                      <p className="text-[12px] font-semibold text-gray-600">
                        No subscribers found
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        Try changing your search.
                      </p>

                      {search && (
                        <button
                          type="button"
                          onClick={
                            clearSearch
                          }
                          className="mt-3 rounded-md bg-violet-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-violet-700"
                        >
                          Clear Search
                        </button>
                      )}

                    </motion.div>

                  </td>

                </motion.tr>

              )}

            </motion.tbody>

          </table>

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.2,
          }}
          className="flex items-center justify-between border-t border-gray-100 px-3.5 py-3"
        >

          <p className="text-[11px] text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-700">
              {filteredSubscribers.length ===
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
                filteredSubscribers.length
              )}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-gray-700">
              {
                filteredSubscribers.length
              }
            </span>

            {" "}subscribers

          </p>


          <div className="flex items-center gap-1">

            {/* PREVIOUS */}

            <motion.button
              type="button"
              disabled={
                safePage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              whileHover={
                safePage !== 1
                  ? { y: -1 }
                  : undefined
              }
              whileTap={
                safePage !== 1
                  ? { scale: 0.94 }
                  : undefined
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft
                size={15}
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
            ).map((page) => (

              <motion.button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(
                    page
                  )
                }
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                  safePage ===
                  page
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                {page}
              </motion.button>

            ))}


            {/* NEXT */}

            <motion.button
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
              whileHover={
                safePage !==
                totalPages
                  ? { y: -1 }
                  : undefined
              }
              whileTap={
                safePage !==
                totalPages
                  ? { scale: 0.94 }
                  : undefined
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight
                size={15}
              />
            </motion.button>

          </div>

        </motion.div>

      </motion.div>

    </motion.div>
  );
};

export default Subscribers;