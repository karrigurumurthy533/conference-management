import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createPaymentOrderApi,
  verifyPaymentApi,
} from "../api/api";

export const createPaymentOrder = createAsyncThunk(
  "payments/createPaymentOrder",
  async (registrationId, { rejectWithValue }) => {
    try {
      const response = await createPaymentOrderApi(registrationId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create payment order"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payments/verifyPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await verifyPaymentApi(data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Payment verification failed"
      );
    }
  }
);

const initialState = {
  paymentOrder: null,
  paymentOrderLoading: false,
  paymentOrderError: null,

  paymentVerification: null,
  paymentVerificationLoading: false,
  paymentVerificationError: null,

  paymentSuccess: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    clearPayment: (state) => {
      state.paymentOrder = null;
      state.paymentOrderLoading = false;
      state.paymentOrderError = null;

      state.paymentVerification = null;
      state.paymentVerificationLoading = false;
      state.paymentVerificationError = null;

      state.paymentSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        createPaymentOrder.pending,
        (state) => {
          state.paymentOrderLoading = true;
          state.paymentOrderError = null;
          state.paymentOrder = null;
        }
      )

      .addCase(
        createPaymentOrder.fulfilled,
        (state, action) => {
          state.paymentOrderLoading = false;
          state.paymentOrder =
            action.payload?.data ||
            action.payload;
          state.paymentOrderError = null;
        }
      )

      .addCase(
        createPaymentOrder.rejected,
        (state, action) => {
          state.paymentOrderLoading = false;
          state.paymentOrderError =
            action.payload ||
            "Failed to create payment order";
        }
      )

      .addCase(
        verifyPayment.pending,
        (state) => {
          state.paymentVerificationLoading = true;
          state.paymentVerificationError = null;
          state.paymentSuccess = false;
        }
      )

      .addCase(
        verifyPayment.fulfilled,
        (state, action) => {
          state.paymentVerificationLoading = false;
          state.paymentVerification =
            action.payload?.data ||
            action.payload;
          state.paymentVerificationError = null;
          state.paymentSuccess = true;
        }
      )

      .addCase(
        verifyPayment.rejected,
        (state, action) => {
          state.paymentVerificationLoading = false;
          state.paymentVerificationError =
            action.payload ||
            "Payment verification failed";
          state.paymentSuccess = false;
        }
      );
  },
});

export const {
  clearPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;