
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  Clock3,
  LogIn,
  LogOut,
  ShieldCheck,
  BriefcaseBusiness,
} from "lucide-react";

import {
  getEmployeeById,
  deleteEmployee,
  clearEmployeeError,
} from "../../../redux/employeeSlice";

const EmployeeDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employeeId } = useParams();

  const {
    selectedEmployee,
    loading,
    deleteLoading,
    error,
  } = useSelector((state) => state.employee);

  /* =========================================================
     GET EMPLOYEE BY ID
  ========================================================= */

  useEffect(() => {
    if (employeeId) {
      dispatch(getEmployeeById(employeeId));
    }
  }, [dispatch, employeeId]);

  /* =========================================================
     CLEAR ERROR ON UNMOUNT
  ========================================================= */

  useEffect(() => {
    return () => {
      dispatch(clearEmployeeError());
    };
  }, [dispatch]);

  /* =========================================================
     EMPLOYEE DATA
  ========================================================= */

  const employee = selectedEmployee;

  /* =========================================================
     CONFERENCE DETAILS
  ========================================================= */

  const conferenceDetails = Array.isArray(
    employee?.conferenceDetails
  )
    ? employee.conferenceDetails
    : [];

  const conferenceName =
    conferenceDetails.length > 0
      ? conferenceDetails
          .map((conference) => conference?.title)
          .filter(Boolean)
          .join(", ")
      : "No conference assigned";

  /* =========================================================
     EMPLOYEE STATUS
  ========================================================= */

  const employeeStatus = (() => {
    if (employee?.status) {
      const status = String(employee.status).toLowerCase();

      if (status === "active") {
        return "Active";
      }

      if (status === "inactive") {
        return "Inactive";
      }
    }

    if (employee?.isActive === true) {
      return "Active";
    }

    if (employee?.isActive === false) {
      return "Inactive";
    }

    return "Active";
  })();

  /* =========================================================
     INITIALS
  ========================================================= */

  const initials = employee?.fullName
    ? employee.fullName
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "EM";

  /* =========================================================
     UPDATE
  ========================================================= */

  const handleUpdate = () => {
    if (!employee) return;

    navigate("/admin/employees/create", {
      state: {
        employee,
        isEdit: true,
      },
    });
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    if (!employee?._id) {
      alert("Employee ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.fullName}?`
    );

    if (!confirmed) return;

    try {
      await dispatch(
        deleteEmployee(employee._id)
      ).unwrap();

      alert("Employee deleted successfully");

      navigate("/admin/employees");
    } catch (error) {
      console.error(
        "Failed to delete employee:",
        error
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading || !employee) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-5 lg:p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-[#7C3AED]" />

            <p className="text-xs font-medium text-gray-500">
              Loading employee details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-5 lg:p-6">
        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-600">
            {error}
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-5 lg:p-6">
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Back */}

          <button
            type="button"
            onClick={() =>
              navigate("/admin/employees")
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED]"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Employee Details
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              View employee information and activity
              details.
            </p>
          </div>
        </div>

        {/* Actions */}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUpdate}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#7C3AED] transition hover:bg-purple-50"
          >
            <Edit size={15} />
            Update
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={15} />

            {deleteLoading
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <div className="mb-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-[#7C3AED]">
              {initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">
                  {employee.fullName}
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    employeeStatus === "Active"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {employeeStatus}
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Employee ID: #{employee._id}
              </p>
            </div>
          </div>

          {/* Conference */}

          <div className="rounded-lg bg-purple-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Building2
                size={16}
                className="text-[#7C3AED]"
              />

              <div>
                <p className="text-[10px] font-medium text-gray-400">
                  Assigned Conference
                </p>

                <p className="mt-0.5 max-w-[350px] text-xs font-semibold text-gray-700">
                  {conferenceName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          INFORMATION GRID
      ===================================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ===================================================
            PERSONAL INFORMATION
        =================================================== */}

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <User
                size={16}
                className="text-[#7C3AED]"
              />

              <div>
                <h3 className="text-[13px] font-bold text-gray-800">
                  Personal Information
                </h3>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Employee contact information.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {/* Full Name */}

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
                {employee.fullName || "-"}
              </span>
            </div>

            {/* Email */}

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
                {employee.email || "-"}
              </span>
            </div>

            {/* Phone */}

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
                {employee.phoneNumber || "-"}
              </span>
            </div>

            {/* Status */}

            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={14}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-500">
                  Status
                </span>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  employeeStatus === "Active"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {employeeStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            CONFERENCE INFORMATION
        =================================================== */}

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness
                size={16}
                className="text-[#7C3AED]"
              />

              <div>
                <h3 className="text-[13px] font-bold text-gray-800">
                  Conference Information
                </h3>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Employee conference assignment.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {/* Conference */}

            <div className="flex items-start justify-between gap-4 px-4 py-4">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={14}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-500">
                  Conference
                </span>
              </div>

              <span className="max-w-[60%] text-right text-xs font-semibold text-gray-700">
                {conferenceName}
              </span>
            </div>

            {/* Conference ID */}

            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness
                  size={14}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-500">
                  Conference ID
                </span>
              </div>

              <span className="max-w-[60%] truncate text-right text-xs font-semibold text-gray-700">
                {conferenceDetails.length > 0
                  ? conferenceDetails
                      .map(
                        (conference) =>
                          conference?.conferenceId
                      )
                      .filter(Boolean)
                      .join(", ")
                  : "-"}
              </span>
            </div>

            {/* Employee ID */}

            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness
                  size={14}
                  className="text-gray-400"
                />

                <span className="text-[11px] text-gray-500">
                  Employee ID
                </span>
              </div>

              <span className="max-w-[60%] truncate text-right text-xs font-semibold text-gray-700">
                #{employee._id}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            LOGIN ACTIVITY
        =================================================== */}

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock3
                size={16}
                className="text-[#7C3AED]"
              />

              <div>
                <h3 className="text-[13px] font-bold text-gray-800">
                  Login Activity
                </h3>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Recent employee login and logout
                  activity.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-gray-50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {/* Last Login */}

            <div className="flex items-center gap-4 px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <LogIn
                  size={18}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-[10px] font-medium text-gray-400">
                  Last Login
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {employee.lastLogin || "-"}
                </p>
              </div>
            </div>

            {/* Last Logout */}

            <div className="flex items-center gap-4 px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <LogOut
                  size={18}
                  className="text-red-500"
                />
              </div>

              <div>
                <p className="text-[10px] font-medium text-gray-400">
                  Last Logout
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {employee.lastLogout || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM BACK BUTTON
      ===================================================== */}

    </div>
  );
};

export default EmployeeDetailsPage;
