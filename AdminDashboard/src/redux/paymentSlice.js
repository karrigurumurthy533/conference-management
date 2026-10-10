
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getPaymentSummaryApi,
  getPaymentsApi,
  getPaymentByIdApi,
  syncPaymentStatusApi,
  refundPaymentApi,
} from "../api/paymentApis";

/*
 * Extract API error message
 */
const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

/*
 * 1. Get payment dashboard summary
 */
export const fetchPaymentSummary = createAsyncThunk(
  "payment/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await getPaymentSummaryApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

/*
 * 2. Get all payments
 */
export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getPaymentsApi(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

/*
 * 3. Get payment by ID
 */
export const fetchPaymentById = createAsyncThunk(
  "payment/fetchPaymentById",
  async (id, { rejectWithValue }) => {
    try {
      return await getPaymentByIdApi(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

/*
 * 4. Sync payment status
 */
export const syncPaymentStatus = createAsyncThunk(
  "payment/syncPaymentStatus",
  async (id, { rejectWithValue }) => {
    try {
      return await syncPaymentStatusApi(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

/*
 * 5. Refund payment
 *
 * Payload:
 * { id: "paymentId" }
 *
 * Partial refund:
 * { id: "paymentId", amount: 50 }
 */
export const refundPayment = createAsyncThunk(
  "payment/refundPayment",
  async ({ id, amount }, { rejectWithValue }) => {
    try {
      return await refundPaymentApi(id, amount);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

/*
 * Initial state
 */
const initialState = {
  summary: {
    totalRevenue: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
  },

  payments: [],
  selectedPayment: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  loading: false,
  summaryLoading: false,
  detailsLoading: false,
  syncLoading: false,
  refundLoading: false,

  error: null,
  success: null,
};

/*
 * Payment slice
 */
const paymentSlice = createSlice({
  name: "payment",

  initialState,

  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },

    clearPaymentSuccess: (state) => {
      state.success = null;
    },

    clearSelectedPayment: (state) => {
      state.selectedPayment = null;
    },

    clearPaymentMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================================
      // PAYMENT SUMMARY
      // =====================================
      .addCase(fetchPaymentSummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })

      .addCase(
        fetchPaymentSummary.fulfilled,
        (state, action) => {
          state.summaryLoading = false;

          const response = action.payload;

          const data =
            response?.data?.summary ||
            response?.summary ||
            response?.data ||
            response;

          state.summary = {
            totalRevenue:
              data?.totalRevenue ??
              data?.totalPaid ??
              0,

            successfulPayments:
              data?.successfulPayments ??
              data?.paidPayments ??
              0,

            pendingPayments:
              data?.pendingPayments ?? 0,

            failedPayments:
              data?.failedPayments ?? 0,
          };
        }
      )

      .addCase(
        fetchPaymentSummary.rejected,
        (state, action) => {
          state.summaryLoading = false;
          state.error =
            action.payload || action.error.message;
        }
      )

      // =====================================
      // ALL PAYMENTS
      // =====================================
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;

        const response = action.payload;

        const data =
          response?.data?.payments ||
          response?.payments ||
          response?.data?.data ||
          response?.data ||
          [];

        state.payments = Array.isArray(data)
          ? data
          : [];

        const pagination =
          response?.pagination ||
          response?.data?.pagination ||
          {};

        state.pagination = {
          page:
            pagination.page ??
            response?.page ??
            state.pagination.page,

          limit:
            pagination.limit ??
            response?.limit ??
            state.pagination.limit,

          total:
            pagination.total ??
            pagination.totalRecords ??
            response?.total ??
            response?.count ??
            state.payments.length,

          totalPages:
            pagination.totalPages ??
            response?.totalPages ??
            0,
        };
      })

      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message;
      })

      // =====================================
      // PAYMENT DETAILS
      // =====================================
      .addCase(fetchPaymentById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })

      .addCase(
        fetchPaymentById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;

          const response = action.payload;

          state.selectedPayment =
            response?.data?.payment ||
            response?.payment ||
            response?.data ||
            response;
        }
      )

      .addCase(
        fetchPaymentById.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.error =
            action.payload || action.error.message;
        }
      )

      // =====================================
      // SYNC PAYMENT STATUS
      // =====================================
      .addCase(syncPaymentStatus.pending, (state) => {
        state.syncLoading = true;
        state.error = null;
        state.success = null;
      })

      .addCase(
        syncPaymentStatus.fulfilled,
        (state, action) => {
          state.syncLoading = false;
          state.success =
            action.payload?.message ||
            "Payment status synced successfully.";

          const response = action.payload;

          const updatedPayment =
            response?.data?.payment ||
            response?.payment ||
            response?.data;

          if (updatedPayment?._id) {
            state.payments = state.payments.map(
              (payment) =>
                payment._id === updatedPayment._id
                  ? { ...payment, ...updatedPayment }
                  : payment
            );

            if (
              state.selectedPayment?._id ===
              updatedPayment._id
            ) {
              state.selectedPayment = {
                ...state.selectedPayment,
                ...updatedPayment,
              };
            }
          }
        }
      )

      .addCase(
        syncPaymentStatus.rejected,
        (state, action) => {
          state.syncLoading = false;
          state.error =
            action.payload || action.error.message;
        }
      )

      // =====================================
      // REFUND PAYMENT
      // =====================================
      .addCase(refundPayment.pending, (state) => {
        state.refundLoading = true;
        state.error = null;
        state.success = null;
      })

      .addCase(
        refundPayment.fulfilled,
        (state, action) => {
          state.refundLoading = false;

          state.success =
            action.payload?.message ||
            "Refund processed successfully.";

          const response = action.payload;

          const updatedPayment =
            response?.data?.payment ||
            response?.payment ||
            response?.data;

          if (updatedPayment?._id) {
            state.payments = state.payments.map(
              (payment) =>
                payment._id === updatedPayment._id
                  ? { ...payment, ...updatedPayment }
                  : payment
            );

            if (
              state.selectedPayment?._id ===
              updatedPayment._id
            ) {
              state.selectedPayment = {
                ...state.selectedPayment,
                ...updatedPayment,
              };
            }
          }
        }
      )

      .addCase(
        refundPayment.rejected,
        (state, action) => {
          state.refundLoading = false;
          state.error =
            action.payload || action.error.message;
        }
      );
  },
});

export const {
  clearPaymentError,
  clearPaymentSuccess,
  clearSelectedPayment,
  clearPaymentMessages,
} = paymentSlice.actions;

export default paymentSlice.reducer;
