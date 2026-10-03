import axiosInstance from "../redux/axiosInstance";

export const uploadBrochureApi = async (formData) => {
  const response = await axiosInstance.post(
    "/admin/brochures",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getAllBrochuresApi = async () => {
  const response = await axiosInstance.get(
    "/admin/brochures"
  );

  return response.data;
};

export const getBrochureByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/admin/brochures/${id}`
  );

  return response.data;
};

export const updateBrochureApi = async (
  id,
  formData
) => {
  const response = await axiosInstance.put(
    `/admin/brochures/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteBrochureApi = async (id) => {
  const response = await axiosInstance.delete(
    `/admin/brochures/${id}`
  );

  return response.data;
};

export const getBrochureDownloadRequestsApi = async () => {
    const response = await axiosInstance.get(
      "/admin/brochures/download-requests"
    );

    return response.data;
  };

export const getBrochureDownloadStatsApi = async () => {
    const response = await axiosInstance.get(
      "/admin/brochures/download-stats"
    );

    return response.data;
  };

export const downloadBrochureApi = async (id) => {
  const response = await axiosInstance.get(
    `/admin/brochures/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response;
};