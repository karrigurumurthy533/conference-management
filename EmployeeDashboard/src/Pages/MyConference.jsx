import {
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

function MyConference() {
  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] p-6">
      <div className="mx-auto max-w-[1400px]">
        <div>
          <h1 className="text-[26px] font-bold text-[#111827]">
            My Conference
          </h1>

          <p className="mt-1 text-[14px] text-[#64748b]">
            Manage your assigned conference and event details
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[#dddfe8] bg-white p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-600">
                Assigned Conference
              </span>

              <h2 className="mt-4 text-xl font-bold text-[#111827]">
                International Conference on Cardiology 2027
              </h2>

              <p className="mt-2 text-sm text-[#64748b]">
                GlobalScion International Conference
              </p>
            </div>

            <span className="h-fit rounded-full bg-[#d9f6ec] px-3 py-1 text-xs font-medium text-[#10b981]">
              Active
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafd] p-4">
              <CalendarDays
                size={20}
                className="text-violet-600"
              />

              <p className="mt-3 text-xs text-[#64748b]">
                Conference Date
              </p>

              <p className="mt-1 text-sm font-semibold text-[#111827]">
                March 15 - 17, 2027
              </p>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafd] p-4">
              <MapPin
                size={20}
                className="text-violet-600"
              />

              <p className="mt-3 text-xs text-[#64748b]">
                Location
              </p>

              <p className="mt-1 text-sm font-semibold text-[#111827]">
                Bangalore, India
              </p>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafd] p-4">
              <Users
                size={20}
                className="text-violet-600"
              />

              <p className="mt-3 text-xs text-[#64748b]">
                Expected Attendees
              </p>

              <p className="mt-1 text-sm font-semibold text-[#111827]">
                1,200+
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyConference;