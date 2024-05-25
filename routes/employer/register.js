import express from 'express';
import db from "../../database/db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";

const router = express.Router();

router.get("/register/employer", (req,res)=>{
    res.render("employer/employer_register.ejs",{query: req.query});
})

router.post("/employer/employer_login/man", passport.authenticate("local", {
    successRedirect: "/employer/employerhome",
    failureRedirect: "/employer/employer_login?error=incorrect_password"
}))

router.post("/register/employer", async (req,res)=>{
    const { email, password } = req.body;
    try{
        const exists = await db.query(`SELECT * from employers WHERE email=$1`, [email]);
        if(exists.rows.length>0){
            res.redirect("/register/employer?error=incorrect_password");
        }else{
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                  console.error("Error hashing password:", err);
                } else {
                    const result = await db.query(
                        "INSERT INTO employers (email, password) VALUES ($1, $2) RETURNING *",
                        [email, hash]
                    );
                    const user = result.rows[0];
                    req.login(user, (err) => {
                        console.log("success");
                        res.redirect("/employer/employerhome");
                    });
                }
            });
        }
    }catch(err){
        console.log(err);
    }
})

passport.use("local",new Strategy(async function verify(username, password, cb){
    try {
        const result = await db.query("SELECT * FROM employers WHERE email = $1 ", [
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