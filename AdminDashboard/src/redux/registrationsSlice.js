import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createRegistrationApi,
  getAllRegistrationsApi,
  getRegistrationByIdApi,
  getRegistrationsByConferenceIdApi,
  deleteRegistrationApi,
} from "../api/registrationsApis";

// ======================================================
// CREATE REGISTRATION
// ======================================================

export const createRegistration = createAsyncThunk(
  "registrations/createRegistration",
  async (registrationData, { rejectWithValue }) => {
    try {
      return await createRegistrationApi(registrationData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create registration"
      );
    }
  }
);

// ======================================================
// GET ALL REGISTRATIONS
// ======================================================

export const getAllRegistrations = createAsyncThunk(
  "registrations/getAllRegistrations",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllRegistrationsApi();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch registrations"
      );
    }
  }
);

// ======================================================
// GET REGISTRATION BY ID
// ======================================================

export const getRegistrationById = createAsyncThunk(
  "registrations/getRegistrationById",
  async (id, { rejectWithValue }) => {
    try {
      return await getRegistrationByIdApi(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch registration"
      );
    }
  }
);

// ======================================================
// GET REGISTRATIONS BY CONFERENCE ID
// ======================================================

export const getRegistrationsByConferenceId = createAsyncThunk(
  "registrations/getRegistrationsByConferenceId",

  async (conferenceId, { rejectWithValue }) => {
    try {
      if (!conferenceId) {
        return rejectWithValue(
          "Conference ID is required"
        );
      }

      return await getRegistrationsByConferenceIdApi(
        conferenceId
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch conference registrations"
      );
    }
  }
);

// ======================================================
// DELETE REGISTRATION
// ======================================================

export const deleteRegistration = createAsyncThunk(
  "registrations/deleteRegistration",

  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteRegistrationApi(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete registration"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  // All registrations
  registrations: [],

  // Selected registration
  selectedRegistration: null,

  // Conference-wise registered users
  conferenceRegisteredUsers: [],

  // Conference-wise summary
  conferenceRegisteredSummary: {
    totalRegistrations: 0,
    paidRegistrations: 0,
    pendingRegistrations: 0,
  },

  // Conference-wise pagination
  conferenceRegisteredPagination: {
    currentPage: 1,
    totalPages: 0,
    totalRegistrations: 0,
    limit: 10,
  },

  // Loading states
  loading: false,
  createLoading: false,
  deleteLoading: false,

  conferenceRegisteredLoading: false,

  // Errors
  error: null,
  conferenceRegisteredError: null,

  // Success
  success: false,

  message: "",
};

// ======================================================
// SLICE
// ======================================================

const registrationsSlice = createSlice({
  name: "registrations",

  initialState,

  reducers: {
    // --------------------------------------------------
    // Clear Error
    // --------------------------------------------------

    clearRegistrationError: (state) => {
      state.error = null;
      state.conferenceRegisteredError = null;
    },

    // --------------------------------------------------
    // Clear Success
    // --------------------------------------------------

    clearRegistrationSuccess: (state) => {
      state.success = false;
      state.message = "";
    },

    // --------------------------------------------------
    // Clear Selected Registration
    // --------------------------------------------------

    clearSelectedRegistration: (state) => {
      state.selectedRegistration = null;
    },

    // --------------------------------------------------
    // Clear Conference Users
    // --------------------------------------------------

    clearConferenceRegisteredUsers: (state) => {
      state.conferenceRegisteredUsers = [];

      state.conferenceRegisteredSummary = {
        totalRegistrations: 0,
        paidRegistrations: 0,
        pendingRegistrations: 0,
      };

      state.conferenceRegisteredPagination = {
        currentPage: 1,
        totalPages: 0,
        totalRegistrations: 0,
        limit: 10,
      };

      state.conferenceRegisteredError = null;
    },

    // --------------------------------------------------
    // Reset
    // --------------------------------------------------

    resetRegistrationState: () => initialState,
  },

  extraReducers: (builder) => {
    // ==================================================
    // CREATE REGISTRATION
    // ==================================================

    builder

      .addCase(
        createRegistration.pending,
        (state) => {
          state.createLoading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        createRegistration.fulfilled,
        (state, action) => {
          state.createLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Registration created successfully";

          const registration =
            action.payload?.registration ||
            action.payload?.data;

          if (registration) {
            state.registrations.unshift(
              registration
            );
          }
        }
      )

      .addCase(
        createRegistration.rejected,
        (state, action) => {
          state.createLoading = false;
          state.success = false;
          state.error = action.payload;
        }
      );

    // ==================================================
    // GET ALL REGISTRATIONS
    // ==================================================

    builder

      .addCase(
        getAllRegistrations.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getAllRegistrations.fulfilled,
        (state, action) => {
          state.loading = false;

          state.registrations =
            action.payload?.registrations ||
            action.payload?.data ||
            [];

          state.message =
            action.payload?.message || "";
        }
      )

      .addCase(
        getAllRegistrations.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // ==================================================
    // GET REGISTRATION BY ID
    // ==================================================

    builder

      .addCase(
        getRegistrationById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.selectedRegistration = null;
        }
      )

      .addCase(
        getRegistrationById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedRegistration =
            action.payload?.registration ||
            action.payload?.data ||
            action.payload;
        }
      )

      .addCase(
        getRegistrationById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // ==================================================
    // GET REGISTRATIONS BY CONFERENCE ID
    // ==================================================

    builder

      .addCase(
        getRegistrationsByConferenceId.pending,
        (state) => {
          state.conferenceRegisteredLoading = true;

          state.conferenceRegisteredError = null;

          // Clear old conference data while loading
          state.conferenceRegisteredUsers = [];

          state.conferenceRegisteredSummary = {
            totalRegistrations: 0,
            paidRegistrations: 0,
            pendingRegistrations: 0,
          };

          state.conferenceRegisteredPagination = {
            currentPage: 1,
            totalPages: 0,
            totalRegistrations: 0,
            limit: 10,
          };
        }
      )

      .addCase(
        getRegistrationsByConferenceId.fulfilled,
        (state, action) => {
          state.conferenceRegisteredLoading = false;

          const payload = action.payload || {};

          // ----------------------------------------------
          // API DATA
          // ----------------------------------------------

          const data =
            payload?.data || payload;

          // ----------------------------------------------
          // REGISTERED USERS
          // ----------------------------------------------

          if (Array.isArray(data)) {
            state.conferenceRegisteredUsers =
              data;
          } else {
            state.conferenceRegisteredUsers =
              data?.registrations || [];
          }

          // ----------------------------------------------
          // SUMMARY
          // ----------------------------------------------

          state.conferenceRegisteredSummary =
            data?.summary || {
              totalRegistrations:
                state.conferenceRegisteredUsers
                  .length,

              paidRegistrations: 0,

              pendingRegistrations: 0,
            };

          // ----------------------------------------------
          // PAGINATION
          // ----------------------------------------------

          state.conferenceRegisteredPagination =
            data?.pagination || {
              currentPage: 1,

              totalPages: 1,

              totalRegistrations:
                state.conferenceRegisteredUsers
                  .length,

              limit: 10,
            };

          // ----------------------------------------------
          // MESSAGE
          // ----------------------------------------------

          state.message =
            payload?.message || "";
        }
      )

      .addCase(
        getRegistrationsByConferenceId.rejected,
        (state, action) => {
          state.conferenceRegisteredLoading = false;

          state.conferenceRegisteredError =
            action.payload ||
            "Failed to fetch conference registered users";

          state.conferenceRegisteredUsers = [];
        }
      );

    // ==================================================
    // DELETE REGISTRATION
    // ==================================================

    builder

      .addCase(
        deleteRegistration.pending,
        (state) => {
          state.deleteLoading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteRegistration.fulfilled,
        (state, action) => {
          state.deleteLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Registration deleted successfully";

          const deletedId =
            action.payload?.id;

          // ----------------------------------------------
          // Remove from all registrations
          // ----------------------------------------------

          state.registrations =
            state.registrations.filter(
              (registration) =>
                registration._id !== deletedId &&
                registration.id !== deletedId
            );

          // ----------------------------------------------
          // Remove from conference registrations
          // ----------------------------------------------

          state.conferenceRegisteredUsers =
            state.conferenceRegisteredUsers.filter(
              (registration) =>
                registration._id !== deletedId &&
                registration.id !== deletedId
            );

          // ----------------------------------------------
          // Update total count
          // ----------------------------------------------

          if (
            state.conferenceRegisteredSummary
          ) {
            state.conferenceRegisteredSummary.totalRegistrations =
              Math.max(
                0,
                state.conferenceRegisteredSummary
                  .totalRegistrations - 1
              );
          }

          // ----------------------------------------------
          // Clear selected registration
          // ----------------------------------------------

          if (
            state.selectedRegistration?._id ===
              deletedId ||
            state.selectedRegistration?.id ===
              deletedId
          ) {
            state.selectedRegistration = null;
          }
        }
      )

      .addCase(
        deleteRegistration.rejected,
        (state, action) => {
          state.deleteLoading = false;
          state.error = action.payload;
        }
      );
  },
});

// ======================================================
// ACTIONS
// ======================================================

export const {
  clearRegistrationError,
  clearRegistrationSuccess,
  clearSelectedRegistration,
  clearConferenceRegisteredUsers,
  resetRegistrationState,
} = registrationsSlice.actions;

// ======================================================
// REDUCER
// ======================================================

export default registrationsSlice.reducer;