import React from "react";
import { Toaster as HotToaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "10px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 4000,
        },
      }}
    />
  );
};

export const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-lg">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
        <span className="text-sm font-medium text-gray-700">
          {text}
        </span>
      </div>
    </div>
  );
};

export default Toaster;