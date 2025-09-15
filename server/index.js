// server/index.js
const path = require("path");
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

/* ---------- middleware (order matters) ---------- */
// allow your Vite dev origins + optional prod FRONTEND_URL
const allowed = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/postman
      return allowed.includes(origin)
        ? cb(null, true)
        : cb(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_session_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// quick test endpoints (behind CORS so the client can call them)
app.get("/__up", (_req, res) => res.send("UP"));
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
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.error("Connection error:", err));
}

/* ---------- routes ---------- */
const authRoutes = require("./routes/authRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const ingestionRoutes = require("./routes/ingestionRoutes");
const deliveryReceiptRoutes = require("./routes/deliveryReceiptRoutes");
const aiRoutes = require("./routes/aiRoutes"); // uses lazy Groq init

app.use("/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);        // inside file, use router.get('/')
app.use("/api/ingest", ingestionRoutes);
app.use("/api/delivery-receipt", deliveryReceiptRoutes);
app.use("/api/ai", aiRoutes);                     // POST /generate-rules

// simple health check
app.get("/healthz", (_req, res) => res.send("ok"));

// 404 logger (keep last)
app.use((req, res) => {
  console.warn("404:", req.method, req.originalUrl);
  res.status(404).send("Not found");
});

/* ---------- start ---------- */
const PORT = process.env.PORT || 5000; // <-- declared once
app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});