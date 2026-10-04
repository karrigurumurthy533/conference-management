import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Send, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { createReview } from "../../redux/reviewsSlice";

const AddReview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const { creating } = useSelector((state) => state.reviews);

  const [formData, setFormData] = useState({
    fullName: "",
    category: "",
    rating: 0,
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const categories = [
    "Student",
    "Webinar",
    "Speaker",
    "Other",
  ];

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // HANDLE RATING
  // ======================================================

  const handleRating = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  // ======================================================
  // HANDLE IMAGE
  // ======================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // ======================================================
  // REMOVE IMAGE
  // ======================================================

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ======================================================
  // SUBMIT REVIEW
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error("Please enter full name");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter review description");
      return;
    }

    try {
      const data = new FormData();

      data.append("reviewerImage", formData.image);
      data.append("fullName", formData.fullName.trim());
      data.append("category", formData.category);
      data.append("rating", String(formData.rating));
      data.append("description", formData.description.trim());
      data.append("status", "Published");

      const result = await dispatch(
        createReview(data)
      ).unwrap();

      toast.success(
        result?.message ||
          "Review added successfully"
      );

      navigate("/admin/reviews");
    } catch (error) {
      console.error("Add review error:", error);

      toast.error(
        typeof error === "string"
          ? error
          : "Failed to add review"
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-5 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {/* =====================================================
            BACK
        ===================================================== */}

        <div className="mb-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={creating}
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* =====================================================
            FORM CARD
        ===================================================== */}

        <div className="w-full rounded-xl border border-gray-100 bg-white shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 p-5 sm:p-6 lg:p-7">
              {/* =====================================================
                  IMAGE
              ===================================================== */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  Reviewer Image{" "}
                  <span className="text-red-500">*</span>
                </label>

                {!imagePreview ? (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={creating}
                    className="group flex min-h-[220px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition hover:border-violet-400 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 transition group-hover:bg-violet-200">
                      <Upload size={21} />
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      Click to upload image
                    </p>

                    <p className="mt-1.5 text-xs text-gray-400">
                      PNG, JPG, JPEG or WEBP
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Maximum file size: 5 MB
                    </p>
                  </button>
                ) : (
                  <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Review preview"
                      className="max-h-[400px] w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={creating}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X size={17} />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3">
                      <p className="truncate text-xs text-white">
                        {formData.image?.name}
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* =====================================================
                  FULL NAME
              ===================================================== */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  Full Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={creating}
                  placeholder="Enter full name"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              {/* =====================================================
                  CATEGORY
              ===================================================== */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  Category{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={creating}
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* =====================================================
                  RATING
              ===================================================== */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  Rating{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active =
                      star <=
                      (hoverRating || formData.rating);

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          handleRating(star)
                        }
                        onMouseEnter={() =>
                          setHoverRating(star)
                        }
                        onMouseLeave={() =>
                          setHoverRating(0)
                        }
                        disabled={creating}
                        className="rounded-md p-1 transition hover:scale-110 disabled:cursor-not-allowed"
                      >
                        <Star
                          size={27}
                          className={
                            active
                              ? "fill-[#7C3AED] text-[#7C3AED]"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    );
                  })}

                  <span className="ml-2 text-xs text-gray-500">
                    {formData.rating
                      ? `${formData.rating} / 5`
                      : "Select rating"}
                  </span>
                </div>
              </div>

              {/* =====================================================
                  DESCRIPTION
              ===================================================== */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  Review Description{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={creating}
                  rows={8}
                  placeholder="Write review description..."
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <div className="mt-1.5 text-right text-[10px] text-gray-400">
                  {formData.description.length}{" "}
                  characters
                </div>
              </div>
            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6 lg:px-7">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={creating}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="flex min-w-[135px] items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddReview;