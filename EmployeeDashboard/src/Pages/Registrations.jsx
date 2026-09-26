import { Users, CheckCircle2, Clock3 } from "lucide-react";

const registrations = [
  {
    name: "John Smith",
    email: "john@example.com",
    type: "Delegate",
    status: "Confirmed",
  },
  {
    name: "Emily Johnson",
    email: "emily@example.com",
    type: "Speaker",
    status: "Confirmed",
  },
  {
    name: "Robert Brown",
    email: "robert@example.com",
    type: "Delegate",
    status: "Pending",
  },
];

function Registrations() {
  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] p-6">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="text-[26px] font-bold text-[#111827]">
          Registrations
        </h1>

        <p className="mt-1 text-[14px] text-[#64748b]">
          Manage conference registrations
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#dddfe8] bg-white p-5">
            <Users className="text-violet-600" />

            <p className="mt-3 text-sm text-[#64748b]">
              Total Registrations
            </p>

            <p className="mt-1 text-2xl font-bold text-[#111827]">
              248
            </p>
          </div>

          <div className="rounded-2xl border border-[#dddfe8] bg-white p-5">
            <CheckCircle2 className="text-emerald-500" />

            <p className="mt-3 text-sm text-[#64748b]">
              Confirmed
            </p>

            <p className="mt-1 text-2xl font-bold text-[#111827]">
              186
            </p>
          </div>

          <div className="rounded-2xl border border-[#dddfe8] bg-white p-5">
            <Clock3 className="text-amber-500" />

            <p className="mt-3 text-sm text-[#64748b]">
              Pending
            </p>

            <p className="mt-1 text-2xl font-bold text-[#111827]">
              62
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#dddfe8] bg-white">
          {registrations.map((registration) => (
            <div
              key={registration.email}
              className="flex flex-col gap-3 border-b border-[#eeeef3] p-5 last:border-b-0 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-[#111827]">
                  {registration.name}
                </p>

                <p className="mt-1 text-sm text-[#64748b]">
                  {registration.email}
                </p>
              </div>

              <span className="text-sm text-[#64748b]">
                {registration.type}
              </span>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  registration.status === "Confirmed"
                    ? "bg-[#d9f6ec] text-[#10b981]"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {registration.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Registrations;