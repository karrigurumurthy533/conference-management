import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  ClipboardList,
  CreditCard,
  BarChart3,
  Mic2,
  Star,
  LogOut,
  FilePlus,
  Receipt,
  Download,
  FileText,
  Users,
  CalendarCheck,
} from "lucide-react";
import { logout } from "../../redux/authSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-lg px-2 py-1.5 text-[14px] font-medium whitespace-nowrap transition-all duration-200 ${
      isActive
        ? "bg-purple-50 text-[#7C3AED]"
        : "text-gray-600 hover:bg-gray-50 hover:text-[#7C3AED]"
    }`;

  const iconClass = ({ isActive }) =>
    `shrink-0 transition-all duration-200 ${
      isActive ? "text-[#7C3AED]" : "text-gray-500 group-hover:text-[#7C3AED]"
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
      {/* Logo */}
      <div className="flex h-[60px] shrink-0 items-center border-b border-gray-100 px-4">
        <img
          src="/web_logo.png"
          alt="GlobalScion"
          className="h-9 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-hidden px-3 py-2">
        {/* Dashboard */}
        <NavLink to="/admin/dashboard" className={navClass}>
          {({ isActive }) => (
            <>
              <LayoutDashboard
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Dashboard</span>
            </>
          )}
        </NavLink>

        {/* Conferences */}
        <NavLink to="/admin/conferences" className={navClass}>
          {({ isActive }) => (
            <>
              <CalendarDays
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Conferences</span>
            </>
          )}
        </NavLink>

        {/* Brochures */}
        <NavLink to="/admin/brochures" className={navClass}>
          {({ isActive }) => (
            <>
              <FilePlus
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Brochures</span>
            </>
          )}
        </NavLink>

        {/* Download Brochures */}
        <NavLink to="/admin/download-brochures" className={navClass}>
          {({ isActive }) => (
            <>
              <Download
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Download Brochures</span>
            </>
          )}
        </NavLink>

        {/* Abstracts */}
        <NavLink to="/admin/abstracts" className={navClass}>
          {({ isActive }) => (
            <>
              <FileText
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Abstracts</span>
            </>
          )}
        </NavLink>

        {/* Employees */}
        <NavLink to="/admin/employees" className={navClass}>
          {({ isActive }) => (
            <>
              <UserCircle
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Employees</span>
            </>
          )}
        </NavLink>

        {/* Employee Attendance */}
        <NavLink to="/admin/employee-attendance" className={navClass}>
          {({ isActive }) => (
            <>
              <CalendarCheck
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />

              <span>Employee Attendance</span>
            </>
          )}
        </NavLink>

        {/* Registrations */}
        <NavLink to="/admin/registrations" className={navClass}>
          {({ isActive }) => (
            <>
              <ClipboardList
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Registrations</span>
            </>
          )}
        </NavLink>

        {/* Payments */}
        <NavLink to="/admin/payments" className={navClass}>
          {({ isActive }) => (
            <>
              <CreditCard
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Payments</span>
            </>
          )}
        </NavLink>

        {/* Invoices */}
        <NavLink to="/admin/invoices" className={navClass}>
          {({ isActive }) => (
            <>
              <Receipt
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Invoices</span>
            </>
          )}
        </NavLink>

        {/* Reports */}
        <NavLink to="/admin/reports" className={navClass}>
          {({ isActive }) => (
            <>
              <BarChart3
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Reports</span>
            </>
          )}
        </NavLink>

        {/* Speakers */}
        <NavLink to="/admin/speakers" className={navClass}>
          {({ isActive }) => (
            <>
              <Mic2
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Speakers</span>
            </>
          )}
        </NavLink>

        {/* Reviews */}
        <NavLink to="/admin/reviews" className={navClass}>
          {({ isActive }) => (
            <>
              <Star
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Reviews</span>
            </>
          )}
        </NavLink>

        {/* Subscribers */}
        <NavLink to="/admin/subscribers" className={navClass}>
          {({ isActive }) => (
            <>
              <Users
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Subscribers</span>
            </>
          )}
        </NavLink>

        {/* Profile */}
        <NavLink to="/admin/profile" className={navClass}>
          {({ isActive }) => (
            <>
              <UserCircle
                size={17}
                strokeWidth={isActive ? 2.5 : 2}
                className={iconClass({ isActive })}
              />
              <span>Profile</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-gray-100 px-3 py-2">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
        >
          <LogOut
            size={17}
            className="text-gray-500 transition group-hover:text-red-500"
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
