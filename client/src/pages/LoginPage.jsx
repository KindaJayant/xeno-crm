// client/src/pages/LoginPage.jsx
import React from "react";
import { API_BASE } from "../services/api";

const btn = {
  display: "inline-block",
  padding: "12px 24px",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#fff",
  backgroundColor: "#2e7d32",
  border: "none",
  borderRadius: 8,
  textDecoration: "none",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
  transition: "background .2s",
};

const LoginPage = () => {
  const [hover, setHover] = React.useState(false);
  const handleLogin = () => {
    // ✅ always go to deployed backend, not localhost
    window.location.href = `${API_BASE}/auth/google`;
  };
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#eaeaea" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: ".5rem" }}>
        Login to Your Account
      </h1>
      <p style={{ color: "#a0a0a0", marginBottom: "1.5rem" }}>
        Please log in using your Google account to continue.
      </p>
      <button
        onClick={handleLogin}
        style={{ ...btn, backgroundColor: hover ? "#2f8c35" : "#2e7d32" }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
