import express from "express";
import passport from "passport";
import db from "../../database/db.js";
import GoogleStrategy from "passport-google-oauth2";

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.get(
    "/",
    passport.authenticate("googles", {
        scope: ["profile", "email"],
        profileFields: ["photos"],
    })
);

router.get(
    "/secrets",
    passport.authenticate("googles", {
        successRedirect: "/employer/employerhome",
        failureRedirect: "/employer/employer_login",
    })
);

passport.use(
    "googles", 
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL_EMP,
        userProfileURL: process.env.USER_PROFILE_URL,
    },async (accessToken, refreshToken, profile, cb) =>{
        try{
            profile.accessToken = accessToken;
            const result = await db.query("SELECT * FROM employers WHERE email = $1", [
                profile.email,
            ]);
            const profileImage = profile.photos[0].value;
            if (result.rows.length === 0) {
                const newUser = await db.query(
                    "INSERT INTO employers (email, password, tokens, profileImg) VALUES ($1, $2, $3, $4)",
                    [profile.email, "google", profile.accessToken, profileImage]
                );
                return cb(null, newUser.rows[0]);
            }
            if(result.rows.length>0){
                const updateUser = await db.query(`UPDATE employers SET tokens=$1, profileImg=$2 WHERE email=$3 RETURNING *`,[profile.accessToken, profileImage, profile.email]);
                return cb(null, updateUser.rows[0]);
            }
            else {
                return cb(null, result.rows[0]);
            }
        }catch(err){
            return cb(err);
        }
    }
));

export default router;