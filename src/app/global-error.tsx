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
        <h1
          style={{
            fontSize: "clamp(1.25rem, 0.39rem + 4.29vw, 4.25rem)",
            fontWeight: 600,
            margin: 0,
          }}
        >
          SOMETHING WENT WRONG
        </h1>
        <p
          style={{
            fontSize: "clamp(1rem, 0.75rem + 1.25vw, 1.875rem)",
            maxWidth: "50rem",
            margin: 0,
          }}
        >
          An unexpected error occurred. Please Try Again.
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
