import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Mail,
  Phone,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react";

const RegistrationDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationId } = useParams();

  const conference = location.state?.conference || {
    id: registrationId,
    conference: "Mental Health & Psychiatry",
    date: "Sep 17–18, 2026",
    registrations: 342,
    status: "Upcoming",
  };

  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 10;

  /*
   * Dummy registered users.
   * Later this will come from API.
   */
  const [registeredUsers] = useState([
    {
      id: 1,
      fullName: "Rahul Sharma",
      email: "rahul.sharma@gmail.com",
      phone: "+91 9876543210",
      paymentStatus: "Paid",
      registrationId: "REG-10001",
    },
    {
      id: 2,
      fullName: "Priya Reddy",
      email: "priya.reddy@gmail.com",
      phone: "+91 9876543211",
      paymentStatus: "Paid",
      registrationId: "REG-10002",
    },
    {
      id: 3,
      fullName: "Arjun Kumar",
      email: "arjun.kumar@gmail.com",
      phone: "+91 9876543212",
      paymentStatus: "Unpaid",
      registrationId: "REG-10003",
    },
    {
      id: 4,
      fullName: "Sneha Rao",
      email: "sneha.rao@gmail.com",
      phone: "+91 9876543213",
      paymentStatus: "Paid",
      registrationId: "REG-10004",
    },
    {
      id: 5,
      fullName: "Vikram Singh",
      email: "vikram.singh@gmail.com",
      phone: "+91 9876543214",
      paymentStatus: "Paid",
      registrationId: "REG-10005",
    },
    {
      id: 6,
      fullName: "Ananya Patel",
      email: "ananya.patel@gmail.com",
      phone: "+91 9876543215",
      paymentStatus: "Unpaid",
      registrationId: "REG-10006",
    },
    {
      id: 7,
      fullName: "Kiran Reddy",
      email: "kiran.reddy@gmail.com",
      phone: "+91 9876543216",
      paymentStatus: "Paid",
      registrationId: "REG-10007",
    },
    {
      id: 8,
      fullName: "Sandeep Kumar",
      email: "sandeep.kumar@gmail.com",
      phone: "+91 9876543217",
      paymentStatus: "Paid",
      registrationId: "REG-10008",
    },
    {
      id: 9,
      fullName: "Divya Menon",
      email: "divya.menon@gmail.com",
      phone: "+91 9876543218",
      paymentStatus: "Unpaid",
      registrationId: "REG-10009",
    },
    {
      id: 10,
      fullName: "Rohit Verma",
      email: "rohit.verma@gmail.com",
      phone: "+91 9876543219",
      paymentStatus: "Paid",
      registrationId: "REG-10010",
    },
    {
      id: 11,
      fullName: "Meghana Rao",
      email: "meghana.rao@gmail.com",
      phone: "+91 9876543220",
      paymentStatus: "Paid",
      registrationId: "REG-10011",
    },
    {
      id: 12,
      fullName: "Ajay Das",
      email: "ajay.das@gmail.com",
      phone: "+91 9876543221",
      paymentStatus: "Unpaid",
      registrationId: "REG-10012",
    },
    {
      id: 13,
      fullName: "Nikhil Reddy",
      email: "nikhil.reddy@gmail.com",
      phone: "+91 9876543222",
      paymentStatus: "Paid",
      registrationId: "REG-10013",
    },
    {
      id: 14,
      fullName: "Lakshmi Devi",
      email: "lakshmi.devi@gmail.com",
      phone: "+91 9876543223",
      paymentStatus: "Paid",
      registrationId: "REG-10014",
    },
    {
      id: 15,
      fullName: "Manoj Kumar",
      email: "manoj.kumar@gmail.com",
      phone: "+91 9876543224",
      paymentStatus: "Unpaid",
      registrationId: "REG-10015",
    },
    {
      id: 16,
      fullName: "Pooja Shah",
      email: "pooja.shah@gmail.com",
      phone: "+91 9876543225",
      paymentStatus: "Paid",
      registrationId: "REG-10016",
    },
    {
      id: 17,
      fullName: "Harish Babu",
      email: "harish.babu@gmail.com",
      phone: "+91 9876543226",
      paymentStatus: "Paid",
      registrationId: "REG-10017",
    },
    {
      id: 18,
      fullName: "Neha Kapoor",
      email: "neha.kapoor@gmail.com",
      phone: "+91 9876543227",
      paymentStatus: "Unpaid",
      registrationId: "REG-10018",
    },
    {
      id: 19,
      fullName: "Ramesh Naidu",
      email: "ramesh.naidu@gmail.com",
      phone: "+91 9876543228",
      paymentStatus: "Paid",
      registrationId: "REG-10019",
    },
    {
      id: 20,
      fullName: "Swathi Krishna",
      email: "swathi.krishna@gmail.com",
      phone: "+91 9876543229",
      paymentStatus: "Paid",
      registrationId: "REG-10020",
    },
    {
      id: 21,
      fullName: "Abhishek Rao",
      email: "abhishek.rao@gmail.com",
      phone: "+91 9876543230",
      paymentStatus: "Paid",
      registrationId: "REG-10021",
    },
    {
      id: 22,
      fullName: "Keerthi Reddy",
      email: "keerthi.reddy@gmail.com",
      phone: "+91 9876543231",
      paymentStatus: "Unpaid",
      registrationId: "REG-10022",
    },
    {
      id: 23,
      fullName: "Tarun Kumar",
      email: "tarun.kumar@gmail.com",
      phone: "+91 9876543232",
      paymentStatus: "Paid",
      registrationId: "REG-10023",
    },
    {
      id: 24,
      fullName: "Sowmya Rao",
      email: "sowmya.rao@gmail.com",
      phone: "+91 9876543233",
      paymentStatus: "Paid",
      registrationId: "REG-10024",
    },
    {
      id: 25,
      fullName: "Mahesh Babu",
      email: "mahesh.babu@gmail.com",
      phone: "+91 9876543234",
      paymentStatus: "Unpaid",
      registrationId: "REG-10025",
    },
    {
      id: 26,
      fullName: "Aishwarya Reddy",
      email: "aishwarya.reddy@gmail.com",
      phone: "+91 9876543235",
      paymentStatus: "Paid",
      registrationId: "REG-10026",
    },
    {
      id: 27,
      fullName: "Gautham Krishna",
      email: "gautham.krishna@gmail.com",
      phone: "+91 9876543236",
      paymentStatus: "Paid",
      registrationId: "REG-10027",
    },
    {
      id: 28,
      fullName: "Bhavya Sri",
      email: "bhavya.sri@gmail.com",
      phone: "+91 9876543237",
      paymentStatus: "Unpaid",
      registrationId: "REG-10028",
    },
    {
      id: 29,
      fullName: "Naveen Kumar",
      email: "naveen.kumar@gmail.com",
      phone: "+91 9876543238",
      paymentStatus: "Paid",
      registrationId: "REG-10029",
    },
    {
      id: 30,
      fullName: "Tejaswini Rao",
      email: "tejaswini.rao@gmail.com",
      phone: "+91 9876543239",
      paymentStatus: "Paid",
      registrationId: "REG-10030",
    },
  ]);

  const totalRegisteredUsers = registeredUsers.length;

  const paidRegistrations = registeredUsers.filter(
    (user) => user.paymentStatus === "Paid",
  ).length;

  const unpaidRegistrations = registeredUsers.filter(
    (user) => user.paymentStatus === "Unpaid",
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalRegisteredUsers / usersPerPage),
  );

  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;

    return registeredUsers.slice(start, start + usersPerPage);
  }, [currentPage, registeredUsers]);

  const handleUserClick = (user) => {
    navigate(`/admin/registrations/${conference.id}/user/${user.id}`, {
      state: {
        user,
        conference,
      },
    });
  };

  return (
    <div className="w-full">
      {/* SUMMARY CARDS */}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Total Registrations
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {conference.registrations.toLocaleString()}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Users size={17} className="text-violet-600" />
            </div>
          </div>
        </div>

        {/* PAID */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Paid Registrations
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {paidRegistrations}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CreditCard size={17} className="text-violet-600" />
            </div>
          </div>
        </div>

        {/* UNPAID */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Unpaid Registrations
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {unpaidRegistrations}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <WalletCards size={17} className="text-violet-600" />
            </div>
          </div>
        </div>

        {/* USERS */}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">
                Registered Users
              </p>

              <h2 className="mt-1 text-[22px] font-bold text-gray-900">
                {totalRegisteredUsers}
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <UserCheck size={17} className="text-violet-600" />
            </div>
          </div>
        </div>
      </div>

      {/* CONFERENCE HEADER */}

      <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <CalendarDays size={19} className="text-violet-600" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-bold text-gray-900">
                {conference.conference}
              </h2>

              <p className="mt-1 text-[11px] text-gray-500">
                {conference.date}
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-600">
            {conference.status}
          </span>
        </div>
      </div>

      {/* USERS TABLE */}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h2 className="text-[14px] font-semibold text-gray-900">
              Registered Users
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Click a user to view complete registration details.
            </p>
          </div>

          <div className="rounded-lg bg-violet-50 px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-violet-600">
              {totalRegisteredUsers} Users
            </span>
          </div>
        </div>

        <div className="w-full">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="w-[28%] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Full Name
                </th>

                <th className="w-[30%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                <th className="w-[22%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                </th>

                <th className="w-[20%] px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Payment Status
                </th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-violet-50/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[10px] font-bold text-violet-600">
                        {user.fullName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <p className="truncate text-[12px] font-semibold text-gray-800">
                        {user.fullName}
                      </p>
                    </div>
                  </td>

                  <td className="truncate px-3 py-3 text-[11px] text-gray-500">
                    {user.email}
                  </td>

                  <td className="px-3 py-3 text-[11px] text-gray-500">
                    {user.phone}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                        user.paymentStatus === "Paid"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {user.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
          <p className="text-[10px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {(currentPage - 1) * usersPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * usersPerPage, totalRegisteredUsers)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {totalRegisteredUsers}
            </span>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[10px] font-semibold transition ${
                    currentPage === page
                      ? "bg-violet-600 text-white"
                      : "border border-gray-200 bg-white text-gray-500 hover:border-violet-200 hover:text-violet-600"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetailsPage;
