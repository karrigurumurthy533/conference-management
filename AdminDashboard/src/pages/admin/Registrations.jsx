import React from "react";

const Registrations = () => {
  return (
    <Page
      title="Registrations"
      description="Manage conference registrations and attendees."
    />
  );
};

const Page = ({ title, description }) => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900">
      {title}
    </h1>

    <p className="mt-1 text-sm text-gray-500">
      {description}
    </p>

    <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <p className="text-gray-500">
        {title} content will be added here.
      </p>
    </div>
  </div>
);

export default Registrations;