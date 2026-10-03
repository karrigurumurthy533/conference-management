
import axiosInstance from "../redux/axiosInstance";

// ======================================================
// Create Registration
// ======================================================

export const createRegistrationApi = async (
  registrationData
) => {
  const response = await axiosInstance.post(
    "/user/registrations",
    registrationData
  );

  return response.data;
};

// ======================================================
// Get All Registrations
// ======================================================

export const getAllRegistrationsApi = async () => {
  const response = await axiosInstance.get(
    "/user/registrations"
  );

  return response.data;
};

// ======================================================
// Get Registration By ID
// ======================================================

export const getRegistrationByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/user/registrations/${id}`
  );

  return response.data;
};

// ======================================================
// Get Conference-Wise Registered Users
// ======================================================
// Example:
// GET /user/registrations/conference/6abe6282115ac55e02fcf168?page=1&limit=10
//
// Returns:
// - Registered users
// - Total registrations
// - Paid registrations
// - Pending registrations
// - Pagination
// ======================================================

export const getRegistrationsByConferenceIdApi = async (
  conferenceId
) => {
  const response = await axiosInstance.get(
    `/user/registrations/conference/${conferenceId}`
  );

  return response.data;
};
// ======================================================
// Delete Registration
// ======================================================

export const deleteRegistrationApi = async (id) => {
  const response = await axiosInstance.delete(
    `/user/registrations/${id}`
  );

  return response.data;
};


