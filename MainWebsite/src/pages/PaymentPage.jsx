import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getRegistrationByIdApi,
  getConferenceByIdApi,
  createPaymentOrderApi,
  verifyPaymentApi,
} from "../api/api";

const PaymentPage = () => {
  const { registrationId } = useParams();

  const [registration, setRegistration] = useState(null);
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const registrationResponse =
          await getRegistrationByIdApi(registrationId);

        const registrationData =
          registrationResponse?.data?.data ||
          registrationResponse?.data ||
          null;

        if (!registrationData) {
          setError("Registration not found");
          return;
        }

        setRegistration(registrationData);

        const conferenceReference =
          registrationData?.conference?.conferenceId;

        if (!conferenceReference) {
          setError("Conference information not found");
          return;
        }

        const conferenceId =
          typeof conferenceReference === "object"
            ? conferenceReference._id ||
              conferenceReference.$oid
            : conferenceReference;

        if (!conferenceId) {
          setError("Invalid conference ID");
          return;
        }

        const conferenceResponse =
          await getConferenceByIdApi(conferenceId);

        const conferenceData =
          conferenceResponse?.data?.data ||
          conferenceResponse?.data ||
          null;

        if (!conferenceData) {
          setError("Conference not found");
          return;
        }

        setConference(conferenceData);
      } catch (error) {
        console.error(
          "Fetch Payment Details Error:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load payment details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (registrationId) {
      fetchPaymentDetails();
    }
  }, [registrationId]);

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setPaymentError("");

      if (!registrationId) {
        setPaymentError("Registration ID is missing");
        return;
      }

      if (registration?.paymentStatus === "Paid") {
        setPaymentError(
          "This registration is already paid"
        );
        return;
      }

      if (!window.Razorpay) {
        setPaymentError(
          "Razorpay is not loaded. Please refresh the page and try again."
        );
        return;
      }

      const orderResponse =
        await createPaymentOrderApi(registrationId);

      const orderData =
        orderResponse?.data?.data ||
        orderResponse?.data ||
        null;

      if (!orderData) {
        setPaymentError(
          "Unable to create payment order"
        );
        return;
      }

      const {
        orderId,
        amount,
        currency,
        keyId,
      } = orderData;

      if (!orderId || !keyId) {
        setPaymentError(
          "Invalid Razorpay order response"
        );
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: "GlobalScion Conferences",
        description:
          registration?.registration?.option ||
          "Conference Registration",
        order_id: orderId,

        prefill: {
          name: `${registration?.firstName || ""} ${
            registration?.lastName || ""
          }`.trim(),
          email: registration?.email || "",
          contact: registration?.phone || "",
        },

        notes: {
          registrationId,
        },

        theme: {
          color: "#7C3AED",
        },

        handler: async (response) => {
          try {
            setPaymentLoading(true);
            setPaymentError("");

            const verifyResponse =
              await verifyPaymentApi({
                registrationId,
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature,
              });

            const verifyData =
              verifyResponse?.data?.data ||
              verifyResponse?.data ||
              null;

            if (!verifyData) {
              setPaymentError(
                "Payment verification failed"
              );
              return;
            }

            setRegistration(verifyData);

            alert(
              "Payment successful! Registration confirmed."
            );
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            setPaymentError(
              error?.response?.data?.message ||
                "Payment verification failed"
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay Payment Failed:",
            response
          );

          setPaymentError(
            response?.error?.description ||
              "Payment failed"
          );

          setPaymentLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Create Payment Order Error:",
        error
      );

      setPaymentError(
        error?.response?.data?.message ||
          "Unable to start payment"
      );

      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">
              Loading payment details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Payment
            </h1>

            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>

            <div className="mt-8">
              <Link
                to="/conferences"
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const registrationPrice =
    registration?.registration?.price || 0;

  const registrationCurrency =
    registration?.registration?.currency || "";

  const conferenceTitle =
    conference?.title ||
    registration?.conference?.title ||
    "";

  const conferenceDate =
    conference?.date ||
    registration?.conference?.date ||
    "";

  const conferenceLocation =
    conference?.location ||
    registration?.conference?.location ||
    "";

  const isPaid =
    registration?.paymentStatus === "Paid";

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
                    {conferenceTitle}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Conference Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {conferenceDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {conferenceLocation}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Registration Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {registration?.registration?.option}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {registration?.registration?.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Currency
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {registrationCurrency}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Amount
                  </p>

                  <p className="mt-1 text-lg font-bold text-violet-600">
                    {registrationCurrency}{" "}
                    {Number(
                      registrationPrice
                    ).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Payment Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {registration.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          )}

          {paymentError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">
                {paymentError}
              </p>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Link
              to="/conferences"
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700"
            >
              Back
            </Link>

            {!isPaid ? (
              <button
                type="button"
                onClick={handlePayment}
                disabled={paymentLoading}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentLoading
                  ? "Processing..."
                  : "Continue Payment"}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white"
              >
                Payment Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;