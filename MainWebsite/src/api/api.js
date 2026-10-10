
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


export const createAbstractApi = async (data) => {
  if (!(data instanceof FormData)) {
    throw new Error("Abstract submission must use FormData.");
  }

  const file = data.get("file");

  if (!(file instanceof File)) {
    throw new Error("Please select a valid file.");
  }

  console.log("File before API request:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  const response = await axiosInstance.post(
    "/user/abstract",
    data,
    {
      // Keep FormData intact; do not JSON.stringify it.
      // Axios/browser should generate the multipart boundary.
      transformRequest: [(formData) => formData],
    }
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


export const sendContactApi = async (contactData) => {
  const response = await axiosInstance.post(
    "/contact",
    contactData
  );

  return response.data;
};

export const subscribeApi = async (subscriberData) => {
  const response = await axiosInstance.post(
    "/user/subscribe",
    subscriberData
  );

  return response.data;
};


export const getAllReviewsApi = async (params = {}) => {
  const response = await axiosInstance.get(
    "/admin/reviews",
    {
      params,
    }
  );

  return response.data;
};

