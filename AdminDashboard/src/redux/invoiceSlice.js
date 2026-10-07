import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createInvoiceApi,
  getAllInvoicesApi,
  getInvoiceByIdApi,
  updateInvoiceApi,
  updateInvoiceStatusApi,
  markInvoiceAsPaidApi,
  deleteInvoiceApi,
  downloadInvoicePdfApi,
} from "../api/invoiceApi";


// ======================================================
// CREATE INVOICE
// ======================================================

export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",

  async (invoiceData, { rejectWithValue }) => {
    try {
      const response =
        await createInvoiceApi(invoiceData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create invoice"
      );
    }
  }
);


// ======================================================
// GET ALL INVOICES
// ======================================================

export const getAllInvoices = createAsyncThunk(
  "invoice/getAllInvoices",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await getAllInvoicesApi(params);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch invoices"
      );
    }
  }
);


// ======================================================
// GET INVOICE BY ID
// ======================================================

export const getInvoiceById = createAsyncThunk(
  "invoice/getInvoiceById",

  async (id, { rejectWithValue }) => {
    try {
      const response =
        await getInvoiceByIdApi(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch invoice"
      );
    }
  }
);


// ======================================================
// UPDATE INVOICE
// ======================================================

export const updateInvoice = createAsyncThunk(
  "invoice/updateInvoice",

  async (
    { id, invoiceData },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await updateInvoiceApi(
          id,
          invoiceData
        );

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update invoice"
      );
    }
  }
);


// ======================================================
// UPDATE INVOICE STATUS
// ======================================================

export const updateInvoiceStatus =
  createAsyncThunk(
    "invoice/updateInvoiceStatus",

    async (
      { id, paymentData },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await updateInvoiceStatusApi(
            id,
            paymentData
          );

        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to update payment status"
        );
      }
    }
  );


// ======================================================
// MARK INVOICE AS PAID
// ======================================================

export const markInvoiceAsPaid =
  createAsyncThunk(
    "invoice/markInvoiceAsPaid",

    async (
      {
        id,
        paymentData = {},
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await markInvoiceAsPaidApi(
            id,
            paymentData
          );

        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to mark invoice as paid"
        );
      }
    }
  );


// ======================================================
// DELETE INVOICE
// ======================================================

export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",

  async (id, { rejectWithValue }) => {
    try {
      const response =
        await deleteInvoiceApi(id);

      return {
        ...response,
        deletedId: id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete invoice"
      );
    }
  }
);


// ======================================================
// DOWNLOAD INVOICE PDF
// ======================================================

export const downloadInvoicePdf = createAsyncThunk(
  "invoice/downloadInvoicePdf",
  async (invoiceId, { rejectWithValue }) => {
    try {
      console.log(
        "Redux downloadInvoicePdf called:",
        invoiceId
      );

      const response = await downloadInvoicePdfApi(invoiceId);

      console.log(
        "PDF response received"
      );

      return response;
    } catch (error) {
      console.error(
        "Download PDF API error:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to download invoice PDF"
      );
    }
  }
);


// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  invoices: [],

  invoice: null,

  loading: false,

  creating: false,

  updating: false,

  deleting: false,

  downloading: false,

  error: null,

  downloadError: null,

  success: false,

  message: "",

  pagination: {
    currentPage: 1,

    itemsPerPage: 10,

    totalItems: 0,

    totalPages: 0,
  },
};


// ======================================================
// SLICE
// ======================================================

const invoiceSlice = createSlice({
  name: "invoice",

  initialState,

  reducers: {

    // ----------------------------------------------
    // CLEAR ERROR
    // ----------------------------------------------

    clearInvoiceError: (state) => {
      state.error = null;
    },


    // ----------------------------------------------
    // CLEAR DOWNLOAD ERROR
    // ----------------------------------------------

    clearInvoiceDownloadError: (state) => {
      state.downloadError = null;
    },


    // ----------------------------------------------
    // CLEAR SUCCESS
    // ----------------------------------------------

    clearInvoiceSuccess: (state) => {
      state.success = false;

      state.message = "";
    },


    // ----------------------------------------------
    // CLEAR SELECTED INVOICE
    // ----------------------------------------------

    clearSelectedInvoice: (state) => {
      state.invoice = null;
    },


    // ----------------------------------------------
    // RESET STATE
    // ----------------------------------------------

    resetInvoiceState: () => {
      return initialState;
    },
  },


  extraReducers: (builder) => {

    // ==================================================
    // CREATE INVOICE
    // ==================================================

    builder

      .addCase(
        createInvoice.pending,
        (state) => {

          state.creating = true;

          state.loading = true;

          state.error = null;

          state.success = false;

          state.message = "";
        }
      )

      .addCase(
        createInvoice.fulfilled,
        (state, action) => {

          state.creating = false;

          state.loading = false;

          state.success = true;

          state.message =
            action.payload?.message ||
            "Invoice created successfully";

          const newInvoice =
            action.payload?.data;

          if (newInvoice) {

            state.invoices.unshift(
              newInvoice
            );

            state.invoice =
              newInvoice;
          }
        }
      )

      .addCase(
        createInvoice.rejected,
        (state, action) => {

          state.creating = false;

          state.loading = false;

          state.success = false;

          state.error =
            action.payload ||
            "Failed to create invoice";
        }
      );


    // ==================================================
    // GET ALL INVOICES
    // ==================================================

    builder

      .addCase(
        getAllInvoices.pending,
        (state) => {

          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        getAllInvoices.fulfilled,
        (state, action) => {

          state.loading = false;

          state.error = null;

          state.invoices =
            action.payload?.data ||
            [];

          state.message =
            action.payload?.message ||
            "";

          if (
            action.payload?.pagination
          ) {

            state.pagination = {
              ...state.pagination,

              ...action.payload.pagination,
            };
          }
        }
      )

      .addCase(
        getAllInvoices.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch invoices";
        }
      );


    // ==================================================
    // GET INVOICE BY ID
    // ==================================================

    builder

      .addCase(
        getInvoiceById.pending,
        (state) => {

          state.loading = true;

          state.error = null;

          state.invoice = null;
        }
      )

      .addCase(
        getInvoiceById.fulfilled,
        (state, action) => {

          state.loading = false;

          state.error = null;

          state.invoice =
            action.payload?.data ||
            null;

          state.message =
            action.payload?.message ||
            "";
        }
      )

      .addCase(
        getInvoiceById.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch invoice";
        }
      );


    // ==================================================
    // UPDATE INVOICE
    // ==================================================

    builder

      .addCase(
        updateInvoice.pending,
        (state) => {

          state.updating = true;

          state.loading = true;

          state.error = null;

          state.success = false;

          state.message = "";
        }
      )

      .addCase(
        updateInvoice.fulfilled,
        (state, action) => {

          state.updating = false;

          state.loading = false;

          state.success = true;

          state.message =
            action.payload?.message ||
            "Invoice updated successfully";

          const updatedInvoice =
            action.payload?.data;

          if (updatedInvoice) {

            state.invoice =
              updatedInvoice;

            const index =
              state.invoices.findIndex(
                (item) =>
                  item._id ===
                  updatedInvoice._id
              );

            if (index !== -1) {

              state.invoices[index] =
                updatedInvoice;
            }
          }
        }
      )

      .addCase(
        updateInvoice.rejected,
        (state, action) => {

          state.updating = false;

          state.loading = false;

          state.success = false;

          state.error =
            action.payload ||
            "Failed to update invoice";
        }
      );


    // ==================================================
    // UPDATE PAYMENT STATUS
    // ==================================================

    builder

      .addCase(
        updateInvoiceStatus.pending,
        (state) => {

          state.updating = true;

          state.loading = true;

          state.error = null;

          state.success = false;
        }
      )

      .addCase(
        updateInvoiceStatus.fulfilled,
        (state, action) => {

          state.updating = false;

          state.loading = false;

          state.success = true;

          state.message =
            action.payload?.message ||
            "Payment status updated successfully";

          const updatedInvoice =
            action.payload?.data;

          if (updatedInvoice) {

            state.invoice =
              updatedInvoice;

            const index =
              state.invoices.findIndex(
                (item) =>
                  item._id ===
                  updatedInvoice._id
              );

            if (index !== -1) {

              state.invoices[index] =
                updatedInvoice;
            }
          }
        }
      )

      .addCase(
        updateInvoiceStatus.rejected,
        (state, action) => {

          state.updating = false;

          state.loading = false;

          state.success = false;

          state.error =
            action.payload ||
            "Failed to update payment status";
        }
      );


    // ==================================================
    // MARK INVOICE AS PAID
    // ==================================================

    builder

      .addCase(
        markInvoiceAsPaid.pending,
        (state) => {

          state.updating = true;

          state.loading = true;

          state.error = null;

          state.success = false;
        }
      )

      .addCase(
        markInvoiceAsPaid.fulfilled,
        (state, action) => {

          state.updating = false;

          state.loading = false;

          state.success = true;

          state.message =
            action.payload?.message ||
            "Invoice marked as paid successfully";

          const updatedInvoice =
            action.payload?.data;

          if (updatedInvoice) {

            state.invoice =
              updatedInvoice;

            const index =
              state.invoices.findIndex(
                (item) =>
                  item._id ===
                  updatedInvoice._id
              );

            if (index !== -1) {

              state.invoices[index] =
                updatedInvoice;
            }
          }
        }
      )

      .addCase(
        markInvoiceAsPaid.rejected,
        (state, action) => {

          state.updating = false;

          state.loading = false;

          state.success = false;

          state.error =
            action.payload ||
            "Failed to mark invoice as paid";
        }
      );


    // ==================================================
    // DELETE INVOICE
    // ==================================================

    builder

      .addCase(
        deleteInvoice.pending,
        (state) => {

          state.deleting = true;

          state.loading = true;

          state.error = null;

          state.success = false;
        }
      )

      .addCase(
        deleteInvoice.fulfilled,
        (state, action) => {

          state.deleting = false;

          state.loading = false;

          state.success = true;

          state.message =
            action.payload?.message ||
            "Invoice deleted successfully";

          const deletedId =
            action.payload?.deletedId;

          state.invoices =
            state.invoices.filter(
              (item) =>
                item._id !== deletedId
            );

          if (
            state.invoice?._id ===
            deletedId
          ) {

            state.invoice = null;
          }
        }
      )

      .addCase(
        deleteInvoice.rejected,
        (state, action) => {

          state.deleting = false;

          state.loading = false;

          state.success = false;

          state.error =
            action.payload ||
            "Failed to delete invoice";
        }
      );


    // ==================================================
    // DOWNLOAD INVOICE PDF
    // ==================================================

    builder

      .addCase(
        downloadInvoicePdf.pending,
        (state) => {

          state.downloading = true;

          state.downloadError = null;
        }
      )

      .addCase(
        downloadInvoicePdf.fulfilled,
        (state) => {

          state.downloading = false;

          state.downloadError = null;
        }
      )

      .addCase(
        downloadInvoicePdf.rejected,
        (state, action) => {

          state.downloading = false;

          state.downloadError =
            action.payload ||
            "Failed to download invoice PDF";
        }
      );
  },
});


// ======================================================
// ACTIONS
// ======================================================

export const {
  clearInvoiceError,
  clearInvoiceDownloadError,
  clearInvoiceSuccess,
  clearSelectedInvoice,
  resetInvoiceState,
} = invoiceSlice.actions;


// ======================================================
// SELECTORS
// ======================================================

export const selectInvoices = (state) =>
  state.invoice?.invoices || [];


export const selectInvoice = (state) =>
  state.invoice?.invoice || null;


export const selectInvoiceLoading = (state) =>
  state.invoice?.loading || false;


export const selectInvoiceCreating = (state) =>
  state.invoice?.creating || false;


export const selectInvoiceUpdating = (state) =>
  state.invoice?.updating || false;


export const selectInvoiceDeleting = (state) =>
  state.invoice?.deleting || false;


// ======================================================
// DOWNLOAD SELECTORS
// ======================================================

export const selectInvoiceDownloading = (
  state
) =>
  state.invoice?.downloading || false;


export const selectInvoiceDownloadError = (
  state
) =>
  state.invoice?.downloadError || null;


// ======================================================
// GENERAL SELECTORS
// ======================================================

export const selectInvoiceError = (state) =>
  state.invoice?.error || null;


export const selectInvoiceSuccess = (state) =>
  state.invoice?.success || false;


export const selectInvoiceMessage = (state) =>
  state.invoice?.message || "";


export const selectInvoicePagination = (
  state
) =>
  state.invoice?.pagination || {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  };


export default invoiceSlice.reducer;