
const fs = require("fs");
const path = require("path");

const logo =
  "data:image/png;base64," +
  fs
    .readFileSync(path.join(__dirname, "../assets/web_logo.png"))
    .toString("base64");

const e = (v) =>
  String(v == null ? "" : v).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]
  );

const date = (v) => {
  if (!v) return "-";

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return e(v);

  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-GB", {
    month: "long",
  });
  const year = d.getFullYear();

  const suffix =
    day !== "11" && day.endsWith("1")
      ? "st"
      : day !== "12" && day.endsWith("2")
      ? "nd"
      : day !== "13" && day.endsWith("3")
      ? "rd"
      : "th";

  return `${day}${suffix} ${month}, ${year}`;
};

const currencyLabels = {
  EUR: "Euro",
  GBP: "Pound Sterling",
  USD: "US Dollar",
  INR: "Indian Rupee",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
};

const money = (amount, currency) => {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  } catch {
    return `${currency || "USD"} ${Number(amount || 0).toFixed(2)}`;
  }
};

const address = (title, p = {}) => `
  <table class="address-table">
    <thead>
      <tr>
        <th colspan="2">${e(title)}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="address-label">Name:</td>
        <td>${e(p.name || "-")}</td>
      </tr>
      <tr>
        <td class="address-label">Address:</td>
        <td>${e(p.address || "-")}</td>
      </tr>
      <tr>
        <td class="address-label">Country:</td>
        <td>${e(p.country || "-")}</td>
      </tr>
      <tr>
        <td class="address-label">Phone:</td>
        <td>${e(
          `${p.countryCode || ""} ${p.phone || ""}`.trim() || "-"
        )}</td>
      </tr>
      <tr>
        <td class="address-label">E-Mail:</td>
        <td>${
          p.email
            ? `<a href="mailto:${e(p.email)}">${e(p.email)}</a>`
            : "-"
        }</td>
      </tr>
    </tbody>
  </table>
`;

module.exports = function paymentReceiptTemplate(r) {
  r = r || {};

  const b = r.billing || {};
  const s = r.shipping || {};
  const items = Array.isArray(r.items) ? r.items : [];

  const totals =
    r.totals instanceof Map
      ? Object.fromEntries(r.totals)
      : r.totals || {};

  const rows = items
    .map(
      (x, i) => `
        <tr>
          <td class="serial">${i + 1}.</td>
          <td class="description">${e(x.description || "-")}</td>
          <td class="currency">${e(
            currencyLabels[x.currency] || x.currency || "-"
          )}</td>
          <td class="amount">${e(
            Number(x.amount || 0).toLocaleString("en-GB", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })
          )}</td>
        </tr>
      `
    )
    .join("");

  const sum = Object.entries(totals)
    .map(
      ([currency, amount]) => `
        <p>
          <strong>Total (${e(currency)}): ${e(
            money(amount, currency)
          )}</strong>
        </p>
      `
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Payment Receipt</title>

<style>
  * {
    box-sizing: border-box;
  }

  @page {
    size: A4 portrait;
    margin: 5mm;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    background: #ffffff;
  }

  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.25;
    color: #222222;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .paper {
    position: relative;
    isolation: isolate;
    width: 100%;
    max-width: none;
    min-height: 287mm;
    padding: 0 5mm 4mm;
    margin: 0;
    overflow: visible;
    background: #ffffff;
    display: flex;
    flex-direction: column;
  }

  /* Logo-only diagonal watermark */
  .paper::before {
    content: "";
    position: absolute;
    z-index: 0;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 70%;
    transform: translate(-50%, -50%) rotate(-30deg);
    transform-origin: center center;
    background-image: url("${logo}");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.16;
    pointer-events: none;
  }

  /* Keep receipt content above the watermark */
  .paper > * {
    position: relative;
    z-index: 1;
  }

  /* Logo at the very top-left */
  .brand {
    width: 100%;
    height: 24mm;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
  }

  .brand img {
    display: block;
    width: 55mm;
    height: auto;
    max-height: 21mm;
    margin: 0;
    padding: 0;
    object-fit: contain;
    object-position: left top;
  }

  .conference-title {
    margin: -5mm 0 2mm;
    text-align: center;
    font-size: 16pt;
    line-height: 1.2;
    font-weight: bold;
    overflow-wrap: anywhere;
  }

  .conference-date {
    min-height: 8mm;
    padding: 1.5mm 3mm;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    background: #5b9bd5;
    color: #ffffff;
    font-size: 13pt;
    font-weight: bold;
    line-height: 1.2;
  }

  .receipt-heading {
    margin: 1mm 0 0;
    padding: 0;
    text-align: center;
    color: #000000;
    font-size: 19pt;
    line-height: 1.25;
    font-weight: bold;
  }

  /* Payment information */
  .payment-information {
    display: grid;
    grid-template-columns: 60% 40%;
    column-gap: 0;
    margin-top: 3mm;
    margin-bottom: 4mm;
  }

  .payment-left,
  .payment-right {
    min-width: 0;
  }

  .info-line {
    margin: 0 0 2mm;
    font-size: 12pt;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .info-line strong {
    font-weight: bold;
  }

  .payment-right .info-line {
    margin-bottom: 2mm;
  }

  /* Billing and shipping */
  .address-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 3mm;
    align-items: stretch;
    margin-bottom: 4mm;
  }

  .address-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 11pt;
    line-height: 1.2;
  }

  .address-table th,
  .address-table td {
    border: 1px solid #555555;
    padding: 1.2mm 1.4mm;
    vertical-align: top;
    text-align: left;
    overflow-wrap: anywhere;
  }

  .address-table th {
    padding: 1.3mm;
    text-align: center;
    font-size: 12pt;
    font-weight: bold;
  }

  .address-table .address-label {
    width: 26%;
    font-weight: bold;
    white-space: nowrap;
  }

  .address-table a {
    color: #0000ee;
    text-decoration: underline;
    overflow-wrap: anywhere;
  }

  /* Items table */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin: 0;
    font-size: 12pt;
    line-height: 1.25;
  }

  .items-table th,
  .items-table td {
    border: 1px solid #666666;
    padding: 1.5mm 1.7mm;
    vertical-align: top;
    overflow-wrap: anywhere;
  }

  .items-table th {
    text-align: center;
    font-weight: bold;
    font-size: 12pt;
  }

  .items-table th:nth-child(1),
  .items-table td:nth-child(1) {
    width: 9%;
    text-align: center;
  }

  .items-table th:nth-child(2),
  .items-table td:nth-child(2) {
    width: 55%;
  }

  .items-table th:nth-child(3),
  .items-table td:nth-child(3) {
    width: 19%;
    text-align: center;
  }

  .items-table th:nth-child(4),
  .items-table td:nth-child(4) {
    width: 17%;
  }

  .items-table td.description {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .items-table td.amount {
    text-align: left;
    white-space: nowrap;
  }

  .items-table tbody tr {
    height: auto;
  }

  /* Total */
  .totals {
    margin: 0 0 1mm;
    padding: 0;
    text-align: right;
    font-size: 12pt;
    line-height: 1.2;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .totals p {
    margin: 0;
    padding: 0;
  }

  /* Additional details */
  .extra {
    margin-top: 2mm;
    padding-top: 0;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .extra h3 {
    margin: 0 0 1.5mm;
    font-size: 14pt;
    line-height: 1.2;
    font-weight: normal;
  }

  .extra ul {
    margin: 0;
    padding-left: 7mm;
  }

  .extra li {
    padding-left: 1mm;
    margin-bottom: 1mm;
    font-size: 10.5pt;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .support-email {
    display: inline-block;
    color: #5b9bd5;
    font-weight: bold;
    text-decoration: none;
    overflow-wrap: anywhere;
  }

  .footer {
    margin-top: 2mm;
    text-align: center;
    font-size: 10pt;
  }

  @media screen {
    body {
      margin: 0 auto;
    }

    .paper {
      max-width: 210mm;
      margin: 0 auto;
    }
  }

  @media print {
    @page {
      size: A4 portrait;
      margin: 5mm;
    }

    html,
    body {
      width: 100%;
      height: auto;
      min-height: 0;
      margin: 0;
      padding: 0;
    }

    .paper {
      width: 100%;
      max-width: none;
      min-height: 0;
      height: auto;
      padding: 0 5mm 3mm;
      margin: 0;
      overflow: visible;
    }

    /* Print the logo watermark only */
    .paper::before {
      top: 50%;
      left: 50%;
      width: 100%;
      height: 70%;
      transform: translate(-50%, -50%) rotate(-30deg);
      background-image: url("${logo}");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      opacity: 0.16;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .brand {
      height: 24mm;
      margin: 0;
      padding: 0;
      justify-content: flex-start;
      align-items: flex-start;
      text-align: left;
    }

    .brand img {
      margin: 0;
      object-position: left top;
    }

    header,
    .payment-information,
    .address-grid,
    .items-table,
    .totals,
    .extra {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .items-table thead {
      display: table-header-group;
    }

    .items-table tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    a {
      color: inherit;
    }
  }
</style>
</head>

<body>
<main class="paper">

  <header>
    <div class="brand">
      <img src="${logo}" alt="GlobalScion Conferences" />
    </div>

    <h1 class="conference-title">
      ${e(r.conferenceTitle || "Conference")}
    </h1>

    <div class="conference-date">
      ${e(r.conferenceDates || "")}${
        r.conferenceDates && r.conferenceMode ? " | " : ""
      }${e(r.conferenceMode || "")}
    </div>

    <h2 class="receipt-heading">PAYMENT RECEIPT</h2>
  </header>

  <section class="payment-information">
    <div class="payment-left">
      <p class="info-line">
        <strong>Receipt:</strong>
        ${e(r.receiptNumber || "-")}
      </p>

      <p class="info-line">
        <strong>Date of Payment:</strong>
        ${e(date(r.paymentDate))}
      </p>

      <p class="info-line">
        <strong>Payment Method:</strong>
        ${e(r.paymentMethod || "-")}
      </p>

      <p class="info-line">
        <strong>Transaction ID:</strong>
        ${e(r.transactionId || "-")}
      </p>
    </div>

    <div class="payment-right">
      <p class="info-line company-country">
        ${e(r.companyCountry || "United Kingdom")}
      </p>

      <p class="info-line">
        <strong>Phone:</strong>
        ${e(r.companyPhone || "-")}
      </p>

      <p class="info-line">
        <strong>Email ID:</strong>
        ${e(r.companyEmail || "-")}
      </p>
    </div>
  </section>

  <section class="address-grid">
    ${address("Billing To", b)}
    ${address("Shipping To", s)}
  </section>

  <table class="items-table">
    <thead>
      <tr>
        <th>S.No</th>
        <th>Description</th>
        <th>Currency</th>
        <th>Amount</th>
      </tr>
    </thead>

    <tbody>
      ${
        rows ||
        `<tr>
          <td class="serial">1.</td>
          <td class="description">-</td>
          <td class="currency">-</td>
          <td class="amount">0.00</td>
        </tr>`
      }
    </tbody>
  </table>

  <div class="totals">
    ${sum}
  </div>

  <section class="extra">
    <h3>Additional Details:</h3>

    <ul>
      <li>
        This is computer generated receipt. Signature is not necessary.
      </li>

      <li>
        If you have any questions or concerns with this order, please mail-to:
        <br />
        <a
          class="support-email"
          href="mailto:${e(r.supportEmail || "support@globalscion.org")}"
        >${e(r.supportEmail || "support@globalscion.org")}</a>
      </li>

      <li>
        <strong>Terms &amp; Conditions:</strong>
        ${e(
          r.terms ||
            "All online payments (through payment gateways) are accepted after our customer agrees our T&Cs"
        )}
      </li>
    </ul>
  </section>

</main>
</body>
</html>`;
};
