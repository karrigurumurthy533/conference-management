import React, { useState } from "react";
import {
  IndianRupee,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

const Payments = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const payments = [
    {
      id: "PAY-1001",
      attendee: "Rahul Kumar",
      conference: "Mental Health & Psychiatry",
      date: "Sep 12, 2026",
      amount: 149,
      currency: "USD",
      method: "Card",
      status: "Paid",
    },
    {
      id: "PAY-1002",
      attendee: "Priya Sharma",
      conference: "Endocrine & Metabolic Innovation",
      date: "Sep 14, 2026",
      amount: 129,
      currency: "USD",
      method: "UPI",
      status: "Paid",
    },
    {
      id: "PAY-1003",
      attendee: "Arjun Reddy",
      conference: "Food, Nutrition & Wellness",
      date: "Sep 15, 2026",
      amount: 99,
      currency: "USD",
      method: "Card",
      status: "Pending",
    },
    {
      id: "PAY-1004",
      attendee: "Sneha Patel",
      conference: "Oncology Research & AI Innovations",
      date: "Sep 16, 2026",
      amount: 199,
      currency: "USD",
      method: "Net Banking",
      status: "Paid",
    },
    {
      id: "PAY-1005",
      attendee: "Vikram Singh",
      conference: "Healthcare Innovation & Precision Medicine",
      date: "Sep 18, 2026",
      amount: 149,
      currency: "USD",
      method: "Card",
      status: "Failed",
    },
    {
      id: "PAY-1006",
      attendee: "Ananya Rao",
      conference: "Autism Research & Innovations",
      date: "Sep 19, 2026",
      amount: 119,
      currency: "USD",
      method: "UPI",
      status: "Paid",
    },
    {
      id: "PAY-1007",
      attendee: "Kiran Kumar",
      conference: "Heart & Cardiovascular Diseases",
      date: "Sep 20, 2026",
      amount: 159,
      currency: "USD",
      method: "Card",
      status: "Paid",
    },
    {
      id: "PAY-1008",
      attendee: "Meena Devi",
      conference: "AI & Digital Psychiatry",
      date: "Sep 21, 2026",
      amount: 89,
      currency: "USD",
      method: "UPI",
      status: "Pending",
    },
    {
      id: "PAY-1009",
      attendee: "Suresh Babu",
      conference: "Nutrition & Wellness Summit",
      date: "Sep 22, 2026",
      amount: 109,
      currency: "USD",
      method: "Card",
      status: "Paid",
    },
  ];

  const paidPayments = payments.filter(
    (payment) => payment.status === "Paid"
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending"
  );

  const failedPayments = payments.filter(
    (payment) => payment.status === "Failed"
  );

  const totalRevenue = paidPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const filteredPayments = payments.filter((payment) => {
    const value = search.toLowerCase();

    return (
      payment.id.toLowerCase().includes(value) ||
      payment.attendee.toLowerCase().includes(value) ||
      payment.conference.toLowerCase().includes(value) ||
      payment.method.toLowerCase().includes(value)
    );
  });

  const itemsPerPage = 6;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / itemsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const currentPayments = filteredPayments.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-violet-50 text-violet-600";

      case "Pending":
        return "bg-violet-50 text-violet-600";

      case "Failed":
        return "bg-violet-50 text-violet-600";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="w-full overflow-hidden"
    >
      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL REVENUE */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0,
          }}
          whileHover={{
            y: -2,
          }}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Total Revenue
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                ${totalRevenue.toLocaleString()}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <IndianRupee
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>

        {/* PAID */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.06,
          }}
          whileHover={{
            y: -2,
          }}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Successful Payments
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {paidPayments.length}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <CheckCircle2
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>

        {/* PENDING */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.12,
          }}
          whileHover={{
            y: -2,
          }}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Pending Payments
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {pendingPayments.length}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <Clock3
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>

        {/* FAILED */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.18,
          }}
          whileHover={{
            y: -2,
          }}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-gray-500">
                Failed Payments
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {failedPayments.length}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <XCircle
                size={18}
                className="text-violet-600"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          PAYMENT TABLE
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.12,
        }}
        className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
      >
        {/* TABLE HEADER */}

        <div className="flex flex-col gap-2.5 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <motion.div
            initial={{
              opacity: 0,
              x: -8,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 0.2,
            }}
          >
            <h2 className="text-[15px] font-semibold text-gray-900">
              Payment Transactions
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Monitor conference payment activity
            </p>
          </motion.div>

          {/* SEARCH */}

          <motion.div
            initial={{
              opacity: 0,
              x: 8,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 0.22,
            }}
            className="relative w-full sm:w-[230px]"
          >
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
          </motion.div>
        </div>

        {/* TABLE */}

        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">

                <th className="w-[12%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Payment ID
                </th>

                <th className="w-[17%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Attendee
                </th>

                <th className="w-[25%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Conference
                </th>

                <th className="w-[12%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="w-[11%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                <th className="w-[11%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Method
                </th>

                <th className="w-[12%] px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>
              {currentPayments.length > 0 ? (
                currentPayments.map(
                  (payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.28,
                        delay: index * 0.04,
                      }}
                      whileHover={{
                        backgroundColor:
                          "rgba(139, 92, 246, 0.035)",
                      }}
                      className="border-b border-gray-100 last:border-0"
                    >

                      {/* ID */}

                      <td className="px-3 py-3">
                        <span className="text-[11px] font-semibold text-violet-600">
                          {payment.id}
                        </span>
                      </td>

                      {/* ATTENDEE */}

                      <td className="px-3 py-3">
                        <p className="truncate text-[12px] font-semibold text-gray-800">
                          {payment.attendee}
                        </p>
                      </td>

                      {/* CONFERENCE */}

                      <td className="px-3 py-3">
                        <p className="truncate text-[11px] text-gray-600">
                          {payment.conference}
                        </p>
                      </td>

                      {/* DATE */}

                      <td className="px-3 py-3 text-[11px] text-gray-500">
                        {payment.date}
                      </td>

                      {/* AMOUNT */}

                      <td className="px-3 py-3">
                        <span className="text-[12px] font-semibold text-gray-800">
                          ${payment.amount}
                        </span>
                      </td>

                      {/* METHOD */}

                      <td className="px-3 py-3">
                        <span className="text-[11px] text-gray-600">
                          {payment.method}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                    </motion.tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center"
                  >
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="text-[13px] font-medium text-gray-500"
                    >
                      No payment transactions found.
                    </motion.p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.25,
          }}
          className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5"
        >

          <p className="text-[11px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredPayments.length === 0
                ? 0
                : (safePage - 1) *
                    itemsPerPage +
                  1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                safePage * itemsPerPage,
                filteredPayments.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {filteredPayments.length}
            </span>
          </p>

          <div className="flex items-center gap-1">

            {/* PREVIOUS */}

            <motion.button
              type="button"
              whileTap={{
                scale: 0.9,
              }}
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.max(1, prev - 1)
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </motion.button>

            {/* PAGE NUMBERS */}

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <motion.button
                key={page}
                type="button"
                whileTap={{
                  scale: 0.9,
                }}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-semibold transition ${
                  safePage === page
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:text-violet-600"
                }`}
              >
                {page}
              </motion.button>
            ))}

            {/* NEXT */}

            <motion.button
              type="button"
              whileTap={{
                scale: 0.9,
              }}
              disabled={
                safePage === totalPages
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    totalPages,
                    prev + 1
                  )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </motion.button>

          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Payments;