import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  Building2,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  sendContact,
  clearContact,
} from "../redux/userSlice";


const ContactPage = () => {
  /* =====================================================
     REDUX
  ====================================================== */

  const dispatch = useDispatch();

  const {
    contactLoading,
    contactError,
    contactSuccess,
  } = useSelector((state) => state.user);


  /* =====================================================
     FORM STATE
  ====================================================== */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    subject: "",
    message: "",
  });


  /* =====================================================
     VALIDATION ERROR
  ====================================================== */

  const [validationError, setValidationError] =
    useState("");


  /* =====================================================
     COLORS
  ====================================================== */

  const colors = {
    pageBg: "#FFFFFF",
    sectionBg: "#FFFFFF",
    heading: "#7C3AED",
    primary: "#7C3AED",
    primaryLight: "#8B5CF6",
    bodyText: "#4B5563",
    mutedText: "#6B7280",
    cardBg: "#F5F3FF",
    cardBorder: "#DDD6FE",
    inputBg: "#FFFFFF",
    inputBorder: "#E5E7EB",
    inputText: "#111827",
    buttonBg: "#7C3AED",
    buttonHover: "#6D28D9",
    formShadow:
      "0 10px 30px rgba(124,58,237,0.08)",
  };


  /* =====================================================
     BANNER IMAGE
  ====================================================== */

  const bannerImage =
    "/images/contact_banner.png";


  /* =====================================================
     ANIMATIONS
  ====================================================== */

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 25,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };


  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 15,
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


  /* =====================================================
     INPUT FOCUS
  ====================================================== */

  const inputFocus = (e) => {
    e.currentTarget.style.borderColor =
      colors.primary;

    e.currentTarget.style.boxShadow =
      `0 0 0 1px ${colors.primary}`;
  };


  const inputBlur = (e) => {
    e.currentTarget.style.borderColor =
      colors.inputBorder;

    e.currentTarget.style.boxShadow = "none";
  };


  /* =====================================================
     HANDLE INPUT CHANGE
  ====================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationError("");

    if (contactError) {
      dispatch(clearContact());
    }
  };


  /* =====================================================
     HANDLE FORM SUBMIT
  ====================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    setValidationError("");

    /* -----------------------------------------------
       BASIC VALIDATION
    ----------------------------------------------- */

    if (!formData.name.trim()) {
      setValidationError(
        "Please enter your full name."
      );
      return;
    }

    if (!formData.email.trim()) {
      setValidationError(
        "Please enter your email address."
      );
      return;
    }

    if (!formData.subject.trim()) {
      setValidationError(
        "Please enter a subject."
      );
      return;
    }

    if (!formData.message.trim()) {
      setValidationError(
        "Please enter your message."
      );
      return;
    }

    /* -----------------------------------------------
       EMAIL VALIDATION
    ----------------------------------------------- */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setValidationError(
        "Please enter a valid email address."
      );
      return;
    }

    /* -----------------------------------------------
       SEND TO BACKEND
    ----------------------------------------------- */

    dispatch(sendContact(formData));
  };


  /* =====================================================
     SUCCESS EFFECT
  ====================================================== */

  useEffect(() => {
    if (contactSuccess) {
      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
  }, [contactSuccess]);


  /* =====================================================
     CLEANUP
  ====================================================== */

  useEffect(() => {
    return () => {
      dispatch(clearContact());
    };
  }, [dispatch]);


  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.pageBg,
      }}
    >

      {/* =====================================================
          CONTACT HERO BANNER
      ====================================================== */}

      <motion.section
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: colors.pageBg,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
        }}
      >

        <motion.img
          src={bannerImage}
          alt="GlobalScion Contact"
          initial={{
            scale: 1.03,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            w-full
            h-[190px]
            sm:h-[220px]
            md:h-[250px]
            lg:h-[270px]
            object-cover
            object-center
          "
        />


        {/* Light Gradient Overlay */}

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(255,255,255,0.95) 0%,
                rgba(255,255,255,0.70) 45%,
                rgba(255,255,255,0) 100%
              )
            `,
          }}
        />


        {/* Banner Content */}

        <div className="absolute inset-0 flex items-center">

          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">

            <motion.div
              className="max-w-lg"
              initial={{
                opacity: 0,
                x: -35,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }}
            >

              {/* Small Heading */}

              <motion.div
                className="mb-2 flex items-center gap-2"
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                }}
              >

                <span
                  className="w-7 h-[2px]"
                  style={{
                    backgroundColor:
                      colors.primary,
                  }}
                />

                <span
                  className="
                    text-[10px]
                    sm:text-xs
                    font-semibold
                    tracking-[0.2em]
                  "
                  style={{
                    color: colors.primary,
                  }}
                >
                  GET IN TOUCH
                </span>

              </motion.div>


              {/* Main Heading */}

              <motion.h1
                className="
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  font-bold
                  leading-tight
                "
                style={{
                  color: colors.primary,
                }}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.4,
                }}
              >
                Let's Connect
              </motion.h1>


              {/* Description */}

              <motion.p
                className="
                  mt-2
                  max-w-md
                  text-xs
                  sm:text-sm
                  md:text-base
                  leading-relaxed
                "
                style={{
                  color: colors.bodyText,
                }}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.55,
                }}
              >
                Have questions about our conferences,
                registrations, or partnerships? Our team
                is here to help you.
              </motion.p>

            </motion.div>

          </div>

        </div>

      </motion.section>


      {/* =====================================================
          MAIN CONTACT SECTION
      ====================================================== */}

      <section
        className="py-10 px-6"
        style={{
          backgroundColor:
            colors.sectionBg,
        }}
      >

        <div
          className="
            max-w-7xl
            mx-auto
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-6
          "
        >

          {/* =================================================
              LEFT SIDE - CONTACT INFORMATION
          ================================================= */}

          <motion.div
            className="lg:col-span-1"
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={fadeUp}
          >

            <h2
              className="text-xl font-bold mb-2"
              style={{
                color: colors.primary,
              }}
            >
              Let's Connect
            </h2>


            <p
              className="text-xs leading-5 mb-5"
              style={{
                color: colors.bodyText,
              }}
            >
              We would love to hear from you.
              Reach out to us for conference
              information, registration support,
              sponsorship opportunities, and
              general enquiries.
            </p>


            <div className="space-y-3">

              {/* EMAIL */}

              <motion.div
                variants={cardAnimation}
                whileHover={{
                  x: 5,
                  scale: 1.02,
                  boxShadow:
                    "0px 8px 20px rgba(124,58,237,0.10)",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-lg
                  border
                  cursor-pointer
                "
                style={{
                  backgroundColor:
                    colors.cardBg,
                  borderColor:
                    colors.cardBorder,
                }}
              >

                <motion.div
                  whileHover={{
                    rotate: 10,
                    scale: 1.1,
                  }}
                  className="
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                  style={{
                    backgroundColor:
                      colors.primary,
                  }}
                >
                  <Mail
                    className="text-white"
                    size={15}
                  />
                </motion.div>


                <div>

                  <p
                    className="text-[10px]"
                    style={{
                      color:
                        colors.mutedText,
                    }}
                  >
                    Email Us
                  </p>

                  <p
                    className="text-xs font-semibold"
                    style={{
                      color:
                        colors.primaryLight,
                    }}
                  >
                    info@globalscion.com
                  </p>

                </div>

              </motion.div>


              {/* PHONE */}

              <motion.div
                variants={cardAnimation}
                whileHover={{
                  x: 5,
                  scale: 1.02,
                  boxShadow:
                    "0px 8px 20px rgba(124,58,237,0.10)",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-lg
                  border
                  cursor-pointer
                "
                style={{
                  backgroundColor:
                    colors.cardBg,
                  borderColor:
                    colors.cardBorder,
                }}
              >

                <motion.div
                  whileHover={{
                    rotate: -10,
                    scale: 1.1,
                  }}
                  className="
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                  style={{
                    backgroundColor:
                      colors.primary,
                  }}
                >
                  <Phone
                    className="text-white"
                    size={15}
                  />
                </motion.div>


                <div>

                  <p
                    className="text-[10px]"
                    style={{
                      color:
                        colors.mutedText,
                    }}
                  >
                    Call Us
                  </p>

                  <p
                    className="text-xs font-semibold"
                    style={{
                      color:
                        colors.primaryLight,
                    }}
                  >
                    +91 98765 43210
                  </p>

                </div>

              </motion.div>


              {/* LOCATION */}

              <motion.div
                variants={cardAnimation}
                whileHover={{
                  x: 5,
                  scale: 1.02,
                  boxShadow:
                    "0px 8px 20px rgba(124,58,237,0.10)",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-lg
                  border
                  cursor-pointer
                "
                style={{
                  backgroundColor:
                    colors.cardBg,
                  borderColor:
                    colors.cardBorder,
                }}
              >

                <motion.div
                  whileHover={{
                    y: -4,
                    scale: 1.1,
                  }}
                  className="
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                  style={{
                    backgroundColor:
                      colors.primary,
                  }}
                >
                  <MapPin
                    className="text-white"
                    size={15}
                  />
                </motion.div>


                <div>

                  <p
                    className="text-[10px]"
                    style={{
                      color:
                        colors.mutedText,
                    }}
                  >
                    Our Office
                  </p>

                  <p
                    className="text-xs font-semibold"
                    style={{
                      color:
                        colors.primaryLight,
                    }}
                  >
                    Hyderabad, Telangana, India
                  </p>

                </div>

              </motion.div>


              {/* WORKING HOURS */}

              <motion.div
                variants={cardAnimation}
                whileHover={{
                  x: 5,
                  scale: 1.02,
                  boxShadow:
                    "0px 8px 20px rgba(124,58,237,0.10)",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-lg
                  border
                  cursor-pointer
                "
                style={{
                  backgroundColor:
                    colors.cardBg,
                  borderColor:
                    colors.cardBorder,
                }}
              >

                <motion.div
                  whileHover={{
                    rotate: 10,
                    scale: 1.1,
                  }}
                  className="
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                  style={{
                    backgroundColor:
                      colors.primary,
                  }}
                >
                  <Clock
                    className="text-white"
                    size={15}
                  />
                </motion.div>


                <div>

                  <p
                    className="text-[10px]"
                    style={{
                      color:
                        colors.mutedText,
                    }}
                  >
                    Working Hours
                  </p>

                  <p
                    className="text-xs font-semibold"
                    style={{
                      color:
                        colors.primaryLight,
                    }}
                  >
                    Mon - Fri, 9:00 AM - 6:00 PM
                  </p>

                </div>

              </motion.div>

            </div>

          </motion.div>


          {/* =================================================
              RIGHT SIDE - CONTACT FORM
          ================================================= */}

          <motion.div
            className="lg:col-span-2"
            initial={{
              opacity: 0,
              x: 35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >

            <motion.div
              className="
                border
                rounded-xl
                p-5
                md:p-6
              "
              style={{
                backgroundColor:
                  colors.inputBg,
                borderColor:
                  colors.cardBorder,
                boxShadow:
                  colors.formShadow,
              }}
              whileHover={{
                boxShadow:
                  "0px 15px 35px rgba(124,58,237,0.10)",
              }}
              transition={{
                duration: 0.3,
              }}
            >

              {/* Form Heading */}

              <h2
                className="text-xl font-bold mb-1"
                style={{
                  color: colors.primary,
                }}
              >
                Send Us a Message
              </h2>


              <p
                className="text-xs mb-5"
                style={{
                  color:
                    colors.mutedText,
                }}
              >
                Fill out the form below and our
                team will get back to you.
              </p>


              {/* =================================================
                  SUCCESS MESSAGE
              ================================================== */}

              {contactSuccess && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    mb-5
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    border
                    border-green-200
                    bg-green-50
                    px-4
                    py-3
                  "
                >

                  <CheckCircle2
                    size={20}
                    className="text-green-600 flex-shrink-0"
                  />

                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      Message Sent Successfully
                    </p>

                    <p className="text-xs text-green-600 mt-0.5">
                      Thank you for contacting GlobalScion.
                      Our team will get back to you soon.
                    </p>
                  </div>

                </motion.div>
              )}


              {/* =================================================
                  ERROR MESSAGE
              ================================================== */}

              {(validationError ||
                contactError) && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    mb-5
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                  "
                >

                  <AlertCircle
                    size={20}
                    className="
                      text-red-600
                      flex-shrink-0
                    "
                  />

                  <p className="text-xs font-medium text-red-700">
                    {validationError ||
                      contactError}
                  </p>

                </motion.div>
              )}


              {/* =================================================
                  CONTACT FORM
              ================================================== */}

              <form
                className="space-y-4"
                onSubmit={handleSubmit}
              >

                {/* NAME + EMAIL */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  {/* NAME */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.1,
                    }}
                  >

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        mb-1.5
                      "
                      style={{
                        color: "#374151",
                      }}
                    >
                      Full Name
                    </label>


                    <div className="relative">

                      <User
                        size={15}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                        "
                        style={{
                          color:
                            colors.primary,
                        }}
                      />


                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        disabled={contactLoading}
                        className="
                          w-full
                          h-10
                          pl-9
                          pr-3
                          rounded-md
                          border
                          text-xs
                          outline-none
                          transition-all
                          disabled:bg-gray-50
                          disabled:cursor-not-allowed
                        "
                        style={{
                          backgroundColor:
                            colors.inputBg,
                          borderColor:
                            colors.inputBorder,
                          color:
                            colors.inputText,
                        }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />

                    </div>

                  </motion.div>


                  {/* EMAIL */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                  >

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        mb-1.5
                      "
                      style={{
                        color: "#374151",
                      }}
                    >
                      Email Address
                    </label>


                    <div className="relative">

                      <Mail
                        size={15}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                        "
                        style={{
                          color:
                            colors.primary,
                        }}
                      />


                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        disabled={contactLoading}
                        className="
                          w-full
                          h-10
                          pl-9
                          pr-3
                          rounded-md
                          border
                          text-xs
                          outline-none
                          transition-all
                          disabled:bg-gray-50
                          disabled:cursor-not-allowed
                        "
                        style={{
                          backgroundColor:
                            colors.inputBg,
                          borderColor:
                            colors.inputBorder,
                          color:
                            colors.inputText,
                        }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />

                    </div>

                  </motion.div>

                </div>


                {/* ORGANIZATION + PHONE */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >

                  {/* ORGANIZATION */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.25,
                    }}
                  >

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        mb-1.5
                      "
                      style={{
                        color: "#374151",
                      }}
                    >
                      Organization
                    </label>


                    <div className="relative">

                      <Building2
                        size={15}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                        "
                        style={{
                          color:
                            colors.primary,
                        }}
                      />


                      <input
                        type="text"
                        name="organization"
                        value={
                          formData.organization
                        }
                        onChange={handleChange}
                        placeholder="Organization name"
                        disabled={contactLoading}
                        className="
                          w-full
                          h-10
                          pl-9
                          pr-3
                          rounded-md
                          border
                          text-xs
                          outline-none
                          transition-all
                          disabled:bg-gray-50
                          disabled:cursor-not-allowed
                        "
                        style={{
                          backgroundColor:
                            colors.inputBg,
                          borderColor:
                            colors.inputBorder,
                          color:
                            colors.inputText,
                        }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />

                    </div>

                  </motion.div>


                  {/* PHONE */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                  >

                    <label
                      className="
                        block
                        text-xs
                        font-semibold
                        mb-1.5
                      "
                      style={{
                        color: "#374151",
                      }}
                    >
                      Phone Number
                    </label>


                    <div className="relative">

                      <Phone
                        size={15}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                        "
                        style={{
                          color:
                            colors.primary,
                        }}
                      />


                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        disabled={contactLoading}
                        className="
                          w-full
                          h-10
                          pl-9
                          pr-3
                          rounded-md
                          border
                          text-xs
                          outline-none
                          transition-all
                          disabled:bg-gray-50
                          disabled:cursor-not-allowed
                        "
                        style={{
                          backgroundColor:
                            colors.inputBg,
                          borderColor:
                            colors.inputBorder,
                          color:
                            colors.inputText,
                        }}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />

                    </div>

                  </motion.div>

                </div>


                {/* SUBJECT */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.35,
                  }}
                >

                  <label
                    className="
                      block
                      text-xs
                      font-semibold
                      mb-1.5
                    "
                    style={{
                      color: "#374151",
                    }}
                  >
                    Subject
                  </label>


                  <div className="relative">

                    <MessageSquare
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                      "
                      style={{
                        color:
                          colors.primary,
                      }}
                    />


                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What would you like to know?"
                      disabled={contactLoading}
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-md
                        border
                        text-xs
                        outline-none
                        transition-all
                        disabled:bg-gray-50
                        disabled:cursor-not-allowed
                      "
                      style={{
                        backgroundColor:
                          colors.inputBg,
                        borderColor:
                          colors.inputBorder,
                        color:
                          colors.inputText,
                      }}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />

                  </div>

                </motion.div>


                {/* MESSAGE */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.4,
                  }}
                >

                  <label
                    className="
                      block
                      text-xs
                      font-semibold
                      mb-1.5
                    "
                    style={{
                      color: "#374151",
                    }}
                  >
                    Message
                  </label>


                  <textarea
                    rows="4"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    disabled={contactLoading}
                    className="
                      w-full
                      px-3
                      py-2.5
                      rounded-md
                      border
                      text-xs
                      outline-none
                      resize-none
                      transition-all
                      disabled:bg-gray-50
                      disabled:cursor-not-allowed
                    "
                    style={{
                      backgroundColor:
                        colors.inputBg,
                      borderColor:
                        colors.inputBorder,
                      color:
                        colors.inputText,
                    }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />

                </motion.div>


                {/* SEND BUTTON */}

                <motion.button
                  type="submit"
                  disabled={contactLoading}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.45,
                  }}
                  whileHover={
                    !contactLoading
                      ? {
                          scale: 1.04,
                          boxShadow:
                            "0 8px 20px rgba(124,58,237,0.20)",
                        }
                      : {}
                  }
                  whileTap={
                    !contactLoading
                      ? {
                          scale: 0.96,
                        }
                      : {}
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-6
                    h-10
                    rounded-md
                    text-white
                    text-xs
                    font-semibold
                    transition-all
                    duration-200
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                  style={{
                    backgroundColor:
                      colors.buttonBg,
                  }}
                  onMouseEnter={(e) => {
                    if (!contactLoading) {
                      e.currentTarget.style.backgroundColor =
                        colors.buttonHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.buttonBg;
                  }}
                >

                  {contactLoading ? (
                    <>
                      {/* Loading Spinner */}

                      <span
                        className="
                          w-4
                          h-4
                          border-2
                          border-white/40
                          border-t-white
                          rounded-full
                          animate-spin
                        "
                      />

                      Sending...

                    </>
                  ) : (
                    <>
                      Send Message

                      <motion.span
                        whileHover={{
                          x: 4,
                        }}
                      >
                        <Send size={14} />
                      </motion.span>
                    </>
                  )}

                </motion.button>

              </form>

            </motion.div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <motion.section
        className="px-6 pb-10"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.7,
        }}
      >

        <div
          className="
            max-w-7xl
            mx-auto
            rounded-xl
            border
            py-6
            px-5
            text-center
          "
          style={{
            backgroundColor:
              colors.cardBg,
            borderColor:
              colors.cardBorder,
          }}
        >

          <motion.h3
            className="
              text-lg
              md:text-xl
              font-bold
            "
            style={{
              color: colors.primary,
            }}
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            We Are Here to Help
          </motion.h3>


          <p
            className="text-xs mt-1.5"
            style={{
              color:
                colors.mutedText,
            }}
          >
            Connect with our team and discover
            how we can support your next conference.
          </p>

        </div>

      </motion.section>

    </div>
  );
};

export default ContactPage;