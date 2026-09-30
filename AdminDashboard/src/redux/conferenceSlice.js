import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createConferenceApi,
  getConferencesApi,
  getConferenceByIdApi,
  updateConferenceApi,
  deleteConferenceApi,
  publishConferenceApi,
} from "../api/conferenceApis";

export const createConference = createAsyncThunk(
  "conference/createConference",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createConferenceApi(formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getConferences = createAsyncThunk(
  "conference/getConferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConferencesApi();

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getConferenceById = createAsyncThunk(
  "conference/getConferenceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getConferenceByIdApi(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateConference = createAsyncThunk(
  "conference/updateConference",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateConferenceApi({
        id,
        formData,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteConference = createAsyncThunk(
  "conference/deleteConference",
  async (id, { rejectWithValue }) => {
    try {
      await deleteConferenceApi(id);

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const publishConference = createAsyncThunk(
  "conference/publishConference",
  async (id, { rejectWithValue }) => {
    try {
      const response = await publishConferenceApi(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  conferences: [],
  selectedConference: null,

  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  publishLoading: false,

  error: null,
  success: false,
  message: "",
};

const conferenceSlice = createSlice({
  name: "conference",
  initialState,

  reducers: {
    clearConferenceError: (state) => {
      state.error = null;
    },

    clearConferenceSuccess: (state) => {
      state.success = false;
      state.message = "";
    },

    clearSelectedConference: (state) => {
      state.selectedConference = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         CREATE
      ========================= */

      .addCase(createConference.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createConference.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        state.message = "Conference created successfully";

        state.conferences.unshift(action.payload);
      })

      .addCase(createConference.rejected, (state, action) => {
        state.createLoading = false;
        state.error =
          action.payload || "Failed to create conference";
      })

      /* =========================
         GET ALL
      ========================= */

      .addCase(getConferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getConferences.fulfilled, (state, action) => {
        state.loading = false;
        state.conferences = action.payload || [];
      })

      .addCase(getConferences.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch conferences";
      })

      /* =========================
         GET SINGLE
      ========================= */

      .addCase(getConferenceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getConferenceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedConference = action.payload;
      })

      .addCase(getConferenceById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch conference";
      })

      /* =========================
         UPDATE
      ========================= */

      .addCase(updateConference.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateConference.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        state.message = "Conference updated successfully";

        const index = state.conferences.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.conferences[index] = action.payload;
        }

        state.selectedConference = action.payload;
      })

      .addCase(updateConference.rejected, (state, action) => {
        state.updateLoading = false;
        state.error =
          action.payload || "Failed to update conference";
      })

      /* =========================
         DELETE
      ========================= */

      .addCase(deleteConference.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deleteConference.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.success = true;
        state.message = "Conference deleted successfully";

        state.conferences = state.conferences.filter(
          (item) => item.id !== action.payload
        );

        if (state.selectedConference?.id === action.payload) {
          state.selectedConference = null;
        }
      })

      .addCase(deleteConference.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error =
          action.payload || "Failed to delete conference";
      })

      /* =========================
         PUBLISH
      ========================= */

      .addCase(publishConference.pending, (state) => {
        state.publishLoading = true;
        state.error = null;
      })

      .addCase(publishConference.fulfilled, (state, action) => {
        state.publishLoading = false;
        state.success = true;
        state.message = "Conference published successfully";

        const index = state.conferences.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.conferences[index] = action.payload;
        }

        state.selectedConference = action.payload;
      })

      .addCase(publishConference.rejected, (state, action) => {
        state.publishLoading = false;
        state.error =
          action.payload || "Failed to publish conference";
      });
  },
});

export const {
  clearConferenceError,
  clearConferenceSuccess,
  clearSelectedConference,
} = conferenceSlice.actions;

export default conferenceSlice.reducer;