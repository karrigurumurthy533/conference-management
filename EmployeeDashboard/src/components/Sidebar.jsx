import {
  Bell,
  CalendarDays,
  CheckSquare,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PhoneCall,
  UserCircle,
  Users,
  UserRound,
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
    name: "Registrations",
    path: "/registrations",
    icon: Users,
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Follow-ups",
    path: "/follow-ups",
    icon: PhoneCall,
  },
  {
    name: "Communications",
    path: "/communications",
    icon: MessageSquare,
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

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[265px] flex-col overflow-hidden border-r border-[#292740] bg-[#111025] text-white">

      {/* Logo */}
      <div className="border-b border-[#292740] px-5 py-5">
        <div className="flex items-center gap-3">

          {/* Logo Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6d43e8] shadow-sm">
            <Globe2
              size={22}
              strokeWidth={2}
              className="text-white"
            />
          </div>

          {/* Brand */}
          <div className="min-w-0">
            <h1 className="text-[17px] font-bold leading-tight tracking-tight text-white">
              GlobalScion
            </h1>

            <p className="mt-0.5 text-[10px] font-medium text-[#85829f]">
              Conference Management
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 [scrollbar-color:#85838f_#111025] [scrollbar-width:thin]">

        <nav className="space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex h-[44px] items-center gap-3 rounded-xl px-3 text-[14px] transition ${
                    isActive
                      ? "bg-[#6d43e8] font-medium text-white shadow-sm"
                      : "text-[#9997b5] hover:bg-[#1b1931] hover:text-white"
                  }`
                }
              >
                <Icon
                  size={18}
                  strokeWidth={1.7}
                />

                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-[#292740] px-3 py-3">

        {/* Notifications */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex h-[44px] items-center gap-3 rounded-xl px-3 text-[14px] transition ${
              isActive
                ? "bg-[#6d43e8] font-medium text-white"
                : "text-[#9997b5] hover:bg-[#1b1931] hover:text-white"
            }`
          }
        >
          <Bell
            size={18}
            strokeWidth={1.7}
          />

          <span>Notifications</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `mt-1 flex h-[42px] items-center gap-3 rounded-xl px-3 text-[14px] transition ${
              isActive
                ? "bg-[#7045e9] font-medium text-white"
                : "text-[#9997b5] hover:bg-[#1b1931] hover:text-white"
            }`
          }
        >
          <UserCircle
            size={19}
            strokeWidth={1.7}
          />

          <span>My Profile</span>
        </NavLink>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex h-[42px] w-full items-center gap-3 rounded-xl px-3 text-[14px] text-[#9997b5] transition hover:bg-[#1b1931] hover:text-white"
        >
          <LogOut
            size={18}
            strokeWidth={1.7}
          />

          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
}

export default Sidebar;