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

    // ==================================================
    // ATTENDANCE APIs
    // ==================================================
    employeeClockInApi,
    employeeClockOutApi,
    getTodayAttendanceApi,
    getMonthlyAttendanceApi,
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
                localStorage.setItem(
                    "employeeToken",
                    response.token
                );
            }

            if (response?.user) {
                localStorage.setItem(
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

            return response;
        } catch (error) {
            localStorage.removeItem("employeeToken");
            localStorage.removeItem("employeeUser");

            return rejectWithValue(
                error?.response?.data?.message ||
                    "Employee logout failed"
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
            const response =
                await getEmployeeConferenceApi();

            return response;
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
            const response =
                await getMySpeakersApi();

            return response;
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
            const response =
                await getMyBrochuresApi();

            return response;
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
            const response =
                await getMyRegistrationsApi();

            return response;
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
            const response =
                await getMyAbstractsApi();

            return response;
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
            const response =
                await getEmployeeDashboardApi();

            return response;
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
            const response =
                await employeeClockInApi();

            return response;
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
            const response =
                await employeeClockOutApi();

            return response;
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
            const response =
                await getTodayAttendanceApi();

            return response;
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
    async (
        { month, year },
        { rejectWithValue }
    ) => {
        try {
            const response =
                await getMonthlyAttendanceApi(
                    month,
                    year
                );

            return response;
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
    // ==================================================
    // Employee Authentication
    // ==================================================

    employee:
        JSON.parse(
            localStorage.getItem("employeeUser")
        ) || null,

    token:
        localStorage.getItem("employeeToken") || null,

    loading: false,
    error: null,
    success: false,

    // ==================================================
    // My Conference
    // ==================================================

    conference: null,
    conferenceLoading: false,
    conferenceError: null,

    // ==================================================
    // My Speakers
    // ==================================================

    speakers: [],
    speakersLoading: false,
    speakersError: null,

    // ==================================================
    // My Brochures
    // ==================================================

    brochures: [],
    brochuresLoading: false,
    brochuresError: null,

    // ==================================================
    // My Registrations
    // ==================================================

    registrations: [],
    registrationsLoading: false,
    registrationsError: null,

    // ==================================================
    // My Abstracts
    // ==================================================

    abstracts: [],
    abstractsLoading: false,
    abstractsError: null,

    // ==================================================
    // Dashboard
    // ==================================================

    dashboard: null,
    dashboardLoading: false,
    dashboardError: null,

    // ==================================================
    // ATTENDANCE
    // ==================================================

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
        // ==================================================
        // CLEAR EMPLOYEE ERROR
        // ==================================================

        clearEmployeeError: (state) => {
            state.error = null;
        },

        // ==================================================
        // CLEAR SUCCESS
        // ==================================================

        clearEmployeeSuccess: (state) => {
            state.success = false;
        },

        // ==================================================
        // CLEAR CONFERENCE ERROR
        // ==================================================

        clearConferenceError: (state) => {
            state.conferenceError = null;
        },

        // ==================================================
        // CLEAR SPEAKERS ERROR
        // ==================================================

        clearSpeakersError: (state) => {
            state.speakersError = null;
        },

        // ==================================================
        // CLEAR BROCHURES ERROR
        // ==================================================

        clearBrochuresError: (state) => {
            state.brochuresError = null;
        },

        // ==================================================
        // CLEAR REGISTRATIONS ERROR
        // ==================================================

        clearRegistrationsError: (state) => {
            state.registrationsError = null;
        },

        // ==================================================
        // CLEAR ABSTRACTS ERROR
        // ==================================================

        clearAbstractsError: (state) => {
            state.abstractsError = null;
        },

        // ==================================================
        // CLEAR DASHBOARD ERROR
        // ==================================================

        clearDashboardError: (state) => {
            state.dashboardError = null;
        },

        // ==================================================
        // CLEAR ATTENDANCE ERROR
        // ==================================================

        clearAttendanceError: (state) => {
            state.todayAttendanceError = null;
            state.monthlyAttendanceError = null;
            state.clockInError = null;
            state.clockOutError = null;
        },

        // ==================================================
        // CLEAR ATTENDANCE SUCCESS
        // ==================================================

        clearAttendanceSuccess: (state) => {
            state.attendanceSuccess = false;
            state.attendanceMessage = null;
        },

        // ==================================================
        // CLEAR ALL EMPLOYEE DATA
        // ==================================================

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

            // ==================================================
            // EMPLOYEE LOGIN
            // ==================================================

            .addCase(
                employeeLogin.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                employeeLogin.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    state.token =
                        action.payload?.token || null;

                    state.employee =
                        action.payload?.user || null;
                }
            )

            .addCase(
                employeeLogin.rejected,
                (state, action) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Employee login failed";
                }
            )

            // ==================================================
            // EMPLOYEE LOGOUT
            // ==================================================

            .addCase(
                employeeLogout.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                employeeLogout.fulfilled,
                (state) => {
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
                }
            )

            .addCase(
                employeeLogout.rejected,
                (state, action) => {
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
                        action.payload ||
                        "Employee logout failed";
                }
            )

            // ==================================================
            // MY CONFERENCE
            // ==================================================

            .addCase(
                getEmployeeConference.pending,
                (state) => {
                    state.conferenceLoading = true;
                    state.conferenceError = null;
                }
            )

            .addCase(
                getEmployeeConference.fulfilled,
                (state, action) => {
                    state.conferenceLoading = false;
                    state.conferenceError = null;

                    const data =
                        action.payload?.data || [];

                    state.conference =
                        Array.isArray(data)
                            ? data[0] || null
                            : data;
                }
            )

            .addCase(
                getEmployeeConference.rejected,
                (state, action) => {
                    state.conferenceLoading = false;

                    state.conferenceError =
                        action.payload ||
                        "Failed to fetch conference";
                }
            )

            // ==================================================
            // MY SPEAKERS
            // ==================================================

            .addCase(
                getEmployeeSpeakers.pending,
                (state) => {
                    state.speakersLoading = true;
                    state.speakersError = null;
                }
            )

            .addCase(
                getEmployeeSpeakers.fulfilled,
                (state, action) => {
                    state.speakersLoading = false;
                    state.speakersError = null;

                    state.speakers =
                        action.payload?.data || [];
                }
            )

            .addCase(
                getEmployeeSpeakers.rejected,
                (state, action) => {
                    state.speakersLoading = false;

                    state.speakersError =
                        action.payload ||
                        "Failed to fetch speakers";
                }
            )

            // ==================================================
            // MY BROCHURES
            // ==================================================

            .addCase(
                getEmployeeBrochures.pending,
                (state) => {
                    state.brochuresLoading = true;
                    state.brochuresError = null;
                }
            )

            .addCase(
                getEmployeeBrochures.fulfilled,
                (state, action) => {
                    state.brochuresLoading = false;
                    state.brochuresError = null;

                    state.brochures =
                        action.payload?.data || [];
                }
            )

            .addCase(
                getEmployeeBrochures.rejected,
                (state, action) => {
                    state.brochuresLoading = false;

                    state.brochuresError =
                        action.payload ||
                        "Failed to fetch brochures";
                }
            )

            // ==================================================
            // MY REGISTRATIONS
            // ==================================================

            .addCase(
                getEmployeeRegistrations.pending,
                (state) => {
                    state.registrationsLoading = true;
                    state.registrationsError = null;
                }
            )

            .addCase(
                getEmployeeRegistrations.fulfilled,
                (state, action) => {
                    state.registrationsLoading = false;
                    state.registrationsError = null;

                    state.registrations =
                        action.payload?.data || [];
                }
            )

            .addCase(
                getEmployeeRegistrations.rejected,
                (state, action) => {
                    state.registrationsLoading = false;

                    state.registrationsError =
                        action.payload ||
                        "Failed to fetch registrations";
                }
            )

            // ==================================================
            // MY ABSTRACTS
            // ==================================================

            .addCase(
                getEmployeeAbstracts.pending,
                (state) => {
                    state.abstractsLoading = true;
                    state.abstractsError = null;
                }
            )

            .addCase(
                getEmployeeAbstracts.fulfilled,
                (state, action) => {
                    state.abstractsLoading = false;
                    state.abstractsError = null;

                    state.abstracts =
                        action.payload?.data || [];
                }
            )

            .addCase(
                getEmployeeAbstracts.rejected,
                (state, action) => {
                    state.abstractsLoading = false;

                    state.abstractsError =
                        action.payload ||
                        "Failed to fetch abstracts";
                }
            )

            // ==================================================
            // EMPLOYEE DASHBOARD
            // ==================================================

            .addCase(
                getEmployeeDashboard.pending,
                (state) => {
                    state.dashboardLoading = true;
                    state.dashboardError = null;
                }
            )

            .addCase(
                getEmployeeDashboard.fulfilled,
                (state, action) => {
                    state.dashboardLoading = false;
                    state.dashboardError = null;

                    state.dashboard =
                        action.payload?.data || null;
                }
            )

            .addCase(
                getEmployeeDashboard.rejected,
                (state, action) => {
                    state.dashboardLoading = false;

                    state.dashboardError =
                        action.payload ||
                        "Failed to fetch dashboard";
                }
            )

            // ==================================================
            // ATTENDANCE - CLOCK IN
            // ==================================================

            .addCase(
                employeeClockIn.pending,
                (state) => {
                    state.clockInLoading = true;
                    state.clockInError = null;
                    state.attendanceSuccess = false;
                    state.attendanceMessage = null;
                }
            )

            .addCase(
                employeeClockIn.fulfilled,
                (state, action) => {
                    state.clockInLoading = false;
                    state.clockInError = null;

                    state.attendanceSuccess = true;

                    state.attendanceMessage =
                        action.payload?.message ||
                        "Clock-in successful";

                    /*
                     * Backend returns:
                     *
                     * data: {
                     *   attendanceId,
                     *   employeeId,
                     *   fullName,
                     *   date,
                     *   checkIn,
                     *   status
                     * }
                     */

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
                        action.payload ||
                        "Clock-in failed";

                    state.attendanceMessage = null;
                }
            )

            // ==================================================
            // ATTENDANCE - CLOCK OUT
            // ==================================================

            .addCase(
                employeeClockOut.pending,
                (state) => {
                    state.clockOutLoading = true;
                    state.clockOutError = null;
                    state.attendanceSuccess = false;
                    state.attendanceMessage = null;
                }
            )

            .addCase(
                employeeClockOut.fulfilled,
                (state, action) => {
                    state.clockOutLoading = false;
                    state.clockOutError = null;

                    state.attendanceSuccess = true;

                    state.attendanceMessage =
                        action.payload?.message ||
                        "Clock-out successful";

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
                        action.payload ||
                        "Clock-out failed";

                    state.attendanceMessage = null;
                }
            )

            // ==================================================
            // ATTENDANCE - TODAY
            // ==================================================

            .addCase(
                getTodayAttendance.pending,
                (state) => {
                    state.todayAttendanceLoading = true;
                    state.todayAttendanceError = null;
                }
            )

            .addCase(
                getTodayAttendance.fulfilled,
                (state, action) => {
                    state.todayAttendanceLoading = false;
                    state.todayAttendanceError = null;

                    state.todayAttendance =
                        action.payload?.data || null;
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

            // ==================================================
            // ATTENDANCE - MONTHLY
            // ==================================================

            .addCase(
                getMonthlyAttendance.pending,
                (state) => {
                    state.monthlyAttendanceLoading = true;
                    state.monthlyAttendanceError = null;
                }
            )

            .addCase(
                getMonthlyAttendance.fulfilled,
                (state, action) => {
                    state.monthlyAttendanceLoading = false;
                    state.monthlyAttendanceError = null;

                    state.monthlyAttendance =
                        action.payload?.data || null;
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

// Today's attendance
export const selectTodayAttendance = (state) =>
    state.employee.todayAttendance;

export const selectTodayAttendanceLoading = (state) =>
    state.employee.todayAttendanceLoading;

export const selectTodayAttendanceError = (state) =>
    state.employee.todayAttendanceError;

// Monthly attendance
export const selectMonthlyAttendance = (state) =>
    state.employee.monthlyAttendance;

export const selectMonthlyAttendanceLoading = (state) =>
    state.employee.monthlyAttendanceLoading;

export const selectMonthlyAttendanceError = (state) =>
    state.employee.monthlyAttendanceError;

// Clock In
export const selectClockInLoading = (state) =>
    state.employee.clockInLoading;

export const selectClockInError = (state) =>
    state.employee.clockInError;

// Clock Out
export const selectClockOutLoading = (state) =>
    state.employee.clockOutLoading;

export const selectClockOutError = (state) =>
    state.employee.clockOutError;

// General attendance success
export const selectAttendanceSuccess = (state) =>
    state.employee.attendanceSuccess;

export const selectAttendanceMessage = (state) =>
    state.employee.attendanceMessage;

// ======================================================
// REDUCER
// ======================================================

export default employeeSlice.reducer;