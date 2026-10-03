import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getAdminStatisticsApi,
  getAdminDashboardOverviewApi,
} from "../api/dashboardApis";


// ============================================================
// GET ADMIN STATISTICS
// ============================================================

export const getAdminStatistics = createAsyncThunk(
  "dashboard/getAdminStatistics",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminStatisticsApi();

      return (
        response?.data?.data ||
        response?.data ||
        {}
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch admin statistics"
      );
    }
  }
);


// ============================================================
// GET ADMIN DASHBOARD OVERVIEW
// ============================================================

export const getAdminDashboardOverview = createAsyncThunk(
  "dashboard/getAdminDashboardOverview",

  async (_, { rejectWithValue }) => {
    try {
      const response =
        await getAdminDashboardOverviewApi();

      return (
        response?.data?.data ||
        response?.data ||
        {}
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch dashboard overview"
      );
    }
  }
);


// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  // ----------------------------------------------------------
  // ADMIN STATISTICS
  // ----------------------------------------------------------

  admin: {
    totalConferences: 0,
    totalEmployees: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    totalSpeakers: 0,
  },

  adminLoading: false,

  adminError: null,


  // ----------------------------------------------------------
  // REGISTRATION OVERVIEW
  // ----------------------------------------------------------

  registrationOverview: [],


  // ----------------------------------------------------------
  // RECENT CONFERENCES
  // ----------------------------------------------------------

  recentConferences: [],


  // ----------------------------------------------------------
  // RECENT ACTIVITIES
  // ----------------------------------------------------------

  recentActivities: [],


  // ----------------------------------------------------------
  // OVERVIEW LOADING / ERROR
  // ----------------------------------------------------------

  overviewLoading: false,

  overviewError: null,
};


// ============================================================
// SLICE
// ============================================================

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {


    // ========================================================
    // CLEAR DASHBOARD ERROR
    // ========================================================

    clearDashboardError: (state) => {
      state.adminError = null;
      state.overviewError = null;
    },


    // ========================================================
    // CLEAR ADMIN STATISTICS
    // ========================================================

    clearAdminStatistics: (state) => {
      state.admin = {
        totalConferences: 0,
        totalEmployees: 0,
        totalRegistrations: 0,
        totalRevenue: 0,
        totalSpeakers: 0,
      };
    },


    // ========================================================
    // CLEAR DASHBOARD OVERVIEW
    // ========================================================

    clearDashboardOverview: (state) => {
      state.registrationOverview = [];
      state.recentConferences = [];
      state.recentActivities = [];
    },
  },


  // ==========================================================
  // EXTRA REDUCERS
  // ==========================================================

  extraReducers: (builder) => {


    // ========================================================
    // ADMIN STATISTICS - PENDING
    // ========================================================

    builder.addCase(
      getAdminStatistics.pending,
      (state) => {
        state.adminLoading = true;
        state.adminError = null;
      }
    );


    // ========================================================
    // ADMIN STATISTICS - SUCCESS
    // ========================================================

    builder.addCase(
      getAdminStatistics.fulfilled,
      (state, action) => {
        state.adminLoading = false;

        state.admin = {
          totalConferences:
            action.payload?.totalConferences ?? 0,

          totalEmployees:
            action.payload?.totalEmployees ?? 0,

          totalRegistrations:
            action.payload?.totalRegistrations ?? 0,

          totalRevenue:
            action.payload?.totalRevenue ?? 0,

          totalSpeakers:
            action.payload?.totalSpeakers ?? 0,
        };
      }
    );


    // ========================================================
    // ADMIN STATISTICS - FAILED
    // ========================================================

    builder.addCase(
      getAdminStatistics.rejected,
      (state, action) => {
        state.adminLoading = false;

        state.adminError =
          action.payload ||
          "Failed to fetch admin statistics";
      }
    );


    // ========================================================
    // DASHBOARD OVERVIEW - PENDING
    // ========================================================

    builder.addCase(
      getAdminDashboardOverview.pending,
      (state) => {
        state.overviewLoading = true;
        state.overviewError = null;
      }
    );


    // ========================================================
    // DASHBOARD OVERVIEW - SUCCESS
    // ========================================================

    builder.addCase(
      getAdminDashboardOverview.fulfilled,
      (state, action) => {
        state.overviewLoading = false;

        state.registrationOverview =
          action.payload?.registrationOverview || [];

        state.recentConferences =
          action.payload?.recentConferences || [];

        state.recentActivities =
          action.payload?.recentActivities || [];
      }
    );


    // ========================================================
    // DASHBOARD OVERVIEW - FAILED
    // ========================================================

    builder.addCase(
      getAdminDashboardOverview.rejected,
      (state, action) => {
        state.overviewLoading = false;

        state.overviewError =
          action.payload ||
          "Failed to fetch dashboard overview";
      }
    );
  },
});


// ============================================================
// ACTIONS
// ============================================================

export const {
  clearDashboardError,
  clearAdminStatistics,
  clearDashboardOverview,
} = dashboardSlice.actions;


// ============================================================
// SELECTORS - ADMIN STATISTICS
// ============================================================

export const selectAdminStatistics = (
  state
) => state.dashboard.admin;


export const selectAdminLoading = (
  state
) => state.dashboard.adminLoading;


export const selectAdminError = (
  state
) => state.dashboard.adminError;


// ============================================================
// SELECTORS - DASHBOARD OVERVIEW
// ============================================================

export const selectRegistrationOverview = (
  state
) => state.dashboard.registrationOverview;


export const selectRecentConferences = (
  state
) => state.dashboard.recentConferences;


export const selectRecentActivities = (
  state
) => state.dashboard.recentActivities;


export const selectOverviewLoading = (
  state
) => state.dashboard.overviewLoading;


export const selectOverviewError = (
  state
) => state.dashboard.overviewError;




export default dashboardSlice.reducer;