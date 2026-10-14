
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, ChevronDown, X } from "lucide-react";
import toast from "react-hot-toast";

import {
  createEmployee,
  updateEmployee,
  clearEmployeeError,
  clearEmployeeSuccess,
} from "../../../redux/employeeSlice";

import { getConferences } from "../../../redux/conferenceSlice";

const DEFAULT_PASSWORD = "Employee@123";

const EMPLOYEE_TYPES = [
  { label: "Conference Intern", value: "Conference Intern" },
  { label: "Conference Coordinator", value: "Conference Coordinator" },
  {
    label: "Senior Conference Coordinator",
    value: "Senior Conference Coordinator",
  },
  { label: "Conference Team Lead", value: "Conference Team Lead" },
  { label: "Conference Manager", value: "Conference Manager" },
];

const CreateEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Employee data passed from Employees.jsx
  const employee = location.state?.employee || null;

  const isEdit = Boolean(
    location.state?.isEdit && employee?._id
  );

  const {
    createLoading = false,
    error: employeeError,
    success,
    message,
  } = useSelector((state) => state.employee);

  const {
    conferences = [],
    loading: conferenceLoading,
    error: conferenceError,
  } = useSelector((state) => state.conference);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: DEFAULT_PASSWORD,
    employeeType: "",
    phoneNumber: "",
  });

  const [assignedConferences, setAssignedConferences] = useState([]);

  // --------------------------------------------------
  // LOAD CONFERENCES
  // --------------------------------------------------

  useEffect(() => {
    dispatch(getConferences());
  }, [dispatch]);

  // --------------------------------------------------
  // CLEAR PREVIOUS MESSAGES
  // --------------------------------------------------

  useEffect(() => {
    dispatch(clearEmployeeError());
    dispatch(clearEmployeeSuccess());
  }, [dispatch]);

  // --------------------------------------------------
  // PREFILL EXISTING EMPLOYEE IN EDIT MODE
  // --------------------------------------------------

  useEffect(() => {
    if (!isEdit || !employee) return;

    setFormData({
      fullName: employee.fullName || "",
      email: employee.email || "",
      password: "",
      employeeType: employee.employeeType || "",
      phoneNumber: employee.phoneNumber || "",
    });

    const conferenceIds = (
      employee.assignedConferences || []
    )
      .map((conference) => {
        if (typeof conference === "string") {
          return conference;
        }

        return conference?._id || conference?.id || "";
      })
      .filter(Boolean);

    setAssignedConferences([...new Set(conferenceIds)]);
  }, [isEdit, employee]);

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // CONFERENCE TITLE
  // --------------------------------------------------

  const getConferenceTitle = (conference) => {
    return (
      conference?.title ||
      conference?.conferenceTitle ||
      conference?.basicInformation?.title ||
      conference?.name ||
      "Untitled Conference"
    );
  };

  // --------------------------------------------------
  // ADD CONFERENCE
  // --------------------------------------------------

  const addConference = (conferenceId) => {
    if (!conferenceId) return;

    setAssignedConferences((prev) => {
      if (prev.includes(conferenceId)) {
        return prev;
      }

      return [...prev, conferenceId];
    });
  };

  // --------------------------------------------------
  // REMOVE CONFERENCE
  // --------------------------------------------------

  const removeConference = (conferenceId) => {
    setAssignedConferences((prev) =>
      prev.filter((id) => id !== conferenceId)
    );
  };

  // --------------------------------------------------
  // SUBMIT: CREATE OR UPDATE
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (isSubmitting) return;

    if (!formData.fullName.trim()) {
      toast.error("Please enter employee name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter employee email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!isEdit && DEFAULT_PASSWORD.length < 6) {
      toast.error("Default password must be at least 6 characters");
      return;
    }

    if (!formData.employeeType) {
      toast.error("Please select employee type");
      return;
    }

    if (assignedConferences.length === 0) {
      toast.error("Please assign at least one conference");
      return;
    }

    // Password is intentionally excluded from this payload.
    const employeeData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      role: "Employee",
      phoneNumber: formData.phoneNumber.trim(),
      assignedConferences,
    };

    // Do not resend an existing legacy employee type unchanged.
    // The backend can retain its current value without revalidating it.
    if (
      !isEdit ||
      formData.employeeType !== (employee?.employeeType || "")
    ) {
      employeeData.employeeType = formData.employeeType;
    }

    setIsSubmitting(true);

    try {
      dispatch(clearEmployeeError());
      dispatch(clearEmployeeSuccess());

      if (isEdit) {
        await dispatch(
          updateEmployee({
            id: employee._id,
            employeeData,
          })
        ).unwrap();

        toast.success("Employee updated successfully");
      } else {
        await dispatch(
          createEmployee({
            ...employeeData,
            password: DEFAULT_PASSWORD,
          })
        ).unwrap();

        toast.success("Employee created successfully");
      }

      dispatch(clearEmployeeError());
      dispatch(clearEmployeeSuccess());

      navigate("/admin/employees");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // CANCEL
  // --------------------------------------------------

  const handleCancel = () => {
    dispatch(clearEmployeeError());
    dispatch(clearEmployeeSuccess());

    if (isEdit) {
      navigate("/admin/employees");
      return;
    }

    setFormData({
      fullName: "",
      email: "",
      password: DEFAULT_PASSWORD,
      employeeType: "",
      phoneNumber: "",
    });

    setAssignedConferences([]);
  };

  // --------------------------------------------------
  // SELECTED CONFERENCES
  // --------------------------------------------------

  const selectedConferenceObjects = conferences.filter((conference) =>
    assignedConferences.includes(String(conference?._id))
  );

  const isBusy = isSubmitting || createLoading;

  return (
    <div className="w-full min-w-0">
      {/* PAGE HEADER */}
      <div className="mb-4">
        <h1 className="text-[22px] font-bold leading-tight text-gray-900">
          {isEdit ? "Update Employee" : "Create New Employee"}
        </h1>

        <p className="mt-0.5 text-[12px] text-gray-500">
          {isEdit
            ? "Update the employee details and assigned conferences."
            : "Add a new employee to the GlobalScion admin team."}
        </p>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[11px] font-medium text-green-700">
            {message ||
              (isEdit
                ? "Employee updated successfully"
                : "Employee created successfully")}
          </div>
        )}

        {/* EMPLOYEE ERROR */}
        {employeeError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
            {typeof employeeError === "string"
              ? employeeError
              : employeeError?.message || "Something went wrong"}
          </div>
        )}

        {/* CONFERENCE ERROR */}
        {conferenceError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
            Failed to load conferences:{" "}
            {typeof conferenceError === "string"
              ? conferenceError
              : conferenceError?.message || "Unknown error"}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {/* FULL NAME */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-gray-700">
              Full Name *
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter employee name"
              autoComplete="name"
              required
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-gray-700">
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="employee@globalscion.com"
              autoComplete="email"
              required
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
            />
          </div>

          {/* PASSWORD: CREATE ONLY */}
          {!isEdit && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-gray-700">
                Default Password
              </label>

              <input
                type="password"
                name="password"
                value={DEFAULT_PASSWORD}
                disabled
                readOnly
                autoComplete="new-password"
                className="h-10 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 text-[12px] text-gray-500 outline-none"
              />

              <p className="mt-1 text-[10px] text-gray-400">
                The default password is fixed.
              </p>
            </div>
          )}

          {/* EMPLOYEE TYPE */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-gray-700">
              Employee Type *
            </label>

            <div className="relative">
              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                required
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-9 text-[12px] text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
              >
                <option value="" disabled>
                  Select employee type
                </option>

                {/* Preserve an existing type if it is an older value. */}
                {formData.employeeType &&
                  !EMPLOYEE_TYPES.some(
                    (type) => type.value === formData.employeeType
                  ) && (
                    <option value={formData.employeeType}>
                      {formData.employeeType}
                    </option>
                  )}

                {EMPLOYEE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-gray-700">
              Phone Number
            </label>

            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              autoComplete="tel"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
            />
          </div>

          {/* ASSIGN CONFERENCE */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-[11px] font-semibold text-gray-700">
              Assign Conference *
            </label>

            <div className="relative">
              <select
                value=""
                disabled={conferenceLoading}
                onChange={(e) => addConference(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-9 text-[12px] text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                <option value="">
                  {conferenceLoading
                    ? "Loading conferences..."
                    : "Select conference to assign"}
                </option>

                {conferences.map((conference) => {
                  const conferenceId = String(conference?._id || "");

                  return (
                    <option
                      key={conferenceId}
                      value={conferenceId}
                      disabled={assignedConferences.includes(conferenceId)}
                    >
                      {getConferenceTitle(conference)}
                    </option>
                  );
                })}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* ASSIGNED CONFERENCES */}
            {selectedConferenceObjects.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedConferenceObjects.map((conference) => (
                  <div
                    key={conference._id}
                    className="flex items-center gap-1.5 rounded-md bg-purple-50 px-2 py-1 text-[10px] font-medium text-purple-700"
                  >
                    <Check size={11} />

                    <span>{getConferenceTitle(conference)}</span>

                    <button
                      type="button"
                      onClick={() => removeConference(String(conference._id))}
                      aria-label={`Remove ${getConferenceTitle(conference)}`}
                      className="ml-0.5 rounded text-purple-400 transition hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-1 text-[10px] text-gray-400">
              You can assign multiple conferences to this employee.
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isBusy}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isBusy || conferenceLoading}
            className="h-9 rounded-lg bg-purple-600 px-4 text-[11px] font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Employee"
                : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
