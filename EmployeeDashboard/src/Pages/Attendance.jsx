import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CalendarDays,
  ChevronDown,
  Clock3,
  DoorOpen,
  Fingerprint,
  User,
  Users,
  CheckCircle2,
  ArrowRight,
  Building2,
  LogOut,
} from "lucide-react";

import {
  selectEmployee,
  employeeClockIn,
  employeeClockOut,
  getTodayAttendance,
  getMonthlyAttendance,
  selectTodayAttendance,
  selectTodayAttendanceLoading,
  selectMonthlyAttendance,
  selectMonthlyAttendanceLoading,
  selectClockInLoading,
  selectClockOutLoading,
  selectClockInError,
  selectClockOutError,
  selectTodayAttendanceError,
  selectMonthlyAttendanceError,
} from "../redux/employeeSlice";

function EmployeeAttendance() {
  const dispatch = useDispatch();

  const employee = useSelector(selectEmployee);

  /* -------------------------------------------------------------------------- */
  /* Attendance Redux Data                                                      */
  /* -------------------------------------------------------------------------- */

  const todayAttendance = useSelector(selectTodayAttendance);

  const todayAttendanceLoading = useSelector(
    selectTodayAttendanceLoading
  );

  const monthlyAttendance = useSelector(
    selectMonthlyAttendance
  );

  const monthlyAttendanceLoading = useSelector(
    selectMonthlyAttendanceLoading
  );

  const clockInLoading = useSelector(
    selectClockInLoading
  );

  const clockOutLoading = useSelector(
    selectClockOutLoading
  );

  const clockInError = useSelector(
    selectClockInError
  );

  const clockOutError = useSelector(
    selectClockOutError
  );

  const todayAttendanceError = useSelector(
    selectTodayAttendanceError
  );

  const monthlyAttendanceError = useSelector(
    selectMonthlyAttendanceError
  );

  /* -------------------------------------------------------------------------- */
  /* Employee Data                                                              */
  /* -------------------------------------------------------------------------- */

  const fullName = employee?.fullName || "Employee";
  const email = employee?.email || "-";
  const employeeType = employee?.employeeType || "Employee";

  const assignedConference =
    employee?.assignedConferences?.[0];

  const conferenceTitle =
    typeof assignedConference === "string"
      ? assignedConference
      : assignedConference?.title ||
        assignedConference?.name ||
        "No conference assigned";

  /* -------------------------------------------------------------------------- */
  /* Date                                                                       */
  /* -------------------------------------------------------------------------- */

  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  /* -------------------------------------------------------------------------- */
  /* Month / Year Filter                                                        */
  /* -------------------------------------------------------------------------- */

  const [selectedMonth, setSelectedMonth] = useState(
    today.getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    today.getFullYear()
  );

  /* -------------------------------------------------------------------------- */
  /* Fetch Today's Attendance                                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    dispatch(getTodayAttendance());
  }, [dispatch]);

  /* -------------------------------------------------------------------------- */
  /* Fetch Monthly Attendance                                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    dispatch(
      getMonthlyAttendance({
        month: selectedMonth + 1,
        year: selectedYear,
      })
    );
  }, [
    dispatch,
    selectedMonth,
    selectedYear,
  ]);

  /* -------------------------------------------------------------------------- */
  /* Attendance Status                                                          */
  /* -------------------------------------------------------------------------- */

  const attendanceStatus = useMemo(() => {
    if (!todayAttendance) {
      return "not-marked";
    }

    if (
      todayAttendance.checkIn &&
      !todayAttendance.checkOut
    ) {
      return "checked-in";
    }

    if (
      todayAttendance.checkIn &&
      todayAttendance.checkOut
    ) {
      return "completed";
    }

    return "not-marked";
  }, [todayAttendance]);

  const isCheckedIn =
    attendanceStatus === "checked-in";

  const isCompleted =
    attendanceStatus === "completed";

  /* -------------------------------------------------------------------------- */
  /* Check-in / Check-out Times                                                 */
  /* -------------------------------------------------------------------------- */

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const checkInTime = formatTime(
    todayAttendance?.checkIn
  );

  const checkOutTime = formatTime(
    todayAttendance?.checkOut
  );

  /* -------------------------------------------------------------------------- */
  /* Check In                                                                   */
  /* -------------------------------------------------------------------------- */

  const handleCheckIn = async () => {
    if (isCheckedIn || isCompleted || clockInLoading) {
      return;
    }

    try {
      await dispatch(
        employeeClockIn()
      ).unwrap();

      /*
       * Refresh today's attendance after successful
       * clock-in.
       */
      dispatch(getTodayAttendance());

      /*
       * If selected month is current month,
       * refresh monthly history also.
       */
      if (
        selectedMonth === today.getMonth() &&
        selectedYear === today.getFullYear()
      ) {
        dispatch(
          getMonthlyAttendance({
            month: selectedMonth + 1,
            year: selectedYear,
          })
        );
      }
    } catch (error) {
      console.error(
        "Clock-in failed:",
        error
      );
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Check Out                                                                  */
  /* -------------------------------------------------------------------------- */

  const handleCheckOut = async () => {
    if (!isCheckedIn || clockOutLoading) {
      return;
    }

    try {
      await dispatch(
        employeeClockOut()
      ).unwrap();

      /*
       * Refresh today's attendance after
       * successful clock-out.
       */
      dispatch(getTodayAttendance());

      /*
       * Refresh current month's attendance.
       */
      if (
        selectedMonth === today.getMonth() &&
        selectedYear === today.getFullYear()
      ) {
        dispatch(
          getMonthlyAttendance({
            month: selectedMonth + 1,
            year: selectedYear,
          })
        );
      }
    } catch (error) {
      console.error(
        "Clock-out failed:",
        error
      );
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Attendance History                                                         */
  /* -------------------------------------------------------------------------- */

  const attendanceHistory = useMemo(() => {
    const days =
      monthlyAttendance?.days || [];

    return days.map((day, index) => {
      const date = new Date(day.date);

      return {
        id:
          `${day.date || "attendance"}-${index}`,

        date: date.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),

        month: date.getMonth(),

        year: date.getFullYear(),

        conference:
          monthlyAttendance?.conference?.title ||
          monthlyAttendance?.conference?.name ||
          conferenceTitle,

        checkIn: formatTime(
          day.checkIn
        ),

        checkOut: formatTime(
          day.checkOut
        ),

        status:
          day.checkOut
            ? "Present"
            : day.checkIn
            ? "Checked In"
            : day.status || "Absent",

        workingHours:
          day.workingHours || 0,
      };
    });
  }, [
    monthlyAttendance,
    conferenceTitle,
  ]);

  /* -------------------------------------------------------------------------- */
  /* Filtered Attendance                                                        */
  /* -------------------------------------------------------------------------- */

  const filteredAttendance =
    useMemo(
      () =>
        attendanceHistory.filter(
          (item) =>
            item.month ===
              selectedMonth &&
            item.year === selectedYear
        ),
      [
        attendanceHistory,
        selectedMonth,
        selectedYear,
      ]
    );

  const attendanceCount =
    filteredAttendance.length;

  /* -------------------------------------------------------------------------- */
  /* Month / Year Names                                                         */
  /* -------------------------------------------------------------------------- */

  const selectedMonthName =
    new Date(
      selectedYear,
      selectedMonth,
      1
    ).toLocaleDateString(
      "en-US",
      {
        month: "long",
      }
    );

  const availableYears = [
    2026,
    2027,
    2028,
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  /* -------------------------------------------------------------------------- */
  /* Avatar Initials                                                            */
  /* -------------------------------------------------------------------------- */

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) =>
      name.charAt(0).toUpperCase()
    )
    .join("");

  /* -------------------------------------------------------------------------- */
  /* Status UI                                                                  */
  /* -------------------------------------------------------------------------- */

  const getStatusStyles = () => {
    if (isCompleted) {
      return {
        container:
          "bg-green-50 border-green-200 text-green-700",
        dot: "bg-green-500",
        text: "Attendance Completed",
      };
    }

    if (isCheckedIn) {
      return {
        container:
          "bg-blue-50 border-blue-200 text-blue-700",
        dot: "bg-blue-500",
        text: "Checked In",
      };
    }

    return {
      container:
        "bg-gray-50 border-gray-200 text-gray-600",
      dot: "bg-gray-400",
      text: "Not Marked",
    };
  };

  const statusStyles =
    getStatusStyles();

  /* -------------------------------------------------------------------------- */
  /* Error Message                                                              */
  /* -------------------------------------------------------------------------- */

  const attendanceError =
    clockInError ||
    clockOutError ||
    todayAttendanceError ||
    monthlyAttendanceError;

  /* -------------------------------------------------------------------------- */
  /* JSX                                                                        */
  /* -------------------------------------------------------------------------- */

  return (
    <section
      className="
        min-h-screen
        bg-[#fbfaff]
        px-4
        py-5
        sm:px-6
        lg:px-8
      "
    >
      {/* Decorative Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-100/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-100/30 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative mx-auto max-w-6xl">

        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8138A2] text-white shadow-sm">
              <CalendarDays size={21} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Attendance
              </h1>

              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                Manage your daily attendance and working hours
              </p>
            </div>
          </div>

          {/* Current Date */}
          <div className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm">
            <CalendarDays
              size={15}
              className="text-[#8138A2]"
            />

            <span>
              {formattedDate}
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Error Message                                                      */}
        {/* ------------------------------------------------------------------ */}

        {attendanceError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {attendanceError}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Main Attendance Card                                               */}
        {/* ------------------------------------------------------------------ */}

        <div className="mb-5 rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Employee Header */}
          <div className="border-b border-gray-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8138A2] text-sm font-bold text-white">
                  {initials || (
                    <User size={20} />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                    {fullName}
                  </h2>

                  <p className="truncate text-xs text-gray-500 sm:text-sm">
                    {email}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div
                className={`
                  flex w-fit items-center gap-2
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  ${statusStyles.container}
                `}
              >
                <span
                  className={`h-2 w-2 rounded-full ${statusStyles.dot}`}
                />

                {statusStyles.text}
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            {/* Today */}
            <div className="p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                <CalendarDays
                  size={15}
                  className="text-[#8138A2]"
                />

                Today
              </div>

              <p className="text-sm font-semibold text-gray-900">
                {formattedDate}
              </p>
            </div>

            {/* Conference */}
            <div className="p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                <Building2
                  size={15}
                  className="text-[#8138A2]"
                />

                Conference
              </div>

              <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                {conferenceTitle}
              </p>
            </div>

            {/* Employee Type */}
            <div className="p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                <Users
                  size={15}
                  className="text-[#8138A2]"
                />

                Employee Type
              </div>

              <p className="text-sm font-semibold text-gray-900">
                {employeeType}
              </p>
            </div>
          </div>

          {/* Check In / Out Area */}
          <div className="border-t border-gray-100 p-5 sm:p-7">

            <div className="flex flex-col items-center justify-center">

              {/* Fingerprint */}
              <div
                className={`
                  mb-4
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border-8
                  ${
                    isCompleted
                      ? "border-green-50 bg-green-100 text-green-600"
                      : isCheckedIn
                      ? "border-blue-50 bg-blue-100 text-blue-600"
                      : "border-purple-50 bg-purple-100 text-[#8138A2]"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 size={34} />
                ) : (
                  <Fingerprint size={34} />
                )}
              </div>

              {/* Heading */}
              <h3 className="text-base font-semibold text-gray-900">
                {isCompleted
                  ? "Attendance Completed"
                  : isCheckedIn
                  ? "You are Checked In"
                  : "Mark Your Attendance"}
              </h3>

              <p className="mt-1 max-w-md text-center text-xs text-gray-500 sm:text-sm">
                {isCompleted
                  ? "Your attendance for today has been completed successfully."
                  : isCheckedIn
                  ? "You have successfully checked in. Don't forget to check out."
                  : "Click the button below to record your attendance for today."}
              </p>

              {/* Action Button */}
              <div className="mt-5">

                {/* Check In */}
                {!isCheckedIn &&
                  !isCompleted && (
                    <button
                      type="button"
                      onClick={handleCheckIn}
                      disabled={
                        clockInLoading ||
                        todayAttendanceLoading
                      }
                      className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-[#8138A2]
                        px-6
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-[#702f8d]
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {clockInLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                          Checking In...
                        </>
                      ) : (
                        <>
                          <DoorOpen size={18} />

                          Check In

                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  )}

                {/* Check Out */}
                {isCheckedIn && (
                  <button
                    type="button"
                    onClick={handleCheckOut}
                    disabled={
                      clockOutLoading
                    }
                    className="
                      inline-flex
                      h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-[#8138A2]
                      px-6
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-[#702f8d]
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {clockOutLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                        Checking Out...
                      </>
                    ) : (
                      <>
                        <LogOut size={18} />

                        Check Out
                      </>
                    )}
                  </button>
                )}

                {/* Completed */}
                {isCompleted && (
                  <div
                    className="
                      inline-flex
                      h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-green-50
                      px-6
                      text-sm
                      font-semibold
                      text-green-700
                    "
                  >
                    <CheckCircle2 size={18} />

                    Completed
                  </div>
                )}
              </div>
            </div>

            {/* Today's Timing */}
            <div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Check In Time */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Clock3
                    size={15}
                    className="text-[#8138A2]"
                  />

                  Check-in Time
                </div>

                <p className="text-lg font-bold text-gray-900">
                  {checkInTime}
                </p>
              </div>

              {/* Check Out Time */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Clock3
                    size={15}
                    className="text-[#8138A2]"
                  />

                  Check-out Time
                </div>

                <p className="text-lg font-bold text-gray-900">
                  {checkOutTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Recent Attendance                                                  */}
        {/* ------------------------------------------------------------------ */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Card Header */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Recent Attendance
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your attendance records for the selected month
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">

              {/* Month */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) =>
                    setSelectedMonth(
                      Number(e.target.value)
                    )
                  }
                  className="
                    h-9
                    appearance-none
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    py-0
                    pl-3
                    pr-8
                    text-xs
                    font-medium
                    text-gray-700
                    outline-none
                    transition
                    focus:border-[#8138A2]
                    focus:ring-2
                    focus:ring-purple-100
                  "
                >
                  {months.map(
                    (month, index) => (
                      <option
                        key={month}
                        value={index}
                      >
                        {month}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Year */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(
                      Number(e.target.value)
                    )
                  }
                  className="
                    h-9
                    appearance-none
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    py-0
                    pl-3
                    pr-8
                    text-xs
                    font-medium
                    text-gray-700
                    outline-none
                    transition
                    focus:border-[#8138A2]
                    focus:ring-2
                    focus:ring-purple-100
                  "
                >
                  {availableYears.map(
                    (year) => (
                      <option
                        key={year}
                        value={year}
                      >
                        {year}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Count */}
              <div className="flex h-9 items-center rounded-lg bg-purple-50 px-3 text-xs font-semibold text-[#8138A2]">
                {attendanceCount} Attendance
              </div>
            </div>
          </div>

          {/* Loading */}
          {monthlyAttendanceLoading ? (
            <div className="flex items-center justify-center px-5 py-12">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#8138A2] border-t-transparent" />

                Loading attendance...
              </div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Conference
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Check-in Time
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Check-out Time
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAttendance.length >
                    0 ? (
                      filteredAttendance.map(
                        (item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50"
                          >
                            {/* Date */}
                            <td className="whitespace-nowrap px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-[#8138A2]">
                                  <CalendarDays
                                    size={15}
                                  />
                                </div>

                                <span className="text-xs font-medium text-gray-800">
                                  {item.date}
                                </span>
                              </div>
                            </td>

                            {/* Conference */}
                            <td className="max-w-[240px] px-5 py-4">
                              <p className="truncate text-xs font-medium text-gray-800">
                                {item.conference}
                              </p>
                            </td>

                            {/* Check In */}
                            <td className="whitespace-nowrap px-5 py-4">
                              <div className="flex items-center gap-2 text-xs text-gray-700">
                                <Clock3
                                  size={14}
                                  className="text-gray-400"
                                />

                                {item.checkIn}
                              </div>
                            </td>

                            {/* Check Out */}
                            <td className="whitespace-nowrap px-5 py-4">
                              <div className="flex items-center gap-2 text-xs text-gray-700">
                                <Clock3
                                  size={14}
                                  className="text-gray-400"
                                />

                                {item.checkOut}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[11px]
                                  font-semibold
                                  ${
                                    item.status ===
                                    "Present"
                                      ? "bg-green-50 text-green-700"
                                      : item.status ===
                                        "Checked In"
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-gray-50 text-gray-600"
                                  }
                                `}
                              >
                                <span
                                  className={`
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    ${
                                      item.status ===
                                      "Present"
                                        ? "bg-green-500"
                                        : item.status ===
                                          "Checked In"
                                        ? "bg-blue-500"
                                        : "bg-gray-400"
                                    }
                                  `}
                                />

                                {item.status}
                              </span>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-5 py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                              <CalendarDays
                                size={21}
                              />
                            </div>

                            <p className="text-sm font-semibold text-gray-700">
                              No attendance records
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              No attendance found for{" "}
                              {selectedMonthName}{" "}
                              {selectedYear}.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Footer */}
              <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Showing{" "}
                  {attendanceCount} record
                  {attendanceCount !== 1
                    ? "s"
                    : ""}
                </p>

                <button
                  type="button"
                  className="
                    inline-flex
                    w-fit
                    items-center
                    gap-1.5
                    text-xs
                    font-semibold
                    text-[#8138A2]
                    transition
                    hover:text-[#702f8d]
                  "
                >
                  View History

                  <ArrowRight
                    size={14}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default EmployeeAttendance;