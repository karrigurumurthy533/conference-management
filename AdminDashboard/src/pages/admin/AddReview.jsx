import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Star,
  Send,
  Upload,
  X,
} from "lucide-react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  createReview,
  getReviewById,
  updateReview,
} from "../../redux/reviewsSlice";

const AddReview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  // =====================================================
  // ADD MODE
  // /admin/reviews/add
  //
  // EDIT MODE
  // /admin/reviews/add/:id
  // =====================================================

  const isEditMode = Boolean(id);

  const fileInputRef = useRef(null);

  const {
    creating,
    loading,
    updating,
  } = useSelector(
    (state) => state.reviews
  );

  const isSubmitting =
    creating || updating;

  const [formData, setFormData] = useState({
    fullName: "",
    category: "",
    rating: 0,
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] =
    useState("");

  const [hoverRating, setHoverRating] =
    useState(0);

  const [loadingReview, setLoadingReview] =
    useState(false);

  const categories = [
    "Student",
    "Webinar",
    "Speaker",
    "Other",
  ];

  // =====================================================
  // LOAD REVIEW FOR EDIT
  // =====================================================

  useEffect(() => {
    if (!isEditMode || !id) {
      return;
    }

    const loadReview = async () => {
      try {
        setLoadingReview(true);

        console.log(
          "Loading review for edit:",
          id
        );

        const result = await dispatch(
          getReviewById(id)
        ).unwrap();

        console.log(
          "Get review by ID result:",
          result
        );

        const review =
          result?.data?.review ||
          result?.data ||
          result?.review ||
          result;

        if (!review) {
          toast.error(
            "Review details not found"
          );

          navigate("/admin/reviews");
          return;
        }

        console.log(
          "Review loaded for edit:",
          review
        );

        setFormData({
          fullName:
            review?.fullName || "",

          category:
            review?.category || "",

          rating:
            Number(review?.rating) || 0,

          description:
            review?.description ||
            review?.review ||
            "",

          image: null,
        });

        const existingImage =
          review?.reviewerImage ||
          review?.image ||
          "";

        if (existingImage) {
          setImagePreview(
            existingImage
          );
        } else {
          setImagePreview("");
        }
      } catch (error) {
        console.error(
          "Get review error:",
          error
        );

        console.error(
          "Get review error response:",
          error?.response?.data
        );

        toast.error(
          typeof error === "string"
            ? error
            : error?.message ||
                "Failed to load review"
        );

        navigate("/admin/reviews");
      } finally {
        setLoadingReview(false);
      }
    };

    loadReview();
  }, [
    dispatch,
    id,
    isEditMode,
    navigate,
  ]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE RATING
  // =====================================================

  const handleRating = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  // =====================================================
  // HANDLE IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      toast.error(
        "Please select a valid image"
      );

      e.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Image size must be less than 5 MB"
      );

      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  // =====================================================
  // SUBMIT CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !isEditMode &&
      !formData.image
    ) {
      toast.error(
        "Please upload an image"
      );
      return;
    }

    if (
      !formData.fullName.trim()
    ) {
      toast.error(
        "Please enter full name"
      );
      return;
    }

    if (!formData.category) {
      toast.error(
        "Please select a category"
      );
      return;
    }

    if (!formData.rating) {
      toast.error(
        "Please select a rating"
      );
      return;
    }

    if (
      !formData.description.trim()
    ) {
      toast.error(
        "Please enter review description"
      );
      return;
    }

    if (
      isEditMode &&
      !id
    ) {
      toast.error(
        "Review ID is missing"
      );
      return;
    }

    try {
      // =================================================
      // CREATE FORMDATA
      // =================================================

      const data = new FormData();

      // =================================================
      // IMAGE
      // =================================================

      if (formData.image) {
        data.append(
          "reviewerImage",
          formData.image
        );
      }

      // =================================================
      // OTHER FIELDS
      // =================================================

      data.append(
        "fullName",
        formData.fullName.trim()
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "rating",
        String(formData.rating)
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "status",
        "Published"
      );

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "===================================="
      );

      console.log(
        "Review submit mode:",
        isEditMode
          ? "UPDATE"
          : "CREATE"
      );

      console.log(
        "Review ID:",
        id || "NEW"
      );

      console.log(
        "Is FormData:",
        data instanceof FormData
      );

      for (const [
        key,
        value,
      ] of data.entries()) {
        console.log(
          "FormData:",
          key,
          value
        );
      }

      console.log(
        "===================================="
      );

      // =================================================
      // UPDATE REVIEW
      // =================================================

      if (isEditMode) {
        const result =
          await dispatch(
            updateReview({
              id,
              reviewData: data,
            })
          ).unwrap();

        console.log(
          "Update review result:",
          result
        );

        toast.success(
          result?.message ||
            "Review updated successfully"
        );

        navigate(
          "/admin/reviews"
        );

        return;
      }

      // =================================================
      // CREATE REVIEW
      // =================================================

      const result =
        await dispatch(
          createReview(data)
        ).unwrap();

      console.log(
        "Create review result:",
        result
      );

      toast.success(
        result?.message ||
          "Review added successfully"
      );

      navigate(
        "/admin/reviews"
      );
    } catch (error) {
      console.error(
        isEditMode
          ? "Update review error:"
          : "Add review error:",
        error
      );

      console.error(
        "Review API error response:",
        error?.response?.data
      );

      toast.error(
        typeof error === "string"
          ? error
          : error?.message ||
              (isEditMode
                ? "Failed to update review"
                : "Failed to add review")
      );
    }
  };

  // =====================================================
  // LOADING REVIEW
  // =====================================================

  if (
    isEditMode &&
    loadingReview
  ) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f7f7fb] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />

              <p className="mt-3 text-sm text-gray-500">
                Loading review...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f7f7fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <form
            onSubmit={handleSubmit}
          >

            <div className="p-5 sm:p-6 lg:p-7">

              <div className="mb-8 flex items-start justify-between">
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(-1)
                    }
                    className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-violet-600"
                  >
                    <ArrowLeft
                      size={17}
                    />
                    Back
                  </button>

                  <h1 className="text-2xl font-semibold text-gray-900">
                    {isEditMode
                      ? "Update Review"
                      : "Add Review"}
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    {isEditMode
                      ? "Update conference review details"
                      : "Create a new conference review"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">

                <div className="space-y-6">

                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">
                      Full Name{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={
                        formData.fullName
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        isSubmitting
                      }
                      placeholder="Enter full name"
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">
                      Category{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      name="category"
                      value={
                        formData.category
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        isSubmitting
                      }
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={
                              category
                            }
                            value={
                              category
                            }
                          >
                            {category}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">
                      Rating{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="flex min-h-[44px] items-center gap-1">
                      {[
                        1,
                        2,
                        3,
                        4,
                        5,
                      ].map(
                        (star) => {
                          const active =
                            star <=
                            (hoverRating ||
                              formData.rating);

                          return (
                            <button
                              key={
                                star
                              }
                              type="button"
                              disabled={
                                isSubmitting
                              }
                              onClick={() =>
                                handleRating(
                                  star
                                )
                              }
                              onMouseEnter={() =>
                                setHoverRating(
                                  star
                                )
                              }
                              onMouseLeave={() =>
                                setHoverRating(
                                  0
                                )
                              }
                              className="rounded-md p-1 transition hover:scale-110 disabled:cursor-not-allowed"
                            >
                              <Star
                                size={28}
                                className={
                                  active
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            </button>
                          );
                        }
                      )}

                      <span className="ml-2 text-sm text-gray-500">
                        {formData.rating
                          ? `${formData.rating}/5`
                          : "Select rating"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">
                    Reviewer Image{" "}
                    {!isEditMode && (
                      <span className="text-red-500">
                        *
                      </span>
                    )}
                  </label>

                  {!imagePreview ? (
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={
                        isSubmitting
                      }
                      className="group flex aspect-square w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 transition hover:border-violet-400 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 transition group-hover:bg-violet-200">
                        <Upload
                          size={21}
                        />
                      </div>

                      <p className="text-center text-sm font-medium text-gray-700">
                        Click to upload
                      </p>

                      <p className="mt-1.5 text-center text-xs text-gray-400">
                        PNG, JPG, JPEG or WEBP
                      </p>

                      <p className="mt-1 text-center text-[10px] text-gray-400">
                        Maximum 5 MB
                      </p>
                    </button>
                  ) : (
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <img
                        src={
                          imagePreview
                        }
                        alt="Review preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={
                          removeImage
                        }
                        disabled={
                          isSubmitting
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X
                          size={16}
                        />
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                  {isEditMode &&
                    imagePreview && (
                      <p className="mt-2 text-[10px] text-gray-400">
                        Select a new image to replace the existing image.
                      </p>
                    )}
                </div>
              </div>

              <div className="mt-8">
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  Review Description{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    isSubmitting
                  }
                  rows={10}
                  placeholder="Enter detailed review description..."
                  className="min-h-[240px] w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <div className="mt-2 flex justify-end">
                  <span className="text-xs text-gray-400">
                    {
                      formData
                        .description
                        .length
                    }{" "}
                    characters
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6 lg:px-7">
              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                disabled={
                  isSubmitting
                }
                className="h-11 rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  loadingReview
                }
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    {isEditMode
                      ? "Updating..."
                      : "Adding..."}
                  </>
                ) : (
                  <>
                    <Send
                      size={17}
                    />

                    {isEditMode
                      ? "Update Review"
                      : "Add Review"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddReview;