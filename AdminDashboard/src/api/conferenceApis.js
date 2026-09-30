import axiosInstance from "../redux/axiosInstance";

export const createConferenceApi = (formData) => {
  return axiosInstance.post("/admin/conferences", formData);
};

export const getConferencesApi = () => {
  return axiosInstance.get("/admin/conferences");
};

export const getConferenceByIdApi = (id) => {
  return axiosInstance.get(`/admin/conferences/${id}`);
};

export const updateConferenceApi = ({ id, formData }) => {
  return axiosInstance.put(`/admin/conferences/${id}`, formData);
};

export const deleteConferenceApi = (id) => {
  return axiosInstance.delete(`/admin/conferences/${id}`);
};

export const publishConferenceApi = (id) => {
  return axiosInstance.patch(`/admin/conferences/${id}/publish`);
};