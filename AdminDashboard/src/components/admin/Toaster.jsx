import { Toaster as HotToaster } from "react-hot-toast";

function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#334155",
          border: "1px solid #E9D5FF",
          borderRadius: "12px",
          padding: "14px 18px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 8px 25px rgba(124, 58, 237, 0.10)",
        },
        success: {
          iconTheme: {
            primary: "#7C3AED",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#DC2626",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}

export default Toaster;