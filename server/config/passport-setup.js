// /server/config/passport-setup.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const must = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`[auth] Missing required env: ${name}`);
  return v;
};

const SERVER_URL = must("SERVER_URL"); // e.g. https://xeno-crm-4166.onrender.com
const GOOGLE_CLIENT_ID = must("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = must("GOOGLE_CLIENT_SECRET");

// simple demo store
const users = {};

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, users[id]));

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      users[profile.id] = profile;
      return done(null, profile);
    }
  )
);

module.exports = { users };
