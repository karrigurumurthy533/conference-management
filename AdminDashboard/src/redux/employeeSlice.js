import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createEmployeeApi,
  getEmployeesApi,
  getEmployeeByIdApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from "../api/employeeApis";

// =====================================================
// CREATE EMPLOYEE
// =====================================================

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await createEmployeeApi(employeeData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =====================================================
// GET ALL EMPLOYEES
// =====================================================

export const getEmployees = createAsyncThunk(
  "employee/getEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getEmployeesApi();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =====================================================
// GET EMPLOYEE BY MONGODB _id
// =====================================================

export const getEmployeeById = createAsyncThunk(
  "employee/getEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getEmployeeByIdApi(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =====================================================
// UPDATE EMPLOYEE
// =====================================================

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const response = await updateEmployeeApi({
        id,
        employeeData,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =====================================================
// DELETE EMPLOYEE
// =====================================================

export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteEmployeeApi(id);

      return {
        id,
        response: response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  employees: [],
  selectedEmployee: null,

  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  error: null,
  success: false,
  message: "",
};

// =====================================================
// EMPLOYEE SLICE
// =====================================================

const employeeSlice = createSlice({
  name: "employee",

  initialState,

  reducers: {
    clearEmployeeError: (state) => {
      state.error = null;
    },

    clearEmployeeSuccess: (state) => {
      state.success = false;
      state.message = "";
    },

    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================================================
      // CREATE EMPLOYEE
      // =====================================================

      .addCase(createEmployee.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createEmployee.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;

        state.message =
          action.payload?.message ||
          "Employee created successfully";

        const employee =
          action.payload?.data ||
          action.payload;

        if (employee) {
          state.employees.unshift(employee);
        }
      })

      .addCase(createEmployee.rejected, (state, action) => {
        state.createLoading = false;

        state.error =
          action.payload ||
          "Failed to create employee";
      })

      // =====================================================
      // GET ALL EMPLOYEES
      // =====================================================

      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;

        state.employees =
          action.payload?.data || [];
      })

      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          "Failed to fetch employees";
      })

      // =====================================================
      // GET EMPLOYEE BY MONGODB _id
      // =====================================================

      .addCase(getEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.loading = false;

        state.selectedEmployee =
          action.payload?.data ||
          action.payload;
      })

      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          "Failed to fetch employee";
      })

      // =====================================================
      // UPDATE EMPLOYEE
      // =====================================================

      .addCase(updateEmployee.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;

        state.message =
          action.payload?.message ||
          "Employee updated successfully";

        const updatedEmployee =
          action.payload?.data ||
          action.payload;

        if (!updatedEmployee) {
          return;
        }

        const index =
          state.employees.findIndex(
            (item) =>
              item._id ===
              updatedEmployee._id
          );

        if (index !== -1) {
          state.employees[index] =
            updatedEmployee;
        }

        state.selectedEmployee =
          updatedEmployee;
      })

      .addCase(updateEmployee.rejected, (state, action) => {
        state.updateLoading = false;

        state.error =
          action.payload ||
          "Failed to update employee";
      })

      // =====================================================
      // DELETE EMPLOYEE
      // =====================================================

      .addCase(deleteEmployee.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.success = true;

        state.message =
          action.payload?.response?.message ||
          "Employee deleted successfully";

        const deletedId =
          action.payload?.id;

        state.employees =
          state.employees.filter(
            (item) =>
              item._id !== deletedId
          );

        if (
          state.selectedEmployee?._id ===
          deletedId
        ) {
          state.selectedEmployee = null;
        }
      })

      .addCase(deleteEmployee.rejected, (state, action) => {
        state.deleteLoading = false;

        state.error =
          action.payload ||
          "Failed to delete employee";
      });
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearEmployeeError,
  clearEmployeeSuccess,
  clearSelectedEmployee,
} = employeeSlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default employeeSlice.reducer;