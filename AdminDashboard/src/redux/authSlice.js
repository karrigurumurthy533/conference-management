import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

export const login = createAsyncThunk(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/auth/login",
        loginData
      );

      const { token, user } = response.data;

      if (!user || user.role !== "admin") {
        return rejectWithValue(
          "You are not authorized to access the admin panel"
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      return {
        token,
        user,
        role: user.role,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/profile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/auth/profile",
        profileData
      );

      const { token, data } = response.data;

      const updatedUser = data;

      if (token) {
        localStorage.setItem("token", token);
      }

      localStorage.setItem(
        "role",
        updatedUser.role
      );

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      return {
        token: token || localStorage.getItem("token"),
        user: updatedUser,
        role: updatedUser.role,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Profile update failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      return true;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  loading: false,
  updateProfileLoading: false,
  error: null,
  updateProfileError: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    clearUpdateProfileError: (state) => {
      state.updateProfileError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileLoading = true;
        state.updateProfileError = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileLoading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;

        state.isAuthenticated = true;
        state.updateProfileError = null;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileLoading = false;

        state.updateProfileError =
          action.payload ||
          "Profile update failed";
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
        state.error = null;
        state.updateProfileError = null;
      });
  },
});

export const {
  clearAuthError,
  clearUpdateProfileError,
} = authSlice.actions;

export default authSlice.reducer;