// /server/config/passport-setup.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Tiny in-memory store (good enough for the assignment demo)
const users = {};

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, users[id]));

// IMPORTANT: use your deployed SERVER_URL for the callback
const SERVER_URL = process.env.SERVER_URL; // e.g. https://xeno-crm-4166.onrender.com

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      users[profile.id] = profile; // upsert
      return done(null, profile);
    }
  )
);
