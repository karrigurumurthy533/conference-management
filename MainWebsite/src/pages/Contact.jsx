
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  Building2,
  MessageSquare,
} from "lucide-react";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";

import {
  sendContact,
  clearContact,
} from "../redux/userSlice";

const INITIAL_FORM = {
  name: "",
  email: "",
  organization: "",
  phone: "",
  subject: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactPage = () => {
  const dispatch = useDispatch();

  const {
    contactLoading,
    contactError,
  } = useSelector((state) => state.user);

  const [formData, setFormData] = useState(INITIAL_FORM);

  const [validationError, setValidationError] = useState("");

  const colors = {
    pageBg: "#FFFFFF",
    sectionBg: "#FFFFFF",
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
    formShadow: "0 10px 30px rgba(124,58,237,0.08)",
  };

  const bannerImage = "/images/contact_banner.png";

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const inputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.primary;
    e.currentTarget.style.boxShadow =
      `0 0 0 1px ${colors.primary}`;
  };

  const inputBlur = (e) => {
    e.currentTarget.style.borderColor = colors.inputBorder;
    e.currentTarget.style.boxShadow = "none";
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contactLoading) return;

    setValidationError("");

    const {
      name,
      email,
      organization,
      phone,
      subject,
      message,
    } = formData;

    // Required fields validation
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter your message.");
      return;
    }

    // Email validation
    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Input length validation
    if (
      name.trim().length > 100 ||
      cleanEmail.length > 254 ||
      (organization || "").trim().length > 200 ||
      (phone || "").trim().length > 30 ||
      subject.trim().length > 200 ||
      message.trim().length > 5000
    ) {
      toast.error("One or more fields exceed the allowed length.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: cleanEmail,
      organization: (organization || "").trim(),
      phone: (phone || "").trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    try {
      // Redux createAsyncThunk should return a fulfilled/rejected action.
      await dispatch(sendContact(payload)).unwrap();

      toast.success("Your message has been sent successfully!", {
        duration: 4000,
      });

      setFormData({ ...INITIAL_FORM });
      setValidationError("");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message ||
            contactError ||
            "Failed to send your message. Please try again.";

      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearContact());
    };
  }, [dispatch]);

  const contactCards = [
    {
      title: "Email Us",
      value: "info@globalscion.com",
      Icon: Mail,
      href: "mailto:info@globalscion.com",
    },
    {
      title: "Call Us",
      value: "+91 98765 43210",
      Icon: Phone,
      href: "tel:+919876543210",
    },
    {
      title: "Our Office",
      value: "Hyderabad, Telangana, India",
      Icon: MapPin,
    },
    {
      title: "Working Hours",
      value: "Mon - Fri, 9:00 AM - 6:00 PM",
      Icon: Clock,
    },
  ];

  const renderInput = ({
    label,
    name,
    placeholder,
    Icon,
    type = "text",
  }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold mb-1.5 text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: colors.primary }}
        />

        <input
          id={name}
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={contactLoading}
          maxLength={
            name === "name"
              ? 100
              : name === "email"
                ? 254
                : name === "organization"
                  ? 200
                  : name === "phone"
                    ? 30
                    : 200
          }
          autoComplete={
            name === "name"
              ? "name"
              : name === "email"
                ? "email"
                : name === "phone"
                  ? "tel"
                  : "off"
          }
          className="
            w-full h-10 pl-9 pr-3 rounded-md border text-xs
            outline-none transition-all
            disabled:bg-gray-50 disabled:cursor-not-allowed
          "
          style={{
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.inputText,
          }}
          onFocus={inputFocus}
          onBlur={inputBlur}
        />
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.pageBg }}
    >
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#FFFFFF",
            color: "#374151",
            border: "1px solid #DDD6FE",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "14px",
            boxShadow: "0 8px 25px rgba(124,58,237,0.12)",
          },
          success: {
            iconTheme: {
              primary: "#5938d1",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#DC2626",
              secondary: "#FFFFFF",
            },
          },
        }}
      />

      {/* Hero banner */}
      <motion.section
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: colors.pageBg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={bannerImage}
          alt="GlobalScion Contact"
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            w-full h-[190px] sm:h-[220px] md:h-[250px]
            lg:h-[270px] object-cover object-center
          "
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.70) 45%, rgba(255,255,255,0) 100%)",
          }}
        />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <motion.div
              className="max-w-lg"
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="w-7 h-[2px]"
                  style={{ backgroundColor: colors.primary }}
                />

                <span
                  className="text-[10px] sm:text-xs font-semibold tracking-[0.2em]"
                  style={{ color: colors.primary }}
                >
                  GET IN TOUCH
                </span>
              </div>

              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
                style={{ color: colors.primary }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Let's Connect
              </motion.h1>

              <motion.p
                className="mt-2 max-w-md text-xs sm:text-sm md:text-base leading-relaxed"
                style={{ color: colors.bodyText }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
              >
                Have questions about our conferences,
                registrations, or partnerships? Our team
                is here to help you.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main contact section */}
      <section
        className="py-10 px-6"
        style={{ backgroundColor: colors.sectionBg }}
      >
        <div
          className="
            max-w-7xl mx-auto grid grid-cols-1
            lg:grid-cols-3 gap-6
          "
        >
          {/* Contact information */}
          <motion.div
            className="lg:col-span-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: colors.primary }}
            >
              Let's Connect
            </h2>

            <p
              className="text-xs leading-5 mb-5"
              style={{ color: colors.bodyText }}
            >
              We would love to hear from you. Reach out to
              us for conference information, registration
              support, sponsorship opportunities, and
              general enquiries.
            </p>

            <div className="space-y-3">
              {contactCards.map(({ title, value, Icon, href }) => {
                const CardContent = (
                  <>
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      className="
                        w-9 h-9 rounded-full flex items-center
                        justify-center flex-shrink-0
                      "
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Icon className="text-white" size={16} />
                    </motion.div>

                    <div className="min-w-0">
                      <p
                        className="text-[10px]"
                        style={{ color: colors.mutedText }}
                      >
                        {title}
                      </p>

                      <p
                        className="text-xs font-semibold break-words"
                        style={{ color: colors.primaryLight }}
                      >
                        {value}
                      </p>
                    </div>
                  </>
                );

                return (
                  <motion.div
                    key={title}
                    variants={cardAnimation}
                    whileHover={{
                      x: 5,
                      boxShadow:
                        "0 8px 20px rgba(124,58,237,0.10)",
                    }}
                    transition={{ duration: 0.25 }}
                    className="
                      flex items-center gap-3 p-3 rounded-lg
                      border
                    "
                    style={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.cardBorder,
                    }}
                  >
                    {href ? (
                      <a
                        href={href}
                        className="flex items-center gap-3 w-full"
                      >
                        {CardContent}
                      </a>
                    ) : (
                      CardContent
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="border rounded-xl p-5 md:p-6"
              style={{
                backgroundColor: colors.inputBg,
                borderColor: colors.cardBorder,
                boxShadow: colors.formShadow,
              }}
              whileHover={{
                boxShadow:
                  "0 15px 35px rgba(124,58,237,0.10)",
              }}
              transition={{ duration: 0.3 }}
            >
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: colors.primary }}
              >
                Send Us a Message
              </h2>

              <p
                className="text-xs mb-5"
                style={{ color: colors.mutedText }}
              >
                Fill out the form below and our team will
                get back to you.
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name and email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput({
                    label: "Full Name",
                    name: "name",
                    placeholder: "Enter your name",
                    Icon: User,
                  })}

                  {renderInput({
                    label: "Email Address",
                    name: "email",
                    placeholder: "Enter your email",
                    Icon: Mail,
                    type: "email",
                  })}
                </div>

                {/* Organization and phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput({
                    label: "Organization",
                    name: "organization",
                    placeholder: "Organization name",
                    Icon: Building2,
                  })}

                  {renderInput({
                    label: "Phone Number",
                    name: "phone",
                    placeholder: "Enter phone number",
                    Icon: Phone,
                    type: "tel",
                  })}
                </div>

                {/* Subject */}
                {renderInput({
                  label: "Subject",
                  name: "subject",
                  placeholder: "What would you like to know?",
                  Icon: MessageSquare,
                })}

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold mb-1.5 text-gray-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    disabled={contactLoading}
                    maxLength={5000}
                    className="
                      w-full px-3 py-2.5 rounded-md border
                      text-xs outline-none resize-y transition-all
                      disabled:bg-gray-50 disabled:cursor-not-allowed
                    "
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.inputBorder,
                      color: colors.inputText,
                    }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />

                  <p className="mt-1 text-right text-[10px] text-gray-400">
                    {formData.message.length}/5000
                  </p>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={contactLoading}
                  whileHover={
                    !contactLoading
                      ? {
                          scale: 1.02,
                          boxShadow:
                            "0 8px 20px rgba(124,58,237,0.20)",
                        }
                      : {}
                  }
                  whileTap={!contactLoading ? { scale: 0.97 } : {}}
                  className="
                    inline-flex items-center justify-center gap-2
                    px-6 h-10 rounded-md text-white text-xs
                    font-semibold transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                  style={{ backgroundColor: colors.buttonBg }}
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
                      <span
                        className="
                          w-4 h-4 border-2 border-white/40
                          border-t-white rounded-full animate-spin
                        "
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={14} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <motion.section
        className="px-6 pb-10"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className="
            max-w-7xl mx-auto rounded-xl border py-6 px-5
            text-center
          "
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          }}
        >
          <motion.h3
            className="text-lg md:text-xl font-bold"
            style={{ color: colors.primary }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            We Are Here to Help
          </motion.h3>

          <p
            className="text-xs mt-1.5"
            style={{ color: colors.mutedText }}
          >
            Connect with our team and discover how we can
            support your next conference.
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactPage;