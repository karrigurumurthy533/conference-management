import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  Globe2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getMyBrochuresApi } from "../api/employeeApis";

function Brochures() {
  const [brochures, setBrochures] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // PAGINATION
  // ======================================================

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ======================================================
  // FETCH BROCHURE DOWNLOAD REQUESTS
  // ======================================================

  const fetchBrochures = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getMyBrochuresApi();

      console.log("Employee Brochures API Response:", response);

      if (response?.success) {
        const data = Array.isArray(response.data)
          ? response.data
          : [];

        setBrochures(data);
      } else {
        setBrochures([]);

        setError(
          response?.message ||
            "Failed to fetch brochure requests"
        );
      }
    } catch (err) {
      console.error(
        "Fetch brochure requests error:",
        err
      );

      setBrochures([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch brochure requests"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ======================================================
  // INITIAL FETCH
  // ======================================================

  useEffect(() => {
    fetchBrochures();
  }, []);

  // ======================================================
  // NORMALIZE DATA
  // ======================================================

  const normalizedData = useMemo(() => {
    return brochures.map((item, index) => {
      return {
        id:
          item?._id ||
          item?.id ||
          index,

        conferenceId:
          item?.conferenceId || "",

        fullName:
          item?.fullName ||
          "—",

        email:
          item?.email ||
          "—",

        phone:
          item?.phone ||
          "—",

        country:
          item?.country ||
          "—",

        createdAt:
          item?.createdAt ||
          item?.updatedAt ||
          null,
      };
    });
  }, [brochures]);

  // ======================================================
  // TOTAL DOWNLOAD REQUESTS
  // ======================================================

  const totalDownloads = normalizedData.length;

  // ======================================================
  // THIS MONTH
  // ======================================================

  const monthlyDownloads = useMemo(() => {
    const now = new Date();

    return normalizedData.filter((item) => {
      if (!item.createdAt) {
        return false;
      }

      const date = new Date(item.createdAt);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [normalizedData]);

  // ======================================================
  // UNIQUE COUNTRIES
  // ======================================================

  const uniqueCountries = useMemo(() => {
    return new Set(
      normalizedData
        .map((item) => item.country)
        .filter(
          (country) =>
            country && country !== "—"
        )
    ).size;
  }, [normalizedData]);

  // ======================================================
  // FILTER + SORT
  // ======================================================

  const filteredData = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    const data = normalizedData.filter(
      (item) => {
        return (
          item.fullName
            .toLowerCase()
            .includes(searchValue) ||
          item.email
            .toLowerCase()
            .includes(searchValue) ||
          item.phone
            .toLowerCase()
            .includes(searchValue) ||
          item.country
            .toLowerCase()
            .includes(searchValue)
        );
      }
    );

    if (sortBy === "recent") {
      data.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sortBy === "oldest") {
      data.sort(
        (a, b) =>
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
      );
    }

    if (sortBy === "name") {
      data.sort((a, b) =>
        a.fullName.localeCompare(
          b.fullName
        )
      );
    }

    if (sortBy === "country") {
      data.sort((a, b) =>
        a.country.localeCompare(
          b.country
        )
      );
    }

    return data;
  }, [
    normalizedData,
    search,
    sortBy,
  ]);

  // ======================================================
  // RESET PAGE WHEN SEARCH / SORT CHANGES
  // ======================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    return filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [
    filteredData,
    currentPage,
  ]);

  const startItem =
    filteredData.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    filteredData.length
  );

  // ======================================================
  // PAGINATION PAGE NUMBERS
  // ======================================================

  const pageNumbers = useMemo(() => {
    const pages = [];

    if (totalPages <= 5) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (
        currentPage >=
        totalPages - 2
      ) {
        pages.push(
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2
        );
      }
    }

    return pages;
  }, [totalPages, currentPage]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] px-5 py-5 lg:px-7">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2
              size={30}
              className="animate-spin text-[#7C3AED]"
            />

            <p className="mt-3 text-[13px] text-gray-500">
              Loading brochure requests...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafa] px-5 py-5 lg:px-7">
        <div className="rounded-lg border border-red-100 bg-white px-5 py-10 text-center">
          <Download
            size={32}
            className="mx-auto mb-3 text-red-300"
          />

          <p className="text-[13px] font-medium text-gray-700">
            Failed to load brochure requests
          </p>

          <p className="mt-1 text-[11px] text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchBrochures()}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-[#7C3AED] px-4 text-[12px] font-medium text-white transition hover:bg-[#6D28D9]"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-[#fafafa] px-5 py-5 lg:px-7">

      {/* ==================================================
          STATS
      ================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total Downloads */}
        <div className="rounded-lg border border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-50">
              <Download
                size={18}
                className="text-[#7C3AED]"
              />
            </div>

            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600">
              All Time
            </span>

          </div>

          <div className="mt-3">
            <p className="text-[12px] font-medium text-gray-500">
              Total Downloads
            </p>

            <h2 className="mt-1 text-[23px] font-semibold leading-tight text-gray-900">
              {totalDownloads.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Monthly */}
        <div className="rounded-lg border border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-50">
              <Download
                size={18}
                className="text-[#7C3AED]"
              />
            </div>

            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-medium text-[#7C3AED]">
              This Month
            </span>

          </div>

          <div className="mt-3">
            <p className="text-[12px] font-medium text-gray-500">
              Monthly Downloads
            </p>

            <h2 className="mt-1 text-[23px] font-semibold leading-tight text-gray-900">
              {monthlyDownloads.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Countries */}
        <div className="rounded-lg border border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-50">
              <Globe2
                size={18}
                className="text-[#7C3AED]"
              />
            </div>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-600">
              Countries
            </span>

          </div>

          <div className="mt-3">
            <p className="text-[12px] font-medium text-gray-500">
              Countries
            </p>

            <h2 className="mt-1 text-[23px] font-semibold leading-tight text-gray-900">
              {uniqueCountries}
            </h2>
          </div>
        </div>

      </div>

      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">

        {/* Header */}
        <div className="border-b border-gray-100 px-5 py-4">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">
                Brochure Download Requests
              </h2>

              <p className="mt-1 text-[11px] text-gray-500">
                View users who requested conference brochures.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto">

              {/* Search */}
              <div className="relative w-full sm:w-[260px]">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="
                    h-9
                    w-full
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    pl-9
                    pr-3
                    text-[12px]
                    text-gray-700
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-purple-300
                    focus:ring-1
                    focus:ring-purple-100
                  "
                />

              </div>

              {/* Sort */}
              <div className="relative w-full sm:w-[175px]">

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="
                    h-9
                    w-full
                    appearance-none
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-3
                    pr-8
                    text-[12px]
                    font-medium
                    text-gray-600
                    outline-none
                    focus:border-purple-300
                    focus:ring-1
                    focus:ring-purple-100
                  "
                >
                  <option value="recent">
                    Recently Downloaded
                  </option>

                  <option value="oldest">
                    Oldest
                  </option>

                  <option value="name">
                    Name
                  </option>

                  <option value="country">
                    Country
                  </option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={() =>
                  fetchBrochures(true)
                }
                disabled={refreshing}
                title="Refresh"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

            </div>
          </div>
        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Full Name
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Country
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Downloaded At
                </th>

              </tr>
            </thead>

            <tbody>

              {paginatedData.length > 0 ? (

                paginatedData.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/50"
                  >

                    {/* Full Name */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50">
                          <UserRound
                            size={16}
                            className="text-[#7C3AED]"
                          />
                        </div>

                        <p className="max-w-[210px] truncate text-[12px] font-semibold text-gray-800">
                          {item.fullName}
                        </p>

                      </div>

                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Mail
                          size={14}
                          className="shrink-0 text-gray-400"
                        />

                        <a
                          href={
                            item.email !== "—"
                              ? `mailto:${item.email}`
                              : undefined
                          }
                          className="max-w-[260px] truncate text-[12px] text-gray-600 hover:text-[#7C3AED]"
                        >
                          {item.email}
                        </a>

                      </div>

                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Phone
                          size={14}
                          className="shrink-0 text-gray-400"
                        />

                        <a
                          href={
                            item.phone !== "—"
                              ? `tel:${item.phone}`
                              : undefined
                          }
                          className="text-[12px] text-gray-600 hover:text-[#7C3AED]"
                        >
                          {item.phone}
                        </a>

                      </div>

                    </td>

                    {/* Country */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Globe2
                          size={14}
                          className="shrink-0 text-gray-400"
                        />

                        <span className="text-[12px] text-gray-600">
                          {item.country}
                        </span>

                      </div>

                    </td>

                    {/* Downloaded At */}
                    <td className="px-5 py-4 text-right">

                      <span className="text-[11px] text-gray-500">
                        {formatDateTime(
                          item.createdAt
                        )}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center"
                  >

                    <Download
                      size={30}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="text-[13px] font-medium text-gray-600">
                      No brochure requests found
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {search
                        ? "Try searching with a different keyword."
                        : "No brochure download requests are available."}
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ==================================================
            PAGINATION FOOTER
        ================================================== */}

        {filteredData.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">

            {/* Showing */}
            <p className="text-[11px] text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {startItem}
              </span>
              {" - "}
              <span className="font-semibold text-gray-700">
                {endItem}
              </span>
              {" of "}
              <span className="font-semibold text-gray-700">
                {filteredData.length}
              </span>{" "}
              requests
            </p>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">

                {/* Previous */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    text-gray-500
                    transition
                    hover:border-purple-200
                    hover:bg-purple-50
                    hover:text-[#7C3AED]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <ChevronLeft size={15} />
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`
                      flex
                      h-8
                      min-w-8
                      items-center
                      justify-center
                      rounded-md
                      px-2
                      text-[11px]
                      font-medium
                      transition
                      ${
                        currentPage === page
                          ? "bg-[#7C3AED] text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50 hover:text-[#7C3AED]"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        totalPages
                      )
                    )
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    text-gray-500
                    transition
                    hover:border-purple-200
                    hover:bg-purple-50
                    hover:text-[#7C3AED]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <ChevronRight size={15} />
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

// ======================================================
// DATE TIME
// ======================================================

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default Brochures;