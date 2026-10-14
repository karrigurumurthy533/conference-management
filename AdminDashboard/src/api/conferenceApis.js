import axiosInstance from "../redux/axiosInstance";

export const createConferenceApi = (formData) => {
  return axiosInstance.post("/conference/create", formData);
};

export const getConferencesApi = () => {
  return axiosInstance.get("/conference/getAll");
};

export const getConferenceByIdApi = (id) => {
  return axiosInstance.get(`/conference/${id}`);
};

export const updateConferenceApi = ({ id, formData }) => {
  return axiosInstance.put(`/conference/${id}`, formData);
};

export const deleteConferenceApi = (id) => {
  return axiosInstance.delete(`/conference/${id}`);
};

export const publishConferenceApi = (id) => {
  return axiosInstance.patch(`/conference/${id}/publish`);
};