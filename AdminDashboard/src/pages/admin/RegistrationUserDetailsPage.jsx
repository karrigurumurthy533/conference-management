
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  WalletCards,
} from "lucide-react";

const RegistrationUserDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationId, userId } = useParams();

  const conference = location.state?.conference || {
    id: registrationId,
    conference: "Mental Health & Psychiatry",
    date: "Sep 17–18, 2026",
    registrations: 342,
    status: "Upcoming",
  };

  const user = location.state?.user || {
    id: userId,
    fullName: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 9876543210",
    paymentStatus: "Paid",
    registrationId: "REG-10001",

    // Complete registration information
    gender: "Male",
    age: 29,
    organization: "Apollo Hospitals",
    designation: "Research Associate",
    country: "India",
    state: "Telangana",
    city: "Hyderabad",
    address: "Madhapur, Hyderabad, Telangana",
    registrationType: "Delegate",
    participationMode: "Online",
    registrationDate: "25 Sep 2026, 10:35 AM",
    paymentDate: "25 Sep 2026, 10:42 AM",
    paymentMethod: "Online Payment",
    transactionId: "TXN-98273462",
    amount: "₹4,999",
  };

  const handleBack = () => {
    navigate(`/admin/registrations/${conference.id}`, {
      state: {
        conference,
      },
    });
  };

  return (
    <div className="w-full">
      {/* HEADER */}

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

      {/* USER HEADER */}

      <div className="mb-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-600">
              {user.fullName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">
                  {user.fullName}
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                    user.paymentStatus === "Paid"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {user.paymentStatus}
                </span>
              </div>

              <p className="mt-1 text-[11px] text-gray-400">
                Registration ID: #{user.registrationId}
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
                  {conference.conference}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INFORMATION GRID */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* PERSONAL INFORMATION */}

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <User size={16} className="text-violet-600" />

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
                <User size={14} className="text-gray-400" />

                <span className="text-[11px] text-gray-500">
                  Full Name
                </span>
              </div>

              <span className="text-right text-xs font-semibold text-gray-700">
                {user.fullName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />

                <span className="text-[11px] text-gray-500">
                  Email
                </span>
              </div>

              <span className="max-w-[60%] truncate text-right text-xs font-semibold text-gray-700">
                {user.email}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />

                <span className="text-[11px] text-gray-500">
                  Phone
                </span>
              </div>

              <span className="text-right text-xs font-semibold text-gray-700">
                {user.phone}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Gender
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.gender}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Age
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.age}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Organization
              </span>

              <span className="max-w-[60%] text-right text-xs font-semibold text-gray-700">
                {user.organization}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Designation
              </span>

              <span className="max-w-[60%] text-right text-xs font-semibold text-gray-700">
                {user.designation}
              </span>
            </div>
          </div>
        </div>

        {/* ADDRESS INFORMATION */}

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-violet-600" />

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
                {user.country}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                State
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.state}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                City
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.city}
              </span>
            </div>

            <div className="px-4 py-3.5">
              <p className="text-[11px] text-gray-500">
                Address
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-gray-700">
                {user.address}
              </p>
            </div>
          </div>
        </div>

        {/* REGISTRATION INFORMATION */}

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
                {conference.conference}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Conference Date
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {conference.date}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Registration Type
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.registrationType}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Participation Mode
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.participationMode}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Registration Date
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.registrationDate}
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT INFORMATION */}

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
                  user.paymentStatus === "Paid"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {user.paymentStatus}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Payment Method
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.paymentMethod}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Transaction ID
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.transactionId}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Amount
              </span>

              <span className="text-sm font-bold text-gray-800">
                {user.amount}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-[11px] text-gray-500">
                Payment Date
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {user.paymentDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BACK */}

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

