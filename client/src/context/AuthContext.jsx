// client/src/context/AuthContext.jsx
import React, { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export const AuthContext = createContext(undefined);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // object | null
  const [loading, setLoading] = useState(true); // true until we check once

  const check = useCallback(async () => {
    try {
      const data = await api("/auth/status", { method: "GET" });
      setUser(data?.isAuthenticated ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const value = { user, loading, refreshAuth: check };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
