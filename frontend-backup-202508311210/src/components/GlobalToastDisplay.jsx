// src/components/GlobalToastDisplay.jsx
import React from "react";
import { Toaster } from "react-hot-toast";

/**
 * GlobalToastDisplay
 * 
 * A global toast container for showing notifications.
 * This mounts once at the app root so toast.js can trigger notifications.
 */
export default function GlobalToastDisplay() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
          padding: "10px 16px",
          fontSize: "0.95rem",
        },
        success: {
          style: {
            background: "#4caf50",
          },
        },
        error: {
          style: {
            background: "#f44336",
          },
        },
      }}
    />
  );
}
