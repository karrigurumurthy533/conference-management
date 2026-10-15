import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Download, Edit3, Loader2, Printer, Trash2 } from "lucide-react";
import { deleteReceipt, downloadReceiptPdf, getReceiptById } from "../../redux/receiptSlice";
import "./CreateReceipt.css";

const dateText = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
};
const field = (label, value) => <p><b>{label}:</b> {value || "-"}</p>;
const money = (amount, currency) => { try { return new Intl.NumberFormat("en-GB", { style: "currency", currency: currency || "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(amount || 0)); } catch { return (currency || "USD") + " " + Number(amount || 0).toFixed(2); } };

export default function PaymentReceiptDetails() {
  const { receiptId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receipt, loading, deleting } = useSelector((state) => state.receipt || {});

  useEffect(() => { dispatch(getReceiptById(receiptId)); }, [dispatch, receiptId]);

  const remove = async () => {
    if (!window.confirm("Delete this payment receipt? This cannot be undone.")) return;
    try {
      await dispatch(deleteReceipt(receiptId)).unwrap();
      navigate("/admin/payment-receipts", { replace: true });
    } catch (error) {
      window.alert(typeof error === "string" ? error : "Unable to delete receipt.");
    }
  };
  const download = async () => {
    try {
      const result = await dispatch(downloadReceiptPdf(receiptId)).unwrap();
      const url = URL.createObjectURL(result.blob || result);
      const link = document.createElement("a");
      link.href = url;
      link.download = (receipt?.receiptNumber || "receipt") + ".pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch { window.alert("Unable to download receipt PDF."); }
  };

  if (loading && !receipt) return <div className="p-12 text-center"><Loader2 className="mx-auto animate-spin" /></div>;
  if (!receipt) return <div className="p-8 text-center">Receipt not found. <Link className="text-violet-700" to="/admin/payment-receipts">Back to receipts</Link></div>;

  const billing = receipt.billing || {};
  const shipping = receipt.shipping || {};
  const totals = receipt.totals instanceof Map ? Object.fromEntries(receipt.totals) : (receipt.totals || {});
  return <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
    <div className="no-print mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-3">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2"><ArrowLeft size={16}/> Back</button>
      <div className="flex flex-wrap gap-2">
        <Link to={"/admin/payment-receipts/" + receiptId + "/edit"} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-white"><Edit3 size={16}/> Edit</Link>
        <button onClick={download} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2"><Download size={16}/> Download PDF</button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2"><Printer size={16}/> Print</button>
        <button onClick={remove} disabled={deleting} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-700"><Trash2 size={16}/> {deleting ? "Deleting..." : "Delete"}</button>
      </div>
    </div>
    <article id="receipt-print" className="receipt-document">
      <header className="receipt-header">
        <h1 className="print-heading">{receipt.conferenceTitle}</h1>
        <p>{receipt.conferenceDates} | {receipt.conferenceMode}</p>
        <h2 className="receipt-title">PAYMENT RECEIPT</h2>
        <p><strong>Receipt:</strong> {receipt.receiptNumber}</p>
      </header>
      <div className="print-grid print-section">
        <div><h3>Organization</h3><p>{receipt.companyCountry}</p>{field("Phone", receipt.companyPhone)}{field("Email", receipt.companyEmail)}</div>
        <div><h3>Payment Information</h3>{field("Date of Payment", dateText(receipt.paymentDate))}{field("Payment Method", receipt.paymentMethod)}{field("Transaction ID", receipt.transactionId)}</div>
      </div>
      <div className="print-grid print-section">
        {[["Billing To", billing], ["Shipping To", shipping]].map(([title, person]) => <div key={title}>
          <h3>{title}</h3><p><strong>{person.name || "-"}</strong></p><p className="receipt-address">{person.address || "-"}</p>
          {field("Country", person.country)}{field("Phone", (person.countryCode || "") + " " + (person.phone || ""))}{field("Email", person.email)}
        </div>)}
      </div>
      <div className="print-section">
        <table><thead><tr><th className="receipt-col-number">S.No</th><th className="receipt-col-description">Description</th><th className="receipt-col-currency">Currency</th><th className="receipt-col-amount">Amount</th></tr></thead>
          <tbody>{(receipt.items || []).map((item, index) => <tr key={item._id || index}><td>{index + 1}</td><td className="receipt-item-description">{item.description}</td><td>{({ EUR: "Euro", GBP: "Pound Sterling", USD: "US Dollar", INR: "Indian Rupee", AUD: "Australian Dollar", CAD: "Canadian Dollar" }[item.currency] || item.currency)}</td><td className="receipt-amount">{Number(item.amount || 0).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td></tr>)}</tbody>
        </table>
        <div className="receipt-totals">{Object.entries(totals).map(([currency, amount]) => <p key={currency}><strong>Total ({currency}): {money(amount, currency)}</strong></p>)}</div>
      </div>
      <div className="print-section receipt-additional"><h3>Additional Details</h3><p>This is a computer-generated receipt. Signature is not necessary.</p><p>For questions, please email: {receipt.supportEmail || "support@globalscion.org"}</p><p>Terms &amp; Conditions: {receipt.terms || "All online payments through payment gateways are accepted after our customer agrees to our Terms and Conditions."}</p><p className="receipt-footer">GlobalScion Conferences Â· Payment Receipt</p></div>
    </article>
  </div>;
}

