const express = require("express");
const passport = require("passport");
const router = express.Router();

const FRONTEND = process.env.FRONTEND_URL;

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND}/login?error=1`,
    session: true,
  }),
  (_req, res) => res.redirect(FRONTEND)
);

router.get("/status", (req, res) => {
  if (!req.user) return res.status(200).json({ isAuthenticated: false });
  res.status(200).json({ isAuthenticated: true, user: req.user });
});

router.get("/logout", (req, res, next) => {
  req.logout?.((err) => {
    if (err) return next(err);
    req.session?.destroy?.(() => {});
    res.clearCookie("connect.sid", { sameSite: "none", secure: true });
    res.redirect(`${FRONTEND}/login`);
  });
});

module.exports = router;
