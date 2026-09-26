import {
  CalendarDays,
  PhoneCall,
  UserRound,
} from "lucide-react";

const followUps = [
  {
    name: "Dr. Michael Anderson",
    subject: "Speaker confirmation",
    date: "Sep 28, 2026",
  },
  {
    name: "Sarah Johnson",
    subject: "Registration follow-up",
    date: "Sep 29, 2026",
  },
  {
    name: "Dr. Robert Thomas",
    subject: "Abstract discussion",
    date: "Oct 01, 2026",
  },
];

function FollowUps() {
  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] p-6">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="text-[26px] font-bold text-[#111827]">
          Follow-ups
        </h1>

        <p className="mt-1 text-[14px] text-[#64748b]">
          Keep track of important follow-up activities
        </p>

        <div className="mt-6 space-y-3">
          {followUps.map((item) => (
            <div
              key={`${item.name}-${item.date}`}
              className="rounded-2xl border border-[#dddfe8] bg-white p-5"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-50">
                    <UserRound
                      size={20}
                      className="text-violet-600"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-[#111827]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-[#64748b]">
                      {item.subject}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <CalendarDays size={16} />
                  {item.date}
                </div>

                <button className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                  <PhoneCall size={15} />
                  Follow Up
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FollowUps;