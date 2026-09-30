import React, { useRef, useState } from "react";
import {
  ImagePlus,
  Upload,
  X,
} from "lucide-react";

const MultiImageUploader = ({
  values = [],
  onChange,
  label = "Sponsor Logos",
  description = "PNG, JPG, JPEG or WEBP",
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (files) => {
    const validFiles = Array.from(files).filter((file) => {
      const validType = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ].includes(file.type);

      const validSize = file.size <= 10 * 1024 * 1024;

      return validType && validSize;
    });

    if (!validFiles.length) {
      alert(
        "Please select valid PNG, JPG, JPEG or WEBP images under 10MB."
      );
      return;
    }

    const newItems = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    onChange([...values, ...newItems]);
  };

  const handleInputChange = (e) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    const item = values[index];

    if (item?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(item.preview);
    }

    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
          isDragging
            ? "border-violet-500 bg-violet-50"
            : "border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50/40"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <ImagePlus size={24} />
        </div>

        <p className="mt-3 text-[13px] font-semibold text-slate-800">
          Drag & Drop Sponsor Logos
        </p>

        <p className="mt-1 text-[11px] text-slate-500">
          Drop multiple images here or click to browse
        </p>

        <p className="mt-2 text-[10px] text-slate-400">
          {description}
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {values.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {values.map((item, index) => (
            <div
              key={item.id || index}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <img
                src={item.preview || item}
                alt={`Sponsor ${index + 1}`}
                className="h-28 w-full object-contain bg-white p-3"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X size={14} />
              </button>

              <div className="border-t border-slate-100 px-2 py-1.5 text-center text-[10px] text-slate-500">
                Sponsor {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;