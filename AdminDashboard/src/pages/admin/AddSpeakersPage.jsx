
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

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
  Pencil,
} from "lucide-react";

import {
  createSpeaker,
  clearSpeakerError,
  clearSpeakerSuccess,
} from "../../redux/speakersSlice";

import {
  getSpeakerByIdApi,
  updateSpeakerApi,
} from "../../api/speakerApis";

import { getConferences } from "../../redux/conferenceSlice";

const EMPTY_FORM = {
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
};

const AddSpeakersPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const isEditMode = Boolean(id);

  const {
    createLoading,
    error: speakerError,
  } = useSelector((state) => state.speaker);

  const {
    conferences = [],
    loading: conferencesLoading,
  } = useSelector((state) => state.conference);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  /*
   * LOAD CONFERENCES
   */
  useEffect(() => {
    dispatch(getConferences());
  }, [dispatch]);

  /*
   * CLEAR REDUX ERRORS
   */
  useEffect(() => {
    dispatch(clearSpeakerError());
    dispatch(clearSpeakerSuccess());
  }, [dispatch, id]);

  /*
   * LOAD SPEAKER FOR EDIT
   */
  useEffect(() => {
    if (!isEditMode) {
      setFormData(EMPTY_FORM);
      setImageFile(null);
      setImagePreview("");
      setErrors({});
      return;
    }

    let isMounted = true;

    const fetchSpeaker = async () => {
      try {
        setPageLoading(true);
        dispatch(clearSpeakerError());

        const response = await getSpeakerByIdApi(id);

        const responseData = response?.data;

        const speaker =
          responseData?.data ||
          responseData?.speaker ||
          responseData;

        if (!speaker || typeof speaker !== "object") {
          throw new Error("Speaker details not found");
        }

        let conferenceId = "";

        if (
          speaker?.conferenceId &&
          typeof speaker.conferenceId === "object"
        ) {
          conferenceId =
            speaker.conferenceId?._id ||
            speaker.conferenceId?.id ||
            "";
        } else {
          conferenceId = speaker?.conferenceId || "";
        }

        if (!isMounted) return;

        setFormData({
          conferenceId,
          fullName: speaker?.fullName || "",
          designation: speaker?.designation || "",
          speakerType:
            speaker?.speakerType || "Invited Speaker",
          organization: speaker?.organization || "",
          country: speaker?.country || "",
          bio: speaker?.bio || "",
          email: speaker?.email || "",
          linkedin:
            speaker?.linkedin ||
            "https://www.linkedin.com/in/",
          website: speaker?.website || "",
          status: speaker?.status || "Active",
          displayOrder: speaker?.displayOrder ?? 0,
        });

        const existingImage =
          speaker?.imageUrl ||
          speaker?.image ||
          speaker?.photoUrl ||
          "";

        setImagePreview(existingImage);
        setImageFile(null);
        setErrors({});
      } catch (error) {
        console.error("Fetch speaker for edit error:", error);

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load speaker details";

        if (isMounted) {
          setErrors((prev) => ({
            ...prev,
            general: message,
          }));

          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    };

    fetchSpeaker();

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode, dispatch]);

  /*
   * REVOKE LOCAL IMAGE PREVIEW URL
   */
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
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

  /*
   * FORM CHANGE
   */
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

    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }

    if (speakerError) {
      dispatch(clearSpeakerError());
    }
  };

  /*
   * IMAGE PROCESS
   */
  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const message = "Please upload a valid image file";

      setErrors((prev) => ({
        ...prev,
        image: message,
      }));

      toast.error(message);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      const message = "Image size must be less than 10MB";

      setErrors((prev) => ({
        ...prev,
        image: message,
      }));

      toast.error(message);
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
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

    toast.success("Image selected successfully");
  };

  /*
   * IMAGE DROP
   */
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

  /*
   * IMAGE SELECT
   */
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];

    processImageFile(file);

    e.target.value = "";
  };

  /*
   * VALIDATION
   */
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
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.linkedin.trim()) {
      newErrors.linkedin = "LinkedIn URL is required";
    } else {
      try {
        const linkedinUrl = new URL(formData.linkedin);

        if (
          !["http:", "https:"].includes(linkedinUrl.protocol)
        ) {
          newErrors.linkedin = "Please enter a valid LinkedIn URL";
        }
      } catch {
        newErrors.linkedin = "Please enter a valid LinkedIn URL";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please check the required fields");
      return false;
    }

    return true;
  };

  /*
   * BUILD FORMDATA
   */
  const buildPayload = () => {
    const payload = new FormData();

    payload.append("conferenceId", formData.conferenceId);
    payload.append("fullName", formData.fullName.trim());
    payload.append("designation", formData.designation.trim());
    payload.append("speakerType", formData.speakerType);
    payload.append("organization", formData.organization.trim());
    payload.append("country", formData.country.trim());
    payload.append("bio", formData.bio.trim());
    payload.append(
      "email",
      formData.email.trim().toLowerCase()
    );
    payload.append("linkedin", formData.linkedin.trim());
    payload.append("website", formData.website.trim());
    payload.append("status", formData.status);
    payload.append(
      "displayOrder",
      String(Number(formData.displayOrder) || 0)
    );

    /*
     * Send an image only when a new image is selected.
     * Existing image is preserved when editing without a new upload,
     * provided the backend update controller supports this behavior.
     */
    if (imageFile) {
      payload.append("image", imageFile);
    }

    return payload;
  };

  /*
   * CREATE / UPDATE SPEAKER
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitLoading) return;

    if (!validateForm()) return;

    const toastId = toast.loading(
      isEditMode ? "Updating speaker..." : "Adding speaker..."
    );

    try {
      setSubmitLoading(true);
      dispatch(clearSpeakerError());

      const payload = buildPayload();

      if (isEditMode) {
        await updateSpeakerApi(id, payload);

        toast.success("Speaker updated successfully", {
          id: toastId,
          duration: 2500,
        });
      } else {
        await dispatch(createSpeaker(payload)).unwrap();

        toast.success("Speaker added successfully", {
          id: toastId,
          duration: 2500,
        });
      }

      navigate("/admin/speakers");
    } catch (error) {
      console.error(
        isEditMode
          ? "Update speaker error:"
          : "Create speaker error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        (isEditMode
          ? "Failed to update speaker"
          : "Failed to add speaker");

      toast.error(message, {
        id: toastId,
        duration: 4000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  /*
   * CANCEL
   */
  const handleCancel = () => {
    if (submitLoading) return;
    navigate("/admin/speakers");
  };

  /*
   * LOADING EDIT DATA
   */
  if (pageLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2
            size={28}
            className="animate-spin text-violet-600"
          />

          <p className="text-sm font-medium text-gray-600">
            Loading speaker details...
          </p>

          <p className="text-xs text-gray-400">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50 p-3 sm:p-4 lg:p-5">
      {/* HEADER */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/speakers")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              {isEditMode ? (
                <Pencil
                  size={19}
                  className="text-violet-600"
                />
              ) : (
                <UserPlus
                  size={19}
                  className="text-violet-600"
                />
              )}

              <h1 className="text-[18px] font-bold text-gray-900">
                {isEditMode ? "Edit Speaker" : "Add Speaker"}
              </h1>
            </div>

            <p className="mt-0.5 text-[11px] text-gray-500">
              {isEditMode
                ? "Update speaker details"
                : "Add a new speaker to a conference"}
            </p>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {(speakerError || errors.general) && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-[11px] font-semibold text-red-600">
            {speakerError || errors.general}
          </p>
        </div>
      )}

      {/* FORM */}
      <form
        id="speaker-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* BASIC INFORMATION */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <User size={16} className="text-violet-600" />

              <h2 className="text-[13px] font-bold text-gray-800">
                Basic Information
              </h2>
            </div>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Enter the speaker's basic details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            {/* CONFERENCE */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Conference <span className="ml-1 text-red-500">*</span>
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

                {conferenceList.map((conference) => {
                  const conferenceId = conference?._id;

                  const conferenceName =
                    conference?.basicInformation?.title ||
                    conference?.basicInformation?.conferenceName ||
                    conference?.title ||
                    conference?.name ||
                    "";

                  if (!conferenceId) return null;

                  return (
                    <option
                      key={conferenceId}
                      value={conferenceId}
                    >
                      {conferenceName}
                    </option>
                  );
                })}
              </select>

              {errors.conferenceId && (
                <p className="mt-1 text-[10px] text-red-500">
                  {errors.conferenceId}
                </p>
              )}
            </div>

            {/* FULL NAME */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Full Name <span className="ml-1 text-red-500">*</span>
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

            {/* DESIGNATION */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Designation <span className="ml-1 text-red-500">*</span>
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

            {/* SPEAKER TYPE */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Speaker Type <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                name="speakerType"
                value={formData.speakerType}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                {speakerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* ORGANIZATION */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Organization <span className="ml-1 text-red-500">*</span>
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

            {/* COUNTRY */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Country <span className="ml-1 text-red-500">*</span>
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

        {/* SPEAKER BIOGRAPHY */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-violet-600" />

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
              Bio <span className="ml-1 text-red-500">*</span>
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Enter speaker biography..."
              className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-[12px] leading-5 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                errors.bio ? "border-red-300" : "border-gray-200"
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

        {/* CONTACT & SOCIAL LINKS */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <LinkIcon size={16} className="text-violet-600" />

              <h2 className="text-[13px] font-bold text-gray-800">
                Contact & Social Links
              </h2>
            </div>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Website is optional. Other fields are required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            {/* EMAIL */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Email <span className="ml-1 text-red-500">*</span>
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

            {/* LINKEDIN */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                LinkedIn URL <span className="ml-1 text-red-500">*</span>
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

            {/* WEBSITE */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Website{" "}
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

            {/* STATUS */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Status <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* DISPLAY ORDER */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
                Display Order
              </label>

              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                min="0"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>
        </div>

        {/* PROFILE IMAGE */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Image size={16} className="text-violet-600" />

              <h2 className="text-[13px] font-bold text-gray-800">
                Profile Image
              </h2>
            </div>

            <p className="mt-0.5 text-[10px] text-gray-400">
              {isEditMode
                ? "Current image is shown below. Select a new image only if you want to replace it."
                : "Upload the speaker profile image to Cloudinary."}
            </p>
          </div>

          <div className="p-4">
            <label className="mb-1.5 block text-[11px] font-semibold text-gray-700">
              Profile Image{" "}
              <span className="ml-1 text-[10px] font-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleImageDrop}
              className={`relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-gray-50 transition ${
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

                {isEditMode ? "Replace Image" : "Change Image"}

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

        {/* BUTTONS */}
        <div className="flex items-center justify-end gap-2 pb-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitLoading}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={14} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitLoading || conferencesLoading}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-violet-600 px-5 text-[11px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {isEditMode ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save size={14} />
                {isEditMode ? "Update Speaker" : "Save Speaker"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSpeakersPage;
