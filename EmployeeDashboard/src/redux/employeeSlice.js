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
            const response = await getEmployeeConferenceApi();

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
            const response = await getMySpeakersApi();

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
            const response = await getMyBrochuresApi();

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
            const response = await getMyRegistrationsApi();

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
            const response = await getMyAbstractsApi();

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
            const response = await getEmployeeDashboardApi();

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
// INITIAL STATE
// ======================================================

const initialState = {
    // Employee authentication
    employee:
        JSON.parse(
            localStorage.getItem("employeeUser")
        ) || null,

    token:
        localStorage.getItem("employeeToken") || null,

    loading: false,
    error: null,
    success: false,

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
        // CLEAR ALL EMPLOYEE DATA
        // ==================================================

        clearEmployeeData: (state) => {
            state.conference = null;
            state.speakers = [];
            state.brochures = [];
            state.registrations = [];
            state.abstracts = [];
            state.dashboard = null;
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

                    /*
                     * Backend:
                     * {
                     *   success: true,
                     *   data: [...]
                     * }
                     *
                     * If only one conference is assigned,
                     * use first item.
                     */

                    const data = action.payload?.data || [];

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
    clearEmployeeData,
} = employeeSlice.actions;

// ======================================================
// SELECTORS
// ======================================================

// Employee
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
// CONFERENCE
// ======================================================

export const selectEmployeeConference = (state) =>
    state.employee.conference;

export const selectEmployeeConferenceLoading = (state) =>
    state.employee.conferenceLoading;

export const selectEmployeeConferenceError = (state) =>
    state.employee.conferenceError;

// ======================================================
// SPEAKERS
// ======================================================

export const selectEmployeeSpeakers = (state) =>
    state.employee.speakers;

export const selectEmployeeSpeakersLoading = (state) =>
    state.employee.speakersLoading;

export const selectEmployeeSpeakersError = (state) =>
    state.employee.speakersError;

// ======================================================
// BROCHURES
// ======================================================

export const selectEmployeeBrochures = (state) =>
    state.employee.brochures;

export const selectEmployeeBrochuresLoading = (state) =>
    state.employee.brochuresLoading;

export const selectEmployeeBrochuresError = (state) =>
    state.employee.brochuresError;

// ======================================================
// REGISTRATIONS
// ======================================================

export const selectEmployeeRegistrations = (state) =>
    state.employee.registrations;

export const selectEmployeeRegistrationsLoading = (state) =>
    state.employee.registrationsLoading;

export const selectEmployeeRegistrationsError = (state) =>
    state.employee.registrationsError;

// ======================================================
// ABSTRACTS
// ======================================================

export const selectEmployeeAbstracts = (state) =>
    state.employee.abstracts;

export const selectEmployeeAbstractsLoading = (state) =>
    state.employee.abstractsLoading;

export const selectEmployeeAbstractsError = (state) =>
    state.employee.abstractsError;

// ======================================================
// DASHBOARD
// ======================================================

export const selectEmployeeDashboard = (state) =>
    state.employee.dashboard;

export const selectEmployeeDashboardLoading = (state) =>
    state.employee.dashboardLoading;

export const selectEmployeeDashboardError = (state) =>
    state.employee.dashboardError;

// ======================================================
// REDUCER
// ======================================================

export default employeeSlice.reducer;