
import  { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  X,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getEmployees,
  getEmployeeById,
  deleteEmployee,
  clearEmployeeError,
} from "../../../redux/employeeSlice";

const Employees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =========================================================
  // REDUX STATE
  // =========================================================

  const {
    employees = [],
    loading,
    deleteLoading,
    error,
  } = useSelector((state) => state.employee);

  // =========================================================
  // LOCAL STATE
  // =========================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const employeesPerPage = 5;

  // =========================================================
  // GET ALL EMPLOYEES
  // =========================================================

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  // =========================================================
  // CLEAR ERROR
  // =========================================================

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearEmployeeError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // =========================================================
  // HELPER - CONFERENCE TITLE
  // =========================================================

  const getConferenceTitle = (conference) => {
    if (!conference) return "";

    if (typeof conference === "string") {
      return conference;
    }

    return (
      conference?.title ||
      conference?.conferenceTitle ||
      conference?.name ||
      conference?.basicInformation?.title ||
      ""
    );
  };

  // =========================================================
  // GET EMPLOYEE CONFERENCE NAME
  // =========================================================

  const getConferenceName = (employee) => {
    const assigned = employee?.assignedConferences;

    if (!Array.isArray(assigned) || assigned.length === 0) {
      return "No conference assigned";
    }

    const titles = assigned
      .map((conference) => getConferenceTitle(conference))
      .filter(Boolean);

    if (titles.length === 0) {
      return "No conference assigned";
    }

    if (titles.length === 1) {
      return titles[0];
    }

    return `${titles[0]} +${titles.length - 1} more`;
  };

  // =========================================================
  // GET EMPLOYEE STATUS
  // =========================================================

  const getEmployeeStatus = (employee) => {
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

    // If backend doesn't have status/isActive,
    // show Active as default.
    return "Active";
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredEmployees = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return employees.filter((employee) => {
      const fullName =
        employee?.fullName?.toLowerCase() || "";

      const email =
        employee?.email?.toLowerCase() || "";

      const phoneNumber =
        employee?.phoneNumber?.toLowerCase() || "";

      const conferenceName =
        getConferenceName(employee).toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        phoneNumber.includes(searchValue) ||
        conferenceName.includes(searchValue);

      const status = getEmployeeStatus(employee);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEmployees.length / employeesPerPage
    )
  );

  const startIndex =
    (currentPage - 1) * employeesPerPage;

  const paginatedEmployees =
    filteredEmployees.slice(
      startIndex,
      startIndex + employeesPerPage
    );

  // =========================================================
  // RESET PAGE
  // =========================================================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setOpenMenu(null);
  };

  // =========================================================
  // STATUS FILTER
  // =========================================================

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
    setOpenMenu(null);
  };

  // =========================================================
  // COUNTS
  // =========================================================

  const activeEmployees = employees.filter(
    (employee) =>
      getEmployeeStatus(employee) === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) =>
      getEmployeeStatus(employee) === "Inactive"
  ).length;

  // =========================================================
  // EMPLOYEE CLICK
  // =========================================================

  const handleEmployeeClick = (employee) => {
    if (openMenu !== null) return;

    const employeeId = employee?._id;

    if (!employeeId) return;

    navigate(`/admin/employees/${employeeId}`);
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleView = async (employee) => {
    setOpenMenu(null);

    const employeeId = employee?._id;

    if (!employeeId) return;

    try {
      // Fetch latest employee data from API
      await dispatch(
        getEmployeeById(employeeId)
      ).unwrap();

      navigate(
        `/admin/employees/${employeeId}`
      );
    } catch (error) {
      console.error(
        "Failed to fetch employee:",
        error
      );
    }
  };

  // =========================================================
  // UPDATE
  // =========================================================

  const handleUpdate = (employee) => {
    setOpenMenu(null);

    const employeeId = employee?._id;

    if (!employeeId) return;

    navigate(
      `/admin/employees/create`,
      {
        state: {
          employee,
          isEdit: true,
        },
      }
    );
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (employee) => {
    setOpenMenu(null);

    const employeeId = employee?._id;

    if (!employeeId) {
      alert("Employee ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.fullName}?`
    );

    if (!confirmed) return;

    try {
      await dispatch(
        deleteEmployee(employeeId)
      ).unwrap();

      // Redux employeeSlice automatically removes
      // deleted employee from employees array.
    } catch (error) {
      console.error(
        "Failed to delete employee:",
        error
      );
    }
  };

  // =========================================================
  // CLOSE MENU
  // =========================================================

  const closeMenu = () => {
    setOpenMenu(null);
  };

  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (loading && employees.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-5 lg:p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-[#7C3AED]" />

            <p className="text-xs font-medium text-gray-500">
              Loading employees...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 sm:p-5 lg:p-6"
      onClick={closeMenu}
    >

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-3 py-2">
          <p className="text-[11px] font-medium text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(clearEmployeeError());
            }}
            className="text-red-400 hover:text-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

        {/* TOTAL */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Employees
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-800">
                {employees.length}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
              <Users
                size={18}
                className="text-[#7C3AED]"
              />
            </div>

          </div>
        </div>

        {/* ACTIVE */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Active Employees
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-800">
                {activeEmployees}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <UserCheck
                size={18}
                className="text-green-600"
              />
            </div>

          </div>
        </div>

        {/* INACTIVE */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Inactive Employees
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-800">
                {inactiveEmployees}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
              <UserX
                size={18}
                className="text-red-500"
              />
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* ===================================================
            FILTERS
        =================================================== */}

        <div className="border-b border-gray-100 p-4">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">

              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search employee, phone or conference..."
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-9 text-xs text-gray-700 outline-none transition focus:border-[#7C3AED] focus:bg-white focus:ring-1 focus:ring-purple-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}

            </div>

            {/* STATUS */}

            <div className="flex items-center gap-2">

              <span className="text-[11px] font-medium text-gray-500">
                Status:
              </span>

              <select
                value={statusFilter}
                onChange={handleStatusChange}
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-100"
              >
                <option value="All">
                  All
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

            </div>
          </div>
        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="w-full overflow-x-auto">

          <table className="w-full min-w-[900px] table-fixed">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">

                <th className="w-[20%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Employee Name
                </th>

                <th className="w-[14%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Phone
                </th>

                <th className="w-[22%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Conference Name
                </th>

                <th className="w-[15%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Last Login
                </th>

                <th className="w-[15%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Last Logout
                </th>

                <th className="w-[8%] px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="w-[6%] px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {paginatedEmployees.length > 0 ? (

                paginatedEmployees.map((employee) => {

                  const employeeId =
                    employee?._id;

                  const employeeStatus =
                    getEmployeeStatus(employee);

                  const conferenceName =
                    getConferenceName(employee);

                  return (
                    <tr
                      key={employeeId}
                      onClick={() =>
                        handleEmployeeClick(
                          employee
                        )
                      }
                      className="cursor-pointer border-b border-gray-50 transition hover:bg-purple-50/30"
                    >

                      {/* EMPLOYEE */}

                      <td className="px-4 py-3.5">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-[#7C3AED]">
                            {employee?.fullName
                              ?.split(" ")
                              .map(
                                (name) =>
                                  name[0]
                              )
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-xs font-semibold text-gray-800">
                              {employee?.fullName ||
                                "Unnamed Employee"}
                            </p>

                            <p className="mt-0.5 truncate text-[10px] text-gray-400">
                              {employee?.email ||
                                "-"}
                            </p>

                          </div>
                        </div>

                      </td>

                      {/* PHONE */}

                      <td className="px-4 py-3.5">

                        <span className="block truncate text-xs text-gray-600">
                          {employee?.phoneNumber ||
                            "-"}
                        </span>

                      </td>

                      {/* CONFERENCE */}

                      <td className="px-4 py-3.5">

                        <p className="truncate text-xs font-medium text-gray-700">
                          {conferenceName}
                        </p>

                      </td>

                      {/* LAST LOGIN */}

                      <td className="px-4 py-3.5">

                        <span className="block truncate text-[11px] text-gray-600">
                          {employee?.lastLogin ||
                            employee?.lastLoginAt ||
                            "-"}
                        </span>

                      </td>

                      {/* LAST LOGOUT */}

                      <td className="px-4 py-3.5">

                        <span className="block truncate text-[11px] text-gray-600">
                          {employee?.lastLogout ||
                            employee?.lastLogoutAt ||
                            "-"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-2 py-3.5 text-center">

                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${
                            employeeStatus ===
                            "Active"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {employeeStatus}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td
                        className="relative px-2 py-3.5"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >

                        <div className="flex justify-center">

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setOpenMenu(
                                openMenu ===
                                  employeeId
                                  ? null
                                  : employeeId
                              );
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-purple-50 hover:text-[#7C3AED]"
                          >
                            <MoreVertical
                              size={17}
                            />
                          </button>

                        </div>

                        {/* POPUP */}

                        {openMenu ===
                          employeeId && (

                          <div
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="absolute right-2 bottom-[calc(100%-4px)] z-50 w-32 overflow-hidden rounded-lg border border-gray-100 bg-white p-1.5 shadow-xl"
                          >

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  employee
                                )
                              }
                              disabled={loading}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED] disabled:opacity-50"
                            >
                              <Eye size={14} />
                              <span>
                                View
                              </span>
                            </button>

                            {/* UPDATE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleUpdate(
                                  employee
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED]"
                            >
                              <Edit size={14} />
                              <span>
                                Update
                              </span>
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  employee
                                )
                              }
                              disabled={
                                deleteLoading
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2
                                size={14}
                              />

                              <span>
                                {deleteLoading
                                  ? "Deleting..."
                                  : "Delete"}
                              </span>
                            </button>

                          </div>
                        )}

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="px-4 py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <Users
                        size={28}
                        className="mb-2 text-gray-300"
                      />

                      <p className="text-sm font-semibold text-gray-600">
                        {search ||
                        statusFilter !==
                          "All"
                          ? "No employees found"
                          : "No employees available"}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {search ||
                        statusFilter !==
                          "All"
                          ? "Try changing your search or filter."
                          : "Create an employee to see them here."}
                      </p>

                    </div>

                  </td>

                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] text-gray-400">

            Showing{" "}

            <span className="font-semibold text-gray-600">
              {filteredEmployees.length ===
              0
                ? 0
                : startIndex + 1}
            </span>

            {" "}to{" "}

            <span className="font-semibold text-gray-600">
              {Math.min(
                startIndex +
                  employeesPerPage,
                filteredEmployees.length
              )}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-gray-600">
              {filteredEmployees.length}
            </span>

            {" "}employees

          </p>

          <div className="flex items-center gap-1">

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() => {
                setOpenMenu(null);

                setCurrentPage(
                  (prev) =>
                    Math.max(
                      prev - 1,
                      1
                    )
                );
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                currentPage === 1
                  ? "cursor-not-allowed border-gray-100 text-gray-300"
                  : "border-gray-200 text-gray-500 hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED]"
              }`}
            >
              <ChevronLeft size={15} />
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
                onClick={() => {
                  setOpenMenu(null);
                  setCurrentPage(page);
                }}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                  currentPage === page
                    ? "bg-[#7C3AED] text-white"
                    : "border border-gray-200 text-gray-500 hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED]"
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
              onClick={() => {
                setOpenMenu(null);

                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                );
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                currentPage ===
                totalPages
                  ? "cursor-not-allowed border-gray-100 text-gray-300"
                  : "border-gray-200 text-gray-500 hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED]"
              }`}
            >
              <ChevronRight
                size={15}
              />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Employees;
