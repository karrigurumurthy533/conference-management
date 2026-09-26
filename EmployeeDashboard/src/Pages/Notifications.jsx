import {
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

const notifications = [
  {
    title: "New abstract submitted",
    message: "A new abstract has been submitted for review.",
    time: "10 minutes ago",
    icon: FileText,
  },
  {
    title: "Speaker confirmed",
    message: "Dr. Michael Anderson confirmed his participation.",
    time: "2 hours ago",
    icon: CheckCircle2,
  },
  {
    title: "Task deadline approaching",
    message: "Speaker review task is due today.",
    time: "5 hours ago",
    icon: Clock3,
  },
];

function Notifications() {
  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] p-6">
      <div className="mx-auto max-w-[1000px]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
            <Bell className="text-violet-600" />
          </div>

          <div>
            <h1 className="text-[26px] font-bold text-[#111827]">
              Notifications
            </h1>

            <p className="text-[14px] text-[#64748b]">
              Your latest updates and alerts
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#dddfe8] bg-white">
          {notifications.map((notification) => {
            const Icon = notification.icon;

            return (
              <div
                key={notification.title}
                className="flex gap-4 border-b border-[#eeeef3] p-5 last:border-b-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50">
                  <Icon
                    size={18}
                    className="text-violet-600"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#111827]">
                    {notification.title}
                  </h2>

                  <p className="mt-1 text-sm text-[#64748b]">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-xs text-[#94a3b8]">
                    {notification.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Notifications;