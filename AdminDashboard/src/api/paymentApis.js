
import axiosInstance from "../redux/axiosInstance";

// 1. Payment dashboard summary
export const getPaymentSummaryApi = async () => {
  const response = await axiosInstance.get(
    "/payments/admin/summary"
  );

  return response.data;
};

// 2. Get all payments with pagination and filters
export const getPaymentsApi = async (params = {}) => {
  const response = await axiosInstance.get(
    "/payments/admin",
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status }),
        ...(params.conferenceId && {
          conferenceId: params.conferenceId,
        }),
        ...(params.method && { method: params.method }),
      },
    }
  );

  return response.data;
};

// 3. Get payment details by ID
export const getPaymentByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/payments/admin/${id}`
  );

  return response.data;
};

// 4. Sync payment status
export const syncPaymentStatusApi = async (id) => {
  const response = await axiosInstance.get(
    `/payments/admin/${id}/sync`
  );

  return response.data;
};

// 5. Refund payment
export const refundPaymentApi = async (id, amount) => {
  const response = await axiosInstance.post(
    `/payments/admin/${id}/refund`,
    amount == null ? {} : { amount: Number(amount) }
  );

  return response.data;
};

export default {
  getPaymentSummaryApi,
  getPaymentsApi,
  getPaymentByIdApi,
  syncPaymentStatusApi,
  refundPaymentApi,
};
