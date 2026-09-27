import React, { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

const CreateEmployee = () => {
  const [assignedConferences, setAssignedConferences] =
    useState([]);

  const conferences = [
    "Mental Health & Psychiatry",
    "Endocrine & Metabolic Innovation",
    "Food, Nutrition & Wellness",
    "Oncology Research & AI Innovations",
    "Healthcare Innovation & Precision Medicine",
    "AI & Digital Psychiatry",
    "Autism Research & Innovations",
    "Heart & Cardiovascular Diseases",
  ];

  const addConference = (conference) => {
    if (
      conference &&
      !assignedConferences.includes(conference)
    ) {
      setAssignedConferences((prev) => [
        ...prev,
        conference,
      ]);
    }
  };

  const removeConference = (conference) => {
    setAssignedConferences((prev) =>
      prev.filter((item) => item !== conference)
    );
  };

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
              placeholder="employee@globalscion.com"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
            />
          </div>

          {/* =================================================
              ROLE
          ================================================= */}

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-gray-700">
              Role *
            </label>

            <div className="relative">
              <select
                defaultValue=""
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-9 text-[12px] text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
              >
                <option value="" disabled>
                  Select role
                </option>

                <option value="Webiner">
                  Webiner
                </option>

                <option value="Event Manager">
                  Event Manager
                </option>

                <option value="Coordinator">
                  Coordinator
                </option>

                <option value="Marketing">
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
                onChange={(e) =>
                  addConference(e.target.value)
                }
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-9 text-[12px] text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
              >
                <option value="">
                  Select conference to assign
                </option>

                {conferences.map((conference) => (
                  <option
                    key={conference}
                    value={conference}
                    disabled={assignedConferences.includes(
                      conference
                    )}
                  >
                    {conference}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* ASSIGNED CONFERENCES */}

            {assignedConferences.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {assignedConferences.map(
                  (conference) => (
                    <div
                      key={conference}
                      className="flex items-center gap-1.5 rounded-md bg-purple-50 px-2 py-1 text-[10px] font-medium text-purple-700"
                    >
                      <Check size={11} />

                      <span>{conference}</span>

                      <button
                        type="button"
                        onClick={() =>
                          removeConference(
                            conference
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
              You can assign multiple conferences to this
              employee.
            </p>
          </div>
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            className="h-9 rounded-lg bg-purple-600 px-4 text-[11px] font-semibold text-white transition hover:bg-purple-700"
          >
            Create Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;