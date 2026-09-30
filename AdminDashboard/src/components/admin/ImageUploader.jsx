import React, { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Upload,
  X,
  RotateCcw,
} from "lucide-react";

const ImageUploader = ({
  value = null,
  onChange,
  label = "Image",
  description = "PNG, JPG, JPEG or WEBP",
  className = "",
  aspect = "h-[190px]",
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreview("");
      return;
    }

    if (typeof value === "string") {
      setPreview(value);
      return;
    }

    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG, JPEG and WEBP images are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB.");
      return;
    }

    onChange(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  const removeImage = () => {
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
        {label}
      </label>

      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
            isDragging
              ? "border-violet-500 bg-violet-50"
              : "border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50/40"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <ImagePlus size={24} />
          </div>

          <p className="mt-3 text-[13px] font-semibold text-slate-800">
            Drag & Drop Image
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            or click to browse
          </p>

          <p className="mt-2 text-[10px] text-slate-400">
            {description}
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
          <img
            src={preview}
            alt={label}
            className={`${aspect} w-full object-cover`}
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-3 py-2 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              <RotateCcw size={13} />
              Change
            </button>

            <button
              type="button"
              onClick={removeImage}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-red-600"
            >
              <X size={13} />
              Remove
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;