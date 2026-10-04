import axiosInstance from "../redux/axiosInstance";

// ======================================================
// CREATE REVIEW
// ======================================================

export const createReviewApi = async (reviewData) => {
  const response = await axiosInstance.post(
    "/admin/reviews",
    reviewData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ======================================================
// GET ALL REVIEWS
// ======================================================

export const getAllReviewsApi = async (params = {}) => {
  const response = await axiosInstance.get(
    "/admin/reviews",
    {
      params,
    }
  );

  return response.data;
};

// ======================================================
// GET REVIEW BY ID
// ======================================================

export const getReviewByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/admin/reviews/${id}`
  );

  return response.data;
};

// ======================================================
// UPDATE REVIEW
// ======================================================

export const updateReviewApi = async (id, reviewData) => {
  const response = await axiosInstance.put(
    `/admin/reviews/${id}`,
    reviewData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ======================================================
// DELETE REVIEW
// ======================================================

export const deleteReviewApi = async (id) => {
  const response = await axiosInstance.delete(
    `/admin/reviews/${id}`
  );

  return response.data;
};