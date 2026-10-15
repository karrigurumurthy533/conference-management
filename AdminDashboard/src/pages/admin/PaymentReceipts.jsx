
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Receipt,
  CheckCircle2,
  IndianRupee,
  Eye,
  Edit3,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CalendarDays,
  UserRound,
  Plus,
} from "lucide-react";

import {
  getAllReceipts,
  downloadReceiptPdf,
  deleteReceipt,
} from "../../redux/receiptSlice";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const getId = (item) =>
  item?._id || item?.id || item?.receiptId || "";

const getStatus = (item) =>
  String(item?.status || item?.paymentStatus || "").toLowerCase();

const getCustomerName = (item) =>
  item?.billing?.name ||
  item?.billing?.fullName ||
  item?.billingName ||
  item?.customer?.fullName ||
  item?.customer?.name ||
  item?.customerName ||
  "Unknown Customer";

const getEmail = (item) =>
  item?.billing?.email ||
  item?.billingEmail ||
  item?.customer?.email ||
  item?.email ||
  "-";

const getConferenceName = (item) => {
  const conference = item?.conference;

  if (typeof conference === "string") {
    return item?.conferenceTitle || conference;
  }

  return (
    item?.conferenceTitle ||
    conference?.title ||
    conference?.name ||
    "Conference"
  );
};

const getReceiptNumber = (item) =>
  item?.receiptNumber ||
  item?.paymentReceiptNumber ||
  `RCP-${String(getId(item)).slice(-8).toUpperCase()}`;

const getAmount = (item) => {
  if (item?.totalAmount != null) return Number(item.totalAmount) || 0;
  if (item?.amount != null) return Number(item.amount) || 0;
  if (item?.paidAmount != null) return Number(item.paidAmount) || 0;

  const totals = item?.totals;

  if (totals instanceof Map) {
    return Array.from(totals.values()).reduce(
      (sum, value) => sum + (Number(value) || 0),
      0
    );
  }

  if (totals && typeof totals === "object") {
    return Object.values(totals).reduce(
      (sum, value) => sum + (Number(value) || 0),
      0
    );
  }

  if (Array.isArray(item?.items)) {
    return item.items.reduce(
      (sum, row) => sum + (Number(row?.amount) || 0),
      0
    );
  }

  return 0;
};

const getCurrency = (item) =>
  item?.currency ||
  item?.items?.[0]?.currency ||
  (item?.totals && Object.keys(item.totals)[0]) ||
  "USD";

const formatAmount = (item) => {
  const amount = getAmount(item);
  const currency = getCurrency(item);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPaymentDate = (item) =>
  item?.paymentDate ||
  item?.paidAt ||
  item?.updatedAt ||
  item?.createdAt;

const isPaid = (status) =>
  ["paid", "success", "successful", "completed"].includes(
    String(status || "").toLowerCase()
  );

const StatusBadge = ({ status }) => {
  const paid = isPaid(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${
        paid
          ? "border-violet-100 bg-violet-50 text-violet-700"
          : "border-amber-100 bg-amber-50 text-amber-700"
      }`}
    >
      {paid ? (
        <CheckCircle2 size={13} />
      ) : (
        <CalendarDays size={13} />
      )}
      {paid ? "Paid" : status || "Pending"}
    </span>
  );
};

const SummaryCard = ({ title, value, description, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{title}</p>

        <h3 className="mt-2 text-2xl font-bold text-gray-900">
          {value}
        </h3>

        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>

      <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
        <Icon size={20} />
      </div>
    </div>
  </motion.div>
);

const PaymentReceipts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    receipts = [],
    loading = false,
    error = null,
    pagination = {},
    downloading = false,
    deleting = false,
  } = useSelector((state) => state.receipt || {});

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const totalPages = Math.max(
    1,
    Number(pagination?.totalPages) || 1
  );

  const loadReceipts = async (page = currentPage) => {
    setRefreshing(true);

    try {
      await dispatch(
        getAllReceipts({
          page,
          limit: itemsPerPage,
          search: search.trim(),
          status: statusFilter === "All" ? "" : statusFilter,
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to load payment receipts:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReceipts(currentPage);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, statusFilter]);

  const paidReceipts = useMemo(
    () =>
      (Array.isArray(receipts) ? receipts : []).filter((item) =>
        isPaid(getStatus(item))
      ),
    [receipts]
  );

  const filteredReceipts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return paidReceipts;

    return paidReceipts.filter((item) => {
      const searchable = [
        getReceiptNumber(item),
        getCustomerName(item),
        getEmail(item),
        getConferenceName(item),
        item?.transactionId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [paidReceipts, search]);

  const paidAmount = paidReceipts.reduce(
    (total, item) => total + getAmount(item),
    0
  );

  const summaryCurrency = paidReceipts[0]
    ? getCurrency(paidReceipts[0])
    : "USD";

  const formattedPaidAmount = (() => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: summaryCurrency,
        maximumFractionDigits: 2,
      }).format(paidAmount);
    } catch {
      return `${summaryCurrency} ${paidAmount.toFixed(2)}`;
    }
  })();

  const removeReceipt = async (item) => {
    const id = getId(item);
    if (!id || !window.confirm(`Delete receipt ${getReceiptNumber(item)}? This cannot be undone.`)) return;
    try {
      await dispatch(deleteReceipt(id)).unwrap();
    } catch (error) {
      window.alert(typeof error === "string" ? error : "Unable to delete receipt.");
    }
  };

  const openReceipt = (item) => {
    const receiptId = getId(item);

    if (receiptId) {
      navigate(`/admin/payment-receipts/${receiptId}`);
    }
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[char];
    });
  }

  const downloadReceipt = async (item) => {
    const receiptId = getId(item);

    if (!receiptId) {
      alert("Receipt ID is missing.");
      return;
    }

    try {
      const result = await dispatch(
        downloadReceiptPdf(receiptId)
      ).unwrap();

      const blob = result?.blob || result;

      if (!(blob instanceof Blob)) {
        throw new Error("The server did not return a valid PDF file.");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${getReceiptNumber(item)}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Receipt PDF download failed:", err);

      // Fallback: open the receipt in a printable window.
      const receiptNumber = getReceiptNumber(item);
      const customerName = getCustomerName(item);
      const email = getEmail(item);
      const conferenceName = getConferenceName(item);
      const paymentDate = formatDate(getPaymentDate(item));
      const amount = formatAmount(item);
      const transactionId = item?.transactionId || "-";
      const status = getStatus(item);

      const printWindow = window.open(
        "",
        "_blank",
        "width=900,height=750"
      );

      if (!printWindow) {
        alert(
          "Unable to download the PDF. Please allow pop-ups and try again."
        );
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Payment Receipt - ${escapeHtml(receiptNumber)}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 36px;
              color: #1f2937;
              font-family: Arial, Helvetica, sans-serif;
              background: #fff;
            }
            .receipt {
              max-width: 760px;
              margin: auto;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 36px;
            }
            .brand {
              color: #7c3aed;
              font-size: 24px;
              font-weight: 800;
            }
            .subtitle { color: #6b7280; margin-top: 6px; }
            h1 { font-size: 24px; margin: 32px 0 8px; }
            .number { color: #6d28d9; font-weight: 700; }
            .line {
              display: flex;
              justify-content: space-between;
              gap: 24px;
              padding: 13px 0;
              border-bottom: 1px solid #eee;
            }
            .label { color: #6b7280; }
            .value {
              font-weight: 600;
              text-align: right;
              overflow-wrap: anywhere;
            }
            .amount {
              margin-top: 24px;
              padding: 20px;
              border-radius: 8px;
              background: #f5f3ff;
              display: flex;
              justify-content: space-between;
              gap: 16px;
              font-size: 20px;
              font-weight: 800;
            }
            .paid { color: #6d28d9; }
            footer {
              margin-top: 36px;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body { padding: 0; }
              .receipt { border: 0; }
            }
          </style>
        </head>
        <body>
          <main class="receipt">
            <div class="brand">GlobalScion Conferences</div>
            <div class="subtitle">Official payment receipt</div>
            <h1>PAYMENT RECEIPT</h1>
            <p class="number">Receipt: ${escapeHtml(receiptNumber)}</p>
            <div class="line">
              <span class="label">Customer</span>
              <span class="value">${escapeHtml(customerName)}</span>
            </div>
            <div class="line">
              <span class="label">Email</span>
              <span class="value">${escapeHtml(email)}</span>
            </div>
            <div class="line">
              <span class="label">Conference</span>
              <span class="value">${escapeHtml(conferenceName)}</span>
            </div>
            <div class="line">
              <span class="label">Date of Payment</span>
              <span class="value">${escapeHtml(paymentDate)}</span>
            </div>
            <div class="line">
              <span class="label">Transaction ID</span>
              <span class="value">${escapeHtml(transactionId)}</span>
            </div>
            <div class="line">
              <span class="label">Payment Status</span>
              <span class="value paid">${escapeHtml(status || "Paid")}</span>
            </div>
            <div class="amount">
              <span>Total Paid</span>
              <span>${escapeHtml(amount)}</span>
            </div>
            <footer>
              Thank you for your payment.
              Please keep this receipt for your records.
            </footer>
          </main>
          <script>
            window.onload = function () { window.print(); };
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-w-0 w-full space-y-5 overflow-hidden"
    >
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Receipts on This Page"
          value={paidReceipts.length}
          description="Successful payment records"
          icon={Receipt}
        />

        <SummaryCard
          title="Total Paid on This Page"
          value={formattedPaidAmount}
          description="Sum of displayed paid records"
          icon={IndianRupee}
        />

        <SummaryCard
          title="Payment Status"
          value="Paid"
          description="Only successful payments are shown"
          icon={CheckCircle2}
        />
      </div>

      {/* RECEIPTS TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* HEADER */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Receipt Records
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Search receipts by number, customer, email or conference.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {/* SEARCH */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search receipts..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:w-56"
              />
            </div>

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              <option value="All">All Receipts</option>
              <option value="Paid">Paid</option>
            </select>

            {/* ADD RECEIPT BUTTON */}
            <button
              type="button"
              onClick={() => navigate("/admin/payment-receipts/create")}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <Plus size={17} strokeWidth={2.5} />
              Add Receipt
            </button>

            {/* REFRESH BUTTON */}
            <button
              type="button"
              onClick={() => loadReceipts(currentPage)}
              disabled={loading || refreshing}
              title="Refresh receipts"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  loading || refreshing ? "animate-spin" : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="m-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {typeof error === "string"
              ? error
              : error?.message || "Unable to load payment receipts."}
          </div>
        )}

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-gray-50">
                {[
                  "Receipt Number",
                  "Customer",
                  "Conference",
                  "Payment Date",
                  "Amount",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="mx-auto flex items-center justify-center gap-2 text-sm text-gray-500">
                      <RefreshCw
                        size={17}
                        className="animate-spin text-violet-600"
                      />
                      Loading payment receipts...
                    </div>
                  </td>
                </tr>
              ) : filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="rounded-full bg-violet-50 p-4 text-violet-500">
                        <Receipt size={26} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-gray-800">
                        No payment receipts found
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Successful payment records will appear here.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/admin/payment-receipts/create")
                        }
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                      >
                        <Plus size={16} />
                        Add Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((item) => (
                  <tr
                    key={getId(item) || getReceiptNumber(item)}
                    className="transition hover:bg-violet-50/30"
                  >
                    {/* RECEIPT NUMBER */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                          <Receipt size={16} />
                        </div>

                        <span className="whitespace-nowrap text-sm font-semibold text-violet-700">
                          {getReceiptNumber(item)}
                        </span>
                      </div>
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-gray-100 p-2 text-gray-500">
                          <UserRound size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[190px] truncate text-sm font-semibold text-gray-800">
                            {getCustomerName(item)}
                          </p>

                          <p className="max-w-[190px] truncate text-xs text-gray-500">
                            {getEmail(item)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CONFERENCE */}
                    <td className="max-w-[220px] px-4 py-4">
                      <p className="line-clamp-2 text-sm text-gray-700">
                        {getConferenceName(item)}
                      </p>
                    </td>

                    {/* PAYMENT DATE */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {formatDate(getPaymentDate(item))}
                    </td>

                    {/* AMOUNT */}
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="text-sm font-bold text-gray-900">
                        {formatAmount(item)}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <StatusBadge status={getStatus(item)} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openReceipt(item)}
                          title="View receipt"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/admin/payment-receipts/${getId(item)}/edit`)}
                          title="Edit receipt"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-violet-50"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadReceipt(item)}
                          disabled={downloading}
                          title="Download receipt PDF"
                          className="rounded-lg border border-violet-200 bg-violet-50 p-2 text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeReceipt(item)}
                          disabled={deleting}
                          title="Delete receipt"
                          className="rounded-lg border border-red-100 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            Page{" "}
            <span className="font-semibold text-gray-800">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {totalPages}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1 || loading}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages || loading}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs leading-5 text-gray-400">
        Note: Payment receipt records are loaded from the payment receipt API.
      </p>
    </motion.div>
  );
};

export default PaymentReceipts;
