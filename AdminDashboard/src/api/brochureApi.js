import axiosInstance from "../redux/axiosInstance";

/* =========================================================
   UPLOAD BROCHURE
========================================================= */

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


/* =========================================================
   GET ALL BROCHURES
========================================================= */

export const getAllBrochuresApi = async () => {
  const response = await axiosInstance.get(
    "/admin/brochures"
  );

  return response.data;
};


/* =========================================================
   GET BROCHURE BY ID
========================================================= */

export const getBrochureByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/admin/brochures/${id}`
  );

  return response.data;
};


/* =========================================================
   UPDATE BROCHURE
========================================================= */

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


/* =========================================================
   DELETE BROCHURE
   Deletes uploaded brochure document
========================================================= */

export const deleteBrochureApi = async (id) => {
  const response = await axiosInstance.delete(
    `/admin/brochures/${id}`
  );

  return response.data;
};


/* =========================================================
   GET ALL BROCHURE DOWNLOAD REQUESTS
========================================================= */

export const getBrochureDownloadRequestsApi =
  async () => {
    const response =
      await axiosInstance.get(
        "/admin/brochures/download-requests"
      );

    return response.data;
  };


/* =========================================================
   GET BROCHURE DOWNLOAD REQUEST BY ID
========================================================= */

export const getBrochureDownloadRequestByIdApi =
  async (id) => {
    if (!id) {
      throw new Error(
        "Brochure download request ID is required"
      );
    }

    const response =
      await axiosInstance.get(
        `/admin/brochures/download-requests/${id}`
      );

    return response.data;
  };


/* =========================================================
   DELETE DOWNLOAD BROCHURE REQUEST
   Deletes record from downloadbrochures collection
========================================================= */

export const deleteDownloadBrochureApi = async (id) => {
  if (!id) {
    throw new Error(
      "Download brochure ID is required"
    );
  }

  const response = await axiosInstance.delete(
    `/admin/brochures/download-requests/${id}`
  );

  return response.data;
};


/* =========================================================
   GET BROCHURE DOWNLOAD STATISTICS
========================================================= */

export const getBrochureDownloadStatsApi =
  async () => {
    const response =
      await axiosInstance.get(
        "/admin/brochures/download-stats"
      );

    return response.data;
  };


/* =========================================================
   DOWNLOAD BROCHURE
========================================================= */

export const downloadBrochureApi = async (id) => {
  const response =
    await axiosInstance.get(
      `/admin/brochures/${id}/download`,
      {
        responseType: "blob",
      }
    );

  return response;
};