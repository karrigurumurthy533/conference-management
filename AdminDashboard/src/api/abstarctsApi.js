import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// GET ALL ABSTRACTS
// GET /user/abstracts
// ======================================================

export const getAbstractsApi = (params = {}) => {
  return api.get("/user/abstracts", {
    params,
  });
};

// ======================================================
// GET ABSTRACT BY ID
// GET /user/abstracts/:id
// ======================================================

export const getAbstractByIdApi = (id) => {
  return api.get(`/user/abstracts/${id}`);
};

// ======================================================
// DELETE ABSTRACT
// DELETE /user/abstracts/:id
// ======================================================

export const deleteAbstractApi = (id) => {
  return api.delete(`/user/abstracts/${id}`);
};

export default api;