const fs = require("fs");
const path = require("path");

const logoPath = path.join(
    __dirname,
    "../assets/web_logo.png"
);

const logoBase64 = fs
    .readFileSync(logoPath)
    .toString("base64");

const logoSrc = `data:image/png;base64,${logoBase64}`;
const invoiceTemplate = (invoice) => {
    const customer = invoice?.customer || invoice?.user || {};

    const customerName =
        customer?.name ||
        `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() ||
        invoice?.fullName ||
        "N/A";

    const customerEmail =
        customer?.email ||
        invoice?.email ||
        "N/A";

    const customerPhone =
        customer?.phone ||
        invoice?.phone ||
        "N/A";

    const invoiceDate = invoice?.createdAt
        ? new Date(invoice.createdAt).toLocaleDateString("en-GB")
        : new Date().toLocaleDateString("en-GB");

    const invoiceNumber =
        invoice?.invoiceNumber ||
        invoice?.invoiceNo ||
        invoice?._id ||
        "N/A";

    const conferenceTitle =
        invoice?.conference?.title ||
        invoice?.conference?.name ||
        invoice?.conferenceTitle ||
        "Conference Registration";

    const registrationType =
        invoice?.registration?.option ||
        invoice?.registration?.category ||
        invoice?.registrationType ||
        "Online Registration";

    const amount =
        Number(
            invoice?.registration?.price ??
            invoice?.price ??
            invoice?.amount ??
            invoice?.totalAmount ??
            0
        ) || 0;

    const tax =
        Number(invoice?.tax ?? invoice?.taxAmount ?? 0) || 0;

    const currency =
        invoice?.currency ||
        invoice?.registration?.currency ||
        "USD";

    const currencySymbol =
        currency === "GBP"
            ? "£"
            : currency === "EUR"
                ? "€"
                : currency === "INR"
                    ? "₹"
                    : "$";

    const subtotal = amount;
    const total = subtotal + tax;

    const formatAmount = (value) => {
        return `${currencySymbol} ${Number(value || 0).toFixed(2)}`;
    };

    const formatTableAmount = (value) => {
        return `${currencySymbol}${Number(value || 0).toFixed(2)}`;
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <title>GlobalScion Invoice</title>

  <style>

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
    }

    @page {
      size: A4;
      margin: 0;
    }

    body {
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
    }

    .invoice-paper {
      position: relative;
      width: 210mm;
      min-height: 297mm;
      padding: 12mm;
      background: #ffffff;
      overflow: hidden;
    }

    .watermark {
      position: absolute;
      left: 50%;
      top: 52%;
      transform: translate(-50%, -50%) rotate(-32deg);
      z-index: 0;
      white-space: nowrap;
      text-align: center;
      user-select: none;
      font-size: 78px;
      line-height: 1;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #ede9fe;
      pointer-events: none;
    }

    .watermark span {
      display: block;
      margin-top: 8px;
      font-size: 40px;
      letter-spacing: 2px;
    }

    .content {
      position: relative;
      z-index: 2;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }

    .logo-wrapper {
      width: 55%;
    }

    .logo {
      width: 230px;
      height: auto;
      object-fit: contain;
    }

    .invoice-header-right {
      width: 45%;
      text-align: right;
    }

    .invoice-title {
      margin: 0;
      color: #7c3aed;
      font-size: 34px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .invoice-number {
      margin-top: 8px;
      font-size: 11px;
      color: #6b7280;
    }

    .date-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 6px;
      margin-top: 12px;
      font-size: 12px;
      color: #374151;
    }

    .header-line {
      width: 100%;
      height: 3px;
      margin-top: 18px;
      background: #7c3aed;
    }

    .company-section {
      margin-top: 18px;
    }

    .company-name {
      margin: 0 0 8px;
      font-size: 17px;
      font-weight: 700;
      color: #111827;
    }

    .company-detail {
      margin: 4px 0;
      font-size: 11px;
      line-height: 1.5;
      color: #374151;
    }

    .company-line {
      width: 100%;
      height: 2px;
      margin-top: 15px;
      background: #7c3aed;
    }

    .customer-box {
      margin-top: 20px;
      border: 1px solid #c4b5fd;
      padding: 14px 16px;
      background: #ffffff;
    }

    .customer-heading {
      margin-bottom: 10px;
      font-size: 12px;
      font-weight: 800;
      color: #7c3aed;
      text-transform: uppercase;
    }

    .customer-row {
      display: flex;
      margin: 5px 0;
      font-size: 11px;
      line-height: 1.5;
    }

    .customer-label {
      width: 125px;
      font-weight: 600;
      color: #374151;
    }

    .customer-value {
      flex: 1;
      color: #111827;
    }

    .items-section {
      margin-top: 22px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #a78bfa;
      table-layout: fixed;
    }

    .items-table th {
      padding: 10px 8px;
      background: #7c3aed;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      text-align: left;
      border-right: 1px solid #a78bfa;
    }

    .items-table th:last-child {
      border-right: none;
    }

    .items-table td {
      padding: 11px 8px;
      min-height: 42px;
      font-size: 11px;
      color: #111827;
      vertical-align: top;
      border-top: 1px solid #c4b5fd;
      border-right: 1px solid #c4b5fd;
      line-height: 1.45;
    }

    .items-table td:last-child {
      border-right: none;
    }

    .serial-column {
      width: 9%;
      text-align: center;
    }

    .description-column {
      width: 73%;
    }

    .price-column {
      width: 18%;
      text-align: right;
    }

    .empty-row td {
      height: 34px;
    }

    .bottom-section {
      display: grid;
      grid-template-columns: 1fr 270px;
      gap: 30px;
      margin-top: 30px;
      align-items: start;
    }

    .account-title {
      margin: 0 0 12px;
      color: #111827;
      font-size: 13px;
      font-weight: 800;
    }

    .account-row {
      display: flex;
      margin: 5px 0;
      font-size: 10.5px;
      line-height: 1.5;
    }

    .account-label {
      width: 115px;
      font-weight: 700;
      color: #374151;
    }

    .account-value {
      flex: 1;
      color: #111827;
    }

    .totals {
      width: 270px;
      margin-left: auto;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 11px;
    }

    .total-label {
      font-weight: 600;
      color: #374151;
    }

    .total-value {
      font-weight: 600;
      color: #111827;
    }

    .grand-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;
      padding: 12px;
      background: #7c3aed;
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
    }

    .footer-note {
      position: absolute;
      left: 12mm;
      right: 12mm;
      bottom: 8mm;
      text-align: center;
      font-size: 9px;
      color: #9ca3af;
    }

  </style>
</head>

<body>

  <div class="invoice-paper">

    <div class="watermark">
      GlobalScion
      <span>Conferences</span>
    </div>

    <div class="content">

      <div class="header">

        <div class="logo-wrapper">

          <img
  src="${logoSrc}"
  class="logo"
  alt="GlobalScion Conferences"
/>

        </div>

        <div class="invoice-header-right">

          <h1 class="invoice-title">
            INVOICE
          </h1>

          <div class="invoice-number">
            Invoice No: ${invoiceNumber}
          </div>

          <div class="date-row">

            <span>
              Date:
            </span>

            <strong>
              ${invoiceDate}
            </strong>

          </div>

        </div>

      </div>

      <div class="header-line"></div>

      <div class="company-section">

        <h2 class="company-name">
          GlobalScion Conferences
        </h2>

        <div class="company-detail">
          Email: info@globalscion.com
        </div>

        <div class="company-detail">
          Phone: +44 3308088650
        </div>

        <div class="company-detail">
          Website: www.globalscion.com
        </div>

      </div>

      <div class="company-line"></div>

      <div class="customer-box">

        <div class="customer-heading">
          TO:
        </div>

        <div class="customer-row">

          <div class="customer-label">
            Name:
          </div>

          <div class="customer-value">
            ${customerName}
          </div>

        </div>

        <div class="customer-row">

          <div class="customer-label">
            Email ID:
          </div>

          <div class="customer-value">
            ${customerEmail}
          </div>

        </div>

        <div class="customer-row">

          <div class="customer-label">
            Contact Number:
          </div>

          <div class="customer-value">
            ${customerPhone}
          </div>

        </div>

      </div>

      <div class="items-section">

        <table class="items-table">

          <thead>

            <tr>

              <th class="serial-column">
                #
              </th>

              <th class="description-column">
                Item Description
              </th>

              <th class="price-column">
                Price
              </th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td class="serial-column">
                1
              </td>

              <td class="description-column">
                ${registrationType} - ${conferenceTitle}
              </td>

              <td class="price-column">
                ${formatTableAmount(amount)}
              </td>

            </tr>

            <tr class="empty-row">

              <td></td>
              <td></td>
              <td></td>

            </tr>

          </tbody>

        </table>

      </div>

      <div class="bottom-section">

        <div>

          <h3 class="account-title">
            Account Details:
          </h3>

          <div class="account-row">

            <div class="account-label">
              Bank:
            </div>

            <div class="account-value">
              HDFC
            </div>

          </div>

          <div class="account-row">

            <div class="account-label">
              Account no:
            </div>

            <div class="account-value">
              50200113849832
            </div>

          </div>

          <div class="account-row">

            <div class="account-label">
              Account Name:
            </div>

            <div class="account-value">
              GLOBALSCION PVT LTD
            </div>

          </div>

          <div class="account-row">

            <div class="account-label">
              IFSC:
            </div>

            <div class="account-value">
              HDFC0006774
            </div>

          </div>

          <div class="account-row">

            <div class="account-label">
              Swift Code:
            </div>

            <div class="account-value">
              HDFCINBBXXX
            </div>

          </div>

        </div>

        <div class="totals">

          <div class="total-row">

            <span class="total-label">
              Sub Total
            </span>

            <span class="total-value">
              ${formatAmount(subtotal)}
            </span>

          </div>

          <div class="total-row">

            <span class="total-label">
              Tax
            </span>

            <span class="total-value">
              ${formatAmount(tax)}
            </span>

          </div>

          <div class="grand-total">

            <span>
              Total
            </span>

            <span>
              ${formatAmount(total)}
            </span>

          </div>

        </div>

      </div>

    </div>

    <div class="footer-note">
      GlobalScion Conferences • www.globalscion.com
    </div>

  </div>

</body>
</html>
`;
};

module.exports = invoiceTemplate;