
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  Printer,
  Plus,
  Trash2,
  Receipt,
  CreditCard,
  UserRound,
  MapPin,
  Mail,
  Building2,
  FileText,
  Eye,
  Save,
  X,
} from "lucide-react";

import { getConferences } from "../../redux/conferenceSlice";
import {
  createReceipt,
  getReceiptById,
  updateReceipt,
  clearReceiptError,
  clearReceiptSuccess,
} from "../../redux/receiptSlice";

import "./CreateReceipt.css";

const countries = [
  "United States",
  "United Kingdom",
  "India",
  "Australia",
  "Canada",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Ireland",
  "Singapore",
  "United Arab Emirates",
  "New Zealand",
  "South Africa",
  "Japan",
  "China",
  "Other",
];

const countryCodes = [
  { code: "+1", label: "United States / Canada (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+91", label: "India (+91)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+353", label: "Ireland (+353)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+971", label: "United Arab Emirates (+971)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+86", label: "China (+86)" },
];

const generateReceiptNumber = () => {
  const randomValues = new Uint32Array(1);
  globalThis.crypto?.getRandomValues?.(randomValues);
  const randomSuffix = String(
    randomValues[0] ? randomValues[0] % 1000 : Math.floor(Math.random() * 1000)
  ).padStart(3, "0");

  return "ICHMPSUMT27-" + Date.now() + randomSuffix;
};
const initialForm = {
  conferenceId: "",
  conferenceTitle: "",
  conferenceDates: "March 18-19, 2027",
  conferenceMode: "Webinar",

  companyCountry: "United Kingdom",
  companyPhone: "+44 3308088650",
  companyEmail: "info@globalscion.com",

  receiptNumber: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "Debit/Credit Card",
  transactionId: "",

  billingName: "",
  billingAddress: "",
  billingCountry: "United States",
  billingCountryCode: "+1",
  billingPhone: "",
  billingEmail: "",

  shippingName: "",
  shippingAddress: "",
  shippingCountry: "United States",
  shippingCountryCode: "+1",
  shippingPhone: "",
  shippingEmail: "",

  supportEmail: "support@globalscion.org",
  terms:
    "All online payments through payment gateways are accepted after our customer agrees to our Terms and Conditions.",
};

const createInitialItem = () => ({
  id: `${Date.now()}-${Math.random()}`,
  description:
    "Speaker Registration towards - Mental Health and Psychiatry 2027",
  currency: "EUR",
  amount: "399",
});

const inputClass =
  "w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-gray-600";

const Section = ({ title, icon: Icon, description, children }) => (
  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
      <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
        <Icon size={18} />
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
      {children}
    </div>
  </section>
);

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
  placeholder,
}) => (
  <div className={className}>
    <label className={labelClass}>
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder || label}
      className={inputClass}
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
}) => (
  <div className="min-w-0">
    <label className={labelClass}>
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <select
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={inputClass}
    >
      {options.map((option) => {
        const item =
          typeof option === "string"
            ? { value: option, label: option }
            : option;

        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  </div>
);

const AddressCard = ({ title, prefix, form, updateField }) => (
  <div className="min-w-0 rounded-xl border border-gray-200 p-4">
    <div className="mb-4 flex items-center gap-2">
      <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
        <MapPin size={17} />
      </div>
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
    </div>

    <div className="space-y-4">
      <Field
        label="Full Name"
        value={form[`${prefix}Name`]}
        onChange={(e) => updateField(`${prefix}Name`, e.target.value)}
        required={prefix === "billing"}
      />

      <div>
        <label className={labelClass}>Address</label>
        <textarea
          rows={2}
          value={form[`${prefix}Address`]}
          onChange={(e) => updateField(`${prefix}Address`, e.target.value)}
          className={`${inputClass} resize-y`}
          placeholder="Street address, city, postal code"
        />
      </div>

      <SelectField
        label="Country"
        value={form[`${prefix}Country`]}
        onChange={(e) => updateField(`${prefix}Country`, e.target.value)}
        options={countries}
        required={prefix === "billing"}
      />

      <div>
        <label className={labelClass}>Phone Number</label>

        <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-2">
          <select
            value={form[`${prefix}CountryCode`]}
            onChange={(e) =>
              updateField(`${prefix}CountryCode`, e.target.value)
            }
            className={inputClass}
            aria-label={`${title} phone country code`}
          >
            {countryCodes.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
              </option>
            ))}
          </select>

          <input
            type="tel"
            value={form[`${prefix}Phone`]}
            onChange={(e) => updateField(`${prefix}Phone`, e.target.value)}
            className={inputClass}
            placeholder="Phone number"
          />
        </div>
      </div>

      <Field
        label="Email Address"
        type="email"
        value={form[`${prefix}Email`]}
        onChange={(e) => updateField(`${prefix}Email`, e.target.value)}
      />
    </div>
  </div>
);

const CreateReceipt = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { receiptId } = useParams();
  const isEditing = Boolean(receiptId);

  const {
    conferences: conferenceResponse = [],
    loading: conferencesLoading = false,
  } = useSelector((state) => state.conference || {});

  const receiptCreating = useSelector(
    (state) => state.receipt?.creating || false
  );

  const [form, setForm] = useState(() => ({ ...initialForm, receiptNumber: receiptId ? "" : generateReceiptNumber() }));
  const [items, setItems] = useState([createInitialItem()]);
  const [formError, setFormError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [receiptStatus, setReceiptStatus] = useState("Paid");

  useEffect(() => {
    dispatch(getConferences());
  }, [dispatch]);

  useEffect(() => {
    if (!receiptId) return;
    dispatch(getReceiptById(receiptId)).unwrap().then((response) => {
      const receipt = response?.data;
      if (!receipt) return;
      setReceiptStatus(receipt.status || "Paid");
      const billing = receipt.billing || {};
      const shipping = receipt.shipping || {};
      setForm((previous) => ({ ...previous,
        conferenceId: receipt.conference?._id || receipt.conference || "",
        conferenceTitle: receipt.conferenceTitle || "", conferenceDates: receipt.conferenceDates || "",
        conferenceMode: receipt.conferenceMode || "Webinar", companyCountry: receipt.companyCountry || previous.companyCountry,
        companyPhone: receipt.companyPhone || "", companyEmail: receipt.companyEmail || "", supportEmail: receipt.supportEmail || previous.supportEmail, terms: receipt.terms || previous.terms, receiptNumber: receipt.receiptNumber || "",
        paymentDate: receipt.paymentDate ? new Date(receipt.paymentDate).toISOString().slice(0, 10) : "",
        paymentMethod: receipt.paymentMethod || "Debit/Credit Card", transactionId: receipt.transactionId || "",
        billingName: billing.name || "", billingAddress: billing.address || "", billingCountry: billing.country || "United States",
        billingCountryCode: billing.countryCode || "+1", billingPhone: billing.phone || "", billingEmail: billing.email || "",
        shippingName: shipping.name || "", shippingAddress: shipping.address || "", shippingCountry: shipping.country || "United States",
        shippingCountryCode: shipping.countryCode || "+1", shippingPhone: shipping.phone || "", shippingEmail: shipping.email || "",
      }));
      if (Array.isArray(receipt.items) && receipt.items.length) setItems(receipt.items.map((item, index) => ({ id: item._id || String(index), description: item.description || "", currency: item.currency || "EUR", amount: String(item.amount ?? "") })));
    }).catch((error) => setFormError(typeof error === "string" ? error : "Unable to load receipt for editing."));
  }, [dispatch, receiptId]);

  const conferences = Array.isArray(conferenceResponse)
    ? conferenceResponse
    : Array.isArray(conferenceResponse?.data)
      ? conferenceResponse.data
      : Array.isArray(conferenceResponse?.conferences)
        ? conferenceResponse.conferences
        : [];

  const getConferenceTitle = (conference) =>
    conference?.basicInformation?.title ||
    conference?.conferenceName ||
    conference?.title ||
    conference?.name ||
    "Untitled Conference";

  const getConferenceMode = (conference) =>
    conference?.mode ||
    conference?.conferenceMode ||
    conference?.eventMode ||
    "Webinar";

  const formatConferenceDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value).slice(0, 10);
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getConferenceDates = (conference) => {
    const start =
      conference?.startDate ||
      conference?.start_date ||
      conference?.startDateTime ||
      conference?.dateFrom ||
      conference?.dates?.start;

    const end =
      conference?.endDate ||
      conference?.end_date ||
      conference?.endDateTime ||
      conference?.dateTo ||
      conference?.dates?.end;

    if (start && end) {
      return `${formatConferenceDate(start)} - ${formatConferenceDate(end)}`;
    }

    return (
      conference?.conferenceDates ||
      conference?.dateRange ||
      conference?.date ||
      ""
    );
  };

  useEffect(() => {
    if (!conferences.length || receiptId) return;

    setForm((previous) => {
      const currentExists = conferences.some(
        (conference) =>
          String(conference._id) === String(previous.conferenceId)
      );

      if (currentExists) return previous;

      const selected =
        conferences.find(
          (conference) =>
            getConferenceTitle(conference) ===
            "2nd International Conference on Autism Research and Innovations"
        ) || conferences[0];

      return {
        ...previous,
        conferenceId: String(selected._id),
        conferenceTitle: getConferenceTitle(selected),
        conferenceDates:
          getConferenceDates(selected) || previous.conferenceDates,
        conferenceMode: getConferenceMode(selected),
      };
    });
  }, [conferenceResponse]);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFormError("");
  };

  const handleConferenceChange = (event) => {
    const conferenceId = event.target.value;

    const selected = conferences.find(
      (conference) => String(conference._id) === conferenceId
    );

    setForm((previous) => ({
      ...previous,
      conferenceId,
      conferenceTitle: selected ? getConferenceTitle(selected) : "",
      conferenceDates: selected
        ? getConferenceDates(selected) || previous.conferenceDates
        : previous.conferenceDates,
      conferenceMode: selected
        ? getConferenceMode(selected)
        : previous.conferenceMode,
    }));

    setFormError("");
  };

  const updateItem = (id, field, value) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    setFormError("");
  };

  const addItem = () => {
    setItems((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        description: "",
        currency: "EUR",
        amount: "",
      },
    ]);
  };

  const removeItem = (id) => {
    setItems((previous) =>
      previous.length > 1
        ? previous.filter((item) => item.id !== id)
        : previous
    );
  };

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount, currency) => {
    const value = Number(amount) || 0;

    try {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${currency} ${value.toFixed(2)}`;
    }
  };

  const totalsByCurrency = items.reduce((totals, item) => {
    const currency = item.currency || "EUR";
    totals[currency] =
      (totals[currency] || 0) + (Number(item.amount) || 0);
    return totals;
  }, {});

  const validateForm = () => {
    if (!form.conferenceDates.trim()) {
      setFormError("Please enter the conference dates.");
      return false;
    }

    if (!form.companyCountry.trim() || !form.companyPhone.trim() || !form.companyEmail.trim()) {
      setFormError("Please complete the organization country, phone, and email.");
      return false;
    }

    if (!form.paymentMethod.trim()) {
      setFormError("Please select a payment method.");
      return false;
    }
    if (!form.conferenceId) {
      setFormError("Please select a conference.");
      return false;
    }


    if (!form.billingName.trim()) {
      setFormError("Please enter the Billing To name.");
      return false;
    }

    if (!form.paymentDate) {
      setFormError("Please select the payment date.");
      return false;
    }

    if (
      items.some(
        (item) =>
          !item.description.trim() ||
          item.amount === "" ||
          !Number.isFinite(Number(item.amount)) ||
          Number(item.amount) < 0
      )
    ) {
      setFormError(
        "Enter a description and a valid non-negative amount for every item."
      );
      return false;
    }

    setFormError("");
    return true;
  };

  const handlePreview = () => {
    if (!validateForm()) return;
    setPreviewOpen(true);
  };

  const handlePrint = () => {
    if (!validateForm()) return;

    if (!previewOpen) {
      setPreviewOpen(true);

      setTimeout(() => {
        window.print();
      }, 300);

      return;
    }

    window.print();
  };

  const handleSave = async () => {
    if (saving || receiptCreating) return;
    if (!validateForm()) return;

    setSaving(true);
    setFormError("");

    dispatch(clearReceiptError());
    dispatch(clearReceiptSuccess());

    try {
      const receiptData = {
        conference: form.conferenceId,
        conferenceTitle: form.conferenceTitle,
        conferenceDates: form.conferenceDates,
        conferenceMode: form.conferenceMode,

        companyCountry: form.companyCountry,
        companyPhone: form.companyPhone,
        companyEmail: form.companyEmail,
        supportEmail: form.supportEmail,
        terms: form.terms,
        receiptNumber: form.receiptNumber,
        paymentDate: form.paymentDate,
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId.trim(),

        billing: {
          name: form.billingName.trim(),
          address: form.billingAddress.trim(),
          country: form.billingCountry,
          countryCode: form.billingCountryCode,
          phone: form.billingPhone.trim(),
          email: form.billingEmail.trim(),
        },

        shipping: {
          name: form.shippingName.trim(),
          address: form.shippingAddress.trim(),
          country: form.shippingCountry,
          countryCode: form.shippingCountryCode,
          phone: form.shippingPhone.trim(),
          email: form.shippingEmail.trim(),
        },

        items: items.map((item) => ({
          description: item.description.trim(),
          currency: item.currency,
          amount: Number(item.amount),
        })),

        totals: totalsByCurrency,
        status: receiptStatus,
      };

      const response = isEditing
        ? await dispatch(updateReceipt({ id: receiptId, receiptData })).unwrap()
        : await dispatch(createReceipt(receiptData)).unwrap();

      console.log("Receipt created successfully:", response);

      navigate(isEditing ? "/admin/payment-receipts/" + receiptId : "/admin/payment-receipts", {
        replace: true,
        state: { receiptSaved: true, receiptNumber: isEditing ? form.receiptNumber.trim() : response?.data?.receiptNumber || "" },
      });
    } catch (error) {
      console.error("Create receipt API error:", error);

      setFormError(
        typeof error === "string"
          ? error
          : error?.response?.data?.message ||
            error?.data?.message ||
            error?.message ||
            "Unable to save receipt. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const receiptContent = (
    <>
      <header className="receipt-header">
        <h1 className="print-heading">{form.conferenceTitle}</h1>
        <p>
          {form.conferenceDates} | {form.conferenceMode}
        </p>
        <h2 className="receipt-title">PAYMENT RECEIPT</h2>
        <p>
          <strong>Receipt:</strong> {form.receiptNumber}
        </p>
      </header>

      <div className="print-grid print-section">
        <div>
          <h3>Organization</h3>
          <p>{form.companyCountry}</p>
          <p>Phone: {form.companyPhone || "â€”"}</p>
          <p>Email: {form.companyEmail || "â€”"}</p>
        </div>

        <div>
          <h3>Payment Information</h3>
          <p>Date of Payment: {formatDate(form.paymentDate)}</p>
          <p>Payment Method: {form.paymentMethod}</p>
          <p>Transaction ID: {form.transactionId || "â€”"}</p>
        </div>
      </div>

      <div className="print-grid print-section">
        {["billing", "shipping"].map((prefix) => (
          <div key={prefix}>
            <h3>{prefix === "billing" ? "Billing To" : "Shipping To"}</h3>
            <p>
              <strong>{form[`${prefix}Name`] || "â€”"}</strong>
            </p>
            <p className="receipt-address">
              {form[`${prefix}Address`] || "â€”"}
            </p>
            <p>Country: {form[`${prefix}Country`] || "â€”"}</p>
            <p>
              Phone: {form[`${prefix}CountryCode`]}{" "}
              {form[`${prefix}Phone`] || "â€”"}
            </p>
            <p>Email: {form[`${prefix}Email`] || "â€”"}</p>
          </div>
        ))}
      </div>

      <div className="print-section">
        <table>
          <thead>
            <tr>
              <th className="receipt-col-number">S.No</th>
              <th className="receipt-col-description">Description</th>
              <th className="receipt-col-currency">Currency</th>
              <th className="receipt-col-amount">Amount</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="receipt-item-description">
                  {item.description}
                </td>
                <td>
                  {{
                    EUR: "Euro",
                    GBP: "Pound Sterling",
                    USD: "US Dollar",
                    INR: "Indian Rupee",
                    AUD: "Australian Dollar",
                    CAD: "Canadian Dollar",
                  }[item.currency] || item.currency}
                </td>
                <td className="receipt-amount">
                  {Number(item.amount || 0).toLocaleString("en-GB", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-totals">
          {Object.entries(totalsByCurrency).map(([currency, total]) => (
            <p key={currency}>
              <strong>
                Total ({currency}): {formatAmount(total, currency)}
              </strong>
            </p>
          ))}
        </div>
      </div>

      <div className="print-section receipt-additional">
        <h3>Additional Details</h3>
        <p>This is a computer-generated receipt. Signature is not necessary.</p>
        <p>For questions, please email: {form.supportEmail}</p>
        <p>Terms &amp; Conditions: {form.terms}</p>
        <p className="receipt-footer">
          GlobalScion Conferences Â· Payment Receipt
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="no-print mx-auto mb-6 flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Go back"
            className="mt-1 rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-violet-100 p-2 text-violet-700">
                <Receipt size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {isEditing ? "Edit Payment Receipt" : "Create Payment Receipt"}
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Fill in the conference, customer, payment and receipt details.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePreview}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            <Eye size={17} />
            Preview
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            <Printer size={17} />
            Print
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || receiptCreating || conferencesLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {saving || receiptCreating ? "Saving..." : isEditing ? "Update Receipt" : "Save"}
          </button>
        </div>
      </div>

      {formError && (
        <div className="no-print mx-auto mb-5 max-w-6xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <div className="no-print mx-auto max-w-6xl">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handlePrint();
          }}
          className="space-y-5"
        >
          <Section
            title="Conference & Organization Details"
            icon={Building2}
            description="Select a conference and enter organization contact details."
          >
            <SelectField
              label="Conference Title"
              value={form.conferenceId}
              onChange={handleConferenceChange}
              options={[
                {
                  value: "",
                  label: conferencesLoading
                    ? "Loading conferences..."
                    : "Select Conference",
                },
                ...conferences.map((conference) => ({
                  value: String(conference._id),
                  label: getConferenceTitle(conference),
                })),
              ]}
              required
              disabled={conferencesLoading || conferences.length === 0}
            />

            <Field
              label="Conference Dates"
              value={form.conferenceDates}
              onChange={(e) => updateField("conferenceDates", e.target.value)}
              required
            />

            <SelectField
              label="Conference Mode"
              value={form.conferenceMode}
              onChange={(e) => updateField("conferenceMode", e.target.value)}
              options={["Webinar", "In-Person", "Hybrid"]}
            />

            <SelectField
              label="Organization Country"
              value={form.companyCountry}
              onChange={(e) => updateField("companyCountry", e.target.value)}
              options={countries}
            />

            <Field
              label="Organization Phone"
              type="tel"
              value={form.companyPhone}
              onChange={(e) => updateField("companyPhone", e.target.value)}
            />

            <Field
              label="Organization Email"
              type="email"
              value={form.companyEmail}
              onChange={(e) => updateField("companyEmail", e.target.value)}
            />
          </Section>

          <Section
            title="Receipt & Payment Details"
            icon={CreditCard}
            description="Receipt number is generated automatically."
          >
            <Field
              label="Receipt Number"
              value={form.receiptNumber || "Loading receipt number..."}
              placeholder="Generating receipt number..."
              disabled
            />

            <Field
              label="Date of Payment"
              type="date"
              value={form.paymentDate}
              onChange={(e) => updateField("paymentDate", e.target.value)}
              required
            />

            <SelectField
              label="Payment Method"
              value={form.paymentMethod}
              onChange={(e) => updateField("paymentMethod", e.target.value)}
              options={[
                "Debit/Credit Card",
                "Bank Transfer",
                "UPI",
                "PayPal",
                "Cash",
                "Other",
              ]}
            />

            <Field
              label="Transaction ID"
              value={form.transactionId}
              onChange={(e) => updateField("transactionId", e.target.value)}
              placeholder="Payment transaction ID"
            />
          </Section>

          <Section
            title="Customer Billing & Shipping"
            icon={UserRound}
            description="Choose the country and dialing code separately for each address."
          >
            <div className="grid min-w-0 grid-cols-1 gap-5 sm:col-span-2 lg:grid-cols-2">
              <AddressCard
                title="Billing To"
                prefix="billing"
                form={form}
                updateField={updateField}
              />

              <AddressCard
                title="Shipping To"
                prefix="shipping"
                form={form}
                updateField={updateField}
              />
            </div>
          </Section>

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Receipt Items
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Enter each description, currency and amount.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-4 p-5">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="min-w-0 rounded-xl border border-gray-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">
                      Item {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      title="Remove item"
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="w-full min-w-0">
                    <label className={labelClass}>
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className={`${inputClass} block w-full resize-y`}
                      placeholder="Enter the complete registration or service description"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className={labelClass}>Currency</label>
                      <select
                        value={item.currency}
                        onChange={(e) =>
                          updateItem(item.id, "currency", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="INR">Indian Rupee (INR)</option>
                        <option value="AUD">Australian Dollar (AUD)</option>
                        <option value="CAD">Canadian Dollar (CAD)</option>
                      </select>
                    </div>

                    <div className="min-w-0">
                      <label className={labelClass}>
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(item.id, "amount", e.target.value)
                        }
                        className={inputClass}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-lg bg-violet-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-violet-800">
                  Total by Currency
                </p>
                <div className="space-y-2">
                  {Object.entries(totalsByCurrency).map(([currency, total]) => (
                    <div
                      key={currency}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-sm text-gray-600">
                        Total ({currency})
                      </span>
                      <span className="text-base font-bold text-violet-800">
                        {formatAmount(total, currency)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Different currencies are calculated separately. No currency
                  conversion is applied.
                </p>
              </div>
            </div>
          </section>

          <Section
            title="Additional Details"
            icon={Mail}
            description="Support contact and receipt terms."
          >
            <Field
              label="Support Email"
              type="email"
              value={form.supportEmail}
              onChange={(e) => updateField("supportEmail", e.target.value)}
            />
            <div className="sm:col-span-2">
              <label className={labelClass}>Terms & Conditions</label>
              <textarea
                rows={3}
                value={form.terms}
                onChange={(e) => updateField("terms", e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </div>
          </Section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              <Eye size={17} />
              Preview
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              <Printer size={17} />
              Print
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || receiptCreating || conferencesLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              <Save size={17} />
              {saving || receiptCreating ? "Saving..." : isEditing ? "Update Receipt" : "Save"}
            </button>
          </div>
        </form>
      </div>

      <div id="receipt-print" className="receipt-document">
        {receiptContent}
      </div>

      {previewOpen && (
        <div
          className="no-print fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewOpen(false);
            }
          }}
        >
          <div className="my-3 w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Receipt Preview
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Review your receipt before printing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!validateForm()) return;
                    window.print();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-lg border border-gray-200 p-2.5 text-gray-600 hover:bg-gray-50"
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-100px)] overflow-y-auto bg-gray-100 p-3 sm:p-6">
              <div className="receipt-document mx-auto">{receiptContent}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReceipt;



