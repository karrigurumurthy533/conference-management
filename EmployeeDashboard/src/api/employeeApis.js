import axiosInstance from "../redux/axiosInstance";

// ======================================================
// EMPLOYEE LOGIN
// ======================================================

export const employeeLoginApi = async (loginData) => {
    const response = await axiosInstance.post(
        "/auth/employee/login",
        loginData
    );

    return response.data;
};

// ======================================================
// EMPLOYEE LOGOUT
// ======================================================

export const employeeLogoutApi = async () => {
    const response = await axiosInstance.post(
        "/auth/employee/logout"
    );

    return response.data;
};

// ======================================================
// GET MY CONFERENCE
// ======================================================

export const getEmployeeConferenceApi = async () => {
    const response = await axiosInstance.get(
        "/employee/my-conference"
    );

    return response.data;
};

// ======================================================
// GET MY SPEAKERS
// ======================================================

export const getMySpeakersApi = async () => {
    const response = await axiosInstance.get(
        "/employee/speakers"
    );

    return response.data;
};

// ======================================================
// GET MY BROCHURES
// ======================================================

export const getMyBrochuresApi = async () => {
    const response = await axiosInstance.get(
        "/employee/brochures"
    );

    return response.data;
};

// ======================================================
// GET MY REGISTRATIONS
// ======================================================

export const getMyRegistrationsApi = async () => {
    const response = await axiosInstance.get(
        "/employee/registrations"
    );

    return response.data;
};

// ======================================================
// GET MY ABSTRACTS
// ======================================================

export const getMyAbstractsApi = async () => {
    const response = await axiosInstance.get(
        "/employee/abstracts"
    );

    return response.data;
};

// ======================================================
// EMPLOYEE DASHBOARD
// ======================================================

export const getEmployeeDashboardApi = async () => {
    const response = await axiosInstance.get(
        "/employee/dashboard"
    );

    return response.data;
};