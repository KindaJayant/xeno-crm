// /server/index.js
const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, ".env") });
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

require("./config/passport-setup");

const app = express();
const isProd = process.env.NODE_ENV === "production";

/* Trust Render’s proxy so secure cookies work */
app.set("trust proxy", 1);

/* -------- CORS -------- */
const allowlist = new Set(
  [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL, // e.g. https://xeno-crm-sigma.vercel.app
  ].filter(Boolean)
);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      try {
        const { hostname } = new URL(origin);
        const ok =
          allowlist.has(origin) ||
          hostname.endsWith(".vercel.app");
        return ok ? cb(null, true) : cb(new Error("CORS blocked: " + origin));
      } catch {
        return cb(new Error("CORS invalid origin"));
      }
    },
    credentials: true, // <-- allow cookies
  })
);

app.use(express.json());

/* -------- Session (cross-site) -------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "replace_me_in_env",
    resave: false,
    saveUninitialized: false,
    name: "connect.sid",
    cookie: {
      httpOnly: true,
      sameSite: "none",        // allow cross-site cookie
      secure: isProd,          // required for SameSite=None
      domain: ".onrender.com", // scope cookie to your backend domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

/* Passport */
app.use(passport.initialize());
app.use(passport.session());

/* Health */
app.get("/__up", (_req, res) => res.send("UP"));
app.get("/healthz", (_req, res) => res.send("ok"));

/* DB */
const uri = process.env.MONGO_URI;
if (!uri) console.warn("[env] MONGO_URI missing");
else {
  mongoose
    .connect(uri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ Mongo connection error:", err));
}

/* Routes */
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/ingest", require("./routes/ingestionRoutes"));
app.use("/api/delivery-receipt", require("./routes/deliveryReceiptRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

/* 404 */
app.use((req, res) => {
  console.warn("404:", req.method, req.originalUrl);
  res.status(404).send("Not found");
});

/* Start */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
