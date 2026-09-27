import {
  CalendarDays,
  CheckCircle2,
  FileText,
  UserPlus,
  Users,
  UserRound,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Total Registrations",
      value: "1,248",
      icon: UserPlus,
    },
    {
      title: "Total Speakers",
      value: "86",
      icon: UserRound,
    },
    {
      title: "Total Abstracts",
      value: "324",
      icon: FileText,
    },
    {
      title: "Total Attendences",
      value: "120",
      icon: Users,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "New registration received",
      description: "Sarah Johnson registered for Global Health Summit 2026.",
      type: "Registration",
      date: "Today, 10:42 AM",
    },
    {
      id: 2,
      title: "Speaker profile updated",
      description: "Dr. Michael Brown updated his speaker profile.",
      type: "Speaker",
      date: "Today, 09:30 AM",
    },
    {
      id: 3,
      title: "Abstract submitted",
      description: "A new abstract was submitted for review.",
      type: "Abstract",
      date: "Yesterday, 04:15 PM",
    },
    {
      id: 4,
      title: "Registration completed",
      description: "James Wilson completed the conference registration.",
      type: "Registration",
      date: "Yesterday, 02:20 PM",
    },
    {
      id: 5,
      title: "Abstract approved",
      description: "The abstract has been approved by the review team.",
      type: "Abstract",
      date: "Sep 25, 2026",
    },
  ];

  return (
    <section className="min-h-[calc(100vh-60px)] bg-[#f7f7fb] px-5 py-5">
      <div className="mx-auto w-full max-w-[1400px]">


        {/* =====================================================
            STAT CARDS
        ====================================================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="
                  rounded-xl
                  border
                  border-gray-100
                  bg-white
                  px-4
                  py-4
                  shadow-[0_2px_8px_rgba(0,0,0,0.03)]
                  transition
                  hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)]
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium text-gray-500">
                      {stat.title}
                    </p>

                    {/* BLACK NUMBER */}
                    <p className="mt-1.5 text-[24px] font-bold leading-none text-gray-900">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-purple-50
                    "
                  >
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className="text-[#7C3AED]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            RECENT ACTIVITIES
        ====================================================== */}
        <div
          className="
            mt-5
            overflow-hidden
            rounded-xl
            border
            border-gray-100
            bg-white
            shadow-[0_2px_8px_rgba(0,0,0,0.03)]
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h2 className="text-[14px] font-semibold text-gray-900">
                Recent Activities
              </h2>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Latest activities across your conferences.
              </p>
            </div>

            <button
              type="button"
              className="
                rounded-lg
                px-3
                py-1.5
                text-[11px]
                font-medium
                text-gray-900
                transition
                hover:bg-gray-50
              "
            >
              View All
            </button>
          </div>

          {/* Activity List */}
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  transition
                  hover:bg-gray-50/70
                "
              >
                {/* Icon */}
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-purple-50
                  "
                >
                  {activity.type === "Registration" && (
                    <UserPlus
                      size={16}
                      strokeWidth={2}
                      className="text-[#7C3AED]"
                    />
                  )}

                  {activity.type === "Speaker" && (
                    <UserRound
                      size={16}
                      strokeWidth={2}
                      className="text-[#7C3AED]"
                    />
                  )}

                  {activity.type === "Abstract" && (
                    <FileText
                      size={16}
                      strokeWidth={2}
                      className="text-[#7C3AED]"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-[12px] font-semibold text-gray-800">
                      {activity.title}
                    </h3>

                    <span
                      className="
                        rounded-full
                        bg-purple-50
                        px-2
                        py-0.5
                        text-[9px]
                        font-medium
                        text-[#7C3AED]
                      "
                    >
                      {activity.type}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-[11px] text-gray-500">
                    {activity.description}
                  </p>
                </div>

                {/* Date */}
                <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                  <CalendarDays
                    size={13}
                    strokeWidth={1.8}
                    className="text-gray-400"
                  />

                  <span className="text-[10px] text-gray-400">
                    {activity.date}
                  </span>
                </div>

                {/* Status */}
                <div className="hidden shrink-0 md:block">
                  <CheckCircle2
                    size={16}
                    strokeWidth={1.8}
                    className="text-green-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;