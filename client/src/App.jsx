import { useState, useEffect } from "react";
import React from "react"; 
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import CampaignCreationPage from "./pages/CampaignCreationPage.jsx";
import CampaignHistoryPage from "./pages/CampaignHistoryPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* public */}
        <Route path="/login" element={<LoginPage />} />

        {/* protected */}
        <Route
          path="/"
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
