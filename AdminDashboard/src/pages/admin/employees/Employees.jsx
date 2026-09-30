
import React, { useMemo, useState } from "react";
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

const Employees = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const employeesPerPage = 5;

  const [employees, setEmployees] = useState([
    {
      id: 1,
      fullName: "John Smith",
      email: "john.smith@example.com",
      phoneNumber: "+91 9876543210",
      conferenceName: "Autism Research & Innovations",
      lastLogin: "29 Sep 2026, 09:45 AM",
      lastLogout: "29 Sep 2026, 06:20 PM",
      status: "Active",
    },
    {
      id: 2,
      fullName: "Sarah Williams",
      email: "sarah.williams@example.com",
      phoneNumber: "+91 9876543211",
      conferenceName: "Mental Health & Psychiatry",
      lastLogin: "29 Sep 2026, 10:15 AM",
      lastLogout: "29 Sep 2026, 07:05 PM",
      status: "Active",
    },
    {
      id: 3,
      fullName: "David Brown",
      email: "david.brown@example.com",
      phoneNumber: "+91 9876543212",
      conferenceName: "Endocrine & Metabolic Innovation",
      lastLogin: "27 Sep 2026, 09:30 AM",
      lastLogout: "27 Sep 2026, 05:45 PM",
      status: "Inactive",
    },
    {
      id: 4,
      fullName: "Emily Johnson",
      email: "emily.johnson@example.com",
      phoneNumber: "+91 9876543213",
      conferenceName: "Food, Nutrition & Wellness",
      lastLogin: "28 Sep 2026, 11:05 AM",
      lastLogout: "28 Sep 2026, 06:40 PM",
      status: "Active",
    },
    {
      id: 5,
      fullName: "Michael Wilson",
      email: "michael.wilson@example.com",
      phoneNumber: "+91 9876543214",
      conferenceName: "Oncology Research & AI Innovations",
      lastLogin: "28 Sep 2026, 09:10 AM",
      lastLogout: "28 Sep 2026, 05:55 PM",
      status: "Active",
    },
    {
      id: 6,
      fullName: "Jessica Davis",
      email: "jessica.davis@example.com",
      phoneNumber: "+91 9876543215",
      conferenceName: "Healthcare Innovation & Precision Medicine",
      lastLogin: "26 Sep 2026, 10:20 AM",
      lastLogout: "26 Sep 2026, 06:15 PM",
      status: "Inactive",
    },
    {
      id: 7,
      fullName: "Robert Miller",
      email: "robert.miller@example.com",
      phoneNumber: "+91 9876543216",
      conferenceName: "Heart & Cardiovascular Diseases",
      lastLogin: "29 Sep 2026, 08:50 AM",
      lastLogout: "29 Sep 2026, 06:30 PM",
      status: "Active",
    },
    {
      id: 8,
      fullName: "Sophia Anderson",
      email: "sophia.anderson@example.com",
      phoneNumber: "+91 9876543217",
      conferenceName: "AI & Digital Psychiatry",
      lastLogin: "25 Sep 2026, 09:40 AM",
      lastLogout: "25 Sep 2026, 05:50 PM",
      status: "Active",
    },
    {
      id: 9,
      fullName: "Daniel Thomas",
      email: "daniel.thomas@example.com",
      phoneNumber: "+91 9876543218",
      conferenceName: "Autism Research & Innovations",
      lastLogin: "24 Sep 2026, 10:00 AM",
      lastLogout: "24 Sep 2026, 06:00 PM",
      status: "Inactive",
    },
    {
      id: 10,
      fullName: "Olivia Moore",
      email: "olivia.moore@example.com",
      phoneNumber: "+91 9876543219",
      conferenceName: "Mental Health & Psychiatry",
      lastLogin: "29 Sep 2026, 09:25 AM",
      lastLogout: "29 Sep 2026, 07:10 PM",
      status: "Active",
    },
  ]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        employee.fullName.toLowerCase().includes(searchValue) ||
        employee.phoneNumber.toLowerCase().includes(searchValue) ||
        employee.conferenceName.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / employeesPerPage)
  );

  const startIndex = (currentPage - 1) * employeesPerPage;

  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + employeesPerPage
  );

  /* =========================================================
     RESET PAGE WHEN SEARCH / FILTER CHANGES
  ========================================================= */

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setOpenMenu(null);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
    setOpenMenu(null);
  };

  /* =========================================================
     COUNTS
  ========================================================= */

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  /* =========================================================
     EMPLOYEE DETAILS
  ========================================================= */

  const handleEmployeeClick = (employee) => {
    if (openMenu !== null) return;

    navigate(`/admin/employees/${employee.id}`, {
      state: {
        employee,
      },
    });
  };

  /* =========================================================
     VIEW
  ========================================================= */

  const handleView = (employee) => {
    setOpenMenu(null);

    navigate(`/admin/employees/${employee.id}`, {
      state: {
        employee,
      },
    });
  };

  /* =========================================================
     UPDATE
  ========================================================= */

  const handleUpdate = (employee) => {
    setOpenMenu(null);

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

  const handleDelete = (employee) => {
    setOpenMenu(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.fullName}?`
    );

    if (!confirmed) return;

    setEmployees((prev) =>
      prev.filter((item) => item.id !== employee.id)
    );

    const newFilteredLength = filteredEmployees.length - 1;
    const newTotalPages = Math.max(
      1,
      Math.ceil(newFilteredLength / employeesPerPage)
    );

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  /* =========================================================
     CLOSE POPUP
  ========================================================= */

  const closeMenu = () => {
    setOpenMenu(null);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 sm:p-5 lg:p-6"
      onClick={closeMenu}
    >
      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total */}
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

        {/* Active */}
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

        {/* Inactive */}
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
            {/* Search */}
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

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-gray-500">
                Status:
              </span>

              <select
                value={statusFilter}
                onChange={handleStatusChange}
                onClick={(e) => e.stopPropagation()}
                className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-100"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="w-full">
          <table className="w-full table-fixed">
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
                paginatedEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    onClick={() => handleEmployeeClick(employee)}
                    className="cursor-pointer border-b border-gray-50 transition hover:bg-purple-50/30"
                  >
                    {/* Employee Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-[#7C3AED]">
                          {employee.fullName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-gray-800">
                            {employee.fullName}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-gray-400">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5">
                      <span className="block truncate text-xs text-gray-600">
                        {employee.phoneNumber}
                      </span>
                    </td>

                    {/* Conference */}
                    <td className="px-4 py-3.5">
                      <p className="truncate text-xs font-medium text-gray-700">
                        {employee.conferenceName}
                      </p>
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3.5">
                      <span className="block truncate text-[11px] text-gray-600">
                        {employee.lastLogin}
                      </span>
                    </td>

                    {/* Last Logout */}
                    <td className="px-4 py-3.5">
                      <span className="block truncate text-[11px] text-gray-600">
                        {employee.lastLogout}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-2 py-3.5 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${
                          employee.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      className="relative px-2 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenu(
                              openMenu === employee.id
                                ? null
                                : employee.id
                            );
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-purple-50 hover:text-[#7C3AED]"
                        >
                          <MoreVertical size={17} />
                        </button>
                      </div>

                      {/* =================================================
                          SMALL POPUP - OPENS UPWARD
                      ================================================= */}

                      {openMenu === employee.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-2 bottom-[calc(100%-4px)] z-50 w-32 overflow-hidden rounded-lg border border-gray-100 bg-white p-1.5 shadow-xl"
                        >
                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              handleView(employee)
                            }
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED]"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>

                          {/* Update */}
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdate(employee)
                            }
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED]"
                          >
                            <Edit size={14} />
                            <span>Update</span>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(employee)
                            }
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
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
                        No employees found
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Try changing your search or filter.
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
              {filteredEmployees.length === 0
                ? 0
                : startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-600">
              {Math.min(
                startIndex + employeesPerPage,
                filteredEmployees.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-600">
              {filteredEmployees.length}
            </span>{" "}
            employees
          </p>

          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                setOpenMenu(null);
                setCurrentPage((prev) =>
                  Math.max(prev - 1, 1)
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

            {/* Page Numbers */}
            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
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

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => {
                setOpenMenu(null);
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                );
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                currentPage === totalPages
                  ? "cursor-not-allowed border-gray-100 text-gray-300"
                  : "border-gray-200 text-gray-500 hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED]"
              }`}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
