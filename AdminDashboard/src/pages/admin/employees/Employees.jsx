
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { createPortal } from "react-dom";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getEmployees,
  getEmployeeById,
  deleteEmployee,
  clearEmployeeError,
} from "../../../redux/employeeSlice";

const Employees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ============================================================
  // REDUX STATE
  // ============================================================

  const {
    employees = [],
    loading,
    deleteLoading,
    error,
  } = useSelector((state) => state.employee);

  // ============================================================
  // LOCAL STATE
  // ============================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [openActionId, setOpenActionId] =
    useState(null);

  const [actionMenuPosition, setActionMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const actionButtonRef = useRef(null);
  const actionMenuRef = useRef(null);

  const employeesPerPage = 10;

  // ============================================================
  // FETCH EMPLOYEES
  // ============================================================

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  // ============================================================
  // CLEAR ERROR
  // ============================================================

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      dispatch(clearEmployeeError());
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, dispatch]);

  // ============================================================
  // CREATE EMPLOYEE
  // ============================================================

  const handleCreateEmployee = () => {
    setOpenActionId(null);

    navigate("/admin/employees/create");
  };

  // ============================================================
  // CONFERENCE TITLE
  // ============================================================

  const getConferenceTitle = (conference) => {
    if (!conference) {
      return "";
    }

    if (typeof conference === "string") {
      return conference;
    }

    return (
      conference?.title ||
      conference?.conferenceTitle ||
      conference?.name ||
      conference?.basicInformation?.title ||
      conference?.basicInformation?.conferenceTitle ||
      ""
    );
  };

  // ============================================================
  // CONFERENCE NAME
  // ============================================================

  const getConferenceName = (employee) => {
    const assigned =
      employee?.assignedConferences;

    if (
      !Array.isArray(assigned) ||
      assigned.length === 0
    ) {
      return "No conference assigned";
    }

    const titles = assigned
      .map((conference) =>
        getConferenceTitle(conference)
      )
      .filter(Boolean);

    if (titles.length === 0) {
      return "No conference assigned";
    }

    if (titles.length === 1) {
      return titles[0];
    }

    return `${titles[0]} +${titles.length - 1} more`;
  };

  // ============================================================
  // EMPLOYEE STATUS
  // ============================================================

  const getEmployeeStatus = (employee) => {
    if (employee?.status) {
      const status = String(
        employee.status
      ).toLowerCase();

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
  };

  // ============================================================
  // SEARCH + STATUS FILTER
  // ============================================================

  const filteredEmployees = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return employees.filter((employee) => {
      const fullName = String(
        employee?.fullName || ""
      ).toLowerCase();

      const email = String(
        employee?.email || ""
      ).toLowerCase();

      const phoneNumber = String(
        employee?.phoneNumber || ""
      ).toLowerCase();

      const conferenceName =
        getConferenceName(employee).toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        phoneNumber.includes(searchValue) ||
        conferenceName.includes(searchValue);

      const employeeStatus =
        getEmployeeStatus(employee);

      const matchesStatus =
        statusFilter === "All" ||
        employeeStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    employees,
    search,
    statusFilter,
  ]);

  // ============================================================
  // SORT EMPLOYEES
  // ============================================================

  const employeeData = useMemo(() => {
    return [...filteredEmployees].sort(
      (a, b) => {
        const dateA = new Date(
          a.createdAt ||
            a.updatedAt ||
            0
        ).getTime();

        const dateB = new Date(
          b.createdAt ||
            b.updatedAt ||
            0
        ).getTime();

        return dateB - dateA;
      }
    );
  }, [filteredEmployees]);

  // ============================================================
  // STATS
  // ============================================================

  const employeeStats = useMemo(() => {
    const total = employees.length;

    const active = employees.filter(
      (employee) =>
        getEmployeeStatus(employee) ===
        "Active"
    ).length;

    const inactive = employees.filter(
      (employee) =>
        getEmployeeStatus(employee) ===
        "Inactive"
    ).length;

    return {
      total,
      active,
      inactive,
    };
  }, [employees]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      employeeData.length /
        employeesPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    employeesPerPage;

  const currentEmployees =
    employeeData.slice(
      startIndex,
      startIndex + employeesPerPage
    );

  // ============================================================
  // RESET PAGE
  // ============================================================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
    setOpenActionId(null);
  };

  // ============================================================
  // STATUS FILTER
  // ============================================================

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
    setOpenActionId(null);
  };

  // ============================================================
  // EMPLOYEE INITIALS
  // ============================================================

  const getInitials = (name) => {
    if (!name) {
      return "EM";
    }

    return String(name)
      .split(" ")
      .filter(Boolean)
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ============================================================
  // CLOSE ACTION MENU
  // ============================================================

  const closeActionMenu = () => {
    setOpenActionId(null);
  };

  // ============================================================
  // OPEN ACTION MENU
  // ============================================================

  const handleActionMenu = (
    event,
    employeeId
  ) => {
    event.stopPropagation();

    if (openActionId === employeeId) {
      setOpenActionId(null);
      return;
    }

    const button =
      event.currentTarget;

    actionButtonRef.current =
      button;

    const rect =
      button.getBoundingClientRect();

    const menuWidth = 170;
    const menuHeight = 150;
    const spacing = 6;

    let left =
      rect.right - menuWidth;

    let top =
      rect.bottom + spacing;

    // Keep popup inside viewport horizontally
    if (
      left <
      8
    ) {
      left = 8;
    }

    if (
      left + menuWidth >
      window.innerWidth - 8
    ) {
      left =
        window.innerWidth -
        menuWidth -
        8;
    }

    // If not enough space below, show above
    if (
      top + menuHeight >
      window.innerHeight - 8
    ) {
      top =
        rect.top -
        menuHeight -
        spacing;
    }

    if (top < 8) {
      top = 8;
    }

    setActionMenuPosition({
      top,
      left,
    });

    setOpenActionId(employeeId);
  };

  // ============================================================
  // UPDATE ACTION MENU POSITION
  // ============================================================

  useEffect(() => {
    if (!openActionId) {
      return;
    }

    const updatePosition = () => {
      const button =
        actionButtonRef.current;

      if (!button) {
        return;
      }

      const rect =
        button.getBoundingClientRect();

      const menuWidth = 170;
      const menuHeight = 150;
      const spacing = 6;

      let left =
        rect.right - menuWidth;

      let top =
        rect.bottom + spacing;

      if (
        left <
        8
      ) {
        left = 8;
      }

      if (
        left + menuWidth >
        window.innerWidth - 8
      ) {
        left =
          window.innerWidth -
          menuWidth -
          8;
      }

      if (
        top + menuHeight >
        window.innerHeight - 8
      ) {
        top =
          rect.top -
          menuHeight -
          spacing;
      }

      if (top < 8) {
        top = 8;
      }

      setActionMenuPosition({
        top,
        left,
      });
    };

    window.addEventListener(
      "resize",
      updatePosition
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );
    };
  }, [openActionId]);

  // ============================================================
  // CLOSE ACTION MENU OUTSIDE
  // ============================================================

  useEffect(() => {
    if (!openActionId) {
      return;
    }

    const handleOutsideClick = (
      event
    ) => {
      const clickedButton =
        actionButtonRef.current?.contains(
          event.target
        );

      const clickedMenu =
        actionMenuRef.current?.contains(
          event.target
        );

      if (
        !clickedButton &&
        !clickedMenu
      ) {
        setOpenActionId(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [openActionId]);

  // ============================================================
  // VIEW EMPLOYEE
  // ============================================================

  const handleView = async (employee) => {
    closeActionMenu();

    const employeeId =
      employee?._id;

    if (!employeeId) {
      return;
    }

    try {
      await dispatch(
        getEmployeeById(employeeId)
      ).unwrap();

      navigate(
        `/admin/employees/${employeeId}`
      );
    } catch (viewError) {
      console.error(
        "Failed to fetch employee:",
        viewError
      );
    }
  };

  // ============================================================
  // UPDATE EMPLOYEE
  // ============================================================

  const handleUpdate = (employee) => {
    closeActionMenu();

    const employeeId =
      employee?._id;

    if (!employeeId) {
      return;
    }

    navigate(
      "/admin/employees/create",
      {
        state: {
          employee,
          isEdit: true,
        },
      }
    );
  };

  // ============================================================
  // DELETE EMPLOYEE
  // ============================================================

  const handleDelete = async (employee) => {
    closeActionMenu();

    const employeeId =
      employee?._id;

    if (!employeeId) {
      window.alert(
        "Employee ID not found."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${
          employee?.fullName ||
          "this employee"
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteEmployee(employeeId)
      ).unwrap();

      dispatch(getEmployees());
    } catch (deleteError) {
      console.error(
        "Failed to delete employee:",
        deleteError
      );
    }
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {
    if (status === "Active") {
      return "bg-emerald-50 text-emerald-600";
    }

    return "bg-red-50 text-red-500";
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    const formattedDate =
      new Date(date);

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return String(date);
    }

    return formattedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ============================================================
  // GET LOGIN VALUE
  // ============================================================

  const getLastLogin = (employee) => {
    return (
      employee?.lastLogin ||
      employee?.lastLoginAt ||
      employee?.last_login ||
      null
    );
  };

  // ============================================================
  // GET LOGOUT VALUE
  // ============================================================

  const getLastLogout = (employee) => {
    return (
      employee?.lastLogout ||
      employee?.lastLogoutAt ||
      employee?.last_logout ||
      null
    );
  };

  // ============================================================
  // STAT CARDS
  // ============================================================

  const statCards = [
    {
      title: "Total Employees",
      value: employeeStats.total,
      icon: Users,
      description:
        "All registered employees",
    },
    {
      title: "Active",
      value: employeeStats.active,
      icon: UserCheck,
      description:
        "Currently active employees",
    },
    {
      title: "Inactive",
      value: employeeStats.inactive,
      icon: UserX,
      description:
        "Currently inactive employees",
    },
  ];

  // ============================================================
  // CURRENT ACTION EMPLOYEE
  // ============================================================

  const activeEmployee =
    currentEmployees.find(
      (employee) =>
        employee?._id ===
        openActionId
    );

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="relative w-full min-w-0 overflow-x-hidden">

      <div className="animate-[fadeIn_0.35s_ease-out]">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Employees
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Manage and view all employees
            </p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleCreateEmployee();
            }}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-200 active:scale-[0.98]"
          >
            <UserPlus
              size={16}
              strokeWidth={2.3}
            />

            New Employee
          </button>

        </div>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">

            <p className="text-[11px] font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                dispatch(
                  clearEmployeeError()
                );
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-red-400 transition hover:bg-red-100 hover:text-red-600"
            >
              <X size={14} />
            </button>

          </div>
        )}

        {/* ====================================================
            STAT CARDS
        ==================================================== */}

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {statCards.map(
            (card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                  className="animate-[fadeUp_0.4s_ease-out_both] rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_5px_18px_rgba(15,23,42,0.06)]"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <p className="text-[11px] font-medium text-gray-500">
                        {card.title}
                      </p>

                      <p className="mt-1 text-[22px] font-bold leading-none text-gray-900">
                        {card.value}
                      </p>

                      <p className="mt-1.5 truncate text-[10px] text-gray-400">
                        {card.description}
                      </p>

                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">

                      <Icon
                        size={17}
                        strokeWidth={2}
                        className="text-violet-600"
                      />

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

        {/* ====================================================
            TABLE CARD
        ==================================================== */}

        <div className="relative w-full rounded-xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

          {/* ==================================================
              FILTERS
          ================================================== */}

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
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  placeholder="Search employee, phone or conference..."
                  className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-9 text-xs text-gray-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-100"
                />

                {search && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

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
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-100"
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

          {/* ==================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto scrollbar-hide rounded-xl">

            <table className="w-full min-w-[980px] table-fixed">

              <thead>

                <tr className="border-b border-gray-100 bg-gray-50/80">

                  {/* 21% */}

                  <th className="w-[21%] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Employee Name
                  </th>

                  {/* 12% */}

                  <th className="w-[12%] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </th>

                  {/* 23% */}

                  <th className="w-[23%] pl-1 pr-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Conference Name
                  </th>

                  {/* 15% */}

                  <th className="w-[15%] px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Last Login
                  </th>

                  {/* 15% */}

                  <th className="w-[15%] px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Last Logout
                  </th>

                  {/* 8% */}

                  <th className="w-[8%] px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  {/* 6% */}

                  <th className="w-[6%] px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading &&
                currentEmployees.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="px-4 py-14 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-violet-100 border-t-violet-600" />

                        <p className="mt-3 text-[13px] font-medium text-gray-500">
                          Loading employee data...
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : currentEmployees.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="px-4 py-14 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <Users
                          size={28}
                          className="text-gray-300"
                        />

                        <p className="mt-3 text-[13px] font-semibold text-gray-600">
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

                ) : (

                  currentEmployees.map(
                    (
                      employee,
                      index
                    ) => {

                      const employeeId =
                        employee?._id;

                      const status =
                        getEmployeeStatus(
                          employee
                        );

                      const conferenceName =
                        getConferenceName(
                          employee
                        );

                      return (
                        <tr
                          key={
                            employeeId ||
                            index
                          }
                          style={{
                            animationDelay: `${index * 45}ms`,
                          }}
                          className="animate-[fadeUp_0.35s_ease-out_both] border-b border-gray-100 last:border-0 transition duration-200 hover:bg-violet-50/30"
                        >

                          {/* ==================================================
                              EMPLOYEE
                          ================================================== */}

                          <td className="px-4 py-3 align-top">

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[11px] font-bold text-violet-600">

                                {getInitials(
                                  employee?.fullName
                                )}

                              </div>

                              <div className="min-w-0">

                                <p
                                  title={
                                    employee?.fullName ||
                                    ""
                                  }
                                  className="truncate text-[13px] font-semibold leading-5 text-gray-800"
                                >
                                  {employee?.fullName ||
                                    "Unnamed Employee"}
                                </p>

                                <p
                                  title={
                                    employee?.email ||
                                    ""
                                  }
                                  className="mt-0.5 truncate text-[10px] text-gray-400"
                                >
                                  {employee?.email ||
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* ==================================================
                              PHONE
                          ================================================== */}

                          <td className="px-3 py-3 align-top">

                            <p className="truncate text-[12px] text-gray-600">
                              {employee?.phoneNumber ||
                                "-"}
                            </p>

                          </td>

                          {/* ==================================================
                              CONFERENCE
                          ================================================== */}

                          <td className="pl-1 pr-3 py-3 align-top">

                            <p
                              title={
                                conferenceName
                              }
                              className="whitespace-normal break-words text-[12px] font-medium leading-5 text-gray-700"
                            >
                              {
                                conferenceName
                              }
                            </p>

                          </td>

                          {/* ==================================================
                              LAST LOGIN
                          ================================================== */}

                          <td className="px-2 py-3 align-top">

                            <p className="whitespace-nowrap text-[11px] text-gray-500">
                              {formatDateTime(
                                getLastLogin(
                                  employee
                                )
                              )}
                            </p>

                          </td>

                          {/* ==================================================
                              LAST LOGOUT
                          ================================================== */}

                          <td className="px-2 py-3 align-top">

                            <p className="whitespace-nowrap text-[11px] text-gray-500">
                              {formatDateTime(
                                getLastLogout(
                                  employee
                                )
                              )}
                            </p>

                          </td>

                          {/* ==================================================
                              STATUS
                          ================================================== */}

                          <td className="px-2 py-3 align-top text-center">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                                status
                              )}`}
                            >
                              {status}
                            </span>

                          </td>

                          {/* ==================================================
                              ACTIONS
                          ================================================== */}

                          <td className="px-2 py-3 align-top">

                            <div className="flex items-center justify-center">

                              <button
                                type="button"
                                onClick={(event) =>
                                  handleActionMenu(
                                    event,
                                    employeeId
                                  )
                                }
                                className="inline-flex items-center justify-center rounded-md px-2 py-1.5 text-[12px] font-semibold text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                              >
                                <MoreVertical
                                  size={15}
                                  strokeWidth={2}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

          {/* ==================================================
              PAGINATION
          ================================================== */}

          <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[11px] text-gray-500">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {employeeData.length ===
                0
                  ? 0
                  : startIndex + 1}
              </span>

              {" "}to{" "}

              <span className="font-semibold text-gray-700">
                {Math.min(
                  startIndex +
                    employeesPerPage,
                  employeeData.length
                )}
              </span>

              {" "}of{" "}

              <span className="font-semibold text-gray-700">
                {
                  employeeData.length
                }
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
                  setOpenActionId(
                    null
                  );

                  setCurrentPage(
                    (previousPage) =>
                      Math.max(
                        previousPage - 1,
                        1
                      )
                  );
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={15}
                />
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
                    setOpenActionId(
                      null
                    );

                    setCurrentPage(
                      page
                    );
                  }}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                    currentPage ===
                    page
                      ? "bg-violet-600 text-white"
                      : "border border-gray-200 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
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
                  setOpenActionId(
                    null
                  );

                  setCurrentPage(
                    (previousPage) =>
                      Math.min(
                        previousPage + 1,
                        totalPages
                      )
                  );
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={15}
                />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          ACTION POPUP - PORTAL
          This will appear above table/overflow
      ======================================================== */}

      {openActionId &&
        activeEmployee &&
        typeof document !==
          "undefined" &&
        createPortal(
          <div
            ref={actionMenuRef}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              position: "fixed",
              top: `${actionMenuPosition.top}px`,
              left: `${actionMenuPosition.left}px`,
              zIndex: 99999,
            }}
            className="w-[170px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.20)]"
          >

            {/* VIEW */}

            <button
              type="button"
              onClick={() =>
                handleView(
                  activeEmployee
                )
              }
              disabled={loading}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Eye
                size={15}
              />

              View

            </button>

            {/* UPDATE */}

            <button
              type="button"
              onClick={() =>
                handleUpdate(
                  activeEmployee
                )
              }
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
            >

              <Edit
                size={15}
              />

              Update

            </button>

            <div className="my-1 border-t border-gray-100" />

            {/* DELETE */}

            <button
              type="button"
              onClick={() =>
                handleDelete(
                  activeEmployee
                )
              }
              disabled={deleteLoading}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[12px] font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Trash2
                size={15}
              />

              {deleteLoading
                ? "Deleting..."
                : "Delete"}

            </button>

          </div>,

          document.body
        )}

      {/* ========================================================
          ANIMATIONS + SCROLLBAR HIDE
      ======================================================== */}

      <style>{`

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Hide horizontal scrollbar */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

      `}</style>

    </div>
  );
};

export default Employees;
