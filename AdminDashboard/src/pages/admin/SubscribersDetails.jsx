import React, { useEffect } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CalendarDays,
  Clock3,
  Users,
  Building2,
  Hash,
  CheckCircle2,
  Loader2,
  Globe2,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getSubscriberById,
  clearSubscriber,
  clearSubscriberError,
} from "../../redux/subscribeSlice";


// =========================================================
// MOTION
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

const cardVariants = {
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


// =========================================================
// COMPONENT
// =========================================================

const SubscribersDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subscriberId } = useParams();

  // =======================================================
  // REDUX
  // =======================================================

  const {
    subscriber,
    detailsLoading,
    error,
  } = useSelector(
    (state) => state.subscriber
  );


  // =======================================================
  // FETCH DETAILS
  // =======================================================

  useEffect(() => {
    if (!subscriberId) return;

    dispatch(
      getSubscriberById(subscriberId)
    );

    return () => {
      dispatch(clearSubscriber());
    };
  }, [
    dispatch,
    subscriberId,
  ]);


  // =======================================================
  // ERROR CLEAR
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
  }, [
    error,
    dispatch,
  ]);


  // =======================================================
  // HELPERS
  // =======================================================

  const getSubscriberName = () => {
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


  const getConferenceName = () => {
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
      conference?.basicInformation?.title ||
      conference?.basicInformation?.conferenceTitle ||
      conference?.title ||
      conference?.name ||
      "N/A"
    );
  };


  const getConferenceId = () => {
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
      conference?._id ||
      conference?.id ||
      "N/A"
    );
  };


  const formatDate = (date) => {
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


  const formatDateTime = (date) => {
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
        (word) =>
          word[0]
      )
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };


  // =======================================================
  // LOADING
  // =======================================================

  if (detailsLoading) {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-w-0 w-full"
      >
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col items-center">
            <Loader2
              size={30}
              className="animate-spin text-violet-600"
            />

            <p className="mt-3 text-[12px] font-medium text-gray-500">
              Loading subscriber details...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }


  // =======================================================
  // ERROR / NOT FOUND
  // =======================================================

  if (
    !subscriber ||
    error
  ) {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-w-0 w-full"
      >
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <User
              size={25}
              className="text-red-400"
            />
          </div>

          <h2 className="mt-4 text-[15px] font-semibold text-gray-800">
            Subscriber Not Found
          </h2>

          <p className="mt-1 text-[11px] text-gray-500">
            {error ||
              "Unable to load subscriber details."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/subscribers"
              )
            }
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-violet-700"
          >
            <ArrowLeft size={14} />
            Back to Subscribers
          </button>

        </div>
      </motion.div>
    );
  }


  const subscriberName =
    getSubscriberName();

  const conferenceName =
    getConferenceName();

  const conferenceId =
    getConferenceId();


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
          HEADER
      ================================================= */}

      <motion.div
        variants={cardVariants}
        className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >

        <div className="flex min-w-0 items-center gap-3">

          <motion.button
            type="button"
            whileHover={{
              x: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() =>
              navigate(-1)
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
          >
            <ArrowLeft size={15} />
          </motion.button>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-[16px] font-bold text-gray-900">
                Subscriber Details
              </h1>

              <span className="hidden rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-semibold text-violet-600 sm:inline-flex">
                Subscriber
              </span>

            </div>

            <p className="mt-0.5 truncate text-[10px] text-gray-500">
              View subscriber information
            </p>

          </div>

        </div>


        {/* STATUS */}

        <div className="flex items-center gap-1.5 self-start rounded-full border border-green-100 bg-green-50 px-2.5 py-1 sm:self-auto">

          <CheckCircle2
            size={13}
            className="text-green-600"
          />

          <span className="text-[10px] font-semibold text-green-600">
            {subscriber.status ||
              "Active"}
          </span>

        </div>

      </motion.div>


      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <motion.div
        variants={cardVariants}
        className="rounded-xl border border-violet-100 bg-white p-4 shadow-sm"
      >

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          {/* AVATAR */}

          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700"
          >
            {getInitials(
              subscriberName
            )}
          </motion.div>


          {/* NAME */}

          <div className="min-w-0 flex-1">

            <p className="text-[10px] font-medium uppercase tracking-wide text-violet-500">
              Subscriber
            </p>

            <h2 className="mt-0.5 truncate text-[20px] font-bold text-gray-900">
              {subscriberName}
            </h2>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">

              <div className="flex items-center gap-1.5">
                <Mail
                  size={12}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-600">
                  {subscriber.email ||
                    "-"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Phone
                  size={12}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-600">
                  {subscriber.phoneNumber ||
                    "-"}
                </span>
              </div>

            </div>

          </div>

        </div>

      </motion.div>


      {/* =================================================
          INFORMATION GRID
      ================================================= */}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

        {/* =================================================
            SUBSCRIBER INFORMATION
        ================================================= */}

        <motion.div
          variants={cardVariants}
          className="rounded-xl border border-gray-100 bg-white shadow-sm"
        >

          <div className="border-b border-gray-100 px-4 py-3">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                <User
                  size={16}
                  className="text-violet-600"
                />
              </div>

              <div>
                <h3 className="text-[12px] font-semibold text-gray-800">
                  Subscriber Information
                </h3>

                <p className="text-[9px] text-gray-400">
                  Personal details
                </p>
              </div>

            </div>

          </div>


          <div className="divide-y divide-gray-50">

            {/* NAME */}

            <div className="flex items-center justify-between gap-4 px-4 py-3">

              <div className="flex items-center gap-2">

                <User
                  size={13}
                  className="text-gray-400"
                />

                <span className="text-[10px] text-gray-500">
                  Name
                </span>

              </div>

              <span className="text-right text-[11px] font-semibold text-gray-800">
                {subscriberName}
              </span>

            </div>


            {/* EMAIL */}

            <div className="flex items-center justify-between gap-4 px-4 py-3">

              <div className="flex items-center gap-2">

                <Mail
                  size={13}
                  className="text-gray-400"
                />

                <span className="text-[10px] text-gray-500">
                  Email
                </span>

              </div>

              <span className="max-w-[65%] truncate text-right text-[11px] font-medium text-gray-700">
                {subscriber.email ||
                  "-"}
              </span>

            </div>


            {/* PHONE */}

            <div className="flex items-center justify-between gap-4 px-4 py-3">

              <div className="flex items-center gap-2">

                <Phone
                  size={13}
                  className="text-gray-400"
                />

                <span className="text-[10px] text-gray-500">
                  Phone Number
                </span>

              </div>

              <span className="text-[11px] font-medium text-gray-700">
                {subscriber.phoneNumber ||
                  "-"}
              </span>

            </div>


            {/* STATUS */}

            <div className="flex items-center justify-between gap-4 px-4 py-3">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={13}
                  className="text-gray-400"
                />

                <span className="text-[10px] text-gray-500">
                  Status
                </span>

              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[9px] font-semibold text-green-600">

                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                {subscriber.status ||
                  "Active"}

              </span>

            </div>

          </div>

        </motion.div>


        {/* =================================================
            CONFERENCE INFORMATION
        ================================================= */}

        <motion.div
          variants={cardVariants}
          className="rounded-xl border border-gray-100 bg-white shadow-sm"
        >

          <div className="border-b border-gray-100 px-4 py-3">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                <Building2
                  size={16}
                  className="text-violet-600"
                />
              </div>

              <div>
                <h3 className="text-[12px] font-semibold text-gray-800">
                  Conference Information
                </h3>

                <p className="text-[9px] text-gray-400">
                  Subscription conference
                </p>
              </div>

            </div>

          </div>


          <div className="divide-y divide-gray-50">

            {/* CONFERENCE NAME */}

            <div className="px-4 py-3">

              <div className="flex items-start gap-2">

                <Globe2
                  size={13}
                  className="mt-0.5 shrink-0 text-violet-500"
                />

                <div className="min-w-0">

                  <p className="text-[10px] text-gray-500">
                    Conference
                  </p>

                  <p
                    title={
                      conferenceName
                    }
                    className="mt-1 text-[12px] font-semibold leading-5 text-gray-800"
                  >
                    {conferenceName}
                  </p>

                </div>

              </div>

            </div>


            {/* CONFERENCE ID */}

            <div className="flex items-center justify-between gap-4 px-4 py-3">

              <div className="flex items-center gap-2">

                <Hash
                  size={13}
                  className="text-gray-400"
                />

                <span className="text-[10px] text-gray-500">
                  Conference ID
                </span>

              </div>

              <span
                title={conferenceId}
                className="max-w-[60%] truncate text-right font-mono text-[10px] text-gray-600"
              >
                {conferenceId}
              </span>

            </div>


            {/* SUBSCRIBED DATE */}

            <div className="flex items-center justify-between gap-4 px-4 py-3">

              <div className="flex items-center gap-2">

                <CalendarDays
                  size={13}
                  className="text-gray-400"
                />

                <span className="text-[10px] text-gray-500">
                  Subscribed On
                </span>

              </div>

              <span className="text-[11px] font-medium text-gray-700">
                {formatDate(
                  subscriber.subscribedAt
                )}
              </span>

            </div>


            {/* CREATED DATE */}

            <div className="flex items-center justify-between gap-4 px-4 py-3">

              <div className="flex items-center gap-2">

                <Clock3
                  size={13}
                  className="text-gray-400"
                />

                <span className="text-[10px] text-gray-500">
                  Created At
                </span>

              </div>

              <span className="text-right text-[10px] text-gray-600">
                {formatDateTime(
                  subscriber.createdAt
                )}
              </span>

            </div>

          </div>

        </motion.div>

      </div>


      {/* =================================================
          SUBSCRIPTION SUMMARY
      ================================================= */}

      <motion.div
        variants={cardVariants}
        className="rounded-xl border border-violet-100 bg-violet-50/40 p-4"
      >

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">

              <Users
                size={17}
                className="text-violet-600"
              />

            </div>

            <div>

              <p className="text-[10px] font-medium text-violet-500">
                Subscription
              </p>

              <p className="text-[12px] font-semibold text-gray-800">
                {subscriberName} subscribed to this conference
              </p>

            </div>

          </div>


          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5">

            <CheckCircle2
              size={13}
              className="text-green-600"
            />

            <span className="text-[10px] font-semibold text-green-700">
              {subscriber.status ||
                "Active"}
            </span>

          </div>

        </div>

      </motion.div>


      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <div className="flex justify-start">

        <motion.button
          type="button"
          whileHover={{
            x: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() =>
            navigate(
              "/admin/subscribers"
            )
          }
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[11px] font-semibold text-gray-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
        >
          <ArrowLeft size={14} />
          Back to Subscribers
        </motion.button>

      </div>

    </motion.div>
  );
};

export default SubscribersDetails;