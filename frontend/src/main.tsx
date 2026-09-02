import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const renderStartupError = (message: string) => {
  root.render(
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ marginBottom: "8px" }}>Configuration Error</h1>
        <p style={{ margin: 0 }}>{message}</p>
      </div>
    </div>
  );
};

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
  console.warn(
    "⚠️ [DSA Logic Builder] VITE_API_URL is not set. The frontend will run in standalone/demo mode. Set VITE_API_URL (e.g. in Vercel project settings) to connect your backend API."
  );
}

import("./App.tsx")
  .then(({ default: App }) => {
    // Enable strict mode for better development warnings
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown startup error";
    renderStartupError(`App startup failed: ${message}`);
  });
