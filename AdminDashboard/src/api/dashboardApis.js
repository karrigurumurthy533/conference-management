import axiosInstance from "../redux/axiosInstance";


export const getAdminStatisticsApi = () => {
  return axiosInstance.get(
    "/dashboard/adminstats"
  );
};

export const getAdminDashboardOverviewApi = () => {
  return axiosInstance.get(
    "/dashboard/overview"
  );
};