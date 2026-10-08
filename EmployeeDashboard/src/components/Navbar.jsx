import { useState } from "react";

import {
  Bell,
  ChevronDown,
  CircleHelp,
  Mail,
  Menu,
  Search,
  X,
} from "lucide-react";

import { useSelector } from "react-redux";

import { selectEmployee } from "../redux/employeeSlice";

function Navbar({ onMenuClick, isSidebarOpen }) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // =========================================================
  // EMPLOYEE DATA FROM REDUX
  // =========================================================

  const employee = useSelector(selectEmployee);

  const fullName = employee?.fullName || "Employee";
  const email = employee?.email || "";

  // =========================================================
  // CREATE INITIALS
  // =========================================================

  const initials =
    fullName
      ?.trim()
      ?.split(/\s+/)
      ?.filter(Boolean)
      ?.slice(0, 2)
      ?.map((name) => name.charAt(0).toUpperCase())
      ?.join("") || "E";

  return (
    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-50
        h-[70px]
        border-b
        border-violet-100
        bg-white
      "
    >
      <div
        className="
          flex
          h-full
          items-center
          justify-between
          px-3
          sm:px-5
          lg:px-8
        "
      >
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="flex min-w-0 shrink-0 items-center gap-2">
          {/* =================================================
              MOBILE MENU
          ================================================== */}

          <button
            type="button"
            onClick={onMenuClick}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-violet-50
              hover:text-[#8138A2]
              lg:hidden
            "
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X
                size={20}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={20}
                strokeWidth={1.8}
              />
            )}
          </button>

          {/* =================================================
              LOGO
          ================================================== */}

          <div className="flex min-w-0 shrink-0 items-center">
            <img
              src="/web_logo.png"
              alt="Conference Hub"
              className="
                h-9
                w-auto
                max-w-[145px]
                object-contain
                sm:h-10
                sm:max-w-none
              "
            />
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-1.5
            sm:gap-2.5
            lg:gap-3
          "
        >
          {/* =================================================
              DESKTOP SEARCH
          ================================================== */}

          <div
            className="
              relative
              hidden
              w-[260px]
              lg:block
              xl:w-[360px]
            "
          >
            <Search
              size={16}
              strokeWidth={1.8}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search speakers, abstracts, registrations..."
              className="
                h-9
                w-full
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                pl-9
                pr-3
                text-[11px]
                text-slate-700
                outline-none
                placeholder:text-slate-400
                transition
                focus:border-[#8138A2]
                focus:bg-white
                focus:ring-1
                focus:ring-[#8138A2]/10
              "
            />
          </div>

          {/* =================================================
              MOBILE SEARCH BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setShowMobileSearch((prev) => !prev)
            }
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-violet-50
              hover:text-[#8138A2]
              lg:hidden
            "
            aria-label="Search"
          >
            <Search
              size={18}
              strokeWidth={1.8}
            />
          </button>

          {/* =================================================
              NOTIFICATION
          ================================================== */}

          <button
            type="button"
            className="
              relative
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-violet-50
              hover:text-[#8138A2]
            "
            aria-label="Notifications"
          >
            <Bell
              size={18}
              strokeWidth={1.8}
            />

            <span
              className="
                absolute
                right-[7px]
                top-[6px]
                h-1.5
                w-1.5
                rounded-full
                bg-[#8138A2]
                ring-2
                ring-white
              "
            />
          </button>

          {/* =================================================
              MAIL
          ================================================== */}

          <button
            type="button"
            className="
              hidden
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-violet-50
              hover:text-[#8138A2]
              sm:flex
            "
            aria-label="Mail"
          >
            <Mail
              size={18}
              strokeWidth={1.8}
            />
          </button>

          {/* =================================================
              HELP
          ================================================== */}

          <button
            type="button"
            className="
              hidden
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-violet-50
              hover:text-[#8138A2]
              md:flex
            "
            aria-label="Help"
          >
            <CircleHelp
              size={18}
              strokeWidth={1.8}
            />
          </button>

          {/* =================================================
              DIVIDER
          ================================================== */}

          <div
            className="
              hidden
              h-7
              w-px
              bg-slate-200
              sm:block
            "
          />

          {/* =================================================
              PROFILE
          ================================================== */}

          <button
            type="button"
            title={email ? `${fullName} - ${email}` : fullName}
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              rounded-lg
              px-1
              py-1
              transition
              hover:bg-slate-50
              sm:gap-2
              sm:px-1.5
            "
          >
            {/* =================================================
                AVATAR
            ================================================== */}

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#8138A2]
                text-[11px]
                font-bold
                text-white
              "
            >
              {initials}
            </div>

            {/* =================================================
                NAME
            ================================================== */}

            <span
              className="
                hidden
                max-w-[120px]
                truncate
                whitespace-nowrap
                text-[12px]
                font-semibold
                text-slate-700
                sm:block
                lg:max-w-[160px]
              "
            >
              {fullName}
            </span>

            {/* =================================================
                DROPDOWN
            ================================================== */}

            <ChevronDown
              className="
                hidden
                h-3.5
                w-3.5
                shrink-0
                text-slate-400
                sm:block
              "
            />
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH BAR
      ====================================================== */}

      {showMobileSearch && (
        <div
          className="
            absolute
            left-0
            right-0
            top-[70px]
            border-b
            border-slate-200
            bg-white
            px-3
            py-2
            shadow-sm
            lg:hidden
          "
        >
          <div className="relative">
            <Search
              size={16}
              strokeWidth={1.8}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              autoFocus
              type="text"
              placeholder="Search speakers, abstracts, registrations..."
              className="
                h-10
                w-full
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                pl-9
                pr-3
                text-[12px]
                text-slate-700
                outline-none
                placeholder:text-slate-400
                transition
                focus:border-[#8138A2]
                focus:bg-white
                focus:ring-1
                focus:ring-[#8138A2]/10
              "
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;