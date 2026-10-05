import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  subscribeApi,
  getSubscribersApi,
  getSubscriberByIdApi,
} from "../api/subscribeApi";


// =====================================================
// SUBSCRIBE
// =====================================================

export const subscribe = createAsyncThunk(
  "subscriber/subscribe",
  async (subscriberData, { rejectWithValue }) => {
    try {
      const response = await subscribeApi(subscriberData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to subscribe"
      );
    }
  }
);


// =====================================================
// GET ALL SUBSCRIBERS
// =====================================================

export const getSubscribers = createAsyncThunk(
  "subscriber/getSubscribers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubscribersApi();

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch subscribers"
      );
    }
  }
);


// =====================================================
// GET SUBSCRIBER BY ID
// =====================================================

export const getSubscriberById = createAsyncThunk(
  "subscriber/getSubscriberById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getSubscriberByIdApi(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch subscriber"
      );
    }
  }
);


// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  subscribers: [],
  subscriber: null,

  loading: false,
  subscribeLoading: false,
  detailsLoading: false,

  success: false,
  message: "",

  error: null,
};


// =====================================================
// SLICE
// =====================================================

const subscribeSlice = createSlice({
  name: "subscriber",

  initialState,

  reducers: {
    clearSubscriberError: (state) => {
      state.error = null;
    },

    clearSubscriberMessage: (state) => {
      state.message = "";
    },

    clearSubscribeSuccess: (state) => {
      state.success = false;
    },

    clearSubscriber: (state) => {
      state.subscriber = null;
    },

    resetSubscriberState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // =================================================
    // SUBSCRIBE
    // =================================================

    builder
      .addCase(subscribe.pending, (state) => {
        state.subscribeLoading = true;
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = "";
      })

      .addCase(subscribe.fulfilled, (state, action) => {
        state.subscribeLoading = false;
        state.loading = false;
        state.success = true;
        state.error = null;

        state.message =
          action.payload?.message ||
          "Subscribed successfully";

        if (action.payload?.data) {
          state.subscribers.unshift(
            action.payload.data
          );
        }
      })

      .addCase(subscribe.rejected, (state, action) => {
        state.subscribeLoading = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload ||
          "Failed to subscribe";
      });


    // =================================================
    // GET ALL SUBSCRIBERS
    // =================================================

    builder
      .addCase(getSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.subscribers =
          action.payload?.data || [];
      })

      .addCase(getSubscribers.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          "Failed to fetch subscribers";
      });


    // =================================================
    // GET SUBSCRIBER BY ID
    // =================================================

    builder
      .addCase(getSubscriberById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })

      .addCase(getSubscriberById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.error = null;

        state.subscriber =
          action.payload?.data || null;
      })

      .addCase(getSubscriberById.rejected, (state, action) => {
        state.detailsLoading = false;

        state.error =
          action.payload ||
          "Failed to fetch subscriber";
      });
  },
});


// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  clearSubscriberError,
  clearSubscriberMessage,
  clearSubscribeSuccess,
  clearSubscriber,
  resetSubscriberState,
} = subscribeSlice.actions;




export default subscribeSlice.reducer;