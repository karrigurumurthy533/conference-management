
import { Bell, KeyRound, Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectEmployee } from "../redux/employeeSlice";

function Profile() {
  const employee = useSelector(selectEmployee);
  const navigate = useNavigate();

  // ======================================================
  // EMPLOYEE DATA - LOGIN API RESPONSE
  // ======================================================

  const fullName = employee?.fullName || "Employee";
  const email = employee?.email || "-";
  const phone = employee?.phoneNumber || "-";

  const employeeType = employee?.employeeType
    ? employee.employeeType
        .split(" ")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ")
    : "-";

  const designation = employee?.designation || employeeType;
  const department = employee?.department || "-";
  const country = employee?.country || "-";
  const status = employee?.status || "active";
  const role = employee?.role || "-";

  const assignedConferences = Array.isArray(
    employee?.assignedConferences
  )
    ? employee.assignedConferences
    : [];

  const conferenceTitle =
    assignedConferences
      .map((conference) => conference?.title)
      .filter(Boolean)
      .join(", ") || "No conference assigned";

  // ======================================================
  // INITIALS
  // ======================================================

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f7f7fb] px-6 py-6">
      <div className="mx-auto max-w-[1400px]">
        {/* HEADER */}

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-bold leading-8 text-[#111827]">
              My Profile
            </h1>

            <p className="mt-1 text-[14px] text-[#64748b]">
              Your account and assignment details
            </p>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#d9dce5] bg-white px-5 py-2.5 text-[14px] font-medium text-[#111827] transition hover:border-[#8138A2] hover:bg-[#f7effb] hover:text-[#8138A2]"
          >
            <Pencil
              size={16}
              strokeWidth={1.8}
              className="text-[#8138A2]"
            />
            Edit Profile
          </button>
        </div>

        {/* CONTENT */}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[338px_1fr]">
          {/* LEFT PROFILE CARD */}

          <div className="rounded-2xl border border-[#dddfe8] bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col items-center">
              {/* Avatar */}

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#8138A2]">
                <span className="text-[24px] font-semibold text-white">
                  {initials || "E"}
                </span>
              </div>

              {/* Name */}

              <h2 className="mt-5 text-center text-[17px] font-bold text-[#111827]">
                {fullName}
              </h2>

              {/* Designation */}

              <p className="mt-1 text-center text-[14px] text-[#64748b]">
                {designation}
              </p>

              {/* Status */}

              <span
                className={`mt-4 rounded-full px-3 py-1 text-[12px] font-medium ${
                  status.toLowerCase() === "active"
                    ? "bg-[#f0e4f6] text-[#8138A2]"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1)}
              </span>
            </div>

            {/* ACTION BUTTONS */}

            <div className="mt-6 space-y-2">
              {/* CHANGE PASSWORD */}

              <button
                type="button"
                onClick={() => navigate("/change-password")}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d9dce5] bg-white text-[14px] font-medium text-[#111827] transition hover:border-[#8138A2] hover:bg-[#f7effb] hover:text-[#8138A2]"
              >
                <KeyRound
                  size={16}
                  strokeWidth={1.8}
                  className="text-[#8138A2]"
                />
                Change Password
              </button>

              {/* NOTIFICATION SETTINGS */}

              <button
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d9dce5] bg-white text-[14px] font-medium text-[#111827] transition hover:border-[#8138A2] hover:bg-[#f7effb] hover:text-[#8138A2]"
              >
                <Bell
                  size={16}
                  strokeWidth={1.8}
                  className="text-[#8138A2]"
                />
                Notification Settings
              </button>
            </div>
          </div>

          {/* RIGHT DETAILS CARD */}

          <div className="rounded-2xl border border-[#dddfe8] bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Details
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
              {/* FULL NAME */}

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Full Name
                </p>

                <p className="mt-1 break-words text-[14px] font-semibold text-[#111827]">
                  {fullName}
                </p>
              </div>

              {/* EMAIL */}

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Email
                </p>

                <p className="mt-1 break-all text-[14px] font-semibold text-[#111827]">
                  {email}
                </p>
              </div>

              {/* PHONE */}

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Phone
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  {phone}
                </p>
              </div>

              {/* DESIGNATION */}

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Designation
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  {designation}
                </p>
              </div>

              {/* EMPLOYEE TYPE */}

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Employee Type
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  {employeeType}
                </p>
              </div>

              {/* ROLE */}

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Role
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  {role}
                </p>
              </div>

              {/* DEPARTMENT */}

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Department
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  {department}
                </p>
              </div>

              {/* COUNTRY */}

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Country
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  {country}
                </p>
              </div>
            </div>

            {/* ASSIGNED CONFERENCE */}

            <div className="mt-6 rounded-2xl border border-[#dddfe8] bg-[#fafafd] px-4 py-4">
              <p className="text-[12px] font-medium text-[#64748b]">
                Assigned Conference
              </p>

              <p className="mt-1 break-words text-[14px] font-semibold text-[#8138A2]">
                {conferenceTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;