import {
  Bell,
  KeyRound,
  Pencil,
} from "lucide-react";

function Profile() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f7f7fb] px-6 py-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-bold leading-8 text-[#111827]">
              My Profile
            </h1>

            <p className="mt-1 text-[14px] text-[#64748b]">
              Your account and assignment details
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-[#d9dce5] bg-white px-5 py-2.5 text-[14px] font-medium text-[#111827] transition hover:border-violet-300 hover:bg-violet-50">
            <Pencil size={16} strokeWidth={1.8} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[338px_1fr]">
          <div className="rounded-2xl border border-[#dddfe8] bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e9e1ff]">
                <span className="text-[24px] font-medium text-[#7546f5]">
                  JM
                </span>
              </div>

              <h2 className="mt-5 text-[17px] font-bold text-[#111827]">
                John Mathew
              </h2>

              <p className="mt-1 text-[14px] text-[#64748b]">
                Conference Manager
              </p>

              <span className="mt-4 rounded-full bg-[#d9f6ec] px-3 py-1 text-[12px] font-medium text-[#10b981]">
                Active
              </span>
            </div>

            <div className="mt-6 space-y-2">
              <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d9dce5] bg-white text-[14px] font-medium text-[#111827] transition hover:border-violet-300 hover:bg-violet-50">
                <KeyRound size={16} strokeWidth={1.8} />
                Change Password
              </button>

              <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d9dce5] bg-white text-[14px] font-medium text-[#111827] transition hover:border-violet-300 hover:bg-violet-50">
                <Bell size={16} strokeWidth={1.8} />
                Notification Settings
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dddfe8] bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              Details
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Full Name
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  John Mathew
                </p>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Email
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  john@globalscion.com
                </p>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Phone
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  +91 98765 43210
                </p>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Designation
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  Conference Manager
                </p>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Department
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  Conference Operations
                </p>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#64748b]">
                  Country
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                  India
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#dddfe8] bg-[#fafafd] px-4 py-4">
              <p className="text-[12px] font-medium text-[#64748b]">
                Assigned Conference
              </p>

              <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                International Conference on Cardiology 2027
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;