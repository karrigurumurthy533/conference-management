
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Receipt,
  CheckCircle2,
  Clock3,
  XCircle,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  CalendarDays,
  UserRound,
  FileText,
  X,
  AlertTriangle,
} from "lucide-react";

import {
  getAllReceipts,
  downloadReceiptPdf,
  deleteReceipt,
} from "../../redux/receiptSlice";

const ITEMS_PER_PAGE = 6;

// =====================================================
// MOTION
// =====================================================

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

const menuVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.16, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: { duration: 0.12 },
  },
};

// =====================================================
// HELPERS
// =====================================================

const getReceiptId = (receipt) =>
  receipt?._id ||
  receipt?.id ||
  receipt?.receiptId ||
  "";

const getStatus = (receipt) =>
  String(
    receipt?.status ||
      receipt?.paymentStatus ||
      "Pending"
  ).trim();

const normalizeStatus = (receipt) =>
  getStatus(receipt).toLowerCase();

const getCustomerObject = (receipt) =>
  receipt?.customer ||
  receipt?.user ||
  receipt?.billing ||
  receipt?.billingAddress ||
  {};

const getCustomerName = (receipt) => {
  const customer = getCustomerObject(receipt);

  if (typeof customer === "string") return customer;

  return (
    customer?.fullName ||
    customer?.name ||
    customer?.contactName ||
    receipt?.customerName ||
    receipt?.billingName ||
    receipt?.fullName ||
    receipt?.name ||
    "Unknown Customer"
  );
};

const getCustomerEmail = (receipt) => {
  const customer = getCustomerObject(receipt);

  if (typeof customer === "string") {
    return receipt?.email || receipt?.customerEmail || "";
  }

  return (
    customer?.email ||
    receipt?.customerEmail ||
    receipt?.email ||
    ""
  );
};

const getReceiptNumber = (receipt) =>
  receipt?.receiptNumber ||
  receipt?.paymentReceiptNumber ||
  receipt?.receiptNo ||
  receipt?.number ||
  (getReceiptId(receipt)
    ? `RCP-${String(getReceiptId(receipt))
        .slice(-8)
        .toUpperCase()}`
    : "Receipt");

// =====================================================
// AMOUNT AND CURRENCY HELPERS
// =====================================================

const toAmountNumber = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    const parsed = Number(cleaned);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (value && typeof value === "object") {
    return toAmountNumber(
      value.amount ??
        value.totalAmount ??
        value.grandTotal ??
        value.total ??
        value.value ??
        0
    );
  }

  return 0;
};

const getCurrency = (receipt) => {
  const totals = receipt?.totals || {};

  // Prefer the currency explicitly provided by the receipt or its items.
  const directCurrency =
    receipt?.currency ||
    receipt?.paymentCurrency ||
    receipt?.payment?.currency ||
    receipt?.items?.[0]?.currency;

  if (directCurrency) {
    return String(directCurrency).toUpperCase();
  }

  // Supports: totals: { EUR: 399 }
  const currencyKey = Object.keys(totals).find(
    (key) =>
      /^[A-Z]{3}$/.test(key) &&
      totals[key] !== null &&
      totals[key] !== undefined &&
      (typeof totals[key] === "number" ||
        typeof totals[key] === "string")
  );

  return currencyKey || "USD";
};

const getAmount = (receipt) => {
  const totals = receipt?.totals || {};
  const payment = receipt?.payment || {};

  const candidates = [
    receipt?.totalAmount,
    receipt?.grandTotal,
    receipt?.amountPaid,
    receipt?.paidAmount,
    receipt?.amount,
    receipt?.total,
    totals?.grandTotal,
    totals?.totalAmount,
    totals?.total,
    totals?.amount,
    payment?.amount,
    payment?.totalAmount,
  ];

  const amount = candidates.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      typeof value !== "object"
  );

  if (amount !== undefined) {
    return toAmountNumber(amount);
  }

  // Read the total corresponding to the receipt currency.
  // Example: totals.EUR = 399
  const currency = getCurrency(receipt);

  if (
    totals[currency] !== undefined &&
    totals[currency] !== null
  ) {
    return toAmountNumber(totals[currency]);
  }

  // Fallback to the receipt's item amounts.
  if (Array.isArray(receipt?.items) && receipt.items.length > 0) {
    return receipt.items.reduce(
      (sum, item) => sum + toAmountNumber(item?.amount),
      0
    );
  }

  // Final fallback: use the first available currency-keyed total.
  const currencyKey = Object.keys(totals).find(
    (key) =>
      /^[A-Z]{3}$/.test(key) &&
      totals[key] !== null &&
      totals[key] !== undefined &&
      (typeof totals[key] === "number" ||
        typeof totals[key] === "string")
  );

  return currencyKey ? toAmountNumber(totals[currencyKey]) : 0;
};

const formatMoneyForSummary = (amount, currency = "USD") => {
  const numericAmount = toAmountNumber(amount);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency} ${numericAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};

const formatAmount = (receipt) =>
  formatMoneyForSummary(getAmount(receipt), getCurrency(receipt));

const getReceiptDate = (receipt) =>
  receipt?.paymentDate ||
  receipt?.paidAt ||
  receipt?.receiptDate ||
  receipt?.createdAt ||
  receipt?.updatedAt ||
  null;

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isPaid = (receipt) =>
  ["paid", "success", "successful", "completed", "complete"].includes(
    normalizeStatus(receipt)
  );

const isPending = (receipt) =>
  ["pending", "processing", "initiated", "awaiting"].includes(
    normalizeStatus(receipt)
  );

const isCancelled = (receipt) =>
  ["cancelled", "canceled", "failed", "rejected", "refunded"].includes(
    normalizeStatus(receipt)
  );

// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({ receipt }) => {
  const status = normalizeStatus(receipt);

  if (isPaid(receipt)) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1 rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700"
      >
        <CheckCircle2 size={11} />
        Paid
      </motion.span>
    );
  }

  if (isCancelled(receipt)) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1 rounded-md border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600"
      >
        <XCircle size={11} />
        {status === "refunded"
          ? "Refunded"
          : status === "cancelled" || status === "canceled"
            ? "Cancelled"
            : "Failed"}
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1 rounded-md border border-amber-100 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700"
    >
      <Clock3 size={11} />
      {getStatus(receipt)}
    </motion.span>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const PaymentReceipts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    receipts = [],
    loading = false,
    error = null,
    pagination = {},
    downloading = false,
    deleting = false,
  } = useSelector((state) => state.receipt || {});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const receiptList = useMemo(
    () => (Array.isArray(receipts) ? receipts : []),
    [receipts]
  );

  // =====================================================
  // FETCH RECEIPTS
  // =====================================================

  const fetchReceipts = useCallback(
    (page = currentPage) =>
      dispatch(
        getAllReceipts({
          page,
          limit: ITEMS_PER_PAGE,
          search: search.trim(),
          status:
            statusFilter === "All Status" ? "" : statusFilter,
        })
      ),
    [dispatch, currentPage, search, statusFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReceipts(currentPage);
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchReceipts, currentPage]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Number(pagination?.totalPages) || 1
  );

  const safePage = Math.min(currentPage, totalPages);

  const totalReceipts = Number(
    pagination?.totalReceipts ??
      pagination?.totalItems ??
      pagination?.total ??
      receiptList.length
  );

  // =====================================================
  // SUMMARY CARDS
  // =====================================================

  const paidReceipts = receiptList.filter(isPaid);
  const pendingReceipts = receiptList.filter(isPending);
  const cancelledReceipts = receiptList.filter(isCancelled);

  // Group by currency to avoid adding EUR, USD, and GBP together.
  const paidAmountByCurrency = paidReceipts.reduce(
    (result, receipt) => {
      const currency = getCurrency(receipt);
      const amount = getAmount(receipt);

      result[currency] = (result[currency] || 0) + amount;

      return result;
    },
    {}
  );

  const paidAmountSummary =
    Object.entries(paidAmountByCurrency)
      .map(([currency, amount]) =>
        formatMoneyForSummary(amount, currency)
      )
      .join(" / ") || formatMoneyForSummary(0, "EUR");

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setOpenMenu(null);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Backend should apply search and status filters.
  // This client filter also supports APIs returning all matching rows.
  const visibleReceipts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return receiptList.filter((receipt) => {
      const matchesSearch =
        !query ||
        getReceiptNumber(receipt).toLowerCase().includes(query) ||
        getCustomerName(receipt).toLowerCase().includes(query) ||
        getCustomerEmail(receipt).toLowerCase().includes(query);

      const selectedStatus = statusFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All Status" ||
        normalizeStatus(receipt) === selectedStatus ||
        (selectedStatus === "cancelled" &&
          ["cancelled", "canceled"].includes(normalizeStatus(receipt)));

      return matchesSearch && matchesStatus;
    });
  }, [receiptList, search, statusFilter]);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleAddReceipt = () => {
    setOpenMenu(null);
    navigate("/admin/payment-receipts/create");
  };

  const handleViewReceipt = (receiptId) => {
    if (!receiptId) return;

    setOpenMenu(null);
    navigate(`/admin/payment-receipts/${receiptId}`);
  };

  const handleEditReceipt = (receiptId) => {
    if (!receiptId) return;

    setOpenMenu(null);
    navigate(`/admin/payment-receipts/${receiptId}/edit`);
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchReceipts(currentPage).unwrap();
    } catch (refreshError) {
      console.error("Failed to refresh receipts:", refreshError);
    } finally {
      setRefreshing(false);
    }
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownload = async (receiptId) => {
    if (!receiptId) return;

    setOpenMenu(null);

    try {
      const result = await dispatch(
        downloadReceiptPdf(receiptId)
      ).unwrap();

      const blob = result?.blob || result;

      if (!(blob instanceof Blob)) {
        console.error(
          "Receipt download did not return a Blob. Check downloadReceiptPdf in receiptSlice."
        );
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const receipt = receiptList.find(
        (item) => getReceiptId(item) === receiptId
      );

      link.href = url;
      link.download = `${getReceiptNumber(
        receipt || { _id: receiptId }
      )}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (downloadError) {
      console.error("Receipt PDF download failed:", downloadError);
    }
  };

  // =====================================================
  // DELETE RECEIPT
  // =====================================================

  const handleOpenDelete = (receipt) => {
    if (!getReceiptId(receipt)) return;

    setOpenMenu(null);
    setDeleteTarget(receipt);
  };

  const handleCloseDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const receiptId = getReceiptId(deleteTarget);
    if (!receiptId) return;

    try {
      await dispatch(deleteReceipt(receiptId)).unwrap();

      setDeleteTarget(null);

      if (receiptList.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        fetchReceipts(currentPage);
      }
    } catch (deleteError) {
      console.error("Receipt deletion failed:", deleteError);
    }
  };

  useEffect(() => {
    if (!deleteTarget) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !deleting) {
        setDeleteTarget(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [deleteTarget, deleting]);

  // =====================================================
  // ACTION MENU OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    if (!openMenu) return;

    const handleOutsideClick = (event) => {
      const menu = document.getElementById("receipt-action-menu");
      const button = document.querySelector(
        `[data-receipt-action="${openMenu}"]`
      );

      if (menu?.contains(event.target)) return;
      if (button?.contains(event.target)) return;

      setOpenMenu(null);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    const handleScroll = () => setOpenMenu(null);
    const handleResize = () => setOpenMenu(null);

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [openMenu]);

  // =====================================================
  // OPEN ACTION MENU
  // =====================================================

  const handleOpenMenu = (event, receiptId) => {
    event.preventDefault();
    event.stopPropagation();

    if (!receiptId) return;

    if (openMenu === receiptId) {
      setOpenMenu(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const menuWidth = 160;
    const menuHeight = 150;
    const gap = 6;
    const padding = 10;

    let left = rect.right - menuWidth;
    let top = rect.bottom + gap;

    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding;
    }

    if (left < padding) left = padding;

    if (top + menuHeight > window.innerHeight - padding) {
      top = rect.top - menuHeight - gap;
    }

    if (top < padding) top = padding;

    setMenuPosition({ top, left });
    setOpenMenu(receiptId);
  };

  const activeReceipt = receiptList.find(
    (receipt) => getReceiptId(receipt) === openMenu
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-w-0 w-full overflow-hidden"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="min-w-0 w-full space-y-4"
        >
          {/* SUMMARY CARDS */}

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 gap-1.5 xl:grid-cols-4"
          >
            {/* TOTAL */}

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[12px] font-medium text-gray-500">
                    Total Receipts
                  </p>
                  <motion.h3
                    key={totalReceipts}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-[21px] font-bold text-gray-900"
                  >
                    {totalReceipts}
                  </motion.h3>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <Receipt size={18} className="text-violet-600" />
                </div>
              </div>
            </motion.div>

            {/* PAID */}

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[12px] font-medium text-gray-500">
                    Paid Receipts
                  </p>
                  <motion.h3
                    key={paidReceipts.length}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-[21px] font-bold text-gray-900"
                  >
                    {paidReceipts.length}
                  </motion.h3>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <CheckCircle2 size={18} className="text-violet-600" />
                </div>
              </div>
            </motion.div>

            {/* PENDING */}

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[12px] font-medium text-gray-500">
                    Pending Receipts
                  </p>
                  <motion.h3
                    key={pendingReceipts.length}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-[21px] font-bold text-gray-900"
                  >
                    {pendingReceipts.length}
                  </motion.h3>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <Clock3 size={18} className="text-violet-600" />
                </div>
              </div>
            </motion.div>

            {/* PAID AMOUNT */}

            <motion.div
              variants={cardVariants}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-gray-100 bg-white px-3.5 py-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-gray-500">
                    Paid Amount
                  </p>
                  <motion.h3
                    key={paidAmountSummary}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 break-words text-[17px] font-bold text-gray-900"
                  >
                    {paidAmountSummary}
                  </motion.h3>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <CheckCircle2 size={18} className="text-violet-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ERROR */}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="flex items-center justify-between overflow-hidden rounded-lg border border-red-100 bg-red-50 px-3 py-2.5"
              >
                <p className="text-[11px] font-medium text-red-600">
                  {typeof error === "string"
                    ? error
                    : error?.message || "Unable to load payment receipts."}
                </p>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="rounded-md px-2.5 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-100"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN CARD */}

          <motion.div
            variants={cardVariants}
            className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            {/* FILTER BAR */}

            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    handleSearchChange(event.target.value)
                  }
                  placeholder="Search receipts..."
                  className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100"
                />

                <AnimatePresence>
                  {search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="button"
                      aria-label="Clear search"
                      onClick={() => handleSearchChange("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  handleFilterChange(event.target.value)
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-36"
              >
                <option value="All Status">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-[11px] font-semibold text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <motion.button
                type="button"
                onClick={handleAddReceipt}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[11px] font-semibold text-white transition hover:bg-violet-700"
              >
                <Plus size={14} />
                New Receipt
              </motion.button>
            </div>

            {/* TABLE */}

            <div
              className={`w-full overflow-x-auto transition-opacity duration-300 ${
                loading && receiptList.length > 0
                  ? "opacity-75"
                  : "opacity-100"
              }`}
            >
              <table className="w-full min-w-[800px] table-fixed">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="w-[20%] px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Receipt
                    </th>
                    <th className="w-[24%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Customer
                    </th>
                    <th className="w-[16%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>
                    <th className="w-[16%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Payment Date
                    </th>
                    <th className="w-[15%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                    <th className="w-[9%] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* LOADING SKELETON */}

                  {loading && receiptList.length === 0 ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <motion.tr
                        key={`receipt-skeleton-${index}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="border-b border-gray-50"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-gray-100" />
                            <div className="space-y-1.5">
                              <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                              <div className="h-2.5 w-14 animate-pulse rounded bg-gray-50" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="space-y-1.5">
                            <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
                            <div className="h-2.5 w-32 animate-pulse rounded bg-gray-50" />
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="h-6 w-16 animate-pulse rounded-md bg-gray-100" />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="mx-auto h-8 w-8 animate-pulse rounded-md bg-gray-100" />
                        </td>
                      </motion.tr>
                    ))
                  ) : visibleReceipts.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                      {visibleReceipts.map((receipt, index) => {
                        const receiptId = getReceiptId(receipt);

                        return (
                          <motion.tr
                            key={receiptId || `receipt-${index}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ delay: index * 0.025 }}
                            onClick={() => handleViewReceipt(receiptId)}
                            whileHover={{
                              backgroundColor: "rgba(124,58,237,0.035)",
                            }}
                            className="cursor-pointer border-b border-gray-50 transition"
                          >
                            {/* RECEIPT */}

                            <td className="px-5 py-3.5">
                              <div className="flex min-w-0 items-center gap-2.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                  <FileText size={15} />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-[12px] font-semibold text-gray-800">
                                    {getReceiptNumber(receipt)}
                                  </p>
                                  <p className="mt-0.5 text-[10px] text-gray-400">
                                    Payment receipt
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* CUSTOMER */}

                            <td className="px-4 py-3.5">
                              <div className="flex min-w-0 items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                  <UserRound size={14} />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-[12px] font-semibold text-gray-800">
                                    {getCustomerName(receipt)}
                                  </p>
                                  <p className="mt-0.5 truncate text-[10px] text-gray-500">
                                    {getCustomerEmail(receipt) || "-"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* AMOUNT */}

                            <td className="px-4 py-3.5">
                              <motion.p
                                whileHover={{ x: 1 }}
                                className="whitespace-nowrap text-[11px] font-bold text-gray-800"
                              >
                                {formatAmount(receipt)}
                              </motion.p>
                            </td>

                            {/* DATE */}

                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-gray-700">
                                <CalendarDays
                                  size={13}
                                  className="shrink-0 text-gray-400"
                                />
                                {formatDate(getReceiptDate(receipt))}
                              </div>
                            </td>

                            {/* STATUS */}

                            <td className="px-4 py-3.5">
                              <StatusBadge receipt={receipt} />
                            </td>

                            {/* ACTIONS */}

                            <td
                              className="px-4 py-3.5 text-center"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <motion.button
                                type="button"
                                data-receipt-action={receiptId}
                                aria-label="Receipt actions"
                                aria-expanded={openMenu === receiptId}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={(event) =>
                                  handleOpenMenu(event, receiptId)
                                }
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
                                  openMenu === receiptId
                                    ? "bg-violet-50 text-violet-600"
                                    : "text-gray-400 hover:bg-violet-50 hover:text-violet-600"
                                }`}
                              >
                                <MoreVertical size={16} />
                              </motion.button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td colSpan={6} className="px-4 py-10 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Receipt
                            size={30}
                            className="mb-2 text-violet-300"
                          />
                          <p className="text-[12px] font-semibold text-gray-600">
                            No payment receipts found
                          </p>
                          <p className="mt-1 text-[10px] text-gray-400">
                            Try changing your search or filters.
                          </p>
                          <button
                            type="button"
                            onClick={handleAddReceipt}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-violet-700"
                          >
                            <Plus size={13} />
                            New Receipt
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {visibleReceipts.length === 0
                    ? 0
                    : (safePage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-700">
                  {Math.min(
                    safePage * ITEMS_PER_PAGE,
                    totalReceipts
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {totalReceipts}
                </span>{" "}
                receipts
              </p>

              <div className="flex items-center gap-1">
                <motion.button
                  type="button"
                  disabled={safePage <= 1 || loading}
                  whileHover={{ scale: safePage <= 1 ? 1 : 1.03 }}
                  whileTap={{ scale: safePage <= 1 ? 1 : 0.94 }}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </motion.button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <motion.button
                    key={page}
                    type="button"
                    disabled={loading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                      safePage === page
                        ? "bg-violet-600 text-white"
                        : "border border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}

                <motion.button
                  type="button"
                  disabled={safePage >= totalPages || loading}
                  whileHover={{
                    scale: safePage >= totalPages ? 1 : 1.03,
                  }}
                  whileTap={{
                    scale: safePage >= totalPages ? 1 : 0.94,
                  }}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ACTION MENU */}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {openMenu && activeReceipt && (
              <motion.div
                id="receipt-action-menu"
                key="receipt-action-menu"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(event) => event.stopPropagation()}
                style={{
                  position: "fixed",
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                  zIndex: 999999,
                }}
                className="w-40 rounded-lg border border-gray-100 bg-white p-1.5 text-left shadow-2xl"
              >
                <motion.button
                  type="button"
                  whileHover={{ x: 2 }}
                  onClick={() => handleViewReceipt(openMenu)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                >
                  <Eye size={13} />
                  View
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ x: 2 }}
                  onClick={() => handleEditReceipt(openMenu)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                >
                  <Pencil size={13} />
                  Edit
                </motion.button>

                <motion.button
                  type="button"
                  disabled={downloading}
                  whileHover={{ x: 2 }}
                  onClick={() => handleDownload(openMenu)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 transition hover:bg-violet-50 hover:text-violet-600 disabled:opacity-50"
                >
                  <Download size={13} />
                  {downloading ? "Downloading..." : "Download"}
                </motion.button>

                <div className="my-1 border-t border-gray-100" />

                <motion.button
                  type="button"
                  disabled={deleting}
                  whileHover={{ x: 2 }}
                  onClick={() => handleOpenDelete(activeReceipt)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Delete
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* DELETE CONFIRMATION MODAL */}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {deleteTarget && (
              <motion.div
                key="receipt-delete-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseDelete}
                className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.2 }}
                  onClick={(event) => event.stopPropagation()}
                  className="w-full max-w-[390px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
                >
                  <div className="flex items-start justify-between px-5 pt-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                        <AlertTriangle
                          size={19}
                          className="text-red-500"
                        />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-gray-900">
                          Delete Receipt?
                        </h3>
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleCloseDelete}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="px-5 pb-4 pt-4">
                    <p className="text-[12px] leading-5 text-gray-600">
                      Are you sure you want to delete this payment receipt?
                    </p>

                    <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                      <p className="truncate text-[12px] font-semibold text-gray-800">
                        {getReceiptNumber(deleteTarget)}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-gray-500">
                        {getCustomerName(deleteTarget)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3.5">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleCloseDelete}
                      className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleConfirmDelete}
                      className="flex h-9 min-w-[112px] items-center justify-center gap-1.5 rounded-lg bg-red-500 px-4 text-[11px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                    >
                      {deleting ? (
                        <>
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={13} />
                          Delete Receipt
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default PaymentReceipts;
