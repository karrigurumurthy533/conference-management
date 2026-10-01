
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
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
} from "lucide-react";

import {
  createAbstractApi,
  getConferenceByIdApi,
} from "../api/api";

const AbstractSubmissionPage = () => {
  const { conferenceId } = useParams();

  const fileInputRef = useRef(null);

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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei Darussalam",
    "Bulgaria",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Chile",
    "China",
    "Colombia",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Denmark",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "Estonia",
    "Ethiopia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Latvia",
    "Lebanon",
    "Lithuania",
    "Luxembourg",
    "Malaysia",
    "Maldives",
    "Malta",
    "Mexico",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Myanmar",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Panama",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Saudi Arabia",
    "Serbia",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Sweden",
    "Switzerland",
    "Taiwan",
    "Thailand",
    "Tunisia",
    "Türkiye",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Zambia",
    "Zimbabwe",
  ];

  useEffect(() => {
    const fetchConference = async () => {
      if (!conferenceId) {
        setConferenceLoading(false);
        setError("Conference ID is missing.");
        return;
      }

      try {
        setConferenceLoading(true);
        setError("");

        const response = await getConferenceByIdApi(conferenceId);

        const conference = response?.data?.data;

        if (!conference) {
          setError("Conference not found.");
          return;
        }

        setConferenceName(conference.title || "");
      } catch (error) {
        console.error("Fetch Conference Error:", error);

        setError(
          error?.response?.data?.message ||
            "Failed to load conference details."
        );
      } finally {
        setConferenceLoading(false);
      }
    };

    fetchConference();
  }, [conferenceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSubmitted(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setError("");
      setSubmitted(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(false);
    setError("");

    if (!conferenceId) {
      setError("Conference ID is missing.");
      return;
    }

    if (!conferenceName) {
      setError("Conference details could not be loaded.");
      return;
    }

    if (!selectedFile) {
      setError("Please select an abstract file.");
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
      data.append("file", selectedFile);

      console.log("Abstract Submission Data:", {
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        conferenceId,
        conferenceName,
        country: formData.country,
        fullPostalAddress: formData.address,
        file: selectedFile.name,
      });

      const response = await createAbstractApi(data);

      console.log("Abstract Submission Response:", response);

      setSubmitted(true);

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

      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (error) {
      console.error("Abstract Submission Error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to submit abstract. Please try again."
      );
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
    <div className="min-h-screen bg-[#f7f7fa] text-gray-900">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#442f74]">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-400/10" />

        <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
              GlobalScion Conferences
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Abstract Submission
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-violet-100/85 sm:text-sm">
              Submit your research abstract for presentation at our upcoming
              international conference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FORM
      ===================================================== */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* FORM HEADER */}
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
            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-violet-600" />

                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                {/* TITLE */}
                <div className="sm:col-span-3">
                  <label className={labelClass}>Title</label>

                  <div className="relative">
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
                      <option value="Assist Prof Dr">
                        Assist Prof Dr
                      </option>
                      <option value="Assoc Prof Dr">
                        Assoc Prof Dr
                      </option>
                    </select>
                  </div>
                </div>

                {/* FIRST NAME */}
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

                {/* LAST NAME */}
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

                {/* EMAIL */}
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

                {/* PHONE */}
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

            {/* =================================================
                ABSTRACT DETAILS
            ================================================= */}
            <div className="border-t border-gray-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-600" />

                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                  Abstract Details
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* CATEGORY */}
                <div>
                  <label className={labelClass}>Abstract Category</label>

                  <div className="relative">
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

                    <svg
                      className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>

                {/* CONFERENCE */}
                <div>
                  <label className={labelClass}>Conference</label>

                  <div className="flex min-h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700">
                    {conferenceLoading ? (
                      <span className="text-gray-400">
                        Loading conference...
                      </span>
                    ) : (
                      conferenceName || "Conference not found"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                LOCATION
            ================================================= */}
            <div className="border-t border-gray-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-violet-600" />

                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                  Location Details
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* COUNTRY */}
                <div>
                  <label className={labelClass}>Country</label>

                  <div className="relative">
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

                    <svg
                      className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>

                {/* ADDRESS */}
                <div>
                  <label className={labelClass}>
                    Full Postal Address
                  </label>

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

            {/* =================================================
                FILE UPLOAD
            ================================================= */}
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
                onDrop={(e) => {
                  e.preventDefault();

                  const file = e.dataTransfer.files?.[0];

                  if (file) {
                    setSelectedFile(file);
                    setError("");
                    setSubmitted(false);
                  }
                }}
                className="group cursor-pointer rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center transition hover:border-violet-400 hover:bg-violet-50/40"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />

                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                  <Upload className="h-4 w-4 text-violet-600" />
                </div>

                <p className="mt-2 text-xs font-semibold text-gray-700">
                  Drop files here or{" "}
                  <span className="text-violet-600">
                    Select files
                  </span>
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  PDF, DOC or DOCX • Max. file size 3 GB
                </p>
              </div>

              {/* SELECTED FILE */}
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center justify-between rounded-lg border border-violet-100 bg-violet-50 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-violet-600" />

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-gray-800">
                        {selectedFile.name}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        {(
                          selectedFile.size /
                          (1024 * 1024)
                        ).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="ml-3 rounded-md p-1 text-gray-400 transition hover:bg-white hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] leading-4 text-gray-400">
                By submitting this form, you confirm that the information
                provided is accurate.
              </p>

              <button
                type="submit"
                disabled={loading || conferenceLoading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-6 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6D28D9] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Abstract"}

                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
              >
                {error}
              </motion.div>
            )}

            {/* SUCCESS MESSAGE */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />

                <span>
                  Your abstract submission has been received successfully.
                </span>
              </motion.div>
            )}
          </div>
        </motion.form>
      </section>
    </div>
  );
};

export default AbstractSubmissionPage;
