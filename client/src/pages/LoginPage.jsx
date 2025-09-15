import React, { useState } from "react";

const buttonStyle = {
  display: "inline-block",
  padding: "12px 24px",
  fontSize: "1rem",
  fontWeight: "600",
  color: "#fff",
  backgroundColor: "#2e7d32", 
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  textDecoration: "none",
  boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
  transition: "background 0.2s ease-in-out",
};

const buttonHoverStyle = {
  ...buttonStyle,
  backgroundColor: "#2f8c35",
};

export default function LoginPage() {
  const [hover, setHover] = useState(false);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#eaeaea" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem" }}>
        Login to Your Account
      </h1>
      <p style={{ color: "#a0a0a0", marginBottom: "1.5rem" }}>
        Please log in using your Google account to continue.
      </p>
      <button
        onClick={handleLogin}
        style={hover ? buttonHoverStyle : buttonStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Login with Google
      </button>
    </div>
  );
}
