import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createReviewApi,
  getAllReviewsApi,
  getReviewByIdApi,
  updateReviewApi,
  deleteReviewApi,
} from "../api/reviewsApis";

// ======================================================
// CREATE REVIEW
// ======================================================

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await createReviewApi(reviewData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create review"
      );
    }
  }
);

// ======================================================
// GET ALL REVIEWS
// ======================================================

export const getAllReviews = createAsyncThunk(
  "reviews/getAllReviews",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getAllReviewsApi(params);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch reviews"
      );
    }
  }
);

// ======================================================
// GET REVIEW BY ID
// ======================================================

export const getReviewById = createAsyncThunk(
  "reviews/getReviewById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getReviewByIdApi(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch review"
      );
    }
  }
);

// ======================================================
// UPDATE REVIEW
// ======================================================

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await updateReviewApi(
        id,
        reviewData
      );

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update review"
      );
    }
  }
);

// ======================================================
// DELETE REVIEW
// ======================================================

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteReviewApi(id);

      return {
        ...response,
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete review"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  reviews: [],
  review: null,

  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  loading: false,
  creating: false,
  updating: false,
  deleting: false,

  error: null,
  success: false,
  message: "",
};

// ======================================================
// SLICE
// ======================================================

const reviewsSlice = createSlice({
  name: "reviews",

  initialState,

  reducers: {
    clearReview: (state) => {
      state.review = null;
    },

    clearReviewError: (state) => {
      state.error = null;
    },

    clearReviewSuccess: (state) => {
      state.success = false;
      state.message = "";
    },

    clearReviewState: (state) => {
      state.review = null;
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ==================================================
      // CREATE REVIEW
      // ==================================================

      .addCase(createReview.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createReview.fulfilled, (state, action) => {
        state.creating = false;
        state.success = true;
        state.message =
          action.payload?.message ||
          "Review created successfully";

        if (action.payload?.data) {
          state.reviews.unshift(action.payload.data);
        }
      })

      .addCase(createReview.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
        state.success = false;
      })

      // ==================================================
      // GET ALL REVIEWS
      // ==================================================

      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;

        state.reviews =
          action.payload?.data || [];

        state.pagination =
          action.payload?.pagination || {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          };

        state.error = null;
      })

      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // GET REVIEW BY ID
      // ==================================================

      .addCase(getReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getReviewById.fulfilled, (state, action) => {
        state.loading = false;

        state.review =
          action.payload?.data || null;

        state.error = null;
      })

      .addCase(getReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // UPDATE REVIEW
      // ==================================================

      .addCase(updateReview.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateReview.fulfilled, (state, action) => {
        state.updating = false;
        state.success = true;

        state.message =
          action.payload?.message ||
          "Review updated successfully";

        const updatedReview =
          action.payload?.data;

        if (updatedReview?._id) {
          const index = state.reviews.findIndex(
            (review) =>
              review._id === updatedReview._id
          );

          if (index !== -1) {
            state.reviews[index] = updatedReview;
          }

          state.review = updatedReview;
        }
      })

      .addCase(updateReview.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
        state.success = false;
      })

      // ==================================================
      // DELETE REVIEW
      // ==================================================

      .addCase(deleteReview.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.success = false;
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deleting = false;
        state.success = true;

        state.message =
          action.payload?.message ||
          "Review deleted successfully";

        const deletedId = action.payload?.id;

        state.reviews = state.reviews.filter(
          (review) => review._id !== deletedId
        );

        if (state.review?._id === deletedId) {
          state.review = null;
        }

        if (state.pagination.total > 0) {
          state.pagination.total -= 1;
        }
      })

      .addCase(deleteReview.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  clearReview,
  clearReviewError,
  clearReviewSuccess,
  clearReviewState,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;