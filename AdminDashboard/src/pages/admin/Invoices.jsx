import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

// =========================================================
// REDUX
// =========================================================

import {
  getAllInvoices,
  deleteInvoice,
} from "../../redux/invoiceSlice";

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
    y: 8,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const menuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: -4,
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
    y: -4,
    transition: {
      duration: 0.12,
      ease: "easeIn",
    },
  },
};

const deleteModalVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.18,
    },
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

const deleteDialogVariants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 12,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

// =========================================================
// HELPERS
// =========================================================

const getInvoiceId = (invoice) => {
  return invoice?._id || invoice?.id;
};

const getStatus = (invoice) => {
  return (
    invoice?.status ||
    invoice?.paymentStatus ||
    "Pending"
  );
};

const getCustomerName = (invoice) => {
  return (
    invoice?.customer?.fullName ||
    "Unknown Customer"
  );
};

const getCustomerEmail = (invoice) => {
  return (
    invoice?.customer?.email ||
    "-"
  );
};

const getConferenceName = (invoice) => {
  const conference = invoice?.conferenceId;

  if (
    conference &&
    typeof conference === "object"
  ) {
    return (
      conference?.title ||
      conference?.name ||
      "Conference"
    );
  }

  return "Conference";
};

const getInvoiceNumber = (invoice) => {
  return (
    invoice?.invoiceNumber ||
    "-"
  );
};

const getAmount = (invoice) => {
  return Number(
    invoice?.totalAmount ??
      invoice?.amount ??
      0
  );
};

const getCurrency = (invoice) => {
  return (
    invoice?.currency ||
    "USD"
  );
};

const formatAmount = (invoice) => {
  const amount =
    Number(getAmount(invoice)) || 0;

  const currency =
    getCurrency(invoice);

  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
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
    invoice?.createdAt
  );
};

// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = ({
  status,
}) => {
  const normalizedStatus =
    String(
      status || "Pending"
    ).toLowerCase();

  // PAID
  if (
    normalizedStatus === "paid"
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

  // CANCELLED / FAILED / REFUNDED
  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "failed" ||
    normalizedStatus === "refunded"
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

  // DRAFT / ISSUED / PENDING
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
  const dispatch = useDispatch();

  // =======================================================
  // REDUX STATE
  // =======================================================

  const {
    invoices = [],
    loading,
    deleteLoading,
    error,
    pagination = {},
  } = useSelector(
    (state) =>
      state.invoice || {}
  );

  // =======================================================
  // LOCAL STATE
  // =======================================================

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [openMenu, setOpenMenu] =
    useState(null);

  const [menuPosition, setMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const [currentPage, setCurrentPage] =
    useState(1);

  // DELETE CONFIRMATION TARGET
  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const itemsPerPage = 6;

  // =======================================================
  // FETCH INVOICES
  // =======================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        dispatch(
          getAllInvoices({
            page: currentPage,
            limit: itemsPerPage,
            search: search.trim(),
            status:
              statusFilter ===
              "All Status"
                ? ""
                : statusFilter,
          })
        );
      }, 400);

    return () =>
      clearTimeout(timer);
  }, [
    dispatch,
    currentPage,
    search,
    statusFilter,
  ]);

  // =======================================================
  // TOTAL PAGES
  // =======================================================

  const totalPages = Math.max(
    1,
    Number(
      pagination?.totalPages
    ) || 1
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  // =======================================================
  // SUMMARY
  // =======================================================

  const totalInvoices =
    Number(
      pagination?.totalInvoices
    ) || 0;

  const paidInvoices =
    invoices.filter(
      (invoice) =>
        String(
          getStatus(invoice)
        ).toLowerCase() ===
        "paid"
    ).length;

  const pendingInvoices =
    invoices.filter(
      (invoice) =>
        String(
          getStatus(invoice)
        ).toLowerCase() ===
        "pending"
    ).length;

  const cancelledInvoices =
    invoices.filter(
      (invoice) =>
        String(
          getStatus(invoice)
        ).toLowerCase() ===
        "cancelled"
    ).length;

  // =======================================================
  // FILTER
  // =======================================================

  const handleFilterChange = (
    value
  ) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setOpenMenu(null);
  };

  // =======================================================
  // ADD
  // =======================================================

  const handleAddInvoice = () => {
    setOpenMenu(null);

    navigate(
      "/admin/invoices/create"
    );
  };

  // =======================================================
  // VIEW
  // =======================================================

  const handleViewInvoice = (
    invoiceId
  ) => {
    if (!invoiceId) return;

    setOpenMenu(null);

    navigate(
      `/admin/invoices/${invoiceId}`
    );
  };

  // =======================================================
  // EDIT
  // =======================================================

  const handleEditInvoice = (
    invoiceId
  ) => {
    if (!invoiceId) return;

    setOpenMenu(null);

    navigate(
      `/admin/invoices/${invoiceId}/edit`
    );
  };

  // =======================================================
  // OPEN DELETE CONFIRMATION
  // =======================================================

  const handleDeleteInvoice = (
    invoice
  ) => {
    const invoiceId =
      getInvoiceId(invoice);

    if (!invoiceId) {
      console.warn(
        "Cannot delete invoice: invoice ID is missing"
      );
      return;
    }

    // Close action menu first
    setOpenMenu(null);

    // Open custom confirmation popup
    setDeleteTarget(invoice);
  };

  // =======================================================
  // CLOSE DELETE POPUP
  // =======================================================

  const handleCloseDeletePopup = () => {
    if (deleteLoading) return;

    setDeleteTarget(null);
  };

  // =======================================================
  // CONFIRM DELETE
  // =======================================================

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const invoiceId =
      getInvoiceId(deleteTarget);

    if (!invoiceId) return;

    try {
      await dispatch(
        deleteInvoice(invoiceId)
      ).unwrap();

      // Close popup after successful delete
      setDeleteTarget(null);

      // If current page has only one item,
      // move to previous page
      if (
        invoices.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (page) => page - 1
        );
      } else {
        // Refresh current page
        dispatch(
          getAllInvoices({
            page: currentPage,
            limit: itemsPerPage,
            search: search.trim(),
            status:
              statusFilter ===
              "All Status"
                ? ""
                : statusFilter,
          })
        );
      }
    } catch (deleteError) {
      console.error(
        "Delete invoice error:",
        deleteError
      );
    }
  };

  // =======================================================
  // ESCAPE KEY FOR DELETE POPUP
  // =======================================================

  useEffect(() => {
    if (!deleteTarget) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleCloseDeletePopup();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    deleteTarget,
    deleteLoading,
  ]);

  // =======================================================
  // CLOSE MENU OUTSIDE CLICK
  // =======================================================

  useEffect(() => {
    if (!openMenu) return;

    const handleOutsideClick = (
      e
    ) => {
      const actionMenu =
        document.getElementById(
          "invoice-action-menu"
        );

      const actionButton =
        document.querySelector(
          `[data-invoice-action="${openMenu}"]`
        );

      if (
        actionMenu &&
        actionMenu.contains(
          e.target
        )
      ) {
        return;
      }

      if (
        actionButton &&
        actionButton.contains(
          e.target
        )
      ) {
        return;
      }

      setOpenMenu(null);
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
  }, [openMenu]);

  // =======================================================
  // CLOSE MENU ON SCROLL / RESIZE
  // =======================================================

  useEffect(() => {
    if (!openMenu) return;

    const handleScroll = () => {
      setOpenMenu(null);
    };

    const handleResize = () => {
      setOpenMenu(null);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      true
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [openMenu]);

  // =======================================================
  // OPEN ACTION MENU
  // =======================================================

  const handleOpenMenu = (
    e,
    invoiceId
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!invoiceId) {
      console.warn(
        "Cannot open action menu: invoice ID is missing"
      );
      return;
    }

    // Toggle menu
    if (openMenu === invoiceId) {
      setOpenMenu(null);
      return;
    }

    const button =
      e.currentTarget;

    if (!button) return;

    const rect =
      button.getBoundingClientRect();

    const menuWidth = 160;
    const menuHeight = 170;
    const gap = 6;
    const padding = 10;

    let left =
      rect.right - menuWidth;

    let top =
      rect.bottom + gap;

    // Prevent popup from going outside right edge
    if (
      left + menuWidth >
      window.innerWidth - padding
    ) {
      left =
        window.innerWidth -
        menuWidth -
        padding;
    }

    // Prevent popup from going outside left edge
    if (left < padding) {
      left = padding;
    }

    // If not enough space below,
    // open above the button
    if (
      top + menuHeight >
      window.innerHeight - padding
    ) {
      top =
        rect.top -
        menuHeight -
        gap;
    }

    // Prevent popup from going above viewport
    if (top < padding) {
      top = padding;
    }

    setMenuPosition({
      top,
      left,
    });

    setOpenMenu(invoiceId);
  };

  // =======================================================
  // GET ACTIVE INVOICE FOR POPUP
  // =======================================================

  const activeInvoice =
    invoices.find(
      (invoice) =>
        getInvoiceId(invoice) ===
        openMenu
    );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-w-0 w-full overflow-hidden"
      >
        <motion.div
          variants={
            containerVariants
          }
          initial="hidden"
          animate="visible"
          className="min-w-0 w-full space-y-4"
        >
          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <motion.div
            variants={
              containerVariants
            }
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

            {/* CANCELLED */}

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
                    Cancelled Invoices
                  </p>

                  <motion.h3
                    key={
                      cancelledInvoices
                    }
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
                    {cancelledInvoices}
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

          {/* =================================================
              ERROR
          ================================================= */}

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
                  onClick={() =>
                    dispatch(
                      getAllInvoices({
                        page: currentPage,
                        limit:
                          itemsPerPage,
                        search:
                          search.trim(),
                        status:
                          statusFilter ===
                          "All Status"
                            ? ""
                            : statusFilter,
                      })
                    )
                  }
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Retry
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <motion.div
            variants={
              sectionVariants
            }
            className="overflow-visible rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            {/* =================================================
                FILTER BAR
            ================================================= */}

            <motion.div
              variants={
                sectionVariants
              }
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
                value={
                  statusFilter
                }
                onChange={(e) =>
                  handleFilterChange(
                    e.target.value
                  )
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-36"
              >
                <option value="All Status">
                  All Status
                </option>

                <option value="Draft">
                  Draft
                </option>

                <option value="Issued">
                  Issued
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Paid">
                  Paid
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </motion.select>

              {/* ADD */}

              <motion.button
                type="button"
                onClick={
                  handleAddInvoice
                }
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

            {/* =================================================
                TABLE
            ================================================= */}

            <div
              className={`w-full overflow-x-auto transition-opacity duration-300 ${
                loading &&
                invoices.length > 0
                  ? "opacity-75"
                  : "opacity-100"
              }`}
            >
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
                  {/* SMOOTH INITIAL LOADING */}

                  {loading &&
                  invoices.length === 0 ? (
                    <AnimatePresence mode="wait">
                      {Array.from({
                        length: 6,
                      }).map(
                        (_, index) => (
                          <motion.tr
                            key={`invoice-skeleton-${index}`}
                            initial={{
                              opacity: 0,
                              y: 6,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              duration: 0.28,
                              delay:
                                index *
                                0.045,
                              ease: "easeOut",
                            }}
                            className="border-b border-gray-50"
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <motion.div
                                  animate={{
                                    opacity: [
                                      0.45,
                                      0.85,
                                      0.45,
                                    ],
                                  }}
                                  transition={{
                                    duration: 1.3,
                                    repeat:
                                      Infinity,
                                    ease: "easeInOut",
                                  }}
                                  className="h-9 w-9 shrink-0 rounded-lg bg-gray-100"
                                />

                                <div className="min-w-0 space-y-1.5">
                                  <motion.div
                                    animate={{
                                      opacity: [
                                        0.45,
                                        0.8,
                                        0.45,
                                      ],
                                    }}
                                    transition={{
                                      duration: 1.3,
                                      repeat:
                                        Infinity,
                                      ease: "easeInOut",
                                      delay: 0.05,
                                    }}
                                    className="h-3 w-24 rounded bg-gray-100"
                                  />

                                  <div className="h-2.5 w-12 rounded bg-gray-50" />
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3.5">
                              <div className="space-y-1.5">
                                <div className="h-3 w-28 rounded bg-gray-100" />
                                <div className="h-2.5 w-36 rounded bg-gray-50" />
                              </div>
                            </td>

                            <td className="px-4 py-3.5">
                              <div className="h-3 w-40 rounded bg-gray-100" />
                            </td>

                            <td className="px-4 py-3.5">
                              <div className="h-3 w-16 rounded bg-gray-100" />
                            </td>

                            <td className="px-4 py-3.5">
                              <div className="h-3 w-20 rounded bg-gray-100" />
                            </td>

                            <td className="px-4 py-3.5">
                              <div className="h-6 w-16 rounded-md bg-gray-100" />
                            </td>

                            <td className="px-4 py-3.5 text-center">
                              <div className="mx-auto h-8 w-8 rounded-md bg-gray-100" />
                            </td>
                          </motion.tr>
                        )
                      )}
                    </AnimatePresence>
                  ) : invoices.length >
                    0 ? (
                    <AnimatePresence
                      mode="popLayout"
                    >
                      {invoices.map(
                        (
                          invoice,
                          index
                        ) => {
                          const invoiceId =
                            getInvoiceId(
                              invoice
                            );

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
                              key={
                                invoiceId ||
                                `invoice-${index}`
                              }
                              variants={
                                rowVariants
                              }
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
                              onClick={() => {
                                if (
                                  invoiceId
                                ) {
                                  handleViewInvoice(
                                    invoiceId
                                  );
                                }
                              }}
                              whileHover={{
                                backgroundColor:
                                  "rgba(124,58,237,0.035)",
                              }}
                              className="cursor-pointer border-b border-gray-50 transition"
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
                                    {
                                      customerName
                                    }
                                  </p>

                                  <p className="mt-0.5 truncate text-[10px] text-gray-500">
                                    {
                                      customerEmail
                                    }
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

                              <td
                                className="px-4 py-3.5 text-center"
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                              >
                                <motion.button
                                  type="button"
                                  data-invoice-action={
                                    invoiceId
                                  }
                                  whileHover={{
                                    scale: 1.05,
                                  }}
                                  whileTap={{
                                    scale: 0.92,
                                  }}
                                  onClick={(
                                    e
                                  ) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    handleOpenMenu(
                                      e,
                                      invoiceId
                                    );
                                  }}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
                                    openMenu ===
                                    invoiceId
                                      ? "bg-violet-50 text-violet-600"
                                      : "text-gray-400 hover:bg-violet-50 hover:text-violet-600"
                                  }`}
                                >
                                  <MoreVertical
                                    size={16}
                                  />
                                </motion.button>
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
                              repeat:
                                Infinity,
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
                            Try changing
                            your search
                            or filters.
                          </p>
                        </motion.div>
                      </td>
                    </motion.tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

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
                  {invoices.length ===
                  0
                    ? 0
                    : (safePage - 1) *
                        itemsPerPage +
                      1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-700">
                  {Math.min(
                    safePage *
                      itemsPerPage,
                    pagination?.totalInvoices ||
                      0
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {
                    pagination?.totalInvoices
                  }
                </span>{" "}
                invoices
              </p>

              <div className="flex items-center gap-1">
                {/* PREVIOUS */}

                <motion.button
                  type="button"
                  disabled={
                    safePage === 1 ||
                    loading
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
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (
                  <motion.button
                    key={page}
                    type="button"
                    disabled={loading}
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
                      safePage ===
                      page
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
                      totalPages ||
                    loading
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

      {/* =====================================================
          ACTION POPUP
          RENDERED DIRECTLY INTO BODY
          ===================================================== */}

      {typeof document !==
        "undefined" &&
        createPortal(
          <AnimatePresence>
            {openMenu && (
              <motion.div
                id="invoice-action-menu"
                key="invoice-action-menu"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) =>
                  e.stopPropagation()
                }
                style={{
                  position: "fixed",
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                  zIndex: 999999,
                }}
                className="w-40 rounded-lg border border-gray-100 bg-white p-1.5 text-left shadow-2xl"
              >
                {/* VIEW */}

                <motion.button
                  type="button"
                  whileHover={{
                    x: 2,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    handleViewInvoice(
                      openMenu
                    );
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                >
                  <Eye size={13} />

                  <span>
                    View
                  </span>
                </motion.button>

                {/* EDIT */}

                <motion.button
                  type="button"
                  whileHover={{
                    x: 2,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    handleEditInvoice(
                      openMenu
                    );
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 transition hover:bg-violet-50 hover:text-violet-600"
                >
                  <Pencil size={13} />

                  <span>
                    Edit
                  </span>
                </motion.button>

                {/* DELETE */}

                <motion.button
                  type="button"
                  whileHover={{
                    x: 2,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    handleDeleteInvoice(
                      activeInvoice
                    );
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={13} />

                  <span>
                    Delete
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* =====================================================
          DELETE CONFIRMATION POPUP
          RENDERED DIRECTLY INTO BODY
          ===================================================== */}

      {typeof document !==
        "undefined" &&
        createPortal(
          <AnimatePresence>
            {deleteTarget && (
              <motion.div
                key="delete-modal"
                variants={
                  deleteModalVariants
                }
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={
                  handleCloseDeletePopup
                }
                className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
              >
                <motion.div
                  variants={
                    deleteDialogVariants
                  }
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                  className="w-full max-w-[390px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
                >
                  {/* HEADER */}

                  <div className="flex items-start justify-between px-5 pt-5">
                    <div className="flex items-center gap-3">
                      <motion.div
                        initial={{
                          scale: 0.8,
                          opacity: 0,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        transition={{
                          delay: 0.08,
                          duration: 0.2,
                        }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50"
                      >
                        <AlertTriangle
                          size={19}
                          className="text-red-500"
                        />
                      </motion.div>

                      <div>
                        <h3 className="text-[14px] font-bold text-gray-900">
                          Delete Invoice?
                        </h3>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        deleteLoading
                      }
                      onClick={
                        handleCloseDeletePopup
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* CONTENT */}

                  <div className="px-5 pb-4 pt-4">
                    <p className="text-[12px] leading-5 text-gray-600">
                      Are you sure you want to
                      delete this invoice?
                    </p>

                    <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                      <p className="truncate text-[12px] font-semibold text-gray-800">
                        {getInvoiceNumber(
                          deleteTarget
                        )}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-gray-500">
                        {getCustomerName(
                          deleteTarget
                        )}
                      </p>
                    </div>
                  </div>

                  {/* FOOTER */}

                  <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-3.5">
                    <motion.button
                      type="button"
                      disabled={
                        deleteLoading
                      }
                      whileHover={{
                        y: -1,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={
                        handleCloseDeletePopup
                      }
                      className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      type="button"
                      disabled={
                        deleteLoading
                      }
                      whileHover={{
                        y: -1,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={
                        handleConfirmDelete
                      }
                      className="flex h-9 min-w-[112px] items-center justify-center gap-1.5 rounded-lg bg-red-500 px-4 text-[11px] font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deleteLoading ? (
                        <>
                          <motion.span
                            animate={{
                              rotate: 360,
                            }}
                            transition={{
                              duration: 0.8,
                              repeat:
                                Infinity,
                              ease: "linear",
                            }}
                            className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white"
                          />

                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2
                            size={13}
                          />

                          Delete Invoice
                        </>
                      )}
                    </motion.button>
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

export default Invoices;