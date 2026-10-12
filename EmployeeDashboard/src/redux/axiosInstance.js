import axios from "axios";

// ======================================================
// AXIOS INSTANCE
// ======================================================

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://global-scion-backend.onrender.com/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

axiosInstance.interceptors.request.use(
  (config) => {
    const employeeToken =
      localStorage.getItem("employeeToken");

    const adminToken =
      localStorage.getItem("token");

    // Employee token first, otherwise admin token
    const token =
      employeeToken || adminToken;

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // --------------------------------------------------
    // Unauthorized
    // --------------------------------------------------

    if (error?.response?.status === 401) {
      const employeeToken =
        localStorage.getItem("employeeToken");

      const adminToken =
        localStorage.getItem("token");

      if (employeeToken) {
        localStorage.removeItem("employeeToken");
        localStorage.removeItem("employeeUser");
      }

      if (adminToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;