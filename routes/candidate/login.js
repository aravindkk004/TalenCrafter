import express from "express";
import db from "../../database/db.js";
import { globalresult } from "../candidate/findjob.js";

const router = express.Router();

router.get("/candidate_login", (req, res) => {
  res.render("../views/candidate/candidate_login.ejs", { query: req.query });
});

router.get("/userhome", async (req, res) => {
  if (req.isAuthenticated()) {
    const user_id = req.user.id;
    const employerdet = await db.query(
      `SELECT * FROM jobs JOIN  employerProfile ON jobs.employer_id = employerProfile.id JOIN employers ON employers.id=employerProfile.id`
    );
    if (!globalresult) {
      res.render("candidate/userhome.ejs", { details: employerdet.rows });
    } else {
      res.render("candidate/userhome.ejs", { details: globalresult.rows });
    }
  } else {
    res.redirect("/candidate/candidate_login");
  }
});

export default router;
