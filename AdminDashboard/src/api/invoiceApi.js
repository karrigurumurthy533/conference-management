import axiosInstance from "../redux/axiosInstance";

// =====================================================
// CREATE INVOICE
// =====================================================

export const createInvoiceApi = async (invoiceData) => {
  const response = await axiosInstance.post(
    "/invoices/add",
    invoiceData
  );

  return response.data;
};


// =====================================================
// GET ALL INVOICES
// =====================================================

export const getAllInvoicesApi = async (params = {}) => {
  const response = await axiosInstance.get(
    "/invoices",
    {
      params,
    }
  );

  return response.data;
};


// =====================================================
// GET INVOICE BY ID
// =====================================================

export const getInvoiceByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/invoices/${id}`
  );

  return response.data;
};


// =====================================================
// UPDATE INVOICE
// =====================================================

export const updateInvoiceApi = async (
  id,
  invoiceData
) => {
  const response = await axiosInstance.put(
    `/invoices/${id}`,
    invoiceData
  );

  return response.data;
};


// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

export const updateInvoiceStatusApi = async (
  id,
  paymentData
) => {
  const response = await axiosInstance.patch(
    `/invoices/${id}/status`,
    paymentData
  );

  return response.data;
};


// =====================================================
// DOWNLOAD INVOICE PDF
// =====================================================

export const downloadInvoicePdfApi = async (
  invoiceId
) => {
  const response = await axiosInstance.get(
    `/invoices/${invoiceId}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};


// =====================================================
// MARK INVOICE AS PAID
// =====================================================

export const markInvoiceAsPaidApi = async (
  id,
  paymentData = {}
) => {
  const response = await axiosInstance.patch(
    `/invoices/${id}/mark`,
    paymentData
  );

  return response.data;
};


// =====================================================
// DELETE INVOICE
// =====================================================

export const deleteInvoiceApi = async (id) => {
  const response = await axiosInstance.delete(
    `/invoices/${id}`
  );

  return response.data;
};


// =====================================================
// GET ACTIVE BANK ACCOUNT
// =====================================================

export const getActiveBankAccountApi = async () => {
  const response = await axiosInstance.get(
    "/admin/bank-accounts/active"
  );

  return response.data;
};