
import React, { useEffect, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import socket from "../../sockets/socket";

import {
  fetchNotifications,
  addNotification,
  selectUnreadNotificationCount,
} from "../../redux/notificationSlice";

const AdminNavbar = ({ onMenuClick, isSidebarOpen = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const unreadCount = useSelector(selectUnreadNotificationCount);

  // Fetch existing notifications
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Realtime notifications
  useEffect(() => {
    const handleNewNotification = (notification) => {
      dispatch(addNotification(notification));
    };

    socket.connect();
    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [dispatch]);

  const handleNotificationClick = () => {
    navigate("/admin/notifications");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    // Pass the search query to your admin pages through URL.
    navigate(`/admin/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 flex h-[60px] w-full items-center justify-between gap-3 border-b border-gray-200 bg-white/95 px-3 backdrop-blur-xl sm:px-5 lg:px-6">
      {/* Left section */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED] lg:hidden"
        >
          {isSidebarOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden w-full max-w-[360px] sm:block"
        >
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search anything..."
            aria-label="Search admin dashboard"
            className="h-9 w-full rounded-lg border border-gray-200 bg-[#f8f8fc] pl-10 pr-4 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </form>

        {/* Mobile logo */}
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="min-w-0 sm:hidden"
          aria-label="Go to admin dashboard"
        >
          <img
            src="/web_logo.png"
            alt="GlobalScion"
            className="h-8 max-w-[125px] object-contain"
          />
        </button>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button
          type="button"
          onClick={handleNotificationClick}
          aria-label={`Notifications, ${unreadCount} unread`}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-purple-50 hover:text-[#7C3AED]"
        >
          <Bell size={19} strokeWidth={2} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        <div className="hidden h-7 w-px bg-gray-200 sm:block" />

        {/* Profile */}
        <button
          type="button"
          onClick={() => navigate("/admin/profile")}
          aria-label="Open admin profile"
          className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-gray-50 sm:gap-2.5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <UserCircle size={21} />
          </div>

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
            className="hidden text-gray-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;