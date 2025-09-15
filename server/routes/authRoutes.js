// /server/routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

const FRONTEND = process.env.FRONTEND_URL; // e.g. https://xeno-crm-sigma.vercel.app

// Start Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback: ensure session is saved before redirecting to frontend
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND}/login?error=1`,
    session: true,
  }),
  (req, res) => {
    // Make sure the session (connect.sid) is persisted before redirect
    req.session.save(() => res.redirect(FRONTEND));
  }
);

// Session status used by ProtectedRoute
router.get("/status", (req, res) => {
  if (!req.user) return res.status(200).json({ isAuthenticated: false });
  res.status(200).json({ isAuthenticated: true, user: req.user });
});

// Logout: accept both GET and POST to avoid client mismatch
router.all("/logout", (req, res, next) => {
  req.logout?.((err) => {
    if (err) return next(err);
    req.session?.destroy?.(() => {});
    res.clearCookie("connect.sid", { sameSite: "none", secure: true, domain: ".onrender.com" });
    res.json({ ok: true });
  });
});

module.exports = router;
