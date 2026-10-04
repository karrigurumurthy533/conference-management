import React, { useEffect, useState } from "react";

import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Download,
  Mail,
  Phone,
  Globe2,
  FileText,
  CheckCircle2,
} from "lucide-react";

import { createDownloadBrochure, clearBrochure } from "../redux/userSlice";

import { getConferenceByIdApi, downloadBrochureApi } from "../api/api";

const DownloadBrochure = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const { brochureLoading, brochureSuccess, brochureError } = useSelector(
    (state) => state.user,
  );

  const initialConference = location.state?.conference || null;

  const [conference, setConference] = useState(initialConference);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    requirements: "",
  });

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchConference = async () => {
      try {
        const response = await getConferenceByIdApi(id);

        const apiData = response?.data?.data || response?.data || response;

        const basicInformation = apiData?.basicInformation || {};

        const conferenceDates = apiData?.conferenceDates || {};

        const venueInformation = apiData?.venueInformation || {};

        const media = apiData?.media || {};

        const normalizedConference = {
          id: apiData?._id || apiData?.id || id,

          title:
            basicInformation?.title ||
            apiData?.title ||
            apiData?.conferenceTitle ||
            "Conference",

          date:
            conferenceDates?.startDate ||
            apiData?.startDate ||
            apiData?.date ||
            "",

          endDate: conferenceDates?.endDate || apiData?.endDate || "",

          location:
            venueInformation?.city ||
            venueInformation?.location ||
            venueInformation?.venueName ||
            apiData?.location ||
            "",

          image:
            media?.bannerImage ||
            media?.heroImage ||
            media?.coverImage ||
            apiData?.bannerImage ||
            apiData?.image ||
            "",
        };

        setConference(normalizedConference);
      } catch (err) {
        console.error("Failed to fetch conference:", err);

        if (!initialConference) {
          toast.error(
            err?.response?.data?.message ||
              "Failed to load conference details.",
          );
        }
      }
    };

    if (id && !initialConference) {
      fetchConference();
    }
  }, [id, initialConference]);

  useEffect(() => {
    return () => {
      dispatch(clearBrochure());
    };
  }, [dispatch]);

  useEffect(() => {
    if (brochureSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearBrochure());
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [brochureSuccess, dispatch]);

  useEffect(() => {
    if (brochureError) {
      toast.error(brochureError);

      dispatch(clearBrochure());
    }
  }, [brochureError, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDownloading) {
      return;
    }

    if (!conference?.id) {
      toast.error("Conference details are not available.");

      return;
    }

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");

      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email.");

      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number.");

      return;
    }

    if (!formData.country.trim()) {
      toast.error("Please enter your country.");

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

    try {
      setIsDownloading(true);

      await dispatch(createDownloadBrochure(payload)).unwrap();

      const response = await downloadBrochureApi(conference.id);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const safeTitle = conference.title
        .replace(/[^a-z0-9]/gi, "_")
        .replace(/_+/g, "_");

      link.download = `${safeTitle}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Brochure downloaded successfully.");

      setTimeout(() => {
        navigate(-1);
      }, 800);
    } catch (err) {
      console.error("Brochure download error:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to download brochure.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadLoading = brochureLoading || isDownloading;

  if (!conference) {
    return (
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.25,
        }}
        className="min-h-screen flex items-center justify-center bg-white"
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Conference not found
          </h2>

          <Link
            to="/conferences"
            className="inline-flex items-center gap-2 mt-5 text-violet-600 hover:text-violet-700"
          >
            <ArrowLeft size={18} />
            Back to Conferences
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="min-h-screen bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
        >
          <motion.button
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            Back to Conference
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              {conference.image ? (
                <motion.img
                  initial={{
                    scale: 1.03,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  src={conference.image}
                  alt={conference.title}
                  className="w-full h-[420px] object-cover"
                />
              ) : (
                <div className="w-full h-[420px] flex items-center justify-center bg-violet-50">
                  <FileText size={70} className="text-violet-300" />
                </div>
              )}
            </div>

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="mt-6"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Download Brochure
              </h1>

              <p className="mt-3 text-gray-600 leading-7">
                Get the complete conference brochure with all important event
                information, speakers, sessions, registration details, and more.
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="mt-7 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <CalendarDays size={19} className="text-violet-600" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Conference Date</p>

                  <p className="font-medium text-gray-900">
                    {conference.date
                      ? new Date(conference.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Date will be announced"}

                    {conference.endDate &&
                      ` - ${new Date(conference.endDate).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}`}
                  </p>
                </div>
              </div>

              {conference.location && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <MapPin size={19} className="text-violet-600" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Location</p>

                    <p className="font-medium text-gray-900">
                      {conference.location}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Download size={19} className="text-violet-600" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Brochure</p>

                  <p className="font-medium text-gray-900">
                    Conference Information PDF
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.08,
              ease: "easeOut",
            }}
            className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.35,
                delay: 0.15,
              }}
              className="mb-7"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                <Download size={23} className="text-violet-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Download Conference Brochure
              </h2>

              <p className="mt-2 text-gray-500 text-sm leading-6">
                Please fill in your details below. Our team will process your
                brochure request.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>

                <div className="relative">
                  <Globe2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter your country"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                  <span className="text-gray-400 font-normal"> (Optional)</span>
                </label>

                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any specific requirements..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={downloadLoading}
                whileHover={
                  !downloadLoading
                    ? {
                        scale: 1.01,
                      }
                    : {}
                }
                whileTap={
                  !downloadLoading
                    ? {
                        scale: 0.99,
                      }
                    : {}
                }
                transition={{
                  duration: 0.2,
                }}
                className="w-full min-h-[54px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors duration-200 disabled:bg-violet-600 disabled:text-white disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                {downloadLoading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-violet-200 border-t-white animate-spin" />

                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={19} className="text-white" />

                    <span>Download Brochure</span>
                  </>
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.35,
                delay: 0.2,
              }}
              className="mt-6 flex items-start gap-3 p-4 bg-violet-50 rounded-xl"
            >
              <CheckCircle2
                size={19}
                className="text-violet-600 mt-0.5 flex-shrink-0"
              />

              <p className="text-sm text-gray-600 leading-6">
                After submitting your details, the conference brochure will be
                downloaded automatically.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DownloadBrochure;
