
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    employeeLoginApi,
    employeeLogoutApi,
    getEmployeeConferenceApi,
    getMySpeakersApi,
    getMyBrochuresApi,
    getMyRegistrationsApi,
    getMyAbstractsApi,
    getEmployeeDashboardApi,

    // ATTENDANCE APIs
    employeeClockInApi,
    employeeClockOutApi,
    getTodayAttendanceApi,
    getMonthlyAttendanceApi,

    // CHANGE PASSWORD API
    changeEmployeePasswordApi,
} from "../api/employeeApis";

// ======================================================
// EMPLOYEE LOGIN
// ======================================================

export const employeeLogin = createAsyncThunk(
    "employee/login",
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await employeeLoginApi(loginData);

            if (response?.token) {
                sessionStorage.setItem("employeeToken", response.token);
            }

            if (response?.user) {
                sessionStorage.setItem(
                    "employeeUser",
                    JSON.stringify(response.user)
                );
            }

            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Employee login failed"
            );
        }
    }
);

// ======================================================
// EMPLOYEE LOGOUT
// ======================================================

export const employeeLogout = createAsyncThunk(
    "employee/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await employeeLogoutApi();

            localStorage.removeItem("employeeToken");
            localStorage.removeItem("employeeUser");
            sessionStorage.removeItem("employeeToken");
            sessionStorage.removeItem("employeeUser");

            return response;
        } catch (error) {
            localStorage.removeItem("employeeToken");
            localStorage.removeItem("employeeUser");
            sessionStorage.removeItem("employeeToken");
            sessionStorage.removeItem("employeeUser");

            return rejectWithValue(
                error?.response?.data?.message ||
                    "Employee logout failed"
            );
        }
    }
);

// ======================================================
// EMPLOYEE CHANGE PASSWORD
// ======================================================

export const changeEmployeePassword = createAsyncThunk(
    "employee/changePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const response =
                await changeEmployeePasswordApi(passwordData);

            // Clear stored credentials only after a successful response.
            if (
                response?.success === true ||
                response?.success === undefined
            ) {
                localStorage.removeItem("employeeToken");
                localStorage.removeItem("employeeUser");

                sessionStorage.removeItem("employeeToken");
                sessionStorage.removeItem("employeeUser");
            }

            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to change password"
            );
        }
    }
);

// ======================================================
// GET MY CONFERENCE
// ======================================================

export const getEmployeeConference = createAsyncThunk(
    "employee/getEmployeeConference",
    async (_, { rejectWithValue }) => {
        try {
            return await getEmployeeConferenceApi();
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch conference"
            );
        }
    }
);

// ======================================================
// GET MY SPEAKERS
// ======================================================

export const getEmployeeSpeakers = createAsyncThunk(
    "employee/getEmployeeSpeakers",
    async (_, { rejectWithValue }) => {
        try {
            return await getMySpeakersApi();
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch speakers"
            );
        }
    }
);

// ======================================================
// GET MY BROCHURES
// ======================================================

export const getEmployeeBrochures = createAsyncThunk(
    "employee/getEmployeeBrochures",
    async (_, { rejectWithValue }) => {
        try {
            return await getMyBrochuresApi();
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch brochures"
            );
        }
    }
);

// ======================================================
// GET MY REGISTRATIONS
// ======================================================

export const getEmployeeRegistrations = createAsyncThunk(
    "employee/getEmployeeRegistrations",
    async (_, { rejectWithValue }) => {
        try {
            return await getMyRegistrationsApi();
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch registrations"
            );
        }
    }
);

// ======================================================
// GET MY ABSTRACTS
// ======================================================

export const getEmployeeAbstracts = createAsyncThunk(
    "employee/getEmployeeAbstracts",
    async (_, { rejectWithValue }) => {
        try {
            return await getMyAbstractsApi();
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch abstracts"
            );
        }
    }
);

// ======================================================
// GET EMPLOYEE DASHBOARD
// ======================================================

export const getEmployeeDashboard = createAsyncThunk(
    "employee/getEmployeeDashboard",
    async (_, { rejectWithValue }) => {
        try {
            return await getEmployeeDashboardApi();
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch dashboard"
            );
        }
    }
);

// ======================================================
// ATTENDANCE - CLOCK IN
// ======================================================

export const employeeClockIn = createAsyncThunk(
    "employee/clockIn",
    async (_, { rejectWithValue }) => {
        try {
            return await employeeClockInApi();
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Clock-in failed"
            );
        }
    }
);

// ======================================================
// ATTENDANCE - CLOCK OUT
// ======================================================

export const employeeClockOut = createAsyncThunk(
    "employee/clockOut",
    async (_, { rejectWithValue }) => {
        try {
            return await employeeClockOutApi();
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Clock-out failed"
            );
        }
    }
);

// ======================================================
// ATTENDANCE - TODAY
// ======================================================

export const getTodayAttendance = createAsyncThunk(
    "employee/getTodayAttendance",
    async (_, { rejectWithValue }) => {
        try {
            return await getTodayAttendanceApi();
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch today's attendance"
            );
        }
    }
);

// ======================================================
// ATTENDANCE - MONTHLY
// ======================================================

export const getMonthlyAttendance = createAsyncThunk(
    "employee/getMonthlyAttendance",
    async ({ month, year }, { rejectWithValue }) => {
        try {
            return await getMonthlyAttendanceApi(month, year);
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch monthly attendance"
            );
        }
    }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    // Employee Authentication
    employee:
        JSON.parse(sessionStorage.getItem("employeeUser")) || null,

    token: sessionStorage.getItem("employeeToken") || null,

    loading: false,
    error: null,
    success: false,

    // Change Password
    changePasswordLoading: false,
    changePasswordError: null,
    changePasswordSuccess: false,
    changePasswordMessage: null,

    // My Conference
    conference: null,
    conferenceLoading: false,
    conferenceError: null,

    // My Speakers
    speakers: [],
    speakersLoading: false,
    speakersError: null,

    // My Brochures
    brochures: [],
    brochuresLoading: false,
    brochuresError: null,

    // My Registrations
    registrations: [],
    registrationsLoading: false,
    registrationsError: null,

    // My Abstracts
    abstracts: [],
    abstractsLoading: false,
    abstractsError: null,

    // Dashboard
    dashboard: null,
    dashboardLoading: false,
    dashboardError: null,

    // Attendance
    todayAttendance: null,
    todayAttendanceLoading: false,
    todayAttendanceError: null,

    monthlyAttendance: null,
    monthlyAttendanceLoading: false,
    monthlyAttendanceError: null,

    clockInLoading: false,
    clockInError: null,

    clockOutLoading: false,
    clockOutError: null,

    attendanceSuccess: false,
    attendanceMessage: null,
};

// ======================================================
// SLICE
// ======================================================

const employeeSlice = createSlice({
    name: "employee",
    initialState,

    reducers: {
        clearEmployeeError: (state) => {
            state.error = null;
        },

        clearEmployeeSuccess: (state) => {
            state.success = false;
        },

        clearChangePasswordState: (state) => {
            state.changePasswordError = null;
            state.changePasswordSuccess = false;
            state.changePasswordMessage = null;
        },

        clearConferenceError: (state) => {
            state.conferenceError = null;
        },

        clearSpeakersError: (state) => {
            state.speakersError = null;
        },

        clearBrochuresError: (state) => {
            state.brochuresError = null;
        },

        clearRegistrationsError: (state) => {
            state.registrationsError = null;
        },

        clearAbstractsError: (state) => {
            state.abstractsError = null;
        },

        clearDashboardError: (state) => {
            state.dashboardError = null;
        },

        clearAttendanceError: (state) => {
            state.todayAttendanceError = null;
            state.monthlyAttendanceError = null;
            state.clockInError = null;
            state.clockOutError = null;
        },

        clearAttendanceSuccess: (state) => {
            state.attendanceSuccess = false;
            state.attendanceMessage = null;
        },

        clearEmployeeData: (state) => {
            state.conference = null;
            state.speakers = [];
            state.brochures = [];
            state.registrations = [];
            state.abstracts = [];
            state.dashboard = null;

            state.todayAttendance = null;
            state.monthlyAttendance = null;
            state.todayAttendanceError = null;
            state.monthlyAttendanceError = null;
            state.clockInError = null;
            state.clockOutError = null;
            state.attendanceSuccess = false;
            state.attendanceMessage = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ==========================================
            // EMPLOYEE LOGIN
            // ==========================================

            .addCase(employeeLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })

            .addCase(employeeLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                state.token = action.payload?.token || null;
                state.employee = action.payload?.user || null;
            })

            .addCase(employeeLogin.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload || "Employee login failed";
            })

            // ==========================================
            // EMPLOYEE LOGOUT
            // ==========================================

            .addCase(employeeLogout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(employeeLogout.fulfilled, (state) => {
                state.employee = null;
                state.token = null;

                state.loading = false;
                state.error = null;
                state.success = false;

                state.conference = null;
                state.speakers = [];
                state.brochures = [];
                state.registrations = [];
                state.abstracts = [];
                state.dashboard = null;

                state.todayAttendance = null;
                state.monthlyAttendance = null;

                state.todayAttendanceError = null;
                state.monthlyAttendanceError = null;
                state.clockInError = null;
                state.clockOutError = null;

                state.attendanceSuccess = false;
                state.attendanceMessage = null;
            })

            .addCase(employeeLogout.rejected, (state, action) => {
                state.employee = null;
                state.token = null;

                state.loading = false;
                state.success = false;

                state.conference = null;
                state.speakers = [];
                state.brochures = [];
                state.registrations = [];
                state.abstracts = [];
                state.dashboard = null;

                state.todayAttendance = null;
                state.monthlyAttendance = null;

                state.todayAttendanceError = null;
                state.monthlyAttendanceError = null;
                state.clockInError = null;
                state.clockOutError = null;

                state.attendanceSuccess = false;
                state.attendanceMessage = null;

                state.error =
                    action.payload || "Employee logout failed";
            })

            // ==========================================
            // CHANGE PASSWORD
            // ==========================================

            .addCase(changeEmployeePassword.pending, (state) => {
                state.changePasswordLoading = true;
                state.changePasswordError = null;
                state.changePasswordSuccess = false;
                state.changePasswordMessage = null;
            })

            .addCase(
                changeEmployeePassword.fulfilled,
                (state, action) => {
                    state.changePasswordLoading = false;
                    state.changePasswordError = null;
                    state.changePasswordSuccess = true;

                    state.changePasswordMessage =
                        action.payload?.message ||
                        "Password changed successfully";

                    // Clear Redux authentication state.
                    state.employee = null;
                    state.token = null;

                    // Clear protected employee data.
                    state.conference = null;
                    state.speakers = [];
                    state.brochures = [];
                    state.registrations = [];
                    state.abstracts = [];
                    state.dashboard = null;

                    state.todayAttendance = null;
                    state.monthlyAttendance = null;

                    state.attendanceSuccess = false;
                    state.attendanceMessage = null;
                }
            )

            .addCase(
                changeEmployeePassword.rejected,
                (state, action) => {
                    state.changePasswordLoading = false;
                    state.changePasswordSuccess = false;

                    state.changePasswordError =
                        action.payload ||
                        "Failed to change password";

                    state.changePasswordMessage = null;
                }
            )

            // ==========================================
            // MY CONFERENCE
            // ==========================================

            .addCase(getEmployeeConference.pending, (state) => {
                state.conferenceLoading = true;
                state.conferenceError = null;
            })

            .addCase(
                getEmployeeConference.fulfilled,
                (state, action) => {
                    state.conferenceLoading = false;
                    state.conferenceError = null;

                    const data = action.payload?.data || [];

                    state.conference = Array.isArray(data)
                        ? data[0] || null
                        : data;
                }
            )

            .addCase(
                getEmployeeConference.rejected,
                (state, action) => {
                    state.conferenceLoading = false;
                    state.conferenceError =
                        action.payload || "Failed to fetch conference";
                }
            )

            // ==========================================
            // MY SPEAKERS
            // ==========================================

            .addCase(getEmployeeSpeakers.pending, (state) => {
                state.speakersLoading = true;
                state.speakersError = null;
            })

            .addCase(
                getEmployeeSpeakers.fulfilled,
                (state, action) => {
                    state.speakersLoading = false;
                    state.speakersError = null;
                    state.speakers = action.payload?.data || [];
                }
            )

            .addCase(
                getEmployeeSpeakers.rejected,
                (state, action) => {
                    state.speakersLoading = false;
                    state.speakersError =
                        action.payload || "Failed to fetch speakers";
                }
            )

            // ==========================================
            // MY BROCHURES
            // ==========================================

            .addCase(getEmployeeBrochures.pending, (state) => {
                state.brochuresLoading = true;
                state.brochuresError = null;
            })

            .addCase(
                getEmployeeBrochures.fulfilled,
                (state, action) => {
                    state.brochuresLoading = false;
                    state.brochuresError = null;
                    state.brochures = action.payload?.data || [];
                }
            )

            .addCase(
                getEmployeeBrochures.rejected,
                (state, action) => {
                    state.brochuresLoading = false;
                    state.brochuresError =
                        action.payload || "Failed to fetch brochures";
                }
            )

            // ==========================================
            // MY REGISTRATIONS
            // ==========================================

            .addCase(getEmployeeRegistrations.pending, (state) => {
                state.registrationsLoading = true;
                state.registrationsError = null;
            })

            .addCase(
                getEmployeeRegistrations.fulfilled,
                (state, action) => {
                    state.registrationsLoading = false;
                    state.registrationsError = null;
                    state.registrations = action.payload?.data || [];
                }
            )

            .addCase(
                getEmployeeRegistrations.rejected,
                (state, action) => {
                    state.registrationsLoading = false;
                    state.registrationsError =
                        action.payload || "Failed to fetch registrations";
                }
            )

            // ==========================================
            // MY ABSTRACTS
            // ==========================================

            .addCase(getEmployeeAbstracts.pending, (state) => {
                state.abstractsLoading = true;
                state.abstractsError = null;
            })

            .addCase(
                getEmployeeAbstracts.fulfilled,
                (state, action) => {
                    state.abstractsLoading = false;
                    state.abstractsError = null;
                    state.abstracts = action.payload?.data || [];
                }
            )

            .addCase(
                getEmployeeAbstracts.rejected,
                (state, action) => {
                    state.abstractsLoading = false;
                    state.abstractsError =
                        action.payload || "Failed to fetch abstracts";
                }
            )

            // ==========================================
            // EMPLOYEE DASHBOARD
            // ==========================================

            .addCase(getEmployeeDashboard.pending, (state) => {
                state.dashboardLoading = true;
                state.dashboardError = null;
            })

            .addCase(
                getEmployeeDashboard.fulfilled,
                (state, action) => {
                    state.dashboardLoading = false;
                    state.dashboardError = null;
                    state.dashboard = action.payload?.data || null;
                }
            )

            .addCase(
                getEmployeeDashboard.rejected,
                (state, action) => {
                    state.dashboardLoading = false;
                    state.dashboardError =
                        action.payload || "Failed to fetch dashboard";
                }
            )

            // ==========================================
            // ATTENDANCE - CLOCK IN
            // ==========================================

            .addCase(employeeClockIn.pending, (state) => {
                state.clockInLoading = true;
                state.clockInError = null;
                state.attendanceSuccess = false;
                state.attendanceMessage = null;
            })

            .addCase(
                employeeClockIn.fulfilled,
                (state, action) => {
                    state.clockInLoading = false;
                    state.clockInError = null;
                    state.attendanceSuccess = true;

                    state.attendanceMessage =
                        action.payload?.message || "Clock-in successful";

                    if (action.payload?.data) {
                        state.todayAttendance = {
                            ...state.todayAttendance,
                            ...action.payload.data,
                        };
                    }
                }
            )

            .addCase(
                employeeClockIn.rejected,
                (state, action) => {
                    state.clockInLoading = false;
                    state.attendanceSuccess = false;
                    state.clockInError =
                        action.payload || "Clock-in failed";
                    state.attendanceMessage = null;
                }
            )

            // ==========================================
            // ATTENDANCE - CLOCK OUT
            // ==========================================

            .addCase(employeeClockOut.pending, (state) => {
                state.clockOutLoading = true;
                state.clockOutError = null;
                state.attendanceSuccess = false;
                state.attendanceMessage = null;
            })

            .addCase(
                employeeClockOut.fulfilled,
                (state, action) => {
                    state.clockOutLoading = false;
                    state.clockOutError = null;
                    state.attendanceSuccess = true;

                    state.attendanceMessage =
                        action.payload?.message || "Clock-out successful";

                    if (action.payload?.data) {
                        state.todayAttendance = {
                            ...state.todayAttendance,
                            ...action.payload.data,
                        };
                    }
                }
            )

            .addCase(
                employeeClockOut.rejected,
                (state, action) => {
                    state.clockOutLoading = false;
                    state.attendanceSuccess = false;
                    state.clockOutError =
                        action.payload || "Clock-out failed";
                    state.attendanceMessage = null;
                }
            )

            // ==========================================
            // ATTENDANCE - TODAY
            // ==========================================

            .addCase(getTodayAttendance.pending, (state) => {
                state.todayAttendanceLoading = true;
                state.todayAttendanceError = null;
            })

            .addCase(
                getTodayAttendance.fulfilled,
                (state, action) => {
                    state.todayAttendanceLoading = false;
                    state.todayAttendanceError = null;
                    state.todayAttendance = action.payload?.data || null;
                }
            )

            .addCase(
                getTodayAttendance.rejected,
                (state, action) => {
                    state.todayAttendanceLoading = false;
                    state.todayAttendanceError =
                        action.payload ||
                        "Failed to fetch today's attendance";
                }
            )

            // ==========================================
            // ATTENDANCE - MONTHLY
            // ==========================================

            .addCase(getMonthlyAttendance.pending, (state) => {
                state.monthlyAttendanceLoading = true;
                state.monthlyAttendanceError = null;
            })

            .addCase(
                getMonthlyAttendance.fulfilled,
                (state, action) => {
                    state.monthlyAttendanceLoading = false;
                    state.monthlyAttendanceError = null;
                    state.monthlyAttendance = action.payload?.data || null;
                }
            )

            .addCase(
                getMonthlyAttendance.rejected,
                (state, action) => {
                    state.monthlyAttendanceLoading = false;
                    state.monthlyAttendanceError =
                        action.payload ||
                        "Failed to fetch monthly attendance";
                }
            );
    },
});

// ======================================================
// ACTIONS
// ======================================================

export const {
    clearEmployeeError,
    clearEmployeeSuccess,
    clearChangePasswordState,

    clearConferenceError,
    clearSpeakersError,
    clearBrochuresError,
    clearRegistrationsError,
    clearAbstractsError,
    clearDashboardError,

    clearAttendanceError,
    clearAttendanceSuccess,

    clearEmployeeData,
} = employeeSlice.actions;

// ======================================================
// EMPLOYEE SELECTORS
// ======================================================

export const selectEmployee = (state) =>
    state.employee.employee;

export const selectEmployeeToken = (state) =>
    state.employee.token;

export const selectEmployeeLoading = (state) =>
    state.employee.loading;

export const selectEmployeeError = (state) =>
    state.employee.error;

export const selectEmployeeSuccess = (state) =>
    state.employee.success;

// Change Password selectors
export const selectChangePasswordLoading = (state) =>
    state.employee.changePasswordLoading;

export const selectChangePasswordError = (state) =>
    state.employee.changePasswordError;

export const selectChangePasswordSuccess = (state) =>
    state.employee.changePasswordSuccess;

export const selectChangePasswordMessage = (state) =>
    state.employee.changePasswordMessage;

// ======================================================
// CONFERENCE SELECTORS
// ======================================================

export const selectEmployeeConference = (state) =>
    state.employee.conference;

export const selectEmployeeConferenceLoading = (state) =>
    state.employee.conferenceLoading;

export const selectEmployeeConferenceError = (state) =>
    state.employee.conferenceError;

// ======================================================
// SPEAKERS SELECTORS
// ======================================================

export const selectEmployeeSpeakers = (state) =>
    state.employee.speakers;

export const selectEmployeeSpeakersLoading = (state) =>
    state.employee.speakersLoading;

export const selectEmployeeSpeakersError = (state) =>
    state.employee.speakersError;

// ======================================================
// BROCHURES SELECTORS
// ======================================================

export const selectEmployeeBrochures = (state) =>
    state.employee.brochures;

export const selectEmployeeBrochuresLoading = (state) =>
    state.employee.brochuresLoading;

export const selectEmployeeBrochuresError = (state) =>
    state.employee.brochuresError;

// ======================================================
// REGISTRATIONS SELECTORS
// ======================================================

export const selectEmployeeRegistrations = (state) =>
    state.employee.registrations;

export const selectEmployeeRegistrationsLoading = (state) =>
    state.employee.registrationsLoading;

export const selectEmployeeRegistrationsError = (state) =>
    state.employee.registrationsError;

// ======================================================
// ABSTRACTS SELECTORS
// ======================================================

export const selectEmployeeAbstracts = (state) =>
    state.employee.abstracts;

export const selectEmployeeAbstractsLoading = (state) =>
    state.employee.abstractsLoading;

export const selectEmployeeAbstractsError = (state) =>
    state.employee.abstractsError;

// ======================================================
// DASHBOARD SELECTORS
// ======================================================

export const selectEmployeeDashboard = (state) =>
    state.employee.dashboard;

export const selectEmployeeDashboardLoading = (state) =>
    state.employee.dashboardLoading;

export const selectEmployeeDashboardError = (state) =>
    state.employee.dashboardError;

// ======================================================
// ATTENDANCE SELECTORS
// ======================================================

export const selectTodayAttendance = (state) =>
    state.employee.todayAttendance;

export const selectTodayAttendanceLoading = (state) =>
    state.employee.todayAttendanceLoading;

export const selectTodayAttendanceError = (state) =>
    state.employee.todayAttendanceError;

export const selectMonthlyAttendance = (state) =>
    state.employee.monthlyAttendance;

export const selectMonthlyAttendanceLoading = (state) =>
    state.employee.monthlyAttendanceLoading;

export const selectMonthlyAttendanceError = (state) =>
    state.employee.monthlyAttendanceError;

export const selectClockInLoading = (state) =>
    state.employee.clockInLoading;

export const selectClockInError = (state) =>
    state.employee.clockInError;

export const selectClockOutLoading = (state) =>
    state.employee.clockOutLoading;

export const selectClockOutError = (state) =>
    state.employee.clockOutError;

export const selectAttendanceSuccess = (state) =>
    state.employee.attendanceSuccess;

export const selectAttendanceMessage = (state) =>
    state.employee.attendanceMessage;

// ======================================================
// REDUCER
// ======================================================

export default employeeSlice.reducer;
