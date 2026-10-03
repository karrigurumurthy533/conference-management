import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  ChevronDown,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  createEmployee,
  clearEmployeeError,
  clearEmployeeSuccess,
} from "../../../redux/employeeSlice";

import { getConferences } from "../../../redux/conferenceSlice";

const CreateEmployee = () => {
  const dispatch = useDispatch();

  // =========================================================
  // REDUX STATE
  // =========================================================

  const {
    createLoading,
    error: employeeError,
    success,
    message,
  } = useSelector((state) => state.employee);

  const {
    conferences,
    loading: conferenceLoading,
    error: conferenceError,
  } = useSelector((state) => state.conference);

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "Employee@123",
    employeeType: "",
    phoneNumber: "",
  });

  const [assignedConferences, setAssignedConferences] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  // =========================================================
  // GET ALL CONFERENCES
  // =========================================================

  useEffect(() => {
    dispatch(getConferences());
  }, [dispatch]);

  // =========================================================
  // CLEAR SUCCESS / ERROR WHEN PAGE LOADS
  // =========================================================

  useEffect(() => {
    dispatch(clearEmployeeError());
    dispatch(clearEmployeeSuccess());
  }, [dispatch]);

  // =========================================================
  // SUCCESS TOASTER
  // =========================================================

  useEffect(() => {
    if (success) {
      toast.success(
        message || "Employee created successfully"
      );
    }
  }, [success, message]);

  // =========================================================
  // ERROR TOASTER
  // =========================================================

  useEffect(() => {
    if (employeeError) {
      toast.error(employeeError);
    }
  }, [employeeError]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // GET CONFERENCE TITLE
  // =========================================================

  const getConferenceTitle = (conference) => {
    return (
      conference?.title ||
      conference?.conferenceTitle ||
      conference?.name ||
      "Untitled Conference"
    );
  };

  // =========================================================
  // ADD CONFERENCE
  // =========================================================

  const addConference = (conferenceId) => {
    if (!conferenceId) return;

    if (!assignedConferences.includes(conferenceId)) {
      setAssignedConferences((prev) => [
        ...prev,
        conferenceId,
      ]);
    }
  };

  // =========================================================
  // REMOVE CONFERENCE
  // =========================================================

  const removeConference = (conferenceId) => {
    setAssignedConferences((prev) =>
      prev.filter((id) => id !== conferenceId)
    );
  };

  // =========================================================
  // CREATE EMPLOYEE
  // =========================================================

  const handleSubmit = async () => {
    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!formData.fullName.trim()) {
      toast.error("Please enter employee name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter employee email");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter employee password");
      return;
    }

    if (formData.password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
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

    // =======================================================
    // PAYLOAD
    // =======================================================
    // role is always Employee
    // employeeType contains the actual employee job type
    // =======================================================

    const payload = {
      fullName: formData.fullName.trim(),

      email: formData.email.trim(),

      password: formData.password.trim(),

      // Authentication role
      role: "Employee",

      // Employee job type
      employeeType: formData.employeeType,

      phoneNumber: formData.phoneNumber.trim(),

      assignedConferences,
    };

    // =======================================================
    // API CALL THROUGH REDUX
    // =======================================================

    const result = await dispatch(
      createEmployee(payload)
    );

    // =======================================================
    // SUCCESS
    // =======================================================

    if (createEmployee.fulfilled.match(result)) {
      setFormData({
        fullName: "",
        email: "",
        password: "Employee@123",
        employeeType: "",
        phoneNumber: "",
      });

      setAssignedConferences([]);

      setShowPassword(false);
    }
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "Employee@123",
      employeeType: "",
      phoneNumber: "",
    });

    setAssignedConferences([]);

    setShowPassword(false);

    dispatch(clearEmployeeError());
    dispatch(clearEmployeeSuccess());
  };

  // =========================================================
  // GET SELECTED CONFERENCE OBJECTS
  // =========================================================

  const selectedConferenceObjects = conferences.filter(
    (conference) =>
      assignedConferences.includes(conference?._id)
  );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="w-full min-w-0">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-4">
        <h1 className="text-[22px] font-bold leading-tight text-gray-900">
          Create New Employee
        </h1>

        <p className="mt-0.5 text-[12px] text-gray-500">
          Add a new employee to the GlobalScion admin team.
        </p>
      </div>

      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* ===================================================
            SUCCESS MESSAGE
        =================================================== */}

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[11px] font-medium text-green-700">
            {message || "Employee created successfully"}
          </div>
        )}

        {/* ===================================================
            ERROR MESSAGE
        =================================================== */}

        {employeeError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
            {employeeError}
          </div>
        )}

        {/* ===================================================
            CONFERENCE ERROR
        =================================================== */}

        {conferenceError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
            Failed to load conferences: {conferenceError}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {/* =================================================
              FULL NAME
          ================================================= */}

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
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
            />
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

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
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
            />
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-gray-700">
              Password *
            </label>

            <div className="relative">
              <input
                type={
                  showPassword ? "text" : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter employee password"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 pr-10 text-[12px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>

            <p className="mt-1 text-[10px] text-gray-400">
              Default password: Employee@123
            </p>
          </div>

          {/* =================================================
              EMPLOYEE TYPE
          ================================================= */}

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-gray-700">
              Employee Type *
            </label>

            <div className="relative">
              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-9 text-[12px] text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
              >
                <option value="" disabled>
                  Select employee type
                </option>

                <option value="webiner">
                  Webiner
                </option>

                <option value="event manager">
                  Event Manager
                </option>

                <option value="coordinator">
                  Coordinator
                </option>

                <option value="marketing">
                  Marketing
                </option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* =================================================
              PHONE
          ================================================= */}

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
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
            />
          </div>

          {/* =================================================
              ASSIGN CONFERENCE
          ================================================= */}

          <div className="md:col-span-2">
            <label className="mb-1 block text-[11px] font-semibold text-gray-700">
              Assign Conference *
            </label>

            <div className="relative">
              <select
                value=""
                disabled={conferenceLoading}
                onChange={(e) =>
                  addConference(e.target.value)
                }
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-9 text-[12px] text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                <option value="">
                  {conferenceLoading
                    ? "Loading conferences..."
                    : "Select conference to assign"}
                </option>

                {conferences.map((conference) => (
                  <option
                    key={conference._id}
                    value={conference._id}
                    disabled={assignedConferences.includes(
                      conference._id
                    )}
                  >
                    {getConferenceTitle(conference)}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* =================================================
                ASSIGNED CONFERENCES
            ================================================= */}

            {selectedConferenceObjects.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedConferenceObjects.map(
                  (conference) => (
                    <div
                      key={conference._id}
                      className="flex items-center gap-1.5 rounded-md bg-purple-50 px-2 py-1 text-[10px] font-medium text-purple-700"
                    >
                      <Check size={11} />

                      <span>
                        {getConferenceTitle(conference)}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeConference(
                            conference._id
                          )
                        }
                        className="ml-0.5 rounded text-purple-400 transition hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            <p className="mt-1 text-[10px] text-gray-400">
              You can assign multiple conferences to
              this employee.
            </p>
          </div>
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          {/* CANCEL */}

          <button
            type="button"
            onClick={handleCancel}
            disabled={createLoading}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* CREATE */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={createLoading}
            className="h-9 rounded-lg bg-purple-600 px-4 text-[11px] font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createLoading
              ? "Creating..."
              : "Create Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;