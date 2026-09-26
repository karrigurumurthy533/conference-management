import React from "react";

const CreateConference = () => {
  return (
    <div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Conference
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create and publish a new GlobalScion conference.
        </p>
      </div>


      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Conference Title
            </label>

            <input
              type="text"
              placeholder="Enter conference title"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Conference Category
            </label>

            <input
              type="text"
              placeholder="Healthcare / Technology / Research"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Start Date
            </label>

            <input
              type="date"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              End Date
            </label>

            <input
              type="date"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

        </div>


        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            rows="5"
            placeholder="Enter conference description..."
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
          />

        </div>


        <button className="mt-6 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700">
          Create Conference
        </button>

      </div>

    </div>
  );
};

export default CreateConference;