import axiosInstance from "../redux/axiosInstance";

// ======================================================
// GET ALL ABSTRACTS
// ======================================================
export const getAbstractsApi = (params = {}) => {
  return axiosInstance.get("/user/abstracts", {
    params,
  });
};

// ======================================================
// GET ABSTRACT BY ID
// ======================================================
export const getAbstractByIdApi = (id) => {
  return axiosInstance.get(
    `/user/abstracts/${id}`
  );
};

// ======================================================
// DOWNLOAD ABSTRACT
// ======================================================
export const downloadAbstractApi = (id) => {
  return axiosInstance.get(`/user/abstracts/${id}/download`, {
    responseType: "blob",
  });
};

// ======================================================
// DELETE ABSTRACT
// ======================================================
export const deleteAbstractApi = (id) => {
  return axiosInstance.delete(
    `/user/abstracts/${id}`
  );
};

export default axiosInstance;