import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  UserPlus,
  ClipboardList,
  CreditCard,
  BarChart3,
  Mic2,
  Bell,
  UserCircle,
  LogOut,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();

  // Active tab styles
  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium transition-all duration-200
    ${
      isActive
        ? "text-[#7C3AED]"
        : "text-gray-600 hover:text-[#7C3AED]"
    }`;

  const iconClass = ({ isActive }) =>
    `transition-all duration-200
    ${
      isActive
        ? "text-[#7C3AED]"
        : "text-gray-500 group-hover:text-[#7C3AED]"
    }`;

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        w-[250px]
        flex-col
        border-r
        border-gray-200
        bg-white
      "
    >

      {/* =====================================================
          LOGO
      ===================================================== */}
      <div className="flex h-[78px] shrink-0 items-center border-b border-gray-100 px-5">
        <img
          src="/web_logo.png"
          alt="GlobalScion"
          className="h-11 w-auto object-contain"
        />
      </div>


      {/* =====================================================
          NAVIGATION
          NO SCROLL
          NO NESTED MENU
      ===================================================== */}
      <nav className="flex-1 px-4 py-5">

        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                Dashboard
              </span>
            </>
          )}
        </NavLink>


        {/* Create Conference */}
        <NavLink
          to="/admin/conferences/create"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <CalendarPlus
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                Create New Conference
              </span>
            </>
          )}
        </NavLink>


        {/* All Conferences */}
        <NavLink
          to="/admin/conferences"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <CalendarDays
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                All Conferences
              </span>
            </>
          )}
        </NavLink>


        {/* Create Employee */}
        <NavLink
          to="/admin/employees/create"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <UserPlus
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                Create New Employee
              </span>
            </>
          )}
        </NavLink>


        {/* Registrations */}
        <NavLink
          to="/admin/registrations"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <ClipboardList
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                Registrations
              </span>
            </>
          )}
        </NavLink>


        {/* Payments */}
        <NavLink
          to="/admin/payments"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <CreditCard
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                Payments
              </span>
            </>
          )}
        </NavLink>


        {/* Reports */}
        <NavLink
          to="/admin/reports"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <BarChart3
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                Reports
              </span>
            </>
          )}
        </NavLink>


        {/* Speakers */}
        <NavLink
          to="/admin/speakers"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <Mic2
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                Speakers
              </span>
            </>
          )}
        </NavLink>


        {/* Notifications */}
        <NavLink
          to="/admin/notifications"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <Bell
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                Notifications
              </span>
            </>
          )}
        </NavLink>


        {/* Profile */}
        <NavLink
          to="/admin/profile"
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <UserCircle
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>
                Profile
              </span>
            </>
          )}
        </NavLink>

      </nav>


      {/* =====================================================
          LOGOUT
      ===================================================== */}
      <div className="shrink-0 border-t border-gray-100 px-4 py-4">

        <button
          onClick={handleLogout}
          className="
            group
            flex
            w-full
            items-center
            gap-3
            px-3
            py-2.5
            text-[14px]
            font-medium
            text-gray-600
            transition-all
            duration-200
            hover:text-red-500
          "
        >
          <LogOut
            size={19}
            className="text-gray-500 transition group-hover:text-red-500"
          />

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;