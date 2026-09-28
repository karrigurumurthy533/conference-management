import {
  Bell,
  CalendarDays,
  CheckSquare,
  FileText,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Users,
  UserRound,
  BookOpen,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Conference",
    path: "/conference",
    icon: CalendarDays,
  },
  {
    name: "Speakers",
    path: "/speakers",
    icon: UserRound,
  },
  {
    name: "Abstracts",
    path: "/abstracts",
    icon: FileText,
  },
  {
    name: "Brochures",
    path: "/brochures",
    icon: BookOpen,
  },
  {
    name: "Registrations",
    path: "/registrations",
    icon: Users,
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: CheckSquare,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    name: "My Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    navigate("/login", {
      replace: true,
    });
  };

  const navClass = ({ isActive }) =>
    `group flex h-[40px] items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all duration-200 ${
      isActive
        ? "bg-purple-50 text-[#7C3AED]"
        : "text-gray-600 hover:bg-gray-50 hover:text-[#7C3AED]"
    }`;

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        w-[220px]
        flex-col
        border-r
        border-gray-200
        bg-white
      "
    >
      <div className="flex h-[60px] shrink-0 items-center border-b border-gray-100 px-4">
        <img
          src="/web_logo.png"
          alt="GlobalScion"
          className="h-9 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 overflow-hidden px-3 py-2">
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={navClass}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.4 : 2}
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-[#7C3AED]"
                          : "text-gray-500 group-hover:text-[#7C3AED]"
                      }`}
                    />

                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-gray-100 px-3 py-2">
        <button
          type="button"
          onClick={handleLogout}
          className="
            group
            flex
            h-[40px]
            w-full
            items-center
            gap-2.5
            rounded-lg
            px-2.5
            text-[13px]
            font-medium
            text-gray-600
            transition-all
            duration-200
            hover:bg-red-50
            hover:text-red-500
          "
        >
          <LogOut
            size={18}
            strokeWidth={2}
            className="
              shrink-0
              text-gray-500
              transition-colors
              group-hover:text-red-500
            "
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;