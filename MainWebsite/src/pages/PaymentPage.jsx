import React from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";

const PaymentPage = () => {
  const { registrationId } = useParams();

  const location = useLocation();

  const registration =
    location.state?.registration;

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Payment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Registration ID:{" "}
            <span className="font-semibold text-gray-900">
              {registrationId}
            </span>
          </p>

          {registration && (
            <div className="mt-6 rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Registration Details
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {registration.title}{" "}
                    {registration.firstName}{" "}
                    {registration.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {registration.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Conference
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {registration.conferenceName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Registration Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {
                      registration.registrationLabel
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Currency
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {registration.currency}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Amount
                  </p>

                  <p className="mt-1 text-lg font-bold text-violet-600">
                    {
                      registration.currencySymbol
                    }
                    {registration.total}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Link
              to="/conferences"
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700"
            >
              Back
            </Link>

            <button
              type="button"
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white"
            >
              Continue Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;