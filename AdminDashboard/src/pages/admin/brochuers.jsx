import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Layers3,
  FileText,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

import { createPortal } from "react-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  getAllBrochures,
  deleteBrochure,
} from "../../redux/brochuerSlice";

import {
  downloadBrochureApi,
} from "../../api/brochureApi";


const BrochureManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    brochures,
    loading,
    error,
    deleteLoading,
  } = useSelector(
    (state) => state.brochure
  );


  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedBrochure, setSelectedBrochure] =
    useState(null);

  const [openActionId, setOpenActionId] =
    useState(null);

  const [actionMenuPosition, setActionMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const [downloadingId, setDownloadingId] =
    useState(null);

  const [viewingId, setViewingId] =
    useState(null);

  const [deleteModal, setDeleteModal] =
    useState(null);


  const actionMenuRef = useRef(null);

  const actionButtonRef = useRef(null);


  const itemsPerPage = 10;


  // ============================================================
  // FETCH BROCHURES
  // ============================================================

  useEffect(() => {
    dispatch(getAllBrochures());
  }, [dispatch]);


  // ============================================================
  // SORT BROCHURES
  // ============================================================

  const brochureData = useMemo(() => {
    if (!Array.isArray(brochures)) {
      return [];
    }

    return [...brochures].sort((a, b) => {
      const dateA = new Date(
        a.createdAt ||
          a.updatedAt ||
          0
      ).getTime();

      const dateB = new Date(
        b.createdAt ||
          b.updatedAt ||
          0
      ).getTime();

      return dateB - dateA;
    });
  }, [brochures]);


  // ============================================================
  // STATS
  // ============================================================

  const brochureStats = useMemo(() => {
    const total =
      brochureData.length;

    const uploaded =
      brochureData.filter(
        (item) =>
          item.status === "uploaded"
      ).length;

    const pending =
      brochureData.filter(
        (item) =>
          item.status === "pending"
      ).length;

    return {
      total,
      uploaded,
      pending,
    };
  }, [brochureData]);


  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      brochureData.length /
        itemsPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const currentBrochures =
    brochureData.slice(
      startIndex,
      startIndex + itemsPerPage
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


  // ============================================================
  // GET CONFERENCE NAME
  // ============================================================

  const getConferenceName = (
    brochure
  ) => {
    if (
      brochure?.conferenceTitle
    ) {
      return brochure.conferenceTitle;
    }

    if (
      brochure?.conference?.title
    ) {
      return brochure.conference.title;
    }

    const conference =
      brochure?.conferenceId;

    if (
      typeof conference ===
      "string"
    ) {
      return (
        brochure?.conferenceName ||
        conference
      );
    }

    return (
      conference?.basicInformation
        ?.title ||
      conference?.basicInformation
        ?.conferenceTitle ||
      conference?.title ||
      conference?.name ||
      brochure?.conferenceName ||
      "-"
    );
  };


  // ============================================================
  // GET CONFERENCE ID
  // ============================================================

  const getConferenceId = (
    brochure
  ) => {
    const conference =
      brochure?.conferenceId;

    if (
      typeof conference ===
      "string"
    ) {
      return conference;
    }

    return (
      conference?._id ||
      conference?.id ||
      brochure?.conference?._id ||
      brochure?.conference?.id ||
      ""
    );
  };


  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "uploaded":
        return "bg-emerald-50 text-emerald-600";

      case "pending":
        return "bg-amber-50 text-amber-600";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const formattedDate =
      new Date(date);

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return "-";
    }

    return formattedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ============================================================
  // CLOSE ACTION MENU
  // ============================================================

  const closeActionMenu = () => {
    setOpenActionId(null);

    setActionMenuPosition({
      top: 0,
      left: 0,
    });
  };


  // ============================================================
  // ACTION MENU
  // ============================================================

  const handleActionMenu = (
    event,
    brochure
  ) => {
    event.stopPropagation();

    if (
      openActionId ===
      brochure._id
    ) {
      closeActionMenu();
      return;
    }

    const button =
      event.currentTarget;

    const rect =
      button.getBoundingClientRect();

    const menuWidth = 180;
    const menuHeight = 190;
    const gap = 8;
    const viewportPadding = 10;

    let top =
      rect.top -
      menuHeight -
      gap;

    let left =
      rect.right -
      menuWidth;

    if (
      top <
      viewportPadding
    ) {
      top =
        rect.bottom +
        gap;
    }

    if (
      top +
        menuHeight >
      window.innerHeight -
        viewportPadding
    ) {
      top =
        window.innerHeight -
        menuHeight -
        viewportPadding;
    }

    if (
      left <
      viewportPadding
    ) {
      left =
        viewportPadding;
    }

    if (
      left +
        menuWidth >
      window.innerWidth -
        viewportPadding
    ) {
      left =
        window.innerWidth -
        menuWidth -
        viewportPadding;
    }

    actionButtonRef.current =
      button;

    setActionMenuPosition({
      top,
      left,
    });

    setOpenActionId(
      brochure._id
    );
  };


  // ============================================================
  // OUTSIDE CLICK
  // ============================================================

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        actionMenuRef.current &&
        actionMenuRef.current.contains(
          event.target
        )
      ) {
        return;
      }

      if (
        actionButtonRef.current &&
        actionButtonRef.current.contains(
          event.target
        )
      ) {
        return;
      }

      closeActionMenu();
    };

    const handleResize = () => {
      closeActionMenu();
    };

    const handleScroll = () => {
      closeActionMenu();
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      true
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );
    };
  }, []);


  // ============================================================
  // VIEW BROCHURE
  // ============================================================

  const handleViewBrochure = async (
    brochure
  ) => {
    try {
      closeActionMenu();

      setViewingId(
        brochure._id
      );

      const response =
        await downloadBrochureApi(
          brochure._id
        );

      const blob =
        new Blob(
          [response.data],
          {
            type: "application/pdf",
          }
        );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const newWindow =
        window.open(
          url,
          "_blank"
        );

      if (!newWindow) {
        window.alert(
          "Please allow popups in your browser to preview the PDF."
        );
      }

      setTimeout(() => {
        window.URL.revokeObjectURL(
          url
        );
      }, 60000);

    } catch (error) {
      console.error(
        "Brochure preview error:",
        error
      );

      window.alert(
        error?.response?.data
          ?.message ||
          "Failed to preview brochure"
      );

    } finally {
      setViewingId(null);
    }
  };


  // ============================================================
  // DOWNLOAD BROCHURE
  // ============================================================

  const handleDownloadBrochure =
    async (brochure) => {
      try {
        closeActionMenu();

        setDownloadingId(
          brochure._id
        );

        const response =
          await downloadBrochureApi(
            brochure._id
          );

        const blob =
          new Blob(
            [response.data],
            {
              type: "application/pdf",
            }
          );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          brochure.originalFilename ||
          `${
            brochure.title ||
            "brochure"
          }.pdf`;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          url
        );

      } catch (error) {
        console.error(
          "Brochure download error:",
          error
        );

        window.alert(
          error?.response?.data
            ?.message ||
            "Failed to download brochure"
        );

      } finally {
        setDownloadingId(null);
      }
    };


  // ============================================================
  // EDIT
  // ============================================================

  const handleEdit = (
    brochure
  ) => {
    closeActionMenu();

    navigate(
      "/admin/brochures/upload",
      {
        state: {
          editMode: true,

          brochureId:
            brochure._id,

          brochure: {
            ...brochure,

            conferenceId:
              getConferenceId(
                brochure
              ),

            conferenceName:
              getConferenceName(
                brochure
              ),
          },
        },
      }
    );
  };


  // ============================================================
  // DELETE
  // ============================================================

  const handleDeleteClick = (
    brochure
  ) => {
    closeActionMenu();

    setDeleteModal(
      brochure
    );
  };


  const handleConfirmDelete =
    async () => {
      if (
        !deleteModal?._id
      ) {
        return;
      }

      try {
        await dispatch(
          deleteBrochure(
            deleteModal._id
          )
        ).unwrap();

        setDeleteModal(null);

        setSelectedBrochure(
          null
        );

        dispatch(
          getAllBrochures()
        );

      } catch (error) {
        console.error(
          "Delete brochure error:",
          error
        );
      }
    };


  // ============================================================
  // STAT CARDS
  // ============================================================

  const statCards = [
    {
      title: "Total Brochures",
      value:
        brochureStats.total,
      icon: Layers3,
      description:
        "All conference brochures",
    },

    {
      title: "Uploaded",
      value:
        brochureStats.uploaded,
      icon: FileText,
      description:
        "Successfully uploaded",
    },

    {
      title: "Pending",
      value:
        brochureStats.pending,
      icon: FileText,
      description:
        "Pending brochures",
    },
  ];


  const activeActionBrochure =
    brochureData.find(
      (brochure) =>
        brochure._id ===
        openActionId
    );


  return (
    <div className="relative w-full min-w-0">

      <div className="animate-[fadeIn_0.35s_ease-out]">

        {/* ======================================================
            STAT CARDS
        ====================================================== */}

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {statCards.map(
            (card, index) => {
              const Icon =
                card.icon;

              return (
                <div
                  key={
                    card.title
                  }
                  style={{
                    animationDelay: `${index * 60}ms`,
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
                        strokeWidth={
                          2
                        }
                        className="text-violet-600"
                      />

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>


        {/* ======================================================
            TABLE
        ====================================================== */}

        <div className="relative w-full rounded-xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

          <div className="overflow-x-auto rounded-xl">

            <table className="w-full min-w-[1000px] table-fixed">

              {/* =================================================
                  TABLE HEADER
              ================================================= */}

              <thead>

                <tr className="border-b border-gray-100 bg-gray-50/80">

                  {/* BROCHURE TITLE - 20% */}

                  <th className="w-[20%] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Brochure Title
                  </th>


                  {/* CONFERENCE NAME - 38% */}

                  <th className="w-[38%] pl-1 pr-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Conference Name
                  </th>


                  {/* STATUS - 15% */}

                  <th className="w-[15%] px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>


                  {/* UPLOADED DATE - 17% */}

                  <th className="w-[17%] px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Uploaded Date
                  </th>


                  {/* ACTIONS - 10% */}

                  <th className="w-[10%] px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>


              {/* =================================================
                  TABLE BODY
              ================================================= */}

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-4 py-14 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-violet-100 border-t-violet-600" />

                        <p className="mt-3 text-[13px] font-medium text-gray-500">
                          Loading brochure data...
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : error ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center"
                    >

                      <p className="text-[13px] font-medium text-red-500">
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            getAllBrochures()
                          )
                        }
                        className="mt-3 rounded-lg bg-violet-600 px-3 py-1.5 text-[12px] font-semibold text-white"
                      >
                        Retry
                      </button>

                    </td>

                  </tr>

                ) : currentBrochures.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center"
                    >

                      <p className="text-[13px] font-medium text-gray-500">
                        No brochures found.
                      </p>

                    </td>

                  </tr>

                ) : (

                  currentBrochures.map(
                    (
                      brochure,
                      index
                    ) => (

                      <tr
                        key={
                          brochure._id ||
                          index
                        }
                        style={{
                          animationDelay: `${index * 45}ms`,
                        }}
                        className="animate-[fadeUp_0.35s_ease-out_both] border-b border-gray-100 last:border-0 transition duration-200 hover:bg-violet-50/30"
                      >

                        {/* ========================================
                            BROCHURE TITLE
                        ======================================== */}

                        <td className="px-4 py-3 align-top">

                          <p
                            title={
                              brochure.title
                            }
                            className="break-words text-[13px] font-semibold leading-5 text-gray-800"
                          >
                            {
                              brochure.title ||
                              "-"
                            }
                          </p>

                        </td>


                        {/* ========================================
                            CONFERENCE NAME
                        ======================================== */}

                        <td className="pl-1 pr-2 py-3 align-top">

                          <p
                            title={getConferenceName(
                              brochure
                            )}
                            className="whitespace-normal break-words text-[12px] font-medium leading-5 text-gray-700"
                          >
                            {getConferenceName(
                              brochure
                            )}
                          </p>

                        </td>


                        {/* ========================================
                            STATUS
                        ======================================== */}

                        <td className="px-2 py-3 align-top">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                              brochure.status
                            )}`}
                          >
                            {
                              brochure.status ||
                              "pending"
                            }
                          </span>

                        </td>


                        {/* ========================================
                            UPLOADED DATE
                        ======================================== */}

                        <td className="px-2 py-3 align-top">

                          <p className="whitespace-nowrap text-[12px] text-gray-500">
                            {formatDate(
                              brochure.createdAt
                            )}
                          </p>

                        </td>


                        {/* ========================================
                            ACTIONS
                        ======================================== */}

                        <td className="px-2 py-3 align-top">

                          <div className="flex items-center justify-center">

                            <button
                              ref={(element) => {
                                if (
                                  openActionId ===
                                  brochure._id
                                ) {
                                  actionButtonRef.current =
                                    element;
                                }
                              }}
                              type="button"
                              onClick={(
                                event
                              ) =>
                                handleActionMenu(
                                  event,
                                  brochure
                                )
                              }
                              className="inline-flex items-center justify-center rounded-md px-2 py-1.5 text-[12px] font-semibold text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                            >

                              <MoreVertical
                                size={
                                  15
                                }
                                strokeWidth={
                                  2
                                }
                              />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>


          {/* ======================================================
              PAGINATION
          ====================================================== */}

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">

            <p className="text-[11px] text-gray-500">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {
                  brochureData.length ===
                  0
                    ? 0
                    : startIndex + 1
                }
              </span>

              {" "}to{" "}

              <span className="font-semibold text-gray-700">
                {Math.min(
                  startIndex +
                    itemsPerPage,
                  brochureData.length
                )}
              </span>

              {" "}of{" "}

              <span className="font-semibold text-gray-700">
                {
                  brochureData.length
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
                onClick={() =>
                  setCurrentPage(
                    (
                      previousPage
                    ) =>
                      previousPage -
                      1
                  )
                }
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
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
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
                onClick={() =>
                  setCurrentPage(
                    (
                      previousPage
                    ) =>
                      previousPage +
                      1
                  )
                }
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

      {openActionId &&
        activeActionBrochure &&
        createPortal(

          <div
            ref={
              actionMenuRef
            }
            className="fixed z-[999999] w-[180px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.22)]"
            style={{
              top: `${actionMenuPosition.top}px`,
              left: `${actionMenuPosition.left}px`,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              onClick={() =>
                handleViewBrochure(
                  activeActionBrochure
                )
              }
              disabled={
                viewingId ===
                activeActionBrochure._id
              }
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Eye
                size={15}
              />

              {
                viewingId ===
                activeActionBrochure._id
                  ? "Opening..."
                  : "View"
              }

            </button>


            <button
              type="button"
              onClick={() =>
                handleDownloadBrochure(
                  activeActionBrochure
                )
              }
              disabled={
                downloadingId ===
                activeActionBrochure._id
              }
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Download
                size={15}
              />

              {
                downloadingId ===
                activeActionBrochure._id
                  ? "Downloading..."
                  : "Download"
              }

            </button>


            <button
              type="button"
              onClick={() =>
                handleEdit(
                  activeActionBrochure
                )
              }
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
            >

              <Pencil
                size={15}
              />

              Edit

            </button>


            <div className="my-1 border-t border-gray-100" />


            <button
              type="button"
              onClick={() =>
                handleDeleteClick(
                  activeActionBrochure
                )
              }
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
            >

              <Trash2
                size={15}
              />

              Delete

            </button>

          </div>,

          document.body
        )}


      {/* ==========================================================
          BROCHURE DETAILS MODAL
      ========================================================== */}

      {selectedBrochure && (

        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]"
          onClick={() =>
            setSelectedBrochure(
              null
            )
          }
        >

          <div
            className="w-full max-w-[420px] rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-[16px] font-bold text-gray-900">
                  Brochure Details
                </h2>

                <p className="mt-1 text-[11px] text-gray-400">
                  Conference brochure information
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedBrochure(
                    null
                  )
                }
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >

                <X
                  size={15}
                />

              </button>

            </div>


            <div className="mt-5 space-y-3">

              <div className="rounded-lg bg-gray-50 px-3 py-2.5">

                <p className="text-[10px] font-medium text-gray-400">
                  Brochure Title
                </p>

                <p className="mt-1 text-[12px] font-semibold text-gray-800">
                  {
                    selectedBrochure.title ||
                    "-"
                  }
                </p>

              </div>


              <div className="rounded-lg bg-gray-50 px-3 py-2.5">

                <p className="text-[10px] font-medium text-gray-400">
                  Conference
                </p>

                <p className="mt-1 text-[12px] font-semibold text-gray-800">
                  {
                    getConferenceName(
                      selectedBrochure
                    )
                  }
                </p>

              </div>


              <div className="rounded-lg bg-gray-50 px-3 py-2.5">

                <p className="text-[10px] font-medium text-gray-400">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                    selectedBrochure.status
                  )}`}
                >
                  {
                    selectedBrochure.status ||
                    "pending"
                  }
                </span>

              </div>


              <div className="rounded-lg bg-gray-50 px-3 py-2.5">

                <p className="text-[10px] font-medium text-gray-400">
                  Uploaded Date
                </p>

                <p className="mt-1 text-[12px] font-semibold text-gray-800">
                  {
                    formatDate(
                      selectedBrochure.createdAt
                    )
                  }
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  handleViewBrochure(
                    selectedBrochure
                  )
                }
                disabled={
                  viewingId ===
                  selectedBrochure._id
                }
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 text-[12px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {
                  viewingId ===
                  selectedBrochure._id ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-200 border-t-white" />
                      Opening PDF...
                    </>
                  ) : (
                    <>
                      <Eye
                        size={15}
                      />
                      Preview PDF
                    </>
                  )
                }

              </button>


              <button
                type="button"
                onClick={() =>
                  handleDownloadBrochure(
                    selectedBrochure
                  )
                }
                disabled={
                  downloadingId ===
                  selectedBrochure._id
                }
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 text-[12px] font-semibold text-violet-600 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {
                  downloadingId ===
                  selectedBrochure._id ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download
                        size={15}
                      />
                      Download PDF
                    </>
                  )
                }

              </button>

            </div>


            <button
              type="button"
              onClick={() =>
                setSelectedBrochure(
                  null
                )
              }
              className="mt-3 h-9 w-full rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Close
            </button>

          </div>

        </div>

      )}


      {/* ==========================================================
          DELETE MODAL
      ========================================================== */}

      {deleteModal && (

        <div
          className="fixed inset-0 z-[110000] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]"
          onClick={() =>
            setDeleteModal(
              null
            )
          }
        >

          <div
            className="w-full max-w-[380px] rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">

                <AlertTriangle
                  size={19}
                  className="text-red-500"
                />

              </div>


              <button
                type="button"
                onClick={() =>
                  setDeleteModal(
                    null
                  )
                }
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"
              >

                <X
                  size={15}
                />

              </button>

            </div>


            <h2 className="mt-4 text-[16px] font-bold text-gray-900">
              Delete Brochure?
            </h2>


            <p className="mt-2 text-[12px] leading-5 text-gray-500">

              Are you sure you want to delete{" "}

              <span className="font-semibold text-gray-700">
                {
                  deleteModal.title
                }
              </span>

              ? This will also remove the brochure file from Cloudinary.

            </p>


            <div className="mt-5 flex gap-2">

              <button
                type="button"
                onClick={() =>
                  setDeleteModal(
                    null
                  )
                }
                className="h-9 flex-1 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleConfirmDelete
                }
                disabled={
                  deleteLoading
                }
                className="h-9 flex-1 rounded-lg bg-red-500 text-[12px] font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {
                  deleteLoading
                    ? "Deleting..."
                    : "Delete"
                }

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==========================================================
          ANIMATIONS
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
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

      `}</style>

    </div>
  );
};


export default BrochureManagement;