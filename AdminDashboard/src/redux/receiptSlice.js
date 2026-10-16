
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createReceiptApi,
  getAllReceiptsApi,
  getReceiptByIdApi,
  updateReceiptApi,
  updateReceiptStatusApi,
  deleteReceiptApi,
  downloadReceiptPdfApi,
} from "../api/receiptApi";

// ======================================================
// CREATE PAYMENT RECEIPT
// ======================================================

export const createReceipt = createAsyncThunk(
  "receipt/createReceipt",
  async (receiptData, { rejectWithValue }) => {
    try {
      return await createReceiptApi(receiptData);
    } catch (error) {
      const responseData = error.response?.data;
      const message =
        responseData?.message ||
        error.message ||
        "Failed to create payment receipt";
      const missingFields = responseData?.missingFields;

      return rejectWithValue(
        Array.isArray(missingFields) && missingFields.length
          ? message + " Missing: " + missingFields.join(", ") + "."
          : message
      );
    }
  }
);

// ======================================================
// GET ALL PAYMENT RECEIPTS
// ======================================================

export const getAllReceipts = createAsyncThunk(
  "receipt/getAllReceipts",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getAllReceiptsApi(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch payment receipts"
      );
    }
  }
);

// ======================================================
// GET PAYMENT RECEIPT BY ID
// ======================================================

export const getReceiptById = createAsyncThunk(
  "receipt/getReceiptById",
  async (id, { rejectWithValue }) => {
    try {
      return await getReceiptByIdApi(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch payment receipt"
      );
    }
  }
);

// ======================================================
// UPDATE PAYMENT RECEIPT
// ======================================================

export const updateReceipt = createAsyncThunk(
  "receipt/updateReceipt",
  async ({ id, receiptData }, { rejectWithValue }) => {
    try {
      return await updateReceiptApi(id, receiptData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update payment receipt"
      );
    }
  }
);

// ======================================================
// UPDATE PAYMENT RECEIPT STATUS
// ======================================================

export const updateReceiptStatus = createAsyncThunk(
  "receipt/updateReceiptStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      return await updateReceiptStatusApi(id, statusData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update receipt status"
      );
    }
  }
);

// ======================================================
// DELETE PAYMENT RECEIPT
// ======================================================

export const deleteReceipt = createAsyncThunk(
  "receipt/deleteReceipt",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteReceiptApi(id);

      return {
        ...response,
        deletedId: id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete payment receipt"
      );
    }
  }
);

// ======================================================
// DOWNLOAD PAYMENT RECEIPT PDF
// ======================================================

export const downloadReceiptPdf = createAsyncThunk(
  "receipt/downloadReceiptPdf",
  async (receiptId, { rejectWithValue }) => {
    try {
      const response = await downloadReceiptPdfApi(receiptId);

      // PDF blob is returned to the component for downloading.
      return {
        blob: response,
        receiptId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to download payment receipt PDF"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  // RECEIPTS
  receipts: [],
  receipt: null,

  // LOADING
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  downloading: false,

  // ERRORS
  error: null,
  downloadError: null,

  // SUCCESS
  success: false,
  message: "",

  // PAGINATION
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// ======================================================
// SLICE
// ======================================================

const receiptSlice = createSlice({
  name: "receipt",
  initialState,

  reducers: {
    // CLEAR RECEIPT ERROR
    clearReceiptError: (state) => {
      state.error = null;
    },

    // CLEAR DOWNLOAD ERROR
    clearReceiptDownloadError: (state) => {
      state.downloadError = null;
    },

    // CLEAR SUCCESS
    clearReceiptSuccess: (state) => {
      state.success = false;
      state.message = "";
    },

    // CLEAR SELECTED RECEIPT
    clearSelectedReceipt: (state) => {
      state.receipt = null;
    },

    // RESET STATE
    resetReceiptState: () => initialState,
  },

  // ====================================================
  // EXTRA REDUCERS
  // ====================================================

  extraReducers: (builder) => {
    // ==================================================
    // CREATE RECEIPT
    // ==================================================

    builder
      .addCase(createReceipt.pending, (state) => {
        state.creating = true;
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = "";
      })
      .addCase(createReceipt.fulfilled, (state, action) => {
        state.creating = false;
        state.loading = false;
        state.success = true;
        state.error = null;

        state.message =
          action.payload?.message ||
          "Payment receipt created successfully";

        const newReceipt = action.payload?.data;

        if (newReceipt) {
          state.receipts = [
            newReceipt,
            ...state.receipts.filter(
              (item) => item._id !== newReceipt._id
            ),
          ];

          state.receipt = newReceipt;
          state.pagination.total += 1;
        }
      })
      .addCase(createReceipt.rejected, (state, action) => {
        state.creating = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload || "Failed to create payment receipt";
      });

    // ==================================================
    // GET ALL RECEIPTS
    // ==================================================

    builder
      .addCase(getAllReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.receipts = action.payload?.data || [];

        state.message = action.payload?.message || "";

        state.pagination = {
          page: action.payload?.page || 1,
          limit: action.payload?.limit || 10,
          total: action.payload?.total || 0,
          totalPages: action.payload?.totalPages || 0,
        };
      })
      .addCase(getAllReceipts.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to fetch payment receipts";
      });

    // ==================================================
    // GET RECEIPT BY ID
    // ==================================================

    builder
      .addCase(getReceiptById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.receipt = null;
      })
      .addCase(getReceiptById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.receipt = action.payload?.data || null;
        state.message = action.payload?.message || "";
      })
      .addCase(getReceiptById.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to fetch payment receipt";
      });

    // ==================================================
    // UPDATE RECEIPT
    // ==================================================

    builder
      .addCase(updateReceipt.pending, (state) => {
        state.updating = true;
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = "";
      })
      .addCase(updateReceipt.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.success = true;
        state.error = null;

        state.message =
          action.payload?.message ||
          "Payment receipt updated successfully";

        const updatedReceipt = action.payload?.data;

        if (updatedReceipt) {
          state.receipt = updatedReceipt;

          const index = state.receipts.findIndex(
            (item) => item._id === updatedReceipt._id
          );

          if (index !== -1) {
            state.receipts[index] = updatedReceipt;
          }
        }
      })
      .addCase(updateReceipt.rejected, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload || "Failed to update payment receipt";
      });

    // ==================================================
    // UPDATE RECEIPT STATUS
    // ==================================================

    builder
      .addCase(updateReceiptStatus.pending, (state) => {
        state.updating = true;
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateReceiptStatus.fulfilled, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.success = true;
        state.error = null;

        state.message =
          action.payload?.message ||
          "Receipt status updated successfully";

        const updatedReceipt = action.payload?.data;

        if (updatedReceipt) {
          state.receipt = updatedReceipt;

          const index = state.receipts.findIndex(
            (item) => item._id === updatedReceipt._id
          );

          if (index !== -1) {
            state.receipts[index] = updatedReceipt;
          }
        }
      })
      .addCase(updateReceiptStatus.rejected, (state, action) => {
        state.updating = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload || "Failed to update receipt status";
      });

    // ==================================================
    // DELETE RECEIPT
    // ==================================================

    builder
      .addCase(deleteReceipt.pending, (state) => {
        state.deleting = true;
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteReceipt.fulfilled, (state, action) => {
        state.deleting = false;
        state.loading = false;
        state.success = true;
        state.error = null;

        state.message =
          action.payload?.message ||
          "Payment receipt deleted successfully";

        const deletedId = action.payload?.deletedId;

        state.receipts = state.receipts.filter(
          (item) => item._id !== deletedId
        );

        if (state.receipt?._id === deletedId) {
          state.receipt = null;
        }

        state.pagination.total = Math.max(
          0,
          state.pagination.total - 1
        );
      })
      .addCase(deleteReceipt.rejected, (state, action) => {
        state.deleting = false;
        state.loading = false;
        state.success = false;

        state.error =
          action.payload || "Failed to delete payment receipt";
      });

    // ==================================================
    // DOWNLOAD RECEIPT PDF
    // ==================================================

    builder
      .addCase(downloadReceiptPdf.pending, (state) => {
        state.downloading = true;
        state.downloadError = null;
      })
      .addCase(downloadReceiptPdf.fulfilled, (state) => {
        state.downloading = false;
        state.downloadError = null;
      })
      .addCase(downloadReceiptPdf.rejected, (state, action) => {
        state.downloading = false;

        state.downloadError =
          action.payload || "Failed to download payment receipt PDF";
      });
  },
});

// ======================================================
// ACTIONS
// ======================================================

export const {
  clearReceiptError,
  clearReceiptDownloadError,
  clearReceiptSuccess,
  clearSelectedReceipt,
  resetReceiptState,
} = receiptSlice.actions;

// ======================================================
// RECEIPT SELECTORS
// ======================================================

export const selectReceipts = (state) =>
  state.receipt?.receipts || [];

export const selectReceipt = (state) =>
  state.receipt?.receipt || null;

export const selectReceiptLoading = (state) =>
  state.receipt?.loading || false;

export const selectReceiptCreating = (state) =>
  state.receipt?.creating || false;

export const selectReceiptUpdating = (state) =>
  state.receipt?.updating || false;

export const selectReceiptDeleting = (state) =>
  state.receipt?.deleting || false;

// ======================================================
// DOWNLOAD SELECTORS
// ======================================================

export const selectReceiptDownloading = (state) =>
  state.receipt?.downloading || false;

export const selectReceiptDownloadError = (state) =>
  state.receipt?.downloadError || null;

// ======================================================
// GENERAL SELECTORS
// ======================================================

export const selectReceiptError = (state) =>
  state.receipt?.error || null;

export const selectReceiptSuccess = (state) =>
  state.receipt?.success || false;

export const selectReceiptMessage = (state) =>
  state.receipt?.message || "";

// ======================================================
// PAGINATION SELECTOR
// ======================================================

export const selectReceiptPagination = (state) =>
  state.receipt?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };



export default receiptSlice.reducer;
