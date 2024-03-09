import express from 'express';
import db from "../../database/db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";

const router = express.Router();

router.get("/register/user", (req,res)=>{
    res.render("candidate/candidate_register.ejs",{query: req.query});
});

router.post("/register/user", async (req,res)=>{
    const { email, password } = req.body;
    try{
        const exists = await db.query(`SELECT * from users WHERE email=$1`, [email]);
        if(exists.rows.length>0){
            res.redirect("/register/user?error=incorrect_password");
        }else{
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                  console.error("Error hashing password:", err);
                } else {
                    const result = await db.query(
                        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
                        [email, hash]
                    );
                    const user = result.rows[0];
                    req.login(user, (err) => {
                        res.redirect("/candidate/userhome");
                    });
                }
            });
        }
    }catch(err){
        console.log(err);
    }
})

router.post("/candidate/candidate_login/man", passport.authenticate("locals", {
    successRedirect: "/candidate/userhome",
    failureRedirect: "/candidate/candidate_login?error=incorrect_password"
}))

passport.use("locals",new Strategy(async function verify(username, password, cb){
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
          username,
        ]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedHashedPassword = user.password;
            bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                if (err) {
                    console.error("Error comparing passwords:", err);
                    return cb(err);
                } else {
                    if (valid) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
                    }
                }
            });
        } else {
            return cb("User not found");
        }
    } catch (err) {
        console.log(err);
    }
}))

export default router;