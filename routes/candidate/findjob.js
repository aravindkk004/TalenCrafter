import express from "express";
import db from "../../database/db.js";
import env from "dotenv";
env.config();

const router = express.Router();

let globalresult;
let globalvar;

router.post("/", async(req,res)=>{
    const skills = req.body.array;
    const {specialization, companyName, location} = req.body;

    const skillsString = skills;
    const skillsArray = skillsString.toLowerCase().split(',');

    globalresult = await db.query(`
        SELECT *
        FROM jobs
        WHERE
            (($1::text IS NULL OR LOWER(title) = LOWER($1::text))
            OR ($2::text IS NULL OR LOWER(location) = LOWER($2::text))
            OR ($3::text IS NULL OR LOWER(companyName) = LOWER($3::text)))
            AND EXISTS (
                SELECT 1
                FROM UNNEST(skill) AS skill
                WHERE LOWER(skill) LIKE ANY($4::text[])
            )
    `, [specialization, location, companyName, skillsArray.map(skill => `%${skill.toLowerCase().includes('programming') ? skill.toLowerCase().replace(' programming', '') : skill.toLowerCase()}%`)])
    
    res.render("../views/candidate/findjob.ejs", {details: globalresult.rows});    
});

export {globalresult, router};