
import axiosInstance from "../redux/axiosInstance";


export const createInvoiceApi = async (invoiceData) => {
  const response = await axiosInstance.post(
    "/invoices/add",
    invoiceData
  );

  return response.data;
};


export const getAllInvoicesApi = async (params = {}) => {
  const response = await axiosInstance.get(
    "/invoices",
    {
      params,
    }
  );

  return response.data;
};


export const getInvoiceByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/invoices/${id}`
  );

  return response.data;
};


export const updateInvoiceApi = async (id, invoiceData) => {
  const response = await axiosInstance.put(
    `/invoices/${id}`,
    invoiceData
  );

  return response.data;
};


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


export const downloadInvoicePdfApi = async (invoiceId) => {
  const response = await axiosInstance.get(
    `/invoices/${invoiceId}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};


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


export const deleteInvoiceApi = async (id) => {
  const response = await axiosInstance.delete(
    `/invoices/${id}`
  );

  return response.data;
};
