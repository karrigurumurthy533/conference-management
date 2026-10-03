import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  uploadBrochureApi,
  updateBrochureApi,
} from "../../api/brochureApi";

import axiosInstance from "../../redux/axiosInstance";

const UploadBrochure = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const fileInputRef = useRef(null);

  const editMode =
    location.state?.editMode ===
    true;

  const editBrochure =
    location.state?.brochure ||
    null;

  const brochureId =
    location.state?.brochureId ||
    editBrochure?._id ||
    null;

  const [title, setTitle] =
    useState(
      editBrochure?.title ||
        ""
    );

  const [conferenceId, setConferenceId] =
    useState(
      typeof editBrochure?.conferenceId ===
        "string"
        ? editBrochure.conferenceId
        : editBrochure?.conferenceId?._id ||
            ""
    );

  const [status, setStatus] =
    useState(
      editBrochure?.status ||
        "uploaded"
    );

  const [file, setFile] =
    useState(null);

  const [existingFile, setExistingFile] =
    useState(
      editBrochure?.file ||
        null
    );

  const [conferences, setConferences] =
    useState([]);

  const [loadingConferences, setLoadingConferences] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences =
    async () => {
      try {
        setLoadingConferences(
          true
        );

        const response =
          await axiosInstance.get(
            "/admin/conferences"
          );

        const data =
          response?.data?.data ||
          [];

        setConferences(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Fetch conferences error:",
          error
        );

        setConferences([]);
      } finally {
        setLoadingConferences(
          false
        );
      }
    };

  const getConferenceName =
    (conference) => {
      return (
        conference
          ?.basicInformation
          ?.title ||
        conference
          ?.basicInformation
          ?.conferenceTitle ||
        conference?.title ||
        conference?.name ||
        "-"
      );
    };

  const handleFileChange =
    (event) => {
      const selectedFile =
        event.target.files?.[0];

      if (!selectedFile) {
        return;
      }

      setErrorMessage("");

      if (
        selectedFile.type !==
        "application/pdf"
      ) {
        setErrorMessage(
          "Only PDF files are allowed."
        );

        event.target.value =
          "";

        return;
      }

      const maxSize =
        10 * 1024 * 1024;

      if (
        selectedFile.size >
        maxSize
      ) {
        setErrorMessage(
          "PDF file size must be less than 10 MB."
        );

        event.target.value =
          "";

        return;
      }

      setFile(
        selectedFile
      );
    };

  const handleRemoveNewFile =
    () => {
      setFile(null);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setErrorMessage("");

      setSuccessMessage("");

      if (!title.trim()) {
        setErrorMessage(
          "Brochure title is required."
        );

        return;
      }

      if (!conferenceId) {
        setErrorMessage(
          "Please select a conference."
        );

        return;
      }

      if (
        !editMode &&
        !file
      ) {
        setErrorMessage(
          "Please select a PDF brochure."
        );

        return;
      }

      try {
        setSubmitting(true);

        const formData =
          new FormData();

        formData.append(
          "title",
          title.trim()
        );

        formData.append(
          "conferenceId",
          conferenceId
        );

        formData.append(
          "status",
          status
        );

        if (file) {
          formData.append(
            "brochure",
            file
          );
        }

        if (editMode) {
          await updateBrochureApi(
            brochureId,
            formData
          );

          setSuccessMessage(
            "Brochure updated successfully."
          );
        } else {
          await uploadBrochureApi(
            formData
          );

          setSuccessMessage(
            "Brochure uploaded successfully."
          );
        }

        setTimeout(() => {
          navigate(
            "/admin/brochures"
          );
        }, 900);
      } catch (error) {
        console.error(
          "Brochure submit error:",
          error
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            (editMode
              ? "Failed to update brochure."
              : "Failed to upload brochure.")
        );
      } finally {
        setSubmitting(false);
      }
    };

  const handleBack =
    () => {
      navigate(
        "/admin/brochures"
      );
    };

  return (
    <div className="w-full min-w-0 px-2 pb-6">

      <div className="mx-auto w-full max-w-[950px]">

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[12px] font-medium text-emerald-600">
            <CheckCircle2
              size={16}
            />

            {
              successMessage
            }
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
            <AlertCircle
              size={16}
            />

            {
              errorMessage
            }
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_3px_12px_rgba(15,23,42,0.05)]">

            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
                  <FileText
                    size={20}
                    className="text-violet-600"
                  />
                </div>

                <div>
                  <h2 className="text-[15px] font-bold text-gray-900">
                    {editMode
                      ? "Edit Brochure"
                      : "Upload Brochure"}
                  </h2>

                  <p className="mt-0.5 text-[11px] text-gray-400">
                    {editMode
                      ? "Update conference brochure information"
                      : "Upload a conference brochure PDF"}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={
                  handleBack
                }
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-[11px] font-semibold text-gray-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
              >
                <ArrowLeft
                  size={14}
                />

                Back
              </button>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="md:col-span-2">

                <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                  Brochure Title

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(
                    event
                  ) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="Enter brochure title"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-50"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                  Conference

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={
                    conferenceId
                  }
                  onChange={(
                    event
                  ) =>
                    setConferenceId(
                      event.target.value
                    )
                  }
                  disabled={
                    loadingConferences
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-50 disabled:bg-gray-50"
                >

                  <option value="">
                    {loadingConferences
                      ? "Loading conferences..."
                      : "Select conference"}
                  </option>

                  {conferences.map(
                    (
                      conference
                    ) => (
                      <option
                        key={
                          conference._id
                        }
                        value={
                          conference._id
                        }
                      >
                        {getConferenceName(
                          conference
                        )}
                      </option>
                    )
                  )}

                  {editMode &&
                    conferenceId &&
                    conferences.length ===
                      0 && (
                      <option
                        value={
                          conferenceId
                        }
                      >
                        {editBrochure?.conferenceName ||
                          "Current conference"}
                      </option>
                    )}

                </select>

              </div>

              <div>

                <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                  Status
                </label>

                <select
                  value={
                    status
                  }
                  onChange={(
                    event
                  ) =>
                    setStatus(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-50"
                >

                  <option value="uploaded">
                    Uploaded
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                </select>

              </div>

            </div>

            <div className="mt-6">

              <label className="mb-1.5 block text-[11px] font-semibold text-gray-600">
                Brochure PDF

                {!editMode && (
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                )}
              </label>

              {editMode &&
                existingFile &&
                !file && (
                  <div className="mb-3 flex items-center justify-between rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                        <FileText
                          size={17}
                          className="text-violet-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-gray-700">
                          Existing brochure
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-gray-400">
                          Current PDF is already uploaded
                        </p>
                      </div>

                    </div>

                    <span className="ml-3 shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-600">
                      Existing
                    </span>

                  </div>
                )}

              {!file ? (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex min-h-[170px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-4 py-6 transition hover:border-violet-300 hover:bg-violet-50/30"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
                    <UploadCloud
                      size={23}
                      className="text-violet-600"
                    />
                  </div>

                  <p className="mt-3 text-[12px] font-semibold text-gray-700">
                    {editMode
                      ? "Replace brochure PDF"
                      : "Upload brochure PDF"}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    PDF only · Maximum 10 MB
                  </p>

                </button>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                      <FileText
                        size={17}
                        className="text-violet-600"
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-[11px] font-semibold text-gray-700">
                        {
                          file.name
                        }
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleRemoveNewFile
                    }
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <X
                      size={15}
                    />
                  </button>

                </div>
              )}

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="application/pdf,.pdf"
                onChange={
                  handleFileChange
                }
                className="hidden"
              />

            </div>

            {editMode && (
              <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5">

                <div className="flex gap-2">

                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0 text-amber-500"
                  />

                  <p className="text-[10px] leading-5 text-amber-700">
                    If you do not select a new PDF, the existing brochure file will remain unchanged.
                  </p>

                </div>

              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-5">

              <button
                type="button"
                onClick={
                  handleBack
                }
                disabled={
                  submitting
                }
                className="h-9 rounded-lg border border-gray-200 px-5 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="flex h-9 min-w-[155px] items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-[12px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {submitting ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />

                    {editMode
                      ? "Updating..."
                      : "Uploading..."}
                  </>
                ) : (
                  <>
                    <UploadCloud
                      size={15}
                    />

                    {editMode
                      ? "Update Brochure"
                      : "Upload Brochure"}
                  </>
                )}

              </button>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default UploadBrochure;