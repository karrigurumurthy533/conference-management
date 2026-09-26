import React from "react";

const CreateEmployee = () => {
  return (
    <div>

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-900">
          Create New Employee
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new employee to the GlobalScion admin team.
        </p>

      </div>


      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter employee name"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="employee@globalscion.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Role
            </label>

            <select className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500">

              <option>Event Manager</option>
              <option>Coordinator</option>
              <option>Developer</option>
              <option>Marketing</option>
              <option>Finance</option>

            </select>

          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

        </div>


        <button className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700">
          Create Employee
        </button>

      </div>

    </div>
  );
};

export default CreateEmployee;