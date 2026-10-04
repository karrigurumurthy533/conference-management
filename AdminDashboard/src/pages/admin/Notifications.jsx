import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Info,
  Search,
  MoreVertical,
  Check,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  UserPlus,
  CreditCard,
  FileText,
  Mic2,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import socket from "../../sockets/socket";

import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  addNotification,
  selectNotifications,
  selectNotificationLoading,
  selectUnreadNotificationCount,
} from "../../redux/notificationSlice";

const Notifications = () => {
  const dispatch = useDispatch();

  // ============================================================
  // REDUX
  // ============================================================

  const reduxNotifications =
    useSelector(selectNotifications);

  const unreadReduxCount = useSelector(
    selectUnreadNotificationCount
  );

  const loading = useSelector(
    selectNotificationLoading
  );

  // ============================================================
  // LOCAL UI STATE
  // ============================================================

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ============================================================
  // NOTIFICATION HELPERS
  // ============================================================

  const getNotificationIcon = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "registration":
        return UserPlus;

      case "payment":
        return CreditCard;

      case "abstract":
        return FileText;

      case "speaker":
        return Mic2;

      case "conference":
        return CalendarDays;

      case "alert":
        return AlertCircle;

      case "reminder":
        return Info;

      case "brochure":
        return FileText;

      case "review":
        return CheckCircle2;

      case "employee":
        return UserPlus;

      default:
        return Info;
    }
  };

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "Just now";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Just now";
    }

    const now = new Date();

    const difference = Math.floor(
      (now.getTime() - date.getTime()) / 1000
    );

    if (difference < 10) {
      return "Just now";
    }

    if (difference < 60) {
      return `${difference} sec ago`;
    }

    const minutes = Math.floor(
      difference / 60
    );

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return new Date().toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      );
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return new Date().toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      );
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };

  const normalizeNotification = (
    notification
  ) => {
    const createdAt =
      notification?.createdAt ||
      notification?.created_at ||
      new Date().toISOString();

    const type = notification?.type
      ? String(notification.type)
      : "Info";

    const isRead =
      notification?.isRead !== undefined
        ? notification.isRead
        : notification?.unread !== undefined
        ? !notification.unread
        : false;

    return {
      ...notification,

      id:
        notification?._id ||
        notification?.id ||
        `${Date.now()}-${Math.random()}`,

      title:
        notification?.title ||
        "New Notification",

      message:
        notification?.message ||
        "You have a new notification.",

      type:
        type.charAt(0).toUpperCase() +
        type.slice(1),

      time: formatTime(createdAt),

      date: formatDate(createdAt),

      unread: !isRead,

      icon: getNotificationIcon(type),

      createdAt,
    };
  };

  // ============================================================
  // GET NOTIFICATIONS + SOCKET.IO
  // ============================================================

  useEffect(() => {
    // Load existing notifications from MongoDB
    dispatch(fetchNotifications());

    const handleNewNotification = (
      notification
    ) => {
      console.log(
        "🔔 New notification received:",
        notification
      );

      const normalizedNotification =
        normalizeNotification(
          notification
        );

      dispatch(
        addNotification(
          normalizedNotification
        )
      );

      setCurrentPage(1);
    };

    socket.connect();

    socket.on(
      "newNotification",
      handleNewNotification
    );

    return () => {
      socket.off(
        "newNotification",
        handleNewNotification
      );

      socket.disconnect();
    };
  }, [dispatch]);

  // ============================================================
  // NORMALIZED NOTIFICATIONS
  // ============================================================

  const notifications = useMemo(() => {
    return reduxNotifications.map(
      normalizeNotification
    );
  }, [reduxNotifications]);

  // ============================================================
  // COUNTS
  // ============================================================

  const unreadCount = unreadReduxCount;

  const totalNotifications =
    notifications.length;

  const todayDate =
    new Date().toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );

  const todayCount = notifications.filter(
    (notification) =>
      notification.date === todayDate
  ).length;

  const alertCount = notifications.filter(
    (notification) =>
      notification.type.toLowerCase() ===
      "alert"
  ).length;

  // ============================================================
  // FILTER
  // ============================================================

  const filteredNotifications = useMemo(() => {
    return notifications.filter(
      (notification) => {
        const searchValue =
          search.toLowerCase().trim();

        const matchesSearch =
          notification.title
            .toLowerCase()
            .includes(searchValue) ||
          notification.message
            .toLowerCase()
            .includes(searchValue) ||
          notification.type
            .toLowerCase()
            .includes(searchValue);

        let matchesFilter = true;

        if (filter === "Unread") {
          matchesFilter =
            notification.unread;
        }

        if (filter === "Read") {
          matchesFilter =
            !notification.unread;
        }

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [
    notifications,
    search,
    filter,
  ]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const itemsPerPage = 6;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredNotifications.length /
        itemsPerPage
    )
  );

  const paginatedNotifications =
    filteredNotifications.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage * itemsPerPage
    );

  // ============================================================
  // ACTIONS
  // ============================================================

  const markAsRead = async (id) => {
    try {
      await dispatch(
        markNotificationRead(id)
      ).unwrap();

      setOpenMenu(null);
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await dispatch(
        markAllNotificationsRead()
      ).unwrap();
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  const deleteNotification = async (
    id
  ) => {
    try {
      await dispatch(
        removeNotification(id)
      ).unwrap();

      setOpenMenu(null);
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error
      );
    }
  };

  // ============================================================
  // ICON STYLE
  // ============================================================

  const getIconStyle = () => {
    return "bg-violet-50 text-violet-600";
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-w-0 space-y-3">
      {/* ========================================================
          SUMMARY CARDS
      ======================================================== */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {/* Total */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Notifications
              </p>

              <h3 className="mt-1 text-[20px] font-bold leading-none text-gray-900">
                {totalNotifications}
              </h3>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <Bell
                size={17}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* Unread */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Unread
              </p>

              <h3 className="mt-1 text-[20px] font-bold leading-none text-gray-900">
                {unreadCount}
              </h3>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <AlertCircle
                size={17}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* Today */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Today
              </p>

              <h3 className="mt-1 text-[20px] font-bold leading-none text-gray-900">
                {todayCount}
              </h3>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <CalendarDays
                size={17}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* Alerts */}

        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Alerts
              </p>

              <h3 className="mt-1 text-[20px] font-bold leading-none text-gray-900">
                {alertCount}
              </h3>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <Info
                size={17}
                className="text-violet-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          NOTIFICATIONS CARD
      ======================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* ======================================================
            TOOLBAR
        ====================================================== */}

        <div className="flex flex-col gap-2.5 border-b border-gray-100 p-3 lg:flex-row lg:items-center">
          {/* Search */}

          <div className="relative min-w-0 flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search notifications..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 text-[12px] text-gray-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter */}

          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 lg:w-28"
          >
            <option value="All">All</option>

            <option value="Unread">
              Unread
            </option>

            <option value="Read">
              Read
            </option>
          </select>

          {/* Mark All */}

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 text-[11px] font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={14} />

            Mark All Read
          </button>
        </div>

        {/* ======================================================
            NOTIFICATION LIST
        ====================================================== */}

        <div className="divide-y divide-gray-50">
          {loading &&
          notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                <Bell
                  size={23}
                  className="animate-pulse text-violet-400"
                />
              </div>

              <p className="mt-3 text-[12px] font-semibold text-gray-600">
                Loading notifications...
              </p>
            </div>
          ) : paginatedNotifications.length >
            0 ? (
            paginatedNotifications.map(
              (notification) => {
                const NotificationIcon =
                  notification.icon;

                return (
                  <div
                    key={notification.id}
                    className={`relative flex items-center gap-3 px-4 py-3.5 transition hover:bg-violet-50/30 ${
                      notification.unread
                        ? "bg-violet-50/20"
                        : "bg-white"
                    }`}
                  >
                    {/* Unread Indicator */}

                    {notification.unread && (
                      <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-violet-600" />
                    )}

                    {/* Icon */}

                    <div
                      className={`ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getIconStyle(
                        notification.type
                      )}`}
                    >
                      <NotificationIcon
                        size={18}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3
                          className={`truncate text-[12px] ${
                            notification.unread
                              ? "font-semibold text-gray-900"
                              : "font-medium text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        <span className="shrink-0 rounded-md bg-violet-50 px-2 py-0.5 text-[9px] font-medium text-violet-600">
                          {notification.type}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-[11px] leading-4 text-gray-500">
                        {notification.message}
                      </p>

                      <div className="mt-1.5 flex items-center gap-1">
                        <Clock3
                          size={10}
                          className="text-violet-500"
                        />

                        <span className="text-[9px] text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                    </div>

                    {/* Action */}

                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu ===
                              notification.id
                              ? null
                              : notification.id
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-violet-50 hover:text-violet-600"
                      >
                        <MoreVertical
                          size={16}
                        />
                      </button>

                      {openMenu ===
                        notification.id && (
                        <div className="absolute right-0 top-9 z-30 w-36 rounded-lg border border-gray-100 bg-white p-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                            disabled={
                              !notification.unread
                            }
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Check
                              size={13}
                            />

                            Mark as Read
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(null)
                            }
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                          >
                            <Eye
                              size={13}
                            />

                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotification(
                                notification.id
                              )
                            }
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                          >
                            <Trash2
                              size={13}
                            />

                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                <Bell
                  size={23}
                  className="text-violet-400"
                />
              </div>

              <p className="mt-3 text-[12px] font-semibold text-gray-600">
                No notifications found
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>

        {/* ======================================================
            PAGINATION
        ====================================================== */}

        <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2.5">
          <p className="text-[10px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredNotifications.length ===
              0
                ? 0
                : (currentPage - 1) *
                    itemsPerPage +
                  1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                currentPage * itemsPerPage,
                filteredNotifications.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {filteredNotifications.length}
            </span>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(page - 1, 1)
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[10px] font-semibold transition ${
                  currentPage === page
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 text-gray-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={
                currentPage === totalPages ||
                filteredNotifications.length ===
                  0
              }
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    page + 1,
                    totalPages
                  )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;