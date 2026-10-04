import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Users,
  CreditCard,
  Mic2,
  FileText,
  Search,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock3,
  XCircle,
  IndianRupee,
  Filter,
} from "lucide-react";

import axiosInstance from "../../redux/axiosInstance";

/* =========================================================
   COMPONENT
========================================================= */

const Reports = () => {
  const [activeReport, setActiveReport] = useState("conferences");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [conferenceData, setConferenceData] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const [speakersData, setSpeakersData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);

  const [loading, setLoading] = useState(false);

  const itemsPerPage = 6;

  /* =========================================================
     GET ARRAY FROM API RESPONSE
  ========================================================= */

  const getArrayFromResponse = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.items)) {
      return data.items;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    if (Array.isArray(data?.conferences)) {
      return data.conferences;
    }

    if (Array.isArray(data?.registrations)) {
      return data.registrations;
    }

    if (Array.isArray(data?.speakers)) {
      return data.speakers;
    }

    if (Array.isArray(data?.payments)) {
      return data.payments;
    }

    if (Array.isArray(response?.conferences)) {
      return response.conferences;
    }

    if (Array.isArray(response?.registrations)) {
      return response.registrations;
    }

    if (Array.isArray(response?.speakers)) {
      return response.speakers;
    }

    if (Array.isArray(response?.payments)) {
      return response.payments;
    }

    return [];
  };

  /* =========================================================
     DATE FORMATTER
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  /* =========================================================
     CONFERENCE DATE FORMATTER
  ========================================================= */

  const getConferenceDate = (item) => {
    const startDate =
      item?.conferenceDates?.startDate ||
      item?.conferenceDate?.startDate ||
      item?.startDate ||
      item?.date?.startDate;

    const endDate =
      item?.conferenceDates?.endDate ||
      item?.conferenceDate?.endDate ||
      item?.endDate ||
      item?.date?.endDate;

    if (startDate && endDate) {
      return `${formatDate(startDate)} – ${formatDate(endDate)}`;
    }

    if (startDate) {
      return formatDate(startDate);
    }

    if (item?.date) {
      if (typeof item.date === "string") {
        return item.date;
      }
    }

    return "-";
  };

  /* =========================================================
     CONFERENCE NAME
  ========================================================= */

  const getConferenceName = (item) => {
    return (
      item?.basicInformation?.conferenceTitle ||
      item?.basicInformation?.title ||
      item?.conferenceTitle ||
      item?.title ||
      item?.name ||
      item?.conference?.basicInformation?.conferenceTitle ||
      item?.conference?.basicInformation?.title ||
      item?.conference?.title ||
      item?.conference?.name ||
      item?.conference?.conferenceTitle ||
      item?.conference?.conferenceId?.basicInformation
        ?.conferenceTitle ||
      item?.conference?.conferenceId?.basicInformation?.title ||
      item?.conference?.conferenceId?.title ||
      item?.conference?.conferenceId?.name ||
      "-"
    );
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatus = (item) => {
    return (
      item?.status ||
      item?.registrationStatus ||
      item?.paymentStatus ||
      item?.speakerStatus ||
      "Pending"
    );
  };

  /* =========================================================
     LOAD CONFERENCES
  ========================================================= */

  const fetchConferences = async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/conferences"
      );

      console.log(
        "Reports conferences response:",
        response?.data
      );

      const data = getArrayFromResponse(response);

      const normalized = data.map((item, index) => {
        const registrations =
          Number(
            item?.registrationsCount ??
              item?.registrationCount ??
              item?.totalRegistrations ??
              item?.registrations ??
              item?.stats?.registrations ??
              0
          ) || 0;

        const speakers =
          Number(
            item?.speakersCount ??
              item?.speakerCount ??
              item?.totalSpeakers ??
              item?.speakers ??
              item?.stats?.speakers ??
              0
          ) || 0;

        const revenue =
          Number(
            item?.revenue ??
              item?.totalRevenue ??
              item?.stats?.revenue ??
              0
          ) || 0;

        return {
          id:
            item?._id ||
            item?.id ||
            index + 1,

          name: getConferenceName(item),

          shortName:
            item?.basicInformation?.shortName ||
            item?.shortName ||
            item?.code ||
            "-",

          date: getConferenceDate(item),

          registrations,

          speakers,

          revenue,

          status:
            item?.status ||
            "Upcoming",
        };
      });

      setConferenceData(normalized);
    } catch (error) {
      console.error(
        "Fetch conferences report error:",
        error?.response?.data || error
      );

      setConferenceData([]);
    }
  };

  /* =========================================================
     LOAD REGISTRATIONS
     
     IMPORTANT:
     Full Name = First Name + Last Name
     Conference column removed from data.
  ========================================================= */

  const fetchRegistrations = async () => {
    try {
      const response = await axiosInstance.get(
        "/user/registrations"
      );

      console.log(
        "Reports registrations response:",
        response?.data
      );

      const data = getArrayFromResponse(response);

      /*
        Each registration is displayed as one row.

        Example:
        firstName: "Gurumurthy"
        lastName: "Karri"

        Display:
        Gurumurthy Karri
      */

      const normalized = data.map((item, index) => {
        const firstName =
          item?.firstName ||
          item?.user?.firstName ||
          item?.registration?.firstName ||
          item?.attendee?.firstName ||
          "";

        const lastName =
          item?.lastName ||
          item?.user?.lastName ||
          item?.registration?.lastName ||
          item?.attendee?.lastName ||
          "";

        const fullName =
          `${firstName} ${lastName}`.trim() ||
          item?.fullName ||
          item?.user?.fullName ||
          item?.user?.name ||
          item?.registration?.fullName ||
          item?.attendee?.fullName ||
          item?.name ||
          "Unknown";

        const rawStatus = String(
          item?.status ||
            item?.registrationStatus ||
            item?.paymentStatus ||
            item?.payment?.status ||
            "Pending"
        ).toLowerCase();

        let confirmed = 0;
        let pending = 0;
        let cancelled = 0;
        let displayStatus = "Pending";

        if (
          rawStatus === "confirmed" ||
          rawStatus === "approved" ||
          rawStatus === "completed" ||
          rawStatus === "paid" ||
          rawStatus === "success" ||
          rawStatus === "successful"
        ) {
          confirmed = 1;
          displayStatus = "Confirmed";
        } else if (
          rawStatus === "cancelled" ||
          rawStatus === "canceled" ||
          rawStatus === "rejected"
        ) {
          cancelled = 1;
          displayStatus = "Cancelled";
        } else if (
          rawStatus === "failed"
        ) {
          cancelled = 1;
          displayStatus = "Failed";
        } else {
          pending = 1;
          displayStatus = "Pending";
        }

        return {
          id:
            item?._id ||
            item?.id ||
            index + 1,

          fullName,

          total: 1,

          confirmed,

          pending,

          cancelled,

          percentage:
            confirmed === 1
              ? 100
              : 0,

          status: displayStatus,
        };
      });

      setRegistrationData(normalized);
    } catch (error) {
      console.error(
        "Fetch registrations report error:",
        error?.response?.data || error
      );

      setRegistrationData([]);
    }
  };

  /* =========================================================
     LOAD SPEAKERS
  ========================================================= */

  const fetchSpeakers = async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/speakers"
      );

      console.log(
        "Reports speakers response:",
        response?.data
      );

      const data = getArrayFromResponse(response);

      const normalized = data.map(
        (item, index) => {
          const name =
            item?.fullName ||
            item?.name ||
            [
              item?.firstName,
              item?.lastName,
            ]
              .filter(Boolean)
              .join(" ") ||
            "Unknown Speaker";

          return {
            id:
              item?._id ||
              item?.id ||
              index + 1,

            name,

            designation:
              item?.designation ||
              item?.jobTitle ||
              item?.position ||
              item?.role ||
              "-",

            conference:
              item?.conference?.title ||
              item?.conference?.name ||
              item?.conference?.basicInformation
                ?.conferenceTitle ||
              item?.conferenceId?.title ||
              item?.conferenceId?.name ||
              item?.conferenceTitle ||
              "-",

            country:
              item?.country ||
              item?.location?.country ||
              "-",

            sessions:
              Number(
                item?.sessions ??
                  item?.sessionCount ??
                  0
              ) || 0,

            status:
              item?.status ||
              item?.speakerStatus ||
              "Pending",
          };
        }
      );

      setSpeakersData(normalized);
    } catch (error) {
      console.error(
        "Fetch speakers report error:",
        error?.response?.data || error
      );

      setSpeakersData([]);
    }
  };

  /* =========================================================
     LOAD PAYMENTS
  ========================================================= */

  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/payments"
      );

      console.log(
        "Reports payments response:",
        response?.data
      );

      const data = getArrayFromResponse(response);

      const normalized = data.map(
        (item, index) => ({
          id:
            item?.paymentId ||
            item?.transactionId ||
            item?.orderId ||
            item?._id ||
            item?.id ||
            `PAY-${index + 1}`,

          attendee:
            item?.attendee ||
            item?.user?.fullName ||
            item?.user?.name ||
            [
              item?.user?.firstName,
              item?.user?.lastName,
            ]
              .filter(Boolean)
              .join(" ") ||
            item?.fullName ||
            item?.firstName ||
            "Unknown",

          conference:
            getConferenceName(item) ||
            "-",

          amount:
            Number(
              item?.amount ??
                item?.totalAmount ??
                item?.paymentAmount ??
                item?.price ??
                0
            ) || 0,

          method:
            item?.method ||
            item?.paymentMethod ||
            item?.gateway ||
            "-",

          date: formatDate(
            item?.createdAt ||
              item?.paymentDate ||
              item?.date
          ),

          status:
            item?.status ||
            item?.paymentStatus ||
            "Pending",
        })
      );

      setPaymentsData(normalized);
    } catch (error) {
      console.error(
        "Fetch payments report error:",
        error?.response?.data || error
      );

      setPaymentsData([]);
    }
  };

  /* =========================================================
     LOAD REPORT DATA
  ========================================================= */

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchConferences(),
          fetchRegistrations(),
          fetchSpeakers(),
          fetchPayments(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalRegistrations =
    registrationData.reduce(
      (sum, item) =>
        sum + Number(item.total || 0),
      0
    );

  const totalSpeakers =
    speakersData.length;

  const totalRevenue =
    paymentsData.reduce(
      (sum, item) =>
        sum +
        (String(item.status).toLowerCase() ===
        "paid"
          ? Number(item.amount || 0)
          : 0),
      0
    );

  const upcomingConferences =
    conferenceData.filter(
      (item) =>
        String(item.status).toLowerCase() ===
        "upcoming"
    ).length;

  /* =========================================================
     FILTER DATA
  ========================================================= */

  const filteredData = useMemo(() => {
    let data = [];

    if (activeReport === "conferences") {
      data = conferenceData;
    }

    if (activeReport === "registrations") {
      data = registrationData;
    }

    if (activeReport === "speakers") {
      data = speakersData;
    }

    if (activeReport === "payments") {
      data = paymentsData;
    }

    const searchText =
      search.toLowerCase().trim();

    return data.filter((item) => {
      const searchableText =
        Object.values(item)
          .join(" ")
          .toLowerCase();

      const matchesSearch =
        searchableText.includes(
          searchText
        );

      let matchesStatus = true;

      if (statusFilter !== "All") {
        matchesStatus =
          String(
            item.status
          ).toLowerCase() ===
          statusFilter.toLowerCase();
      }

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    activeReport,
    search,
    statusFilter,
    conferenceData,
    registrationData,
    speakersData,
    paymentsData,
  ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length /
        itemsPerPage
    )
  );

  const paginatedData =
    filteredData.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage * itemsPerPage
    );

  /* =========================================================
     REPORT CHANGE
  ========================================================= */

  const handleReportChange = (
    report
  ) => {
    setActiveReport(report);
    setSearch("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (
    value
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* =========================================================
     EXPORT
  ========================================================= */

  const handleExport = () => {
    let headers = [];
    let rows = [];

    if (
      activeReport ===
      "conferences"
    ) {
      headers = [
        "Conference",
        "Date",
        "Registrations",
        "Speakers",
        "Revenue",
        "Status",
      ];

      rows = filteredData.map(
        (item) => [
          item.name,
          item.date,
          item.registrations,
          item.speakers,
          item.revenue,
          item.status,
        ]
      );
    }

    if (
      activeReport ===
      "registrations"
    ) {
      headers = [
        "Full Name",
        "Total",
        "Confirmed",
        "Pending",
        "Cancelled",
        "Confirmation %",
      ];

      rows = filteredData.map(
        (item) => [
          item.fullName,
          item.total,
          item.confirmed,
          item.pending,
          item.cancelled,
          `${item.percentage}%`,
        ]
      );
    }

    if (
      activeReport ===
      "speakers"
    ) {
      headers = [
        "Speaker",
        "Designation",
        "Conference",
        "Country",
        "Sessions",
        "Status",
      ];

      rows = filteredData.map(
        (item) => [
          item.name,
          item.designation,
          item.conference,
          item.country,
          item.sessions,
          item.status,
        ]
      );
    }

    if (
      activeReport ===
      "payments"
    ) {
      headers = [
        "Payment ID",
        "Attendee",
        "Conference",
        "Amount",
        "Method",
        "Date",
        "Status",
      ];

      rows = filteredData.map(
        (item) => [
          item.id,
          item.attendee,
          item.conference,
          item.amount,
          item.method,
          item.date,
          item.status,
        ]
      );
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download = `${activeReport}-report.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-w-0 space-y-3">
      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {/* Conferences */}
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Conferences
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">
                {conferenceData.length}
              </p>

              <p className="mt-1 text-[10px] font-medium text-violet-600">
                {upcomingConferences} upcoming
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CalendarDays
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* Registrations */}
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Registrations
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">
                {totalRegistrations.toLocaleString()}
              </p>

              <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                <TrendingUp size={11} />
                +12% this month
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Users
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* Speakers */}
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Speakers
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">
                {totalSpeakers}
              </p>

              <p className="mt-1 text-[10px] font-medium text-violet-600">
                Across all conferences
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Mic2
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Revenue
              </p>

              <p className="mt-1 text-[21px] font-bold text-gray-900">
                ₹
                {(
                  totalRevenue /
                  100000
                ).toFixed(2)}
                L
              </p>

              <p className="mt-1 text-[10px] font-medium text-emerald-600">
                +15% this month
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <IndianRupee
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          REPORT CONTAINER
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* ===================================================
            REPORT HEADER
        =================================================== */}

        <div className="border-b border-gray-100 px-4 py-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">
                Reports & Analytics
              </h2>

              <p className="mt-0.5 text-[11px] text-gray-400">
                Generate and review conference management reports.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-[10px] font-semibold text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
              >
                <Printer size={13} />
                Print
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[10px] font-semibold text-white transition hover:bg-violet-700"
              >
                <Download size={13} />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================
            REPORT TABS
        =================================================== */}

        <div className="flex flex-wrap gap-2 border-b border-gray-100 px-4 py-2.5">
          {[
            {
              id: "conferences",
              label: "All Conferences",
              icon: CalendarDays,
            },
            {
              id: "registrations",
              label: "Registrations",
              icon: Users,
            },
            {
              id: "speakers",
              label: "Speakers",
              icon: Mic2,
            },
            {
              id: "payments",
              label: "Payments",
              icon: CreditCard,
            },
          ].map((tab) => {
            const Icon = tab.icon;

            const active =
              activeReport ===
              tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  handleReportChange(
                    tab.id
                  )
                }
                className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-[10px] font-semibold transition ${
                  active
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ===================================================
            FILTER TOOLBAR
        =================================================== */}

        <div className="flex flex-col gap-2 border-b border-gray-100 p-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                handleSearch(
                  e.target.value
                )
              }
              placeholder={
                activeReport ===
                "speakers"
                  ? "Search speaker or conference..."
                  : activeReport ===
                    "payments"
                  ? "Search payment or attendee..."
                  : "Search conference..."
              }
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-[11px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <Filter
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-violet-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-7 text-[10px] font-medium text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
            >
              <option value="All">
                All Status
              </option>

              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Failed">
                Failed
              </option>
            </select>
          </div>

          {/* Date */}
          <select
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[10px] font-medium text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
          >
            <option>
              All Time
            </option>

            <option>
              This Month
            </option>

            <option>
              Last 3 Months
            </option>

            <option>
              Last 6 Months
            </option>

            <option>
              This Year
            </option>
          </select>
        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="w-full overflow-x-auto">
          {loading ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />

              <p className="mt-3 text-[11px] text-gray-400">
                Loading reports...
              </p>
            </div>
          ) : (
            <>
              {/* ================= ALL CONFERENCES ================= */}

              {activeReport ===
                "conferences" && (
                <table className="w-full min-w-[850px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Conference
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Registrations
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Speakers
                      </th>

                      <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Revenue
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.map(
                      (conference) => (
                        <tr
                          key={
                            conference.id
                          }
                          className="border-b border-gray-50 transition hover:bg-violet-50/20"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                                <CalendarDays
                                  size={14}
                                  className="text-violet-600"
                                />
                              </div>

                              <div>
                                <p className="text-[11px] font-semibold text-gray-800">
                                  {
                                    conference.name
                                  }
                                </p>

                                <p className="mt-0.5 text-[9px] text-gray-400">
                                  {
                                    conference.shortName
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-[10px] text-gray-500">
                            {
                              conference.date
                            }
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span className="text-[11px] font-semibold text-gray-800">
                              {
                                conference.registrations
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span className="text-[11px] font-semibold text-gray-800">
                              {
                                conference.speakers
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <span className="text-[11px] font-semibold text-gray-800">
                              ₹
                              {Number(
                                conference.revenue ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <StatusBadge
                              status={
                                conference.status
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}

              {/* ================= REGISTRATIONS ================= */}

              {activeReport ===
                "registrations" && (
                <table className="w-full min-w-[850px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Full Name
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Total
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Confirmed
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Pending
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Cancelled
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Confirmation
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.map(
                      (item) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-50 transition hover:bg-violet-50/20"
                        >
                          <td className="px-4 py-3">
                            <p className="text-[11px] font-semibold text-gray-800">
                              {
                                item.fullName
                              }
                            </p>
                          </td>

                          <td className="px-4 py-3 text-center text-[11px] font-semibold text-gray-800">
                            {item.total}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                              <CheckCircle2
                                size={12}
                              />
                              {
                                item.confirmed
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                              <Clock3
                                size={12}
                              />
                              {
                                item.pending
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500">
                              <XCircle
                                size={12}
                              />
                              {
                                item.cancelled
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full bg-violet-600"
                                  style={{
                                    width: `${item.percentage}%`,
                                  }}
                                />
                              </div>

                              <span className="text-[10px] font-semibold text-violet-600">
                                {
                                  item.percentage
                                }
                                %
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}

              {/* ================= SPEAKERS ================= */}

              {activeReport ===
                "speakers" && (
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Speaker
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Conference
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Country
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Sessions
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.map(
                      (speaker) => (
                        <tr
                          key={speaker.id}
                          className="border-b border-gray-50 transition hover:bg-violet-50/20"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                                {speaker.name
                                  .split(
                                    " "
                                  )
                                  .slice(
                                    1
                                  )
                                  .map(
                                    (
                                      word
                                    ) =>
                                      word.charAt(
                                        0
                                      )
                                  )
                                  .join(
                                    ""
                                  )
                                  .slice(
                                    0,
                                    2
                                  )}
                              </div>

                              <div>
                                <p className="text-[11px] font-semibold text-gray-800">
                                  {
                                    speaker.name
                                  }
                                </p>

                                <p className="mt-0.5 text-[9px] text-gray-400">
                                  {
                                    speaker.designation
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-[10px] text-gray-600">
                            {
                              speaker.conference
                            }
                          </td>

                          <td className="px-4 py-3 text-[10px] text-gray-600">
                            {
                              speaker.country
                            }
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span className="text-[11px] font-semibold text-gray-800">
                              {
                                speaker.sessions
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <StatusBadge
                              status={
                                speaker.status
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}

              {/* ================= PAYMENTS ================= */}

              {activeReport ===
                "payments" && (
                <table className="w-full min-w-[950px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Payment ID
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Attendee
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Conference
                      </th>

                      <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Method
                      </th>

                      <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                      <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.map(
                      (payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-gray-50 transition hover:bg-violet-50/20"
                        >
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-semibold text-violet-600">
                              {
                                payment.id
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span className="text-[11px] font-medium text-gray-800">
                              {
                                payment.attendee
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3 text-[10px] text-gray-600">
                            {
                              payment.conference
                            }
                          </td>

                          <td className="px-4 py-3 text-right">
                            <span className="text-[11px] font-semibold text-gray-800">
                              $
                              {
                                payment.amount
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span className="text-[10px] text-gray-600">
                              {
                                payment.method
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3 text-[10px] text-gray-500">
                            {
                              payment.date
                            }
                          </td>

                          <td className="px-4 py-3 text-center">
                            <StatusBadge
                              status={
                                payment.status
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}

              {/* =================================================
                  EMPTY STATE
              ================================================= */}

              {paginatedData.length ===
                0 && (
                <div className="flex min-h-[260px] flex-col items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                    <FileText
                      size={21}
                      className="text-violet-500"
                    />
                  </div>

                  <p className="mt-3 text-[12px] font-semibold text-gray-700">
                    No report data found
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Try changing your search or filters.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredData.length ===
              0
                ? 0
                : (currentPage - 1) *
                    itemsPerPage +
                  1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                currentPage *
                  itemsPerPage,
                filteredData.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {
                filteredData.length
              }
            </span>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft
                size={13}
              />
            </button>

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
                onClick={() =>
                  setCurrentPage(
                    page
                  )
                }
                className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[9px] font-semibold transition ${
                  currentPage ===
                  page
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 text-gray-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={
                currentPage ===
                  totalPages ||
                filteredData.length ===
                  0
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight
                size={13}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({
  status,
}) => {
  const styles = {
    Upcoming:
      "bg-violet-50 text-violet-700",

    Completed:
      "bg-gray-100 text-gray-600",

    Confirmed:
      "bg-emerald-50 text-emerald-700",

    Pending:
      "bg-amber-50 text-amber-700",

    Paid:
      "bg-emerald-50 text-emerald-700",

    Failed:
      "bg-red-50 text-red-600",

    Cancelled:
      "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-[9px] font-semibold ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default Reports;