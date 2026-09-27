import {
  Bell,
  ChevronDown,
  CircleHelp,
  Mail,
  Search,
} from "lucide-react";

function Navbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-[60px]
        border-b
        border-[#e5e7eb]
        bg-white
      "
    >
      <div className="flex h-full items-center justify-between px-5">
        {/* =====================================================
            SEARCH
        ====================================================== */}
        <div className="flex min-w-0 items-center">
          <div className="relative w-[420px]">
            <Search
              size={17}
              strokeWidth={1.8}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-[#64748b]
              "
            />

            <input
              type="text"
              placeholder="Search speakers, abstracts, registrations..."
              className="
                h-[36px]
                w-full
                rounded-lg
                border
                border-[#dfe3eb]
                bg-[#f7f8fc]
                pl-10
                pr-4
                text-[13px]
                text-[#111827]
                outline-none
                placeholder:text-[#94a3b8]
                transition
                focus:border-violet-300
                focus:bg-white
              "
            />
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Notification */}
          <button
            type="button"
            className="
              relative
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-[#64748b]
              transition
              hover:bg-[#f5f3ff]
              hover:text-violet-600
            "
          >
            <Bell
              size={19}
              strokeWidth={1.8}
            />

            <span
              className="
                absolute
                right-[4px]
                top-[3px]
                h-2
                w-2
                rounded-full
                bg-red-500
                ring-2
                ring-white
              "
            />
          </button>

          {/* Mail */}
          <button
            type="button"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-[#64748b]
              transition
              hover:bg-[#f5f3ff]
              hover:text-violet-600
            "
          >
            <Mail
              size={19}
              strokeWidth={1.8}
            />
          </button>

          {/* Help */}
          <button
            type="button"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-[#64748b]
              transition
              hover:bg-[#f5f3ff]
              hover:text-violet-600
            "
          >
            <CircleHelp
              size={19}
              strokeWidth={1.8}
            />
          </button>

          {/* =================================================
              USER PROFILE
          ================================================== */}
          <div className="ml-1 flex items-center gap-2.5">
            {/* Avatar */}
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-[#ede9fe]
              "
            >
              <span className="text-[11px] font-semibold text-violet-600">
                JM
              </span>
            </div>

            {/* Name */}
            <span
              className="
                text-[13px]
                font-semibold
                text-[#111827]
                whitespace-nowrap
              "
            >
              John Mathew
            </span>

            {/* Dropdown */}
            <button
              type="button"
              className="
                flex
                items-center
                justify-center
                text-[#64748b]
                transition
                hover:text-violet-600
              "
            >
              <ChevronDown
                size={16}
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