import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getAllNotificationsApi,
  getNotificationByIdApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  deleteNotificationApi,
} from "../api/notificationApi";

// ======================================================
// GET ALL NOTIFICATIONS
// ======================================================

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await getAllNotificationsApi(params);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch notifications"
      );
    }
  }
);

// ======================================================
// GET NOTIFICATION BY ID
// ======================================================

export const fetchNotificationById = createAsyncThunk(
  "notifications/fetchNotificationById",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await getNotificationByIdApi(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch notification"
      );
    }
  }
);

// ======================================================
// MARK SINGLE NOTIFICATION AS READ
// ======================================================

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await markNotificationAsReadApi(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to mark notification as read"
      );
    }
  }
);

// ======================================================
// MARK ALL NOTIFICATIONS AS READ
// ======================================================

export const markAllNotificationsRead =
  createAsyncThunk(
    "notifications/markAllNotificationsRead",
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await markAllNotificationsAsReadApi();

        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to mark all notifications as read"
        );
      }
    }
  );

// ======================================================
// DELETE NOTIFICATION
// ======================================================

export const removeNotification = createAsyncThunk(
  "notifications/removeNotification",
  async (id, { rejectWithValue }) => {
    try {
      await deleteNotificationApi(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete notification"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  notifications: [],
  selectedNotification: null,

  loading: false,
  actionLoading: false,

  error: null,
  success: false,

  unreadCount: 0,
};

// ======================================================
// HELPERS
// ======================================================

const calculateUnreadCount = (notifications) => {
  return notifications.filter(
    (notification) =>
      notification.isRead === false ||
      notification.unread === true
  ).length;
};

// ======================================================
// SLICE
// ======================================================

const notificationSlice = createSlice({
  name: "notifications",

  initialState,

  reducers: {
    // ==================================================
    // ADD REAL-TIME NOTIFICATION
    // ==================================================

    addNotification: (state, action) => {
      const notification = action.payload;

      const notificationId =
        notification?._id || notification?.id;

      const alreadyExists =
        state.notifications.some(
          (item) =>
            String(item._id || item.id) ===
            String(notificationId)
        );

      if (alreadyExists) {
        return;
      }

      state.notifications.unshift(
        notification
      );

      state.unreadCount =
        calculateUnreadCount(
          state.notifications
        );
    },

    // ==================================================
    // UPDATE NOTIFICATION LOCALLY
    // ==================================================

    updateNotification: (state, action) => {
      const updatedNotification =
        action.payload;

      const notificationId =
        updatedNotification?._id ||
        updatedNotification?.id;

      const index =
        state.notifications.findIndex(
          (item) =>
            String(item._id || item.id) ===
            String(notificationId)
        );

      if (index !== -1) {
        state.notifications[index] =
          updatedNotification;
      }

      state.unreadCount =
        calculateUnreadCount(
          state.notifications
        );
    },

    // ==================================================
    // CLEAR SELECTED NOTIFICATION
    // ==================================================

    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },

    // ==================================================
    // CLEAR ERROR
    // ==================================================

    clearNotificationError: (state) => {
      state.error = null;
    },

    // ==================================================
    // CLEAR SUCCESS
    // ==================================================

    clearNotificationSuccess: (state) => {
      state.success = false;
    },

    // ==================================================
    // RESET NOTIFICATIONS
    // ==================================================

    resetNotifications: (state) => {
      state.notifications = [];
      state.selectedNotification = null;
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
      state.success = false;
      state.unreadCount = 0;
    },
  },

  extraReducers: (builder) => {
    // ==================================================
    // FETCH ALL NOTIFICATIONS
    // ==================================================

    builder
      .addCase(
        fetchNotifications.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchNotifications.fulfilled,
        (state, action) => {
          state.loading = false;

          const response = action.payload;

          const notifications =
            Array.isArray(response?.data)
              ? response.data
              : [];

          state.notifications =
            notifications;

          state.unreadCount =
            calculateUnreadCount(
              state.notifications
            );
        }
      )

      .addCase(
        fetchNotifications.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch notifications";
        }
      );

    // ==================================================
    // FETCH NOTIFICATION BY ID
    // ==================================================

    builder
      .addCase(
        fetchNotificationById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchNotificationById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedNotification =
            action.payload?.data || null;
        }
      )

      .addCase(
        fetchNotificationById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch notification";
        }
      );

    // ==================================================
    // MARK SINGLE AS READ
    // ==================================================

    builder
      .addCase(
        markNotificationRead.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        markNotificationRead.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedNotification =
            action.payload?.data;

          const notificationId =
            updatedNotification?._id;

          const index =
            state.notifications.findIndex(
              (item) =>
                String(item._id || item.id) ===
                String(notificationId)
            );

          if (index !== -1) {
            state.notifications[index] = {
              ...state.notifications[index],
              ...updatedNotification,
              isRead: true,
              unread: false,
            };
          }

          state.unreadCount =
            calculateUnreadCount(
              state.notifications
            );

          state.success = true;
        }
      )

      .addCase(
        markNotificationRead.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.error =
            action.payload ||
            "Failed to mark notification as read";
        }
      );

    // ==================================================
    // MARK ALL AS READ
    // ==================================================

    builder
      .addCase(
        markAllNotificationsRead.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        markAllNotificationsRead.fulfilled,
        (state) => {
          state.actionLoading = false;

          state.notifications =
            state.notifications.map(
              (notification) => ({
                ...notification,
                isRead: true,
                unread: false,
                readAt:
                  notification.readAt ||
                  new Date().toISOString(),
              })
            );

          state.unreadCount = 0;
          state.success = true;
        }
      )

      .addCase(
        markAllNotificationsRead.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.error =
            action.payload ||
            "Failed to mark all notifications as read";
        }
      );

    // ==================================================
    // DELETE NOTIFICATION
    // ==================================================

    builder
      .addCase(
        removeNotification.pending,
        (state) => {
          state.actionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        removeNotification.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const deletedId =
            action.payload;

          state.notifications =
            state.notifications.filter(
              (notification) =>
                String(
                  notification._id ||
                    notification.id
                ) !== String(deletedId)
            );

          state.unreadCount =
            calculateUnreadCount(
              state.notifications
            );

          state.success = true;
        }
      )

      .addCase(
        removeNotification.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.error =
            action.payload ||
            "Failed to delete notification";
        }
      );
  },
});

// ======================================================
// ACTIONS
// ======================================================

export const {
  addNotification,
  updateNotification,
  clearSelectedNotification,
  clearNotificationError,
  clearNotificationSuccess,
  resetNotifications,
} = notificationSlice.actions;

// ======================================================
// SELECTORS
// ======================================================

export const selectNotifications = (state) =>
  state.notifications.notifications;

export const selectNotificationLoading = (state) =>
  state.notifications.loading;

export const selectNotificationActionLoading = (
  state
) => state.notifications.actionLoading;

export const selectNotificationError = (state) =>
  state.notifications.error;

export const selectNotificationSuccess = (state) =>
  state.notifications.success;

export const selectUnreadNotificationCount = (
  state
) => state.notifications.unreadCount;

export const selectSelectedNotification = (
  state
) => state.notifications.selectedNotification;

// ======================================================
// REDUCER
// ======================================================

export default notificationSlice.reducer;