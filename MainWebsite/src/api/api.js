import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/user",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// REGISTRATION
// ============================================================

export const createRegistrationApi = async (data) => {
  const response = await API.post("/registrations", data);

  return response.data;
};

// ============================================================
// DOWNLOAD BROCHURE
// ============================================================

export const createDownloadBrochureApi = async (data) => {
  const response = await API.post("/download-brochure", data);

  return response.data;
};

// ============================================================
// ABSTRACT
// ============================================================

export const createAbstractApi = async (data) => {
  const response = await API.post("/abstract", data);

  return response.data;
};

export default API;