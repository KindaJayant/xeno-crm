// client/src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "../services/api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api("/auth/status");
        if (mounted) setIsAuthed(!!res?.isAuthenticated);
      } catch {
        if (mounted) setIsAuthed(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Checking session…</div>;
  return isAuthed ? children : <Navigate to="/login" replace state={{ from: location }} />;
}
