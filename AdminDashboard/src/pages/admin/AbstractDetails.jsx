import React, {
  useEffect,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Globe2,
  CalendarDays,
  Clock3,
  FileText,
  Download,
  Trash2,
  Pencil,
  Eye,
  CheckCircle2,
  XCircle,
  MapPin,
  Tag,
  ExternalLink,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchAbstractById,
  deleteAbstract,
} from "../../redux/abstractsSlice";

/* =========================================================
   HELPERS
========================================================= */

const getFullName = (abstract) => {
  const presenter =
    abstract?.presenter || {};

  return (
    [
      presenter?.title,
      presenter?.firstName,
      presenter?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    abstract?.fullName ||
    "Unknown Author"
  );
};

const getEmail = (abstract) => {
  return (
    abstract?.presenter?.email ||
    abstract?.email ||
    "-"
  );
};

const getPhone = (abstract) => {
  return (
    abstract?.presenter?.phone ||
    abstract?.phone ||
    "-"
  );
};

const getCategory = (abstract) => {
  return (
    abstract?.abstractDetails?.category ||
    abstract?.category ||
    "-"
  );
};

const getConference = (abstract) => {
  const conference =
    abstract?.conference ||
    abstract?.conferenceId;

  if (
    conference &&
    typeof conference === "object"
  ) {
    return (
      conference?.title ||
      conference?.conferenceTitle ||
      conference?.name ||
      "Conference"
    );
  }

  if (typeof conference === "string") {
    return conference;
  }

  return (
    abstract?.conferenceName ||
    abstract?.conferenceTitle ||
    "Conference"
  );
};

const getConferenceId = (abstract) => {
  const conference =
    abstract?.conference ||
    abstract?.conferenceId;

  if (
    conference &&
    typeof conference === "object"
  ) {
    return (
      conference?._id ||
      conference?.id
    );
  }

  return conference || "-";
};

const getStatus = (abstract) => {
  return (
    abstract?.status ||
    abstract?.abstractStatus ||
    "Submitted"
  );
};

const getReviewStatus = (abstract) => {
  return (
    abstract?.reviewStatus ||
    "Pending"
  );
};

const getAbstractTitle = (abstract) => {
  return (
    abstract?.abstractDetails?.title ||
    abstract?.abstractTitle ||
    abstract?.titleOfAbstract ||
    abstract?.subject ||
    "Abstract Submission"
  );
};

const getCountry = (abstract) => {
  return (
    abstract?.location?.country ||
    abstract?.country ||
    "-"
  );
};

const getAddress = (abstract) => {
  return (
    abstract?.location?.fullPostalAddress ||
    abstract?.location?.address ||
    "-"
  );
};

const getFileUrl = (abstract) => {
  return (
    abstract?.abstractFile?.fileUrl ||
    abstract?.abstractFile?.url ||
    abstract?.file?.fileUrl ||
    abstract?.file?.url ||
    abstract?.fileUrl ||
    ""
  );
};

const getFileName = (abstract) => {
  return (
    abstract?.abstractFile
      ?.originalFileName ||
    abstract?.file?.originalFileName ||
    abstract?.fileName ||
    "Abstract File"
  );
};

const getFileType = (abstract) => {
  return (
    abstract?.abstractFile?.fileType ||
    abstract?.fileType ||
    "-"
  );
};

const getFileSize = (abstract) => {
  const size =
    abstract?.abstractFile?.fileSize ||
    abstract?.fileSize;

  if (!size) return "-";

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(
      size / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(2)} MB`;
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

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

const formatDateTime = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const normalized = String(
    status || ""
  )
    .toLowerCase()
    .replace(/[_-]/g, " ");

  if (
    normalized === "accepted" ||
    normalized === "approved" ||
    normalized === "published"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        {status}
      </span>
    );
  }

  if (
    normalized === "rejected" ||
    normalized === "declined"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700">
        <XCircle size={13} />
        {status}
      </span>
    );
  }

  if (
    normalized === "under review" ||
    normalized === "review"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-700">
        <Clock3 size={13} />
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700">
      <Clock3 size={13} />
      {status || "Submitted"}
    </span>
  );
};

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
        <Icon
          size={17}
          className="text-violet-600"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-[13px] font-medium text-gray-700">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN
========================================================= */

function AbstractDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  const {
    selectedAbstract,
    detailsLoading,
    detailsError,
    deleteLoading,
  } = useSelector(
    (state) => state.abstracts
  );

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {
    if (id) {
      dispatch(
        fetchAbstractById(id)
      );
    }
  }, [id, dispatch]);

  /* =========================================================
     DOWNLOAD
  ========================================================= */

  const handleDownload = () => {
    const fileUrl =
      getFileUrl(selectedAbstract);

    if (!fileUrl) {
      window.alert(
        "Abstract file is not available."
      );
      return;
    }

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    if (!id) return;

    const result = await dispatch(
      deleteAbstract(id)
    );

    if (
      deleteAbstract.fulfilled.match(
        result
      )
    ) {
      setShowDeleteModal(false);
      navigate(
        "/admin/abstracts"
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (detailsLoading) {
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />

          <p className="mt-3 text-xs font-medium text-gray-500">
            Loading abstract details...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (
    detailsError ||
    !selectedAbstract
  ) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-700">
                Unable to load abstract
              </p>

              <p className="mt-1 text-xs text-red-600">
                {detailsError ||
                  "Abstract not found."}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/abstracts"
                )
              }
              className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const authorName =
    getFullName(
      selectedAbstract
    );

  const conferenceName =
    getConference(
      selectedAbstract
    );

  const abstractTitle =
    getAbstractTitle(
      selectedAbstract
    );

  const fileUrl =
    getFileUrl(
      selectedAbstract
    );

  /* =========================================================
     RENDER
  ========================================================= */

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
        duration: 0.3,
      }}
      className="min-w-0 w-full space-y-4"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/abstracts"
                )
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-400">
                Abstract Management
              </p>

              <h1 className="truncate text-[18px] font-bold text-gray-900">
                Abstract Details
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/abstracts/${id}/edit`
                )
              }
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[11px] font-semibold text-gray-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!fileUrl}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-3 text-[11px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={14} />
              Download
            </button>

            <button
              type="button"
              onClick={() =>
                setShowDeleteModal(true)
              }
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-[11px] font-semibold text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ABSTRACT HEADER CARD
      ===================================================== */}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <FileText
                  size={24}
                  className="text-violet-600"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600">
                  Abstract Submission
                </p>

                <h2 className="mt-1 break-words text-[20px] font-bold text-gray-900">
                  {abstractTitle}
                </h2>

                <p className="mt-1 break-words text-[12px] text-gray-500">
                  {conferenceName}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <StatusBadge
                status={getStatus(
                  selectedAbstract
                )}
              />

              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-semibold text-gray-600">
                <Clock3 size={13} />
                {getReviewStatus(
                  selectedAbstract
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          AUTHOR + CONFERENCE
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* AUTHOR */}

        <motion.div
          whileHover={{
            y: -1,
          }}
          className="rounded-xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <User
                size={17}
                className="text-violet-600"
              />

              <h3 className="text-[13px] font-bold text-gray-800">
                Author Information
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
            <InfoItem
              icon={User}
              label="Full Name"
              value={authorName}
            />

            <InfoItem
              icon={Mail}
              label="Email"
              value={getEmail(
                selectedAbstract
              )}
            />

            <InfoItem
              icon={Phone}
              label="Phone"
              value={getPhone(
                selectedAbstract
              )}
            />

            <InfoItem
              icon={Globe2}
              label="Country"
              value={getCountry(
                selectedAbstract
              )}
            />
          </div>
        </motion.div>

        {/* CONFERENCE */}

        <motion.div
          whileHover={{
            y: -1,
          }}
          className="rounded-xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={17}
                className="text-violet-600"
              />

              <h3 className="text-[13px] font-bold text-gray-800">
                Conference Information
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
            <InfoItem
              icon={FileText}
              label="Conference"
              value={
                conferenceName
              }
            />

            <InfoItem
              icon={Tag}
              label="Category"
              value={getCategory(
                selectedAbstract
              )}
            />

            <InfoItem
              icon={FileText}
              label="Conference ID"
              value={getConferenceId(
                selectedAbstract
              )}
            />

            <InfoItem
              icon={CalendarDays}
              label="Submitted On"
              value={formatDateTime(
                selectedAbstract?.createdAt
              )}
            />
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          LOCATION
      ===================================================== */}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <MapPin
              size={17}
              className="text-violet-600"
            />

            <h3 className="text-[13px] font-bold text-gray-800">
              Location Information
            </h3>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <InfoItem
              icon={Globe2}
              label="Country"
              value={getCountry(
                selectedAbstract
              )}
            />

            <InfoItem
              icon={MapPin}
              label="Postal Address"
              value={getAddress(
                selectedAbstract
              )}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          ABSTRACT INFORMATION
      ===================================================== */}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FileText
              size={17}
              className="text-violet-600"
            />

            <h3 className="text-[13px] font-bold text-gray-800">
              Abstract Information
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            icon={Tag}
            label="Category"
            value={getCategory(
              selectedAbstract
            )}
          />

          <InfoItem
            icon={Clock3}
            label="Status"
            value={getStatus(
              selectedAbstract
            )}
          />

          <InfoItem
            icon={Eye}
            label="Review Status"
            value={getReviewStatus(
              selectedAbstract
            )}
          />

          <InfoItem
            icon={CalendarDays}
            label="Submitted Date"
            value={formatDate(
              selectedAbstract?.createdAt
            )}
          />
        </div>
      </div>

      {/* =====================================================
          FILE CARD
      ===================================================== */}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FileText
              size={17}
              className="text-violet-600"
            />

            <h3 className="text-[13px] font-bold text-gray-800">
              Submitted File
            </h3>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                <FileText
                  size={18}
                  className="text-violet-600"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-gray-800">
                  {getFileName(
                    selectedAbstract
                  )}
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  {getFileType(
                    selectedAbstract
                  ).toUpperCase()}{" "}
                  •{" "}
                  {getFileSize(
                    selectedAbstract
                  )}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {fileUrl && (
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      fileUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[11px] font-semibold text-gray-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                >
                  <ExternalLink
                    size={14}
                  />
                  Open
                </button>
              )}

              <button
                type="button"
                onClick={
                  handleDownload
                }
                disabled={!fileUrl}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-3 text-[11px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download
                  size={14}
                />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      <AnimatePresence>
        {showDeleteModal && (
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <Trash2
                    size={19}
                    className="text-red-500"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-gray-900">
                    Delete Abstract
                  </h3>

                  <p className="mt-1 text-[12px] leading-5 text-gray-500">
                    Are you sure you want to
                    delete this abstract? This
                    action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={
                    deleteLoading
                  }
                  onClick={() =>
                    setShowDeleteModal(
                      false
                    )
                  }
                  className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    deleteLoading
                  }
                  onClick={
                    handleDelete
                  }
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-red-600 px-4 text-[11px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-white" />
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
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AbstractDetails;