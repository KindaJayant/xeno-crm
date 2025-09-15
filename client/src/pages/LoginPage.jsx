// client/src/pages/LoginPage.jsx
import React from "react";
import { API_BASE, api } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const button = {
  padding: "12px 24px",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#fff",
  background: "#2e7d32",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default function LoginPage() {
  const { refreshAuth } = useContext(AuthContext) ?? {};

  const login = () => {
    // Redirect to cloud backend, NOT localhost
    window.location.href = `${API_BASE}/auth/google`;
  };

  const check = async () => {
    try {
      const r = await api("/auth/status");
      alert(JSON.stringify(r, null, 2));
      refreshAuth?.();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#eaeaea" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>
        Login to Your Account
      </h1>
      <p style={{ color: "#a0a0a0", marginBottom: 24 }}>
        Please log in using your Google account to continue.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={login} style={button}>Login with Google</button>
        <button onClick={check} style={{ ...button, background: "#424242" }}>
          Check status
        </button>
      </div>
    </div>
  );
}
