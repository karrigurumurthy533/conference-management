import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import { getConferenceByIdApi } from "../api/api";
import { createRegistration } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const heroTextVariants = {
  hidden: {
    opacity: 0,
    x: -25,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const heroInfoVariants = {
  hidden: {
    opacity: 0,
    x: 25,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      delay: 0.15,
      ease: "easeOut",
    },
  },
};

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const RegisterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [conference, setConference] = useState(null);
  const [conferenceLoading, setConferenceLoading] = useState(true);
  const [conferenceError, setConferenceError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { registrationLoading, registrationError } = useSelector(
    (state) => state.user
  );

  const colors = {
    pageBg: "#FFFFFF",
    text: "#111827",
    cardBg: "#FFFFFF",
    cardBgSecondary: "#FAF8FF",
    border: "#E5E7EB",
    borderStrong: "#DDD6FE",
    divider: "#F1F0F5",
    primary: "#7C3AED",
    primaryHover: "#6D28D9",
    primarySoft: "#F5F3FF",
    primarySoft2: "#EDE9FE",
    heading: "#6D28D9",
    body: "#374151",
    muted: "#6B7280",
    mutedLight: "#9CA3AF",
    inputBg: "#FFFFFF",
    inputBorder: "#E5E7EB",
    inputText: "#111827",
    heroBg: "#1E1B4B",
    heroSecondary: "#312E81",
    heroAccent: "#C084FC",
    heroSoft: "#A78BFA",
    selectedBg: "#F5F3FF",
    selectedBorder: "#7C3AED",
    shadow: "0 10px 30px rgba(124,58,237,0.06)",
    summaryShadow: "0 12px 35px rgba(124,58,237,0.09)",
    supportBg: "#F5F3FF",
    overlay: "rgba(15,7,32,0.75)",
  };

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    conference: id || "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    address: "",
    registrationType: "",
  });

  const [currency, setCurrency] = useState("GBP");

  const currencyConfig = {
    GBP: {
      symbol: "£",
      rate: 1,
      label: "GBP (£)",
    },
    USD: {
      symbol: "$",
      rate: 1.35,
      label: "USD ($)",
    },
    EUR: {
      symbol: "€",
      rate: 1.17,
      label: "EUR (€)",
    },
  };

  const selectedCurrency = currencyConfig[currency];

  const convertPrice = (gbpPrice) => {
    return gbpPrice * selectedCurrency.rate;
  };

  const registrationGroups = [
    {
      title: "Academic",
      color: "#8CCB9F",
      options: [
        {
          id: "academic-speaker",
          label: "Speaker Registration",
          price: 579,
        },
        {
          id: "academic-delegate",
          label: "Delegate Registration",
          price: 521,
        },
        {
          id: "academic-poster",
          label: "Poster Registration",
          price: 629,
        },
        {
          id: "academic-package-a",
          label: "Package A (Registration + 2 Nights Accommodation)",
          price: 979,
        },
        {
          id: "academic-package-b",
          label: "Package B (Registration + 3 Nights Accommodation)",
          price: 1079,
        },
      ],
    },
    {
      title: "Business",
      color: "#7EA0BD",
      options: [
        {
          id: "business-speaker",
          label: "Speaker Registration",
          price: 779,
        },
        {
          id: "business-delegate",
          label: "Delegate Registration",
          price: 629,
        },
        {
          id: "business-package-a",
          label: "Package A (Registration + 2 Nights Accommodation)",
          price: 1079,
        },
        {
          id: "business-package-b",
          label: "Package B (Registration + 3 Nights Accommodation)",
          price: 1179,
        },
      ],
    },
    {
      title: "Others",
      color: "#9BBEF5",
      options: [
        {
          id: "other-token",
          label: "Token Amount",
          price: 299,
        },
        {
          id: "other-exhibitor",
          label: "Exhibitor",
          price: 1979,
        },
        {
          id: "other-elite",
          label: "Elite Sponsor",
          price: 3979,
        },
        {
          id: "other-gold",
          label: "Gold Sponsor",
          price: 3979,
        },
        {
          id: "other-silver",
          label: "Silver Sponsor",
          price: 2479,
        },
      ],
    },
    {
      title: "Student",
      color: "#F29A9A",
      options: [
        {
          id: "student-speaker",
          label: "Speaker Registration",
          price: 479,
        },
        {
          id: "student-delegate",
          label: "Delegate Registration",
          price: 429,
        },
        {
          id: "student-poster",
          label: "Poster Registration",
          price: 529,
        },
        {
          id: "student-package-a",
          label: "Package A (Registration + 2 Nights Accommodation)",
          price: 951,
        },
        {
          id: "student-package-b",
          label: "Package B (Registration + 3 Nights Accommodation)",
          price: 1059,
        },
      ],
    },
  ];

  const selectedRegistration = useMemo(() => {
    for (const group of registrationGroups) {
      const found = group.options.find(
        (option) => option.id === formData.registrationType
      );

      if (found) {
        return found;
      }
    }

    return null;
  }, [formData.registrationType]);

  const total = selectedRegistration?.price || 0;

  useEffect(() => {
    const fetchConference = async () => {
      try {
        setConferenceLoading(true);
        setConferenceError("");

        const response = await getConferenceByIdApi(id);

        const apiData =
          response?.data?.data ||
          response?.data ||
          null;

        if (!apiData) {
          setConference(null);
          setConferenceError("Conference details not found.");
          return;
        }

        const startDate =
          apiData?.conferenceDates?.startDate ||
          apiData?.startDate ||
          apiData?.dates?.startDate ||
          "";

        const endDate =
          apiData?.conferenceDates?.endDate ||
          apiData?.endDate ||
          apiData?.dates?.endDate ||
          "";

        const rawDate =
          apiData?.date ||
          apiData?.conferenceDates?.date ||
          "";

        const formattedDate =
          startDate && endDate
            ? `${startDate} - ${endDate}`
            : rawDate;

        const normalizedConference = {
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
            apiData?.location ||
            apiData?.venue ||
            "",

          mode:
            apiData?.venueInformation?.mode ||
            apiData?.mode ||
            "",

          participants:
            apiData?.participants ||
            apiData?.expectedParticipants ||
            "",

          image:
            apiData?.media?.bannerImage ||
            apiData?.image ||
            apiData?.bannerImage ||
            "",
        };

        setConference(normalizedConference);

        setFormData((previous) => ({
          ...previous,
          conference: normalizedConference.id,
        }));
      } catch (error) {
        console.error(
          "Fetch Conference Details Error:",
          error
        );

        setConference(null);

        setConferenceError(
          error?.response?.data?.message ||
            "Failed to load conference details"
        );
      } finally {
        setConferenceLoading(false);
      }
    };

    if (id) {
      fetchConference();
    } else {
      setConferenceLoading(false);
      setConferenceError("Invalid conference ID.");
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRegistration) {
      return;
    }

    if (!conference) {
      return;
    }

    if (!conference.date) {
      console.error(
        "Conference date is missing:",
        conference
      );
      return;
    }

    if (isRedirecting) {
      return;
    }

    const registrationCategory =
      selectedRegistration.id.split("-")[0];

    const convertedPrice = Number(
      convertPrice(total).toFixed(2)
    );

    const payload = {
      title: formData.title,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      conferenceId: conference.id,
      phone: formData.phone,
      conferenceTitle: conference.title,

      conference: {
        conferenceId: conference.id,
        title: conference.title,
        date: conference.date,
        location: conference.location,
      },

      location: {
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        address: formData.address,
      },

      registration: {
        category: registrationCategory,
        option: selectedRegistration.label,
        price: convertedPrice,
        currency,
      },
    };

    console.log(
      "Registration Payload:",
      payload
    );

    try {
      const result = await dispatch(
        createRegistration(payload)
      ).unwrap();

      console.log(
        "Registration API Success:",
        result
      );

      const registrationData =
        result?.data || result;

      const registrationId =
        registrationData?._id ||
        registrationData?.id;

      if (!registrationId) {
        console.error(
          "Registration ID not found in API response:",
          result
        );
        return;
      }

      setIsRedirecting(true);

      setTimeout(() => {
        navigate(
          `/payment/${registrationId}`,
          {
            state: {
              registration: registrationData,
              conferenceId: conference.id,
              conferenceName: conference.title,
            },
          }
        );
      }, 250);
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );
    }
  };

  if (conferenceLoading) {
    return (
      <div
        className="min-h-screen"
        style={{
          backgroundColor: colors.pageBg,
        }}
      />
    );
  }

  if (!conference) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="flex min-h-screen items-center justify-center px-5"
        style={{
          backgroundColor: colors.pageBg,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="text-center"
        >
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.primarySoft,
              color: colors.primary,
            }}
          >
            <CalendarDays size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Conference Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {conferenceError ||
              "The requested conference could not be found."}
          </p>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/conferences"
              className="mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              <ArrowLeft size={15} />
              Back to Conferences
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="flex min-h-screen items-center justify-center px-5"
        style={{
          backgroundColor: colors.pageBg,
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="w-full max-w-lg rounded-2xl p-8 text-center"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.12)",
          }}
        >
          <motion.div
            initial={{
              scale: 0.7,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.45,
              delay: 0.15,
            }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                colors.primarySoft,
              color: colors.primary,
            }}
          >
            <CheckCircle2 size={30} />
          </motion.div>

          <h2
            className="mt-5 text-2xl font-bold"
            style={{
              color: colors.heading,
            }}
          >
            Registration Ready
          </h2>

          <p className="mt-2 text-sm leading-5 text-gray-500">
            Your registration details are ready for payment for{" "}
            <span className="font-semibold text-gray-900">
              {conference.title}
            </span>
            .
          </p>

          <div
            className="mt-4 rounded-xl p-4 text-left"
            style={{
              backgroundColor:
                colors.primarySoft,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Registration
              </span>

              <span
                className="text-sm font-bold"
                style={{
                  color: colors.primary,
                }}
              >
                {selectedCurrency.symbol}
                {convertPrice(total).toFixed(2)}
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Email
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {formData.email}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Registration Type
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {selectedRegistration?.label}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Currency: {selectedCurrency.label}
            </p>
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={`/conferences/${conference.id}`}
              className="mt-5 inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-bold text-white"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              Back to Conference
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate={isRedirecting ? "hidden" : "visible"}
      className="min-h-screen"
      style={{
        backgroundColor: colors.pageBg,
      }}
    >
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: colors.heroBg,
        }}
      >
        <div
          className="absolute -right-16 -top-16 h-40 w-40 rounded-full"
          style={{
            border:
              "1px solid rgba(192,132,252,0.20)",
          }}
        />

        <div
          className="absolute -bottom-16 left-[8%] h-32 w-32 rounded-full"
          style={{
            border:
              "1px solid rgba(192,132,252,0.12)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-5 lg:px-8 lg:py-7">
          <motion.div
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <Link
              to={`/conferences/${conference.id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to Conference
            </Link>
          </motion.div>

          <div className="mt-5 grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <motion.div
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                }}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{
                  border:
                    "1px solid rgba(192,132,252,0.22)",
                  backgroundColor:
                    "rgba(168,85,247,0.12)",
                  color: colors.heroAccent,
                }}
              >
                <Users size={12} />
                Conference Registration
              </motion.div>

              <h1 className="mt-3 max-w-4xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                Register for
                <span
                  className="block"
                  style={{
                    color: colors.heroAccent,
                  }}
                >
                  {conference.title}
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Complete your registration details below
                and select the participation category that
                suits you best.
              </p>
            </motion.div>

            <motion.div
              variants={heroInfoVariants}
              initial="hidden"
              animate="visible"
              className="hidden min-w-[250px] rounded-xl p-4 backdrop-blur-md lg:block"
              style={{
                border:
                  "1px solid rgba(192,132,252,0.18)",
                backgroundColor:
                  "rgba(13,7,28,0.72)",
              }}
            >
              <InfoItem
                icon={<CalendarDays size={16} />}
                label="Date"
                value={
                  conference.date ||
                  "Not available"
                }
              />

              <div className="mt-4">
                <InfoItem
                  icon={<MapPin size={16} />}
                  label="Location"
                  value={
                    conference.location ||
                    "Not available"
                  }
                />
              </div>

              {conference.mode && (
                <div className="mt-4">
                  <InfoItem
                    icon={<Globe2 size={16} />}
                    label="Mode"
                    value={conference.mode}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-7 lg:px-8 lg:py-9">
        <motion.form
          onSubmit={handleSubmit}
          variants={cardVariants}
          initial="hidden"
          animate={isRedirecting ? "hidden" : "visible"}
          transition={{
            delay: 0.15,
          }}
        >
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
            }}
          >
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="px-5 py-5 md:px-7"
              style={{
                borderBottom:
                  `1px solid ${colors.border}`,
              }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{
                  color: colors.primary,
                }}
              >
                Conference Registration
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Complete Your Registration
              </h2>

              <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  ["01", "Personal"],
                  ["02", "Conference"],
                  ["03", "Address"],
                  ["04", "Registration"],
                ].map(([number, label], index) => (
                  <React.Fragment key={number}>
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay:
                          0.25 + index * 0.08,
                      }}
                      className="flex flex-shrink-0 items-center gap-2"
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor:
                            colors.primary,
                          color: "#FFFFFF",
                        }}
                      >
                        {number}
                      </span>

                      <span
                        className="text-xs font-semibold"
                        style={{
                          color: colors.body,
                        }}
                      >
                        {label}
                      </span>
                    </motion.div>

                    {index !== 3 && (
                      <div
                        className="h-px min-w-6 flex-1"
                        style={{
                          backgroundColor:
                            colors.border,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 0.2,
              }}
              className="px-5 py-6 md:px-7"
            >
              <FormTitle
                number="01"
                title="Personal Information"
                description="Tell us a little about yourself."
              />

              <div className="mt-4 grid gap-3.5 md:grid-cols-[150px_1fr_1fr]">
                <InputAnimated>
                  <SelectField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    options={[
                      "Mr.",
                      "Mrs.",
                      "Ms.",
                      "Dr.",
                      "Prof.",
                    ]}
                    placeholder="Select Title"
                  />
                </InputAnimated>

                <InputAnimated delay={0.05}>
                  <InputField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </InputAnimated>

                <InputAnimated delay={0.1}>
                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </InputAnimated>
              </div>

              <div className="mt-3.5 grid gap-3.5 md:grid-cols-2">
                <InputAnimated delay={0.05}>
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    icon={<Mail size={15} />}
                    required
                  />
                </InputAnimated>

                <InputAnimated delay={0.1}>
                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    icon={<Phone size={15} />}
                    required
                  />
                </InputAnimated>
              </div>
            </motion.div>

            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 0.25,
              }}
              className="px-5 py-6 md:px-7"
              style={{
                borderTop:
                  `1px solid ${colors.divider}`,
              }}
            >
              <FormTitle
                number="02"
                title="Conference Details"
                description="Confirm the conference you want to attend."
              />

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.3,
                }}
                className="mt-4 flex items-center gap-3 rounded-xl p-3.5"
                style={{
                  backgroundColor:
                    colors.primarySoft,
                  border:
                    `1px solid ${colors.borderStrong}`,
                }}
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor:
                      colors.primary,
                    color: "#FFFFFF",
                  }}
                >
                  <CalendarDays size={18} />
                </div>

                <div className="min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      color: colors.primary,
                    }}
                  >
                    Selected Conference
                  </p>

                  <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                    {conference.title}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {conference.date} ·{" "}
                    {conference.location}
                  </p>
                </div>
              </motion.div>

              <input
                type="hidden"
                name="conference"
                value={conference.id}
              />
            </motion.div>

            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 0.3,
              }}
              className="px-5 py-6 md:px-7"
              style={{
                borderTop:
                  `1px solid ${colors.divider}`,
              }}
            >
              <FormTitle
                number="03"
                title="Location & Address"
                description="Provide your current contact location."
              />

              <div className="mt-4 grid gap-3.5 md:grid-cols-2">
                <InputAnimated>
                  <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </InputAnimated>

                <InputAnimated delay={0.05}>
                  <InputField
                    label="State / Province"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state / province"
                    required
                  />
                </InputAnimated>

                <InputAnimated delay={0.1}>
                  <InputField
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                    required
                  />
                </InputAnimated>

                <InputAnimated delay={0.15}>
                  <InputField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    icon={<Globe2 size={15} />}
                    required
                  />
                </InputAnimated>
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
                  duration: 0.35,
                  delay: 0.15,
                }}
                className="mt-3.5"
              >
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Full Address
                  <span className="ml-1 text-violet-600">
                    *
                  </span>
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Enter your complete address"
                  className="w-full resize-none rounded-xl px-3.5 py-3 text-sm outline-none transition"
                  style={{
                    backgroundColor:
                      colors.inputBg,
                    border:
                      `1px solid ${colors.inputBorder}`,
                    color: colors.inputText,
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 0.35,
              }}
              className="px-5 py-6 md:px-7"
              style={{
                borderTop:
                  `1px solid ${colors.divider}`,
              }}
            >
              <FormTitle
                number="04"
                title="Registration Category"
                description="Select one registration option."
              />

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
                  duration: 0.35,
                }}
                className="mt-4 rounded-xl p-4"
              >
                <p className="mb-3 text-center text-sm font-bold text-gray-900">
                  Choose your Currency
                </p>

                <div className="flex flex-wrap items-center justify-center gap-5">
                  {Object.entries(
                    currencyConfig
                  ).map(([code, config], index) => (
                    <motion.label
                      key={code}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay:
                          index * 0.06,
                      }}
                      whileHover={{
                        y: -1,
                      }}
                      className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-700"
                    >
                      <input
                        type="radio"
                        name="currency"
                        value={code}
                        checked={
                          currency === code
                        }
                        onChange={(e) =>
                          setCurrency(
                            e.target.value
                          )
                        }
                        className="accent-violet-600"
                      />

                      {config.label}
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {registrationGroups.map(
                  (group, index) => (
                    <motion.div
                      key={group.title}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay:
                          0.05 +
                          index * 0.08,
                        ease: "easeOut",
                      }}
                    >
                      <RegistrationGroup
                        group={group}
                        formData={formData}
                        handleChange={
                          handleChange
                        }
                        colors={colors}
                        selectedCurrency={
                          selectedCurrency
                        }
                        convertPrice={
                          convertPrice
                        }
                      />
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 0.4,
              }}
              className="px-5 py-6 md:px-7"
              style={{
                borderTop:
                  `1px solid ${colors.divider}`,
                backgroundColor: "#FCFAFF",
              }}
            >
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
                  Selected Registration
                </p>

                {selectedRegistration ? (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="mt-2 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2
                      size={18}
                      style={{
                        color: colors.primary,
                      }}
                    />

                    <span className="text-sm font-bold text-gray-900">
                      {selectedRegistration.label}
                    </span>
                  </motion.div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Please select a registration
                    category.
                  </p>
                )}
              </div>

              <motion.div
                key={`${currency}-${total}`}
                initial={{
                  opacity: 0.4,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="mt-5 text-center"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Total Registration Fee
                </p>

                <p
                  className="mt-1 text-3xl font-bold"
                  style={{
                    color: colors.primary,
                  }}
                >
                  {selectedCurrency.symbol}
                  {convertPrice(total).toFixed(2)}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Currency:{" "}
                  {selectedCurrency.label}
                </p>
              </motion.div>

              {registrationError && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center"
                >
                  <p className="text-sm font-semibold text-red-600">
                    {registrationError}
                  </p>
                </motion.div>
              )}

              <div className="mt-5 flex justify-center">
                <motion.button
                  type="submit"
                  disabled={
                    !selectedRegistration ||
                    registrationLoading ||
                    isRedirecting
                  }
                  whileHover={
                    !selectedRegistration ||
                    registrationLoading ||
                    isRedirecting
                      ? {}
                      : {
                          y: -2,
                          scale: 1.01,
                        }
                  }
                  whileTap={
                    !selectedRegistration ||
                    registrationLoading ||
                    isRedirecting
                      ? {}
                      : {
                          scale: 0.98,
                        }
                  }
                  className="flex h-12 min-w-[220px] items-center justify-center gap-2 rounded-xl px-8 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor:
                      colors.primary,
                    boxShadow:
                      "0 8px 20px rgba(124,58,237,0.18)",
                  }}
                >
                  {registrationLoading ||
                  isRedirecting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      {isRedirecting
                        ? "REDIRECTING..."
                        : "PROCESSING..."}
                    </>
                  ) : (
                    <>
                      PAY NOW
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </div>

              <p className="mt-3 text-center text-[11px] text-gray-400">
                You will be redirected to the secure
                payment process after continuing.
              </p>
            </motion.div>
          </div>
        </motion.form>

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: isRedirecting ? 0 : 1,
            y: isRedirecting ? 10 : 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="mt-5 rounded-xl px-4 py-4"
          style={{
            border:
              `1px solid ${colors.border}`,
            backgroundColor:
              colors.supportBg,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor:
                  colors.primarySoft,
                color: colors.primary,
              }}
            >
              <Phone size={16} />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-800">
                Registration Support
              </p>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Contact the GlobalScion team for
                registration support.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

const InputAnimated = ({
  children,
  delay = 0,
}) => {
  return (
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
        duration: 0.35,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

const FormTitle = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
        style={{
          backgroundColor: "#F5F3FF",
          color: "#7C3AED",
          border: "1px solid #DDD6FE",
        }}
      >
        {number}
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-0.5 text-xs text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: "#F5F3FF",
          color: "#C084FC",
          border:
            "1px solid rgba(192,132,252,0.18)",
        }}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

const RegistrationGroup = ({
  group,
  formData,
  handleChange,
  colors,
  selectedCurrency,
  convertPrice,
}) => {
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        border:
          `1px solid ${colors.border}`,
        backgroundColor: "#FFFFFF",
      }}
    >
      <div
        className="px-3 py-2.5 text-center"
        style={{
          backgroundColor: group.color,
        }}
      >
        <h3 className="text-lg font-bold text-white">
          {group.title}
        </h3>
      </div>

      <div className="px-3">
        {group.options.map(
          (option, index) => {
            const selected =
              formData.registrationType ===
              option.id;

            const isLast =
              index ===
              group.options.length - 1;

            return (
              <motion.label
                key={option.id}
                whileHover={{
                  x: 2,
                }}
                transition={{
                  duration: 0.15,
                }}
                className="flex cursor-pointer items-center justify-between gap-2 py-2.5 transition hover:bg-gray-50"
                style={{
                  borderBottom: isLast
                    ? "none"
                    : `1px solid ${colors.border}`,
                }}
              >
                <div className="flex min-w-0 items-start gap-2">
                  <input
                    type="radio"
                    name="registrationType"
                    value={option.id}
                    checked={selected}
                    onChange={handleChange}
                    className="mt-1 flex-shrink-0 accent-violet-600"
                  />

                  <span
                    className="text-xs leading-4"
                    style={{
                      color: selected
                        ? colors.primary
                        : colors.body,
                      fontWeight: selected
                        ? 700
                        : 500,
                    }}
                  >
                    {option.label}
                  </span>
                </div>

                <motion.span
                  animate={{
                    scale: selected
                      ? 1.04
                      : 1,
                  }}
                  className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold"
                  style={{
                    backgroundColor: selected
                      ? colors.primary
                      : colors.primarySoft,
                    color: selected
                      ? "#FFFFFF"
                      : colors.primary,
                    border: `1px solid ${
                      selected
                        ? colors.primary
                        : colors.borderStrong
                    }`,
                  }}
                >
                  {selectedCurrency.symbol}
                  {convertPrice(
                    option.price
                  ).toFixed(2)}
                </motion.span>
              </motion.label>
            );
          }
        )}
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-violet-600">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-500">
            {icon}
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`h-11 w-full rounded-xl text-sm outline-none transition ${
            icon ? "pl-9 pr-3" : "px-3"
          }`}
          style={{
            backgroundColor: "#FFFFFF",
            border:
              "1px solid #E5E7EB",
            color: "#111827",
          }}
        />
      </div>
    </div>
  );
};

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-violet-600">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="h-11 w-full appearance-none rounded-xl px-3 pr-8 text-sm outline-none transition"
          style={{
            backgroundColor: "#FFFFFF",
            border:
              "1px solid #E5E7EB",
            color: "#111827",
          }}
        >
          <option value="">
            {placeholder}
          </option>

          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-violet-500"
        />
      </div>
    </div>
  );
};

export default RegisterPage;