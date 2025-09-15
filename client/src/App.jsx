// client/src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CampaignCreationPage from "./pages/CampaignCreationPage.jsx";
import CampaignHistoryPage from "./pages/CampaignHistoryPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* default → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* public */}
        <Route path="/login" element={<LoginPage />} />

        {/* protected */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CampaignCreationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <CampaignHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
