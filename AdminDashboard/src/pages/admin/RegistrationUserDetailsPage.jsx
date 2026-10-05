import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { getRegistrationByIdApi } from "../../api/registrationsApis";

const RegistrationUserDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationId, userId } = useParams();

  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ======================================================
  // GET USER FROM NAVIGATION STATE
  // ======================================================

  const stateUser = useMemo(() => {
    let value = location.state?.user;

    // If array is passed
    if (Array.isArray(value)) {
      value = value[0];
    }

    // If API response object is passed
    if (value?.data) {
      if (Array.isArray(value.data)) {
        value = value.data[0];
      } else {
        value = value.data;
      }
    }

    // If nested user object is passed
    if (value?.user) {
      value = value.user;
    }

    return value || null;
  }, [location.state]);

  // ======================================================
  // FETCH REGISTRATION BY ID
  // ======================================================

  useEffect(() => {
    const fetchRegistration = async () => {
      // userId should be registration _id
      const id = userId || location.state?.user?._id;

      if (!id) {
        return;
      }

      // If already received complete user object,
      // no need for another API request.
      if (
        stateUser?._id === id &&
        stateUser?.firstName
      ) {
        setApiUser(stateUser);
        return;
      }

      try {
        setLoading(true);

        const response = await getRegistrationByIdApi(id);

        const registration =
          response?.data || response;

        if (registration) {
          setApiUser(registration);
        }
      } catch (error) {
        console.error(
          "Failed to fetch registration:",
          error
        );

        if (stateUser) {
          setApiUser(stateUser);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [
    userId,
    stateUser,
    location.state,
  ]);

  // ======================================================
  // FINAL USER DATA
  // ======================================================

  const user = apiUser || stateUser;

  // ======================================================
  // DATE FORMAT
  // ======================================================

  const formatConferenceDate = (value) => {
    if (!value) {
      return "N/A";
    }

    const dateString = String(value);

    const dates = dateString
      .split(" - ")
      .map((item) => item.trim())
      .filter(Boolean);

    if (dates.length === 2) {
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[1]);

      if (
        !Number.isNaN(startDate.getTime()) &&
        !Number.isNaN(endDate.getTime())
      ) {
        const start = startDate.toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

        const end = endDate.toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

        return `${start} – ${end}`;
      }
    }

    return dateString;
  };

  // ======================================================
  // REGISTRATION DATE
  // ======================================================

  const formatRegistrationDate = (value) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ======================================================
  // NORMALIZED DATA
  // ======================================================

  const data = useMemo(() => {
    if (!user) {
      return null;
    }

    const firstName =
      user.firstName ||
      user.presenter?.firstName ||
      "";

    const lastName =
      user.lastName ||
      user.presenter?.lastName ||
      "";

    const title =
      user.title ||
      user.presenter?.title ||
      "";

    const fullName = [
      title,
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const conference =
      user.conference || {};

    const conferenceId =
      conference.conferenceId;

    const locationData =
      user.location || {};

    const registration =
      user.registration || {};

    return {
      id:
        user._id ||
        user.id ||
        "",

      fullName:
        fullName || "N/A",

      email:
        user.email || "N/A",

      phone:
        user.phone || "N/A",

      paymentStatus:
        user.paymentStatus || "Pending",

      paymentOrderId:
        user.paymentOrderId || "N/A",

      paymentId:
        user.paymentId || null,

      paymentSignature:
        user.paymentSignature || null,

      status:
        user.status || "N/A",

      createdAt:
        user.createdAt || null,

      updatedAt:
        user.updatedAt || null,

      // Conference
      conferenceId:
        conferenceId?._id ||
        conferenceId ||
        "",

      conferenceName:
        conference.title ||
        conferenceId?.title ||
        "N/A",

      conferenceDate:
        formatConferenceDate(
          conference.date
        ),

      conferenceLocation:
        conference.location ||
        conferenceId?.location ||
        "N/A",

      // Address
      country:
        locationData.country || "N/A",

      state:
        locationData.state || "N/A",

      city:
        locationData.city || "N/A",

      postalCode:
        locationData.postalCode || "N/A",

      address:
        locationData.address || "N/A",

      // Registration
      category:
        registration.category || "N/A",

      option:
        registration.option || "N/A",

      price:
        registration.price ?? null,

      currency:
        registration.currency || "",

      registrationDate:
        formatRegistrationDate(
          user.createdAt
        ),
    };
  }, [user]);

  // ======================================================
  // BACK
  // ======================================================

  const handleBack = () => {
    const conferenceId =
      data?.conferenceId ||
      location.state?.conference?.id ||
      registrationId;

    navigate(
      `/admin/registrations/${conferenceId}`,
      {
        state: {
          conference:
            location.state?.conference || {
              id: conferenceId,
              conference:
                data?.conferenceName ||
                "Conference",
              date:
                data?.conferenceDate ||
                "",
            },
        },
      }
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading && !user) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-xs text-gray-500">
            Loading registration details...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // NO DATA
  // ======================================================

  if (!data) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">
            Registration details not found
          </h2>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // INITIALS
  // ======================================================

  const initials =
    data.fullName !== "N/A"
      ? data.fullName
          .replace(/^Mr\.\s|^Ms\.\s|^Mrs\.\s|^Dr\.\s/gi, "")
          .split(" ")
          .filter(Boolean)
          .map((name) => name[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "N";

  return (
    <div className="w-full">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Registered User Details
            </h1>

            <p className="mt-1 text-[11px] text-gray-500">
              Complete registration information.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          USER HEADER
      ================================================== */}

      <div className="mb-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-600">
              {initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">
                  {data.fullName}
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                    data.paymentStatus === "Paid"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {data.paymentStatus}
                </span>
              </div>

              <p className="mt-1 text-[11px] text-gray-400">
                Registration ID: #{data.id}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-violet-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={16}
                className="text-violet-600"
              />

              <div>
                <p className="text-[10px] font-medium text-gray-400">
                  Conference
                </p>

                <p className="mt-0.5 text-xs font-semibold text-gray-700">
                  {data.conferenceName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          INFORMATION GRID
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ==================================================
            PERSONAL INFORMATION
        ================================================== */}

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <User
                size={16}
                className="text-violet-600"
              />

              <div>
                <h3 className="text-[13px] font-bold text-gray-800">
                  Personal Information
                </h3>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Registered user's personal details.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <User
                  size={14}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-500">
                  Full Name
                </span>
              </div>

              <span className="text-right text-xs font-semibold text-gray-700">
                {data.fullName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Mail
                  size={14}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-500">
                  Email
                </span>
              </div>

              <span className="max-w-[60%] truncate text-right text-xs font-semibold text-gray-700">
                {data.email}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Phone
                  size={14}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-500">
                  Phone
                </span>
              </div>

              <span className="text-right text-xs font-semibold text-gray-700">
                {data.phone}
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            ADDRESS INFORMATION
        ================================================== */}

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <MapPin
                size={16}
                className="text-violet-600"
              />

              <div>
                <h3 className="text-[13px] font-bold text-gray-800">
                  Address Information
                </h3>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Registered address details.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Country
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {data.country}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                State
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {data.state}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                City
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {data.city}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Postal Code
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {data.postalCode}
              </span>
            </div>

            <div className="px-4 py-3.5">
              <p className="text-[11px] text-gray-500">
                Address
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-gray-700">
                {data.address}
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            REGISTRATION INFORMATION
        ================================================== */}

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={16}
                className="text-violet-600"
              />

              <div>
                <h3 className="text-[13px] font-bold text-gray-800">
                  Registration Information
                </h3>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Conference registration details.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Conference
              </span>

              <span className="max-w-[60%] text-right text-xs font-semibold text-gray-700">
                {data.conferenceName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Conference Date
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {data.conferenceDate}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Location
              </span>

              <span className="text-xs font-semibold capitalize text-gray-700">
                {data.conferenceLocation}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Category
              </span>

              <span className="text-xs font-semibold capitalize text-gray-700">
                {data.category}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Registration Option
              </span>

              <span className="max-w-[60%] text-right text-xs font-semibold text-gray-700">
                {data.option}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Registration Date
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {data.registrationDate}
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            PAYMENT INFORMATION
        ================================================== */}

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <CreditCard
                size={16}
                className="text-violet-600"
              />

              <div>
                <h3 className="text-[13px] font-bold text-gray-800">
                  Payment Information
                </h3>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Registration payment details.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Payment Status
              </span>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                  data.paymentStatus === "Paid"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {data.paymentStatus}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Payment Order ID
              </span>

              <span className="max-w-[60%] truncate text-right text-xs font-semibold text-gray-700">
                {data.paymentOrderId}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Payment ID
              </span>

              <span className="max-w-[60%] truncate text-right text-xs font-semibold text-gray-700">
                {data.paymentId || "Not available"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Amount
              </span>

              <span className="text-sm font-bold text-gray-800">
                {data.currency}{" "}
                {data.price !== null
                  ? data.price
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Registration Status
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {data.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          BACK BUTTON
      ================================================== */}

      <div className="mt-5">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
        >
          <ArrowLeft size={15} />
          Back to Registrations
        </button>
      </div>
    </div>
  );
};

export default RegistrationUserDetailsPage;