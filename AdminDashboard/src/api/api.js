import axiosInstance from "./axiosInstance";

export const getConferencesApi = () => {
  return axiosInstance.get("/admin/conferences");
};

export const createConferenceApi = (data) => {
  return axiosInstance.post("/admin/conferences", data);
};

export const updateConferenceApi = (id, data) => {
  return axiosInstance.put(`/admin/conferences/${id}`, data);
};

export const deleteConferenceApi = (id) => {
  return axiosInstance.delete(`/admin/conferences/${id}`);
};