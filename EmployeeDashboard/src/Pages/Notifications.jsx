import React from "react";
import {
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  UserCheck,
  AlertCircle,
  Check,
} from "lucide-react";

// ==========================================================
// NOTIFICATIONS DATA
// ==========================================================

const notifications = [
  {
    id: 1,
    title: "New abstract submitted",
    message: "A new abstract has been submitted for review.",
    time: "10 minutes ago",
    icon: FileText,
    read: false,
  },
  {
    id: 2,
    title: "Speaker confirmed",
    message: "Dr. Michael Anderson confirmed his participation.",
    time: "2 hours ago",
    icon: CheckCircle2,
    read: false,
  },
  {
    id: 3,
    title: "Task deadline approaching",
    message: "Speaker review task is due today.",
    time: "5 hours ago",
    icon: Clock3,
    read: false,
  },
  {
    id: 4,
    title: "New registration received",
    message: "A new participant has registered for the conference.",
    time: "Yesterday",
    icon: UserCheck,
    read: true,
  },
  {
    id: 5,
    title: "Abstract approved",
    message: "An abstract has been approved for presentation.",
    time: "Yesterday",
    icon: CheckCircle2,
    read: true,
  },
  {
    id: 6,
    title: "Speaker review pending",
    message: "A speaker profile is waiting for your review.",
    time: "2 days ago",
    icon: AlertCircle,
    read: true,
  },
  {
    id: 7,
    title: "Registration payment received",
    message: "Payment has been successfully received.",
    time: "2 days ago",
    icon: CheckCircle2,
    read: true,
  },
  {
    id: 8,
    title: "Abstract review assigned",
    message: "A new abstract has been assigned to you for review.",
    time: "3 days ago",
    icon: FileText,
    read: true,
  },
  {
    id: 9,
    title: "Conference task assigned",
    message: "A new conference management task has been assigned.",
    time: "3 days ago",
    icon: Clock3,
    read: true,
  },
  {
    id: 10,
    title: "Speaker profile updated",
    message: "Speaker information has been updated successfully.",
    time: "4 days ago",
    icon: UserCheck,
    read: true,
  },
];

// ==========================================================
// NOTIFICATIONS
// ==========================================================

function Notifications() {
  const topNotifications = notifications.slice(0, 10);

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            NOTIFICATIONS LIST
        ================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {topNotifications.map((notification, index) => {
            const Icon = notification.icon;

            return (
              <div
                key={notification.id}
                className={`flex min-h-[62px] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 ${
                  index !== topNotifications.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                {/* ==================================================
                    ICON
                ================================================== */}

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <Icon className="h-[15px] w-[15px] text-[#8138A2]" />
                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[13px] font-semibold leading-5 text-gray-900">
                      {notification.title}
                    </h2>

                    {!notification.read && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8138A2]" />
                    )}
                  </div>

                  <p className="truncate text-[12px] leading-4 text-gray-500">
                    {notification.message}
                  </p>
                </div>

                {/* ==================================================
                    TIME
                ================================================== */}

                <div className="flex shrink-0 items-center gap-2">
                  <span className="whitespace-nowrap text-[11px] text-gray-400">
                    {notification.time}
                  </span>

                  {!notification.read && (
                    <Check className="h-3.5 w-3.5 text-[#8138A2]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-[11px] text-gray-400">
            Showing top {topNotifications.length} notifications
          </p>

          <p className="text-[11px] text-gray-400">
            Latest updates
          </p>
        </div>
      </div>
    </section>
  );
}

export default Notifications;