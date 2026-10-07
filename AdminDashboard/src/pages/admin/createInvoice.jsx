import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Globe2,
  CreditCard,
  Building2,
  Landmark,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createInvoice,
  clearInvoiceError,
  clearInvoiceSuccess,
} from "../../redux/invoiceSlice";

import { getConferences } from "../../redux/conferenceSlice";


// =====================================================
// CREATE INVOICE
// =====================================================

const CreateInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =====================================================
  // REDUX
  // =====================================================

  const {
    creating,
    error,
    success,
    message,
  } = useSelector(
    (state) => state.invoice
  );

  const {
    conferences = [],
    loading: conferencesLoading,
  } = useSelector(
    (state) => state.conference
  );

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    invoiceDate: new Date()
      .toISOString()
      .split("T")[0],

    userId: "",

    customer: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      address: "",
    },

    conferenceId: "",

    // Invoice amount is the taxable base amount
    amount: "",

    // Default tax = 20%
    taxPercentage: 20,

    currency: "USD",

    paymentStatus: "Pending",

    // Bank Details
    bank: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      swiftCode: "",
    },
  });

  // =====================================================
  // LOAD CONFERENCES
  // =====================================================

  useEffect(() => {
    dispatch(getConferences());

    return () => {
      dispatch(clearInvoiceError());
      dispatch(clearInvoiceSuccess());
    };
  }, [dispatch]);

  // =====================================================
  // NORMAL INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CUSTOMER CHANGE
  // =====================================================

  const handleCustomerChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      customer: {
        ...prev.customer,
        [name]: value,
      },
    }));
  };

  // =====================================================
  // BANK CHANGE
  // =====================================================

  const handleBankChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      bank: {
        ...prev.bank,
        [name]: value,
      },
    }));
  };

  // =====================================================
  // INVOICE AMOUNT
  // =====================================================

  const invoiceAmount = useMemo(() => {
    return Math.max(
      Number(formData.amount) || 0,
      0
    );
  }, [formData.amount]);

  // =====================================================
  // TAX
  // =====================================================

  const tax = useMemo(() => {
    const percentage =
      Number(formData.taxPercentage) || 0;

    return (
      invoiceAmount * percentage
    ) / 100;
  }, [
    invoiceAmount,
    formData.taxPercentage,
  ]);

  // =====================================================
  // TOTAL
  // =====================================================

  const totalAmount = useMemo(() => {
    return invoiceAmount + tax;
  }, [
    invoiceAmount,
    tax,
  ]);

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: formData.currency,
      }
    ).format(Number(amount) || 0);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearInvoiceError());
    dispatch(clearInvoiceSuccess());

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (
      !formData.customer.fullName.trim()
    ) {
      return;
    }

    if (
      !formData.customer.email.trim()
    ) {
      return;
    }

    if (!formData.conferenceId) {
      return;
    }

    if (invoiceAmount <= 0) {
      return;
    }

    // ---------------------------------------------------
    // PAYLOAD
    // ---------------------------------------------------

    const payload = {
      invoiceDate:
        formData.invoiceDate,

      userId:
        formData.userId || undefined,

      customer: {
        fullName:
          formData.customer.fullName,

        email:
          formData.customer.email,

        phone:
          formData.customer.phone,

        country:
          formData.customer.country,

        address:
          formData.customer.address,
      },

      conferenceId:
        formData.conferenceId,

      // Invoice amount
      amount: invoiceAmount,

      // Tax
      tax,

      taxPercentage:
        Number(formData.taxPercentage) || 0,

      totalAmount,

      currency:
        formData.currency,

      paymentStatus:
        formData.paymentStatus,

      // Bank details
      bank: {
        bankName:
          formData.bank.bankName,

        accountName:
          formData.bank.accountName,

        accountNumber:
          formData.bank.accountNumber,

        ifscCode:
          formData.bank.ifscCode,

        swiftCode:
          formData.bank.swiftCode,
      },
    };

    // ---------------------------------------------------
    // CREATE INVOICE
    // ---------------------------------------------------

    const result = await dispatch(
      createInvoice(payload)
    );

    if (
      createInvoice.fulfilled.match(result)
    ) {
      setTimeout(() => {
        navigate("/admin/invoices");
      }, 1200);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-4">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-violet-600"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                <FileText
                  size={21}
                  className="text-violet-600"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Create Invoice
                </h1>

                <p className="text-xs text-slate-500">
                  Create a new conference invoice
                </p>
              </div>

            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Invoice Number
              </p>

              <p className="text-sm font-semibold text-slate-800">
                Auto Generated
              </p>
            </div>

          </div>
        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">

            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-semibold">
                Failed to create invoice
              </p>

              <p className="mt-0.5 text-xs">
                {typeof error === "string"
                  ? error
                  : "Something went wrong while creating the invoice."}
              </p>
            </div>

          </div>
        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">

            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-semibold">
                Invoice created successfully
              </p>

              {message && (
                <p className="mt-0.5 text-xs">
                  {message}
                </p>
              )}
            </div>

          </div>
        )}


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* =================================================
              CUSTOMER + CONFERENCE
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              icon={
                <User
                  size={19}
                  className="text-violet-600"
                />
              }
              title="Customer & Conference"
              description="Enter customer details and select the conference"
            />

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">

              {/* Full Name */}

              <InputField
                label="Full Name"
                name="fullName"
                value={
                  formData.customer.fullName
                }
                onChange={
                  handleCustomerChange
                }
                placeholder="Full name"
                icon={
                  <User size={16} />
                }
                required
              />


              {/* Email */}

              <InputField
                label="Email"
                name="email"
                type="email"
                value={
                  formData.customer.email
                }
                onChange={
                  handleCustomerChange
                }
                placeholder="customer@example.com"
                icon={
                  <Mail size={16} />
                }
                required
              />


              {/* Phone */}

              <InputField
                label="Phone"
                name="phone"
                value={
                  formData.customer.phone
                }
                onChange={
                  handleCustomerChange
                }
                placeholder="+91 XXXXX XXXXX"
                icon={
                  <Phone size={16} />
                }
              />


              {/* Country */}

              <InputField
                label="Country"
                name="country"
                value={
                  formData.customer.country
                }
                onChange={
                  handleCustomerChange
                }
                placeholder="India"
                icon={
                  <Globe2 size={16} />
                }
              />


              {/* Address */}

              <div className="md:col-span-2">

                <InputField
                  label="Address"
                  name="address"
                  value={
                    formData.customer.address
                  }
                  onChange={
                    handleCustomerChange
                  }
                  placeholder="Full billing address"
                  icon={
                    <MapPin size={16} />
                  }
                />

              </div>


              {/* Conference */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Conference
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <Building2
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={
                      formData.conferenceId
                    }
                    onChange={(e) =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          conferenceId:
                            e.target.value,
                        })
                      )
                    }
                    disabled={
                      conferencesLoading
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-100"
                  >

                    <option value="">
                      {conferencesLoading
                        ? "Loading conferences..."
                        : "Select Conference"}
                    </option>

                    {conferences.map(
                      (conference) => {

                        const title =
                          conference
                            ?.basicInformation
                            ?.title ||
                          conference?.conferenceName ||
                          conference?.title ||
                          conference?.name ||
                          "Untitled Conference";

                        return (
                          <option
                            key={
                              conference._id
                            }
                            value={
                              conference._id
                            }
                          >
                            {title}
                          </option>
                        );
                      }
                    )}

                  </select>

                </div>

              </div>

            </div>
          </div>


          {/* =================================================
              INVOICE + AMOUNT
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              icon={
                <CreditCard
                  size={19}
                  className="text-violet-600"
                />
              }
              title="Invoice & Amount"
              description="Enter invoice amount, tax and payment status"
            />

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-4">

              {/* Invoice Date */}

              <InputField
                label="Invoice Date"
                type="date"
                name="invoiceDate"
                value={
                  formData.invoiceDate
                }
                onChange={handleChange}
                icon={
                  <CalendarDays size={16} />
                }
                required
              />


              {/* Currency */}

              <SelectField
                label="Currency"
                value={
                  formData.currency
                }
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      currency:
                        e.target.value,
                    })
                  )
                }
                options={[
                  "USD",
                  "GBP",
                  "EUR",
                  "INR",
                ]}
              />


              {/* Payment Status */}

              <SelectField
                label="Payment Status"
                value={
                  formData.paymentStatus
                }
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      paymentStatus:
                        e.target.value,
                    })
                  )
                }
                options={[
                  "Pending",
                  "Paid",
                  "Failed",
                  "Cancelled",
                  "Refunded",
                ]}
              />


              {/* Amount */}

              <InputField
                label={`Invoice Amount (${formData.currency})`}
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={
                  formData.amount
                }
                onChange={handleChange}
                placeholder="0.00"
                icon={
                  <CreditCard size={16} />
                }
                required
              />


              {/* Tax */}

              <InputField
                label="Tax Percentage"
                name="taxPercentage"
                type="number"
                min="0"
                step="0.01"
                value={
                  formData.taxPercentage
                }
                onChange={handleChange}
                placeholder="20"
              />

            </div>
          </div>


          {/* =================================================
              BANK DETAILS
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <SectionHeader
              icon={
                <Landmark
                  size={19}
                  className="text-violet-600"
                />
              }
              title="Bank Details"
              description="Enter bank account details for the invoice"
            />

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">

              {/* Bank Name */}

              <InputField
                label="Bank Name"
                name="bankName"
                value={
                  formData.bank.bankName
                }
                onChange={
                  handleBankChange
                }
                placeholder="Bank name"
                icon={
                  <Landmark size={16} />
                }
              />


              {/* Account Name */}

              <InputField
                label="Account Name"
                name="accountName"
                value={
                  formData.bank.accountName
                }
                onChange={
                  handleBankChange
                }
                placeholder="Account holder name"
                icon={
                  <User size={16} />
                }
              />


              {/* Account Number */}

              <InputField
                label="Account Number"
                name="accountNumber"
                value={
                  formData.bank.accountNumber
                }
                onChange={
                  handleBankChange
                }
                placeholder="Account number"
                icon={
                  <CreditCard size={16} />
                }
              />


              {/* IFSC */}

              <InputField
                label="IFSC Code"
                name="ifscCode"
                value={
                  formData.bank.ifscCode
                }
                onChange={
                  handleBankChange
                }
                placeholder="IFSC code"
              />


              {/* SWIFT */}

              <InputField
                label="SWIFT Code"
                name="swiftCode"
                value={
                  formData.bank.swiftCode
                }
                onChange={
                  handleBankChange
                }
                placeholder="SWIFT code"
              />

            </div>
          </div>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Invoice Summary
                </h2>

                <p className="text-xs text-slate-500">
                  Automatically calculated
                </p>
              </div>

              <div className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                Tax {Number(
                  formData.taxPercentage
                ) || 0}%
              </div>

            </div>


            <div className="space-y-2.5">

              <SummaryRow
                label="Invoice Amount"
                value={formatCurrency(
                  invoiceAmount
                )}
              />


              <SummaryRow
                label={`Tax (${Number(
                  formData.taxPercentage
                ) || 0}%)`}
                value={formatCurrency(
                  tax
                )}
              />


              <div className="border-t border-slate-200 pt-3">

                <div className="flex items-center justify-between">

                  <span className="text-base font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-violet-600">
                    {formatCurrency(
                      totalAmount
                    )}
                  </span>

                </div>

              </div>

            </div>
          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex justify-end gap-3 pb-4">

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={creating}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {creating ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Creating...
                </>
              ) : (
                <>
                  <Save size={17} />

                  Create Invoice
                </>
              )}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
};


// =====================================================
// SECTION HEADER
// =====================================================

const SectionHeader = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="border-b border-slate-200 px-5 py-3.5">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
          {icon}
        </div>

        <div>

          <h2 className="text-sm font-semibold text-slate-900">
            {title}
          </h2>

          <p className="text-[11px] text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
};


// =====================================================
// INPUT FIELD
// =====================================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  min,
  step,
}) => {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-medium text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <div className="relative">

        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          step={step}
          className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 ${
            icon ? "pl-9" : ""
          }`}
        />

      </div>

    </div>
  );
};


// =====================================================
// SELECT FIELD
// =====================================================

const SelectField = ({
  label,
  value,
  onChange,
  options = [],
}) => {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      >

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}

      </select>

    </div>
  );
};


// =====================================================
// SUMMARY ROW
// =====================================================

const SummaryRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between text-sm">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-medium text-slate-800">
        {value}
      </span>

    </div>
  );
};


export default CreateInvoice;