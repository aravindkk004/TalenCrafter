import express from "express";

const router = express.Router();

router.get("/", (req,res)=>{
    res.render("index.ejs");
});

//login router
router.get("/login", (req,res)=>{
    res.render("login.ejs");
});

router.get("/candidate/findjob", (req,res)=>{
    res.render("../views/candidate/findjob.ejs");
})


export default router;