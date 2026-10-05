
import React, { useEffect } from "react";

import {
  Search,
  Bell,
  ChevronDown,
  UserCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import socket from "../../sockets/socket";

import {
  fetchNotifications,
  addNotification,
  selectUnreadNotificationCount,
} from "../../redux/notificationSlice";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ============================================================
  // REDUX
  // ============================================================

  const unreadCount = useSelector(
    selectUnreadNotificationCount
  );

  // ============================================================
  // LOAD NOTIFICATIONS
  // ============================================================

  useEffect(() => {
    /*
     * Fetch existing notifications from backend.
     *
     * This is important because if admin refreshes the page,
     * the unread count should still come from MongoDB.
     */
    dispatch(fetchNotifications());
  }, [dispatch]);

  // ============================================================
  // SOCKET.IO - REALTIME NOTIFICATIONS
  // ============================================================

  useEffect(() => {
    const handleNewNotification = (notification) => {
      console.log(
        "🔔 Navbar - New notification:",
        notification
      );

      /*
       * Add notification to Redux.
       *
       * Your notificationSlice should automatically
       * increase unread count because the new notification
       * is unread.
       */
      dispatch(
        addNotification(notification)
      );
    };

    /*
     * Connect socket
     */
    socket.connect();

    /*
     * Listen for backend notification event
     */
    socket.on(
      "newNotification",
      handleNewNotification
    );

    /*
     * Cleanup
     */
    return () => {
      socket.off(
        "newNotification",
        handleNewNotification
      );
    };
  }, [dispatch]);

  // ============================================================
  // NOTIFICATION CLICK
  // ============================================================

  const handleNotificationClick = () => {
    navigate("/admin/notifications");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-gray-200 bg-white/90 px-5 backdrop-blur-xl">

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div className="relative w-[360px]">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="h-9 w-full rounded-lg border border-gray-200 bg-[#f8f8fc] pl-10 pr-4 text-xs text-gray-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {/* ======================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="flex items-center gap-4">

        {/* ====================================================
            NOTIFICATIONS
        ==================================================== */}

        <button
          type="button"
          onClick={handleNotificationClick}
          aria-label="Notifications"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-purple-50 hover:text-purple-600"
        >
          <Bell
            size={19}
            strokeWidth={2}
          />

          {/* ==================================================
              UNREAD COUNT
          ================================================== */}

          {unreadCount > 0 && (
            <span
              className="
                absolute
                -right-1
                -top-1
                flex
                min-h-[16px]
                min-w-[16px]
                items-center
                justify-center
                rounded-full
                bg-red-500
                px-1
                text-[8px]
                font-bold
                leading-none
                text-white
                shadow-sm
              "
            >
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>

        {/* ====================================================
            DIVIDER
        ==================================================== */}

        <div className="h-7 w-px bg-gray-200" />

        {/* ====================================================
            PROFILE
        ==================================================== */}

        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition hover:bg-gray-50"
        >
          {/* Avatar */}

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <UserCircle size={21} />
          </div>

          {/* User Info */}

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-gray-800">
              Admin
            </p>

            <p className="text-[10px] text-gray-400">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={15}
            className="text-gray-400"
          />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
