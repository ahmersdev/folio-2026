"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100dvh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
          backgroundColor: "#121212",
          color: "#fdfdfd",
          fontFamily: "sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ maxWidth: "24rem", margin: 0, color: "#a0a0a0" }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          style={{
            borderRadius: "9999px",
            border: "2px solid #fdfdfd",
            background: "transparent",
            color: "#fdfdfd",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
