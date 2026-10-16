
const fs = require("fs");
const path = require("path");

// ------------------------------------------------------------
// GlobalScion Invoice Template
// Logo-only diagonal watermark.
// Watermark direction: bottom-left to top-right.
// ------------------------------------------------------------

const logoPath = path.join(__dirname, "../assets/web_logo.png");

const logoBase64 = fs.readFileSync(logoPath).toString("base64");
const logoSrc = `data:image/png;base64,${logoBase64}`;

const invoiceTemplate = (invoice) => {
  const customer = invoice?.customer || invoice?.user || {};

  const customerName =
    customer?.fullName ||
    invoice?.fullName ||
    "N/A";

  const customerEmail =
    customer?.email ||
    invoice?.email ||
    "N/A";

  const customerPhone =
    customer?.phone ||
    invoice?.phone ||
    "";

  const affiliation =
    customer?.affiliation ||
    invoice?.affiliation ||
    "";

  const city =
    customer?.city ||
    invoice?.city ||
    "";

  const country =
    customer?.country ||
    invoice?.country ||
    "";

  const locationText = [city, country]
    .filter(Boolean)
    .join(", ");

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

  // Exact description from invoice. No automatic text is added.
  const description = invoice?.description || "";

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

  const formatAmount = (value) =>
    `${currencySymbol} ${Number(value || 0).toFixed(2)}`;

  const formatTableAmount = (value) =>
    `${currencySymbol}${Number(value || 0).toFixed(2)}`;

  const affiliationText = affiliation ? affiliation : "";

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
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111111;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    @page {
      size: A4;
      margin: 0;
    }

    /* ========================================================
       MAIN A4 PAPER
       ======================================================== */

    .invoice-paper {
      position: relative;
      width: 210mm;
      height: 297mm;
      min-height: 297mm;
      padding: 13.5mm 15.5mm 12mm;
      overflow: hidden;
      background: #ffffff;
    }

    /* ========================================================
       LOGO-ONLY DIAGONAL WATERMARK
       Updated: full logo fit, bottom-left to top-right
       ======================================================== */

    .watermark {
      position: absolute;
      left: 50%;
      top: 50%;

      width: 135mm;
      height: 135mm;

      transform: translate(-50%, -50%) rotate(-38deg);
      transform-origin: center center;

      opacity: 0.14;
      z-index: 1;

      pointer-events: none;
      user-select: none;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .watermark-logo {
      display: block;
      width: 100%;
      height: 100%;

      max-width: 100%;
      max-height: 100%;

      object-fit: contain;
      object-position: center;

      opacity: 1;
    }

    /* ========================================================
       CONTENT
       ======================================================== */

    .content {
      position: relative;
      z-index: 2;
    }

    /* ========================================================
       HEADER
       ======================================================== */

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      height: 25mm;
    }

    .logo-wrapper {
      width: 57%;
      padding-top: 0;
    }

    .logo {
      display: block;
      width: 72mm;
      height: auto;
      max-height: 25mm;
      object-fit: contain;
      object-position: left center;
    }

    .invoice-header-right {
      width: 43%;
      text-align: right;
      padding-top: 0;
    }

    .invoice-title {
      margin: 0;
      color: #173a63;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 27px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: 0.3px;
    }

    .invoice-number {
      display: none;
    }

    .date-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 5px;
      margin-top: 14px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5px;
      color: #111111;
    }

    .date-row strong {
      font-weight: 400;
    }

    .header-line {
      width: 100%;
      height: 2px;
      margin-top: 1mm;
      background: #111111;
    }

    /* ========================================================
       COMPANY INFORMATION
       ======================================================== */

    .company-section {
      margin-top: 4mm;
      margin-left: 2mm;
      font-family: "Segoe Print", "Comic Sans MS", cursive;
    }

    .company-name {
      margin: 0 0 1.5mm;
      font-size: 12px;
      line-height: 1.2;
      font-weight: 400;
      color: #111111;
    }

    .company-detail {
      margin: 1.2mm 0;
      font-size: 10.5px;
      line-height: 1.25;
      color: #111111;
    }

    .company-detail.email {
      color: #0000ee;
      text-decoration: underline;
    }

    .company-line {
      width: 100%;
      height: 1.5px;
      margin-top: 3.5mm;
      background: #111111;
    }

    /* ========================================================
       CUSTOMER BOX
       ======================================================== */

    .customer-box {
      margin-top: 0.7mm;
      min-height: 28.5mm;
      border: 1px solid #444444;
      padding: 1.2mm 1.6mm 1.8mm;
      background: transparent;
      font-family: "Segoe Print", "Comic Sans MS", cursive;
    }

    .customer-heading {
      margin-bottom: 1.7mm;
      font-size: 10.5px;
      line-height: 1;
      font-weight: 400;
      color: #111111;
      text-transform: uppercase;
    }

    .customer-row {
      display: flex;
      margin: 1.9mm 0;
      font-size: 10.5px;
      line-height: 1.15;
      color: #111111;
    }

    .customer-label {
      flex: 0 0 auto;
      margin-right: 2px;
      font-weight: 400;
      color: #111111;
    }

    .customer-value {
      flex: 1;
      color: #111111;
    }

    .customer-value.email {
      color: #111111;
    }

    /* ========================================================
       ITEMS TABLE
       ======================================================== */

    .items-section {
      margin-top: 3.2mm;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #3e4f61;
      table-layout: fixed;
      background: #ffffff;
    }

    .items-table th {
      height: 13mm;
      padding: 2.5mm 2mm;
      background: #4f81bd;
      color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      font-weight: 700;
      text-align: center;
      vertical-align: middle;
      border-right: 1px solid #3e4f61;
    }

    .items-table th:last-child {
      border-right: none;
    }

    .items-table td {
      height: 27mm;
      padding: 2.5mm 2mm;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10px;
      color: #111111;
      vertical-align: middle;
      border-top: 1px solid #555555;
      border-right: 1px solid #555555;
      line-height: 1.35;
    }

    .items-table td:last-child {
      border-right: none;
    }

    .serial-column {
      width: 7.5%;
      text-align: center !important;
    }

    .description-column {
      width: 74%;
      text-align: center !important;
    }

    .price-column {
      width: 18.5%;
      text-align: center !important;
    }

    .description-value {
      display: block;
      max-width: 125mm;
      margin: 0 auto;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.35;
      text-align: center;
    }

    .price-value {
      font-size: 10px;
      font-weight: 400;
    }

    .empty-row td {
      height: 8.5mm;
      padding: 0;
    }

    /* ========================================================
       BOTTOM SECTION
       ======================================================== */

    .bottom-section {
      display: grid;
      grid-template-columns: 1fr 42mm;
      gap: 8mm;
      margin-top: 10mm;
      align-items: start;
    }

    /* ========================================================
       ACCOUNT DETAILS
       ======================================================== */

    .account-title {
      margin: 0 0 3mm;
      color: #ff3366;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1;
      font-weight: 800;
    }

    .account-row {
      display: flex;
      margin: 1mm 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5px;
      line-height: 1.2;
      color: #111111;
    }

    .account-row::before {
      content: "▪";
      margin-right: 2.5mm;
      font-size: 9px;
    }

    .account-label {
      width: auto;
      min-width: 23mm;
      font-weight: 400;
      color: #111111;
    }

    .account-value {
      flex: 1;
      color: #111111;
    }

    /* ========================================================
       TOTALS
       ======================================================== */

    .totals {
      width: 42mm;
      margin-left: auto;
      padding-top: 0;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1mm 1.8mm;
      margin-bottom: 1.2mm;
      border-bottom: none;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5px;
      line-height: 1;
    }

    .total-label,
    .total-value {
      color: #111111;
      font-weight: 700;
    }

    .grand-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 42mm;
      min-height: 9.5mm;
      margin-top: 2.5mm;
      padding: 2mm 2.5mm;
      background: #8064a2;
      color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10px;
      font-weight: 700;
      border: 2px solid #eee9f2;
      box-shadow: 0 0 0 1px #d8d8d8;
    }

    /* ========================================================
       FOOTER
       ======================================================== */

    .footer-note {
      display: none;
    }

    /* ========================================================
       PRINT SETTINGS
       ======================================================== */

    @media print {
      html,
      body {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 0;
        background: #ffffff;
      }

      .invoice-paper {
        width: 210mm;
        height: 297mm;
        min-height: 297mm;
        margin: 0;
        overflow: hidden;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Same watermark settings for print/PDF */
      .watermark {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 135mm;
        height: 135mm;
        transform: translate(-50%, -50%) rotate(-38deg);
        transform-origin: center center;
        opacity: 0.14;
        z-index: 1;
        pointer-events: none;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .watermark-logo {
        display: block;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        object-position: center;
        opacity: 1;
      }

      .content {
        position: relative;
        z-index: 2;
      }
    }
  </style>
</head>

<body>
  <div class="invoice-paper">

    <!-- LOGO-ONLY DIAGONAL WATERMARK -->
    <div class="watermark">
      <img
        src="${logoSrc}"
        class="watermark-logo"
        alt=""
      />
    </div>

    <!-- CONTENT -->
    <div class="content">

      <!-- HEADER -->
      <div class="header">
        <div class="logo-wrapper">
          <img
            src="${logoSrc}"
            class="logo"
            alt="GlobalScion Conferences"
          />
        </div>

        <div class="invoice-header-right">
          <h1 class="invoice-title">INVOICE</h1>

          <div class="invoice-number">
            Invoice No: ${invoiceNumber}
          </div>

          <div class="date-row">
            <span>Date:</span>
            <strong>${invoiceDate}</strong>
          </div>
        </div>
      </div>

      <!-- HEADER DIVIDER -->
      <div class="header-line"></div>

      <!-- COMPANY INFORMATION -->
      <div class="company-section">
        <div class="company-name">
          GlobalScion Conferences
        </div>

        <div class="company-detail email">
          Email: info@globalscion.com
        </div>

        <div class="company-detail">
          Phone: +44 3308088650
        </div>

        <div class="company-detail">
          Website: www.globalscion.com
        </div>
      </div>

      <!-- COMPANY DIVIDER -->
      <div class="company-line"></div>

      <!-- CUSTOMER INFORMATION -->
      <div class="customer-box">
        <div class="customer-heading">TO:</div>

        <div class="customer-row">
          <div class="customer-label">Name:</div>
          <div class="customer-value">${customerName}</div>
        </div>

        ${
          affiliationText
            ? `
        <div class="customer-row">
          <div class="customer-label">Affiliation:</div>
          <div class="customer-value">${affiliationText}</div>
        </div>
        `
            : ""
        }

        ${
          locationText
            ? `
        <div class="customer-row">
          <div class="customer-value">${locationText}</div>
        </div>
        `
            : ""
        }

        <div class="customer-row">
          <div class="customer-label">Email ID:</div>
          <div class="customer-value email">${customerEmail}</div>
        </div>
      </div>

      <!-- ITEMS -->
      <div class="items-section">
        <table class="items-table">
          <thead>
            <tr>
              <th class="serial-column">Item</th>
              <th class="description-column">Description</th>
              <th class="price-column">Price</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="serial-column">1</td>

              <td class="description-column">
                <span class="description-value">${description}</span>
              </td>

              <td class="price-column">
                <span class="price-value">
                  ${formatTableAmount(amount)}
                </span>
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

      <!-- ACCOUNT DETAILS + TOTALS -->
      <div class="bottom-section">

        <!-- ACCOUNT DETAILS -->
        <div>
          <h3 class="account-title">Account Details:</h3>

          <div class="account-row">
            <div class="account-label">Bank:</div>
            <div class="account-value">HDFC</div>
          </div>

          <div class="account-row">
            <div class="account-label">Account no:</div>
            <div class="account-value">50200113849832</div>
          </div>

          <div class="account-row">
            <div class="account-label">Account Name:</div>
            <div class="account-value">GLOBALSCION PVT LTD</div>
          </div>

          <div class="account-row">
            <div class="account-label">IFSC:</div>
            <div class="account-value">HDFC0006774</div>
          </div>

          <div class="account-row">
            <div class="account-label">Swift Code:</div>
            <div class="account-value">HDFCINBBXXX</div>
          </div>
        </div>

        <!-- TOTALS -->
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Sub Total</span>
            <span class="total-value">${formatAmount(subtotal)}</span>
          </div>

          <div class="total-row">
            <span class="total-label">Tax</span>
            <span class="total-value">${formatAmount(tax)}</span>
          </div>

          <div class="grand-total">
            <span>Total</span>
            <span>${formatAmount(total)}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</body>
</html>
`;
};

module.exports = invoiceTemplate;
