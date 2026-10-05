import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteAbstractApi, getAbstractByIdApi, getAbstractsApi } from "../api/abstarctsApi";



/* =========================================================
   GET ALL ABSTRACTS
========================================================= */

export const fetchAbstracts = createAsyncThunk(
  "abstracts/fetchAbstracts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getAbstractsApi(params);

      return (
        response?.data?.data ||
        response?.data ||
        []
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch abstracts"
      );
    }
  }
);

/* =========================================================
   GET ABSTRACT BY ID
========================================================= */

export const fetchAbstractById = createAsyncThunk(
  "abstracts/fetchAbstractById",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await getAbstractByIdApi(id);

      return (
        response?.data?.data ||
        response?.data
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch abstract"
      );
    }
  }
);

/* =========================================================
   DELETE ABSTRACT
========================================================= */

export const deleteAbstract = createAsyncThunk(
  "abstracts/deleteAbstract",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAbstractApi(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to delete abstract"
      );
    }
  }
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  abstracts: [],
  selectedAbstract: null,

  loading: false,
  detailsLoading: false,
  deleteLoading: false,

  error: "",
  detailsError: "",
  deleteError: "",
};

/* =========================================================
   SLICE
========================================================= */

const abstractsSlice = createSlice({
  name: "abstracts",

  initialState,

  reducers: {
    clearSelectedAbstract: (state) => {
      state.selectedAbstract = null;
      state.detailsError = "";
    },

    clearAbstractError: (state) => {
      state.error = "";
    },

    clearAbstractDetailsError: (state) => {
      state.detailsError = "";
    },
  },

  extraReducers: (builder) => {
    /* =====================================================
       FETCH ALL
    ===================================================== */

    builder
      .addCase(
        fetchAbstracts.pending,
        (state) => {
          state.loading = true;
          state.error = "";
        }
      )

      .addCase(
        fetchAbstracts.fulfilled,
        (state, action) => {
          state.loading = false;

          state.abstracts = Array.isArray(
            action.payload
          )
            ? action.payload
            : [];
        }
      )

      .addCase(
        fetchAbstracts.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch abstracts";
        }
      );

    /* =====================================================
       FETCH SINGLE
    ===================================================== */

    builder
      .addCase(
        fetchAbstractById.pending,
        (state) => {
          state.detailsLoading = true;
          state.detailsError = "";
          state.selectedAbstract = null;
        }
      )

      .addCase(
        fetchAbstractById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedAbstract =
            action.payload;
        }
      )

      .addCase(
        fetchAbstractById.rejected,
        (state, action) => {
          state.detailsLoading = false;

          state.detailsError =
            action.payload ||
            "Failed to fetch abstract";
        }
      );

    /* =====================================================
       DELETE
    ===================================================== */

    builder
      .addCase(
        deleteAbstract.pending,
        (state) => {
          state.deleteLoading = true;
          state.deleteError = "";
        }
      )

      .addCase(
        deleteAbstract.fulfilled,
        (state, action) => {
          state.deleteLoading = false;

          state.abstracts =
            state.abstracts.filter(
              (item) =>
                item?._id !== action.payload
            );

          if (
            state.selectedAbstract?._id ===
            action.payload
          ) {
            state.selectedAbstract = null;
          }
        }
      )

      .addCase(
        deleteAbstract.rejected,
        (state, action) => {
          state.deleteLoading = false;

          state.deleteError =
            action.payload ||
            "Failed to delete abstract";
        }
      );
  },
});

export const {
  clearSelectedAbstract,
  clearAbstractError,
  clearAbstractDetailsError,
} = abstractsSlice.actions;

export default abstractsSlice.reducer;