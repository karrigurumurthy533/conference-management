import {
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";

function Communications() {
  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] p-6">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="text-[26px] font-bold text-[#111827]">
          Communications
        </h1>

        <p className="mt-1 text-[14px] text-[#64748b]">
          Manage conference communications
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#dddfe8] bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
              <Mail className="text-violet-600" />
            </div>

            <h2 className="mt-4 font-semibold text-[#111827]">
              Email Campaigns
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              Send updates, invitations and conference
              announcements to attendees and speakers.
            </p>

            <button className="mt-5 flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
              <Send size={15} />
              Create Email
            </button>
          </div>

          <div className="rounded-2xl border border-[#dddfe8] bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
              <MessageSquare className="text-violet-600" />
            </div>

            <h2 className="mt-4 font-semibold text-[#111827]">
              Messages
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              View and manage conversations with speakers,
              delegates and conference participants.
            </p>

            <button className="mt-5 rounded-lg border border-[#dddfe8] px-4 py-2 text-sm font-medium text-[#111827] hover:bg-violet-50">
              View Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Communications;