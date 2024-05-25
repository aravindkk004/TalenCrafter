import express from "express";
import db from "../../database/db.js";

const router = express.Router();

router.get("/",(req,res)=>{
    if(req.isAuthenticated()){
        const id = req.user.id;
        res.render("employer/jobpost.ejs",{id: id});
    }else{
        res.redirect("/employer/employer_login");
    }
})

router.post("/:id", async (req,res)=>{
    const employer_id = req.params.id;
    const { jobtitle, array, joblocation, stipend, enddate, noofapp, experience, jobdesc } = req.body;
    try{
        const result = await db.query(`SELECT companyName FROM employerProfile WHERE id=$1`, [employer_id]);
        const companyName = result.rows[0];
        const skill_array = JSON.parse(array);
        const newJob = await db.query(`INSERT INTO jobs (employer_id, title, skill, location, stipend, enddaate, no_of, experience, job_desc, companyName) VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10)`,[employer_id, jobtitle, skill_array, joblocation, stipend, enddate, noofapp, experience, jobdesc, companyName.companyname]);
        res.redirect("/employer/employerhome");
    }catch(err){
        console.log(err);
    }
});

router.get("/job/:id", async(req,res)=>{
    const job_id = req.params.id;
    try{
        const deleteJob = await db.query(`DELETE FROM jobs WHERE job_id=$1`, [job_id]);
        res.redirect("/employer/employerhome");
    }catch(err){
        console.log(err);
    }
});

export default router;