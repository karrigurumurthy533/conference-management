import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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

import { logout } from "../../redux/authSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navClass = ({ isActive }) =>
    `group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-200 ${
      isActive
        ? "bg-purple-50 text-[#7C3AED]"
        : "text-gray-600 hover:bg-gray-50 hover:text-[#7C3AED]"
    }`;

  const iconClass = ({ isActive }) =>
    `shrink-0 transition-all duration-200 ${
      isActive
        ? "text-[#7C3AED]"
        : "text-gray-500 group-hover:text-[#7C3AED]"
    }`;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/admin/login");
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[220px] flex-col border-r border-gray-200 bg-white">
      <div className="flex h-[60px] shrink-0 items-center border-b border-gray-100 px-4">
        <img
          src="/web_logo.png"
          alt="GlobalScion"
          className="h-9 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 overflow-hidden px-3 py-3">
        <NavLink to="/admin/dashboard" className={navClass}>
          {({ isActive }) => (
            <>
              <LayoutDashboard
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Dashboard</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/conferences/create" className={navClass}>
          {({ isActive }) => (
            <>
              <CalendarPlus
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Create New Conference</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/conferences" className={navClass}>
          {({ isActive }) => (
            <>
              <CalendarDays
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>All Conferences</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/employees/create" className={navClass}>
          {({ isActive }) => (
            <>
              <UserPlus
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Create New Employee</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/registrations" className={navClass}>
          {({ isActive }) => (
            <>
              <ClipboardList
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Registrations</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/payments" className={navClass}>
          {({ isActive }) => (
            <>
              <CreditCard
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Payments</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/reports" className={navClass}>
          {({ isActive }) => (
            <>
              <BarChart3
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Reports</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/speakers" className={navClass}>
          {({ isActive }) => (
            <>
              <Mic2
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Speakers</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/notifications" className={navClass}>
          {({ isActive }) => (
            <>
              <Bell
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Notifications</span>
            </>
          )}
        </NavLink>

        <NavLink to="/admin/profile" className={navClass}>
          {({ isActive }) => (
            <>
              <UserCircle
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Profile</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="shrink-0 border-t border-gray-100 px-3 py-2.5">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
        >
          <LogOut
            size={18}
            className="text-gray-500 transition group-hover:text-red-500"
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;