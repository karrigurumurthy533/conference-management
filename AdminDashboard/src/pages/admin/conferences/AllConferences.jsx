import React from "react";
import { Plus, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

const AllConferences = () => {

  const conferences = [
    {
      title: "Mental Health & Psychiatry",
      date: "Sep 17–18, 2026",
      status: "Upcoming",
      registrations: 342,
    },
    {
      title: "Endocrine & Metabolic Innovation",
      date: "Oct 08–09, 2026",
      status: "Upcoming",
      registrations: 268,
    },
    {
      title: "Food, Nutrition & Wellness",
      date: "Sep 17–18, 2026",
      status: "Upcoming",
      registrations: 223,
    },
    {
      title: "Oncology Research & AI Innovations",
      date: "Nov 12–13, 2026",
      status: "Published",
      registrations: 187,
    },
  ];

  return (
    <div>

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            All Conferences
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all GlobalScion conferences.
          </p>
        </div>

        <Link
          to="/admin/conferences/create"
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700"
        >
          <Plus size={18} />
          New Conference
        </Link>

      </div>


      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Conference
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Registrations
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                  Action
                </th>

              </tr>
            </thead>


            <tbody>

              {conferences.map((conference) => (

                <tr
                  key={conference.title}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >

                  <td className="px-6 py-5">

                    <p className="font-medium text-gray-800">
                      {conference.title}
                    </p>

                  </td>

                  <td className="px-6 py-5 text-sm text-gray-500">
                    {conference.date}
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-gray-700">
                    {conference.registrations}
                  </td>

                  <td className="px-6 py-5">

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                      {conference.status}
                    </span>

                  </td>

                  <td className="px-6 py-5 text-right">

                    <button className="text-gray-400 hover:text-purple-600">
                      <MoreVertical size={18} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AllConferences;