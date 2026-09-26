import {
  Bell,
  ChevronDown,
  CircleHelp,
  Mail,
  Search,
} from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-[66px] border-b border-[#e5e7eb] bg-white">
      <div className="flex h-full items-center justify-between px-5">
        <div className="flex items-center">
          <div className="relative w-[440px]">
            <Search
              size={17}
              strokeWidth={1.8}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]"
            />

            <input
              type="text"
              placeholder="Search speakers, abstracts, registrations..."
              className="h-[38px] w-full rounded-xl border border-[#dfe3eb] bg-[#f7f8fc] pl-11 pr-4 text-[13px] text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-violet-300 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#f5f3ff] hover:text-violet-600"
          >
            <Bell
              size={20}
              strokeWidth={1.8}
            />

            <span className="absolute right-[5px] top-[4px] h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#f5f3ff] hover:text-violet-600"
          >
            <Mail
              size={20}
              strokeWidth={1.8}
            />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#f5f3ff] hover:text-violet-600"
          >
            <CircleHelp
              size={20}
              strokeWidth={1.8}
            />
          </button>

          <div className="ml-1 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ede9fe]">
              <span className="text-[12px] font-medium text-violet-600">
                JM
              </span>
            </div>

            <span className="text-[14px] font-semibold text-[#111827]">
              John Mathew
            </span>

            <button
              type="button"
              className="flex items-center justify-center text-[#64748b]"
            >
              <ChevronDown
                size={17}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;