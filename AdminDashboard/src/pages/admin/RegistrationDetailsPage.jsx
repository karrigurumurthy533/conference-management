import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  getRegistrationsByConferenceId,
} from "../../redux/registrationsSlice";

const RegistrationDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { registrationId } = useParams();

  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 10;

  /* ============================================================
     REDUX
  ============================================================ */

  const {
    registrations: reduxRegistrations,
    loading,
    error,
  } = useSelector((state) => state.registrations || {});

  /* ============================================================
     NORMALIZE REGISTRATIONS
  ============================================================ */

  const registrations = useMemo(() => {
    if (Array.isArray(reduxRegistrations)) {
      return reduxRegistrations;
    }

    if (Array.isArray(reduxRegistrations?.data)) {
      return reduxRegistrations.data;
    }

    if (Array.isArray(reduxRegistrations?.registrations)) {
      return reduxRegistrations.registrations;
    }

    return [];
  }, [reduxRegistrations]);

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

  const getConferenceIdFromRegistration = (registration) => {
    const possibleIds = [
      registration?.conference?.conferenceId?._id,
      registration?.conference?.conferenceId?.id,
      registration?.conference?.conferenceId,
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
     GET CONFERENCE INFO
  ============================================================ */

  const getConferenceInfo = (registration) => {
    return {
      id: getConferenceIdFromRegistration(registration),

      title:
        registration?.conference?.title ||
        registration?.conference?.conferenceId?.title ||
        registration?.conferenceTitle ||
        "Conference",

      date:
        registration?.conference?.date ||
        registration?.conference?.conferenceId?.date ||
        registration?.conference?.conferenceDates ||
        registration?.conference?.conferenceId?.conferenceDates ||
        "",

      location:
        registration?.conference?.location ||
        registration?.conference?.conferenceId?.location ||
        "",

      conferenceIdObject:
        registration?.conference?.conferenceId || null,
    };
  };

  /* ============================================================
     DATE FORMAT
     
     2027-04-06T00:00:00.000Z
     ->
     April 06, 2027
     
     2027-04-06T00:00:00.000Z - 2027-04-07T00:00:00.000Z
     ->
     April 06, 2027 - April 07, 2027
  ============================================================ */

  const formatSingleDate = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const formatConferenceDate = (value) => {
    if (!value) {
      return "";
    }

    /* If date is an object */
    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      const startDate =
        value?.startDate ||
        value?.start ||
        value?.from ||
        value?.date;

      const endDate =
        value?.endDate ||
        value?.end ||
        value?.to;

      if (startDate && endDate) {
        return `${formatSingleDate(startDate)} - ${formatSingleDate(
          endDate
        )}`;
      }

      if (startDate) {
        return formatSingleDate(startDate);
      }

      return "";
    }

    /* If date is an array */
    if (Array.isArray(value)) {
      return value
        .map((item) => formatConferenceDate(item))
        .filter(Boolean)
        .join(" - ");
    }

    /* If date is already a string */
    const stringValue = String(value).trim();

    /*
      Handle:

      2027-04-06T00:00:00.000Z - 2027-04-07T00:00:00.000Z
    */

    if (stringValue.includes(" - ")) {
      const [startDate, endDate] =
        stringValue.split(" - ");

      return `${formatSingleDate(
        startDate.trim()
      )} - ${formatSingleDate(
        endDate.trim()
      )}`;
    }

    /*
      Handle:

      2027-04-06T00:00:00.000Z
    */

    return formatSingleDate(stringValue);
  };

  /* ============================================================
     SELECTED CONFERENCE FROM PREVIOUS PAGE
  ============================================================ */

  const passedConference =
    location.state?.conference || {};

  /* ============================================================
     CONFERENCE ID FROM STATE
  ============================================================ */

  const stateConferenceId =
    extractId(passedConference?.id) ||
    extractId(passedConference?._id) ||
    extractId(passedConference?.conferenceId) ||
    extractId(
      passedConference?.conferenceId?._id
    ) ||
    extractId(
      passedConference?.conferenceId?.id
    );

  /* ============================================================
     ROUTE PARAM AS CONFERENCE ID
  ============================================================ */

  const routeConferenceId =
    extractId(registrationId);

  /* ============================================================
     SELECTED CONFERENCE ID
  ============================================================ */

  const selectedConferenceId =
    stateConferenceId ||
    routeConferenceId ||
    "";

  /* ============================================================
     FETCH REGISTRATIONS
  ============================================================ */

  useEffect(() => {
    if (!selectedConferenceId) {
      return;
    }

    dispatch(
      getRegistrationsByConferenceId(
        selectedConferenceId
      )
    );
  }, [
    dispatch,
    selectedConferenceId,
  ]);

  /* ============================================================
     CONFERENCE REGISTRATIONS
  ============================================================ */

  const conferenceRegistrations = useMemo(() => {
    return registrations;
  }, [registrations]);

  /* ============================================================
     CONFERENCE INFORMATION
  ============================================================ */

  const conference = useMemo(() => {
    const firstRegistration =
      conferenceRegistrations[0];

    if (firstRegistration) {
      const apiConference =
        getConferenceInfo(
          firstRegistration
        );

      return {
        id:
          apiConference.id ||
          selectedConferenceId,

        conference:
          apiConference.title ||
          passedConference?.conference ||
          passedConference?.title ||
          "Conference",

        date:
          apiConference.date ||
          passedConference?.date ||
          "Date not available",

        location:
          apiConference.location ||
          passedConference?.location ||
          "",

        status:
          passedConference?.status ||
          "Upcoming",
      };
    }

    return {
      id:
        selectedConferenceId ||
        passedConference?.id ||
        passedConference?._id ||
        "",

      conference:
        passedConference?.conference ||
        passedConference?.title ||
        "Conference",

      date:
        passedConference?.date ||
        "Date not available",

      location:
        passedConference?.location ||
        "",

      status:
        passedConference?.status ||
        "Upcoming",
    };
  }, [
    conferenceRegistrations,
    selectedConferenceId,
    passedConference,
  ]);

  /* ============================================================
     RESET PAGINATION
  ============================================================ */

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedConferenceId]);

  /* ============================================================
     NORMALIZE USERS
  ============================================================ */

  const registeredUsers = useMemo(() => {
    return conferenceRegistrations.map(
      (registration, index) => {
        /* NAME */

        const firstName =
          registration?.firstName ||
          registration?.user?.firstName ||
          registration?.personalDetails?.firstName ||
          registration?.personalInfo?.firstName ||
          "";

        const lastName =
          registration?.lastName ||
          registration?.user?.lastName ||
          registration?.personalDetails?.lastName ||
          registration?.personalInfo?.lastName ||
          "";

        const fullName =
          registration?.fullName ||
          registration?.name ||
          registration?.user?.fullName ||
          registration?.user?.name ||
          `${firstName} ${lastName}`.trim() ||
          "Unknown User";

        /* EMAIL */

        const email =
          registration?.email ||
          registration?.user?.email ||
          registration?.personalDetails?.email ||
          registration?.personalInfo?.email ||
          "N/A";

        /* PHONE */

        const phone =
          registration?.phone ||
          registration?.phoneNumber ||
          registration?.user?.phone ||
          registration?.personalDetails?.phone ||
          registration?.personalInfo?.phone ||
          "N/A";

        /* PAYMENT STATUS */

        const rawPaymentStatus =
          registration?.paymentStatus ||
          registration?.payment?.status ||
          registration?.razorpayPayment?.status ||
          registration?.razorpay?.status ||
          registration?.status ||
          "Pending";

        const status = String(
          rawPaymentStatus
        )
          .trim()
          .toLowerCase();

        let paymentStatus = "Pending";

        if (
          status === "paid" ||
          status === "success" ||
          status === "successful" ||
          status === "completed"
        ) {
          paymentStatus = "Paid";
        } else if (
          status === "failed" ||
          status === "cancelled" ||
          status === "canceled"
        ) {
          paymentStatus = "Failed";
        } else if (
          status === "unpaid"
        ) {
          paymentStatus = "Unpaid";
        } else if (
          status === "pending"
        ) {
          paymentStatus = "Pending";
        }

        return {
          id:
            registration?._id ||
            registration?.id ||
            index,

          fullName,

          email,

          phone,

          paymentStatus,

          registrationId:
            registration?.registrationId ||
            registration?.registrationNumber ||
            registration?._id ||
            `REG-${index + 1}`,

          originalData:
            registration,
        };
      }
    );
  }, [conferenceRegistrations]);

  /* ============================================================
     COUNTS
  ============================================================ */

  const totalRegisteredUsers =
    registeredUsers.length;

  const paidRegistrations =
    registeredUsers.filter(
      (user) =>
        user.paymentStatus === "Paid"
    ).length;

  const pendingRegistrations =
    registeredUsers.filter(
      (user) =>
        user.paymentStatus === "Pending"
    ).length;

  const unpaidRegistrations =
    registeredUsers.filter(
      (user) =>
        user.paymentStatus === "Unpaid" ||
        user.paymentStatus === "Failed"
    ).length;

  /* ============================================================
     PAGINATION
  ============================================================ */

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalRegisteredUsers /
        usersPerPage
    )
  );

  const currentUsers = useMemo(() => {
    const start =
      (currentPage - 1) *
      usersPerPage;

    return registeredUsers.slice(
      start,
      start + usersPerPage
    );
  }, [
    currentPage,
    registeredUsers,
  ]);

  /* ============================================================
     KEEP PAGE VALID
  ============================================================ */

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* ============================================================
     USER CLICK
  ============================================================ */

  const handleUserClick = (user) => {
    navigate(
      `/admin/registrations/${conference.id}/user/${user.id}`,
      {
        state: {
          user,

          conference,

          registration:
            user.originalData,
        },
      }
    );
  };

  /* ============================================================
     BACK
  ============================================================ */

  const handleBack = () => {
    navigate(-1);
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (
    loading &&
    registrations.length === 0
  ) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
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
    <div className="w-full">

      {/* BACK */}

      <button
        type="button"
        onClick={handleBack}
        className="mb-4 flex items-center gap-1.5 text-[12px] font-medium text-gray-500 transition hover:text-violet-600"
      >
        <ArrowLeft size={15} />

        Back to Registrations
      </button>

      {/* ERROR */}

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-[12px] font-medium text-red-600">
            {typeof error === "string"
              ? error
              : "Failed to load registrations."}
          </p>
        </div>
      )}

      {/* ========================================================
          STAT CARDS
      ======================================================== */}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Registrations
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {totalRegisteredUsers}
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

        {/* PAID */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Paid Registrations
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {paidRegistrations}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CreditCard
                size={17}
                className="text-violet-600"
              />
            </div>

          </div>
        </div>

        {/* PENDING */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Pending Payments
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {pendingRegistrations}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <WalletCards
                size={17}
                className="text-violet-600"
              />
            </div>

          </div>
        </div>

        {/* USERS */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Registered Users
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {totalRegisteredUsers}
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

      {/* ========================================================
          CONFERENCE CARD
      ======================================================== */}

      <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
              <CalendarDays
                size={20}
                className="text-violet-600"
              />
            </div>

            <div className="min-w-0">

              <h1 className="text-[16px] font-bold text-gray-900">
                {conference.conference}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">

                {/* DATE - ONLY THIS IS CHANGED */}

                {conference.date && (
                  <p className="flex items-center gap-1 text-[11px] text-gray-500">
                    <CalendarDays
                      size={11}
                      className="text-violet-500"
                    />

                    {formatConferenceDate(
                      conference.date
                    )}
                  </p>
                )}

                {/* LOCATION */}

                {conference.location && (
                  <p className="flex items-center gap-1 text-[11px] text-gray-500">
                    <MapPin size={11} />

                    {conference.location}
                  </p>
                )}

              </div>

            </div>

          </div>

          <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-600">
            {conference.status}
          </span>

        </div>

      </div>

      {/* ========================================================
          REGISTERED USERS TABLE
      ======================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

          <div>
            <h2 className="text-[14px] font-semibold text-gray-900">
              Registered Users
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Click a user to view complete registration details.
            </p>
          </div>

          <div className="rounded-lg bg-violet-50 px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-violet-600">
              {totalRegisteredUsers} Users
            </span>
          </div>

        </div>

        {/* TABLE */}

        <div className="w-full overflow-x-auto">

          <table className="w-full min-w-[700px] table-fixed">

            <thead>

              <tr className="border-b border-gray-100 bg-gray-50/70">

                <th className="w-[28%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Full Name
                </th>

                <th className="w-[30%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                <th className="w-[22%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                </th>

                <th className="w-[20%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Payment Status
                </th>

              </tr>

            </thead>

            <tbody>

              {currentUsers.length > 0 ? (

                currentUsers.map((user) => (

                  <tr
                    key={user.id}
                    onClick={() =>
                      handleUserClick(user)
                    }
                    className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-violet-50/30"
                  >

                    {/* NAME */}

                    <td className="px-4 py-3">

                      <div className="flex min-w-0 items-center gap-2.5">

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[10px] font-bold text-violet-600">

                          {user.fullName
                            .split(" ")
                            .filter(Boolean)
                            .map(
                              (name) =>
                                name[0]
                            )
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}

                        </div>

                        <p className="truncate text-[12px] font-semibold text-gray-800">
                          {user.fullName}
                        </p>

                      </div>

                    </td>

                    {/* EMAIL */}

                    <td className="truncate px-3 py-3 text-[11px] text-gray-500">
                      {user.email}
                    </td>

                    {/* PHONE */}

                    <td className="px-3 py-3 text-[11px] text-gray-500">
                      {user.phone}
                    </td>

                    {/* STATUS */}

                    <td className="px-3 py-3">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                          user.paymentStatus ===
                          "Paid"
                            ? "bg-green-50 text-green-600"
                            : user.paymentStatus ===
                              "Pending"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {user.paymentStatus}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={4}
                    className="px-4 py-14 text-center"
                  >

                    <div className="flex flex-col items-center justify-center">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-50">
                        <Users
                          size={19}
                          className="text-violet-500"
                        />
                      </div>

                      <p className="mt-3 text-[12px] font-semibold text-gray-700">
                        No registrations found
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        No users have registered for this conference yet.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ========================================================
            PAGINATION
        ======================================================== */}

        {totalRegisteredUsers > 0 && (

          <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[10px] text-gray-500">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {(currentPage - 1) *
                  usersPerPage +
                  1}
              </span>

              {" - "}

              <span className="font-semibold text-gray-700">
                {Math.min(
                  currentPage *
                    usersPerPage,
                  totalRegisteredUsers
                )}
              </span>

              {" of "}

              <span className="font-semibold text-gray-700">
                {totalRegisteredUsers}
              </span>

            </p>

            <div className="flex items-center gap-1">

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev - 1
                  )
                }
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>

              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(page)
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

              ))}

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
                <ChevronRight size={14} />
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default RegistrationDetailsPage;