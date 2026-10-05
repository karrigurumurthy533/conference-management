import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Search,
  FileText,
  CheckCircle2,
  Clock3,
  XCircle,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

// =========================================================
// SAMPLE DATA
// =========================================================

const initialInvoices = [
  {
    _id: "INV-1001",
    invoiceNumber: "INV-1001",
    customerName: "John Smith",
    email: "john@example.com",
    conferenceName:
      "International Autism Research Conference",
    amount: 450,
    currency: "USD",
    status: "Paid",
    paymentStatus: "Paid",
    invoiceDate: "2026-09-28",
    dueDate: "2026-10-05",
  },
  {
    _id: "INV-1002",
    invoiceNumber: "INV-1002",
    customerName: "Sarah Williams",
    email: "sarah@example.com",
    conferenceName:
      "Global Mental Health Summit",
    amount: 350,
    currency: "USD",
    status: "Pending",
    paymentStatus: "Pending",
    invoiceDate: "2026-09-25",
    dueDate: "2026-10-10",
  },
  {
    _id: "INV-1003",
    invoiceNumber: "INV-1003",
    customerName: "David Kumar",
    email: "david@example.com",
    conferenceName:
      "Healthcare Innovation Congress",
    amount: 500,
    currency: "USD",
    status: "Paid",
    paymentStatus: "Paid",
    invoiceDate: "2026-09-22",
    dueDate: "2026-09-30",
  },
  {
    _id: "INV-1004",
    invoiceNumber: "INV-1004",
    customerName: "Emily Johnson",
    email: "emily@example.com",
    conferenceName:
      "AI & Digital Psychiatry Conference",
    amount: 275,
    currency: "USD",
    status: "Overdue",
    paymentStatus: "Overdue",
    invoiceDate: "2026-09-15",
    dueDate: "2026-09-25",
  },
  {
    _id: "INV-1005",
    invoiceNumber: "INV-1005",
    customerName: "Michael Brown",
    email: "michael@example.com",
    conferenceName:
      "International Oncology Conference",
    amount: 600,
    currency: "USD",
    status: "Paid",
    paymentStatus: "Paid",
    invoiceDate: "2026-09-12",
    dueDate: "2026-09-20",
  },
  {
    _id: "INV-1006",
    invoiceNumber: "INV-1006",
    customerName: "Priya Reddy",
    email: "priya@example.com",
    conferenceName:
      "Endocrinology & Diabetes Congress",
    amount: 425,
    currency: "USD",
    status: "Pending",
    paymentStatus: "Pending",
    invoiceDate: "2026-09-10",
    dueDate: "2026-10-12",
  },
];

// =========================================================
// MOTION VARIANTS
// =========================================================

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.06,
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

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    y: 5,
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

const menuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 5,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.16,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    scale: 0.96,
    y: 5,
    transition: {
      duration: 0.12,
      ease: "easeIn",
    },
  },
};

// =========================================================
// HELPERS
// =========================================================

const getStatus = (invoice) => {
  return (
    invoice?.status ||
    invoice?.paymentStatus ||
    invoice?.invoiceStatus ||
    "Pending"
  );
};

const getCustomerName = (invoice) => {
  return (
    invoice?.customerName ||
    invoice?.fullName ||
    invoice?.name ||
    invoice?.customer?.fullName ||
    invoice?.user?.fullName ||
    "Unknown Customer"
  );
};

const getCustomerEmail = (invoice) => {
  return (
    invoice?.email ||
    invoice?.customer?.email ||
    invoice?.user?.email ||
    "-"
  );
};

const getConferenceName = (invoice) => {
  const conference = invoice?.conference;

  if (typeof conference === "string") {
    return conference;
  }

  if (
    conference &&
    typeof conference === "object"
  ) {
    return (
      conference?.title ||
      conference?.conferenceTitle ||
      conference?.name ||
      conference?.basicInformation?.title ||
      "Conference"
    );
  }

  return (
    invoice?.conferenceName ||
    invoice?.conferenceTitle ||
    invoice?.eventName ||
    "Conference"
  );
};

const getInvoiceNumber = (invoice) => {
  return (
    invoice?.invoiceNumber ||
    invoice?.invoiceNo ||
    invoice?.invoiceId ||
    invoice?.number ||
    invoice?._id ||
    "-"
  );
};

const getAmount = (invoice) => {
  return (
    invoice?.amount ??
    invoice?.totalAmount ??
    invoice?.price ??
    invoice?.total ??
    0
  );
};

const getCurrency = (invoice) => {
  return (
    invoice?.currency ||
    invoice?.currencyCode ||
    "USD"
  );
};

const formatAmount = (invoice) => {
  const amount =
    Number(getAmount(invoice)) || 0;

  const currency = getCurrency(invoice);

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

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getInvoiceDate = (invoice) => {
  return (
    invoice?.invoiceDate ||
    invoice?.createdAt ||
    invoice?.date ||
    invoice?.issuedAt
  );
};

const getDueDate = (invoice) => {
  return (
    invoice?.dueDate ||
    invoice?.paymentDueDate ||
    invoice?.deadline
  );
};

// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = ({ status }) => {
  const normalizedStatus = String(
    status || "Pending"
  ).toLowerCase();

  if (
    normalizedStatus === "paid" ||
    normalizedStatus === "completed"
  ) {
    return (
      <motion.span
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="inline-flex items-center gap-1 rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700"
      >
        <CheckCircle2 size={11} />
        Paid
      </motion.span>
    );
  }

  if (
    normalizedStatus === "overdue" ||
    normalizedStatus === "failed" ||
    normalizedStatus === "cancelled"
  ) {
    return (
      <motion.span
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="inline-flex items-center gap-1 rounded-md border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600"
      >
        <XCircle size={11} />
        {status}
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="inline-flex items-center gap-1 rounded-md border border-amber-100 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700"
    >
      <Clock3 size={11} />
      {status || "Pending"}
    </motion.span>
  );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const Invoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] =
    useState(initialInvoices);

  const [loading, setLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [openMenu, setOpenMenu] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;

  // =========================================================
  // GET ALL INVOICES
  // =========================================================

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      /*
      const response = await getInvoicesApi();

      const responseData = response?.data;

      const invoiceData =
        responseData?.data ||
        responseData?.invoices ||
        [];

      setInvoices(
        Array.isArray(invoiceData)
          ? invoiceData
          : []
      );
      */

      setInvoices(initialInvoices);
    } catch (error) {
      console.error(
        "Get invoices error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load invoices"
      );

      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const searchValue =
        search.toLowerCase().trim();

      const invoiceNumber = String(
        getInvoiceNumber(invoice)
      ).toLowerCase();

      const customerName = String(
        getCustomerName(invoice)
      ).toLowerCase();

      const customerEmail = String(
        getCustomerEmail(invoice)
      ).toLowerCase();

      const conferenceName = String(
        getConferenceName(invoice)
      ).toLowerCase();

      const status = String(
        getStatus(invoice)
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        invoiceNumber.includes(
          searchValue
        ) ||
        customerName.includes(
          searchValue
        ) ||
        customerEmail.includes(
          searchValue
        ) ||
        conferenceName.includes(
          searchValue
        ) ||
        status.includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" ||
        status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    invoices,
    search,
    statusFilter,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredInvoices.length /
        itemsPerPage
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedInvoices =
    filteredInvoices.slice(
      (safePage - 1) *
        itemsPerPage,
      safePage * itemsPerPage
    );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalInvoices =
    invoices.length;

  const paidInvoices =
    invoices.filter((invoice) => {
      const status = String(
        getStatus(invoice)
      ).toLowerCase();

      return (
        status === "paid" ||
        status === "completed"
      );
    }).length;

  const pendingInvoices =
    invoices.filter((invoice) => {
      const status = String(
        getStatus(invoice)
      ).toLowerCase();

      return status === "pending";
    }).length;

  const overdueInvoices =
    invoices.filter((invoice) => {
      const status = String(
        getStatus(invoice)
      ).toLowerCase();

      return status === "overdue";
    }).length;

  // =========================================================
  // FILTER CHANGE
  // =========================================================

  const handleFilterChange = (
    setter,
    value
  ) => {
    setter(value);
    setCurrentPage(1);
    setOpenMenu(null);
  };

  // =========================================================
  // ADD
  // =========================================================

  const handleAddInvoice = () => {
    navigate("/admin/invoices/add");
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleViewInvoice = (
    invoiceId
  ) => {
    setOpenMenu(null);

    navigate(
      `/admin/invoices/${invoiceId}`
    );
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEditInvoice = (
    invoiceId
  ) => {
    setOpenMenu(null);

    navigate(
      `/admin/invoices/${invoiceId}/edit`
    );
  };

  // =========================================================
  // DOWNLOAD
  // =========================================================

  const handleDownloadInvoice = (
    invoice
  ) => {
    setOpenMenu(null);

    console.log(
      "Download invoice:",
      invoice
    );
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDeleteInvoice = async (
    invoiceId
  ) => {
    setOpenMenu(null);

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this invoice?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(invoiceId);
      setError("");

      /*
      await deleteInvoiceApi(invoiceId);
      */

      setInvoices((previous) =>
        previous.filter(
          (invoice) =>
            invoice?._id !== invoiceId
        )
      );
    } catch (error) {
      console.error(
        "Delete invoice error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to delete invoice"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
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

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 gap-1.5 xl:grid-cols-4"
        >

          {/* TOTAL */}

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
                  Total Invoices
                </p>

                <motion.h3
                  key={totalInvoices}
                  initial={{
                    opacity: 0,
                    y: 4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-1 text-[21px] font-bold text-gray-900"
                >
                  {totalInvoices}
                </motion.h3>
              </div>

              <motion.div
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50"
              >
                <FileText
                  size={18}
                  className="text-violet-600"
                />
              </motion.div>

            </div>
          </motion.div>

          {/* PAID */}

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
                  Paid Invoices
                </p>

                <motion.h3
                  key={paidInvoices}
                  initial={{
                    opacity: 0,
                    y: 4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-1 text-[21px] font-bold text-gray-900"
                >
                  {paidInvoices}
                </motion.h3>
              </div>

              <motion.div
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50"
              >
                <CheckCircle2
                  size={18}
                  className="text-violet-600"
                />
              </motion.div>

            </div>
          </motion.div>

          {/* PENDING */}

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
                  Pending Invoices
                </p>

                <motion.h3
                  key={pendingInvoices}
                  initial={{
                    opacity: 0,
                    y: 4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-1 text-[21px] font-bold text-gray-900"
                >
                  {pendingInvoices}
                </motion.h3>
              </div>

              <motion.div
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50"
              >
                <Clock3
                  size={18}
                  className="text-violet-600"
                />
              </motion.div>

            </div>
          </motion.div>

          {/* OVERDUE */}

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
                  Overdue Invoices
                </p>

                <motion.h3
                  key={overdueInvoices}
                  initial={{
                    opacity: 0,
                    y: 4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-1 text-[21px] font-bold text-gray-900"
                >
                  {overdueInvoices}
                </motion.h3>
              </div>

              <motion.div
                whileHover={{
                  rotate: 4,
                  scale: 1.05,
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50"
              >
                <XCircle
                  size={18}
                  className="text-violet-600"
                />
              </motion.div>

            </div>
          </motion.div>

        </motion.div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -6,
                height: 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                y: -6,
                height: 0,
              }}
              className="flex items-center justify-between overflow-hidden rounded-lg border border-red-100 bg-red-50 px-3 py-2.5"
            >
              <p className="text-[11px] font-medium text-red-600">
                {error}
              </p>

              <motion.button
                type="button"
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                onClick={fetchInvoices}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-100"
              >
                Retry
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <motion.div
          variants={sectionVariants}
          className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm"
        >

          {/* ===================================================
              FILTER BAR
          =================================================== */}

          <motion.div
            variants={sectionVariants}
            className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center"
          >

            {/* SEARCH */}

            <motion.div
              whileFocus={{
                scale: 1.005,
              }}
              className="relative min-w-0 flex-1"
            >
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}
                placeholder="Search invoices..."
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100"
              />

              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* STATUS */}

            <motion.select
              whileFocus={{
                scale: 1.005,
              }}
              value={statusFilter}
              onChange={(e) =>
                handleFilterChange(
                  setStatusFilter,
                  e.target.value
                )
              }
              className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-36"
            >
              <option value="All Status">
                All Status
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Overdue">
                Overdue
              </option>
            </motion.select>

            {/* ADD */}

            <motion.button
              type="button"
              onClick={handleAddInvoice}
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[11px] font-semibold text-white transition hover:bg-violet-700"
            >
              <Plus size={14} />
              New Invoice
            </motion.button>

          </motion.div>

          {/* ===================================================
              TABLE
          =================================================== */}

          <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[950px] table-fixed">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">

                  <th className="w-[15%] px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Invoice
                  </th>

                  <th className="w-[20%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="w-[23%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Conference
                  </th>

                  <th className="w-[12%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="w-[13%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Invoice Date
                  </th>

                  <th className="w-[11%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="w-[6%] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {/* LOADING */}

                {loading ? (
                  <motion.tr
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                  >
                    <td
                      colSpan="7"
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">

                        <Loader2
                          size={26}
                          className="animate-spin text-violet-600"
                        />

                        <p className="mt-2 text-[12px] font-medium text-gray-500">
                          Loading invoices...
                        </p>

                      </div>
                    </td>
                  </motion.tr>
                ) : paginatedInvoices.length >
                  0 ? (

                  <AnimatePresence mode="popLayout">

                    {paginatedInvoices.map(
                      (
                        invoice,
                        index
                      ) => {

                        const invoiceId =
                          invoice?._id ||
                          invoice?.invoiceNumber;

                        const customerName =
                          getCustomerName(
                            invoice
                          );

                        const customerEmail =
                          getCustomerEmail(
                            invoice
                          );

                        const conferenceName =
                          getConferenceName(
                            invoice
                          );

                        return (
                          <motion.tr
                            key={invoiceId}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{
                              opacity: 0,
                              x: -10,
                            }}
                            transition={{
                              delay:
                                index *
                                0.035,
                            }}
                            whileHover={{
                              backgroundColor:
                                "rgba(124,58,237,0.025)",
                            }}
                            className="border-b border-gray-50 transition"
                          >

                            {/* INVOICE */}

                            <td className="px-5 py-3.5">

                              <div className="flex min-w-0 items-center gap-2.5">

                                <motion.div
                                  whileHover={{
                                    scale: 1.05,
                                    rotate: 2,
                                  }}
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
                                >
                                  <FileText
                                    size={15}
                                  />
                                </motion.div>

                                <div className="min-w-0">

                                  <p className="truncate text-[12px] font-semibold text-gray-800">
                                    {getInvoiceNumber(
                                      invoice
                                    )}
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-gray-400">
                                    Invoice
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* CUSTOMER */}

                            <td className="px-4 py-3.5">

                              <div className="min-w-0">

                                <p className="truncate text-[12px] font-semibold text-gray-800">
                                  {customerName}
                                </p>

                                <p className="mt-0.5 truncate text-[10px] text-gray-500">
                                  {customerEmail}
                                </p>

                              </div>

                            </td>

                            {/* CONFERENCE */}

                            <td className="px-4 py-3.5">

                              <p
                                title={
                                  conferenceName
                                }
                                className="truncate text-[11px] font-medium text-gray-700"
                              >
                                {
                                  conferenceName
                                }
                              </p>

                            </td>

                            {/* AMOUNT */}

                            <td className="px-4 py-3.5">

                              <motion.p
                                whileHover={{
                                  x: 1,
                                }}
                                className="text-[11px] font-bold text-gray-800"
                              >
                                {formatAmount(
                                  invoice
                                )}
                              </motion.p>

                            </td>

                            {/* DATE */}

                            <td className="px-4 py-3.5">

                              <p className="text-[11px] font-medium text-gray-700">
                                {formatDate(
                                  getInvoiceDate(
                                    invoice
                                  )
                                )}
                              </p>

                              {getDueDate(
                                invoice
                              ) && (
                                <p className="mt-0.5 text-[9px] text-gray-400">
                                  Due{" "}
                                  {formatDate(
                                    getDueDate(
                                      invoice
                                    )
                                  )}
                                </p>
                              )}

                            </td>

                            {/* STATUS */}

                            <td className="px-4 py-3.5">

                              <StatusBadge
                                status={getStatus(
                                  invoice
                                )}
                              />

                            </td>

                            {/* ACTION */}

                            <td className="relative z-40 px-4 py-3.5 text-center">

                              <motion.button
                                type="button"
                                whileHover={{
                                  scale: 1.05,
                                }}
                                whileTap={{
                                  scale: 0.92,
                                }}
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu ===
                                      invoiceId
                                      ? null
                                      : invoiceId
                                  )
                                }
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                              >
                                <MoreVertical
                                  size={16}
                                />
                              </motion.button>

                              <AnimatePresence>
                                {openMenu ===
                                  invoiceId && (
                                  <motion.div
                                    variants={
                                      menuVariants
                                    }
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute bottom-11 right-4 z-50 w-40 rounded-lg border border-gray-100 bg-white p-1.5 text-left shadow-lg"
                                  >

                                    {/* VIEW */}

                                    <motion.button
                                      type="button"
                                      whileHover={{
                                        x: 2,
                                      }}
                                      onClick={() =>
                                        handleViewInvoice(
                                          invoiceId
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                                    >
                                      <Eye
                                        size={13}
                                      />

                                      View
                                    </motion.button>

                                    {/* EDIT */}

                                    <motion.button
                                      type="button"
                                      whileHover={{
                                        x: 2,
                                      }}
                                      onClick={() =>
                                        handleEditInvoice(
                                          invoiceId
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                                    >
                                      <Pencil
                                        size={13}
                                      />

                                      Edit
                                    </motion.button>

                                    {/* DOWNLOAD */}

                                    <motion.button
                                      type="button"
                                      whileHover={{
                                        x: 2,
                                      }}
                                      onClick={() =>
                                        handleDownloadInvoice(
                                          invoice
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                                    >
                                      <Download
                                        size={13}
                                      />

                                      Download
                                    </motion.button>

                                    {/* DELETE */}

                                    <motion.button
                                      type="button"
                                      disabled={
                                        deleteLoading ===
                                        invoiceId
                                      }
                                      whileHover={{
                                        x: 2,
                                      }}
                                      onClick={() =>
                                        handleDeleteInvoice(
                                          invoiceId
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {deleteLoading ===
                                      invoiceId ? (
                                        <Loader2
                                          size={
                                            13
                                          }
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Trash2
                                          size={
                                            13
                                          }
                                        />
                                      )}

                                      Delete
                                    </motion.button>

                                  </motion.div>
                                )}
                              </AnimatePresence>

                            </td>

                          </motion.tr>
                        );
                      }
                    )}

                  </AnimatePresence>

                ) : (

                  /* EMPTY */

                  <motion.tr
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                  >
                    <td
                      colSpan="7"
                      className="px-4 py-10 text-center"
                    >

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="flex flex-col items-center justify-center"
                      >

                        <motion.div
                          animate={{
                            y: [
                              0,
                              -3,
                              0,
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <FileText
                            size={30}
                            className="mb-2 text-violet-300"
                          />
                        </motion.div>

                        <p className="text-[12px] font-semibold text-gray-600">
                          No invoices found
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          Try changing your
                          search or filters.
                        </p>

                      </motion.div>

                    </td>
                  </motion.tr>

                )}

              </tbody>

            </table>

          </div>

          {/* ===================================================
              PAGINATION
          =================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5"
          >

            <p className="text-[11px] text-gray-500">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {filteredInvoices.length ===
                0
                  ? 0
                  : (safePage - 1) *
                      itemsPerPage +
                    1}
              </span>

              {" "}to{" "}

              <span className="font-semibold text-gray-700">
                {Math.min(
                  safePage *
                    itemsPerPage,
                  filteredInvoices.length
                )}
              </span>

              {" "}of{" "}

              <span className="font-semibold text-gray-700">
                {filteredInvoices.length}
              </span>

              {" "}invoices

            </p>

            <div className="flex items-center gap-1">

              {/* PREVIOUS */}

              <motion.button
                type="button"
                disabled={
                  safePage === 1
                }
                whileHover={{
                  scale:
                    safePage === 1
                      ? 1
                      : 1.03,
                }}
                whileTap={{
                  scale:
                    safePage === 1
                      ? 1
                      : 0.94,
                }}
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        page - 1,
                        1
                      )
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={15}
                />
              </motion.button>

              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (
                <motion.button
                  key={page}
                  type="button"
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                    safePage === page
                      ? "bg-violet-600 text-white"
                      : "border border-gray-200 bg-white text-gray-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                  }`}
                >
                  {page}
                </motion.button>
              ))}

              {/* NEXT */}

              <motion.button
                type="button"
                disabled={
                  safePage ===
                  totalPages
                }
                whileHover={{
                  scale:
                    safePage ===
                    totalPages
                      ? 1
                      : 1.03,
                }}
                whileTap={{
                  scale:
                    safePage ===
                    totalPages
                      ? 1
                      : 0.94,
                }}
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        page + 1,
                        totalPages
                      )
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={15}
                />
              </motion.button>

            </div>

          </motion.div>

        </motion.div>

      </motion.div>
    </motion.div>
  );
};

export default Invoices;