import express from "express";
import db from "../../database/db.js";

const router = express.Router();

router.get("/employer_login", (req,res)=>{
    res.render("../views/employer/employer_login.ejs",{query: req.query});
});

router.get("/employerhome", async(req,res)=>{
    if(req.isAuthenticated()){
        const id = req.user.id;
        const check_jobs = await db.query(`SELECT * FROM jobs WHERE employer_id=$1`,[id]);
        const company = await db.query(`SELECT * FROM employerProfile WHERE id=$1`, [id]);
        const comlogo = await db.query(`SELECT * FROM employers WHERE id=$1`, [id]);
        res.render("employer/employerhome.ejs",{jobs: check_jobs.rows, companydet: company.rows[0], comlogo: comlogo.rows[0]});
    }else{
        res.redirect("/employer/employer_login");
    }
})

export default router;