import express from "express";
import db from "../../database/db.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/:id", async (req, res) => {
  const job_id = req.params.id;
  if (req.isAuthenticated()) {
    const user_id = req.user.id;
    res.render("candidate/jobapply.ejs", { jobid: job_id, userid: user_id });
  }
});

router.post("/:id", upload.single("resumea"), async (req, res) => {
  const jobid = req.params.id;
  const { whychoose, careergoal, join, userid } = req.body;
  try {
    var resumea = req.file;
    if (resumea) {
      resumea = req.file.buffer;
    }
    const jobapply = await db.query(
      `INSERT INTO appliedjob (job_id, user_id, why, what, are, resume) VALUES ($1, $2, $3, $4, $5, $6)`,
      [jobid, userid, whychoose, careergoal, join, resumea]
    );
    const applicants = await db.query(
      `SELECT applicants FROM jobs WHERE job_id=$1`,
      [jobid]
    );
    const updateapplicants = await db.query(
      `UPDATE jobs SET applicants=$1 WHERE job_id=$2`,
      [applicants.rows[0].applicants + 1, jobid]
    );
    res.redirect(`/candidate/jobdetail/${jobid}`);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const result = await db.query(
      `SELECT * FROM jobs JOIN appliedjob ON jobs.job_id = appliedjob.job_id WHERE user_id=$1 `,
      [req.user.id]
    );
    res.render("candidate/appliedjob.ejs", { data: result.rows });
  } else {
    res.redirect("/candidate/candidate_login");
  }
});

router.get("/view/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const user_id = req.user.id;
    const job_id = req.params.id;
    try {
      const result = await db.query(
        `SELECT * FROM appliedjob WHERE job_id=$1 AND user_id=$2`,
        [job_id, user_id]
      );
      res.render("candidate/status.ejs", { data: result.rows[0] });
    } catch (err) {
      console.log(err);
    }
  }
});

router.get("/detail/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const job_id = req.params.id;
    const jobdet = await db.query(`SELECT * from jobs WHERE job_id=$1`, [
      job_id,
    ]);
    const checkuser = await db.query(
      `SELECT * FROM appliedjob WHERE job_id=$1`,
      [job_id]
    );
    const compDet = await db.query(
      `SELECT * FROM jobs JOIN employerProfile ON jobs.employer_id=employerProfile.id WHERE jobs.job_id=$1`,
      [job_id]
    );
    res.render("candidate/jobdetail.ejs", {
      jobDetail: jobdet.rows[0],
      userdet: checkuser.rows,
      current_id: req.user.id,
      compDet: compDet.rows[0],
    });
  } else {
    res.redirect("/candidate/candidate_login");
  }
});

router.get("/views/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(
      `SELECT resume FROM appliedjob WHERE user_id=$1`,
      [id]
    );
    if (result.rows.length > 0) {
      const pdfBuffer = result.rows[0].resume;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      res.send(pdfBuffer);
    } else {
      res.status(404).send("PDF file not found.");
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
