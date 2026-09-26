import {
  CheckCircle2,
  Circle,
  Clock3,
} from "lucide-react";

const tasks = [
  {
    title: "Review speaker submissions",
    due: "Today",
    completed: false,
  },
  {
    title: "Confirm conference venue",
    due: "Tomorrow",
    completed: false,
  },
  {
    title: "Send registration report",
    due: "Sep 30, 2026",
    completed: true,
  },
  {
    title: "Prepare conference schedule",
    due: "Oct 02, 2026",
    completed: false,
  },
];

function Tasks() {
  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] p-6">
      <div className="mx-auto max-w-[1000px]">
        <h1 className="text-[26px] font-bold text-[#111827]">
          Tasks
        </h1>

        <p className="mt-1 text-[14px] text-[#64748b]">
          Track your conference tasks
        </p>

        <div className="mt-6 rounded-2xl border border-[#dddfe8] bg-white">
          {tasks.map((task) => (
            <div
              key={task.title}
              className="flex items-center justify-between gap-4 border-b border-[#eeeef3] p-5 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                {task.completed ? (
                  <CheckCircle2
                    size={21}
                    className="text-emerald-500"
                  />
                ) : (
                  <Circle
                    size={21}
                    className="text-[#94a3b8]"
                  />
                )}

                <div>
                  <p
                    className={`text-sm font-medium ${
                      task.completed
                        ? "text-[#94a3b8] line-through"
                        : "text-[#111827]"
                    }`}
                  >
                    {task.title}
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-xs text-[#64748b]">
                    <Clock3 size={13} />
                    {task.due}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;