import express from "express";
import db from "../../database/db.js";
import multer from 'multer';
import nodemailer from "nodemailer";

const router = express.Router();

const upload = multer({
    storage:multer.memoryStorage(),
});

router.get("/:id", async(req,res)=>{
    const job_id = req.params.id;
    try{
        const data = await db.query(`SELECT * FROM appliedjob JOIN userProfile ON appliedjob.user_id = userProfile.id JOIN users ON appliedjob.user_id = users.id  WHERE job_id=$1`, [job_id]);
        res.render("employer/viewapplicants.ejs", {jobdet: data.rows});
    }catch(err){
        console.log(err);
    }
});

router.get("/view/:id", async(req,res)=>{
    const id = req.params.id;
    try{
        const result = await db.query(`SELECT resume FROM appliedjob WHERE user_id=$1`, [id]);
        if(result.rows.length>0){
            const pdfBuffer = result.rows[0].resume;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline');
            res.send(pdfBuffer);
        }else {
            res.status(404).send('PDF file not found.');
        }
    }catch(err){
        console.log(err);
    }
})

router.post("/:job_id/:user_id", async(req,res)=>{
    const job_id = req.params.job_id;
    const user_id = req.params.user_id;
    const {status} = req.body;
    try{
        const result = await db.query(`UPDATE appliedjob SET status=$1 WHERE user_id=$2 AND job_id=$3`,[status, user_id, job_id]);

        const compdet = await db.query(`SELECT * FROM jobs JOIN employerProfile ON jobs.employer_id = employerProfile.id WHERE job_id=$1`, [job_id]);
        const details = compdet.rows[0];
        let compMail = await db.query(`SELECT email FROM employers WHERE id=$1`, [details.employer_id]);
        compMail = compMail.rows[0];

        let useremail = await db.query(`SELECT email FROM userProfile WHERE id=$1`, [user_id]);
        useremail = useremail.rows[0];

        const selectdesc = `I am pleased to inform you that you have been selected for the ${details.title} position at ${details.companyname}. Your application stood out among many, and after careful consideration, we believe you are the right fit for our team.

        Congratulations! We are excited to welcome you aboard and look forward to seeing your contributions to our organization.
        
        Please let us know if you have any questions or need any further information. We will be happy to assist you as you prepare to join our team.
        
        We will follow up shortly with more details regarding your start date, orientation, and any necessary paperwork.
        
        Once again, congratulations on your selection, and welcome to ${details.companyname}!`;

        const notSelected=`I hope this message finds you well.

        I wanted to personally reach out to thank you for your interest in the ${details.title} position with ${details.companyname}. We appreciate the time and effort you put into your application.
        
        After careful consideration of all candidates, we regret to inform you that you have not been selected for this role. While this decision was difficult, we believe it's important to find the best fit for the position.
        
        Please know that your skills and experience were duly noted, and we encourage you to keep an eye on our future job postings. Your qualifications may align more closely with other opportunities within ${details.companyname}.
        
        Thank you once again for your interest in joining our team. We wish you the best of luck in your job search and in all your future endeavors.`;

        let description;

        if(status=="Hired"){
            description = selectdesc;
        }else{
            description = notSelected;
        }

        //mail sending
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth:{
                user: process.env.MAIL,
                pass: process.env.PASSWORD
            }
        });
        const mailOptions ={
            from: {
                name: details.companyname,
                address: compMail.email
            },
            to: useremail.email,
            subject: "Application status",
            text: description
        }
        transporter.sendMail(mailOptions, function(error, success){
            if(error){
                console.log(error)
            }else{
                res.redirect("/");
            }
        });
        res.redirect(`/employer/viewapplicants/${job_id}`);
    }catch(err){
        console.log(err);
    }
    
});

router.get("/viewresume/:id", async(req,res)=>{
    const id = req.params.id;
    try{
        const result = await db.query(`SELECT resume FROM appliedjob WHERE user_id=$1`, [id]);
        if(result.rows.length>0){
            const pdfBuffer = result.rows[0].resume;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline');
            res.send(pdfBuffer);
        }else {
            res.status(404).send('PDF file not found.');
        }
    }catch(err){
        console.log(err);
    }
})

export default router;