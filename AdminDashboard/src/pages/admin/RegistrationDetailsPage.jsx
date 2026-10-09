
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
import { getRegistrationsByConferenceId } from "../../redux/registrationsSlice";

const RegistrationDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationId } = useParams();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Redux state
  const {
    conferenceRegisteredUsers = [],
    conferenceRegisteredLoading = false,
    conferenceRegisteredError = null,
  } = useSelector((state) => state.registrations || {});

  const passedConference = location.state?.conference || {};

  // Extract ID safely
  const extractId = (value) => {
    if (!value) return "";

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (typeof value === "object") {
      return String(value._id || value.id || "");
    }

    return "";
  };

  const selectedConferenceId =
    extractId(passedConference.id) ||
    extractId(passedConference._id) ||
    extractId(passedConference.conferenceId) ||
    extractId(passedConference.conferenceId?._id) ||
    extractId(registrationId);

  // Fetch conference registrations
  useEffect(() => {
    if (selectedConferenceId) {
      dispatch(getRegistrationsByConferenceId(selectedConferenceId));
    }
  }, [dispatch, selectedConferenceId]);

  // Reset pagination when conference changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedConferenceId]);

  // Normalize API response
  const registrations = useMemo(() => {
    let value = conferenceRegisteredUsers;

    for (let i = 0; i < 4; i += 1) {
      if (Array.isArray(value)) {
        return value;
      }

      if (value && Array.isArray(value.data)) {
        value = value.data;
        continue;
      }

      if (value && Array.isArray(value.registrations)) {
        value = value.registrations;
        continue;
      }

      break;
    }

    return Array.isArray(value) ? value : [];
  }, [conferenceRegisteredUsers]);

  // Format individual date
  const formatSingleDate = (value) => {
    if (!value) return "";

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

  // Format conference date range
  const formatConferenceDate = (value) => {
    if (!value) return "";

    if (typeof value === "object" && !Array.isArray(value)) {
      const start =
        value.startDate || value.start || value.from || value.date;
      const end = value.endDate || value.end || value.to;

      if (start && end) {
        return `${formatSingleDate(start)} - ${formatSingleDate(end)}`;
      }

      return start ? formatSingleDate(start) : "";
    }

    if (Array.isArray(value)) {
      return value
        .map(formatConferenceDate)
        .filter(Boolean)
        .join(" - ");
    }

    const stringValue = String(value);

    if (stringValue.includes(" - ")) {
      const [start, end] = stringValue.split(" - ");

      return `${formatSingleDate(start.trim())} - ${formatSingleDate(
        end.trim()
      )}`;
    }

    return formatSingleDate(stringValue);
  };

  // Conference information from API
  const conference = useMemo(() => {
    const first = registrations[0];
    const apiConference = first?.conference || {};
    const conferenceObject = apiConference.conferenceId || {};

    return {
      id:
        extractId(conferenceObject) ||
        extractId(apiConference.conferenceId) ||
        selectedConferenceId,
      title:
        apiConference.title ||
        conferenceObject.title ||
        passedConference.conference ||
        passedConference.title ||
        "Conference",
      date:
        apiConference.date ||
        conferenceObject.date ||
        passedConference.date ||
        "",
      location:
        apiConference.location ||
        conferenceObject.location ||
        passedConference.location ||
        "",
      status: passedConference.status || "Upcoming",
    };
  }, [registrations, selectedConferenceId, passedConference]);

  // Map API registration fields
  const registeredUsers = useMemo(() => {
    return registrations.map((item, index) => {
      const firstName =
        item.firstName ||
        item.user?.firstName ||
        item.personalDetails?.firstName ||
        "";

      const lastName =
        item.lastName ||
        item.user?.lastName ||
        item.personalDetails?.lastName ||
        "";

      const fullName =
        item.fullName ||
        item.user?.fullName ||
        `${firstName} ${lastName}`.trim() ||
        "Unknown User";

      const registration = item.registration || {};
      const address = item.location || {};

      const rawPaymentStatus = String(
        item.paymentStatus ||
          item.payment?.status ||
          item.status ||
          "Pending"
      )
        .trim()
        .toLowerCase();

      let paymentStatus = "Pending";

      if (
        ["paid", "success", "successful", "completed"].includes(
          rawPaymentStatus
        )
      ) {
        paymentStatus = "Paid";
      } else if (
        ["failed", "cancelled", "canceled"].includes(rawPaymentStatus)
      ) {
        paymentStatus = "Failed";
      } else if (rawPaymentStatus === "unpaid") {
        paymentStatus = "Unpaid";
      }

      return {
        id: item._id || item.id || `registration-${index}`,
        title: item.title || "",
        fullName,
        email: item.email || item.user?.email || "N/A",
        phone:
          item.phone ||
          item.phoneNumber ||
          item.user?.phone ||
          "N/A",

        category: registration.category || "N/A",
        option: registration.option || "N/A",
        price: registration.price ?? null,
        currency: registration.currency || "",

        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "",
        address: address.address || "",

        paymentStatus,
        registrationStatus: item.status || "Pending",
        paymentOrderId: item.paymentOrderId || "",
        paymentId: item.paymentId || "",
        paymentSignature: item.paymentSignature || "",
        createdAt: item.createdAt || "",
        updatedAt: item.updatedAt || "",
        originalData: item,
      };
    });
  }, [registrations]);

  // Summary statistics
  const totalRegisteredUsers = registeredUsers.length;

  const paidRegistrations = registeredUsers.filter(
    (user) => user.paymentStatus === "Paid"
  ).length;

  const pendingRegistrations = registeredUsers.filter(
    (user) => user.paymentStatus === "Pending"
  ).length;

  const unpaidRegistrations = registeredUsers.filter((user) =>
    ["Unpaid", "Failed"].includes(user.paymentStatus)
  ).length;

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(totalRegisteredUsers / usersPerPage)
  );

  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return registeredUsers.slice(start, start + usersPerPage);
  }, [currentPage, registeredUsers]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Navigate to full registration details
  const handleUserClick = (user) => {
    navigate(`/admin/registrations/${conference.id}/user/${user.id}`, {
      state: {
        user,
        conference,
        registration: user.originalData,
      },
    });
  };

  // Status badge styling
  const getStatusClass = (status) => {
    if (status === "Paid") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Pending") {
      return "bg-amber-50 text-amber-700";
    }

    if (status === "Unpaid") {
      return "bg-orange-50 text-orange-700";
    }

    return "bg-red-50 text-red-600";
  };

  // Display amount with API currency
  const formatAmount = (price, currency) => {
    if (price === null || price === undefined || price === "") {
      return "N/A";
    }

    const amount = Number(price);

    if (Number.isNaN(amount)) {
      return "N/A";
    }

    return `${currency ? `${currency} ` : ""}${amount.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // Loading state
  if (conferenceRegisteredLoading && registrations.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />
          <p className="mt-3 text-sm text-gray-500">
            Loading registrations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-violet-600"
      >
        <ArrowLeft size={16} />
        Back to Registrations
      </button>

      {/* Error message */}
      {conferenceRegisteredError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {typeof conferenceRegisteredError === "string"
            ? conferenceRegisteredError
            : conferenceRegisteredError.message ||
              "Failed to load registrations."}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Registrations",
            value: totalRegisteredUsers,
            Icon: Users,
          },
          {
            label: "Paid Registrations",
            value: paidRegistrations,
            Icon: CreditCard,
          },
          {
            label: "Pending Payments",
            value: pendingRegistrations,
            Icon: WalletCards,
          },
          {
            label: "Unpaid / Failed",
            value: unpaidRegistrations,
            Icon: UserCheck,
          },
        ].map(({ label, value, Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {label}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {value}
                </h2>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                <Icon size={19} className="text-violet-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conference information */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
              <CalendarDays size={21} className="text-violet-600" />
            </div>

            <div className="min-w-0">
              <h1 className="break-words text-base font-bold text-gray-900">
                {conference.title}
              </h1>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                {conference.date && (
                  <p className="flex items-center gap-1.5">
                    <CalendarDays
                      size={13}
                      className="shrink-0 text-violet-500"
                    />
                    {formatConferenceDate(conference.date)}
                  </p>
                )}

                {conference.location && (
                  <p className="flex items-center gap-1.5">
                    <MapPin
                      size={13}
                      className="shrink-0 text-violet-500"
                    />
                    {conference.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          <span className="w-fit shrink-0 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
            {conference.status}
          </span>
        </div>
      </div>

      {/* Registered users table */}
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Registered Users
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Click a user to view complete registration details.
            </p>
          </div>

          <span className="w-fit rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600">
            {totalRegisteredUsers} Users
          </span>
        </div>

        {/* No horizontal scrollbar */}
        <div className="w-full min-w-0">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="w-[20%] px-2 py-3 text-xs font-semibold text-gray-500 sm:px-4">
                  Name
                </th>
                <th className="w-[16%] px-2 py-3 text-xs font-semibold text-gray-500 sm:px-4">
                  Phone
                </th>
                <th className="w-[24%] px-2 py-3 text-xs font-semibold text-gray-500 sm:px-4">
                  Email
                </th>
                <th className="w-[14%] px-2 py-3 text-xs font-semibold text-gray-500 sm:px-4">
                  Category
                </th>
                <th className="w-[12%] px-2 py-3 text-xs font-semibold text-gray-500 sm:px-4">
                  Amount
                </th>
                <th className="w-[14%] px-2 py-3 text-xs font-semibold text-gray-500 sm:px-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-violet-50/40"
                  >
                    {/* Name — ID removed */}
                    <td className="px-2 py-4 sm:px-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-bold text-violet-600">
                          {user.fullName
                            .split(" ")
                            .filter(Boolean)
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <p
                          className="min-w-0 break-words text-xs font-semibold text-gray-800 sm:text-sm"
                          title={`${user.title} ${user.fullName}`}
                        >
                          {user.title} {user.fullName}
                        </p>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="break-words px-2 py-4 text-xs text-gray-600 sm:px-4 sm:text-sm">
                      {user.phone || "N/A"}
                    </td>

                    {/* Email */}
                    <td className="break-all px-2 py-4 text-xs text-gray-600 sm:px-4 sm:text-sm">
                      {user.email || "N/A"}
                    </td>

                    {/* Category */}
                    <td className="px-2 py-4 sm:px-4">
                      <span className="inline-block max-w-full break-words rounded-full bg-blue-50 px-2 py-1 text-xs font-medium capitalize text-blue-700">
                        {user.category}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="break-words px-2 py-4 text-xs font-semibold text-gray-800 sm:px-4 sm:text-sm">
                      {formatAmount(user.price, user.currency)}
                    </td>

                    {/* Payment status */}
                    <td className="px-2 py-4 sm:px-4">
                      <span
                        className={`inline-block max-w-full break-words rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(
                          user.paymentStatus
                        )}`}
                      >
                        {user.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <Users
                      size={28}
                      className="mx-auto text-violet-400"
                    />

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      No registrations found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      No users have registered for this conference yet.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalRegisteredUsers > 0 && (
          <div className="flex flex-col justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {(currentPage - 1) * usersPerPage + 1}
              </span>
              {" - "}
              <span className="font-semibold text-gray-700">
                {Math.min(
                  currentPage * usersPerPage,
                  totalRegisteredUsers
                )}
              </span>
              {" of "}
              <span className="font-semibold text-gray-700">
                {totalRegisteredUsers}
              </span>
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold ${
                    currentPage === page
                      ? "bg-violet-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:border-violet-300"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationDetailsPage;
