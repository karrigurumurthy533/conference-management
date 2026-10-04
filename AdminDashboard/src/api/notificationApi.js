import axiosInstance from "../redux/axiosInstance";

// ======================================================
// GET ALL NOTIFICATIONS
// ======================================================

export const getAllNotificationsApi = async (params = {}) => {
  const response = await axiosInstance.get(
    "/notification",
    {
      params,
    }
  );

  return response.data;
};

// ======================================================
// GET NOTIFICATION BY ID
// ======================================================

export const getNotificationByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/notification/${id}`
  );

  return response.data;
};

// ======================================================
// MARK NOTIFICATION AS READ
// ======================================================

export const markNotificationAsReadApi = async (id) => {
  const response = await axiosInstance.patch(
    `/notification/${id}/read`
  );

  return response.data;
};

// ======================================================
// MARK ALL NOTIFICATIONS AS READ
// ======================================================

export const markAllNotificationsAsReadApi = async () => {
  const response = await axiosInstance.patch(
    "/notification/read-all"
  );

  return response.data;
};

// ======================================================
// DELETE NOTIFICATION
// ======================================================

export const deleteNotificationApi = async (id) => {
  const response = await axiosInstance.delete(
    `/notification/${id}`
  );

  return response.data;
};