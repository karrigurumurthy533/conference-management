
import axiosInstance from "../redux/axiosInstance";

export const createConferenceApi = (formData) => {
  return axiosInstance.post(
    "/admin/conferences",
    formData
  );
};

export const getConferencesApi = () => {
  return axiosInstance.get(
    "/admin/conferences"
  );
};

export const getConferenceByIdApi = (id) => {
  return axiosInstance.get(
    `/admin/conferences/${id}`
  );
};

export const getSpeakersApi = () => {
  return axiosInstance.get(
    "/admin/speakers"
  );
};

export const getSpeakerByIdApi = (id) => {
  return axiosInstance.get(
    `/admin/speakers/${id}`
  );
};

export const getSpeakersByConferenceApi = (
  conferenceId
) => {
  return axiosInstance.get(
    `/admin/speakers/conference/${conferenceId}`
  );
};

export const createRegistrationApi = async (
  data
) => {
  const response = await axiosInstance.post(
    "/user/registrations",
    data
  );

  return response.data;
};

export const getRegistrationByIdApi = (
  id
) => {
  return axiosInstance.get(
    `/user/registrations/${id}`
  );
};

export const createDownloadBrochureApi = async (
  data
) => {
  const response = await axiosInstance.post(
    "/user/brochures",
    data
  );

  return response.data;
};

export const downloadBrochureApi = async (
  id
) => {
  const response = await axiosInstance.get(
    `/admin/brochures/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response;
};

export const createAbstractApi = async (
  data
) => {
  const response = await axiosInstance.post(
    "/user/abstract",
    data
  );

  return response.data;
};

export const createPaymentOrderApi = (
  registrationId
) => {
  return axiosInstance.post(
    "/payments/create-order",
    {
      registrationId,
    }
  );
};

export const verifyPaymentApi = (data) => {
  return axiosInstance.post(
    "/payments/verify",
    data
  );
};
