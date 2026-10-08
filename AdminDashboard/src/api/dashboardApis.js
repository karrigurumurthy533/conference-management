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


/* =========================================================
   ADMIN ATTENDANCE DASHBOARD
========================================================= */

export const getAdminAttendanceDashboardApi = ({
    month,
    year,
} = {}) => {
    return axiosInstance.get(
        "/admin/Attendence-dashboard",
        {
            params: {
                month,
                year,
            },
        }
    );
};


/* =========================================================
   ALL EMPLOYEE ATTENDANCE
========================================================= */

export const getAllAdminAttendanceApi = ({
    search = "",
    date = "",
    status = "",
    page = 1,
    limit = 10,
} = {}) => {
    return axiosInstance.get(
        "/admin/getAllAtendence",
        {
            params: {
                search,
                date,
                status,
                page,
                limit,
            },
        }
    );
};


/* =========================================================
   SINGLE EMPLOYEE ATTENDANCE
========================================================= */

export const getAdminEmployeeAttendanceApi = (
    id,
    month,
    year
) => {
    return axiosInstance.get(
        `/admin/attendance/${id}`,
        {
            params: {
                month,
                year,
            },
        }
    );
};