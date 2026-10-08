import React, { useEffect, useMemo } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  FileText,
  CalendarDays,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  getInvoiceById,
  downloadInvoicePdf,
  selectInvoice,
  selectInvoiceLoading,
  selectInvoiceError,
  selectInvoiceDownloading,
  selectInvoiceDownloadError,
} from "../../redux/invoiceSlice";

// =========================================================
// FORMAT HELPERS
// =========================================================

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatAmount = (amount, currency = "USD") => {
  const numericAmount = Number(amount) || 0;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency} ${numericAmount.toFixed(2)}`;
  }
};

// =========================================================
// NORMALIZERS
// =========================================================

const getCustomer = (invoice) => {
  return {
    name:
      invoice?.customer?.name ||
      invoice?.customer?.fullName ||
      invoice?.customerName ||
      invoice?.fullName ||
      invoice?.name ||
      "Customer",

    email: invoice?.customer?.email || invoice?.email || "-",

    phone:
      invoice?.customer?.phone ||
      invoice?.phone ||
      invoice?.contactNumber ||
      "-",
  };
};

const getConferenceTitle = (invoice) => {
  const conference = invoice?.conference;

  if (conference && typeof conference === "object") {
    return (
      conference?.title ||
      conference?.conferenceTitle ||
      conference?.name ||
      conference?.basicInformation?.title ||
      "Conference"
    );
  }

  return (
    conference ||
    invoice?.conferenceName ||
    invoice?.conferenceTitle ||
    "Conference"
  );
};

const getItemDescription = (invoice) => {
  return (
    invoice?.registration?.description ||
    invoice?.description ||
    invoice?.itemDescription ||
    `Online Registration - ${getConferenceTitle(invoice)}`
  );
};

const getPrice = (invoice) => {
  return (
    invoice?.registration?.price ??
    invoice?.amount ??
    invoice?.totalAmount ??
    invoice?.price ??
    0
  );
};

const getTax = (invoice) => {
  return invoice?.tax ?? invoice?.taxAmount ?? 0;
};

const getCurrency = (invoice) => {
  return invoice?.currency || invoice?.currencyCode || "USD";
};

// =========================================================
// PAGE
// =========================================================

const InvoiceDetails = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // IMPORTANT:
  // Your page route should be:
  // /invoices/:invoiceId
  //
  // Example:
  // /invoices/68abc123
  const { invoiceId } = useParams();

  // =======================================================
  // REDUX
  // =======================================================

  const invoice = useSelector(selectInvoice);

  const loading = useSelector(selectInvoiceLoading);

  const error = useSelector(selectInvoiceError);

  const downloading = useSelector(selectInvoiceDownloading);

  const downloadError = useSelector(selectInvoiceDownloadError);

  // =======================================================
  // FETCH INVOICE BY ID
  // =======================================================

  useEffect(() => {
    if (!invoiceId) {
      console.error("Invoice ID is missing from URL");
      return;
    }

    dispatch(getInvoiceById(invoiceId));
  }, [dispatch, invoiceId]);

  // =======================================================
  // CALCULATIONS
  // =======================================================

  const invoiceData = useMemo(() => {
    if (!invoice) {
      return null;
    }

    const customer = getCustomer(invoice);

    const description = getItemDescription(invoice);

    const price = Number(getPrice(invoice)) || 0;

    const tax = Number(getTax(invoice)) || 0;

    const subtotal = price;

    const total = subtotal + tax;

    const currency = getCurrency(invoice);

    return {
      customer,
      description,
      price,
      tax,
      subtotal,
      total,
      currency,
    };
  }, [invoice]);

  // =======================================================
  // DOWNLOAD PDF
  // BACKEND GENERATED PDF
  // =======================================================

  const handleDownload = async () => {
    console.log("DOWNLOAD BUTTON CLICKED");

    if (!invoiceId) {
      console.error("Invoice ID is missing");
      return;
    }

    try {
      console.log("Downloading invoice PDF:", invoiceId);

      const pdfBlob = await dispatch(downloadInvoicePdf(invoiceId)).unwrap();

      console.log("PDF response received:", pdfBlob);

      if (!pdfBlob) {
        throw new Error("PDF response is empty");
      }

      const blob = new Blob([pdfBlob], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const invoiceNumber =
        invoice?.invoiceNumber ||
        invoice?.invoiceId ||
        invoice?._id ||
        invoiceId;

      link.download = `GlobalScion-Invoice-${invoiceNumber}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      console.log("Invoice PDF downloaded successfully");
    } catch (downloadError) {
      console.error("Invoice PDF download failed:", downloadError);
    }
  };

  // =======================================================
  // PRINT
  // =======================================================

  const handlePrint = () => {
    window.print();
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader2 size={34} className="animate-spin text-violet-600" />

          <p className="mt-3 text-base font-medium text-black">
            Loading invoice...
          </p>
        </div>
      </div>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (error || !invoice) {
    return (
      <div className="min-h-[70vh] bg-white px-5 py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-violet-200 bg-white p-8 text-center shadow-sm">
          <FileText size={44} className="mx-auto text-violet-500" />

          <h2 className="mt-3 text-xl font-bold text-black">
            Invoice Not Found
          </h2>

          <p className="mt-1 text-base text-black">
            {error || "Unable to find this invoice."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-violet-700"
          >
            <ArrowLeft size={17} />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  // =======================================================
  // INVOICE DATA
  // =======================================================

  const { customer, description, price, tax, subtotal, total, currency } =
    invoiceData;

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="min-h-screen bg-white px-3 py-4 sm:px-5 lg:px-6">
      {/* ===================================================
          TOP ACTION BAR
      =================================================== */}

      <div className="mx-auto mb-4 flex max-w-[1180px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-200 bg-white px-4 py-2.5 text-base font-medium text-black shadow-sm transition hover:bg-violet-50 hover:text-violet-700"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="flex items-center gap-2">
          {/* PRINT */}

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-4 py-2.5 text-base font-semibold text-black shadow-sm transition hover:bg-violet-50 hover:text-violet-700"
          >
            <Printer size={17} />
            Print
          </button>

          {/* DOWNLOAD */}

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* ===================================================
          DOWNLOAD ERROR
      =================================================== */}

      {downloadError && (
        <div className="mx-auto mb-4 max-w-[1180px] rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 print:hidden">
          {downloadError}
        </div>
      )}

      {/* ===================================================
          INVOICE PAPER
      =================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="
          invoice-paper
          relative
          mx-auto
          min-h-[1050px]
          w-full
          max-w-[1180px]
          overflow-hidden
          bg-white
          px-7
          py-7
          sm:px-10
          sm:py-8
          lg:px-[58px]
          lg:py-[42px]
        "
      >
        {/* =================================================
            WATERMARK
        ================================================= */}

        <div className="pointer-events-none absolute left-1/2 top-[52%] z-0 -translate-x-1/2 -translate-y-1/2 rotate-[-32deg] select-none whitespace-nowrap text-[78px] font-black uppercase tracking-wider text-violet-100 sm:text-[95px]">
          GlobalScion
          <span className="block text-center text-[40px] sm:text-[50px]">
            Conferences
          </span>
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-8">
            {/* LOGO */}

            <div className="flex items-center">
              <img
                src="/web_logo.png"
                alt="GlobalScion Conferences"
                className="
                  h-auto
                  w-[220px]
                  object-contain
                  sm:w-[260px]
                  lg:w-[300px]
                "
              />
            </div>

            {/* INVOICE TITLE */}

            <div className="text-right">
              <h1 className="text-[40px] font-black tracking-wide text-violet-700 sm:text-[48px]">
                INVOICE
              </h1>

              <div className="mt-2 flex items-center justify-end gap-2 text-[14px] text-black">
                <CalendarDays size={16} className="text-violet-600" />

                <span>Date:</span>

                <span className="font-semibold">
                  {formatDate(invoice?.invoiceDate || invoice?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* HEADER LINE */}

          <div className="mt-4 h-[3px] w-full bg-violet-600" />

          {/* COMPANY DETAILS */}

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 text-[14px] text-black">
              <p className="font-bold">GlobalScion Conferences</p>

              <p>
                Email:{" "}
                <span className="font-semibold text-violet-700">
                  info@globalscion.com
                </span>
              </p>

              <p>Phone: +44 3308088650</p>

              <p>Website: www.globalscion.com</p>
            </div>

            <div className="hidden sm:block" />
          </div>

          {/* SECOND LINE */}

          <div className="mt-4 h-[2px] w-full bg-violet-600" />

          {/* =================================================
              CUSTOMER BOX
          ================================================= */}

          {/* =================================================
    CUSTOMER BOX
================================================= */}

          <div className="mt-3 border border-violet-300 bg-white px-4 py-3">
            <p className="text-[13px] font-semibold uppercase text-black">
              TO:
            </p>

            <div className="mt-2 space-y-2 text-[14px] text-black">
              {/* NAME */}

              <p>
                <span className="font-semibold">Name:</span> {customer.name}
              </p>

              {/* AFFILIATION */}

              <p>
                <span className="font-semibold">Affiliation:</span>{" "}
                {invoice?.customer?.affiliation || "-"}
              </p>

              {/* EMAIL */}

              <p>
                <span className="font-semibold">Email ID:</span>{" "}
                {customer.email}
              </p>

              {/* CONTACT NUMBER */}

              <p>
                <span className="font-semibold">Contact Number:</span>{" "}
                {customer.phone}
              </p>
            </div>
          </div>

          {/* =================================================
              ITEM TABLE
          ================================================= */}

          <div className="mt-7 overflow-hidden border border-violet-400">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-violet-600 text-white">
                  <th className="w-[9%] border-r border-violet-300 px-3 py-3.5 text-center text-[14px] font-bold">
                    Item
                  </th>

                  <th className="border-r border-violet-300 px-4 py-3.5 text-left text-[14px] font-bold">
                    Description
                  </th>

                  <th className="w-[18%] px-3 py-3.5 text-center text-[14px] font-bold">
                    Price
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="min-h-[72px]">
                  <td className="border-r border-t border-violet-300 px-3 py-5 text-center text-[14px] text-black">
                    1
                  </td>

                  <td className="border-r border-t border-violet-300 px-4 py-5 text-center text-[15px] font-bold text-black">
                    {description}
                  </td>

                  <td className="border-t border-violet-300 px-3 py-5 text-center text-[14px] font-semibold text-black">
                    {formatAmount(price, currency)}
                  </td>
                </tr>

                {/* EMPTY ROW */}

                <tr>
                  <td className="h-7 border-r border-t border-violet-300" />

                  <td className="border-r border-t border-violet-300" />

                  <td className="border-t border-violet-300" />
                </tr>
              </tbody>
            </table>
          </div>

          {/* =================================================
              BOTTOM SECTION
          ================================================= */}

          <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-[1fr_270px]">
            {/* ACCOUNT DETAILS */}

            <div>
              <h3 className="text-[18px] font-bold text-violet-600">
                Account Details:
              </h3>

              <ul className="mt-2 space-y-1.5 text-[13px] text-black">
                <li className="flex gap-1.5">
                  <span>▪</span>

                  <span>Bank: {invoice?.accountDetails?.bank || "HDFC"}</span>
                </li>

                <li className="flex gap-1.5">
                  <span>▪</span>

                  <span>
                    Account no:{" "}
                    {invoice?.accountDetails?.accountNo || "50200113849832"}
                  </span>
                </li>

                <li className="flex gap-1.5">
                  <span>▪</span>

                  <span>
                    Account Name:{" "}
                    {invoice?.accountDetails?.accountName ||
                      "GLOBALSCION PVT LTD"}
                  </span>
                </li>

                <li className="flex gap-1.5">
                  <span>▪</span>

                  <span>
                    IFSC: {invoice?.accountDetails?.ifsc || "HDFC0006774"}
                  </span>
                </li>

                <li className="flex gap-1.5">
                  <span>▪</span>

                  <span>
                    Swift Code:{" "}
                    {invoice?.accountDetails?.swiftCode || "HDFCINBBXXX"}
                  </span>
                </li>
              </ul>
            </div>

            {/* TOTALS */}

            <div className="space-y-2 text-[14px]">
              <div className="flex items-center justify-between gap-5">
                <span className="font-bold text-black">Sub Total</span>

                <span className="font-semibold text-black">
                  {formatAmount(subtotal, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-5">
                <span className="font-bold text-black">Tax</span>

                <span className="font-semibold text-black">
                  {formatAmount(tax, currency)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-5 bg-violet-600 px-3 py-2.5 text-white">
                <span className="font-bold">Total</span>

                <span className="font-bold">
                  {formatAmount(total, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          PRINT CSS
      ===================================================== */}

      <style>{`
        @media print {

          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body {
            overflow: hidden !important;
          }

          body * {
            visibility: hidden;
          }

          .invoice-paper,
          .invoice-paper * {
            visibility: visible;
          }

          .invoice-paper {
            position: absolute;

            left: 0;
            top: 0;

            width: 210mm !important;

            min-height: 297mm !important;

            max-width: none !important;

            margin: 0 !important;

            padding: 12mm !important;

            box-shadow: none !important;

            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceDetails;
