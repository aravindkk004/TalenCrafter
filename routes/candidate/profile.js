import express from "express";
import db from "../../database/db.js";
import multer from 'multer';

const router = express.Router();

const upload = multer({
    storage:multer.memoryStorage(),
});

router.get("/", async(req,res)=>{
    if(req.isAuthenticated()){
        const id = req.user.id;
        const user = await db.query(`SELECT * FROM users WHERE id=$1`, [id]);
        const userData = await db.query(`SELECT * FROM userProfile WHERE id=$1`, [id]);
        const jobcount = await db.query(`SELECT user_id FROM appliedjob WHERE user_id=$1`, [id]);
        res.render("candidate/userProfile.ejs", {user: user.rows[0], userData: userData.rows[0], jobdetail: jobcount.rows});
    }else{
        res.redirect("/candidate/candidate_login");
    }
});

router.post("/:id", upload.single("resume"), async (req,res)=>{
    const id = req.params.id;
    const { username, email, array, deleteItem, locations, domainarray, domaindeleteItem, portfolio, linkedin, experience, github } = req.body;

    try{
        var resume=req.file;
        if(resume){
            resume = req.file.buffer;
        }
        const existsUser = await db.query(`SELECT * FROM userProfile WHERE id=$1`, [id]);
        var newSkills;
        if(array.length>0){
            newSkills = JSON.parse(array);
        }
        var newDomains;
        if(domainarray.length>0){
            newDomains = JSON.parse(domainarray);
        }
        if(existsUser.rows.length<1){
            const user = await db.query(`INSERT INTO userProfile (id, username, email, skills, locations, domains, portfolio, linkedin, resume, experience, github) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,[id, username, email, newSkills, locations, newDomains, portfolio, linkedin, resume, experience, github]);
        }else{
            if(existsUser.rows.length>0){
                const user = db.query(`UPDATE userProfile SET id=$1, username=$2, email=$3, locations=$4, portfolio=$5, linkedin=$6, resume=$7, experience=$8, github=$9`,[id, username, email, locations, portfolio, linkedin, resume, experience, github]);
            }
            if(array.length>0){
                const existingSkills = existsUser.rows[0].skills;
                const updatedSkills = [...new Set([...existingSkills, ...newSkills])];
                await db.query(`UPDATE userProfile SET skills=$1`, [updatedSkills]);
            }
            if(domainarray.length>0){
                const existingDomains = existsUser.rows[0].domains;
                const updatedDomains = [...new Set([...existingDomains, ...newDomains])];
                await db.query(`UPDATE userProfile SET domains=$1`, [updatedDomains]);
            }
        }
        
        if(deleteItem.length>0){
            const deleteSkill = JSON.parse(deleteItem);
            deleteSkill.forEach(async (skill1)=>{
                await db.query(`UPDATE userProfile SET skills=ARRAY_REMOVE(skills,$1) WHERE id=id`,[skill1]);
            })   
        }

        if(domaindeleteItem.length>0){
            const deleteDomain = JSON.parse(domaindeleteItem);
            deleteDomain.forEach(async (domain1)=>{
                await db.query(`UPDATE userProfile SET domains=ARRAY_REMOVE(domains,$1) WHERE id=id`, [domain1])
            })
        }
        res.redirect("/candidate/userProfile");
    }catch(err){
        console.log(err);
    } 
});

router.get("/:id", async(req,res)=>{
    const id = req.params.id;
    const result = await db.query(`select resume FROM userProfile WHERE id=$1`, [id]);
    
    if (result.rows.length > 0) {
        const pdfBuffer = result.rows[0].resume;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.send(pdfBuffer);
    }else {
        res.status(404).send('PDF file not found.');
    }
});

export default router;