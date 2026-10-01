import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Download,
  Mail,
  Phone,
  User,
  Globe2,
  CheckCircle2,
} from "lucide-react";

import { getConferenceByIdApi } from "../api/api";
import {
  createDownloadBrochure,
  clearBrochure,
} from "../redux/userSlice";

const DownloadBrochure = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    requirements: "",
  });

  const {
    brochureLoading,
    brochureError,
    brochureSuccess,
  } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchConference = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getConferenceByIdApi(id);

        const apiData =
          response?.data?.data ||
          response?.data ||
          null;

        if (!apiData) {
          setConference(null);
          setError("Conference not found");
          return;
        }

        const startDate =
          apiData?.conferenceDates?.startDate ||
          apiData?.startDate ||
          "";

        const endDate =
          apiData?.conferenceDates?.endDate ||
          apiData?.endDate ||
          "";

        const formattedDate =
          startDate && endDate
            ? `${new Date(startDate).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                }
              )} - ${new Date(endDate).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                }
              )}`
            : apiData?.date || "";

        const normalizedConference = {
          ...apiData,

          id:
            apiData?._id ||
            apiData?.id ||
            id,

          title:
            apiData?.basicInformation?.title ||
            apiData?.title ||
            "",

          category:
            apiData?.basicInformation?.category ||
            apiData?.category ||
            "",

          subtitle:
            apiData?.basicInformation?.subtitle ||
            apiData?.subtitle ||
            "",

          description:
            apiData?.basicInformation?.description ||
            apiData?.description ||
            "",

          date: formattedDate,

          startDate,

          endDate,

          time:
            apiData?.conferenceDates?.time ||
            apiData?.time ||
            "",

          location:
            apiData?.venueInformation?.city ||
            apiData?.venueInformation?.location ||
            apiData?.venueInformation?.venueName ||
            apiData?.location ||
            "",

          mode:
            apiData?.venueInformation?.mode ||
            apiData?.mode ||
            apiData?.conferenceMode ||
            "",

          participants:
            apiData?.registrationInformation
              ?.expectedParticipants ||
            apiData?.participants ||
            "",

          image:
            apiData?.media?.bannerImage ||
            apiData?.media?.conferenceBanner ||
            apiData?.bannerImage ||
            apiData?.imageUrl ||
            apiData?.image ||
            "",
        };

        setConference(normalizedConference);
      } catch (error) {
        console.error(
          "Fetch Conference Details Error:",
          error
        );

        setConference(null);

        setError(
          error?.response?.data?.message ||
            "Failed to load conference details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConference();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      dispatch(clearBrochure());
    };
  }, [dispatch]);

  useEffect(() => {
    if (brochureSuccess) {
      setSubmitted(true);
    }
  }, [brochureSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!conference) {
      return;
    }

    const payload = {
      conferenceId: conference.id,
      conferenceTitle: conference.title,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      country: formData.country.trim(),
      requirements: formData.requirements.trim(),
    };

    console.log(
      "Brochure Request Payload:",
      payload
    );

    try {
      const result = await dispatch(
        createDownloadBrochure(payload)
      ).unwrap();

      console.log(
        "Brochure Request Success:",
        result
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Brochure Request Failed:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Download size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Download Brochure
          </h1>

          <p className="mt-2 text-gray-500">
            Loading conference details...
          </p>
        </div>
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Download size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Conference Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            {error || "Unable to load conference details."}
          </p>

          <Link
            to="/conferences"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            <ArrowLeft size={16} />
            Back to Conferences
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-600 text-white">
              <CheckCircle2 size={42} />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Brochure Request Submitted
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Thank you for your interest in{" "}
              <span className="font-semibold text-violet-700">
                {conference.title}
              </span>
              .
            </p>

            <p className="mt-2 text-sm text-gray-500">
              The conference brochure will be sent to
              your registered email address.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to={`/conferences/${conference.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                <ArrowLeft size={16} />
                Conference Details
              </Link>

              <Link
                to="/conferences"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                All Conferences
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#12091F] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Link
            to={`/conferences/${conference.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Conference
          </Link>

          <div className="mt-8 max-w-4xl">
            <span className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-200">
              {conference.category}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
              Download Conference Brochure
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-violet-100">
              Get the complete conference information,
              scientific program, speakers, topics and
              participation details.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            {conference.image && (
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={conference.image}
                  alt={conference.title}
                  className="h-[300px] w-full object-cover md:h-[380px]"
                />
              </div>
            )}

            <div className="mt-7">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                Conference
              </span>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                {conference.title}
              </h2>

              {conference.subtitle && (
                <p className="mt-3 text-base font-medium leading-7 text-gray-600">
                  {conference.subtitle}
                </p>
              )}

              {conference.description && (
                <p className="mt-4 text-sm leading-7 text-gray-500">
                  {conference.description}
                </p>
              )}
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <ConferenceInfo
                icon={<CalendarDays size={18} />}
                title={conference.date}
                subtitle={conference.time}
              />

              <ConferenceInfo
                icon={<MapPin size={18} />}
                title={conference.location}
                subtitle={conference.mode}
              />

              <ConferenceInfo
                icon={<Users size={18} />}
                title={conference.participants}
                subtitle="Expected Participants"
              />

              <ConferenceInfo
                icon={<Globe2 size={18} />}
                title={conference.category}
                subtitle="Conference Category"
              />
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Download size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Get the Brochure
                  </h2>

                  <p className="text-sm text-gray-500">
                    Enter your details below
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  icon={<User size={17} />}
                  required
                />

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  icon={<Mail size={17} />}
                  required
                />

                <FormInput
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  icon={<Phone size={17} />}
                  required
                />

                <FormInput
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                  icon={<Globe2 size={17} />}
                  required
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Requirements
                  </label>

                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Any specific requirements..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                {brochureError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {brochureError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={brochureLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {brochureLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Download Brochure
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </div>
    </div>
  );
};

const ConferenceInfo = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-gray-900">
          {title || "-"}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {subtitle || "-"}
        </p>
      </div>
    </div>
  );
};

export default DownloadBrochure;