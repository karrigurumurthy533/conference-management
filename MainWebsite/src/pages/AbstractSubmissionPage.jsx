
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Upload,
  FileText,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe2,
  X,
  Loader2,
} from "lucide-react";

import {
  createAbstractApi,
  getConferenceByIdApi,
} from "../api/api";

const pageVariants = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const pageTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

const countries = [
  "Afghanistan", "Albania", "Algeria", "American Samoa",
  "Andorra", "Angola", "Anguilla", "Antarctica",
  "Antigua and Barbuda", "Argentina", "Armenia", "Aruba",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize",
  "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria",
  "Cambodia", "Cameroon", "Canada", "Chile", "China",
  "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czechia", "Denmark", "Dominican Republic", "Ecuador",
  "Egypt", "Estonia", "Ethiopia", "Finland", "France",
  "Georgia", "Germany", "Ghana", "Greece", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon",
  "Lithuania", "Luxembourg", "Malaysia", "Maldives", "Malta",
  "Mexico", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nigeria",
  "Norway", "Oman", "Pakistan", "Panama", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia",
  "Slovenia", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Taiwan",
  "Thailand", "Tunisia", "Türkiye", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Zambia",
  "Zimbabwe",
];

const AbstractSubmissionPage = () => {
  const { id: conferenceId } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const navigationTimeoutRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    category: "",
    country: "",
    address: "",
  });

  const [conferenceName, setConferenceName] = useState("");
  const [conferenceLoading, setConferenceLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchConference = async () => {
      if (!conferenceId) {
        setError("Conference ID is missing.");
        toast.error("Conference ID is missing.");
        setConferenceLoading(false);
        return;
      }

      try {
        setConferenceLoading(true);
        setError("");

        const response = await getConferenceByIdApi(conferenceId);
        const conference = response?.data?.data;

        if (!conference) {
          throw new Error("Conference not found.");
        }

        setConferenceName(conference.title || "");
      } catch (err) {
        console.error("Fetch conference error:", err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load conference details.";

        setError(message);
        toast.error(message);
      } finally {
        setConferenceLoading(false);
      }
    };

    fetchConference();

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [conferenceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const validateFile = (file) => {
    if (!file) {
      return "Please select an abstract file.";
    }

    const lowerName = file.name.toLowerCase();

    const hasAllowedExtension = ALLOWED_EXTENSIONS.some(
      (extension) => lowerName.endsWith(extension)
    );

    if (!hasAllowedExtension) {
      return "Only PDF, DOC and DOCX files are allowed.";
    }

    if (file.size === 0) {
      return "The selected file is empty.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must not exceed 10 MB.";
    }

    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validationError = validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      e.target.value = "";
      setError(validationError);
      toast.error(validationError);
      return;
    }

    console.log("Selected original file:", {
      name: file.name,
      type: file.type,
      size: file.size,
      isFile: file instanceof File,
    });

    setSelectedFile(file);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setSelectedFile(file);
    setError("");

    if (fileInputRef.current) {
      // The selected file is kept in React state.
      // Assigning a dropped File to input.files is not required.
    }
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
  };

  const navigateBackSmoothly = () => {
    if (loading || isExiting) return;

    setIsExiting(true);

    navigationTimeoutRef.current = setTimeout(() => {
      navigate(-1);
    }, 450);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || isExiting) return;

    setError("");

    if (!conferenceId) {
      const message = "Conference ID is missing.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!conferenceName) {
      const message = "Conference details could not be loaded.";
      setError(message);
      toast.error(message);
      return;
    }

    const fileError = validateFile(selectedFile);

    if (fileError) {
      setError(fileError);
      toast.error(fileError);
      return;
    }

    if (!(selectedFile instanceof File)) {
      const message = "Please select the original file again.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("category", formData.category);
      data.append("conferenceId", conferenceId);
      data.append("country", formData.country);
      data.append("fullPostalAddress", formData.address);

      // Send the original File object, not an API response or JSON.
      data.append("file", selectedFile, selectedFile.name);

      console.log("Submitting abstract:", {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        isFile: selectedFile instanceof File,
        formDataHasFile: data.get("file") instanceof File,
      });

      // Do not JSON.stringify FormData.
      // The API helper must pass this FormData directly to Axios.
      const response = await createAbstractApi(data);

      toast.success(
        response?.data?.message ||
          "Abstract submitted successfully."
      );

      setFormData({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        category: "",
        country: "",
        address: "",
      });

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      navigationTimeoutRef.current = setTimeout(() => {
        setIsExiting(true);

        navigationTimeoutRef.current = setTimeout(() => {
          navigate(-1);
        }, 450);
      }, 350);
    } catch (err) {
      console.error("Abstract submission error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit abstract. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  const selectClass =
    "w-full h-10 appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-800 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  const labelClass =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-600";

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate={isExiting ? "exit" : "animate"}
      transition={pageTransition}
      className="min-h-screen bg-[#f7f7fa] text-gray-900"
    >
      <section className="relative overflow-hidden bg-[#442f74]">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-400/10" />
        <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
            GlobalScion Conferences
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Abstract Submission
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-violet-100/85 sm:text-sm">
            Submit your research abstract for presentation at our
            upcoming international conference.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: isExiting ? 0 : 1,
            y: isExiting ? -15 : 0,
          }}
          transition={pageTransition}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <FileText className="h-4 w-4 text-violet-600" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                Presenter Information
              </h2>
              <p className="text-[11px] text-gray-500">
                Please provide your details below
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-violet-600" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                <div className="sm:col-span-3">
                  <label className={labelClass}>Title</label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={selectClass}
                    required
                  >
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Prof Dr">Prof Dr</option>
                    <option value="Assist Prof Dr">Assist Prof Dr</option>
                    <option value="Assoc Prof Dr">Assoc Prof Dr</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className={labelClass}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className={labelClass}>Author's Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="author@example.com"
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-600" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                  Abstract Details
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Abstract Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={selectClass}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Poster">Poster</option>
                    <option value="Oral">Oral</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Conference</label>
                  <div className="flex min-h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700">
                    {conferenceLoading
                      ? "Loading conference..."
                      : conferenceName || "Conference not found"}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-violet-600" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                  Location Details
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={selectClass}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Full Postal Address</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, City, State, Postal Code"
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <Upload className="h-4 w-4 text-violet-600" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                  Abstract File
                </h3>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="group cursor-pointer rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center transition hover:border-violet-400 hover:bg-violet-50/40"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                />

                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                  <Upload className="h-4 w-4 text-violet-600" />
                </div>

                <p className="mt-2 text-xs font-semibold text-gray-700">
                  Drop files here or{" "}
                  <span className="text-violet-600">Select files</span>
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  PDF, DOC or DOCX • Maximum 10 MB
                </p>
              </div>

              {selectedFile && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-violet-100 bg-violet-50 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-violet-600" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-gray-800">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="ml-3 rounded-md p-1 text-gray-400 transition hover:bg-white hover:text-red-500"
                    aria-label="Remove selected file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="border-t border-gray-100 pt-5">
              <p className="mb-4 text-center text-[10px] leading-4 text-gray-400">
                By submitting this form, you confirm that the
                information provided is accurate.
              </p>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading || conferenceLoading || isExiting}
                  className="inline-flex h-10 min-w-[170px] items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-6 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6D28D9] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Abstract
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={navigateBackSmoothly}
                disabled={loading || isExiting}
                className="mx-auto mt-3 block text-xs text-gray-500 hover:text-violet-600 disabled:opacity-50"
              >
                Go Back
              </button>
            </div>
          </div>
        </motion.form>
      </section>
    </motion.div>
  );
};

export default AbstractSubmissionPage;
