import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  UserPlus,
  User,
  BriefcaseBusiness,
  Building2,
  Globe2,
  Mail,
  Link as LinkIcon,
  Image,
  FileText,
  Save,
  X,
  UploadCloud,
  Loader2,
} from "lucide-react";

import {
  createSpeaker,
  clearSpeakerError,
  clearSpeakerSuccess,
} from "../../redux/speakersSlice";

import { getConferences } from "../../redux/conferenceSlice";

const AddSpeakersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    createLoading,
    error: speakerError,
    success,
  } = useSelector((state) => state.speaker);

  const {
    conferences = [],
    loading: conferencesLoading,
  } = useSelector((state) => state.conference);

  const [formData, setFormData] = useState({
    conferenceId: "",
    fullName: "",
    designation: "",
    speakerType: "Invited Speaker",
    organization: "",
    country: "",
    bio: "",
    email: "",
    linkedin: "https://www.linkedin.com/in/",
    website: "",
    status: "Active",
    displayOrder: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    dispatch(getConferences());
  }, [dispatch]);

  useEffect(() => {
    if (speakerError) {
      console.error("Speaker API Error:", speakerError);
    }
  }, [speakerError]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSpeakerSuccess());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const conferenceList = Array.isArray(conferences)
    ? conferences
    : [];

  const speakerTypes = [
    "Keynote Speaker",
    "Invited Speaker",
    "Panelist",
    "Plenary Speaker",
    "Session Chair",
    "Workshop Speaker",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (speakerError) {
      dispatch(clearSpeakerError());
    }
  };

  const processImageFile = (file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload a valid image file",
      }));

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 10MB",
      }));

      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);

    setErrors((prev) => ({
      ...prev,
      image: "",
    }));

    if (speakerError) {
      dispatch(clearSpeakerError());
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();

    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];

    processImageFile(file);

    e.target.value = "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.conferenceId) {
      newErrors.conferenceId = "Please select a conference";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    if (!formData.linkedin.trim()) {
      newErrors.linkedin =
        "LinkedIn URL is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = new FormData();

      payload.append(
        "conferenceId",
        formData.conferenceId
      );

      payload.append(
        "fullName",
        formData.fullName.trim()
      );

      payload.append(
        "designation",
        formData.designation.trim()
      );

      payload.append(
        "speakerType",
        formData.speakerType
      );

      payload.append(
        "organization",
        formData.organization.trim()
      );

      payload.append(
        "country",
        formData.country.trim()
      );

      payload.append(
        "bio",
        formData.bio.trim()
      );

      payload.append(
        "email",
        formData.email.trim().toLowerCase()
      );

      payload.append(
        "linkedin",
        formData.linkedin.trim()
      );

      payload.append(
        "website",
        formData.website.trim()
      );

      payload.append(
        "status",
        formData.status
      );

      payload.append(
        "displayOrder",
        String(
          Number(formData.displayOrder) || 0
        )
      );

      if (imageFile) {
        payload.append("image", imageFile);
      }

      console.log("Creating speaker...");
      console.log("Image file:", imageFile);

      await dispatch(
        createSpeaker(payload)
      ).unwrap();

      alert("Speaker added successfully");

      navigate("/admin/speakers");
    } catch (error) {
      console.error(
        "Create speaker error:",
        error
      );

      alert(
        error?.message ||
          error ||
          "Failed to add speaker"
      );
    }
  };

  const handleCancel = () => {
    navigate("/admin/speakers");
  };

  return (
    <div className="min-h-full w-full bg-gray-50 p-3 sm:p-4 lg:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/speakers")
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <UserPlus
                size={19}
                className="text-violet-600"
              />

              <h1 className="text-[18px] font-bold text-gray-900">
                Add Speaker
              </h1>
            </div>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Add a new speaker to a conference
            </p>
          </div>
        </div>
      </div>

      {speakerError && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-[11px] font-semibold text-red-600">
            {speakerError}
          </p>
        </div>
      )}

      <form
        id="speaker-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <User
                size={16}
                className="text-violet-600"
              />

              <h2 className="text-[13px] font-bold text-gray-800">
                Basic Information
              </h2>
            </div>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Enter the speaker's basic details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Conference
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                name="conferenceId"
                value={formData.conferenceId}
                onChange={handleChange}
                disabled={conferencesLoading}
                className={`h-10 w-full rounded-lg border bg-white px-3 text-[12px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                  errors.conferenceId
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
              >
                <option value="">
                  {conferencesLoading
                    ? "Loading conferences..."
                    : "Select Conference"}
                </option>

                {conferenceList.map(
                  (conference) => {
                    const conferenceId =
                      conference?._id;

                    const conferenceName =
                      conference
                        ?.basicInformation
                        ?.title ||
                      conference
                        ?.basicInformation
                        ?.conferenceName ||
                      conference?.title ||
                      conference?.name ||
                      "";

                    if (!conferenceId) {
                      return null;
                    }

                    return (
                      <option
                        key={conferenceId}
                        value={conferenceId}
                      >
                        {conferenceName}
                      </option>
                    );
                  }
                )}
              </select>

              {errors.conferenceId && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.conferenceId}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Full Name
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Dr. Michael Anderson"
                  className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                    errors.fullName
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>

              {errors.fullName && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Designation
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <BriefcaseBusiness
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Clinical Psychiatrist"
                  className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                    errors.designation
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>

              {errors.designation && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.designation}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Speaker Type
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                name="speakerType"
                value={formData.speakerType}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                {speakerTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Organization
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <Building2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Mayo Clinic"
                  className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                    errors.organization
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>

              {errors.organization && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.organization}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Country
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <Globe2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="United States"
                  className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                    errors.country
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>

              {errors.country && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.country}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText
                size={16}
                className="text-violet-600"
              />

              <h2 className="text-[13px] font-bold text-gray-800">
                Speaker Biography
              </h2>
            </div>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Add a short professional biography.
            </p>
          </div>

          <div className="p-4">
            <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
              Bio
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Enter speaker biography..."
              className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-[12px] leading-5 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                errors.bio
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            />

            <div className="mt-1 flex justify-between">
              {errors.bio ? (
                <p className="text-[10px] text-red-500">
                  {errors.bio}
                </p>
              ) : (
                <span />
              )}

              <span className="text-[10px] text-gray-400">
                {formData.bio.length} characters
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <LinkIcon
                size={16}
                className="text-violet-600"
              />

              <h2 className="text-[13px] font-bold text-gray-800">
                Contact & Social Links
              </h2>
            </div>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Website is optional. Other fields are required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Email
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="speaker@example.com"
                  className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                    errors.email
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                LinkedIn URL
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <img
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2"
                />

                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/in/"
                  className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                    errors.linkedin
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>

              {errors.linkedin && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.linkedin}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Website
                <span className="ml-1 text-[10px] font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <div className="relative">
                <LinkIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[12px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Status
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Image
                size={16}
                className="text-violet-600"
              />

              <h2 className="text-[13px] font-bold text-gray-800">
                Profile Image
              </h2>
            </div>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Upload the speaker profile image to Cloudinary.
            </p>
          </div>

          <div className="p-4">
            <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
              Profile Image
              <span className="ml-1 text-[10px] font-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleImageDrop}
              className={`relative flex h-44 w-44 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-gray-50 transition ${
                dragActive
                  ? "border-violet-500 bg-violet-50"
                  : errors.image
                    ? "border-red-300"
                    : "border-gray-200 hover:border-violet-300 hover:bg-violet-50"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Speaker Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center px-4 text-center">
                  <UploadCloud
                    size={26}
                    className="mb-2 text-violet-500"
                  />

                  <p className="text-[11px] font-semibold text-gray-700">
                    Drag & Drop
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    or click to upload
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {imagePreview && (
              <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[10px] font-semibold text-violet-600 hover:text-violet-700">
                <UploadCloud size={12} />

                Change Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}

            {errors.image && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.image}
              </p>
            )}

            <p className="mt-2 text-[10px] text-gray-400">
              Maximum file size: 10MB
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pb-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={createLoading}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={14} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              createLoading ||
              conferencesLoading
            }
            className="flex h-10 items-center gap-1.5 rounded-lg bg-violet-600 px-5 text-[11px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createLoading ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={14} />

                Save Speaker
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSpeakersPage;