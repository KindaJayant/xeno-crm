// /server/index.js
const path = require("path");

// Load .env only in non-production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, ".env") });
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

// side-effect import to configure strategies
require("./config/passport-setup");

const app = express();
const isProd = process.env.NODE_ENV === "production";

/* ---------- trust proxy (needed for secure cookies behind Render) ---------- */
app.set("trust proxy", 1);

/* ---------- CORS ---------- */
const allowlist = new Set(
  [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL, // your canonical Vercel URL
  ].filter(Boolean)
);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/postman
      try {
        const { hostname } = new URL(origin);
        const ok =
          allowlist.has(origin) ||
          hostname.endsWith(".vercel.app"); // allow Vercel previews
        return ok ? cb(null, true) : cb(new Error("CORS blocked: " + origin));
      } catch {
        return cb(new Error("CORS invalid origin"));
      }
    },
    credentials: true,
  })
);


/* ---------- body parsing ---------- */
app.use(express.json());

/* ---------- session (cross-site friendly in prod) ---------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "replace_me_in_env",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd, // required for SameSite=None
      // maxAge: 7 * 24 * 60 * 60 * 1000, // optional
    },
  })
);

/* ---------- passport ---------- */
app.use(passport.initialize());
app.use(passport.session());

/* ---------- tiny health + smoke routes (CORS-reachable) ---------- */
app.get("/__up", (_req, res) => res.send("UP"));
app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/api/ping", (_req, res) => res.json({ ok: true, time: Date.now() }));
app.get("/api/campaigns/_test", (_req, res) =>
  res.json({ ok: true, note: "mounted OK" })
);

/* ---------- DB ---------- */
const uri = process.env.MONGO_URI;
if (!uri) {
  console.warn("[env] MONGO_URI missing");
} else {
  mongoose
    .connect(uri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ Mongo connection error:", err));
}

/* ---------- routes ---------- */
const authRoutes = require("./routes/authRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const ingestionRoutes = require("./routes/ingestionRoutes");
const deliveryReceiptRoutes = require("./routes/deliveryReceiptRoutes");
const aiRoutes = require("./routes/aiRoutes"); // uses lazy Groq init

app.use("/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/ingest", ingestionRoutes);
app.use("/api/delivery-receipt", deliveryReceiptRoutes);
app.use("/api/ai", aiRoutes);

/* ---------- 404 last ---------- */
app.use((req, res) => {
  console.warn("404:", req.method, req.originalUrl);
  res.status(404).send("Not found");
});

/* ---------- start ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});
