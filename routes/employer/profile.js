import express from "express";
import db from "../../database/db.js";
import multer from 'multer';

const router = express.Router();

const upload = multer({
    storage:multer.memoryStorage(),
});

router.get("/", async (req,res)=>{
    if(req.isAuthenticated()){
        const id = req.user.id;
        const employer = await db.query(`SELECT * FROM employers WHERE id=$1`, [id]);
        const employerData = await db.query(`SELECT * FROM employerProfile WHERE id=$1`, [id]);
        const jobData = await db.query(`SELECT * FROM jobs WHERE employer_id=$1`, [id]);
        res.render("employer/employerProfile.ejs", {employer: employer.rows[0], employerData: employerData.rows[0], jobs: jobData.rows});
    }else{
        res.redirect("/employer/employer_login");
    }
});

router.post("/:id",upload.single("resume"), async (req,res)=>{
    const id = req.params.id;
    const { companyname, locations, website, about, type, fblink, twitterlink, linkedinlink } = req.body;

    try{

        var additional=req.file;
        if(additional){
            additional = req.file.buffer;
        }

        const existingEmploye = await db.query(`SELECT * FROM employerProfile WHERE id=$1`, [id]);

        if(existingEmploye.rows.length<1){
            const newEmployer = await db.query(`INSERT INTO employerProfile(id, companyName, locations, webLink, companyType, addRes, fbLink, twitter, linkedin, about) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,[id, companyname, locations, website, type, additional, fblink, twitterlink, linkedinlink, about]);
        }
        if(existingEmploye.rows.length>0){
            const updateEmployer = await db.query(`UPDATE employerProfile SET companyName=$1, locations=$2, webLink=$3, companyType=$4, addRes=$5, fbLink=$6, twitter=$7, linkedin=$8, about=$9`,[companyname, locations, website, type, additional, fblink, twitterlink, linkedinlink, about])
        }
        res.redirect("/employer/employerProfile");
    }catch(err){
        console.log(err)
    }
})

export default router;