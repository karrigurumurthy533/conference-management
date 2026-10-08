import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  uploadBrochureApi,
  getAllBrochuresApi,
  getBrochureByIdApi,
  updateBrochureApi,
  deleteBrochureApi,
  getBrochureDownloadRequestsApi,
  getBrochureDownloadRequestByIdApi,
  deleteDownloadBrochureApi,
  getBrochureDownloadStatsApi,
} from "../api/brochureApi";


/* =========================================================
   UPLOAD BROCHURE
========================================================= */

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


/* =========================================================
   GET ALL BROCHURES
========================================================= */

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


/* =========================================================
   GET BROCHURE BY ID
========================================================= */

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


/* =========================================================
   UPDATE BROCHURE
========================================================= */

export const updateBrochure = createAsyncThunk(
  "brochure/updateBrochure",

  async (
    { id, formData },
    { rejectWithValue }
  ) => {
    try {
      return await updateBrochureApi(
        id,
        formData
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update brochure"
      );
    }
  }
);


/* =========================================================
   DELETE BROCHURE
   Deletes uploaded brochure
========================================================= */

export const deleteBrochure = createAsyncThunk(
  "brochure/deleteBrochure",

  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue(
          "Brochure ID is required"
        );
      }

      const response =
        await deleteBrochureApi(id);

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


/* =========================================================
   GET ALL BROCHURE DOWNLOAD REQUESTS
========================================================= */

export const getBrochureDownloads =
  createAsyncThunk(
    "brochure/download-requests",

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


/* =========================================================
   GET BROCHURE DOWNLOAD REQUEST BY ID
========================================================= */

export const getBrochureDownloadRequestById =
  createAsyncThunk(
    "brochure/download-request-by-id",

    async (id, { rejectWithValue }) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Brochure download request ID is required"
          );
        }

        return await getBrochureDownloadRequestByIdApi(
          id
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch brochure download request"
        );
      }
    }
  );


/* =========================================================
   DELETE DOWNLOAD BROCHURE
   Deletes record from downloadbrochures collection
========================================================= */

export const deleteDownloadBrochure =
  createAsyncThunk(
    "brochure/deleteDownloadBrochure",

    async (id, { rejectWithValue }) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Download brochure ID is required"
          );
        }

        const response =
          await deleteDownloadBrochureApi(id);

        return {
          id,
          ...response,
        };
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to delete download brochure"
        );
      }
    }
  );


/* =========================================================
   GET BROCHURE DOWNLOAD STATISTICS
========================================================= */

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


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  /* -------------------------------------------------------
     BROCHURES
  ------------------------------------------------------- */

  brochures: [],
  brochure: null,


  /* -------------------------------------------------------
     DOWNLOAD REQUESTS
  ------------------------------------------------------- */

  downloads: [],
  selectedDownload: null,


  /* -------------------------------------------------------
     DOWNLOAD STATISTICS
  ------------------------------------------------------- */

  downloadStats: null,


  /* -------------------------------------------------------
     LOADING STATES
  ------------------------------------------------------- */

  loading: false,

  uploadLoading: false,

  updateLoading: false,

  deleteLoading: false,

  deletingId: null,

  statsLoading: false,

  downloadDetailsLoading: false,


  /* -------------------------------------------------------
     COMMON STATE
  ------------------------------------------------------- */

  error: null,

  success: false,

  message: "",
};


/* =========================================================
   SLICE
========================================================= */

const brochureSlice = createSlice({
  name: "brochure",

  initialState,

  reducers: {

    /* -----------------------------------------------------
       CLEAR BROCHURE MESSAGE
    ----------------------------------------------------- */

    clearBrochureMessage: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
    },


    /* -----------------------------------------------------
       CLEAR BROCHURE
    ----------------------------------------------------- */

    clearBrochure: (state) => {
      state.brochure = null;
    },


    /* -----------------------------------------------------
       CLEAR SELECTED DOWNLOAD
    ----------------------------------------------------- */

    clearSelectedDownload: (state) => {
      state.selectedDownload = null;

      state.downloadDetailsLoading = false;

      state.error = null;
    },
  },


  /* =======================================================
     EXTRA REDUCERS
  ======================================================= */

  extraReducers: (builder) => {
    builder

      /* =====================================================
         UPLOAD BROCHURE
      ===================================================== */

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


      /* =====================================================
         GET ALL BROCHURES
      ===================================================== */

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


      /* =====================================================
         GET BROCHURE BY ID
      ===================================================== */

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
            action.payload?.data ||
            null;
        }
      )

      .addCase(
        getBrochureById.rejected,
        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        }
      )


      /* =====================================================
         UPDATE BROCHURE
      ===================================================== */

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


      /* =====================================================
         DELETE BROCHURE
         Deletes uploaded brochure
      ===================================================== */

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
            action.payload?.data?.message ||
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


      /* =====================================================
         GET BROCHURE DOWNLOADS
      ===================================================== */

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


      /* =====================================================
         GET BROCHURE DOWNLOAD REQUEST BY ID
      ===================================================== */

      .addCase(
        getBrochureDownloadRequestById.pending,
        (state) => {
          state.downloadDetailsLoading = true;

          state.selectedDownload = null;

          state.error = null;
        }
      )

      .addCase(
        getBrochureDownloadRequestById.fulfilled,
        (state, action) => {
          state.downloadDetailsLoading = false;

          /*
            Supports:

            {
              data: {...}
            }

            {
              data: {
                downloadRequest: {...}
              }
            }

            {
              downloadRequest: {...}
            }
          */

          state.selectedDownload =
            action.payload?.data
              ?.downloadRequest ||

            action.payload?.data
              ?.download ||

            action.payload
              ?.downloadRequest ||

            action.payload
              ?.download ||

            action.payload?.data ||

            action.payload ||

            null;
        }
      )

      .addCase(
        getBrochureDownloadRequestById.rejected,
        (state, action) => {
          state.downloadDetailsLoading = false;

          state.selectedDownload = null;

          state.error =
            action.payload ||
            "Failed to fetch brochure download request";
        }
      )


      /* =====================================================
         DELETE DOWNLOAD BROCHURE
         
         Deletes record from:
         downloadbrochures collection
      ===================================================== */

      .addCase(
        deleteDownloadBrochure.pending,
        (state, action) => {
          state.deleteLoading = true;

          state.deletingId =
            action.meta.arg;

          state.error = null;

          state.success = false;
        }
      )

      .addCase(
        deleteDownloadBrochure.fulfilled,
        (state, action) => {
          state.deleteLoading = false;

          const deletedId =
            action.payload.id;

          /*
            Remove deleted request
            immediately from Redux state
          */

          state.downloads =
            state.downloads.filter(
              (item) =>
                item._id !== deletedId
            );

          /*
            If currently selected download
            is the deleted one, clear it.
          */

          if (
            state.selectedDownload?._id ===
            deletedId
          ) {
            state.selectedDownload = null;
          }

          state.deletingId = null;

          state.success = true;

          state.message =
            action.payload?.data?.message ||
            action.payload?.message ||
            "Download brochure deleted successfully";
        }
      )

      .addCase(
        deleteDownloadBrochure.rejected,
        (state, action) => {
          state.deleteLoading = false;

          state.deletingId = null;

          state.success = false;

          state.error =
            action.payload ||
            "Failed to delete download brochure";
        }
      )


      /* =====================================================
         DOWNLOAD STATISTICS
      ===================================================== */

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


/* =========================================================
   ACTION EXPORTS
========================================================= */

export const {
  clearBrochureMessage,
  clearBrochure,
  clearSelectedDownload,
} = brochureSlice.actions;


/* =========================================================
   SELECTORS
========================================================= */

export const selectBrochures = (state) =>
  state.brochure?.brochures || [];


export const selectBrochure = (state) =>
  state.brochure?.brochure || null;


export const selectBrochureDownloads = (
  state
) =>
  state.brochure?.downloads || [];


export const selectSelectedDownload = (
  state
) =>
  state.brochure?.selectedDownload ||
  null;


export const selectBrochureDownloadStats = (
  state
) =>
  state.brochure?.downloadStats ||
  null;


export const selectBrochureLoading = (
  state
) =>
  state.brochure?.loading || false;


export const selectDownloadDetailsLoading = (
  state
) =>
  state.brochure
    ?.downloadDetailsLoading || false;


export const selectDeleteLoading = (
  state
) =>
  state.brochure?.deleteLoading ||
  false;


export const selectDeletingId = (
  state
) =>
  state.brochure?.deletingId ||
  null;


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default brochureSlice.reducer;