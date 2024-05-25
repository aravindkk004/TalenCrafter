import express from "express";
import passport from "passport";
import db from "../../database/db.js";
import GoogleStrategy from "passport-google-oauth2";

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    profileFields: ["photos"],
  })
);

router.get(
  "/secrets",
  passport.authenticate("google", {
    successRedirect: "/candidate/userhome",
    failureRedirect: "/candidate/candidate_login",
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL_CND,
      userProfileURL: process.env.USER_PROFILE_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        profile.accessToken = accessToken;
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        const userProfile = profile.photos[0].value;
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password, tokens, profileImg) VALUES ($1, $2, $3, $4)",
            [profile.email, "google", profile.accessToken, userProfile]
          );
          return cb(null, newUser.rows[0]);
        }
        if (result.rows.length > 0) {
          const updateUser = await db.query(
            `UPDATE users SET tokens=$1 WHERE email=$2 RETURNING *`,
            [profile.accessToken, profile.email]
          );
          return cb(null, updateUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

export default router;
