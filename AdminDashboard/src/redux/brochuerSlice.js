
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  uploadBrochureApi,
  getAllBrochuresApi,
  getBrochureByIdApi,
  updateBrochureApi,
  deleteBrochureApi,
  getBrochureDownloadRequestsApi,
  getBrochureDownloadStatsApi,
} from "../api/brochureApi";

export const uploadBrochure = createAsyncThunk(
  "brochure/uploadBrochure",
  async (formData, { rejectWithValue }) => {
    try {
      return await uploadBrochureApi(formData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to upload brochure"
      );
    }
  }
);

export const getAllBrochures = createAsyncThunk(
  "brochure/getAllBrochures",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllBrochuresApi();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch brochures"
      );
    }
  }
);

export const getBrochureById = createAsyncThunk(
  "brochure/getBrochureById",
  async (id, { rejectWithValue }) => {
    try {
      return await getBrochureByIdApi(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch brochure"
      );
    }
  }
);

export const updateBrochure = createAsyncThunk(
  "brochure/updateBrochure",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await updateBrochureApi(id, formData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update brochure"
      );
    }
  }
);

export const deleteBrochure = createAsyncThunk(
  "brochure/deleteBrochure",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteBrochureApi(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete brochure"
      );
    }
  }
);

export const getBrochureDownloads = createAsyncThunk(
  "brochure/getBrochureDownloads",
  async (_, { rejectWithValue }) => {
    try {
      return await getBrochureDownloadRequestsApi();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch brochure downloads"
      );
    }
  }
);

export const getBrochureDownloadStats =
  createAsyncThunk(
    "brochure/getBrochureDownloadStats",
    async (_, { rejectWithValue }) => {
      try {
        return await getBrochureDownloadStatsApi();
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch brochure statistics"
        );
      }
    }
  );

const initialState = {
  brochures: [],
  brochure: null,
  downloads: [],
  downloadStats: null,

  loading: false,
  uploadLoading: false,
  updateLoading: false,
  deleteLoading: false,
  statsLoading: false,

  error: null,
  success: false,
  message: "",
};

const brochureSlice = createSlice({
  name: "brochure",

  initialState,

  reducers: {
    clearBrochureMessage: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
    },

    clearBrochure: (state) => {
      state.brochure = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Upload brochure

      .addCase(
        uploadBrochure.pending,
        (state) => {
          state.uploadLoading = true;
          state.error = null;
          state.success = false;
          state.message = "";
        }
      )

      .addCase(
        uploadBrochure.fulfilled,
        (state, action) => {
          state.uploadLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Brochure uploaded successfully";

          const brochure =
            action.payload?.data;

          if (brochure) {
            state.brochures.unshift(
              brochure
            );
          }
        }
      )

      .addCase(
        uploadBrochure.rejected,
        (state, action) => {
          state.uploadLoading = false;
          state.success = false;
          state.error = action.payload;
        }
      )

      // Get all brochures

      .addCase(
        getAllBrochures.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getAllBrochures.fulfilled,
        (state, action) => {
          state.loading = false;

          state.brochures =
            action.payload?.data || [];
        }
      )

      .addCase(
        getAllBrochures.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Get brochure by ID

      .addCase(
        getBrochureById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getBrochureById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.brochure =
            action.payload?.data || null;
        }
      )

      .addCase(
        getBrochureById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Update brochure

      .addCase(
        updateBrochure.pending,
        (state) => {
          state.updateLoading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        updateBrochure.fulfilled,
        (state, action) => {
          state.updateLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Brochure updated successfully";

          const updatedBrochure =
            action.payload?.data;

          if (updatedBrochure) {
            const index =
              state.brochures.findIndex(
                (item) =>
                  item._id ===
                  updatedBrochure._id
              );

            if (index !== -1) {
              state.brochures[index] =
                updatedBrochure;
            }
          }

          if (
            state.brochure?._id ===
            updatedBrochure?._id
          ) {
            state.brochure =
              updatedBrochure;
          }
        }
      )

      .addCase(
        updateBrochure.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.success = false;
          state.error = action.payload;
        }
      )

      // Delete brochure

      .addCase(
        deleteBrochure.pending,
        (state) => {
          state.deleteLoading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        deleteBrochure.fulfilled,
        (state, action) => {
          state.deleteLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Brochure deleted successfully";

          state.brochures =
            state.brochures.filter(
              (item) =>
                item._id !==
                action.payload.id
            );

          if (
            state.brochure?._id ===
            action.payload.id
          ) {
            state.brochure = null;
          }
        }
      )

      .addCase(
        deleteBrochure.rejected,
        (state, action) => {
          state.deleteLoading = false;
          state.success = false;
          state.error = action.payload;
        }
      )

      // Brochure downloads

      .addCase(
        getBrochureDownloads.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getBrochureDownloads.fulfilled,
        (state, action) => {
          state.loading = false;

          state.downloads =
            action.payload?.data ||
            action.payload?.downloads ||
            action.payload?.downloadRequests ||
            [];
        }
      )

      .addCase(
        getBrochureDownloads.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Download statistics

      .addCase(
        getBrochureDownloadStats.pending,
        (state) => {
          state.statsLoading = true;
          state.error = null;
        }
      )

      .addCase(
        getBrochureDownloadStats.fulfilled,
        (state, action) => {
          state.statsLoading = false;

          state.downloadStats =
            action.payload?.stats ||
            action.payload?.data ||
            action.payload;
        }
      )

      .addCase(
        getBrochureDownloadStats.rejected,
        (state, action) => {
          state.statsLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearBrochureMessage,
  clearBrochure,
} = brochureSlice.actions;

export default brochureSlice.reducer;