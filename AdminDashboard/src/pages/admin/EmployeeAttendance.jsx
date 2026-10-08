import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Users,
  UserCheck,
  UserX,
  CalendarCheck,
  CalendarX,
  Search,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

import {
  getAdminAttendanceDashboard,
  getAllAdminAttendance,

  selectAttendanceDashboard,
  selectAttendanceDashboardLoading,
  selectAttendanceDashboardError,

  selectAttendanceRecords,
  selectAttendanceLoading,
  selectAttendanceError,
} from "../../redux/dashboardSlice";


/* =========================================================
   GET TODAY DATE
   FORMAT: YYYY-MM-DD
========================================================= */

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

const EmployeeAttendance = () => {

  /* =========================================================
     REDUX
  ========================================================= */

  const dispatch = useDispatch();

  const attendanceDashboard = useSelector(
    selectAttendanceDashboard
  );

  const attendanceDashboardLoading =
    useSelector(
      selectAttendanceDashboardLoading
    );

  const attendanceDashboardError =
    useSelector(
      selectAttendanceDashboardError
    );

  const attendanceRecords = useSelector(
    selectAttendanceRecords
  );

  const attendanceRecordsLoading =
    useSelector(
      selectAttendanceLoading
    );

  const attendanceRecordsError =
    useSelector(
      selectAttendanceError
    );


  /* =========================================================
     STATE
  ========================================================= */

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  /*
     Default date = TODAY

     Example:
     2026-10-09
  */
  const [dateFilter, setDateFilter] =
    useState(getTodayDate);

  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 5;


  /* =========================================================
     API CALL
  ========================================================= */

  useEffect(() => {

    // Attendance dashboard
    dispatch(
      getAdminAttendanceDashboard()
    );

    // Fetch all attendance records
    // Local search / filter / pagination
    // are handled below.
    dispatch(
      getAllAdminAttendance({
        search: "",
        date: "",
        status: "",
        page: 1,
        limit: 1000,
      })
    );

  }, [dispatch]);


  /* =========================================================
     DATE FORMAT
     DISPLAY FORMAT: MM/DD/YYYY
========================================================= */

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    const month = String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      parsedDate.getDate()
    ).padStart(2, "0");

    const year =
      parsedDate.getFullYear();

    return `${month}/${day}/${year}`;
  };


  /* =========================================================
     TIME FORMAT
========================================================= */

  const formatTime = (date) => {

    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };


  /* =========================================================
     GET EMPLOYEE DATA
     
     IMPORTANT:
     Department comes ONLY from employee.department
     
     No designation / employeeType fallback.
========================================================= */

  const getEmployeeData = (
    attendance
  ) => {

    const employee =
      attendance?.employee || {};

    return {

      name:
        employee?.fullName ||
        employee?.name ||
        employee?.username ||
        attendance?.employeeName ||
        "Unknown Employee",

      email:
        employee?.email ||
        attendance?.email ||
        "-",

      department:
        employee?.department ||
        attendance?.department ||
        "-",
    };
  };


  /* =========================================================
     NORMALIZE ATTENDANCE DATA
========================================================= */

  const normalizedAttendance =
    useMemo(() => {

      if (
        !Array.isArray(
          attendanceRecords
        )
      ) {
        return [];
      }

      const rows = [];

      attendanceRecords.forEach(
        (
          attendance,
          attendanceIndex
        ) => {

          /* =================================================
             CASE 1:
             Monthly attendance document
             containing days[]
          ================================================= */

          if (
            Array.isArray(
              attendance?.days
            )
          ) {

            const employee =
              getEmployeeData(
                attendance
              );

            attendance.days.forEach(
              (
                day,
                dayIndex
              ) => {

                rows.push({

                  id:
                    `${attendance?._id || attendanceIndex}-${dayIndex}`,

                  name:
                    employee.name,

                  email:
                    employee.email,

                  department:
                    employee.department,

                  date:
                    formatDate(
                      day?.date
                    ),

                  checkIn:
                    formatTime(
                      day?.checkIn
                    ),

                  checkOut:
                    formatTime(
                      day?.checkOut
                    ),

                  status:
                    day?.status ||
                    "Absent",
                });

              }
            );

            return;
          }


          /* =================================================
             CASE 2:
             Backend already returns flattened records
          ================================================= */

          const employee =
            getEmployeeData(
              attendance
            );

          rows.push({

            id:
              attendance?._id ||
              attendance?.id ||
              attendanceIndex,

            name:
              employee.name,

            email:
              employee.email,

            department:
              employee.department,

            date:
              formatDate(
                attendance?.date
              ),

            checkIn:
              formatTime(
                attendance?.checkIn
              ),

            checkOut:
              formatTime(
                attendance?.checkOut
              ),

            status:
              attendance?.status ||
              "Absent",
          });

        }
      );

      return rows;

    }, [attendanceRecords]);


  /* =========================================================
     FILTER
========================================================= */

  const filteredAttendance =
    useMemo(() => {

      return normalizedAttendance.filter(
        (item) => {

          /* -----------------------------------------------
             SEARCH
          ----------------------------------------------- */

          const searchValue =
            search
              .toLowerCase()
              .trim();

          const matchesSearch =
            !searchValue ||

            String(
              item.name || ""
            )
              .toLowerCase()
              .includes(
                searchValue
              ) ||

            String(
              item.email || ""
            )
              .toLowerCase()
              .includes(
                searchValue
              ) ||

            String(
              item.department || ""
            )
              .toLowerCase()
              .includes(
                searchValue
              );


          /* -----------------------------------------------
             STATUS
          ----------------------------------------------- */

          const matchesStatus =
            statusFilter === "All" ||
            item.status ===
              statusFilter;


          /* -----------------------------------------------
             DATE

             Date input:
             YYYY-MM-DD

             Table:
             MM/DD/YYYY
          ----------------------------------------------- */

          let formattedFilterDate = "";

          if (dateFilter) {

            const [
              year,
              month,
              day,
            ] =
              dateFilter.split("-");

            formattedFilterDate =
              `${month}/${day}/${year}`;
          }

          const matchesDate =
            !dateFilter ||
            item.date ===
              formattedFilterDate;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesDate
          );
        }
      );

    }, [
      normalizedAttendance,
      search,
      statusFilter,
      dateFilter,
    ]);


  /* =========================================================
     PAGINATION
========================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredAttendance.length /
          rowsPerPage
      )
    );


  const startIndex =
    (currentPage - 1) *
    rowsPerPage;


  const paginatedAttendance =
    useMemo(() => {

      return filteredAttendance.slice(
        startIndex,
        startIndex + rowsPerPage
      );

    }, [
      filteredAttendance,
      startIndex,
    ]);


  /* =========================================================
     KEEP PAGE VALID
========================================================= */

  useEffect(() => {

    setCurrentPage(
      (page) =>
        Math.min(
          Math.max(page, 1),
          totalPages
        )
    );

  }, [totalPages]);


  /* =========================================================
     FILTER HANDLERS
========================================================= */

  const handleSearch = (
    value
  ) => {

    setSearch(value);
    setCurrentPage(1);
  };


  const handleStatus = (
    value
  ) => {

    setStatusFilter(value);
    setCurrentPage(1);
  };


  const handleDate = (
    value
  ) => {

    setDateFilter(value);
    setCurrentPage(1);
  };


  /* =========================================================
     SUMMARY
========================================================= */

  const totalEmployees =
    attendanceDashboard
      ?.totalEmployees ?? 0;


  const todayPresent =
    attendanceDashboard
      ?.todayPresent ?? 0;


  const todayAbsent =
    attendanceDashboard
      ?.todayAbsent ?? 0;


  const thisMonthPresent =
    attendanceDashboard
      ?.monthPresent ?? 0;


  const thisMonthAbsent =
    attendanceDashboard
      ?.monthAbsent ?? 0;


  /* =========================================================
     FRAMER MOTION
========================================================= */

  const containerVariants = {

    hidden: {
      opacity: 0,
      y: 10,
    },

    visible: {

      opacity: 1,
      y: 0,

      transition: {
        duration: 0.35,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
  };


  const cardVariants = {

    hidden: {
      opacity: 0,
      y: 8,
    },

    visible: {

      opacity: 1,
      y: 0,

      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };


  const rowVariants = {

    hidden: {
      opacity: 0,
      y: 6,
    },

    visible: {

      opacity: 1,
      y: 0,

      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    },
  };


  /* =========================================================
     STATUS BADGE
========================================================= */

  const statusBadge = (
    status
  ) => {

    if (
      status === "Present"
    ) {

      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">

          <CheckCircle2
            size={13}
          />

          Present

        </span>
      );
    }


    if (
      status === "Absent"
    ) {

      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-500">

          <XCircle
            size={13}
          />

          Absent

        </span>
      );
    }


    if (
      status === "Leave"
    ) {

      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-500">

          <Clock3
            size={13}
          />

          Leave

        </span>
      );
    }


    if (
      status === "Half Day"
    ) {

      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-[10px] font-semibold text-yellow-600">

          <Clock3
            size={13}
          />

          Half Day

        </span>
      );
    }


    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500">

        <Clock3
          size={13}
        />

        {status || "-"}

      </span>
    );
  };


  /* =========================================================
     LOADING
========================================================= */

  const isLoading =
    attendanceDashboardLoading ||
    attendanceRecordsLoading;


  /* =========================================================
     RENDER
========================================================= */

  return (

    <motion.div
      className="w-full min-w-0 space-y-4 overflow-hidden"

      variants={
        containerVariants
      }

      initial="hidden"

      animate="visible"
    >

      {/* =====================================================
          ERROR
      ===================================================== */}

      {(
        attendanceDashboardError ||
        attendanceRecordsError
      ) && (

        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[11px] text-red-600">

          {attendanceDashboardError ||
            attendanceRecordsError}

        </div>
      )}


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <motion.div
        variants={
          containerVariants
        }

        className="grid grid-cols-2 gap-1.5 xl:grid-cols-5"
      >

        {/* TOTAL EMPLOYEES */}

        <motion.div
          variants={cardVariants}

          whileHover={{
            y: -2,
            transition: {
              duration: 0.2,
            },
          }}

          className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[12px] font-medium text-gray-500">
                Total Employees
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">

                {attendanceDashboardLoading
                  ? "..."
                  : totalEmployees}

              </p>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Active employees
              </p>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">

              <Users
                size={18}
                className="text-violet-600"
              />

            </div>

          </div>

        </motion.div>


        {/* TODAY PRESENT */}

        <motion.div
          variants={cardVariants}

          whileHover={{
            y: -2,
            transition: {
              duration: 0.2,
            },
          }}

          className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[12px] font-medium text-gray-500">
                Today Present
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">

                {attendanceDashboardLoading
                  ? "..."
                  : todayPresent}

              </p>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Employees present today
              </p>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">

              <UserCheck
                size={18}
                className="text-green-600"
              />

            </div>

          </div>

        </motion.div>


        {/* TODAY ABSENT */}

        <motion.div
          variants={cardVariants}

          whileHover={{
            y: -2,
            transition: {
              duration: 0.2,
            },
          }}

          className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[12px] font-medium text-gray-500">
                Today Absent
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">

                {attendanceDashboardLoading
                  ? "..."
                  : todayAbsent}

              </p>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Employees absent today
              </p>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">

              <UserX
                size={18}
                className="text-red-500"
              />

            </div>

          </div>

        </motion.div>


        {/* THIS MONTH PRESENT */}

        <motion.div
          variants={cardVariants}

          whileHover={{
            y: -2,
            transition: {
              duration: 0.2,
            },
          }}

          className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[12px] font-medium text-gray-500">
                This Month Present
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">

                {attendanceDashboardLoading
                  ? "..."
                  : thisMonthPresent}

              </p>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Total present days
              </p>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">

              <CalendarCheck
                size={18}
                className="text-blue-600"
              />

            </div>

          </div>

        </motion.div>


        {/* THIS MONTH ABSENT */}

        <motion.div
          variants={cardVariants}

          whileHover={{
            y: -2,
            transition: {
              duration: 0.2,
            },
          }}

          className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[12px] font-medium text-gray-500">
                This Month Absent
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">

                {attendanceDashboardLoading
                  ? "..."
                  : thisMonthAbsent}

              </p>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Total absent days
              </p>

            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">

              <CalendarX
                size={18}
                className="text-orange-500"
              />

            </div>

          </div>

        </motion.div>

      </motion.div>


      {/* =====================================================
          MAIN TABLE CARD
      ===================================================== */}

      <motion.div
        variants={cardVariants}

        className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
      >

        {/* ===================================================
            TABLE HEADER
        =================================================== */}

        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-sm font-semibold text-gray-800">
              Employee Attendance
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-400">
              View and manage employee attendance records
            </p>

          </div>


          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"

                value={search}

                onChange={(event) =>
                  handleSearch(
                    event.target.value
                  )
                }

                placeholder="Search employee..."

                className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[11px] text-gray-700 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-50 sm:w-[190px]"
              />

            </div>


            {/* =================================================
                DATE PICKER

                DEFAULT = TODAY
            ================================================= */}

            <div className="relative">

              <CalendarDays
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"

                value={dateFilter}

                onChange={(event) =>
                  handleDate(
                    event.target.value
                  )
                }

                className="h-9 w-full cursor-pointer rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[11px] font-medium text-gray-600 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-50 sm:w-[190px]"
              />

            </div>


            {/* STATUS */}

            <select
              value={statusFilter}

              onChange={(event) =>
                handleStatus(
                  event.target.value
                )
              }

              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-50"
            >

              <option value="All">
                All Status
              </option>

              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Leave">
                Leave
              </option>

              <option value="Half Day">
                Half Day
              </option>

            </select>

          </div>

        </div>


        {/* ===================================================
            TABLE
            NO HORIZONTAL SCROLLBAR
        =================================================== */}

        <div className="w-full overflow-hidden">

          <table className="w-full table-fixed">

            <thead>

              <tr className="border-b border-gray-100 bg-gray-50/70">

                {/* EMPLOYEE */}

                <th className="w-[34%] px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-600">
                  Employee
                </th>


                {/* DEPARTMENT */}

                <th className="w-[18%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-600">
                  Department
                </th>


                {/* DATE */}

                <th className="w-[15%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-600">
                  Date
                </th>


                {/* CHECK IN */}

                <th className="w-[12%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-600">
                  Check In
                </th>


                {/* CHECK OUT */}

                <th className="w-[12%] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-600">
                  Check Out
                </th>


                {/* STATUS */}

                <th className="w-[9%] px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-600">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              <AnimatePresence mode="popLayout">

                {/* =================================================
                    LOADING
                ================================================= */}

                {isLoading ? (

                  <motion.tr
                    initial={{
                      opacity: 0,
                    }}

                    animate={{
                      opacity: 1,
                    }}
                  >

                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />

                        <p className="text-[13px] font-semibold text-gray-600">
                          Loading attendance...
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          Please wait while attendance records are loaded.
                        </p>

                      </div>

                    </td>

                  </motion.tr>

                ) : paginatedAttendance.length === 0 ? (

                  /* =================================================
                     EMPTY
                  ================================================= */

                  <motion.tr
                    initial={{
                      opacity: 0,
                    }}

                    animate={{
                      opacity: 1,
                    }}
                  >

                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <Users
                          size={32}
                          className="mb-3 text-violet-300"
                        />

                        <p className="text-[13px] font-semibold text-gray-600">
                          No attendance records found
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          Try changing your search or filters.
                        </p>

                      </div>

                    </td>

                  </motion.tr>

                ) : (

                  /* =================================================
                     DATA
                  ================================================= */

                  paginatedAttendance.map(
                    (employee) => (

                      <motion.tr
                        key={employee.id}

                        layout

                        variants={
                          rowVariants
                        }

                        initial="hidden"

                        animate="visible"

                        exit={{
                          opacity: 0,
                          x: -10,
                          transition: {
                            duration: 0.2,
                          },
                        }}

                        className="border-b border-gray-50 transition hover:bg-violet-50/30"
                      >

                        {/* =================================================
                            EMPLOYEE
                        ================================================= */}

                        <td className="px-5 py-3">

                          <div className="flex min-w-0 items-center gap-3">

                            {/* AVATAR */}

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-semibold text-violet-700">

                              {employee.name
                                ? employee.name
                                    .split(" ")
                                    .map(
                                      (word) =>
                                        word[0]
                                    )
                                    .join("")
                                    .slice(
                                      0,
                                      2
                                    )
                                    .toUpperCase()
                                : "NA"}

                            </div>


                            {/* NAME + EMAIL */}

                            <div className="min-w-0">

                              <p className="truncate text-[12px] font-medium text-gray-700">

                                {employee.name}

                              </p>

                              <p className="mt-0.5 truncate text-[9px] text-gray-400">

                                {employee.email}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* =================================================
                            DEPARTMENT
                        ================================================= */}

                        <td className="px-4 py-3">

                          {employee.department &&
                          employee.department !== "-" ? (

                            <span className="inline-flex max-w-full truncate rounded-md bg-violet-50 px-2 py-1 text-[9px] font-semibold text-violet-700">

                              {employee.department}

                            </span>

                          ) : (

                            <span className="text-[11px] text-gray-400">
                              -
                            </span>

                          )}

                        </td>


                        {/* =================================================
                            DATE
                        ================================================= */}

                        <td className="px-4 py-3">

                          <span className="whitespace-nowrap text-[11px] font-medium text-gray-600">

                            {employee.date}

                          </span>

                        </td>


                        {/* =================================================
                            CHECK IN
                        ================================================= */}

                        <td className="px-4 py-3">

                          <span
                            className={`whitespace-nowrap text-[11px] font-medium ${
                              employee.checkIn ===
                              "-"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >

                            {employee.checkIn}

                          </span>

                        </td>


                        {/* =================================================
                            CHECK OUT
                        ================================================= */}

                        <td className="px-4 py-3">

                          <span
                            className={`whitespace-nowrap text-[11px] font-medium ${
                              employee.checkOut ===
                              "-"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >

                            {employee.checkOut}

                          </span>

                        </td>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <td className="px-3 py-3 text-center">

                          {statusBadge(
                            employee.status
                          )}

                        </td>

                      </motion.tr>

                    )
                  )

                )}

              </AnimatePresence>

            </tbody>

          </table>

        </div>


        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">

          <p className="text-[10px] text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-700">

              {paginatedAttendance.length ===
              0
                ? 0
                : startIndex + 1}

            </span>

            {" "}to{" "}

            <span className="font-semibold text-gray-700">

              {Math.min(
                startIndex +
                  rowsPerPage,
                filteredAttendance.length
              )}

            </span>

            {" "}of{" "}

            <span className="font-semibold text-gray-700">

              {
                filteredAttendance.length
              }

            </span>

            {" "}records

          </p>


          <div className="flex items-center gap-1.5">

            {/* PREVIOUS */}

            <motion.button
              type="button"

              disabled={
                currentPage === 1
              }

              onClick={() => {

                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                );

              }}

              whileTap={{
                scale: 0.92,
              }}

              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronLeft
                size={16}
              />

            </motion.button>


            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            )

              .slice(
                Math.max(
                  0,
                  currentPage - 3
                ),

                Math.min(
                  totalPages,
                  currentPage + 2
                )
              )

              .map(
                (page) => (

                  <motion.button
                    key={page}
                    type="button"

                    onClick={() => {
                      setCurrentPage(
                        page
                      );
                    }}

                    whileTap={{
                      scale: 0.92,
                    }}

                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                      page ===
                      currentPage
                        ? "bg-violet-600 text-white"
                        : "border border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >

                    {page}

                  </motion.button>

                )
              )}


            {/* NEXT */}

            <motion.button
              type="button"

              disabled={
                currentPage ===
                totalPages
              }

              onClick={() => {

                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                );

              }}

              whileTap={{
                scale: 0.92,
              }}

              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronRight
                size={16}
              />

            </motion.button>

          </div>

        </div>

      </motion.div>

    </motion.div>
  );
};


export default EmployeeAttendance;