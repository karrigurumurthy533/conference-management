import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

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
  BriefcaseBusiness,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import {
  getSpeakersApi,
  deleteSpeakerApi,
} from "../../api/speakerApis";


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

const Speakers = () => {
  const navigate = useNavigate();


  // =======================================================
  // STATES
  // =======================================================

  const [speakers, setSpeakers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [
    conferenceFilter,
    setConferenceFilter,
  ] = useState("All Conferences");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All Status");

  const [openMenu, setOpenMenu] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  // =======================================================
  // CUSTOM DELETE POPUP STATE
  // =======================================================

  const [
    deleteSpeakerTarget,
    setDeleteSpeakerTarget,
  ] = useState(null);


  const itemsPerPage = 6;


  // =========================================================
  // GET ALL SPEAKERS
  // =========================================================

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getSpeakersApi();

      const responseData =
        response?.data;

      const speakerData =
        responseData?.data ||
        responseData?.speakers ||
        [];

      setSpeakers(
        Array.isArray(speakerData)
          ? speakerData
          : [],
      );
    } catch (error) {
      console.error(
        "Get speakers error:",
        error,
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load speakers",
      );

      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSpeakers();
  }, []);


  // =========================================================
  // CLOSE ACTION MENU WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (
      event,
    ) => {
      if (
        !event.target.closest(
          "[data-speaker-action-menu]",
        )
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);


  // =========================================================
  // ESCAPE KEY FOR DELETE POPUP
  // =========================================================

  useEffect(() => {
    if (!deleteSpeakerTarget) {
      return;
    }

    const handleEscape = (
      event,
    ) => {
      if (
        event.key === "Escape" &&
        !deleteLoading
      ) {
        setDeleteSpeakerTarget(null);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [
    deleteSpeakerTarget,
    deleteLoading,
  ]);


  // =========================================================
  // CONFERENCE OPTIONS
  // =========================================================

  const conferences = useMemo(() => {
    const conferenceNames =
      speakers
        .map((speaker) => {
          if (
            speaker?.conferenceId &&
            typeof speaker.conferenceId ===
              "object"
          ) {
            return (
              speaker.conferenceId?.title ||
              speaker.conferenceId?.name ||
              ""
            );
          }

          return (
            speaker?.conferenceName ||
            ""
          );
        })
        .filter(Boolean);

    return [
      "All Conferences",
      ...new Set(conferenceNames),
    ];
  }, [speakers]);


  // =========================================================
  // GET CONFERENCE NAME
  // =========================================================

  const getConferenceName = (
    speaker,
  ) => {
    if (
      speaker?.conferenceId &&
      typeof speaker.conferenceId ===
        "object"
    ) {
      return (
        speaker.conferenceId?.title ||
        speaker.conferenceId?.name ||
        "Conference"
      );
    }

    return (
      speaker?.conferenceName ||
      "Conference"
    );
  };


  // =========================================================
  // FILTER
  // =========================================================

  const filteredSpeakers = useMemo(() => {
    return speakers.filter((speaker) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const name =
        speaker?.fullName || "";

      const designation =
        speaker?.designation || "";

      const organization =
        speaker?.organization || "";

      const email =
        speaker?.email || "";

      const country =
        speaker?.country || "";

      const conference =
        getConferenceName(speaker);

      const matchesSearch =
        !searchValue ||
        name
          .toLowerCase()
          .includes(searchValue) ||
        designation
          .toLowerCase()
          .includes(searchValue) ||
        organization
          .toLowerCase()
          .includes(searchValue) ||
        email
          .toLowerCase()
          .includes(searchValue) ||
        country
          .toLowerCase()
          .includes(searchValue);

      const matchesConference =
        conferenceFilter ===
          "All Conferences" ||
        conference ===
          conferenceFilter;

      const matchesStatus =
        statusFilter ===
          "All Status" ||
        speaker?.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesConference &&
        matchesStatus
      );
    });
  }, [
    speakers,
    search,
    conferenceFilter,
    statusFilter,
  ]);


  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredSpeakers.length /
        itemsPerPage,
    ),
  );


  const safePage = Math.min(
    currentPage,
    totalPages,
  );


  const paginatedSpeakers =
    filteredSpeakers.slice(
      (safePage - 1) *
        itemsPerPage,
      safePage * itemsPerPage,
    );


  // =========================================================
  // SUMMARY
  // =========================================================

  const totalSpeakers =
    speakers.length;


  const activeSpeakers =
    speakers.filter(
      (speaker) =>
        speaker?.status === "Active",
    ).length;


  const inactiveSpeakers =
    speakers.filter(
      (speaker) =>
        speaker?.status === "Inactive",
    ).length;


  const speakerTypes = new Set(
    speakers
      .map(
        (speaker) =>
          speaker?.speakerType,
      )
      .filter(Boolean),
  ).size;


  // =========================================================
  // INITIALS
  // =========================================================

  const getInitials = (
    name = "",
  ) => {
    return name
      .replace(
        /^Dr\.\s*/i,
        "",
      )
      .replace(
        /^Prof\.\s*/i,
        "",
      )
      .trim()
      .split(/\s+/)
      .map(
        (word) => word[0],
      )
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };


  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (
    status,
  ) => {
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

  const handleFilterChange = (
    setter,
    value,
  ) => {
    setter(value);

    setCurrentPage(1);

    setOpenMenu(null);
  };


  // =========================================================
  // ADD SPEAKER
  // =========================================================

  const handleAddSpeaker = () => {
    setOpenMenu(null);

    navigate(
      "/admin/speakers/add",
    );
  };


  // =========================================================
  // VIEW SPEAKER
  // =========================================================

  const handleViewSpeaker = (
    speakerId,
  ) => {
    setOpenMenu(null);

    if (!speakerId) {
      return;
    }

    navigate(
      `/admin/speakers/${speakerId}`,
    );
  };


  // =========================================================
  // EDIT SPEAKER
  // =========================================================

  const handleEditSpeaker = (
    id,
  ) => {
    setOpenMenu(null);

    if (!id) {
      console.error(
        "Speaker ID is missing",
      );

      return;
    }

    navigate(
      `/admin/speakers/add/${id}`,
    );
  };


  // =========================================================
  // OPEN DELETE POPUP
  // =========================================================

  const handleDeleteSpeaker = (
    speaker,
  ) => {
    setOpenMenu(null);

    if (!speaker?._id) {
      return;
    }

    setError("");

    setDeleteSpeakerTarget(
      speaker,
    );
  };


  // =========================================================
  // CONFIRM DELETE SPEAKER
  // =========================================================

  const confirmDeleteSpeaker =
    async () => {
      const speakerId =
        deleteSpeakerTarget?._id;

      if (!speakerId) {
        return;
      }

      try {
        setDeleteLoading(
          speakerId,
        );

        setError("");

        await deleteSpeakerApi(
          speakerId,
        );

        setSpeakers(
          (previous) =>
            previous.filter(
              (speaker) =>
                speaker?._id !==
                speakerId,
            ),
        );

        // Close popup after successful delete
        setDeleteSpeakerTarget(
          null,
        );

        // Keep pagination valid
        setCurrentPage((page) => {
          const remaining =
            Math.max(
              0,
              filteredSpeakers.length -
                1,
            );

          const pages =
            Math.max(
              1,
              Math.ceil(
                remaining /
                  itemsPerPage,
              ),
            );

          return Math.min(
            page,
            pages,
          );
        });
      } catch (error) {
        console.error(
          "Delete speaker error:",
          error,
        );

        setError(
          error?.response?.data
            ?.message ||
            "Failed to delete speaker",
        );

        // Keep popup open if delete failed
      } finally {
        setDeleteLoading(null);
      }
    };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-w-0 w-full overflow-hidden space-y-3"
      >

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <motion.div
          variants={
            statsContainerVariants
          }
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3 xl:grid-cols-4"
        >

          {/* TOTAL */}

          <motion.div
            variants={
              statCardVariants
            }
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
              },
            }}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-[12px] font-medium text-gray-500">
                  Total Speakers
                </p>

                <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                  {totalSpeakers}
                </h3>
              </div>

              <motion.div
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50"
              >
                <Users
                  size={18}
                  className="text-violet-600"
                />
              </motion.div>

            </div>
          </motion.div>


          {/* ACTIVE */}

          <motion.div
            variants={
              statCardVariants
            }
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
              },
            }}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-[12px] font-medium text-gray-500">
                  Active Speakers
                </p>

                <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                  {activeSpeakers}
                </h3>
              </div>

              <motion.div
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50"
              >
                <UserCheck
                  size={18}
                  className="text-violet-600"
                />
              </motion.div>

            </div>
          </motion.div>


          {/* INACTIVE */}

          <motion.div
            variants={
              statCardVariants
            }
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
              },
            }}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-[12px] font-medium text-gray-500">
                  Inactive Speakers
                </p>

                <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                  {inactiveSpeakers}
                </h3>
              </div>

              <motion.div
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50"
              >
                <UserPlus
                  size={18}
                  className="text-violet-600"
                />
              </motion.div>

            </div>
          </motion.div>


          {/* SPEAKER TYPES */}

          <motion.div
            variants={
              statCardVariants
            }
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
              },
            }}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-[12px] font-medium text-gray-500">
                  Speaker Types
                </p>

                <h3 className="mt-1 text-[21px] font-bold text-gray-900">
                  {speakerTypes}
                </h3>
              </div>

              <motion.div
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50"
              >
                <CalendarDays
                  size={18}
                  className="text-violet-600"
                />
              </motion.div>

            </div>
          </motion.div>

        </motion.div>


        {/* =====================================================
            ERROR
        ===================================================== */}

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
                  fetchSpeakers
                }
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-100"
              >
                Retry
              </motion.button>

            </motion.div>
          )}
        </AnimatePresence>


        {/* =====================================================
            MAIN CARD
        ===================================================== */}

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
                  setSearch(
                    e.target.value,
                  );

                  setCurrentPage(1);
                }}
                placeholder="Search speakers..."
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
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>

            </div>


            {/* CONFERENCE */}

            <select
              value={
                conferenceFilter
              }
              onChange={(e) =>
                handleFilterChange(
                  setConferenceFilter,
                  e.target.value,
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
                ),
              )}

            </select>


            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                handleFilterChange(
                  setStatusFilter,
                  e.target.value,
                )
              }
              className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-36"
            >

              <option>
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>


            {/* ADD */}

            <motion.button
              type="button"
              onClick={
                handleAddSpeaker
              }
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[11px] font-semibold text-white transition hover:bg-violet-700"
            >
              <UserPlus size={14} />

              Add Speaker
            </motion.button>

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


              <motion.tbody
                variants={
                  listContainerVariants
                }
                initial="hidden"
                animate="visible"
              >

                {/* LOADING */}

                {loading ? (
                  <motion.tr
                    variants={
                      listItemVariants
                    }
                  >
                    <td
                      colSpan="7"
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
                          Loading speakers...
                        </p>

                      </motion.div>

                    </td>
                  </motion.tr>
                ) : paginatedSpeakers.length >
                  0 ? (

                  paginatedSpeakers.map(
                    (speaker) => {
                      const speakerId =
                        speaker?._id;

                      const imageUrl =
                        speaker?.imageUrl ||
                        speaker?.image ||
                        speaker?.photoUrl ||
                        "";

                      const conference =
                        getConferenceName(
                          speaker,
                        );

                      return (
                        <motion.tr
                          key={speakerId}
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

                          {/* SPEAKER */}

                          <td className="px-3 py-3">

                            <div className="flex min-w-0 items-center gap-2.5">

                              {imageUrl ? (
                                <motion.img
                                  src={
                                    imageUrl
                                  }
                                  alt={
                                    speaker.fullName ||
                                    "Speaker"
                                  }
                                  whileHover={{
                                    scale: 1.05,
                                  }}
                                  transition={{
                                    duration: 0.2,
                                  }}
                                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                                />
                              ) : (
                                <motion.div
                                  whileHover={{
                                    scale: 1.05,
                                  }}
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700"
                                >
                                  {getInitials(
                                    speaker.fullName,
                                  )}
                                </motion.div>
                              )}

                              <div className="min-w-0">

                                <p className="truncate text-[12px] font-semibold text-gray-800">
                                  {
                                    speaker.fullName
                                  }
                                </p>

                                <div className="mt-0.5 flex items-center gap-1">

                                  <BriefcaseBusiness
                                    size={11}
                                    className="shrink-0 text-violet-500"
                                  />

                                  <p className="truncate text-[10px] text-gray-500">
                                    {
                                      speaker.designation
                                    }
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
                              {
                                conference
                              }
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
                                {
                                  speaker.country
                                }
                              </span>

                            </div>

                          </td>


                          {/* SPEAKER TYPE */}

                          <td className="px-2 py-3">

                            <span className="inline-flex max-w-full truncate rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
                              {
                                speaker.speakerType
                              }
                            </span>

                          </td>


                          {/* STATUS */}

                          <td className="px-2 py-3">

                            <span
                              className={`inline-flex rounded-md border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                                speaker.status,
                              )}`}
                            >
                              {
                                speaker.status
                              }
                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="relative z-40 px-2 py-3 text-center">

                            <div
                              data-speaker-action-menu
                              className="relative inline-block"
                            >

                              <motion.button
                                type="button"
                                whileHover={{
                                  scale: 1.05,
                                }}
                                whileTap={{
                                  scale: 0.9,
                                }}
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu ===
                                      speakerId
                                      ? null
                                      : speakerId,
                                  )
                                }
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                              >
                                <MoreVertical
                                  size={16}
                                />
                              </motion.button>


                              <AnimatePresence>
                                {openMenu ===
                                  speakerId && (
                                  <motion.div
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

                                    {/* VIEW */}

                                    <motion.button
                                      type="button"
                                      whileHover={{
                                        x: 2,
                                      }}
                                      whileTap={{
                                        scale: 0.98,
                                      }}
                                      onClick={() =>
                                        handleViewSpeaker(
                                          speakerId,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                                    >
                                      <Eye
                                        size={13}
                                      />

                                      View
                                    </motion.button>


                                    {/* EDIT */}

                                    <motion.button
                                      type="button"
                                      whileHover={{
                                        x: 2,
                                      }}
                                      whileTap={{
                                        scale: 0.98,
                                      }}
                                      onClick={() =>
                                        handleEditSpeaker(
                                          speakerId,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                                    >
                                      <Pencil
                                        size={13}
                                      />

                                      Edit
                                    </motion.button>


                                    {/* DELETE */}

                                    <motion.button
                                      type="button"
                                      disabled={
                                        deleteLoading ===
                                        speakerId
                                      }
                                      whileHover={{
                                        x: 2,
                                      }}
                                      whileTap={{
                                        scale: 0.98,
                                      }}
                                      onClick={() =>
                                        handleDeleteSpeaker(
                                          speaker,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                      <Trash2
                                        size={13}
                                      />

                                      Delete

                                    </motion.button>

                                  </motion.div>
                                )}
                              </AnimatePresence>

                            </div>

                          </td>

                        </motion.tr>
                      );
                    },
                  )

                ) : (

                  /* EMPTY */

                  <motion.tr
                    variants={
                      listItemVariants
                    }
                  >
                    <td
                      colSpan="7"
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
                          No speakers found
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          Try changing
                          your search or
                          filters.
                        </p>

                      </motion.div>

                    </td>
                  </motion.tr>

                )}

              </motion.tbody>

            </table>

          </div>


          {/* =====================================================
              PAGINATION
          ===================================================== */}

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
                  filteredSpeakers.length,
                )}
              </span>

              {" "}of{" "}

              <span className="font-semibold text-gray-700">
                {
                  filteredSpeakers.length
                }
              </span>

              {" "}speakers

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
                        1,
                      ),
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
                  length: totalPages,
                },
                (_, index) =>
                  index + 1,
              ).map((page) => (
                <motion.button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(
                      page,
                    )
                  }
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                    safePage === page
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
                        totalPages,
                      ),
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


      {/* =====================================================
          DELETE CONFIRMATION POPUP
          RENDERED USING PORTAL
      ===================================================== */}

      {deleteSpeakerTarget &&
        createPortal(
          <AnimatePresence>

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
              onMouseDown={(event) => {
                if (
                  event.target ===
                    event.currentTarget &&
                  !deleteLoading
                ) {
                  setDeleteSpeakerTarget(
                    null,
                  );
                }
              }}
            >

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  y: 12,
                }}
                transition={{
                  duration: 0.18,
                  ease: "easeOut",
                }}
                onMouseDown={(event) =>
                  event.stopPropagation()
                }
                className="w-full max-w-[390px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
              >

                {/* POPUP CONTENT */}

                <div className="p-5">

                  <div className="flex items-start gap-3">

                    {/* WARNING ICON */}

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">

                      <AlertTriangle
                        size={21}
                        className="text-red-500"
                      />

                    </div>


                    {/* TITLE */}

                    <div className="min-w-0 flex-1">

                      <h2 className="text-[15px] font-bold text-gray-900">
                        Delete Speaker?
                      </h2>

                      <p className="mt-1 text-[11px] leading-5 text-gray-500">
                        Are you sure you want
                        to delete this speaker?
                        This action cannot be
                        undone.
                      </p>

                    </div>


                    {/* CLOSE */}

                    {!deleteLoading && (
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteSpeakerTarget(
                            null,
                          )
                        }
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                      >
                        <X size={15} />
                      </button>
                    )}

                  </div>


                  {/* SPEAKER DETAILS */}

                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2.5">

                    <p className="truncate text-[12px] font-semibold text-gray-800">
                      {
                        deleteSpeakerTarget?.fullName ||
                        "Selected Speaker"
                      }
                    </p>

                    {deleteSpeakerTarget?.email && (
                      <p className="mt-0.5 truncate text-[10px] text-gray-500">
                        {
                          deleteSpeakerTarget.email
                        }
                      </p>
                    )}

                  </div>

                </div>


                {/* POPUP FOOTER */}

                <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-3">

                  {/* CANCEL */}

                  <button
                    type="button"
                    disabled={
                      Boolean(
                        deleteLoading,
                      )
                    }
                    onClick={() =>
                      setDeleteSpeakerTarget(
                        null,
                      )
                    }
                    className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>


                  {/* DELETE */}

                  <button
                    type="button"
                    disabled={
                      Boolean(
                        deleteLoading,
                      )
                    }
                    onClick={
                      confirmDeleteSpeaker
                    }
                    className="flex h-9 min-w-[92px] items-center justify-center gap-1.5 rounded-lg bg-red-500 px-4 text-[11px] font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {deleteLoading ? (
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

                </div>

              </motion.div>

            </motion.div>

          </AnimatePresence>,

          document.body,
        )}

    </>
  );
};


export default Speakers;