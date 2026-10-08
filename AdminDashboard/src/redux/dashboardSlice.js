import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getAdminStatisticsApi,
  getAdminDashboardOverviewApi,
  getAdminAttendanceDashboardApi,
  getAllAdminAttendanceApi,
  getAdminEmployeeAttendanceApi,
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

export const getAdminDashboardOverview =
  createAsyncThunk(
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
// GET ADMIN ATTENDANCE DASHBOARD
// ============================================================

export const getAdminAttendanceDashboard =
  createAsyncThunk(
    "dashboard/getAdminAttendanceDashboard",

    async (
      { month, year } = {},
      { rejectWithValue }
    ) => {
      try {
        const response =
          await getAdminAttendanceDashboardApi({
            month,
            year,
          });

        return (
          response?.data?.data ||
          response?.data ||
          {}
        );
      } catch (error) {
        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch attendance dashboard"
        );
      }
    }
  );


// ============================================================
// GET ALL ADMIN ATTENDANCE
// ============================================================

export const getAllAdminAttendance =
  createAsyncThunk(
    "dashboard/getAllAdminAttendance",

    async (
      {
        search = "",
        date = "",
        status = "",
        page = 1,
        limit = 10,
      } = {},
      { rejectWithValue }
    ) => {
      try {
        const response =
          await getAllAdminAttendanceApi({
            search,
            date,
            status,
            page,
            limit,
          });

        return (
          response?.data?.data ||
          response?.data ||
          {}
        );
      } catch (error) {
        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch attendance records"
        );
      }
    }
  );


// ============================================================
// GET SINGLE EMPLOYEE ATTENDANCE
// ============================================================

export const getAdminEmployeeAttendance =
  createAsyncThunk(
    "dashboard/getAdminEmployeeAttendance",

    async (
      {
        id,
        month,
        year,
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await getAdminEmployeeAttendanceApi(
            id,
            month,
            year
          );

        return (
          response?.data?.data ||
          response?.data ||
          {}
        );
      } catch (error) {
        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch employee attendance"
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


  // ==========================================================
  // ATTENDANCE DASHBOARD
  // ==========================================================

  attendanceDashboard: {
    totalEmployees: 0,
    todayPresent: 0,
    todayAbsent: 0,
    monthPresent: 0,
    monthAbsent: 0,
  },

  attendanceDashboardLoading: false,

  attendanceDashboardError: null,


  // ==========================================================
  // ALL ATTENDANCE
  // ==========================================================

  attendanceRecords: [],

  attendancePagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  attendanceLoading: false,

  attendanceError: null,


  // ==========================================================
  // SINGLE EMPLOYEE ATTENDANCE
  // ==========================================================

  employeeAttendance: null,

  employeeAttendanceLoading: false,

  employeeAttendanceError: null,
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

      state.attendanceDashboardError = null;
      state.attendanceError = null;
      state.employeeAttendanceError = null;
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


    // ========================================================
    // CLEAR ATTENDANCE
    // ========================================================

    clearAttendanceData: (state) => {
      state.attendanceDashboard = {
        totalEmployees: 0,
        todayPresent: 0,
        todayAbsent: 0,
        monthPresent: 0,
        monthAbsent: 0,
      };

      state.attendanceRecords = [];

      state.attendancePagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

      state.employeeAttendance = null;

      state.attendanceDashboardError = null;

      state.attendanceError = null;

      state.employeeAttendanceError = null;
    },


    // ========================================================
    // CLEAR EMPLOYEE ATTENDANCE
    // ========================================================

    clearEmployeeAttendance: (state) => {
      state.employeeAttendance = null;
      state.employeeAttendanceError = null;
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


    // ========================================================
    // ATTENDANCE DASHBOARD - PENDING
    // ========================================================

    builder.addCase(
      getAdminAttendanceDashboard.pending,
      (state) => {
        state.attendanceDashboardLoading = true;

        state.attendanceDashboardError = null;
      }
    );


    // ========================================================
    // ATTENDANCE DASHBOARD - SUCCESS
    // ========================================================

    builder.addCase(
      getAdminAttendanceDashboard.fulfilled,
      (state, action) => {
        state.attendanceDashboardLoading = false;

        state.attendanceDashboard = {
          totalEmployees:
            action.payload?.totalEmployees ?? 0,

          todayPresent:
            action.payload?.todayPresent ?? 0,

          todayAbsent:
            action.payload?.todayAbsent ?? 0,

          monthPresent:
            action.payload?.monthPresent ?? 0,

          monthAbsent:
            action.payload?.monthAbsent ?? 0,
        };
      }
    );


    // ========================================================
    // ATTENDANCE DASHBOARD - FAILED
    // ========================================================

    builder.addCase(
      getAdminAttendanceDashboard.rejected,
      (state, action) => {
        state.attendanceDashboardLoading = false;

        state.attendanceDashboardError =
          action.payload ||
          "Failed to fetch attendance dashboard";
      }
    );


    // ========================================================
    // ALL ATTENDANCE - PENDING
    // ========================================================

    builder.addCase(
      getAllAdminAttendance.pending,
      (state) => {
        state.attendanceLoading = true;

        state.attendanceError = null;
      }
    );


    // ========================================================
    // ALL ATTENDANCE - SUCCESS
    // ========================================================

    builder.addCase(
      getAllAdminAttendance.fulfilled,
      (state, action) => {
        state.attendanceLoading = false;

        state.attendanceRecords =
          action.payload?.attendance || [];

        state.attendancePagination = {
          page:
            action.payload?.pagination?.page ??
            1,

          limit:
            action.payload?.pagination?.limit ??
            10,

          total:
            action.payload?.pagination?.total ??
            0,

          totalPages:
            action.payload?.pagination?.totalPages ??
            0,
        };
      }
    );


    // ========================================================
    // ALL ATTENDANCE - FAILED
    // ========================================================

    builder.addCase(
      getAllAdminAttendance.rejected,
      (state, action) => {
        state.attendanceLoading = false;

        state.attendanceError =
          action.payload ||
          "Failed to fetch attendance records";
      }
    );


    // ========================================================
    // SINGLE EMPLOYEE ATTENDANCE - PENDING
    // ========================================================

    builder.addCase(
      getAdminEmployeeAttendance.pending,
      (state) => {
        state.employeeAttendanceLoading = true;

        state.employeeAttendanceError = null;
      }
    );


    // ========================================================
    // SINGLE EMPLOYEE ATTENDANCE - SUCCESS
    // ========================================================

    builder.addCase(
      getAdminEmployeeAttendance.fulfilled,
      (state, action) => {
        state.employeeAttendanceLoading = false;

        state.employeeAttendance =
          action.payload || null;
      }
    );


    // ========================================================
    // SINGLE EMPLOYEE ATTENDANCE - FAILED
    // ========================================================

    builder.addCase(
      getAdminEmployeeAttendance.rejected,
      (state, action) => {
        state.employeeAttendanceLoading = false;

        state.employeeAttendanceError =
          action.payload ||
          "Failed to fetch employee attendance";
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
  clearAttendanceData,
  clearEmployeeAttendance,
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


// ============================================================
// SELECTORS - ATTENDANCE DASHBOARD
// ============================================================

export const selectAttendanceDashboard = (
  state
) => state.dashboard.attendanceDashboard;


export const selectAttendanceDashboardLoading = (
  state
) =>
  state.dashboard.attendanceDashboardLoading;


export const selectAttendanceDashboardError = (
  state
) =>
  state.dashboard.attendanceDashboardError;


// ============================================================
// SELECTORS - ALL ATTENDANCE
// ============================================================

export const selectAttendanceRecords = (
  state
) => state.dashboard.attendanceRecords;


export const selectAttendancePagination = (
  state
) => state.dashboard.attendancePagination;


export const selectAttendanceLoading = (
  state
) => state.dashboard.attendanceLoading;


export const selectAttendanceError = (
  state
) => state.dashboard.attendanceError;


// ============================================================
// SELECTORS - SINGLE EMPLOYEE ATTENDANCE
// ============================================================

export const selectEmployeeAttendance = (
  state
) => state.dashboard.employeeAttendance;


export const selectEmployeeAttendanceLoading = (
  state
) =>
  state.dashboard.employeeAttendanceLoading;


export const selectEmployeeAttendanceError = (
  state
) =>
  state.dashboard.employeeAttendanceError;


// ============================================================
// EXPORT
// ============================================================

export default dashboardSlice.reducer;