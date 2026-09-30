import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createRegistrationApi,
  createDownloadBrochureApi,
  createAbstractApi,
} from "../api/api";

// ============================================================
// CREATE REGISTRATION
// ============================================================

export const createRegistration = createAsyncThunk(
  "user/createRegistration",

  async (data, { rejectWithValue }) => {
    try {
      const response = await createRegistrationApi(data);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  }
);

// ============================================================
// DOWNLOAD BROCHURE
// ============================================================

export const createDownloadBrochure = createAsyncThunk(
  "user/createDownloadBrochure",

  async (data, { rejectWithValue }) => {
    try {
      const response = await createDownloadBrochureApi(data);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Brochure request failed"
      );
    }
  }
);

// ============================================================
// CREATE ABSTRACT
// ============================================================

export const createAbstract = createAsyncThunk(
  "user/createAbstract",

  async (data, { rejectWithValue }) => {
    try {
      const response = await createAbstractApi(data);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Abstract submission failed"
      );
    }
  }
);

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  registration: null,
  registrationLoading: false,
  registrationError: null,
  registrationSuccess: false,

  brochure: null,
  brochureLoading: false,
  brochureError: null,
  brochureSuccess: false,

  abstract: null,
  abstractLoading: false,
  abstractError: null,
  abstractSuccess: false,
};

// ============================================================
// SLICE
// ============================================================

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    // ========================================================
    // CLEAR REGISTRATION
    // ========================================================

    clearRegistration: (state) => {
      state.registration = null;
      state.registrationLoading = false;
      state.registrationError = null;
      state.registrationSuccess = false;
    },

    // ========================================================
    // CLEAR BROCHURE
    // ========================================================

    clearBrochure: (state) => {
      state.brochure = null;
      state.brochureLoading = false;
      state.brochureError = null;
      state.brochureSuccess = false;
    },

    // ========================================================
    // CLEAR ABSTRACT
    // ========================================================

    clearAbstract: (state) => {
      state.abstract = null;
      state.abstractLoading = false;
      state.abstractError = null;
      state.abstractSuccess = false;
    },

    // ========================================================
    // CLEAR ALL
    // ========================================================

    clearUserState: (state) => {
      state.registration = null;
      state.registrationLoading = false;
      state.registrationError = null;
      state.registrationSuccess = false;

      state.brochure = null;
      state.brochureLoading = false;
      state.brochureError = null;
      state.brochureSuccess = false;

      state.abstract = null;
      state.abstractLoading = false;
      state.abstractError = null;
      state.abstractSuccess = false;
    },
  },

  // ==========================================================
  // EXTRA REDUCERS
  // ==========================================================

  extraReducers: (builder) => {
    builder

      // ======================================================
      // REGISTRATION
      // ======================================================

      .addCase(
        createRegistration.pending,
        (state) => {
          state.registrationLoading = true;
          state.registrationError = null;
          state.registrationSuccess = false;
        }
      )

      .addCase(
        createRegistration.fulfilled,
        (state, action) => {
          state.registrationLoading = false;

          state.registration = action.payload;

          state.registrationSuccess = true;

          state.registrationError = null;
        }
      )

      .addCase(
        createRegistration.rejected,
        (state, action) => {
          state.registrationLoading = false;

          state.registrationError =
            action.payload || "Registration failed";

          state.registrationSuccess = false;
        }
      )

      // ======================================================
      // BROCHURE
      // ======================================================

      .addCase(
        createDownloadBrochure.pending,
        (state) => {
          state.brochureLoading = true;
          state.brochureError = null;
          state.brochureSuccess = false;
        }
      )

      .addCase(
        createDownloadBrochure.fulfilled,
        (state, action) => {
          state.brochureLoading = false;

          state.brochure = action.payload;

          state.brochureSuccess = true;

          state.brochureError = null;
        }
      )

      .addCase(
        createDownloadBrochure.rejected,
        (state, action) => {
          state.brochureLoading = false;

          state.brochureError =
            action.payload ||
            "Brochure request failed";

          state.brochureSuccess = false;
        }
      )

      // ======================================================
      // ABSTRACT
      // ======================================================

      .addCase(
        createAbstract.pending,
        (state) => {
          state.abstractLoading = true;
          state.abstractError = null;
          state.abstractSuccess = false;
        }
      )

      .addCase(
        createAbstract.fulfilled,
        (state, action) => {
          state.abstractLoading = false;

          state.abstract = action.payload;

          state.abstractSuccess = true;

          state.abstractError = null;
        }
      )

      .addCase(
        createAbstract.rejected,
        (state, action) => {
          state.abstractLoading = false;

          state.abstractError =
            action.payload ||
            "Abstract submission failed";

          state.abstractSuccess = false;
        }
      );
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const {
  clearRegistration,
  clearBrochure,
  clearAbstract,
  clearUserState,
} = userSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default userSlice.reducer;