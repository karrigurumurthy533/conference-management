
import React, { useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CreditCard,
} from "lucide-react";

import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPayments,
  fetchPaymentSummary,
  clearPaymentError,
} from "../../redux/paymentSlice";

const ITEMS_PER_PAGE = 6;

const Payments = () => {
  const dispatch = useDispatch();

  const {
    payments = [],
    summary = {},
    pagination = {},
    loading = false,
    summaryLoading = false,
    error = null,
  } = useSelector((state) => state.payment);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /*
   * Fetch summary once and refresh the payments list
   * whenever the search or current page changes.
   */
  useEffect(() => {
    dispatch(fetchPaymentSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchPayments({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: search.trim(),
      })
    );
  }, [dispatch, currentPage, search]);

  /*
   * Currency formatting
   */
  const formatAmount = (amount, currency = "INR") => {
    const numericAmount = Number(amount ?? 0);
    const normalizedCurrency = String(currency || "INR").toUpperCase();

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: normalizedCurrency,
        maximumFractionDigits: 2,
      }).format(
        Number.isFinite(numericAmount) ? numericAmount : 0
      );
    } catch {
      return `${normalizedCurrency} ${numericAmount.toFixed(2)}`;
    }
  };

  /*
   * Format date from MongoDB createdAt / paidAt
   */
  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  /*
   * Support the payment schema and common API response shapes.
   */
  const getPaymentId = (payment) =>
    payment?.razorpay?.paymentId ||
    payment?.transactionId ||
    payment?._id ||
    payment?.id ||
    "—";

  const getAttendee = (payment) =>
    payment?.payer?.name ||
    payment?.registrationId?.payer?.name ||
    payment?.registrationId?.name ||
    payment?.attendee?.name ||
    payment?.attendee ||
    "—";

  const getConference = (payment) =>
    payment?.conferenceTitle ||
    payment?.conference?.title ||
    payment?.registrationId?.conference?.title ||
    "—";

  const getPaymentDate = (payment) =>
    payment?.paidAt ||
    payment?.createdAt ||
    payment?.updatedAt;

  const getPaymentMethod = (payment) => {
    const method =
      payment?.paymentMethod ||
      payment?.method ||
      payment?.razorpayData?.method;

    if (!method) return "—";

    return String(method)
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  };

  const getPaymentStatus = (payment) => {
    const status =
      payment?.paymentStatus ||
      payment?.status ||
      "Pending";

    const normalized = String(status).toLowerCase();

    if (normalized === "captured" || normalized === "success") {
      return "Paid";
    }

    if (normalized === "partially refunded") {
      return "Partially Refunded";
    }

    return String(status)
      .replace(/\b\w/g, (character) => character.toUpperCase());
  };

  /*
   * Search handler
   */
  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);

    if (error) {
      dispatch(clearPaymentError());
    }
  };

  /*
   * Refresh both the summary and transactions.
   */
  const handleRefresh = () => {
    dispatch(fetchPaymentSummary());

    dispatch(
      fetchPayments({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: search.trim(),
      })
    );
  };

  /*
   * Summary data comes from the summary API.
   * Fallback counts are derived from the currently loaded list.
   */
  const normalizedPayments = useMemo(
    () => (Array.isArray(payments) ? payments : []),
    [payments]
  );

  const paidPayments = normalizedPayments.filter(
    (payment) => getPaymentStatus(payment) === "Paid"
  );

  const pendingPayments = normalizedPayments.filter(
    (payment) => getPaymentStatus(payment) === "Pending"
  );

  const failedPayments = normalizedPayments.filter(
    (payment) => getPaymentStatus(payment) === "Failed"
  );

  const totalRevenue = Number(
    summary?.totalRevenue ??
    summary?.totalPaid ??
    summary?.revenue ??
    0
  );

  const successfulCount = Number(
    summary?.successfulPayments ??
    summary?.paidPayments ??
    summary?.paidCount ??
    paidPayments.length
  );

  const pendingCount = Number(
    summary?.pendingPayments ??
    summary?.pendingCount ??
    pendingPayments.length
  );

  const failedCount = Number(
    summary?.failedPayments ??
    summary?.failedCount ??
    failedPayments.length
  );

  /*
   * Backend pagination metadata
   */
  const totalRecords = Number(
    pagination?.total ??
    pagination?.totalRecords ??
    normalizedPayments.length
  );

  const totalPages = Math.max(
    1,
    Number(
      pagination?.totalPages ||
      Math.ceil(totalRecords / ITEMS_PER_PAGE)
    )
  );

  const safePage = Math.min(currentPage, totalPages);

  /*
   * Keep page values within valid bounds if the dataset changes.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const firstRecord =
    totalRecords === 0
      ? 0
      : (safePage - 1) * ITEMS_PER_PAGE + 1;

  const lastRecord = Math.min(
    (safePage - 1) * ITEMS_PER_PAGE + normalizedPayments.length,
    totalRecords
  );

  const getStatusStyle = (status) => {
    switch (String(status).toLowerCase()) {
      case "paid":
        return "bg-emerald-50 text-emerald-600";

      case "pending":
      case "created":
        return "bg-amber-50 text-amber-600";

      case "failed":
        return "bg-red-50 text-red-600";

      case "refunded":
        return "bg-blue-50 text-blue-600";

      case "partially refunded":
        return "bg-violet-50 text-violet-600";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full overflow-hidden"
    >
      {/* SUMMARY CARDS */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL REVENUE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          whileHover={{ y: -2 }}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Total Revenue
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {summaryLoading ? (
                  <span className="text-sm text-gray-400">
                    Loading...
                  </span>
                ) : (
                  formatAmount(totalRevenue, summary?.currency || "USD")
                )}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <IndianRupee size={18} className="text-violet-600" />
            </div>
          </div>
        </motion.div>

        {/* SUCCESSFUL PAYMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          whileHover={{ y: -2 }}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Successful Payments
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {summaryLoading ? "—" : successfulCount.toLocaleString()}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <CheckCircle2 size={18} className="text-violet-600" />
            </div>
          </div>
        </motion.div>

        {/* PENDING PAYMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          whileHover={{ y: -2 }}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Pending Payments
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {summaryLoading ? "—" : pendingCount.toLocaleString()}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <Clock3 size={18} className="text-violet-600" />
            </div>
          </div>
        </motion.div>

        {/* FAILED PAYMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          whileHover={{ y: -2 }}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Failed Payments
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {summaryLoading ? "—" : failedCount.toLocaleString()}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <XCircle size={18} className="text-violet-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* PAYMENT TRANSACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
      >
        {/* TABLE HEADER */}
        <div className="flex flex-col gap-2.5 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900">
              Payment Transactions
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Monitor conference payment activity
            </p>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative w-full sm:w-[230px]">
              <Search
                size={15}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search payments..."
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || summaryLoading}
              title="Refresh payments"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={
                  loading || summaryLoading ? "animate-spin" : ""
                }
              />
            </button>
          </div>
        </div>

        {/* API ERROR */}
        {error && (
          <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-3">
            <AlertCircle size={15} className="shrink-0 text-red-500" />

            <p className="text-[11px] text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="ml-auto shrink-0 text-[11px] font-semibold text-red-600 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="w-[15%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Payment ID
                </th>

                <th className="w-[17%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Attendee
                </th>

                <th className="w-[23%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Conference
                </th>

                <th className="w-[12%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="w-[12%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                <th className="w-[10%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Method
                </th>

                <th className="w-[11%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw
                        size={22}
                        className="animate-spin text-violet-600"
                      />

                      <p className="text-[12px] font-medium text-gray-500">
                        Loading payment transactions...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : normalizedPayments.length > 0 ? (
                normalizedPayments.map((payment, index) => {
                  const status = getPaymentStatus(payment);
                  const currency = payment?.currency || "INR";

                  return (
                    <motion.tr
                      key={payment?._id || payment?.id || index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.28,
                        delay: index * 0.035,
                      }}
                      whileHover={{
                        backgroundColor: "rgba(139, 92, 246, 0.035)",
                      }}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-3 py-3">
                        <span
                          title={getPaymentId(payment)}
                          className="block truncate text-[11px] font-semibold text-violet-600"
                        >
                          {getPaymentId(payment)}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <p
                          title={getAttendee(payment)}
                          className="truncate text-[12px] font-semibold text-gray-800"
                        >
                          {getAttendee(payment)}
                        </p>

                        {payment?.payer?.email && (
                          <p
                            title={payment.payer.email}
                            className="mt-0.5 truncate text-[10px] text-gray-400"
                          >
                            {payment.payer.email}
                          </p>
                        )}
                      </td>

                      <td className="px-3 py-3">
                        <p
                          title={getConference(payment)}
                          className="truncate text-[11px] text-gray-600"
                        >
                          {getConference(payment)}
                        </p>
                      </td>

                      <td className="px-3 py-3 text-[11px] text-gray-500">
                        {formatDate(getPaymentDate(payment))}
                      </td>

                      <td className="px-3 py-3">
                        <span className="whitespace-nowrap text-[12px] font-semibold text-gray-800">
                          {formatAmount(payment?.amount, currency)}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-600">
                          <CreditCard
                            size={12}
                            className="shrink-0 text-gray-400"
                          />
                          <span className="truncate">
                            {getPaymentMethod(payment)}
                          </span>
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(status)}`}
                        >
                          {status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard
                        size={25}
                        className="text-gray-300"
                      />

                      <p className="text-[13px] font-medium text-gray-500">
                        {search.trim()
                          ? "No payment transactions match your search."
                          : "No payment transactions found."}
                      </p>

                      {search.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setCurrentPage(1);
                          }}
                          className="text-[11px] font-semibold text-violet-600 hover:text-violet-700"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {firstRecord}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-gray-700">
              {lastRecord}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {totalRecords}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              disabled={safePage <= 1 || loading}
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.max(1, previous - 1)
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, index) => {
                let page;

                if (totalPages <= 5) {
                  page = index + 1;
                } else if (safePage <= 3) {
                  page = index + 1;
                } else if (safePage >= totalPages - 2) {
                  page = totalPages - 4 + index;
                } else {
                  page = safePage - 2 + index;
                }

                return (
                  <button
                    key={page}
                    type="button"
                    disabled={loading}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                      safePage === page
                        ? "bg-violet-600 text-white"
                        : "border border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:text-violet-600"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
            )}

            <button
              type="button"
              disabled={safePage >= totalPages || loading}
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.min(totalPages, previous + 1)
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Payments;
