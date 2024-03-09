import express from 'express';
import bodyParser from 'body-parser';
import session from "express-session";
import env from 'dotenv';
import EventEmitter from 'events';
import passport from "passport";

//routers
import homePage from "./routes/home.js";
import employerLogin from "./routes/employer/login.js";
import candidateLogin from "./routes/candidate/login.js";
import candidateAuth from "./routes/candidate/auth.js";
import logout from "./routes/logout.js";
import employerAuth from "./routes/employer/auth.js";
import candidateProfile from "./routes/candidate/profile.js";
import employerProfile from "./routes/employer/profile.js";
import jobPost from "./routes/employer/jobpost.js";
import jobApply from "./routes/candidate/jobApply.js";
import hire from "./routes/employer/hire.js";
import findjob from "./routes/findjob.js";
import {router} from "./routes/candidate/findjob.js";
import mail from "./routes/mail.js";
import userRegister from "./routes/candidate/register.js";
import employerRegister from "./routes/employer/register.js";

env.config();

const app = express();
const saltRounds = 10;
let globalresult;

EventEmitter.defaultMaxListeners = 15;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        secure: false,
        maxAge: 1000 * 60 * 60 *24,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", homePage);

app.use("/employer", employerLogin);

app.use("/candidate", candidateLogin);

app.use("/auth/google", candidateAuth);

app.use("/auth/google/employer", employerAuth);

app.use("/logout", logout);

app.use("/candidate/userProfile", candidateProfile);
app.use("/viewresume", candidateProfile);

app.use("/employer/employerProfile", employerProfile);

//job posting
app.use("/employer/jobpost", jobPost);
app.use("/employer/jobposting", jobPost);
app.use("/delete", jobPost);

//job applying
app.use("/candidate/jobapply", jobApply);
app.use("/candidate/appliedjob", jobApply);
app.use("/candidate/status", jobApply);
app.use("/candidate/jobdetail", jobApply);
app.use("/resumes", jobApply);

//hiring
app.use("/employer/viewapplicants", hire);
app.use("/employer/hiring", hire);
app.use("/resume", hire);

//findjob page
app.use("/searchjob", findjob);
app.use("/upload", findjob);

app.use("/candidate/findjob", router);

//sending email
app.use("/mail/feedback", mail);

//register user with gmail
app.use("/", userRegister);

//register employer with gmail
app.use("/", employerRegister);

passport.serializeUser((user, cb) => {
    cb(null, user);
});
  
passport.deserializeUser((user, cb) => {
    cb(null, user);
});

const port = 3000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})