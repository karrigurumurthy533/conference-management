
import React, { useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

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
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Hash,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  getBrochureDownloadRequestById,
  clearSelectedDownload,
  selectSelectedDownload,
  selectDownloadDetailsLoading,
} from "../../redux/brochuerSlice";


const UserDownloadBrochureDetails = () => {
  const { id: routeId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* =========================================================
     REDUX
  ========================================================= */

  const downloadRequest = useSelector(
    selectSelectedDownload
  );

  const loading = useSelector(
    selectDownloadDetailsLoading
  );

  const error = useSelector(
    (state) => state.brochure?.error
  );

  /* =========================================================
     FETCH DETAILS
  ========================================================= */

  useEffect(() => {
    if (!routeId) {
      toast.error(
        "Download brochure request ID is missing"
      );

      navigate(-1);
      return;
    }

    dispatch(
      getBrochureDownloadRequestById(routeId)
    );

    return () => {
      dispatch(clearSelectedDownload());
    };
  }, [dispatch, routeId, navigate]);

  /* =========================================================
     ERROR
  ========================================================= */

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "—";
    }
  };

  /* =========================================================
     API RESPONSE

     {
       success: true,
       data: {
         _id,
         conferenceId,
         fullName,
         email,
         phone,
         country,
         requirements,
         createdAt,
         updatedAt,
         conference,
         status,
         downloadedAt
       },
       message
     }
  ========================================================= */

  const request =
    downloadRequest?.data ||
    downloadRequest ||
    {};

  /* =========================================================
     REQUEST DATA
  ========================================================= */

  const requestId =
    request?._id || "—";

  const conferenceId =
    request?.conferenceId || "";

  const fullName =
    request?.fullName || "—";

  const email =
    request?.email || "—";

  const phone =
    request?.phone || "—";

  const country =
    request?.country || "—";

  const requirements =
    request?.requirements || "";

  const conference =
    request?.conference || "Conference";

  const status =
    request?.status || "Downloaded";

  const createdAt =
    request?.createdAt;

  const updatedAt =
    request?.updatedAt;

  const downloadedAt =
    request?.downloadedAt;

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const getStatusStyle = (value) => {
    const normalized = String(
      value || ""
    )
      .toLowerCase()
      .trim();

    if (
      normalized === "downloaded" ||
      normalized === "completed" ||
      normalized === "success" ||
      normalized === "successful"
    ) {
      return {
        wrapper:
          "bg-emerald-50 border-emerald-200 text-emerald-700",
        icon: CheckCircle2,
      };
    }

    if (
      normalized === "pending" ||
      normalized === "processing"
    ) {
      return {
        wrapper:
          "bg-amber-50 border-amber-200 text-amber-700",
        icon: Clock3,
      };
    }

    if (
      normalized === "failed" ||
      normalized === "cancelled"
    ) {
      return {
        wrapper:
          "bg-red-50 border-red-200 text-red-700",
        icon: AlertCircle,
      };
    }

    return {
      wrapper:
        "bg-violet-50 border-violet-200 text-violet-700",
      icon: FileText,
    };
  };

  const statusStyle =
    getStatusStyle(status);

  const StatusIcon =
    statusStyle.icon;

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Header Skeleton */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">

              <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />

              <div className="space-y-2">
                <div className="h-5 w-56 bg-slate-200 rounded animate-pulse" />

                <div className="h-3 w-72 bg-slate-200 rounded animate-pulse" />
              </div>

            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

            <div className="lg:col-span-2 space-y-6">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="bg-white border border-slate-200 rounded-2xl p-6"
                  >
                    <div className="h-5 w-44 bg-slate-200 rounded animate-pulse mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      {[1, 2, 3, 4].map(
                        (field) => (
                          <div key={field}>

                            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse mb-2" />

                            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />

                          </div>
                        )
                      )}

                    </div>
                  </div>
                )
              )}

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 h-80">

              <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-6" />

              <div className="h-32 w-full bg-slate-200 rounded-xl animate-pulse" />

            </div>

          </div>

          <div className="flex items-center justify-center py-8 text-violet-600">

            <Loader2
              size={22}
              className="animate-spin mr-2"
            />

            Loading brochure download details...

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     EMPTY
  ========================================================= */

  if (!downloadRequest && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">

          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5">

            <AlertCircle size={30} />

          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Download Request Not Found
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            We couldn't find the brochure download
            request associated with this ID.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ===================================================
            HEADER
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm"
        >

          <div className="p-5 sm:p-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* LEFT */}

              <div className="flex items-start gap-4">

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 text-slate-600 flex items-center justify-center transition shrink-0"
                  title="Go Back"
                >
                  <ArrowLeft size={19} />
                </button>

                <div>

                  <div className="flex items-center gap-2 flex-wrap">

                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Download Brochure Details
                    </h1>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusStyle.wrapper}`}
                    >
                      <StatusIcon size={13} />
                      {status}
                    </span>

                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    View complete details of this
                    brochure download request.
                  </p>

                </div>

              </div>

              {/* RIGHT */}

              <div className="flex items-center gap-3 flex-wrap">

                {conferenceId && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin/conferences/${conferenceId}`
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 text-sm font-semibold transition"
                  >
                    <ExternalLink size={16} />
                    View Conference
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition shadow-sm"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

              </div>

            </div>

          </div>

        </motion.div>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="lg:col-span-2 space-y-6">

            {/* =================================================
                REQUESTER
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.05,
              }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >

              <div className="px-6 py-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <User size={20} />
                  </div>

                  <div>

                    <h2 className="text-base font-bold text-slate-900">
                      Requester Information
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Person who requested the brochure
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                  <InfoItem
                    icon={User}
                    label="Full Name"
                    value={fullName}
                  />

                  <InfoItem
                    icon={Mail}
                    label="Email Address"
                    value={email}
                    isEmail
                  />

                  <InfoItem
                    icon={Phone}
                    label="Phone Number"
                    value={phone}
                  />

                  <InfoItem
                    icon={Globe2}
                    label="Country"
                    value={country}
                  />

                </div>

              </div>

            </motion.div>

            {/* =================================================
                CONFERENCE
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >

              <div className="px-6 py-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <FileText size={20} />
                  </div>

                  <div>

                    <h2 className="text-base font-bold text-slate-900">
                      Conference Information
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Conference associated with this request
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6">

                <div className="p-5 rounded-xl bg-violet-50 border border-violet-100">

                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
                    Conference Name
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mt-1 break-words">
                    {conference}
                  </h3>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">

                  <InfoItem
                    icon={Hash}
                    label="Conference ID"
                    value={conferenceId}
                    mono
                  />

                  <InfoItem
                    icon={CheckCircle2}
                    label="Download Status"
                    value={status}
                  />

                </div>

              </div>

            </motion.div>

            {/* =================================================
                REQUIREMENTS
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
              }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >

              <div className="px-6 py-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>

                  <div>

                    <h2 className="text-base font-bold text-slate-900">
                      Requirements / Message
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Additional information provided by the requester
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6">

                {requirements ? (

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">

                    <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap break-words">
                      {requirements}
                    </p>

                  </div>

                ) : (

                  <div className="rounded-xl bg-slate-50 border border-dashed border-slate-300 p-6 text-center">

                    <MessageSquare
                      size={24}
                      className="mx-auto text-slate-400"
                    />

                    <p className="text-sm text-slate-500 mt-2">
                      No additional requirements were provided.
                    </p>

                  </div>

                )}

              </div>

            </motion.div>

            {/* =================================================
                REQUEST INFORMATION
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >

              <div className="px-6 py-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <ClipboardList size={20} />
                  </div>

                  <div>

                    <h2 className="text-base font-bold text-slate-900">
                      Request Information
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Download request metadata
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                  <InfoItem
                    icon={Hash}
                    label="Request ID"
                    value={requestId}
                    mono
                  />

                  <InfoItem
                    icon={Hash}
                    label="Conference ID"
                    value={conferenceId}
                    mono
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Requested On"
                    value={formatDateTime(
                      createdAt
                    )}
                  />

                  <InfoItem
                    icon={Clock3}
                    label="Last Updated"
                    value={formatDateTime(
                      updatedAt
                    )}
                  />

                  <InfoItem
                    icon={Download}
                    label="Downloaded On"
                    value={formatDateTime(
                      downloadedAt
                    )}
                  />

                  <InfoItem
                    icon={CheckCircle2}
                    label="Status"
                    value={status}
                  />

                </div>

              </div>

            </motion.div>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div className="space-y-6">

            {/* =================================================
                STATUS CARD
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: 15,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden lg:sticky lg:top-6"
            >

              <div className="p-6">

                <div className="flex items-center justify-between mb-5">

                  <h2 className="text-base font-bold text-slate-900">
                    Download Status
                  </h2>

                  <Download
                    size={20}
                    className="text-violet-600"
                  />

                </div>

                <div
                  className={`rounded-2xl border p-5 ${statusStyle.wrapper}`}
                >

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-white/80 flex items-center justify-center">
                      <StatusIcon size={22} />
                    </div>

                    <div>

                      <p className="text-xs font-medium opacity-80">
                        Current Status
                      </p>

                      <p className="text-lg font-bold mt-0.5">
                        {status}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="mt-6 space-y-4">

                  <SideDetail
                    label="Requester"
                    value={fullName}
                  />

                  <SideDetail
                    label="Email"
                    value={email}
                  />

                  <SideDetail
                    label="Phone"
                    value={phone}
                  />

                  <SideDetail
                    label="Country"
                    value={country}
                  />

                  <SideDetail
                    label="Downloaded"
                    value={formatDate(
                      downloadedAt
                    )}
                  />

                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">

                  {conferenceId && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/conferences/${conferenceId}`
                        )
                      }
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition"
                    >
                      <ExternalLink size={17} />
                      Open Conference
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
                  >
                    <ArrowLeft size={17} />
                    Back to Downloads
                  </button>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  icon: Icon,
  label,
  value,
  isEmail = false,
  mono = false,
}) => {
  return (
    <div className="min-w-0">

      <div className="flex items-center gap-2 text-slate-400 mb-1.5">

        {Icon && <Icon size={14} />}

        <span className="text-xs font-medium">
          {label}
        </span>

      </div>

      {isEmail &&
      value &&
      value !== "—" ? (
        <a
          href={`mailto:${value}`}
          className="text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline break-all"
        >
          {value}
        </a>
      ) : (
        <p
          className={`text-sm font-semibold text-slate-800 break-words ${
            mono
              ? "font-mono text-xs"
              : ""
          }`}
        >
          {value || "—"}
        </p>
      )}

    </div>
  );
};


/* =========================================================
   SIDE DETAIL
========================================================= */

const SideDetail = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-start justify-between gap-4">

      <span className="text-xs text-slate-500 shrink-0">
        {label}
      </span>

      <span className="text-xs font-semibold text-slate-800 text-right break-all">
        {value || "—"}
      </span>

    </div>
  );
};


export default UserDownloadBrochureDetails;