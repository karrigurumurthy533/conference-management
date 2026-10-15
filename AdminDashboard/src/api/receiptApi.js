
import axiosInstance from "../redux/axiosInstance";

// =====================================================
// CREATE PAYMENT RECEIPT
// =====================================================

export const createReceiptApi = async (receiptData) => {
  const response = await axiosInstance.post(
    "/receipts/create",
    receiptData
  );

  return response.data;
};

// =====================================================
// GET ALL PAYMENT RECEIPTS
// =====================================================

export const getAllReceiptsApi = async (params = {}) => {
  const response = await axiosInstance.get(
    "/receipts/getAll",
    {
      params,
    }
  );

  return response.data;
};

// =====================================================
// GET PAYMENT RECEIPT BY ID
// =====================================================

export const getReceiptByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/receipts/${id}`
  );

  return response.data;
};

// =====================================================
// UPDATE PAYMENT RECEIPT
// =====================================================

export const updateReceiptApi = async (
  id,
  receiptData
) => {
  const response = await axiosInstance.put(
    `/receipts/${id}`,
    receiptData
  );

  return response.data;
};

// =====================================================
// UPDATE RECEIPT STATUS
// =====================================================

export const updateReceiptStatusApi = async (
  id,
  statusData
) => {
  const response = await axiosInstance.patch(
    `/receipts/${id}/status`,
    statusData
  );

  return response.data;
};

// =====================================================
// DOWNLOAD PAYMENT RECEIPT PDF
// =====================================================

export const downloadReceiptPdfApi = async (
  receiptId
) => {
  const response = await axiosInstance.get(
    `/receipts/${receiptId}/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

// =====================================================
// DELETE PAYMENT RECEIPT
// =====================================================

export const deleteReceiptApi = async (id) => {
  const response = await axiosInstance.delete(
    `/receipts/${id}`
  );

  return response.data;
};
